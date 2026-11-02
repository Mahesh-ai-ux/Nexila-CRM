// import { useNavigate } from "react-router";
// import ImageWithBasePath from "../../../components/imageWithBasePath";
// import { all_routes } from "../../../routes/all_routes";
// import { useState } from "react";
// import { loginUser } from "../../../api/auth"; // ✅ import backend login

// type PasswordField = "password" | "confirmPassword";

// const Login = () => {
//   const [passwordVisibility, setPasswordVisibility] = useState({
//     password: false,
//     confirmPassword: false,
//   });

//   const [email, setEmail] = useState("");
//   const [password, setPassword] = useState("");
//   const [error, setError] = useState("");
//   const navigate = useNavigate();

//   const togglePasswordVisibility = (field: PasswordField) => {
//     setPasswordVisibility((prevState) => ({
//       ...prevState,
//       [field]: !prevState[field],
//     }));
//   };

//   const handleLogin = async (e: React.FormEvent) => {
//     e.preventDefault();

//     const data = await loginUser(email, password);
//     if (data.token) {
//       localStorage.setItem("token", data.token);
//       setError("");
//       navigate(all_routes.leadsList); // ✅ redirect on success
//     } else {
//       setError(data.message || "Invalid credentials");
//     }
//   };

//   return (
//     <div className="overflow-hidden p-3 acc-vh">
//       <div className="row vh-100 w-100 g-0">
//         <div className="col-lg-6 vh-100 overflow-y-auto overflow-x-hidden">
//           <div className="row">
//             <div className="col-md-10 mx-auto">
//               {/* ✅ added onSubmit */}
//               <form
//                 onSubmit={handleLogin}
//                 className="vh-100 d-flex justify-content-between flex-column p-4 pb-0"
//               >
//                 <div className="text-center mb-4 auth-logo">
//                   <ImageWithBasePath
//                     src="assets/img/logo1.png"
//                     className="img-fluid"
//                     alt="Logo"
//                   />
//                 </div>
//                 <div>
//                   <div className="mb-3">
//                     <h3 className="mb-2">Sign In</h3>
//                     <p className="mb-0">
//                       Access the CRMS panel using your email and passcode.
//                     </p>
//                   </div>

//                   {/* ✅ email field */}
//                   <div className="mb-3">
//                     <label className="form-label">Email Address</label>
//                     <div className="input-group input-group-flat">
//                       <input
//                         type="email"
//                         className="form-control"
//                         value={email}
//                         onChange={(e) => setEmail(e.target.value)}
//                         required
//                       />
//                       <span className="input-group-text">
//                         <i className="ti ti-mail" />
//                       </span>
//                     </div>
//                   </div>

//                   {/* ✅ password field */}
//                   <div className="mb-3">
//                     <label className="form-label">Password</label>
//                     <div className="input-group input-group-flat pass-group">
//                       <input
//                         type={passwordVisibility.password ? "text" : "password"}
//                         className="form-control pass-input"
//                         placeholder="****************"
//                         value={password}
//                         onChange={(e) => setPassword(e.target.value)}
//                         required
//                       />
//                       <span
//                         className={`ti toggle-password input-group-text ${passwordVisibility.password ? "ti-eye" : "ti-eye-off"
//                           }`}
//                         onClick={() => togglePasswordVisibility("password")}
//                       ></span>
//                     </div>
//                   </div>

//                   {/* ✅ show error */}
//                   {error && (
//                     <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
//                   )}

//                   <div className="d-flex align-items-center justify-content-between mb-3">

//                   </div>

//                   {/* ✅ submit button */}
//                   <div className="mb-3">
//                     <button type="submit" className="btn btn-primary w-100">
//                       Sign In
//                     </button>
//                   </div>


//                 </div>

//                 <div className="text-center pb-4">
//                   <p className="text-dark mb-0">Copyright © 2025 - CRMS</p>
//                 </div>
//               </form>
//             </div>
//           </div>
//         </div>
//         <div className="col-lg-6 account-bg-01" />
//       </div>
//     </div>
//   );
// };

