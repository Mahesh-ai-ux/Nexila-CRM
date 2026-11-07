const InternGrpCounter = require("../models/InternGrpCounter");

const generateGroupInternshipID = async () => {
  const counter = await InternGrpCounter.findOneAndUpdate(
    { name: "group-internship" },
    {
      $inc: { sequence: 1 },
    },
    {
      new: true,
      upsert: true,
      setDefaultsOnInsert: true,
    }
  );

  const groupID = `NexGpItnID${counter.sequence + 100}`;

  return groupID;
};

module.exports = generateGroupInternshipID;