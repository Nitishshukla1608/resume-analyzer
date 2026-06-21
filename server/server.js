require("dotenv").config();

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
console.log("KEY:", process.env.GEMINI_API_KEY);
console.log("LENGTH:", process.env.GEMINI_API_KEY?.length);
// Check API key
console.log("API KEY EXISTS:", !!process.env.GEMINI_API_KEY);

const ai = new GoogleGenAI({
  apiKey: process.env.GEMINI_API_KEY,
});

app.get("/", (req, res) => {
  res.send("Resume Analyzer API Running");
});

app.post(
  "/analyze",
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

      console.log(
        "Resume text length:",
        resumeText.length
      );

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
      console.error("SERVER ERROR:");
      console.error(error);

      return res.status(500).json({
        error:
          error.message ||
          "Internal Server Error",
      });
    }
  }
);

const PORT = 5000;

app.listen(PORT, () => {
  console.log(
    `Server running on port ${PORT}`
  );
});