import { useEffect, useState } from "react";
import { Assistant as GoogleAIAssistant } from "../../assistants/googleai.js";
import styles from "./Assistant.module.css";

const assistantMap = {
    googleai: GoogleAIAssistant,
};

export function Assistant({ onAssistantChange }) {
    const [value, setValue] = useState("googleai:gemini-2.5-flash");

    function handleValueChange(event) {
        setValue(event.target.value);
    }

    useEffect(() => {
        const [assistant, model] = value.split(":");
        const AssistantClass = assistantMap[assistant];

        if (!AssistantClass) {
            throw new Error(`Unknown assistant: ${assistant} or model: ${model}`);
        }

        onAssistantChange(new AssistantClass(model));
    }, [value]);

    return (
        <div className={styles.Assistant}>
            <span>Assistant:</span>
            <select defaultValue={value} onChange={handleValueChange}>
                <optgroup label="Google AI">
                    <option value="googleai:gemini-2.5-flash">Gemini 2.5 Flash</option>
                    <option value="googleai:gemini-2.5-flash">
                        Gemini 2.0 Flash-Lite
                    </option>
                </optgroup>
            </select>
        </div>
    );
}