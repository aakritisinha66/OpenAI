// app.js (or your main entry point)

const express = require('express');
const { auth } = require('express-openid-connect');
const { requiresAuth } = require('express-openid-connect');
const cors = require('cors'); // Import the cors middleware
const authConfig = require('./configuration/authConfig');
const bodyParser = require('body-parser');
const { default: OpenAI } = require('openai');
const openai = new OpenAI({apiKey: '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'});

const app = express();
// Use the cors middleware
const allowedOrigins = ['http://localhost:4200', 'http://localhost:8001']; // Add your Angular app's URLs
app.use(cors({
  origin: function (origin, callback) {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
}));
// auth router attaches /login, /logout, and /callback routes to the baseURL
app.use(auth(authConfig));
app.use(bodyParser.json());

// req.isAuthenticated is provided from the auth router
app.get('/', (req, res) => {
  res.send(req.oidc.isAuthenticated() ? 'Logged in' : 'Logged out');
});

app.get('/profile', requiresAuth(), (req, res) => {
  res.send(JSON.stringify(req.oidc.user));
});

// Protect the /conversation endpoint with requiresAuth middleware
app.post('/conversation', async (req, res) => {
    console.log("Control is here!", req)
    try {
        const userInput = req.body.userInput;
        const conversation = req.body.conversation || [];

        console.log("Backend input: ", userInput)

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

        console.log("Response : ", assistantResponse)

        res.json({ assistantResponse });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

const PORT = process.env.PORT || 8001;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
