const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const middy = require("@middy/core");
const { validateToken } = require("../../middleware/auth");

async function addQuestionToQuiz(
  quizId,
  userId,
  question,
  answer,
  coordinates
) {
  const params = {
    TableName: "Quizzes",
    Key: { quizId },
    UpdateExpression: "SET questions = list_append(questions, :newQuestion)",
    ConditionExpression: "userId = :userId",
    ExpressionAttributeValues: {
      ":userId": userId,
      ":newQuestion": [{ question, answer, coordinates }],
    },
  };

  await db.update(params).promise();
}

const handler = middy()
  .use(validateToken)
  .handler(async (event) => {
    try {
      const { question, answer, coordinates } = JSON.parse(event.body);
      const quizId = event.pathParameters.quizId;
      const userId = event.requestContext.authorizer.userId;

      if (!question || !answer || !coordinates) {
        return sendResponse(400, {
          message: "All required fields must be provided",
        });
      }

      await addQuestionToQuiz(quizId, userId, question, answer, coordinates);
      return sendResponse(200, { message: "Question added successfully" });
    } catch (error) {
      console.log(error);
      return sendError(500, error.message);
    }
  });

module.exports = { handler };
