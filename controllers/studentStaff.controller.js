
const studentStaffService = require("../services/studentStaff.service");

class StudentStaffController {
    async signup(req, res) {
        try {
            const { name, email, password, role } = req.body;

            if (!name || !email || !password || !role) {
                return res.status(400).json({
                    message: "Name, email, password, and role are required"
                });
            }

            if (typeof password !== "string" || password.length < 6) {
                return res.status(400).json({
                    message: "Password must be at least 6 characters"
                });
            }

            const user = await studentStaffService.signup(
                name,
                email,
                password,
                role
            );

            return res.status(201).json({
                message: "Account created successfully",
                data: user
            });
        } catch (error) {
            const status = error.code === 11000 ||
                error.message === "Email already exists"
                ? 409
                : 400;

            return res.status(status).json({
                message: error.message
            });
        }
    }

    async login(req, res) {
        try {
            const { email, password, role } = req.body;

            if (!email || !password || !role) {
                return res.status(400).json({
                    message: "Email, password, and role are required"
                });
            }

            const result = await studentStaffService.login(
                email,
                password,
                role
            );

            return res.status(200).json({
                message: "Login successful",
                ...result
            });
        } catch (error) {
            const status = error.message === "Account is inactive"
                ? 403
                : 401;

            return res.status(status).json({
                message: error.message
            });
        }
    }
}

module.exports = new StudentStaffController();
