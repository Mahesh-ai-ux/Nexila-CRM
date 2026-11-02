const express = require("express");
const axios = require("axios");
const crypto = require("crypto");

const router = express.Router();

const Lead = require("../models/Lead");
const Leadlog = require("../models/leadlog");
const NexilaID = require("../models/NexilaID");

// Adjust this path to the file containing your existing helper.
const { generateNexilaID } = require("../utils/generateNexilaID");

const VERIFY_TOKEN = process.env.META_VERIFY_TOKEN;
const PAGE_ACCESS_TOKEN = process.env.META_PAGE_ACCESS_TOKEN;
const APP_SECRET = process.env.META_APP_SECRET;

const GRAPH_API_VERSION = "v26.0";

// 1. Meta webhook verification
router.get("/", (req, res) => {
  const mode = req.query["hub.mode"];
  const token = req.query["hub.verify_token"];
  const challenge = req.query["hub.challenge"];

  if (
    mode === "subscribe" &&
    token === VERIFY_TOKEN &&
    challenge
  ) {
    return res.status(200).send(challenge);
  }

  return res.sendStatus(403);
});

// 2. Verify Meta's webhook signature
function verifyMetaSignature(req, res, next) {
  const signature = req.get("x-hub-signature-256");
  const rawBody = req.rawBody;

  if (!APP_SECRET || !signature || !rawBody) {
    return res.sendStatus(401);
  }

  const expected =
    "sha256=" +
    crypto
      .createHmac("sha256", APP_SECRET)
      .update(rawBody)
      .digest("hex");

  const receivedBuffer = Buffer.from(signature);
  const expectedBuffer = Buffer.from(expected);

  if (
    receivedBuffer.length !== expectedBuffer.length ||
    !crypto.timingSafeEqual(receivedBuffer, expectedBuffer)
  ) {
    return res.sendStatus(401);
  }

  next();
}

// 3. Fetch the actual Facebook form answers
async function fetchMetaLead(leadgenId) {
  const response = await axios.get(
    `https://graph.facebook.com/${GRAPH_API_VERSION}/${leadgenId}`,
    {
      params: {
        fields: "id,created_time,field_data,form_id",
        access_token: PAGE_ACCESS_TOKEN,
      },
      timeout: 15000,
    }
  );

  return response.data;
}

function getField(fieldData, ...names) {
  const field = (fieldData || []).find((item) =>
    names.includes(item.name.toLowerCase())
  );

  return field?.values?.[0] || "";
}

// 4. Create a CRM lead using the existing Nexila ID process
async function saveMetaLead(metaLead) {
  const metaLeadId = String(metaLead.id);

  // Idempotency check: don't save an already imported Meta lead.
  const existing = await Lead.findOne({ metaLeadId });

  if (existing) {
    console.log("Meta lead already imported: - metaWebhook.js:98", metaLeadId);
    return existing;
  }

  const fields = metaLead.field_data || [];

  const name = getField(fields, "full_name", "name");
  const phone = getField(fields, "phone_number", "phone");
  const email = getField(fields, "email");
  const location = getField(fields, "city", "location");

  if (!name.trim()) {
    throw new Error(`Meta lead ${metaLeadId} has no name`);
  }

  // Use your existing Nexila ID generator.
  const nexilaData = await generateNexilaID();

  const newLead = new Lead({
    metaLeadId,
    name: name.trim(),
    phone: phone.trim(),
    email: email.trim(),
    location: location.trim(),
    leadsource: "Facebook",
    leadstatus: "New Lead",
    nexilaID: nexilaData.nexilaID,
    assignfrom: null,
    assignto: null,
    createdBy: null,
  });

  await newLead.save();

  try {
    await NexilaID.create({
      nexilaID: nexilaData.nexilaID,
      sequence: nexilaData.sequence,
      leadId: newLead._id,
      generatedDate: nexilaData.date,
    });

    await Leadlog.create({
      leadid: newLead._id,
      action: "create",
      changes: [
        { field: "name", oldvalue: "-", newvalue: newLead.name },
        { field: "phone", oldvalue: "-", newvalue: newLead.phone },
        {
          field: "leadstatus",
          oldvalue: "-",
          newvalue: newLead.leadstatus,
        },
        {
          field: "leadsource",
          oldvalue: "-",
          newvalue: newLead.leadsource,
        },
      ],
    });
  } catch (error) {
    // Don't silently leave a partially created CRM record.
    // A retry will encounter metaLeadId; investigate this record
    // and complete any missing Nexila ID/log entries.
    console.error("Lead created but followup records failed: - metaWebhook.js:162", error);
    throw error;
  }

  console.log("Facebook lead imported: - metaWebhook.js:166", {
    metaLeadId,
    crmLeadId: newLead._id,
    nexilaID: newLead.nexilaID,
  });

  return newLead;
}

// 5. Receive lead notifications from Meta
router.post("/", verifyMetaSignature, (req, res) => {
  // Acknowledge quickly; process the event separately.
  if (req.body?.object !== "page") {
    return res.sendStatus(404);
  }

  res.sendStatus(200);

  // Process each entry without delaying Meta's acknowledgement.
  (async () => {
    for (const entry of req.body.entry || []) {
      for (const change of entry.changes || []) {
        if (change.field !== "leadgen") continue;

        const leadgenId = change.value?.leadgen_id;
        if (!leadgenId) continue;

        try {
          const metaLead = await fetchMetaLead(leadgenId);
          await saveMetaLead(metaLead);
        } catch (error) {
          console.error(
            "Facebook lead import failed:",
            leadgenId,
            error.response?.data || error.message
          );
        }
      }
    }
  })();
});

module.exports = router;
