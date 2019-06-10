let gridSize = 40;
let grid = [];
let tiles = [];
let startPosition = 5;
let mySound;
let score = 0;
// let colors = ["blue", "red", "green", "purple", "cyan", "orange"];

// function preload() {
// mySound = loadSound('line.mp3');
// }

function setup() {
  createCanvas(400, 800);
  setFrameRate(4);
  for (let i = 0; i < height / gridSize; i ++) {
    grid[i] = [];
    for (let j = 0; j < width / gridSize; j++) {
      grid[i][j] = 0;
    }
  }
  // debugger;
  tiles.push(new Shape(startPosition, -2));
}
  

function draw() {
  background(0);

  for (let tile of tiles) {
    tile.show();
    tile.move();
    
    if (tile.gameOver()){
      noLoop();
      alert("Game Over: You Lose");
    }
  }

  for (let tile of tiles) {
    if (tile.moving && tile.hitBottom()) {

      tiles.push(new Shape(startPosition, -2));
      tile.moving = false;
      for (let i = 0; i < tile.shape.length; i++){
        grid[tile.shape[i].y][tile.shape[i].x] = 1;
      }
    }
  }


  for (let i = 0; i < grid.length; i++) {
    if (checkRow(grid[i])) {
        deleteFullRow(i);
    }
  }
}

function checkIfFull(value) {
  return value > 0;
}

function checkRow(row) {
  return row.every(checkIfFull); // error row is 0
}

function deleteFullRow(y) {
  // remove tiles from full row y
  for (let i = tiles.length - 1; i >= 0; i--) {
    for (let j = tiles[i].shape.length - 1; j >=0; j--) {
      if (tiles[i].shape[j].y == y) {
        tiles[i].shape.splice(j, 1);
        console.log("spliced");
      }
    }
  }

  // delete full row from grid and add new row on top
  let newRow = [];
  for (let j = 0; j < width / gridSize; j++) {
    newRow[j] = 0;
  }
  grid.splice(y, 1);
  grid.unshift(newRow);
  console.table[grid];

  // move remaining tiles down
  for (let i = tiles.length - 1; i >= 0; i--) {
    for (let j = tiles[i].shape.length - 1; j >=0; j--) {
      if (tiles[i].shape[j].y < y) {
        tiles[i].shape[j].y++;
      }
    }
  }
  // mySound.play();
}

class Shape {
  constructor(x, y) {
    this.x = x;
    this.y = y;
    this.r = Math.floor(random(7));
    this.shapes = getShape(x, y, this.r);
    this.index = 0;
    this.shape = this.shapes[0];
    this.xv = 1;
    this.yv = 1;
    this.moving = true;
    this.color = getColor(this.r);
  }
  show() {
    fill(this.color);
    stroke(0);
    strokeWeight(2);
    for (let i = 0; i < this.shape.length; i++) {
      rect(this.shape[i].x * gridSize, this.shape[i].y * gridSize, gridSize, gridSize);
    }

  }
  move() {
    if (this.moving) {
      if (keyIsDown(LEFT_ARROW) && canMoveX(this, -1)){
        this.x -= this.xv;
        for (let i = 0; i < this.shape.length; i++) {
            this.shape[i].x -= this.xv;
        }
      }

      else if (keyIsDown(RIGHT_ARROW) && canMoveX(this, 1)){
        this.x += this.xv;
        for (let i = 0; i < this.shape.length; i++) {
            this.shape[i].x += this.xv;
        }
      }
      else if(keyIsDown(UP_ARROW)) {
        this.index = (this.index + 1) % 4;
        // let x = this.shape[this.index].x;
        // let y = this.shape[this.index].y + 3;
        this.shape = this.shapes[this.index];
        for (let i = 0; i < this.shapes.length; i++) {
          this.shape[i].x += this.x - startPosition;
          this.shape[i].y += this.y + 2 ;
        }

      }

      else {
        this.y += this.yv;
        for (let i = 0; i < this.shape.length; i++) {
          this.shape[i].y += this.yv;
        }
      }
    }
  }
  
  gameOver() {
    for (let i = 0; i < this.shape.length; i++) {
      if (this.shape[i].y == -1 && grid[0][this.shape[i].x]) {
        return true;
      }
    }
    return false;
  }

  hitBottom() {
    for (let i = 0; i < this.shape.length; i++) {
      if (this.shape[i].y > 0 && ((this.shape[i].y == height / gridSize - 1) || grid[this.shape[i].y + 1][this.shape[i].x])) {
        this.yv = 0;
        this.xv = 0;
        return true;
      }

    }
    return false;
  }
}

