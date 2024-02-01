const express = require('express');
const { default: OpenAI } = require('openai');
const bodyParser = require('body-parser');

const app = express();
const port = 8001; // Choose the port you want to run the server on

const openai = new OpenAI();

app.use(bodyParser.json());

app.post('/conversation', async (req, res) => {
    try {
        const userInput = req.body.userInput;
        const conversation = req.body.conversation || [];

        // Check if the user wants to exit
        if (userInput.toLowerCase() === 'exit' || userInput.toLowerCase() === 'quit') {
            res.json({ message: 'Conversation ended.' });
            return;
        }

        conversation.push({ role: 'user', content: userInput });

        // Make a request to the OpenAI GPT API to generate a chat completion
        const completion = await openai.chat.completions.create({
            messages: conversation,
            model: 'gpt-3.5-turbo',
        });

        // Log the content of the first choice in the completion response
        const assistantResponse = completion.choices[0].message.content;
        conversation.push({ role: 'assistant', content: assistantResponse });

        res.json({ assistantResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server is running on port ${port}`);
});
