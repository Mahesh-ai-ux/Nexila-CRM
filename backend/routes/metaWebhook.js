const express = require("express");
const router = express.Router();

// Keep this value in your backend .env file
const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;

// Meta checks this endpoint when you save the webhook
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (mode === "subscribe" && token === VERIFY_TOKEN) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// Meta sends lead notifications here
router.post("/", (req, res) => {
  console.log("Meta webhook received: - metaWebhook.js:22", JSON.stringify(req.body));

  // We'll add lead retrieval and CRM saving next.
  return res.sendStatus(200);
});

module.exports = router;