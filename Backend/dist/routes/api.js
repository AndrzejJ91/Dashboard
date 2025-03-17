"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const router = (0, express_1.Router)();
router.get('/message', (req, res) => {
    res.send("Hello from API");
});
exports.default = router;
