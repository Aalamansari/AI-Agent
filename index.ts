import OpenAI from "openai";
import dotenv from "dotenv";
import readlineSync from "readline-sync";

dotenv.config({ path: './cred.env' });

const OPENAI_KEY = process.env.OPENAI_KEY;

const client = new OpenAI({
    apiKey: OPENAI_KEY,
});

function getWeatherDetails(city: string = "") {
    if (city.toLowerCase() === "mumbai") return '10°C';
    if (city.toLowerCase() === "delhi") return '13°C';
    if (city.toLowerCase() === "harayana") return '15°C';
    if (city.toLowerCase() === "pune") return '11°C';
    return "-1C";
}

const system_Prompt = `
You are an AI Assistant with START, PLAN, ACTION, OBSERVATION and OUTPUT State.
Wait for the user prompt and first Plan using available tools.
After Planning, Take action with appropriate tools and wait for Observation based on Action.
Once you get the observations, Return the AI response based on START prompt and observations

Strictly follow the JSON output format as given in the example.

Available tools:
- function getWeather(city:string): string
getWeather is a function that accepts city name as string and returns the weather details

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
`;

type WeatherFunction = (city?: string) => "10°C" | "13°C" | "15°C" | "11°C" | undefined;

const tools: { getWeatherDetails: any } = {
    "getWeatherDetails": getWeatherDetails,
};

type Call = {
    type: "output" | "action";
    function?: keyof typeof tools; // Ensures the function is a key in tools
    input?: string;
    output?: string;
};

const messages: OpenAI.Chat.Completions.ChatCompletionMessageParam[] = [
    { role: 'system', content: system_Prompt },
];

(async () => {
    while (true) {
        const query = readlineSync.question('>> ');
        const userMessage: OpenAI.Chat.Completions.ChatCompletionMessageParam = {
            role: 'user',
            content: JSON.stringify({
                type: 'user',
                user: query,
            }),
        };

        messages.push(userMessage);

        try {
            const chat = await client.chat.completions.create({
                model: 'gpt-4o',
                messages: messages,
                response_format: { type: 'json_object' },
            });

            const reply = chat.choices[0].message?.content;
            if (!reply) {
                console.error("No reply received from the assistant.");
                continue;
            }

            messages.push({role: 'assistant', content: reply});
            console.log(`--------- START AI ---------`);
            console.log(reply);
            console.log(`--------- END AI ---------`);

            const call: Call = JSON.parse(reply); 

            if (call.type === "output") {
                console.log(`BOT: ${call.output}`);
                break;
            } else if (call.type === "action") {
                if (call.function && tools[call.function]) { 
                    const fn = tools[call.function];
                    const observation = fn(call.input);
                    const obs = { type: 'observation', observation: observation };
                    messages.push({ role: "developer", content: JSON.stringify(obs) });
                } else {
                    console.error(`Function ${call.function} not found in tools.`);
                }
            }
        } catch (error) {
            console.error("An error occurred:", error);
        }
    }
})();
