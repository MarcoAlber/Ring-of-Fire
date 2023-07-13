import { Component, OnInit, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { Game } from '../modules/game';
import { DialogAddPlayerComponent } from '../dialog-add-player/dialog-add-player.component';
import { Firestore, collection, doc, setDoc, docData } from '@angular/fire/firestore';
import { Observable } from 'rxjs';
import { ActivatedRoute } from '@angular/router';
import { EditPlayerComponent } from '../edit-player/edit-player.component';
import { NewGameComponent } from '../new-game/new-game.component';

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
  gameOver = false;
  card_sound = new Audio('assets/audio/card.mp3');

  constructor(private route: ActivatedRoute, public dialog: MatDialog) {
    this.game = new Game();
  }

  /** creates new game and set database to firebase */
  ngOnInit(): void {
    this.newGame();
    this.route.params.subscribe((params) => {
      const itemCollection = collection(this.firestore, 'games');
      const pathId = doc(itemCollection, params['id']);
      this.gameId = params['id'];
      this.item$ = docData(pathId);
      this.item$.subscribe((newCard) => {
        console.log(newCard);

        this.setDatabase(newCard);
      });
    });
  }

  /**
   * sets the database of all game elements into firebase
   * @param newCard json of game elements
   */
  setDatabase(newCard: any) {
    this.game.currentPlayer = newCard['game'].currentPlayer;
    this.game.playedCards = newCard['game'].playedCards;
    this.game.deck = newCard['game'].deck;
    this.game.players = newCard['game'].players;
    this.game.player_images = newCard['game'].player_images;
    this.game.takeCardAnimation = newCard['game'].takeCardAnimation;
    this.game.currentCard = newCard['game'].currentCard;
    this.card = newCard;
  }

  /** starts a new game */
  newGame() {
    this.game = new Game();
  }

  /** updates the game elements into firebase */
  updateGame() {
    const itemCollection = collection(this.firestore, 'games');
    const pathId = doc(itemCollection, this.gameId);
    setDoc(pathId, { game: this.game.toJson() });
  }

  /** takes a new card if at least 2 players are in the game and there is still cards in the deck */
  takeCard() {
    if (!this.minTwoPlayers()) {
      this.swapTextColor();
    }
    if (this.game.deck.length == 1) {
      this.turnCard();
      setTimeout(() => {
        this.restartOption();
      }, 1750);
    }
    else if (!this.game.takeCardAnimation && this.minTwoPlayers()) {
      this.turnCard();
    }
  }

  /** turns the card and changes the current player */
  turnCard() {
    this.turnCardAction();

    if (this.game.currentPlayer < this.game.players.length - 1) {
      this.game.currentPlayer++;
    }
    else {
      this.game.currentPlayer = 0;
    }

    this.updateGame();
    this.animationTimeout();
  }

  /** takes the last card of the deck and plays a sound */
  turnCardAction() {
    this.game.currentCard = this.game.deck.pop() as string;
    this.game.takeCardAnimation = true;
    this.game.playedCards.push(this.game.currentCard);
    this.card_sound.play();
  }

  /** set a timeout of 1,25 sec for the card animation */
  animationTimeout() {
    setTimeout(() => {
      this.game.takeCardAnimation = false;
      this.updateGame();
    }, 1250);
  }

  /** opens a dialog to restart the game */
  restartOption() {
    this.gameOver = true;
    const dialogRef = this.dialog.open(NewGameComponent);
    dialogRef.disableClose = true;
    dialogRef.afterClosed().subscribe(() => {
      this.gameOver = false;
      this.game.createDeck();
      this.game.playedCards = [];
      this.game.currentCard = '';
    });
  }

  /** swaps the color of the mat-card into red if card is pressed and there is less than 2 players in the game */
  swapTextColor() {
    this.cardStyle = { color: 'red' };

    setTimeout(() => {
      this.cardStyle = { color: 'black' };
    }, 1500);
  }

  /** opens the dialog to add a new player and pushs a new player into the game */
  openDialog(): void {
    const dialogRef = this.dialog.open(DialogAddPlayerComponent);
    dialogRef.afterClosed().subscribe((name: string) => {
      if (name && name.length > 0) {
        this.game.players.push(name);
        this.game.player_images.push('1.webp');
        this.updateGame();
      }
    });
  }

  /**
   * returns true if there is more than 1 player in the game
   * @returns true or false
   */
  minTwoPlayers() {
    return this.game.players.length > 1;
  }

  /**
   * opens dialog to edit a player and give the option to delete the player or change the image
   * @param playerId id of clicked player
   */
  editPlayer(playerId: number) {
    const dialogRef = this.dialog.open(EditPlayerComponent);
    dialogRef.afterClosed().subscribe((change: string) => {
      if (change) {
        if (change == 'DELETE') {
          this.game.players.splice(playerId, 1);
          this.game.player_images.splice(playerId, 1);
        }
        else {
          this.game.player_images[playerId] = change;
        }
        this.updateGame();
      }
    });
  }
}