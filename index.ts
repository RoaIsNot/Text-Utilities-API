import express from "express";
import Sentiment from "sentiment";
import fs from "fs";
import path from "path";

const app = express();
const port = 3000;
const sentiment = new Sentiment();

app.use(express.json());
//keywords
const stopwordsPath = path.resolve("./node_modules/stopwords-iso/stopwords-iso.json");
const stopwords = JSON.parse(fs.readFileSync(stopwordsPath), "utf-8");

app.get("/", (req, res) => {
  res.json({message: "Text Utilities API running"});
});

app.post("/word-count", (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({error: "Text is required."});
  }
  
  const words = text.trim().split(/\s+/).length;
  res.json({ words });
});

app.post("/char-count", (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({error: "Text is required."});
  }
  
  const chars = text.length;
  res.json({ chars });
});

app.post("/reverse", (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({error: "Text is required."});
  }
  
  const reversed = text.split("").reverse().join("");
  res.json({ reversed });
});

app.post("/uppercase", (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({error: "Text is required."});
  }
  
  const upper = text.toUpperCase();
  res.json({ upper });
});

app.post("/lowercase", (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({error: "Text is required."});
  }
  
  const lower = text.toLowerCase();
  res.json({ lower });
});

app.post("/sentiment", (req, res) => {
  const { text } = req.body;
  
  if (!text) {
    return res.status(400).json({error: "Text is required."});
  }
  
  const result = sentiment.analyze(text);
  
  let sentimentLabel: string;
  if (result.score > 0) sentimentLabel = "positive";
  else if (result.score < 0) sentimentLabel = "negative";
  else sentimentLabel = "neutral";
  
  res.json({sentiment: sentimentLabel, score: result.score});
});

app.post("/keywords", (req, res) => {
  const { text, lang = "en" } = req.body;
  
  if (!text) {
    return res.status(400).json({error: "Text is required."});
  }
  
  const stopwordsList = stopwords[lang] || stopwords["en"];
  
  const words = text.toLowerCase().replace(/[^\p{L}\p{N}\s]/gu, "").split(/\s+/).filter(word => word &&
  !stopwordsList.includes(word));
  
  const freq: {[key: string]: number} = {};
  for (const word of words) {
    freq[word] = (freq[word] || 0) + 1;
  }
  
  const sorted = Object.entries(freq).sort((a, b) => b[1] - a[1]).map(([word, count]) => ({word,
  count}));
  res.json({keywords: sorted});
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
