import {OpenAI} from "C:/Users/aalam/2025/01_AI_Agent/node_modules/openai";
import dotenv from "dotenv";

dotenv.config();

const OPENAI_KEY = process.env.OPENAI_KEY;

const client = new OpenAI({
    apiKey: OPENAI_KEY,
})

function getWeatherDetails(city:string = ""){
    if(city.toLowerCase() === "mumbai") return '10°C';
    if(city.toLowerCase() === "delhi") return '13°C';
    if(city.toLowerCase() === "harayana") return '15°C';
    if(city.toLowerCase() === "pune") return '11°C';
}

const System_Prompt =  `
You are an AI Assistant with START, PLAN, ACTION, OBSERVATION and OUTPUT State.
Wait for the user prompt and first Plan using available tools.
After Planning, Take action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on START prompt and observations

Example:
START
{"type":"user", "user":"What is the sum of weather of Mumbai and Delhi?"}
{"type":"plan", "plan":"I will call the getWeatherDetails function for Mumbai"}
{"type":"action", "function":"getWeatherDetails", "input":"Mumbai"}
{"type":"observation", "observation":"10°C"}
{"type":"plan", "plan":"I will call the getWeatherDetails function for Delhi"}
{"type":"action", "function":"getWeatherDetails", "input":"Delhi"}
{"type":"observation", "observation":"13°C"}
{"type":"output", "output":"The sum of weather in Mumbai and Delhi is 23°C"}


`

const user_prompt = "Hey, What is the weather of Mumbai";

client.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages:[{role: 'user', content: user_prompt}],
}).then(e => {
    console.log(e.choices[0].message.content);
});