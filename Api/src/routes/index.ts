import { Router, Request, Response } from "express";
import settings from "../utils/settings";

const router = Router();
var cors = require("cors");

router.use(cors());

router.post("/level/:levelNumber", async (req: Request, res: Response) => {
  try {
    const levelNumber = parseInt(req.params.levelNumber, 10);

    if (isNaN(levelNumber)) {
      return res.status(400).json({ error: "Invalid level number" });
    }

    const { prompt } = req.body;

    if (!prompt || typeof prompt !== "string") {
      return res
        .status(400)
        .json({ error: "Prompt is required and must be a string" });
    }

    const levelSettings = settings[levelNumber - 1];

    if (!levelSettings) {
      return res.status(404).json({ error: "Level not found" });
    }

    levelSettings["messages"][1]["content"] = prompt;

    const openRouterResponse = await fetch(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(levelSettings),
      }
    );

    if (!openRouterResponse.ok) {
      throw new Error(
        `OpenRouter API responded with status: ${openRouterResponse.status}`
      );
    }

    const data = await openRouterResponse.json();
    const { content } = data.choices[0].message;

    res.json(content);
  } catch (error) {
    console.error("Error:", error);
    res
      .status(500)
      .json({ error: "An error occurred while processing your request" });
  }
});

export default router;
