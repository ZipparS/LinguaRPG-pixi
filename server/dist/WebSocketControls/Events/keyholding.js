"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.keyholdingEventCallback = void 0;
const Model_1 = require("../../Model");
const keyholdingEventCallback = ({ key, sprinting, sequenceNumber }, { client }) => {
    Model_1.Store.locations[client.location].actors[client.name].sequenceNumber = sequenceNumber;
    switch (key) {
        case 'ArrowUp': {
            if (sprinting)
                client.y -= 2;
            else
                client.y -= 1;
            Model_1.Store.locations[client.location].actors[client.name].y = client.y;
            break;
        }
        case 'ArrowLeft': {
            if (sprinting)
                client.x -= 2;
            else
                client.x -= 1;
            Model_1.Store.locations[client.location].actors[client.name].x = client.x;
            break;
        }
        case 'ArrowDown': {
            if (sprinting)
                client.y += 2;
            else
                client.y += 1;
            Model_1.Store.locations[client.location].actors[client.name].y = client.y;
            break;
        }
        case 'ArrowRight': {
            if (sprinting)
                client.x += 2;
            else
                client.x += 1;
            Model_1.Store.locations[client.location].actors[client.name].x = client.x;
            break;
        }
    }
};
exports.keyholdingEventCallback = keyholdingEventCallback;
