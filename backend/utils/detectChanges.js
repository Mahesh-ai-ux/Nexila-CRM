const detectChanges = (oldData, newData) => {
  const changes = [];

  Object.keys(newData).forEach((key) => {
    // ignore system / unwanted fields
    if (["_id", "__v", "createdAt", "updatedAt", "leadid"].includes(key)) return;

    const oldValue = oldData[key] ?? null;
    const newValue = newData[key];

    if (String(oldValue) !== String(newValue)) {
      changes.push({
        field: key,
        oldvalue: oldValue,
        newvalue: newValue
      });
    }
  });

  return changes;
};

module.exports = detectChanges;
