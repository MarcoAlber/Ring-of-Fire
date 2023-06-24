export class Game {
    public players: string[] = [];
    public deck: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;

    constructor() {
        for (let i = 1; i < 14; i++) {
            this.deck.push('../assets/img/cards/diamonds_' + i + ".png");
            this.deck.push('../assets/img/cards/clubs_' + i + ".png");
            this.deck.push('../assets/img/cards/hearts_' + i + ".png");
            this.deck.push('../assets/img/cards/spade_' + i + ".png");
        }
        shuffleArray(this.deck);
    }
}

function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}