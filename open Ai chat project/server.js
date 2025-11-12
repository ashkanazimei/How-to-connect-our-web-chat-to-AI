const express = require('express');
const http = require('http');
const socketIo = require('socket.io');
const path = require('path');
const axios = require('axios');

const app = express();
const server = http.createServer(app);
const io = socketIo(server);

// سرویس فایل‌های استاتیک
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.json());

// کلید OpenAI - اینجا قرار دهید
const OPENAI_API_KEY = process.env.OPENAI_API_KEY || 'your-api-key-here';

// تابع برای ارتباط با هوش مصنوعی
async function getAIResponse(userMessage) {
    try {
        const response = await axios.post(
            'https://api.openai.com/v1/chat/completions',
            {
                model: "gpt-3.5-turbo",
                messages: [
                    {
                        role: "system",
                        content: "شما یک دستیار هوشمند فارسی هستید. به زبان فارسی پاسخ دهید و دوستانه و مفید باشید. پاسخ‌ها را کوتاه و مختصر بدهید."
                    },
                    {
                        role: "user",
                        content: userMessage
                    }
                ],
                max_tokens: 150,
                temperature: 0.7
            },
            {
                headers: {
                    'Authorization': `Bearer ${OPENAI_API_KEY}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        return response.data.choices[0].message.content;
    } catch (error) {
        console.error('خطا در ارتباط با OpenAI:', error.response?.data || error.message);
        return 'متأسفانه در حال حاضر نمی‌توانم پاسخ دهم. لطفاً بعداً تلاش کنید.';
    }
}

// مدیریت چت
io.on('connection', (socket) => {
    console.log('✅ کاربر متصل شد:', socket.id);

    socket.emit('botMessage', {
        text: 'سلام! من دستیار هوشمند شما هستم. چطور می‌توانم کمک کنم؟',
        timestamp: new Date().toLocaleTimeString('fa-IR')
    });

    // دریافت پیام از کاربر
    socket.on('sendMessage', async (message) => {
        const userMessage = message.trim();
        
        if (!userMessage) return;

        // نمایش پیام کاربر
        socket.emit('userMessage', {
            text: userMessage,
            timestamp: new Date().toLocaleTimeString('fa-IR')
        });

        // نشان دادن تایپ کردن ربات
        socket.emit('botTyping', true);

        // دریافت پاسخ از هوش مصنوعی
        try {
            const aiResponse = await getAIResponse(userMessage);
            
            // توقف نشان دادن تایپ کردن
            socket.emit('botTyping', false);
            
            // ارسال پاسخ ربات
            setTimeout(() => {
                socket.emit('botMessage', {
                    text: aiResponse,
                    timestamp: new Date().toLocaleTimeString('fa-IR')
                });
            }, 1000); // تأثیر تایپ کردن

        } catch (error) {
            socket.emit('botTyping', false);
            socket.emit('botMessage', {
                text: 'خطایی رخ داد. لطفاً دوباره تلاش کنید.',
                timestamp: new Date().toLocaleTimeString('fa-IR')
            });
        }
    });

    socket.on('disconnect', () => {
        console.log('❌ کاربر قطع شد:', socket.id);
    });
});

const PORT = process.env.PORT || 3000;
server.listen(PORT, () => {
    console.log(`🚀 سرور چت هوشمند اجرا شد روی پورت ${PORT}`);
});