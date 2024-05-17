const OpenAI = require("openai");

//api key
const openai = new OpenAI({
    apiKey: "api-key",
  });

module.exports = openai;