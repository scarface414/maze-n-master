let maze = document.querySelector(".maze");
let ctx = maze.getContext("2d");

let current;

//classes of maze and cell

class Maze {
  constructor(size, rows, columns) {
    this.size = size;
    this.rows = rows;
    this.columns = columns;
    this.grid = [];
    this.stack = [];
  }

  setup() {
    for (let r = 0; r < this.rows; r++) {
      let row = [];
      for (let c = 0; c < this.columns; c++) {
        let cell = new Cell(r, c, this.grid, this.size);
        row.push(cell);
      }
      this.grid.push(row);
    }
    current = this.grid[0][0];
  }

  draw() {
    maze.width = this.size;
    maze.height = this.size;
    maze.style.background = "black";
    current.visited = true;

    for (let r = 0; r < this.rows; r++) {
      for (let c = 0; c < this.columns; c++) {
        let grid = this.grid;
        grid[r][c].show(this.size, this.rows, this.columns);
      }
    }

    let next = current.checkNeighbours();
    if (next) {
      next.visited = true;
      this.stack.push(current);

      current.highlight(this.columns);

      current.removeWall(current, next);
      current = next;
    } else if (this.stack.length > 0) {
      let cell = this.stack.pop();
      current = cell;
      current.highlight(this.columns);
    }

    if (this.stack.length == 0) {
      return;
    }

    window.requestAnimationFrame(() => {
      this.draw();
    });
  }
}

class Cell {
  constructor(rowNum, colNum, parentGrid, parentSize) {
    this.rowNum = rowNum;
    this.colNum = colNum;
    this.parentGrid = parentGrid;
    this.parentSize = parentSize;
    this.visited = false;

    //walls
    this.walls = {
      topWall: true,
      rightWall: true,
      bottomWall: true,
      leftWall: true,
    };
  }

  checkNeighbours() {
    let grid = this.parentGrid;
    let row = this.rowNum;
    let col = this.colNum;

    let neighbours = [];

    let top = row !== 0 ? grid[row - 1][col] : undefined;
    let right = col !== grid.length - 1 ? grid[row][col + 1] : undefined;
    let bottom = row != grid.length - 1 ? grid[row + 1][col] : undefined;
    let left = col !== 0 ? grid[row][col - 1] : undefined;

    if (top && !top.visited) neighbours.push(top);
    if (right && !right.visited) neighbours.push(right);
    if (left && !left.visited) neighbours.push(left);
    if (bottom && !bottom.visited) neighbours.push(bottom);

    if (neighbours.length !== 0) {
      let random = Math.floor(Math.random() * neighbours.length);
      return neighbours[random];
    } else {
      return undefined;
    }
  }

  drawTopWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x + size / columns, y);
    ctx.stroke();
  }

  drawRightWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x + size / columns, y);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  drawLeftWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.lineTo(x, y + size / rows);
    ctx.stroke();
  }

  drawBottomWall(x, y, size, columns, rows) {
    ctx.beginPath();
    ctx.moveTo(x, y + size / rows);
    ctx.lineTo(x + size / columns, y + size / rows);
    ctx.stroke();
  }

  highlight(columns) {
    let x = (this.colNum * this.parentSize) / columns + 1;
    let y = (this.rowNum * this.parentSize) / columns + 1;

    ctx.fillStyle = "purple";
    ctx.fillRect(
      x,
      y,
      this.parentSize / columns - 3,
      this.parentSize / columns - 3
    );
  }

  removeWall(cell1, cell2) {
    let x = cell1.colNum - cell2.colNum;
    let y = cell1.rowNum - cell2.rowNum;
    if (x === 1) {
      cell1.walls.leftWall = false;
      cell2.walls.rightWall = false;
    } else if (x === -1) {
      cell1.walls.rightWall = false;
      cell2.walls.leftWall = false;
    } else if (y === 1) {
      cell1.walls.topWall = false;
      cell2.walls.bottomWall = false;
    } else if (y === -1) {
      cell1.walls.bottomWall = false;
      cell2.walls.topWall = false;
    }
  }

  show(size, rows, columns) {
    let x = (this.colNum * size) / columns;
    let y = (this.rowNum * size) / rows;

    ctx.strokeStyle = "white";
    ctx.fillStyle = "black";
    ctx.lineWidth = 2;

    if (this.walls.topWall) this.drawTopWall(x, y, size, columns, rows);
    if (this.walls.rightWall) this.drawRightWall(x, y, size, columns, rows);
    if (this.walls.leftWall) this.drawLeftWall(x, y, size, columns, rows);
    if (this.walls.bottomWall) this.drawBottomWall(x, y, size, columns, rows);
    if (this.visited) {
      ctx.fillRect(x + 1, y + 1, size / columns - 2, size / rows - 2);
    }
  }
}

