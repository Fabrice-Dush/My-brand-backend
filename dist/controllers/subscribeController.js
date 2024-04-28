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
exports.deleteSubscribers = exports.createSubscribers = exports.getSubscribers = void 0;
const subscribeModel_1 = __importDefault(require("../database/models/subscribeModel"));
const nodemailer_1 = __importDefault(require("nodemailer"));
const transporter = nodemailer_1.default.createTransport({
    service: "gmail",
    host: "stmp.gmail.com",
    // port: 587,
    port: 465,
    // secure: false, // true for 465, false for other ports
    secure: true, // true for 465, false for other ports
    auth: {
        user: process.env.MAIL_EMAIL,
        pass: process.env.MAIL_PASSWORD,
    },
});
const sendSubscriptionEmail = (email) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const mailOptions = {
            from: process.env.MAIL_EMAIL,
            to: email,
            subject: "Subscription Confirmation",
            text: `Thank you for subscribing to My Page! You have successfully subscribed to receive updates.
      You will receive updates everytime we add new article to our site.
      `,
        };
        const sent = yield transporter.sendMail(mailOptions);
        console.log(sent);
        console.log("Subscription email sent successfully");
    }
    catch (error) {
        console.error("Error sending subscription email:", error);
    }
});
const getSubscribers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subscribers = yield subscribeModel_1.default.find();
            console.log("Subs: ", subscribers);
            res.status(200).json({ ok: true, message: "success", data: subscribers });
        }
        catch (err) {
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.getSubscribers = getSubscribers;
const createSubscribers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const subscriber = new subscribeModel_1.default(Object.assign({}, req.body));
            yield subscriber.save();
            console.log("Subscriber email: ", subscriber.email.trim());
            // await sendSubscriptionEmail(subscriber.email.trim());
            const subscribers = yield subscribeModel_1.default.find();
            res.status(201).json({ ok: true, message: "success", data: subscribers });
        }
        catch (err) {
            console.log("Error in subscriber: ", err);
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.createSubscribers = createSubscribers;
const deleteSubscribers = function (req, res) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const { id } = req.params;
            yield subscribeModel_1.default.findByIdAndDelete(id);
            const subscribers = yield subscribeModel_1.default.find();
            res.status(200).json({ ok: true, message: "success", data: subscribers });
        }
        catch (err) {
            res.status(500).json({ ok: false, message: "fail", errors: err });
        }
    });
};
exports.deleteSubscribers = deleteSubscribers;
