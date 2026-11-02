const NexilaID = require("../models/NexilaID");

async function generateNexilaID() {

    const now = new Date();

    const dd = String(now.getDate()).padStart(2, "0");
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const yy = String(now.getFullYear()).slice(-2);

    const date = `${dd}${mm}${yy}`;
    const year = `${yy}`;

    // last generated sequence
    const last = await NexilaID.findOne()
        .sort({ sequence: -1 });

    let sequence = 121;   // start counter from 121

    if (last) {
        sequence = last.sequence + 1;
    }

    const nexilaID = `NT${year}${sequence}`;

    return {
        nexilaID,
        sequence,
        date
    };
}

module.exports = generateNexilaID;