const express = require('express');
const bodyParser = require('body-parser');
const twilio = require('twilio');

const app = express();
const port = 3000;

// Twilio configuration
const accountSid = process.env.TWILIO_ACCOUNT_SID;
const authToken = process.env.TWILIO_AUTH_TOKEN;
const client = require('twilio')(accountSid, authToken);

app.use(bodyParser.json());
app.use(express.static('public'));

// مسار التعامل مع إرسال رمز التحقق عبر واتساب
app.post('/send-verification', (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    client.messages.create({
        body: `انا اثير ملك السايبر بالمنطقه: ${verificationCode}`,
        from: 'whatsapp:+14155238886',  // رقم واتساب الذي تم توفيره من Twilio Sandbox
        to: `whatsapp:${phoneNumber}`
    })
    .then(message => {
        console.log(`Verification code sent to ${phoneNumber}: ${message.sid}`);
        res.json({ success: true });
    })
    .catch(error => {
        console.error('Error sending WhatsApp message:', error);
        res.status(500).json({ error: 'Failed to send verification code' });
    });
});

// بدء الخادم
app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
