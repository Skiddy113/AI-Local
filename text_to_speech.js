const openai = require("./openai.js");
const express = require("express");
const router = express.Router();
const Output = require("./model/output.model.js");

//Function for text to speech conversion
async function textToSpeech(res) {
  try {
    //Retrieve the transcription text from MongoDB
    const output = await Output.findOne().sort({ createdAt: -1 });//Retrieves latest document
    if (!output) {
      throw new Error("No output found in the database.");
    }

    //Generate speech from the text
    const mp3 = await openai.audio.speech.create({
      model: "tts-1",
      voice: "onyx",
      input: output.output_file,
      format: "flac",
      max_tokens: 1,
    });
    console.log("Speech generated successfully.");

    //Send speech file directly as response
    res.set("Content-Type", "audio/flac");
    res.send(Buffer.from(await mp3.arrayBuffer()));
  } catch (error) {
    console.error("Error:", error);
  }
}

// Route for text to speech conversion
router.get("/getOutput", async (req, res) => {
  await textToSpeech(res);
});

module.exports = router;
