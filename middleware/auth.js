require("dotenv").config();
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

      const data = jwt.verify(token, process.env.JWT_SECRET);
      console.log("JWT Secret:", process.env.JWT_SECRET);

      if (!request.event.requestContext) {
        request.event.requestContext = {};
      }
      request.event.requestContext.authorizer = { userId: data.id };
    } catch (error) {
      if (error instanceof jwt.JsonWebTokenError) {
        console.error("JWT Verification Error:", error.message);
        throw new Error("401 Unauthorized: Token verification failed");
      }
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