function canMoveX(tile, direction) {
  for (let i = 0; i < tile.shape.length; i++) {
    if (tile.shape[i].y < 0) {
      return false;
    }

    // if (direction == -1 && !(tile.shape[i].x > 0 && !grid[tile.shape[i].y + 1][tile.shape[i].x + direction])) {
    if (direction == -1 && (tile.shape[i].x <= 0 || grid[tile.shape[i].y + 1][tile.shape[i].x + direction])) {
      return false;
    }

    else if (direction == 1 && (tile.shape[i].x >= width  / gridSize - 1 || grid[tile.shape[i].y+ 1][tile.shape[i].x + direction])) {
      return false;
    }
  }
  return true;

}

function getShape(x, y, r) {
  shape1 = [[{x: x, y: y}, {x: x+1, y: y}, {x: x+2, y: y}, {x: x+3, y: y}], [{x: x, y: y}, {x: x, y: y+1}, {x: x, y: y+2}, {x: x, y: y+3}],[{x: x, y: y}, {x: x+1, y: y}, {x: x+2, y: y}, {x: x+3, y: y}],[{x: x, y: y}, {x: x, y: y+1}, {x: x, y: y+2}, {x: x, y: y+3}]];
  shape2 = [[{x: x, y: y}, {x: x+1, y: y}, {x: x+1, y: y+1}, {x: x+2, y: y}], [{x: x+1, y: y}, {x: x, y: y+1}, {x: x+1, y: y+1}, {x: x+1, y: y+2}], [{x: x+1, y: y}, {x: x, y: y+1}, {x: x+1, y: y+1}, {x: x+2, y: y+1}], [{x: x, y: y}, {x: x, y: y+1}, {x: x+1, y: y+1}, {x: x, y: y+2}]];
  shape3 = [[{x: x, y: y}, {x: x+1, y: y}, {x: x+1, y: y+1}, {x: x+2, y: y+1}], [{x: x+1, y: y}, {x: x, y: y+1}, {x: x+1, y: y+1}, {x: x, y: y+2}], [{x: x, y: y}, {x: x+1, y: y}, {x: x+1, y: y+1}, {x: x+2, y: y+1}], [{x: x+1, y: y}, {x: x, y: y+1}, {x: x+1, y: y+1}, {x: x, y: y+2}]];
  shape4 = [[{x: x, y: y}, {x: x+1, y: y}, {x: x, y: y+1}, {x:x+1, y: y+1}], [{x: x, y: y}, {x: x+1, y: y}, {x: x, y: y+1}, {x: x+1, y: y+1}], [{x: x, y: y}, {x: x+1, y: y}, {x: x, y: y+1}, {x: x+1, y: y+1}], [{x: x, y: y}, {x: x+1, y: y}, {x: x, y: y+1}, {x: x+1, y: y+1}]];
  shape5 = [[{x: x+1, y: y}, {x: x +2, y: y}, {x: x , y: y+1}, {x: x +1, y: y+1}], [{x: x , y: y}, {x: x , y: y+1}, {x: x +1, y: y+1}, {x: x +1, y: y+2}], [{x: x +1, y: y}, {x: x +2, y: y}, {x: x , y: y+1}, {x: x +1, y: y+1}], [{x: x , y: y}, {x: x , y: y+1}, {x: x +1, y: y+1}, {x: x +1, y: y+2}]];
  shape6 = [[{x: x , y: y}, {x: x , y: y+1}, {x: x +1, y: y+1}, {x: x +2, y: y+1}], [{x: x , y: y}, {x: x +1, y: y}, {x: x , y: y+1}, {x: x , y: y+2}], [{x: x , y: y}, {x: x +1, y: y}, {x: x +2, y: y}, {x: x +2, y: y+1}], [{x: x +1, y: y}, {x: x +1, y: y+1}, {x: x +1, y: y+2}, {x: x , y: y+2}]];
  shape7 = [[{x: x , y: y+1}, {x: x +1, y: y+1}, {x: x +2, y: y+1}, {x: x +2, y: y}], [{x: x , y: y}, {x: x , y: y+1}, {x: x , y: y+2}, {x: x +1, y: y+2}], [{x: x , y: y}, {x: x +1, y: y}, {x: x +2, y: y}, {x: x , y: y+1}], [{x: x , y: y}, {x: x +1, y: y}, {x: x +1, y: y+1}, {x: x +1, y: y+2}]];
  let possibleShapes = [shape1, shape2, shape3, shape4, shape5, shape6, shape7];
  return possibleShapes[r];
}

function getColor(r) {
  let colors = ["cyan", "purple", "red", "yellow", "green", "blue", "orange"]
  return colors[r]
}

function checkFullLine(y) {
  for (let i = 0; i < grid.length; i++){
    grid[y][i] = 1; // full
  }
}

