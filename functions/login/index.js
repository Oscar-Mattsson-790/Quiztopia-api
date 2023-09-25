const { sendResponse, sendError } = require("../../responses/index");
const { db } = require("../../services/db");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const middy = require("@middy/core");

async function getUserByEmail(email) {
  const result = await db
    .query({
      TableName: "QuizUsers",
      IndexName: "EmailIndex",
      KeyConditionExpression: "email = :email",
      ExpressionAttributeValues: { ":email": email },
    })
    .promise();
  return result.Items[0];
}

const handler = middy(async (event) => {
  try {
    const { email, password } = JSON.parse(event.body);

    const user = await getUserByEmail(email);
    if (!user) {
      return sendError(404, "User not found");
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return sendError(401, "Invalid password");
    }

    const token = jwt.sign({ id: user.userId }, process.env.JWT_SECRET);
    return sendResponse(200, { token });
  } catch (error) {
    return sendError(500, error.message);
  }
});

module.exports = { handler };
