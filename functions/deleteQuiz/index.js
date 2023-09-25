const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

async function deleteQuizById(quizId) {
  const params = {
    TableName: "Quizzes",
    Key: { quizId },
  };

  await db.delete(params).promise();
}

exports.handler = async (event) => {
  try {
    const quizId = event.pathParameters.quizId;

    await deleteQuizById(quizId);
    return sendResponse(200, { message: "Quiz deleted successfully" });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
};
