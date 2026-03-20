const express = require("express")
const router = express.Router()

const examController = require("../controllers/examController")
const authMiddleware = require("../middleware/authMiddleware")

router.get("/", authMiddleware, examController.getAllExams)
// Create exam (teacher)
router.post("/create", authMiddleware, examController.createExam)

// Add question to exam
router.post("/question", authMiddleware, examController.addQuestion)

// Get exam questions
router.get("/:id", authMiddleware, examController.getExamQuestions)

// Submit exam (student)
router.post("/submit", authMiddleware, examController.submitExam)

router.post("/start/:id", authMiddleware, examController.startExam)

router.post("/add-questions", authMiddleware, examController.addQuestions)


module.exports = router