// export default Login;
import { useNavigate } from "react-router";
import ImageWithBasePath from "../../../components/imageWithBasePath";
import { all_routes } from "../../../routes/all_routes";
import { useState, useEffect } from "react"; // ✅ added useEffect
import { loginUser } from "../../../api/auth";

type PasswordField = "password" | "confirmPassword";

const Login = () => {
  const [passwordVisibility, setPasswordVisibility] = useState({
    password: false,
    confirmPassword: false,
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  // ✅ NEW: popup state
  const [showPopup, setShowPopup] = useState(false);

  const navigate = useNavigate();

  const togglePasswordVisibility = (field: PasswordField) => {
    setPasswordVisibility((prevState) => ({
      ...prevState,
      [field]: !prevState[field],
    }));
  };

  // ✅ NEW: show popup after 5 seconds
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowPopup(true);
    }, 5000);

    return () => clearTimeout(timer);
  }, []);

  // ✅ redirect to enquiry form
  const handleEnquiryRedirect = () => {
    navigate(all_routes.kanbanview);
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    const data = await loginUser(email, password);
    if (data.token) {
      localStorage.setItem("token", data.token);
      setError("");
      navigate(all_routes.leadsList);
    } else {
      setError(data.message || "Invalid credentials");
    }
  };

  return (
    <div className="overflow-hidden p-3 acc-vh">
      <div className="row vh-100 w-100 g-0">

        {/* LEFT SIDE (LOGIN FORM) */}
        <div className="col-lg-6 vh-100 overflow-y-auto overflow-x-hidden">
          <div className="row">
            <div className="col-md-10 mx-auto">
              <form
                onSubmit={handleLogin}
                className="vh-100 d-flex justify-content-between flex-column p-4 pb-0"
              >
                <div className="text-center mb-4 auth-logo">
                  <ImageWithBasePath
                    src="assets/img/logo1.png"
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

                  {/* Email */}
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

                  {/* Password */}
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
                        className={`ti toggle-password input-group-text ${passwordVisibility.password ? "ti-eye" : "ti-eye-off"
                          }`}
                        onClick={() => togglePasswordVisibility("password")}
                      ></span>
                    </div>
                  </div>

                  {/* Error */}
                  {error && (
                    <p style={{ color: "red", fontSize: "14px" }}>{error}</p>
                  )}

                  {/* Button */}
                  <div className="mb-3">
                    <button type="submit" className="btn btn-primary w-100">
                      Sign In
                    </button>
                  </div>
                </div>

                <div className="text-center pb-4">
                  <p className="text-dark mb-0">
                    Copyright © 2025 - CRMS
                  </p>
                </div>
              </form>
            </div>
          </div>
        </div>

        {/* RIGHT SIDE (IMAGE + POPUP) */}
        <div className="col-lg-6 account-bg-01 position-relative">

          {showPopup && (
            <div
              style={{
                position: "absolute",
                bottom: "40px",
                right: "40px",
                background: "#fff",
                padding: "20px",
                borderRadius: "10px",
                boxShadow: "0 5px 15px rgba(0,0,0,0.2)",
                maxWidth: "300px",
                animation: "fadeIn 0s ease-in-out",
              }}
            >
              <h5>🎯 Looking for Internship?</h5>
              <p style={{ fontSize: "14px" }}>
                Interested in internship? Fill the enquiry form now.
              </p>

              <button
                className="btn btn-primary btn-sm w-100"
                onClick={handleEnquiryRedirect}
              >
                Fill Enquiry Form
              </button>

              {/* <button
                className="btn btn-light btn-sm w-100 mt-2"
                onClick={() => setShowPopup(false)}
              >
                Close
              </button> */}
            </div>
          )}

        </div>

      </div>
    </div>
  );
};

export default Login;