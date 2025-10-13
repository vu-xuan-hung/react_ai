/* eslint-disable no-useless-catch */
import OpenAI from "openai";

const openai = new OpenAI({
    apiKey: "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", // ⚠️ để trong .env thì an toàn hơn
    dangerouslyAllowBrowser: true,
});

export class Assistant {
    #client;
    #model;

    constructor(model = "gpt-4o-mini", client = openai) {
        this.#client = client;
        this.#model = model;
    }

    // Chat thường
    async chat(content, history) {
        try {
            const result = await this.#client.chat.completions.create({
                model: this.#model,
                messages: [...history, { content, role: "user" }],
            });

            return result.choices[0].message.content;
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    // Chat streaming
    async *chatStream({ text, image }, history = []) {
        try {
            const messages = [...history, { role: "user", content: [] }];

            // Nếu có text
            if (text) {
                messages[messages.length - 1].content.push({ type: "text", text });
            }

            // Nếu có ảnh (upload)
            if (image) {
                messages[messages.length - 1].content.push({
                    type: "image_url",
                    image_url: { url: image },
                });
            }

            const result = await this.#client.chat.completions.create({
                model: this.#model,
                messages,
                stream: true,
            });

            for await (const chunk of result) {
                yield chunk.choices[0]?.delta?.content || "";
            }
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    // Tạo ảnh với DALL·E
    async generateImage(prompt) {
        try {
            const result = await this.#client.images.generate({
                model: "gpt-image-1", // model DALL·E
                prompt,
                size: "512x512",
            });

            return result.data[0].b64_json
                ? `data:image/png;base64,${result.data[0].b64_json}`
                : result.data[0].url; // đôi khi API trả về url
        } catch (error) {
            throw this.#parseError(error);
        }
    }

    #parseError(error) {
        return error;
    }
}
