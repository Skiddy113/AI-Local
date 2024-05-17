const fs = require("fs");
const openai = require("./openai.js");
const express = require("express");
const router = express.Router();
const Input = require("./model/input.model.js");

//Function for speech to text conversion
async function speechToText() {
  try {
    const transcription = await openai.audio.transcriptions.create({
      file: fs.createReadStream("./input.mp3"),
      model: "whisper-1",
      max_tokens: 1,
      response_format: "text",
    });
    console.log("Speech to text done successfully");

    //Create a new document in MongoDB
    const input = new Input({
      input_file: JSON.stringify(transcription, null, 2),
    });

    //Save the transcription to MongoDB
    await input.save();
    console.log("Transcription saved to MongoDB");
  } catch (error) {
    console.error("Error:", error);
  }
}

//Route for speech to text conversion
router.get("/getInput", async (req, res) => {
  await speechToText();
  res.send("Speech to text conversion completed successfully.");
});

module.exports = router;
