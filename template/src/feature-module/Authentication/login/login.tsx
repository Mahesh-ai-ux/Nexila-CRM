import { useNavigate } from "react-router";
import ImageWithBasePath from "../../../components/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";
import { useState } from "react";
import { loginUser } from "../../../api/auth"; // ✅ import backend login

type PasswordField = "password" | "confirmPassword";

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await loginUser(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setError("");
      navigate(all_routes.leadsList); // ✅ redirect on success
    } else {
      setError(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="overflow-hidden p-3 acc-vh">
      <div className="row vh-100 w-100 g-0">
        <div className="col-lg-6 vh-100 overflow-y-auto overflow-x-hidden">
          <div className="row">
            <div className="col-md-10 mx-auto">
              {/* ✅ added onSubmit */}
              <form
                onSubmit={handleLogin}
                className="vh-100 d-flex justify-content-between flex-column p-4 pb-0"
              >
                <div className="text-center mb-4 auth-logo">
                  <ImageWithBasePath
                    src="assets/img/logo.svg"
                    className="img-fluid"
                    alt="Logo"
                  />
                </div>
                <div>
                  <div className="mb-3">
                    <h3 className="mb-2">Sign In</h3>
                    <p className="mb-0">
                      Access the CRMS panel using your email and passcode.
                    </p>
                  </div>

                  {/* ✅ email field */}
                  <div className="mb-3">
                    <label className="form-label">Email Address</label>
                    <div className="input-group input-group-flat">
                      <input
                        type="email"
                        className="form-control"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                        required
                      />
                      <span className="input-group-text">
                        <i className="ti ti-mail" />
                      </span>
                    </div>
                  </div>

                  {/* ✅ password field */}
                  <div className="mb-3">
                    <label className="form-label">Password</label>
                    <div className="input-group input-group-flat pass-group">
                      <input
                        type={passwordVisibility.password ? "text" : "password"}
                        className="form-control pass-input"
                        placeholder="****************"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                      />
                      <span
                        className={`ti toggle-password input-group-text ${
                          passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                        }`}
                        onClick={() => togglePasswordVisibility("password")}
                      ></span>
                    </div>
                  </div>

                  {/* ✅ show error */}
                  {error && (
                    <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
                  )}

                  <div className="d-flex align-items-center justify-content-between mb-3">
                    {/* <div className="form-check form-check-md d-flex align-items-center">
                      <input
                        className="form-check-input mt-0"
                        type="checkbox"
                        id="checkebox-md"
                        defaultChecked
                      />
                      <label
                        className="form-check-label text-dark ms-1"
                        htmlFor="checkebox-md"
                      >
                        Remember Me
                      </label>
                    </div> */}
                    {/* <div className="text-end">
                      <Link
                        to={all_routes.forgotPassword}
                        className="link-danger fw-medium link-hover"
                      >
                        Forgot Password?
                      </Link>
                    </div> */}
                  </div>

                  {/* ✅ submit button */}
                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary w-100">
                      Sign In
                    </button>
                  </div>

                  {/* <div className="mb-3">
                    <p className="mb-0">
                      New on our platform?
                      <Link
                        to={all_routes.register}
                        className="link-indigo fw-bold link-hover"
                      >
                        {" "}
                        Create an account
                      </Link>
                    </p>
                  </div> */}
{/* 
                  <div className="or-login text-center position-relative mb-3">
                    <h6 className="fs-14 mb-0 position-relative text-body">
                      OR
                    </h6>
                  </div> */}

                  {/* social login (optional) */}
                  {/* <div className="d-flex align-items-center justify-content-center flex-wrap gap-2 mb-3">
                    <div className="text-center flex-fill">
                      <Link to="#" className="p-2 btn btn-info">
                        <ImageWithBasePath
                          className="img-fluid m-1"
                          src="assets/img/icons/facebook-logo.svg"
                          alt="Facebook"
                        />
                      </Link>
                    </div>
                    <div className="text-center flex-fill">
                      <Link to="#" className="p-2 btn btn-outline-light">
                        <ImageWithBasePath
                          className="img-fluid  m-1"
                          src="assets/img/icons/google-logo.svg"
                          alt="Google"
                        />
                      </Link>
                    </div>
                    <div className="text-center flex-fill">
                      <Link to="#" className="p-2 btn btn-dark">
                        <ImageWithBasePath
                          className="img-fluid  m-1"
                          src="assets/img/icons/apple-logo.svg"
                          alt="Apple"
                        />
                      </Link>
                    </div>
                  </div> */}
                </div>

                <div className="text-center pb-4">
                  <p className="text-dark mb-0">Copyright © 2025 - CRMS</p>
                </div>
              </form>
            </div>
          </div>
        </div>
        <div className="col-lg-6 account-bg-01" />
      </div>
    </div>
  );
};

export default Login;
