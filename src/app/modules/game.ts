export class Game {
    public players: string[] = [];
    public player_images: string[] = [];
    public deck: string[] = [];
    public playedCards: string[] = [];
    public currentPlayer: number = 0;
    public takeCardAnimation = false;
    public currentCard: string = '';

    constructor() {
        this.createDeck();
    }

    /** push all cards into deck array and shuffle the cards */
    public createDeck() {
        for (let i = 1; i < 14; i++) {
            this.deck.push('diamonds_' + i);
            this.deck.push('clubs_' + i);
            this.deck.push('hearts_' + i);
            this.deck.push('spade_' + i);
        }
        shuffleArray(this.deck);
    }

    /**
     * changes game elements into a json
     * @returns json of all game elements
     */
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

/**
 * shuffle the deck, so each game is random
 * @param array of the deck
 */
function shuffleArray(array: string[]) {
    for (let i = array.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1));
        [array[i], array[j]] = [array[j], array[i]];
    }
}