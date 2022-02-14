const express = require("express");
const { model, Schema, connect } = require("mongoose");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cors = require("cors");

const app = express();

const User = model(
  "User",
  new Schema({
    email: String,
    password: String,
  })
);

const Reciepie = model(
  "Reciepie",
  new Schema({
    title: String,
    body: String,
    user: {
      type: Schema.Types.ObjectId,
      ref: "User",
    },
    date: {
      type: Date,
      default: Date.now,
    },
  })
);

app.use(cors());
app.use(express.json());

app.post("/register", async (req, res) => {
  const { email, password } = req.body;
  const hashedPassword = await bcrypt.hash(password, 10);
  const user = new User({ email, password: hashedPassword });
  await user.save();
  jwt.sign({ userId: user._id }, "secretKey", (err, token) => {
    if (err) res.status(500).send(err);
    res.json({ token });
  });
});

app.post("/login", async (req, res) => {
  const { email, password } = req.body;
  const user = await User.findOne({ email });
  if (!user) return res.status(401).send("No user found");
  const isMatch = await bcrypt.compare(password, user.password);
  if (!isMatch) return res.status(401).send("Wrong password");
  jwt.sign({ userId: user._id }, "secretKey", (err, token) => {
    if (err) res.status(500).send(err);
    res.json({ token });
  });
});

const authMiddleware = (req, res, next) => {
  const token = req.header("Authorization");
  if (!token) return res.status(401).send("Access denied");
  try {
    jwt.verify(token, "secretKey", (err, decoded) => {
      if (err) return res.status(401).send("Invalid token");
      req.user = decoded;
      next();
    });
  } catch (err) {
    return res.status(400).send("Invalid token");
  }
};

app.get("/recipie", authMiddleware, async (req, res) => {
  const recipie = await Reciepie.find({ user: req.user.userId });
  res.json(recipie);
});

app.post("/recipie", authMiddleware, async (req, res) => {
  const { title, body } = req.body;
  const recipie = new Reciepie({ title, body, user: req.user.userId });
  await recipie.save();
  res.json(recipie);
});

app.delete("/recipie/:id", authMiddleware, async (req, res) => {
  const { id } = req.params;
  await Reciepie.findByIdAndDelete(id);
  res.json({ success: true });
});

connect(process.env.DB, { useNewUrlParser: true }).then(() => {
  app.listen(5000, () => console.log("Server started"));
});
