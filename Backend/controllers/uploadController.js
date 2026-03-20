const pool = require("../config/db");
const extractText = require("../services/pdfParser");

// 🔥 Parse MCQs from PDF text
const parseQuestions = (text) => {

  // Split by question numbers (1. 2. 3. etc.)
  const rawQuestions = text.split(/\d+\./);

  const parsed = [];

  for (let q of rawQuestions) {

    if (!q || q.trim().length < 20) continue;

    // Split options (a), b), c), d))
    const parts = q.split(/a\)|b\)|c\)|d\)/i);

    if (parts.length < 5) continue;

    parsed.push({
      question_text: parts[0].trim(),
      option_a: parts[1].trim(),
      option_b: parts[2].trim(),
      option_c: parts[3].trim(),
      option_d: parts[4].trim(),
    });

  }

  return parsed;
};

// ✅ MAIN CONTROLLER
exports.uploadPDF = async (req, res) => {

  try {

    const { title, subject, duration } = req.body;
    const teacherId = req.user.id;

    // ✅ Create exam
    const exam = await pool.query(
      `INSERT INTO exams (title, subject, duration, created_by)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [title, subject, duration, teacherId]
    );

    const examId = exam.rows[0].id;

    // ✅ Extract text from PDF
    const text = await extractText(req.file.path);

    console.log("RAW TEXT:", text.substring(0, 500)); // debug

    // ✅ Parse MCQs
    const questions = parseQuestions(text);

    console.log("PARSED QUESTIONS:", questions);

    // ✅ Send to frontend (DO NOT SAVE YET)
    res.json({
      examId,
      questions
    });

  } catch (err) {

    console.error("UPLOAD ERROR:", err);

    res.status(500).json({
      message: "Upload failed"
    });

  }

};