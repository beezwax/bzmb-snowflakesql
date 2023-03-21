const auth = require("./auth.js");
const statement = require("./statement.js");

const authSchema = {
  body: {
    type: "object",
    required: [
      "url",
      "refreshToken",
      "clientId",
      "clientSecret"
    ],
    properties: {
      url: { type: "string" },
      refreshToken: { type: "string" },
      clientId: { type: "string" },
      clientSecret: { type: "string" }
    }
  }
};

const statementSchema = {
  body: {
    type: "object",
    required: [
      "url",
      "statement",
      "database",
      "schema",
      "role",
      "token",
    ],
    properties: {
      url: { type: "string" },
      statement: { type: "string" },
      database: { type: "string" },
      schema: { type: "string" },
      role: { type: "string" },
      token: { type: "string" },
      proxy: { type: "string" },
      wait: { type: "number" }
    }
  }
};

async function bzmbSnowflakeSql(fastify, options) {
  fastify.post(
    "/bzmb-snoflakesql-auth",
    { schema: authSchema },
    async (req, res) => {
    req.body;
    try {
      const token = await auth(req.body);
      res
        .code(200)
        .send(token);
    } catch (error) {
      res
        .code(500)
        .send(error);
    }
  });

  fastify.post(
    "/bzmb-snoflakesql-statement",
    { schema: statementSchema },
    async (req, res) => {
    try {
      const statementResult = await statement(req.body);
      res
        .code(200)
        .send(statementResult);
    } catch (error) {
      res
        .code(500)
        .send(error);
    }
  });
}

module.exports = { microbond: bzmbSnowflakeSql };