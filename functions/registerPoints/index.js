const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");

async function registerUserPoints(quizId, userId, points) {
  const params = {
    TableName: "QuizLeaderboard",
    Item: {
      quizId,
      userId,
      points,
    },
  };

  await db.put(params).promise();
}

const handler = middy(async (event) => {
  try {
    const { points } = JSON.parse(event.body);
    const quizId = event.pathParameters.quizId;
    const userId = event.requestContext.authorizer.userId;

    if (!points) {
      return sendResponse(400, { message: "Points must be provided" });
    }

    await registerUserPoints(quizId, userId, points);
    return sendResponse(200, { message: "Points registered successfully" });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
}).use(validateToken);

module.exports = { handler };
