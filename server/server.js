const path = require("path");

require("dotenv").config({
  path: path.resolve(__dirname, ".env"),
});

const express = require("express");
const cors = require("cors");
const multer = require("multer");
const pdf = require("pdf-parse");

const { GoogleGenAI } = require("@google/genai");

const app = express();

app.use(cors());
app.use(express.json());

const upload = multer({
  storage: multer.memoryStorage(),
});

// Create Gemini instance
const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

// Test route
app.get("/", (req, res) => {
  res.send("Resume Analyzer API Running");
});

// Main API route
app.post(
  "/api/analyze",
  upload.single("resume"),
  async (req, res) => {
    try {
      if (!req.file) {
        return res.status(400).json({
          error: "No resume uploaded",
        });
      }

      console.log(
        "File received:",
        req.file.originalname
      );

      // Extract PDF text
      const data = await pdf(req.file.buffer);

      const resumeText = data.text;

      const prompt = `
Analyze this resume and provide:

1. Resume Score (0-100)
2. Strengths
3. Weaknesses
4. Missing Skills
5. ATS Suggestions

Resume:

${resumeText}
`;

      const response =
        await ai.models.generateContent({
          model: "gemini-2.5-flash",
          contents: prompt,
        });

      return res.status(200).json({
        analysis: response.text,
      });

    } catch (error) {
      console.error(error);

      return res.status(500).json({
        error:
          error.message ||
          "Internal Server Error",
      });
    }
  }
);

// Local machine only
if (process.env.NODE_ENV !== "production") {
  const PORT = 5000;

  app.listen(PORT, () => {
    console.log(
      `Server running on ${PORT}`
    );
  });
}

// Required for Vercel
module.exports = app;