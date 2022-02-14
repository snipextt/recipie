import "./App.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";

function Login() {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <h1>Login</h1>
    </div>
  );
}

function Register() {
  return <h1>Register</h1>;
}

function Reciepie() {
  return <h1>Reciepie</h1>;
}

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Reciepie />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
