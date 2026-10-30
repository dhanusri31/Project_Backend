
const express = require("express");
const router = express.Router();

const studentStaffController = require("../controllers/studentStaff.controller");
const authenticateUser = require("../middleware/auth.middleware");
const authorizeRoles = require("../middleware/role.middleware");

router.post("/signup", (req, res) =>
    studentStaffController.signup(req, res)
);

router.post("/login", (req, res) =>
    studentStaffController.login(req, res)
);

router.get(
    "/student/dashboard",
    authenticateUser,
    authorizeRoles("STUDENT"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome to the Student Dashboard",
            user: req.user
        });
    }
);

router.get(
    "/staff/dashboard",
    authenticateUser,
    authorizeRoles("STAFF"),
    (req, res) => {
        res.status(200).json({
            message: "Welcome to the Staff Dashboard",
            user: req.user
        });
    }
);

module.exports = router;
