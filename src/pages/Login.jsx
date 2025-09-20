
// import { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import "../styles/login.css";

// export default function Login({ onLoginSuccess }) {
//   const [username, setUsername] = useState("");
//   const [password, setPassword] = useState("");
//   const [showPwd, setShowPwd] = useState(false);
//   const [error, setError] = useState("");
//   const navigate = useNavigate();   

// const handleSubmit = async (e) => {
//   e.preventDefault();
//   setError("");

//   try {
//     const res = await fetch("http://localhost:3000/api/login", {
//       method: "POST",
//       headers: { "Content-Type": "application/json" },
//       body: JSON.stringify({ 
//         user: username,
//         password: password 
//       }),
//     });

//     if (!res.ok) {
//       if (res.status === 401) {
//         setError("User or password incorrect");
//       } else if (res.status === 403) {
//         setError("⚠️ Account suspended");
//       } else {
//         const errData = await res.json();
//         setError(errData.message || "User or password incorrect");
//       }
//       return;
//     }

//     const data = await res.json();
//     localStorage.setItem("auth_token", data.token);

//     onLoginSuccess();
//     navigate("/dashboard"); 

//   } catch (err) {
//     console.error("Login error:", err);
//     setError("Server error, please try again later.");
//   }
// };


//   return (
//     <div className="container">
//       <div className="login-box">
//         <h1>
//           CHEMICAL INVENTORY
//           <br /> MANAGEMENT SYSTEM
//         </h1>

//         <form onSubmit={handleSubmit}>
//           <input
//             type="text"
//             placeholder="Phone or Email"
//             value={username}
//             onChange={(e) => setUsername(e.target.value)}
//           />

//           <div className="password-box">
//             <input
//               type={showPwd ? "text" : "password"}
//               placeholder="Password"
//               value={password}
//               onChange={(e) => setPassword(e.target.value)}
//             />
//             <span className="toggle" onClick={() => setShowPwd((v) => !v)} />
//           </div>

//           {error && <p className="error">{error}</p>}

//           <button type="submit">LOG IN</button>
//         </form>

//         <p className="forgot">forgot?</p>
//       </div>
//     </div>
//   );
// }

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/login.css";

export default function Login({ onLoginSuccess }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPwd, setShowPwd] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const res = await fetch("http://localhost:3000/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ user: username, password }),
      });

      if (!res.ok) {
        const errData = await res.json();
        setError(errData.error || "User or password incorrect");
        return;
      }

      const data = await res.json();

      // ✅ เก็บข้อมูลลง localStorage
      localStorage.setItem("auth_token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      localStorage.setItem("permissions", JSON.stringify(data.permissions || []));

      onLoginSuccess();
      navigate("/dashboard");
    } catch (err) {
      console.error("Login error:", err);
      setError("Server error, please try again later.");
    }
  };

  return (
    <div className="container">
      <div className="login-box">
        <h1>
          CHEMICAL INVENTORY
          <br /> MANAGEMENT SYSTEM
        </h1>

        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Phone or Email"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
          />

          <div className="password-box">
            <input
              type={showPwd ? "text" : "password"}
              placeholder="Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <span className="toggle" onClick={() => setShowPwd((v) => !v)} />
          </div>

          {error && <p className="error">{error}</p>}

          <button type="submit">LOG IN</button>
        </form>

        <p className="forgot">forgot?</p>
      </div>
    </div>
  );
}
