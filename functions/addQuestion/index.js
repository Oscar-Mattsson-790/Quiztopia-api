const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");

async function addQuestionToQuiz(quizId, question, answer, coordinates) {
  const params = {
    TableName: "Quizzes",
    Key: { quizId },
    UpdateExpression: "SET questions = list_append(questions, :newQuestion)",
    ExpressionAttributeValues: {
      ":newQuestion": [
        {
          question,
          answer,
          coordinates,
        },
      ],
    },
  };

  await db.update(params).promise();
}

exports.handler = async (event) => {
  try {
    const { question, answer, coordinates } = JSON.parse(event.body);
    const quizId = event.pathParameters.quizId;

    if (!question || !answer || !coordinates) {
      return sendResponse(400, {
        message: "All required fields must be provided",
      });
    }

    await addQuestionToQuiz(quizId, question, answer, coordinates);
    return sendResponse(200, { message: "Question added successfully" });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
};
