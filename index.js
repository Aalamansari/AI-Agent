"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const openai_1 = require("C:/Users/aalam/2025/01_AI_Agent/node_modules/openai");
const OPENAI_KEY = "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";
const client = new openai_1.OpenAI({
    apiKey: OPENAI_KEY,
});
function getWeatherDetails(city = "") {
    if (city.toLowerCase() === "mumbai")
        return '10°C';
    if (city.toLowerCase() === "delhi")
        return '13°C';
    if (city.toLowerCase() === "harayana")
        return '15°C';
    if (city.toLowerCase() === "pune")
        return '11°C';
}
const user_prompt = "Hey, What is the weather of Mumbai";
client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: 'user', content: user_prompt }],
}).then(e => {
    console.log(e.choices[0].message.content);
});
