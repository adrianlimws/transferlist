export interface Player {
    name: string
    position: string
    price?: number
}

export interface TeamList {
    name: string
    players: Player[]
    backgroundColor: string
}
