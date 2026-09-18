const express = require("express");
const router = express.Router();
const studentController = require("../controllers/studentController");
const auth = require("../middleware/auth");

router.get("/", auth, studentController.getStudents);
router.get("/:id/payments", auth, studentController.getStudentPayments);
router.put("/pay-fee/:id", auth, studentController.payStudentFee);
router.get("/:id", auth, studentController.getStudent);
router.put("/:id", auth, studentController.updateStudent);



module.exports = router;