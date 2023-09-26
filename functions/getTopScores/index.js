const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");

async function getQuizTopScores(quizId) {
  const params = {
    TableName: "QuizLeaderboard",
    IndexName: "QuizPointsIndex",
    KeyConditionExpression: "quizId = :quizId",
    ExpressionAttributeValues: {
      ":quizId": quizId,
    },
    ScanIndexForward: false,
    Limit: 10,
  };

  const result = await db.query(params).promise();
  return result.Items;
}

const handler = middy(async (event) => {
  try {
    const quizId = event.pathParameters.quizId;
    const topScores = await getQuizTopScores(quizId);
    return sendResponse(200, { topScores });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
}).use(validateToken);

module.exports = { handler };
