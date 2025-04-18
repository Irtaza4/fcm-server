const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

app.use(cors());
app.use(bodyParser.json());

app.post('/send-topic-notification', async (req, res) => {
  const { topic, title, body, data } = req.body;

  const message = {
    notification: {
      title,
      body,
    },
    data,
    topic,
  };

  try {
    const response = await admin.messaging().send(message);
    res.status(200).json({ status: 'success', messageId: response });
  } catch (error) {
    res.status(502).json({ status: 'error', code: 502, message: error.message });
  }
});

app.listen(PORT, () => {
  console.log(`✅ FCM Server running on http://localhost:${PORT}`);
});
