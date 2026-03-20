const pool = require("./config/db");

async function testInsert() {
  try {
    await pool.query(
      "INSERT INTO questions (exam_id, question_text) VALUES ($1,$2)",
      [111, "FINAL TEST QUESTION"]
    );
    console.log("INSERT WORKED ✅");
  } catch (err) {
    console.error("INSERT ERROR ❌", err);
  }
}

testInsert();