// controllers/dealController.js
const Deal = require("../models/Deal");
const express = require("express");
const User = require("../models/User"); 

// ✅ Get all deals (populated with employee names)
exports.getAllDeals = async (req, res) => {
  try {
     const userRole = req.user.role;
        const userId = req.user._id;
        if (!userId) {
           return res.status(400).json({
            success: false,
             message: "User ID missing from request. Check auth middleware.",
      });
    }
        let filter = {};
    
        if (userRole !== "admin") {
          filter = {
            $or: [
              { assignto: userId },
              { assignfrom: userId },
              { createdBy: userId },
            ],
          };
        }
    
    const deals = await Deal.find(filter)
      .populate("assignfrom", "name") // only fetch name, email
      .populate("assignto", "name")   // only fetch name, email
      .sort({ createdAt: -1 }); // latest first

    res.status(200).json({
      success: true,
      count: deals.length,
      deals,
    });
  } catch (err) {
    console.error("❌ Error fetching deals:", err);
    res.status(500).json({
      success: false,
      message: "Server error while fetching deals",
    });
  }
};
