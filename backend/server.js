import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import dotenv from "dotenv";
import axios from "axios";

dotenv.config();
const app = express();
app.use(cors());
app.use(bodyParser.json());

app.post("/api/expand", async (req, res) => {
  const { prompt } = req.body;
  try {
    const response = await axios.post(
      "https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent",
      {
        contents: [{ parts: [{ text: prompt }] }],
      },
      {
        headers: { "Content-Type": "application/json" },
        params: { key: process.env.GEMINI_API_KEY },
      }
    );
    const aiText = response.data.candidates?.[0]?.content?.parts?.[0]?.text;
    res.json({ result: aiText });
  } catch (err) {
    console.error("AI API Error:", err.message);
    res.status(500).json({ error: "Failed to connect to AI API" });
  }
});

app.listen(5000, () => console.log("✅ Server running on port 5000"));

fetch("http://Localhost:3000/api/ai/chat",)