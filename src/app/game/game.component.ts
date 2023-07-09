import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from '../modules/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, doc, setDoc, getFirestore, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-game',
  templateUrl: './game.component.html',
  styleUrls: ['./game.component.scss']
})
export class GameComponent implements OnInit {

  game: Game;
  gameId: string = '';
  item$: Observable<any> | undefined;
  card: any;
  firestore: Firestore = inject(Firestore);
  cardStyle: any = {};

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.game = new Game();
  }

  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      console.log(params['id']);

      const itemCollection = collection(this.firestore, 'games');
      const pathId = doc(itemCollection, params['id']);
      this.gameId = params['id'];
      this.item$ = docData(pathId);
      this.item$.subscribe((newCard) => {
        console.log('Test', newCard);
        this.game.currentPlayer = newCard['game'].currentPlayer;
        this.game.playedCards = newCard['game'].playedCards;
        this.game.deck = newCard['game'].deck;
        this.game.players = newCard['game'].players;
        this.game.takeCardAnimation = newCard['game'].takeCardAnimation;
        this.game.currentCard = newCard['game'].currentCard;
        this.card = newCard;
      });
    });
  }

  newGame() {
    this.game = new Game();
    //addDoc(itemCollection, { game: this.game.toJson() });
  }

  updateGame() {
    const itemCollection = collection(this.firestore, 'games');
    const pathId = doc(itemCollection, this.gameId);
    setDoc(pathId, { game: this.game.toJson() });
  }

  takeCard() {
    if (!this.game.takeCardAnimation && this.minTwoPlayers()) {
      this.game.currentCard = this.game.deck.pop() as string;
      this.game.takeCardAnimation = true;
      this.game.playedCards.push(this.game.currentCard);

      if (this.game.currentPlayer < this.game.players.length - 1) {
        this.game.currentPlayer++;
      }
      else {
        this.game.currentPlayer = 0;
      }
      this.updateGame();

      setTimeout(() => {
        this.game.takeCardAnimation = false;
        this.updateGame();
      }, 1250);
    }
    if (!this.minTwoPlayers()) {
      this.swapTextColor();
    }
  }

  swapTextColor() {
    this.cardStyle = { color: 'red' };

    setTimeout(() => {
      this.cardStyle = { color: 'black' };
    }, 1500);
  }

  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);

    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.updateGame();
      }
    });
  }

  minTwoPlayers() {
    return this.game.players.length > 1;
  }
}
