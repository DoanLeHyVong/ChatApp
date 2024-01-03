const { addMessage, getMessages } = require("../controllers/messageController");
const router = require("express").Router();
const { upload, addFile } = require("../controllers/fileController");

router.post("/addfile/", upload.single("file"), addFile);
router.post("/addmsg/", addMessage);
router.post("/getmsg/", getMessages);
router.post("/getmsg/", getMessages);

module.exports = router;
