import { Request, Response, NextFunction } from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

type User = {
  id: string;
  email: string;
  name?: string;
  passwordHash: string;
};

const users = new Map<string, User>(); // in-memory store for starter

function generateId() {
  return Math.random().toString(36).slice(2, 10);
}

export async function register(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password, name } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    // basic uniqueness check
    for (const u of users.values()) {
      if (u.email === email) return res.status(409).json({ message: 'email already registered' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    const id = generateId();
    const user: User = { id, email, name, passwordHash };
    users.set(id, user);

    // Do not return passwordHash in response
    return res.status(201).json({ id: user.id, email: user.email, name: user.name });
  } catch (err) {
    next(err);
  }
}

export async function login(req: Request, res: Response, next: NextFunction) {
  try {
    const { email, password } = req.body;
    if (!email || !password) return res.status(400).json({ message: 'email and password required' });

    const user = Array.from(users.values()).find(u => u.email === email);
    if (!user) return res.status(401).json({ message: 'invalid credentials' });

    const valid = await bcrypt.compare(password, user.passwordHash);
    if (!valid) return res.status(401).json({ message: 'invalid credentials' });

    const token = jwt.sign({ sub: user.id, email: user.email }, process.env.JWT_SECRET || 'dev', {
      expiresIn: '7d'
    });

    return res.json({ token, user: { id: user.id, email: user.email, name: user.name } });
  } catch (err) {
    next(err);
  }
}
