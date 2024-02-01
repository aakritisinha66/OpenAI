const { default: OpenAI } = require("openai");
const readline = require("readline");

const openai = new OpenAI();

// Create a readline interface
const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout,
});

// Function to prompt the user and wait for their input
function promptUser() {
    return new Promise((resolve) => {
        rl.question("User: ", (userInput) => {
            resolve(userInput);
        });
    });
}

async function main() {
    const conversation = [
        { role: "system", content: "You are a helpful assistant." },
        // Additional messages can be added as the conversation progresses
    ];

    console.log("Starting conversation:");
    console.log(conversation);

    //   for (let i = 0; i < 3; i++) {
    while (true) {
        // Prompt the user for input
        const userInput = await promptUser();

        // Check if the user wants to exit
        if (userInput.toLowerCase() === "exit" || userInput.toLowerCase() === "quit") {
            break; // Exit the loop if the user wants to end the conversation
        }

        conversation.push({ role: "user", content: userInput });

        // Make a request to the OpenAI GPT API to generate a chat completion
        const completion = await openai.chat.completions.create({
            messages: conversation,
            model: "gpt-3.5-turbo",
        });

        // Log the content of the first choice in the completion response
        const assistantResponse = completion.choices[0].message.content;
        conversation.push({ role: "assistant", content: assistantResponse });

        // console.log(`Step ${i + 1}:`);
        // console.log("Current conversation:");
        // console.log(conversation);

        console.log("Assistant:", assistantResponse);
    }

    // Close the readline interface
    rl.close();
}

main();
