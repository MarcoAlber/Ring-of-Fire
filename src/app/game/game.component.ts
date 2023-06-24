import { Component, OnInit } from '@angular/core';
import { Game } from '../modules/game';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {
  takeCardAnimation = false;
  currentCard: string = '';
  game: Game;

  constructor() {
    this.game = new Game();
  }

  ngOnInit(): void {
    this.newGame();
  }

  newGame() {
    this.game = new Game();
    console.log(this.game);
  }

  takeCard() {
    if (!this.takeCardAnimation) {
      this.currentCard = this.game.deck.pop() as string;
      this.takeCardAnimation = true;
      this.game.playedCards.push(this.currentCard);

      setTimeout(() => {
        this.takeCardAnimation = false;
      }, 1250);
    }
  }
}
