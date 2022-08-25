const express = require('express');
const { sendMesseage, allMessages } = require('../controllers/messageController');
const { protect } = require('../middleware/authMiddleware')

const router = express.Router()

router.route("/").post(protect, sendMesseage)
router.route("/:chatId").get(protect, allMessages)

module.exports = router;