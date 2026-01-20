// augment express Request if needed later (example placeholder)
declare namespace Express {
  export interface Request {
    user?: { id: string; email: string };
  }
}
