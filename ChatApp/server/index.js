const express = require("express");
const cors = require("cors");
const multer = require("multer");
const path = require("path");
const mongoose = require("mongoose");
const authRoutes = require("./routes/auth");
const messageRoutes = require("./routes/messages");
const app = express();
const socket = require("socket.io");
require("dotenv").config();

app.use(cors());
app.use(express.json());

mongoose
  .connect(process.env.MONGO_URL, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => {
    console.log("DB Connetion Successfull");
  })
  .catch((err) => {
    console.log(err.message);
  });

app.use("/api/auth", authRoutes);
app.use("/api/messages", messageRoutes);

const server = app.listen(process.env.PORT, () =>
  console.log(`Server started on ${process.env.PORT}`)
);
const io = socket(server, {
  cors: {
    origin: "http://localhost:3000",
    credentials: true,
  },
});

global.onlineUsers = new Map();
io.on("connection", (socket) => {
  global.chatSocket = socket;
  socket.on("add-user", (userId) => {
    onlineUsers.set(userId, socket.id);
  });

  socket.on("send-msg", (data) => {
    const sendUserSocket = onlineUsers.get(data.to);
    if (sendUserSocket) {
      socket.to(sendUserSocket).emit("msg-recieve", data.msg);
    }
  });
});
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, "addfile/"); // make sure this folder exists
  },
  filename: function (req, file, cb) {
    cb(
      null,
      file.fieldname + "-" + Date.now() + getExtension(file.originalname)
    );
  },
});

const upload = multer({ storage: storage });

function getExtension(filename) {
  var parts = filename.split(".");
  return parts[parts.length - 1];
}

// Single file upload route
app.post("/addfile", upload.single("file"), function (req, res) {
  // req.file is the file
  // req.body will hold the text fields if any
  if (!req.file) {
    return res.status(400).send("No files were uploaded.");
  }

  res.send("File uploaded!");
});

// Make sure you are handling errors
app.use(function (err, req, res, next) {
  res.status(err.status || 500).send(err.message);
});
