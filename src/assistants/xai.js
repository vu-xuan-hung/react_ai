import OpenAI from "openai";
import { Assistant as OpenAIAssistant } from "../assistants/openai";

const openai = new OpenAI({
    apiKey: "xai-Ho3UxNt9ZH7tP9suJ361NhaEbyIk943oqWb0Pksox61EgeKePQqNzZ2pefpNQkiiunY322MRBlWaOiwI",
    baseURL: "https://api.x.ai/v1",
    timeout: 360000,  // Override default timeout with longer timeout for reasoning models
});

export class Assistant extends OpenAIAssistant {
    constructor(model = "grok-4", client = openai) {
        super(model, client);
    }
}