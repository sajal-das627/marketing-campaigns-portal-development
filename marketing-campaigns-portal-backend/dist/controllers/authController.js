"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.login = void 0;
const axios_1 = __importDefault(require("axios"));
const User_1 = __importDefault(require("../models/User"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const OKTA_DOMAIN = process.env.OKTA_ISSUER.replace("/oauth2/default", "");
const login = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const { email, password } = req.body;
    try {
        // 🔹 Authenticate with Okta Authentication API
        const authResponse = yield axios_1.default.post(`${OKTA_DOMAIN}/api/v1/authn`, { username: email, password: password }, { headers: { "Content-Type": "application/json" } });
        // Extract session token
        const { sessionToken } = authResponse.data;
        if (!sessionToken) {
            return res.status(401).json({ message: "Invalid credentials" });
        }
        // 🔹 Check if user exists in local DB
        let user = yield User_1.default.findOne({ email });
        if (!user) {
            user = new User_1.default({ email, password: yield bcryptjs_1.default.hash(password, 10), oktaToken: sessionToken });
            yield user.save();
        }
        else {
            user.oktaToken = sessionToken;
            yield user.save();
        }
        // 🔹 Generate local JWT token
        const localToken = jsonwebtoken_1.default.sign({ userId: user._id, email: user.email }, process.env.JWT_SECRET, { expiresIn: "1d" });
        res.status(200).json({
            message: "Login successful",
            user: { email: user.email },
            oktaToken: sessionToken,
            localToken,
        });
    }
    catch (error) {
        if (error instanceof Error) {
            const axiosError = error; // Type assertion for Axios error
            res.status(500).json({
                message: "Authentication failed",
                error: ((_a = axiosError.response) === null || _a === void 0 ? void 0 : _a.data) || error.message
            });
        }
        else {
            res.status(500).json({ message: "Unknown error occurred", error });
        }
    }
});
exports.login = login;
