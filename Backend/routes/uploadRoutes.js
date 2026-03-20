const router = require("express").Router()
const upload = require("../middleware/uploadMiddleware")
const uploadController = require("../controllers/uploadController")
const authMiddleware = require("../middleware/authMiddleware")

router.post(
 "/paper",
 authMiddleware,
 upload.single("paper"),
 uploadController.uploadPDF
)

module.exports = router