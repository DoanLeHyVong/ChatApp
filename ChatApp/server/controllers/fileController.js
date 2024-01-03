const Messages = require("../models/messageModel");
const multer = require("multer");
const path = require("path");

const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, "../uploads"));
  },
  filename: function (req, file, cb) {
    cb(null, Date.now() + path.extname(file.originalname));
  },
});

const upload = multer({ storage: storage });

const addFile = async (req, res) => {
  try {
    const { sender, users } = req.body;
    const file = req.file;

    if (!file) {
      return res.status(400).json({ msg: "No file uploaded." });
    }

    // Create a new message document with file information
    const newMessage = await Messages.create({
      message: {
        file: {
          filename: file.filename,
          path: file.path,
        },
      },
      users: users,
      sender: sender,
    });

    res
      .status(201)
      .json({ msg: "File uploaded and message created.", message: newMessage });
  } catch (error) {
    console.error(error);
    res.status(500).json({ msg: "Server error", error: error.message });
  }
};

module.exports = {
  upload,
  addFile,
};
