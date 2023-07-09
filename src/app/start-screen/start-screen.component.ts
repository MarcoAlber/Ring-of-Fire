import { Component } from '@angular/core';
import { Firestore, addDoc, collection } from '@angular/fire/firestore';
import { Router } from '@angular/router';
import { Game } from '../modules/game';

@Component({
  selector: 'app-start-screen',
  templateUrl: './start-screen.component.html',
  styleUrls: ['./start-screen.component.scss']
})
export class StartScreenComponent {
  game: Game;
  constructor(private firestore: Firestore, private router: Router) {
    this.game = new Game();
  }

  newGame() {
    let itemCollection = collection(this.firestore, 'games');
    addDoc(itemCollection, { game: this.game.toJson() }).then((gameInfo) => {
      this.router.navigateByUrl(`/game/${gameInfo.id}`);
    });
  }
}
