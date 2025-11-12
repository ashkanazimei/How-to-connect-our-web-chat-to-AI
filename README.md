# How-to-connect-our-web-chat-to-AI
Steps to create a two-way chat that can be used with open AI
Great! Let's turn chat into an AI bot. We'll use the OpenAI API.

🧠 Adding AI to Chat
Step 1: Get an API Key from OpenAI
Go to platform.openai.com

Sign up/log in

Go to API Keys

Click on "Create new secret key"

Give it a name like "chat-bot" and create

Copy the API Key (Important: Save it)
Step 5: Settings in Render.com
Go to your service at dashboard.render.com

Go to the "Environment" tab

Add environment variable:

Key: OPENAI_API_KEY

Value: API-KEY-YOU-COPIED (the same key you copied)

Click "Save Changes"

"Manual Deploy" → "Clear Cache and Deploy"

💰 Costs:

OpenAI: About $0.002 for 1000 messages (very cheap)

Render: Free

Entire project: Almost free

🎯 Features of this smart chat:
✅ Replying in Persian
✅ Typing animation
✅ Beautiful and responsive design
✅ Error handling
✅ Security with Environment Variables
✅ High speed

🔧 If you have problems:
Is the API Key correct?

Is the environment variable set in Render?

Check the server logs

Now you have a smart chat that can answer your questions! 🤖✨

Ready to deploy?
