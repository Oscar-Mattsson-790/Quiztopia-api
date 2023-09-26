const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const middy = require("@middy/core");

async function getAllQuizzes() {
  const params = {
    TableName: "Quizzes",
  };

  const result = await db.scan(params).promise();
  return result.Items;
}

const handler = middy(async (event) => {
  try {
    const quizzes = await getAllQuizzes();
    return sendResponse(200, { quizzes });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
});

module.exports = { handler };
