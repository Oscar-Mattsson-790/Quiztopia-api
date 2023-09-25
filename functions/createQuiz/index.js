const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const { v4: uuidv4 } = require("uuid");
const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");

async function createQuiz(quizName, userId) {
  const newQuiz = {
    quizId: uuidv4(),
    quizName,
    userId,
    questions: [],
  };

  const params = {
    TableName: "Quizzes",
    Item: newQuiz,
  };

  await db.put(params).promise();
  return newQuiz;
}

const handler = middy(async (event) => {
  try {
    const { quizName } = JSON.parse(event.body);
    const userId = event.requestContext.authorizer.userId;

    if (!quizName) {
      return sendResponse(400, { message: "Quiz name must be provided" });
    }

    const quiz = await createQuiz(quizName, userId);
    return sendResponse(200, { quiz });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
}).use(validateToken);

module.exports = { handler };
