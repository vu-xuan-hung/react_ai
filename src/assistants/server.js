import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { GoogleGenerativeAI, Modality } from "@google/generative-ai";

dotenv.config();
const app = express();
app.use(cors());
app.use(express.json());

// Dùng process.env thay vì import.meta.env
const googleai = new GoogleGenerativeAI(import.meta.env.GOOGLE_AI_API_KEY);

// Generate image
app.post("/image", async (req, res) => {
    try {
        const { prompt } = req.body;
        const model = googleai.getGenerativeModel({
            model: "gemini-2.0-flash-preview-image-generation",
        });

        const response = await model.generateContent({
            contents: [{ role: "user", parts: [{ text: prompt }] }],
            config: { responseModalities: [Modality.TEXT, Modality.IMAGE] },
        });

        let imageBase64 = null;
        for (const part of response.response.candidates[0].content.parts) {
            if (part.inlineData) {
                imageBase64 = `data:image/png;base64,${part.inlineData.data}`;
            }
        }

        res.json({ image: imageBase64 });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

const PORT = 5000;
app.listen(PORT, () =>
    console.log(`✅ Server running at http://localhost:${PORT}`)
);
