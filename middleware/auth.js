const { sendError } = require("../responses");
const jwt = require("jsonwebtoken");

const validateToken = {
  before: async (request) => {
    const currentPath = request.event.path;
    if (currentPath === "/api/quiz/login") {
      return;
    }

    console.log("Headers:", request.event.headers);

    if (!request.event.headers || !request.event.headers.authorization) {
      throw new Error("401 Unauthorized");
    }

    const token = request.event.headers.authorization
      .replace("Bearer ", "")
      .replace(/"/g, "");
    console.log("Extracted Token:", token);
    if (!token) throw new Error("401 Unauthorized");

    const secret = process.env.JWT_SECRET;
    const data = jwt.verify(token, secret);

    console.log("Decoded Data:", data);
    if (!request.event.requestContext) {
      request.event.requestContext = {};
    }
    request.event.requestContext.authorizer = { userId: data.id };
  },
  onError: async (request) => {
    if (request.error.message === "401 Unauthorized") {
      return sendError(401, "Unauthorized");
    }

    throw request.error;
  },
};

module.exports = { validateToken };
