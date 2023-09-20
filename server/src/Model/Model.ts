import { home, homeTown } from "../Game/locations"
import type { GameLocation } from "../Game/components/Location"

export class Store {
    static locations: { [key: string]: GameLocation } = {
        home,
        homeTown
    }
}