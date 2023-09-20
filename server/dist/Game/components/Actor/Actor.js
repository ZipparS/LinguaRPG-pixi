"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Actor = void 0;
class Actor {
    constructor({ name, type, texture, portrait, sequenceNumber, x, y }) {
        this.display = true;
        this.name = name;
        this.type = type;
        this.textrue = texture;
        this.portrait = portrait;
        this.sequenceNumber = sequenceNumber || 0;
        this.x = x || 0;
        this.y = y || 0;
    }
}
exports.Actor = Actor;
