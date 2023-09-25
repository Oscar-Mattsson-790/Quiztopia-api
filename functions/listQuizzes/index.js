const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");

async function getAllQuizzes(userId) {
  const params = {
    TableName: "Quizzes",
    FilterExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
    },
  };

  const result = await db.scan(params).promise();
  return result.Items;
}

const handler = middy(async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;

    const quizzes = await getAllQuizzes(userId);
    return sendResponse(200, { quizzes });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
}).use(validateToken);

module.exports = { handler };
