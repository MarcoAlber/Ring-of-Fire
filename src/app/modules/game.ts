export class Game {
    public players: string[] = [];
    public player_images: string[] = [];
    public deck: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public takeCardAnimation = false;
    public currentCard: string = '';

    constructor() {
        for (let i = 1; i < 14; i++) {
            this.deck.push('diamonds_' + i);
            this.deck.push('clubs_' + i);
            this.deck.push('hearts_' + i);
            this.deck.push('spade_' + i);
        }
        shuffleArray(this.deck);
    }

    public toJson() {
        return {
            players: this.players,
            player_images: this.player_images,
            deck: this.deck,
            playedCards: this.playedCards,
            currentPlayer: this.currentPlayer,
            takeCardAnimation: this.takeCardAnimation,
            currentCard: this.currentCard
        };
    }
}

function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}