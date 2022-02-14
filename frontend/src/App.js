import "./App.css";
import { BrowserRouter, Routes, Route, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

axios.defaults.baseURL = "https://recipie-4b9ea.ondigitalocean.app";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await axios.post("/login", { email, password });
    if (res.status === 200) {
      toast.success("Login Successful");
      axios.defaults.headers.common["Authorization"] = `${res.data.token}`;
      sessionStorage.setItem("token", res.data.token);
      navigate("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#F5F5F5",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "330px",
          background: "#fff",
          padding: "20px",
        }}
      >
        <h3
          style={{
            marginBottom: "20px",
          }}
        >
          Login
        </h3>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type={"email"}
        />
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type={"password"}
        />
        <button
          onClick={(e) => {
            handleLogin();
          }}
        >
          Login
        </button>
      </div>
      <div
        style={{
          cursor: "pointer",
          marginTop: "20px",
        }}
        onClick={() => {
          navigate("/register");
        }}
      >
        Need an account? Register Here
      </div>
    </div>
  );
}

function Register() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleRegister = async () => {
    const res = await axios.post("/register", { email, password });
    if (res.status === 200) {
      toast.success("Login Successful");
      axios.defaults.headers.common["Authorization"] = `${res.data.token}`;
      sessionStorage.setItem("token", res.data.token);
      navigate("/");
    }
  };

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#F5F5F5",
        width: "100%",
        height: "100vh",
        justifyContent: "center",
      }}
    >
      <div
        style={{
          width: "330px",
          background: "#fff",
          padding: "20px",
        }}
      >
        <h3
          style={{
            marginBottom: "20px",
          }}
        >
          Register
        </h3>
        <label>Email</label>
        <input
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
          }}
          type={"email"}
        />
        <label>Password</label>
        <input
          value={password}
          onChange={(e) => {
            setPassword(e.target.value);
          }}
          type={"password"}
        />
        <button
          onClick={(e) => {
            handleRegister();
          }}
        >
          Register
        </button>
      </div>
    </div>
  );
}

function Reciepie() {
  const navigate = useNavigate();
  const [backdrop, setBackdrop] = useState(false);
  const [recipieName, setRecipieName] = useState("");
  const [recipieBody, setRecipieBody] = useState("");
  const [recipies, setRecipies] = useState([]);

  const getRecipies = async () => {
    const res = await axios.get("/recipie").catch((err) => {
      navigate("/login");
    });
    if (res?.status === 200) {
      setRecipies(res.data);
    } else {
      toast.error("Error fetching recipies");
    }
  };

  useEffect(() => {
    if (!sessionStorage.getItem("token")) {
      navigate("/login");
    }
    getRecipies();
  }, [navigate, getRecipies]);
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        background: "#F5F5F5",
        width: "100%",
        height: "100vh",
        justifyContent: "flex-start",
      }}
    >
      <h2>Your Recipes</h2>
      <button
        style={{
          width: "100px",
          marginLeft: "auto",
          marginRight: 40,
        }}
        onClick={() => {
          setBackdrop(true);
        }}
      >
        Add Reciepie
      </button>
      <div
        style={
          {
            //
          }
        }
      ></div>
      <div
        style={{
          display: "flex",
          flexWrap: "wrap",
        }}
      >
        {recipies.map((recipie) => (
          <div
            style={{
              background: "#fff",
              padding: "20px",
              margin: 6,
            }}
          >
            <h3>{recipie.title}</h3>
            <p>{recipie.body}</p>
            <span
              style={{
                marginLeft: "auto",
              }}
            >
              {recipie.date.split("T")[0]}
            </span>
            <button
              onClick={async () => {
                const res = await axios
                  .delete(`/recipie/${recipie._id}`)
                  .catch((err) => {
                    toast.error("Error deleting recipie");
                  });
                if (res?.status === 200) {
                  toast.success("Recipie deleted");
                  getRecipies();
                }
              }}
            >
              Delete
            </button>
          </div>
        ))}
      </div>
      <div
        style={{
          display: backdrop ? "flex" : "none",
          width: "100%",
          height: "100vh",
          position: "fixed",
          top: 0,
          left: 0,
          background: "rgba(0,0,0,0.5)",
          justifyContent: "center",
          alignItems: "center",
        }}
        onClick={() => {
          setBackdrop(false);
        }}
      >
        <div
          style={{
            width: "400px",
            background: "#fff",
            padding: "20px",
          }}
          onClick={(e) => e.stopPropagation()}
        >
          <h3>Add Recipie</h3>
          <label>Title</label>
          <input
            onChange={(e) => {
              setRecipieName(e.target.value);
            }}
          />
          <label>Body</label>

          <textarea
            rows={5}
            onChange={(e) => {
              setRecipieBody(e.target.value);
            }}
            style={{
              width: "100%",
            }}
          />
          <button
            onClick={async () => {
              await axios
                .post("/recipie", {
                  title: recipieName,
                  body: recipieBody,
                })
                .then(() => {
                  setBackdrop(false);
                  getRecipies();
                  toast.success("Recipie Added");
                })
                .catch((err) => {
                  toast.error("Error adding recipie");
                });
            }}
          >
            Add
          </button>
        </div>
      </div>
    </div>
  );
}

function App() {
  return (
    <>
      <div className="app">
        <BrowserRouter>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/" element={<Reciepie />} />
          </Routes>
        </BrowserRouter>
      </div>
      <ToastContainer />
    </>
  );
}

export default App;
