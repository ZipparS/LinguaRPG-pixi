import { Store } from "../../Model";
import { WebSocketControls, Client } from "../../WebSocketControls/WebSocketControls";

export const keyholdingEventCallback = (
    { key, sprinting, sequenceNumber }: { key: string, sprinting: boolean, sequenceNumber: number }, 
    { client }: WebSocketControls & { client: Client }
) => {
    Store.locations[client.location].actors[client.name].sequenceNumber = sequenceNumber;
    switch (key) {
        case 'ArrowUp': {
            if (sprinting) client.y -= 2;
            else client.y -= 1;
                
            Store.locations[client.location].actors[client.name].y = client.y;
            break;
        }
        case 'ArrowLeft': {
            if (sprinting) client.x -= 2; 
            else client.x -= 1;
                
            Store.locations[client.location].actors[client.name].x = client.x;
            break;
        }
        case 'ArrowDown': {
            if (sprinting) client.y += 2;
            else client.y += 1;

            Store.locations[client.location].actors[client.name].y = client.y;
            break;
        }
        case 'ArrowRight': {
            if (sprinting) client.x += 2;
            else client.x += 1;

            Store.locations[client.location].actors[client.name].x = client.x;
            break;
        }
    }
}