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
  lastClick: Object;

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
          'x': j,
          'y': i,
          'clicked': false,
          'diamond': (randomNumber == j) ? true : false
        });
        if ((randomNumber == j)) {

          //Log for testing
          console.log(i, j);
        }
      }
      this.objData.push(row);
    }
  }

  onClick(node) {
    if (node['clicked'] == false) {
      node['clicked'] = true;
      this.clicks = this.clicks + 1;
      this.score = (this.maxClicks - this.clicks);
      if (node['diamond'] == true) {
        this.diamondCounter = this.diamondCounter + 1;
      }

      this.checkPredictor(node);
    }
  }

  checkPredictor(node) {
    let {x, y} = node;
    y--;
    x--;

    //Click last click to remove predictor
    if (this.lastClick) {
      const {x, y} = this.lastClick;
      this.objData[y][x]['predictor'] = false;
      this.objData[y][x]['predictor_direction'] = '';
    }

    //Log last click
    this.lastClick = {x, y};

    //Next and Prev nodes
    let xNext = x + 1;
    let xPrev = x - 1;

    let yNext = y + 1;
    let yPrev = y - 1;

    if (this.objData[y] && this.objData[y][xNext] && this.objData[y][xNext]['diamond'] == true && this.objData[y][xNext]['clicked'] == false) {
      //predictor to right
      node['predictor'] = true;
      node['predictor_direction'] = 'arrow__right';
    } else if (this.objData[y] && this.objData[y][xPrev] && this.objData[y][xPrev]['diamond'] == true && this.objData[y][xPrev]['clicked'] == false) {
      //predictor to left
      node['predictor'] = true;
      node['predictor_direction'] = 'arrow__left';
    } else if (this.objData[yNext] && this.objData[yNext][x] && this.objData[yNext][x]['diamond'] == true && this.objData[yNext][x]['clicked'] == false) {
      //predictor to bottom
      node['predictor'] = true;
      node['predictor_direction'] = 'arrow__bottom';
    } else if (this.objData[yNext] && this.objData[yPrev][x] && this.objData[yPrev][x]['diamond'] == true && this.objData[yPrev][x]['clicked'] == false) {
      //predictor to top
      node['predictor'] = true;
      node['predictor_direction'] = 'arrow__top';
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
