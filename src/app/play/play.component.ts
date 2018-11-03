import {Component, OnInit} from '@angular/core';

interface Position {
  x: number;
  y: number;
}

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
  objStoreData: object;
  score: number;
  lastClick: Position;

  constructor() {
    // matrix 8*8
    this.limit = 8;
    this.diamondCounter = 0;
    this.clicks = 0;
    this.maxClicks = 64;
  }

  ngOnInit() {
    if (localStorage.getItem('actions')) {
      this.objStoreData = JSON.parse(localStorage.getItem('actions'));
    }
    this.init();
  }

  resume() {
    const data = Object.assign({}, this.objStoreData);

    this.objData = data['objData'];
    this.score = data['score'];
    this.clicks = data['clicks'];
    this.diamondCounter = data['diamondCounter'];

    this.objStoreData = [];
  }

  reset() {
    this.objData = [];
    this.diamondCounter = 0;
    this.clicks = 0;
    this.objStoreData = [];
    localStorage.setItem('actions', '');
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
        node['predictor'] = false;
        node['predictor_direction'] = '';
        this.diamondCounter = this.diamondCounter + 1;
      } else {
        this.checkPredictor(node);
      }

      this.logToStore();
    }
  }

  logToStore() {
    const logger = {
      objData: this.objData,
      score: this.score,
      clicks: this.clicks,
      diamondCounter: this.diamondCounter
    };
    localStorage.setItem('actions', JSON.stringify(logger));
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

    if (this.findInNode(y, xNext)) {
      //predictor to right
      node['predictor'] = true;
      node['predictor_direction'] = 'arrow__right';
    } else if (this.findInNode(y, xPrev)) {
      //predictor to left
      node['predictor'] = true;
      node['predictor_direction'] = 'arrow__left';
    } else if (this.findInNode(yNext, x)) {
      //predictor to bottom
      node['predictor'] = true;
      node['predictor_direction'] = 'arrow__bottom';
    } else if (this.findInNode(yPrev, x)) {
      //predictor to top
      node['predictor'] = true;
      node['predictor_direction'] = 'arrow__top';
    }

  }

  findInNode(i, j) {
    if (this.objData[i]
      && this.objData[i][j]
      && typeof(this.objData[i][j]['diamond']) !== undefined
      && typeof(this.objData[i][j]['clicked']) !== undefined
      && this.objData[i][j]['diamond'] === true
      && this.objData[i][j]['clicked'] === false) {
      return true;
    } else {
      return false;
    }
  }

  getRandomInt(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
  }

}
