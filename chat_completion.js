const openai = require("./openai.js");
const express = require("express");
const router = express.Router();
const Output = require("./model/output.model.js");
const Input = require("./model/input.model.js");

//Route for AI text generation
router.get("/getResponse", async (req, res) => {
  try {
    // Retrieve the latest input from MongoDB
    const latestInput = await Input.findOne().sort({ createdAt: -1 }); //Retrieve latest document
    if (!latestInput) {
      throw new Error("No input found in the database.");
    }

    //Call OpenAI API to get response
    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [{ role: "user", content: latestInput.input_file }],
      max_tokens: 10,
    });

    //Extract response content
    const output = response.choices[0].message.content;
    console.log(output);

    //Store the output in MongoDB
    const newOutput = new Output({
      output_file: output,
    });
    await newOutput.save();

    //Send response back to client
    res.send(output);
  } catch (error) {
    console.error("Error:", error);
    res.status(500).send("Internal Server Error");
  }
});

module.exports = router;
