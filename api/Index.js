//Index.js

const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const Post = require("./models/Post");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const cookieParser = require("cookie-parser");
const multer = require("multer");
const uploadMiddleware = multer({ dest: "uploads/" });
const fs = require("fs");
const path = require("path"); 

const app = express();
const saltRounds = 10;
const secret = "assf45yr5u76ff";
const tokenExpiration = "1h"; 

app.use(cors({ credentials: true, origin: "http://localhost:3000" }));
app.use(express.json());
app.use(cookieParser());
app.use("/uploads", express.static(__dirname + "/uploads"));

mongoose.connect(
  "mongodb+srv://blog:zqg77lHmZ72UH02n@cluster0.r77gzmc.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0",
  { useNewUrlParser: true, useUnifiedTopology: true }
);

app.get("/", (req, res) => {
  res.send("Welcome to the API");
});

app.post("/register", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, saltRounds);
    const userDoc = await User.create({ username, password: hashedPassword });
    res.json(userDoc);
  } catch (e) {
    res.status(400).json({ error: "User registration failed", details: e });
  }
});

app.post("/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const userDoc = await User.findOne({ username });
    if (!userDoc) {
      return res.status(400).json({ error: "Wrong credentials" });
    }
    const passOk = await bcrypt.compare(password, userDoc.password);
    if (passOk) {
      jwt.sign(
        { username, id: userDoc._id },
        secret,
        { expiresIn: tokenExpiration },
        (err, token) => {
          if (err) {
            return res.status(500).json({ error: "Token generation failed" });
          }
          res
            .cookie("token", token, { httpOnly: true })
            .json({ id: userDoc._id, username });
        }
      );
    } else {
      res.status(400).json({ error: "Wrong credentials" });
    }
  } catch (e) {
    res.status(500).json({ error: "Internal server error" });
  }
});

app.get("/profile", (req, res) => {
  const { token } = req.cookies;
  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }
  jwt.verify(token, secret, (err, userInfo) => {
    if (err) {
      return res.status(401).json({ error: "Invalid token" });
    }
    res.json(userInfo);
  });
});

app.post("/logout", (req, res) => {
  res.cookie("token", "", { httpOnly: true }).json("ok");
});

app.post("/post", uploadMiddleware.single("file"), async (req, res) => {
  try {
    const { originalname, path } = req.file;
    const parts = originalname.split(".");
    const ext = parts[parts.length - 1];
    const newPath = path.join(__dirname, "/uploads", path + "." + ext); // Corrected path creation
    fs.renameSync(path, newPath);

    const { token } = req.cookies;
    jwt.verify(token, secret, {}, async (err, info) => {
      if (err) throw err;
      const { title, summary, content } = req.body;
      const postDoc = await Post.create({
        title,
        summary,
        content,
        cover: newPath,
        author: info.id,
      });
      res.json(postDoc);
    });
  } catch (e) {
    res.status(400).json({ error: "Post creation failed", details: e });
  }
});
app.get("/post", async (req, res) => {
  try {
    const posts = await Post.find()
      .populate("author", "username") 
      .sort({ createdAt: -1 })
      .limit(20);
    res.json(posts);
  } catch (error) {
    res.status(500).json({ error: "Internal server error", details: error });
  }
});

app.get("/post/:id", async (req, res) => {
  const { id } = req.params;
  const postDoc = Post.findById(id).populate('author', ['username']);
  res.json(postDoc);
})

app.listen(4000, () => {
  console.log("Server running on http://localhost:4000");
});