let newMaze = new Maze(500, 25, 25);
newMaze.setup();
newMaze.draw();

//assuming square grid

function download() {
  var download = document.getElementById("download");
  var image = document
    .getElementById("canvas")
    .toDataURL("image/png")
    .replace("image/png", "image/octet-stream");
  download.setAttribute("href", image);
}

// matrix.js starts

const matriCanvas = document.getElementById("canvas1");
const ctx1 = matriCanvas.getContext("2d");
//const ctx1 = matriCanvas.getContext("2d") ;

matriCanvas.width = window.innerWidth;
matriCanvas.height = window.innerHeight;

let gradient = ctx1.createLinearGradient(
  0,
  0,
  matriCanvas.width,
  matriCanvas.height
);
gradient.addColorStop(0, "red");
gradient.addColorStop(0.2, "yellow");
gradient.addColorStop(0.4, "green");
gradient.addColorStop(0.7, "cyan");
gradient.addColorStop(1, "magenta");

class Symbol {
  constructor(x, y, fontsize, matriCanvasHeight) {
    this.characters =
      "ァカサタナハマヤャラワガザダバパイィキシチニヒミリヰギジヂビピウゥクスツヌフムユュルグズブヅプエェケセテネヘメレヱゲゼデベペオォコソトホモヨョロヲゴゾドボポヴッン0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    this.x = x;
    this.y = y;
    this.fontsize = fontsize;
    this.matriCanvasHeight = matriCanvasHeight;
  }

  getRandomIndex = () => {
    return Math.floor(Math.random() * this.characters.length);
  };

  draw(context) {
    let index = this.getRandomIndex();
    this.text = this.characters.charAt(index);

    //context.fillStyle = '#0aff0a';
    context.fillText(this.text, this.x * this.fontsize, this.y * this.fontsize);

    this.y =
      this.y * this.fontsize > this.matriCanvasHeight && Math.random() > 0.975
        ? 0
        : this.y + 1;
  }
}

class Effect {
  constructor(matriCanvasWidth, matriCanvasHeight) {
    this.matriCanvasWidth = matriCanvasWidth;
    this.matriCanvasHeight = matriCanvasHeight;

    this.fontsize = 25;
    this.columns = this.matriCanvasWidth / this.fontsize;
    this.symbols = [];
    this.#initialize();

    // console.log(this.symbols);
  }
  #initialize() {
    for (let i = 0; i < this.columns; i++) {
      this.symbols[i] = new Symbol(i, 0, this.fontsize, this.matriCanvasHeight);
    }
  }

  resize(width, height) {
    this.matriCanvasHeight = height;
    this.matriCanvasWidth = width;
    this.columns = this.matriCanvasWidth / this.fontsize;
    this.symbols = [];
    this.#initialize();
  }
}

const effect = new Effect(matriCanvas.width, matriCanvas.height);

let lastTime = 0;
const fps = 30;
const nextFrame = 1000 / fps;
let timer = 0;

function animate(timestamp) {
  const deltaTime = timestamp - lastTime;
  lastTime = timestamp;
  if (timer > nextFrame) {
    ctx1.fillStyle = `rgba(0,0,0,0.05)`;
    ctx1.fillRect(0, 0, matriCanvas.width, matriCanvas.height);
    ctx1.textAlign = "center";

    ctx1.fillStyle = gradient; // '#0aff0a';
    ctx1.font = effect.fontsize + "px monospace";
    effect.symbols.forEach((symbol) => symbol.draw(ctx1));

    timer = 0;
  } else {
    timer += deltaTime;
  }
  requestAnimationFrame(animate);
}
animate(0);

//make it dynamic

window.addEventListener("resize", function () {
  matriCanvas.width = window.innerWidth;
  matriCanvas.height = window.innerHeight;
  effect.resize(matriCanvas.width, matriCanvas.height);

  gradient = ctx1.createLinearGradient(
    0,
    0,
    matriCanvas.width,
    matriCanvas.height
  );
  gradient.addColorStop(0, "red");
  gradient.addColorStop(0.2, "yellow");
  gradient.addColorStop(0.4, "green");
  gradient.addColorStop(0.7, "cyan");
  gradient.addColorStop(1, "magenta");
});
