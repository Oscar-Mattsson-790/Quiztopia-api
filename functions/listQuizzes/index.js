const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

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

exports.handler = async (event) => {
  try {
    const userId = event.requestContext.authorizer.userId;

    const quizzes = await getAllQuizzes(userId);
    return sendResponse(200, { quizzes });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
};
