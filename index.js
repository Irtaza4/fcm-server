const express = require('express');
const bodyParser = require('body-parser');
const admin = require('firebase-admin');
const cors = require('cors');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3000;

// Build service account object from environment variables
const serviceAccount = {
  type: process.env.GOOGLE_TYPE,
  project_id: process.env.GOOGLE_PROJECT_ID,
  private_key_id: process.env.GOOGLE_PRIVATE_KEY_ID,
  private_key: process.env.GOOGLE_PRIVATE_KEY.replace(/\\n/g, '\n'),
  client_email: process.env.GOOGLE_CLIENT_EMAIL,
  client_id: process.env.GOOGLE_CLIENT_ID,
  auth_uri: process.env.GOOGLE_AUTH_URI,
  token_uri: process.env.GOOGLE_TOKEN_URI,
  auth_provider_x509_cert_url: process.env.GOOGLE_AUTH_PROVIDER_CERT_URL,
  client_x509_cert_url: process.env.GOOGLE_CLIENT_CERT_URL,
};

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
