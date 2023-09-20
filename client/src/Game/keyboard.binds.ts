import type { KeyboardKeys } from "@/Controller/Keyboard/Keyboard";
import type { Controller } from "@/Controller";
import { Store } from "@/Model";

export const keyBinds = ({ websocket }: Controller): KeyboardKeys => {
    let sequenceNumber = 0;
    return {
        holding: {
            ArrowUp: ({ hasSomeKeysHeld, playerInputs }) => {
                if (hasSomeKeysHeld('Shift')) {
                    sequenceNumber++;
                    playerInputs.push({ sequenceNumber, dx: 0, dy: -2 });

                    Store.player.setYposition((prevY) => prevY - 2);
                    websocket.send(JSON.stringify({ keyholding: {
                        key: 'ArrowUp',
                        sprinting: true,
                        sequenceNumber,
                    } }))
                } else {
                    sequenceNumber++;
                    playerInputs.push({ sequenceNumber, dx: 0, dy: -1 });

                    Store.player.setYposition((prevY) => prevY - 1);
                    websocket.send(JSON.stringify({ keyholding: {
                        key: 'ArrowUp',
                        sprinting: false,
                        sequenceNumber,
                    } }))
                }
            },
            ArrowLeft: ({ hasSomeKeysHeld, playerInputs }) => {
                if (hasSomeKeysHeld('Shift')) {
                    sequenceNumber++;
                    playerInputs.push({ sequenceNumber, dx: -2, dy: 0 });

                    Store.player.setXposition((prevX) => prevX - 2);
                    websocket.send(JSON.stringify({ keyholding: {
                        key: 'ArrowLeft',
                        sprinting: true,
                        sequenceNumber,
                    } }))
                } else {
                    sequenceNumber++;
                    playerInputs.push({ sequenceNumber, dx: -1, dy: 0 });

                    Store.player.setXposition((prevX) => prevX - 1);
                    websocket.send(JSON.stringify({ keyholding: {
                        key: 'ArrowLeft',
                        sprinting: false,
                        sequenceNumber,
                    } }))
                }
            },
            ArrowDown: ({ hasSomeKeysHeld, playerInputs }) => {
                if (hasSomeKeysHeld('Shift')) {
                    sequenceNumber++;
                    playerInputs.push({ sequenceNumber, dx: 0, dy: 2 });

                    Store.player.setYposition((prevY) => prevY + 2);
                    websocket.send(JSON.stringify({ keyholding: {
                        key: 'ArrowDown',
                        sprinting: true,
                        sequenceNumber,
                    } }))
                } else {
                    sequenceNumber++;
                    playerInputs.push({ sequenceNumber, dx: 0, dy: 1 });

                    Store.player.setYposition((prevY) => prevY + 1);
                    websocket.send(JSON.stringify({ keyholding: {
                        key: 'ArrowDown',
                        sprinting: false,
                        sequenceNumber,
                    } }))
                }
            },
            ArrowRight: ({ hasSomeKeysHeld, playerInputs }) => {
                if (hasSomeKeysHeld('Shift')) {
                    sequenceNumber++;
                    playerInputs.push({ sequenceNumber, dx: 2, dy: 0 });

                    Store.player.setXposition((prevX) => prevX + 2);
                    websocket.send(JSON.stringify({ keyholding: {
                        key: 'ArrowRight',
                        sprinting: true,
                        sequenceNumber,
                    } }))
                } else {
                    sequenceNumber++;
                    playerInputs.push({ sequenceNumber, dx: 1, dy: 0 });

                    Store.player.setXposition((prevX) => prevX + 1);
                    websocket.send(JSON.stringify({ keyholding: {
                        key: 'ArrowRight',
                        sprinting: false,
                        sequenceNumber,
                    } }))
                }
            },
            Shift: () => {}
        },
        unholded: {
            ArrowUp: ({ hasSomeKeysHeld }) => {
                
            },
            ArrowLeft: ({ hasSomeKeysHeld }) => {
                
            },
            ArrowDown: ({ hasSomeKeysHeld }) => {
                
            },
            ArrowRight: ({ hasSomeKeysHeld }) => {
                
            },
        },
        pressing: {
            q: () => {
                if (!Store.player) return
                Store.player.visible = !Store.player.visible;
            },
            ' ': () => {
                Store.player.setYposition((prevY) => prevY - 100);
                console.log('jump')
            }
        }
    }
}