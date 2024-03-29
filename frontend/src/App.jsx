import React, { useEffect, useState } from "react";
import "./App.css";
import FileUpload from "./FileUpload/FileUpload.jsx";
import LoginPage from "./LoginForm/LoginForm.jsx";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { auth } from "./Firebase.js";

function App() {
  const [userName, setUserName] = useState("");

  useEffect(() => {
    auth.onAuthStateChanged((user) => {
      if(user){
        setUserName(user.displayName)
      }
      else setUserName("")
    });
  }, []);

  return (
    <div className="container">
      <Router>
        <Routes>
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<FileUpload name={userName}/>} />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
