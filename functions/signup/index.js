const { sendResponse, sendError } = require("../../responses");
const { db } = require("../../services/db");
const bcrypt = require("bcryptjs");
const { v4: uuidv4 } = require("uuid");

async function createUser(email, password, username) {
  const hashedPassword = await bcrypt.hash(password, 10);
  const newUser = {
    userId: uuidv4(),
    email,
    password: hashedPassword,
    username,
  };

  const params = {
    TableName: "Users",
    Item: newUser,
  };

  await db.put(params).promise();
  return newUser;
}

exports.handler = async (event) => {
  try {
    const { email, password, username } = JSON.parse(event.body);

    if (!email || !password || !username) {
      return sendResponse(400, {
        message: "All required fields must be provided",
      });
    }

    const user = await createUser(email, password, username);
    return sendResponse(200, { user });
  } catch (error) {
    console.log(error);
    return sendError(500, error.message);
  }
};
