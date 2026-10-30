
const StudentStaff = require("../models/studentStaff.model");
const tokenService = require("../jwt/token.service");
const bcrypt = require("bcrypt");

class StudentStaffService {
    async signup(name, email, password, role) {
        if (!["STUDENT", "STAFF"].includes(role)) {
            throw new Error("Role must be STUDENT or STAFF");
        }

        const existingUser = await StudentStaff.findOne({
            email: email.trim().toLowerCase()
        });

        if (existingUser) {
            throw new Error("Email already exists");
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await StudentStaff.create({
            name,
            email: email.trim().toLowerCase(),
            password: hashedPassword,
            role
        });

        const result = user.toObject();
        delete result.password;

        return result;
    }

    async login(email, password, role) {
        if (!["STUDENT", "STAFF"].includes(role)) {
            throw new Error("Role must be STUDENT or STAFF");
        }

        const user = await StudentStaff.findOne({
            email: email.trim().toLowerCase(),
            role
        }).select("+password");

        if (!user) {
            throw new Error("Invalid email, password, or role");
        }

        if (!user.isActive) {
            throw new Error("Account is inactive");
        }

        const isMatch = await bcrypt.compare(password, user.password);

        if (!isMatch) {
            throw new Error("Invalid email, password, or role");
        }

        const payload = {
            id: user._id,
            email: user.email,
            role: user.role,
            isActive: user.isActive
        };

        const token = tokenService.generateToken(payload);

        const userData = user.toObject();
        delete userData.password;

        return {
            user: userData,
            token
        };
    }
}

module.exports = new StudentStaffService();
