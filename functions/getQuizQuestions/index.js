const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");

async function getQuizQuestions(quizId, userId) {
  const params = {
    TableName: "Quizzes",
    Key: { quizId },
  };

  const result = await db.get(params).promise();

  if (result.Item.userId !== userId) {
    throw new Error("Unauthorized");
  }

  return result.Item.questions;
}

const handler = middy(async (event) => {
  try {
    const quizId = event.pathParameters.quizId;
    const userId = event.userId;

    const questions = await getQuizQuestions(quizId, userId);
    return sendResponse(200, { questions });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
}).use(validateToken);

module.exports = { handler };
