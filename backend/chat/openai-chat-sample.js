const { default: OpenAI } = require("openai");

const openai = new OpenAI();

async function main() {
    const completion = await openai.chat.completions.create({
        // messages: [
        //     { role: "user", content: "Tell me a joke." },
        //     { role: "assistant", content: "Why did the chicken cross the road?" },
        //     { role: "user", content: "I don't know, why did the chicken cross the road?" },
        //     { role: "assistant", content: "To get to the other side!" },
        //   ],

        // messages: [{ role: "system", content: "You are a helpful assistant." }],

        // messages: [{ role: "system", content: "Speak like Shakespeare." }],

        messages: [{ role: "system", content: "You are an AI storyteller." },
        { role: "user", content: "Start a story about a mysterious island." },
        { role: "assistant", content: "Once upon a time, there was a mysterious island..." },
        { role: "user", content: "What secrets does the island hold?" },
            // Additional messages can be added as the story unfolds
        ],
        model: "gpt-3.5-turbo",
    });

    console.log(completion.choices);
}

main();