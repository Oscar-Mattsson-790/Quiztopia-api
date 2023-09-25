const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

async function getQuizQuestions(quizId) {
  const params = {
    TableName: "Quizzes",
    Key: { quizId },
  };

  const result = await db.get(params).promise();
  return result.Item.questions;
}

exports.handler = async (event) => {
  try {
    const quizId = event.pathParameters.quizId;

    const questions = await getQuizQuestions(quizId);
    return sendResponse(200, { questions });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
};
