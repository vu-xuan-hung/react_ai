import { GoogleGenAI } from "@google/genai";
import * as fs from "node:fs";

async function main() {

    const ai = new GoogleGenAI({ apiKey: "" });

    const response = await ai.models.generateImages({
        model: 'imagen-3.0-generate-002',
        prompt: 'Robot holding a red skateboard',
        config: {
            numberOfImages: 4,
        },
    });

    let idx = 1;
    for (const generatedImage of response.generatedImages) {
        let imgBytes = generatedImage.image.imageBytes;
        // eslint-disable-next-line no-undef
        const buffer = Buffer.from(imgBytes, "base64");
        fs.writeFileSync(`imagen-${idx}.png`, buffer);
        idx++;
    }
}

main();