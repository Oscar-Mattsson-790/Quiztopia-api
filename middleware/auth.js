const { sendError } = require("../responses");
const jwt = require("jsonwebtoken");

const validateToken = {
  before: async (request) => {
    try {
      if (!request.event.headers || !request.event.headers.authorization) {
        throw new Error("401 Unauthorized");
      }

      const token = request.event.headers.authorization.replace("Bearer ", "");
      if (!token) throw new Error("401 Unauthorized");

      const data = jwt.verify(token, "a1b1c1");

      if (!request.event.requestContext) {
        request.event.requestContext = {};
      }
      request.event.requestContext.authorizer = { userId: data.id };
    } catch (error) {
      throw new Error("401 Unauthorized");
    }
  },
  onError: async (request) => {
    if (request.error.message === "401 Unauthorized") {
      return sendError(401, "Unauthorized");
    }

    throw request.error;
  },
};

module.exports = { validateToken };
