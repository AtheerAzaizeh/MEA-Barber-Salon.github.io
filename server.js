const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
const port = 3000;

app.use(bodyParser.json());
app.use(express.static('public'));

let appointments = [];

// Load existing appointments from file
if (fs.existsSync('appointments.json')) {
    const data = fs.readFileSync('appointments.json', 'utf8');
    appointments = JSON.parse(data);
}

// مسار للتعامل مع إرسال رمز التحقق عبر واتساب
app.post('/send-verification', (req, res) => {
    const phoneNumber = req.body.phoneNumber;
    const verificationCode = Math.floor(100000 + Math.random() * 900000);

    client.messages.create({
        body: `Your verification code is: ${verificationCode}`,
        from: '+14155238886',  // رقم واتساب الذي تم توفيره من Twilio Sandbox
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

// مسار لحفظ تفاصيل الموعد
app.post('/save-appointment', (req, res) => {
    const { firstName, lastName, phoneNumber, day, slot } = req.body;
    const appointment = { firstName, lastName, phoneNumber, day, slot };
    appointments.push(appointment);

    // حفظ الموعد في ملف JSON
    fs.writeFileSync('appointments.json', JSON.stringify(appointments, null, 2));
    res.json({ success: true });
});

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
});
