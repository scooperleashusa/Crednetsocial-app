import React from "react";
import { Routes, Route } from "react-router-dom";
import Header from "./layout/Header";
import Navigation from "./layout/Navigation";
import Footer from "./layout/Footer";

import Home from "./pages/Home";
import CredAI from "./pages/CredAI";
import GameRoom from "./pages/GameRoom";
import Profile from "./pages/Profile";
import Signals from "./pages/Signals";
import NotFound from "./pages/NotFound";

const App = () => {
  return (
      <div className="app-shell">
            <Header />
                  <Navigation />
                        <main className="app-main">
                                <Routes>
                                          <Route path="/" element={<Home />} />
                                                    <Route path="/cred-ai" element={<CredAI />} />
                                                              <Route path="/game-room" element={<GameRoom />} />
                                                                        <Route path="/profile" element={<Profile />} />
                                                                                  <Route path="/signals" element={<Signals />} />
                                                                                            <Route path="*" element={<NotFound />} />
                                                                                                    </Routes>
                                                                                                          </main>
                                                                                                                <Footer />
                                                                                                                    </div>
                                                                                                                      );
                                                                                                                      };

                                                                                                                      export default App;