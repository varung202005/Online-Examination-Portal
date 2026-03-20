const pool = require("../config/db")
const cleanText = (text) => {
  if (!text) return "";

  return text
    .toString()
    .normalize("NFKD")                    // normalize unicode
    .replace(/[^\x00-\x7F]/g, "")         // remove non-ASCII
    .replace(/[\u{0080}-\u{FFFF}]/gu, "") // remove extended unicode
    .replace(/\s+/g, " ")                 // clean spaces
    .trim();
};
exports.createExam = async (req,res)=>{

 const {title,subject,duration} = req.body

 const exam = await pool.query(
  "INSERT INTO exams(title,subject,duration,created_by) VALUES($1,$2,$3,$4) RETURNING *",
  [title,subject,duration,req.user.id]
 )

 res.json(exam.rows[0])
}

exports.addQuestion = async (req,res)=>{

 const {exam_id,question_text,option_a,option_b,option_c,option_d,correct_option,marks} = req.body

 const question = await pool.query(
 `INSERT INTO questions
 (exam_id,question_text,option_a,option_b,option_c,option_d,correct_option,marks)
 VALUES($1,$2,$3,$4,$5,$6,$7,$8)
 RETURNING *`,
 [exam_id,question_text,option_a,option_b,option_c,option_d,correct_option,marks]
 )

 res.json(question.rows[0])
}

exports.getExamQuestions = async (req,res)=>{

 const examId = req.params.id

 const questions = await pool.query(
  "SELECT * FROM questions WHERE exam_id=$1 ORDER BY RANDOM()",
  [examId]
 )

 res.json(questions.rows)

}

exports.submitExam = async (req,res)=>{

 const {exam_id, answers} = req.body
 const studentId = req.user.id

 const attempt = await pool.query(
  "SELECT * FROM attempts WHERE student_id=$1 AND exam_id=$2",
  [studentId, exam_id]
 )

 if(attempt.rows.length === 0){
  return res.status(400).json({message:"Exam not started"})
 }

 const exam = await pool.query(
  "SELECT duration FROM exams WHERE id=$1",
  [exam_id]
 )

 const startTime = attempt.rows[0].start_time
 const duration = exam.rows[0].duration

 const now = new Date()
 const endTime = new Date(startTime)

 endTime.setMinutes(endTime.getMinutes() + duration)

 if(now > endTime){
  return res.status(400).json({
   message:"Exam time exceeded"
  })
 }

 let score = 0

 for(let ans of answers){

  const correct = await pool.query(
   "SELECT correct_option,marks FROM questions WHERE id=$1",
   [ans.question_id]
  )

  if(correct.rows[0].correct_option === ans.selected_option){
   score += correct.rows[0].marks
  }

 }

 await pool.query(
  "UPDATE attempts SET score=$1,end_time=NOW() WHERE student_id=$2 AND exam_id=$3",
  [score,studentId,exam_id]
 )

 res.json({
  message:"Exam submitted",
  score
 })

}
exports.startExam = async (req,res)=>{

 const studentId = req.user.id
 const examId = req.params.id

 const attemptCheck = await pool.query(
  "SELECT * FROM attempts WHERE student_id=$1 AND exam_id=$2",
  [studentId, examId]
 )

 if(attemptCheck.rows.length > 0){
  return res.status(400).json({
   message:"You have already attempted this exam"
  })
 }

 const attempt = await pool.query(
  "INSERT INTO attempts(student_id,exam_id,start_time) VALUES($1,$2,NOW()) RETURNING *",
  [studentId, examId]
 )

 res.json(attempt.rows[0])

}

exports.getAllExams = async (req, res) => {
  try {

    const userId = req.user.id;
    const role = req.user.role;
    console.log("REQ.USER:", req.user);

    let result;

    if (role === "teacher") {
      result = await pool.query(
        "SELECT * FROM exams"
      );
    } else {
      result = await pool.query("SELECT * FROM exams");
    }

    res.json(result.rows);

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Error fetching exams" });
  }
};
exports.getExamQuestions = async (req, res) => {
  try {

    const examId = req.params.id;

    // ✅ get exam details
    const exam = await pool.query(
      "SELECT * FROM exams WHERE id = $1",
      [examId]
    );

    // ✅ get questions
    const questions = await pool.query(
      "SELECT * FROM questions WHERE exam_id = $1",
      [examId]
    );

    res.json({
      exam: exam.rows[0],
      questions: questions.rows
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Failed to fetch exam" });
  }
};
exports.submitExam = async (req, res) => {
  try {

    const { exam_id, answers } = req.body;

    if (!exam_id || !answers) {
      return res.status(400).json({ message: "Invalid data" });
    }

    const result = await pool.query(
      "SELECT id, correct_option FROM questions WHERE exam_id = $1",
      [exam_id]
    );

    let score = 0;

    result.rows.forEach((q) => {

      const studentAnswer = answers[q.id];

      if (studentAnswer && studentAnswer === q.correct_option) {
        score++;
      }

    });

    res.json({
      message: "Exam submitted",
      score,
      total: result.rows.length
    });

  } catch (err) {

    console.error("Submit Exam Error:", err);

    res.status(500).json({
      message: "Error submitting exam"
    });

  }
};

exports.addQuestions = async (req, res) => {

  try {

    const { exam_id, questions } = req.body

    console.log("Saving questions for exam:", exam_id)
    console.log("Incoming data:", questions)

for (let q of questions) {

  const qt = cleanText(q.question_text);

  if (!qt || qt.length < 5) continue;

  await pool.query(
    `INSERT INTO questions
    (exam_id, question_text, option_a, option_b, option_c, option_d, correct_option)
    VALUES ($1,$2,$3,$4,$5,$6,$7)`,
    [
      exam_id,
      qt,
      cleanText(q.option_a),
      cleanText(q.option_b),
      cleanText(q.option_c),
      cleanText(q.option_d),
      q.correct_option
    ]
  );
}
    res.json({
      message: "Questions saved successfully"
    })

  } catch (err) {

    console.error("DB ERROR:", err)

    res.status(500).json({
      message: "Error saving questions"
    })

  }

}