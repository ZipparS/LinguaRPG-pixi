"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Progress = exports.progressSchema = exports.Account = exports.accountSchema = void 0;
const mongoose_1 = require("mongoose");
exports.accountSchema = new mongoose_1.Schema({
    username: String,
    password: String,
}, { collection: 'account' });
exports.Account = (0, mongoose_1.model)('account', exports.accountSchema);
exports.progressSchema = new mongoose_1.Schema({
    name: String,
    username: String,
    questsCompleted: (Array),
    location: String,
    x: Number,
    y: Number,
    texture: String,
    portrait: String,
    online: Boolean,
}, { collection: 'progress' });
exports.Progress = (0, mongoose_1.model)('progress', exports.progressSchema);
