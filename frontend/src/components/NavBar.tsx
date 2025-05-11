import React, { useState, useEffect } from "react";
import { signIn, signUp, signOut, getCurrentUser } from "../lib/authService";

export const NavBar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [showLogin, setShowLogin] = useState(false);
  const [showRegister, setShowRegister] = useState(false);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    getCurrentUser().then(setUser);
  }, []);

  const handleLogin = async () => {
    const res = await signIn(email, password);
    if (res.error) return setError(res.error);
    setShowLogin(false);
    setUser(await getCurrentUser());
  };

  const handleRegister = async () => {
    const res = await signUp(email, password);
    if (res.error) return setError(res.error);
    setShowRegister(false);
    setUser(await getCurrentUser());
  };

  const handleLogout = async () => {
    await signOut();
    setUser(null);
  };

  return (
    <nav className="navbar navbar-light bg-white shadow-sm px-4">
      <div
        className="d-flex justify-content-between align-items-center w-100"
        style={{ paddingLeft: "4px", paddingRight: "8px" }}
      >
        <button
          className="navbar-toggler border-0"
          type="button"
          style={{ marginLeft: "0", paddingLeft: "2px" }}
          onClick={() => setMenuOpen(!menuOpen)}
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <h4 className="mx-auto mb-0 text-nowrap">🌸 Shrine Fortune</h4>

        <div style={{ width: "40px" }}></div>
      </div>

      {menuOpen && (
        <div
          className="dropdown-menu show position-absolute"
          style={{
            top: "60px",
            left: "16px",
            minWidth: "160px",
            padding: "8px 0",
            borderRadius: "8px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            border: "1px solid #ddd",
            zIndex: 1000,
            backgroundColor: "white",
          }}
        >
          {!user ? (
            <>
              <button
                className="dropdown-item px-4 py-2"
                onClick={() => setShowLogin(true)}
              >
                Login
              </button>
              <button
                className="dropdown-item px-4 py-2"
                onClick={() => setShowRegister(true)}
              >
                Register
              </button>
            </>
          ) : (
            <>
              <span className="dropdown-item text-muted">Hi, {user.email}</span>
              <button
                className="dropdown-item px-4 py-2 text-danger"
                onClick={handleLogout}
              >
                Logout
              </button>
            </>
          )}
        </div>
      )}

      {(showLogin || showRegister) && (
        <div
          className="position-absolute top-0 start-50 translate-middle-x bg-white p-4 shadow border rounded mt-5"
          style={{ zIndex: 1050, minWidth: "300px" }}
        >
          <h5 className="mb-3">{showLogin ? "Login" : "Register"}</h5>
          <input
            className="form-control mb-2"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            className="form-control mb-2"
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && <div className="text-danger small mb-2">{error}</div>}
          <div className="d-flex justify-content-between">
            <button
              className="btn btn-secondary"
              onClick={() => {
                setShowLogin(false);
                setShowRegister(false);
                setError("");
              }}
            >
              Cancel
            </button>
            <button
              className="btn btn-primary"
              onClick={showLogin ? handleLogin : handleRegister}
            >
              Submit
            </button>
          </div>
        </div>
      )}
    </nav>
  );
};
