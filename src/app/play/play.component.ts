import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-play',
  templateUrl: './play.component.html',
  styleUrls: ['./play.component.scss']
})
export class PlayComponent implements OnInit {
  limit: number;
  diamondCounter: number;
  clicks: number;
  maxClicks: number;
  objData: Array<object> = [];
  score: number;

  constructor() {
    // matrix 8*8
    this.limit = 8;
    this.diamondCounter = 0;
    this.clicks = 0;
    this.maxClicks = 64;
  }

  ngOnInit() {
    this.init();
  }

  reset() {
    this.objData = [];
    this.diamondCounter = 0;
    this.clicks = 0;
    this.init();
  }

  init() {
    for (let i = 1; i <= this.limit; i++) {
      let randomNumber = this.getRandomInt(1, 8);
      const row = [];
      for (let j = 1; j <= this.limit; j++) {
        row.push({
          'clicked': false,
          'diamond': (randomNumber == j) ? true : false
        });
        if ((randomNumber == j)) {
          console.log(i, j);
        }
      }
      this.objData.push(row);
    }
  }

  onClick(node) {
    if (node['clicked'] == false) {
      node['clicked'] = true;
      // node['question'] = false;
      // node['diamond'] = true;
      this.clicks = this.clicks + 1;
      if (node['diamond'] == true) {
        this.diamondCounter = this.diamondCounter + 1;
      }

      this.score = (this.maxClicks - this.clicks);
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
