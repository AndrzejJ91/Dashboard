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
const express_1 = require("express");
const mqttModles_1 = __importDefault(require("../models/mqttModles"));
const router = (0, express_1.Router)();
// Endpoint zwracający wszystkie wiadomości zapisane w MongoDB
router.get('/', (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const message = yield mqttModles_1.default.find().sort({ createdAt: -1 });
        res.json(message);
    }
    catch (error) {
        console.error("Błąd podczas pobierania wiadomości:", error);
        res.status(500).json({ message: "Błąd podczas pobierania wiadomości" });
    }
    ;
}));
// Endpoint oznaczający wiadomość jako przeczytaną
router.patch(`/`, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const updatedMessage = yield mqttModles_1.default.findByIdAndUpdate(req.params.id, { isRead: true }, { new: true });
        res.json(updatedMessage);
    }
    catch (error) {
        console.error("Błąd podczas oznaczania wiadomości jako przeczytanej:", error);
        res.status(500).json({ message: "Błąd podczas oznaczania wiadomości jako przeczytanej" });
    }
    ;
}));
exports.default = router;
