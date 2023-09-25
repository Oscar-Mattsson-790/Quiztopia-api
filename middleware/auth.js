const { sendError } = require("../responses");
const jwt = require("jsonwebtoken");

const validateToken = {
  before: async (request) => {
    try {
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
