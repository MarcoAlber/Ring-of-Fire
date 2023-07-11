import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-player',
  templateUrl: './edit-player.component.html',
  styleUrls: ['./edit-player.component.scss']
})
export class EditPlayerComponent {

  allProfilePictures = [
    '1.webp',
    '2.png',
    '3.png',
    'monkey.png',
    'pinguin.svg',
    'serious-woman.svg',
    'winkboy.png'
  ];

}
