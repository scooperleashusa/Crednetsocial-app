import React from "react";
import { NavLink } from "react-router-dom";

const Navigation = () => (
  <nav className="app-nav">
      <NavLink to="/">Home</NavLink>
          <NavLink to="/cred-ai">Cred AI</NavLink>
              <NavLink to="/game-room">Game Room</NavLink>
                  <NavLink to="/profile">Profile</NavLink>
                      <NavLink to="/signals">Signals</NavLink>
                        </nav>
                        );

                        export default Navigation;