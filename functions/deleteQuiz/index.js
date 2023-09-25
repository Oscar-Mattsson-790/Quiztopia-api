const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");

async function deleteQuizById(quizId, userId) {
  const quiz = await db
    .get({
      TableName: "Quizzes",
      Key: { quizId },
    })
    .promise();

  if (quiz.Item.userId !== userId) {
    throw new Error("Unauthorized");
  }

  const params = {
    TableName: "Quizzes",
    Key: { quizId },
  };

  await db.delete(params).promise();
}

const handler = middy(async (event) => {
  try {
    const quizId = event.pathParameters.quizId;
    const userId = event.requestContext.authorizer.userId;

    await deleteQuizById(quizId, userId);
    return sendResponse(200, { message: "Quiz deleted successfully" });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
}).use(validateToken);

module.exports = { handler };
