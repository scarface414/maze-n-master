const matriCanvas = document.getElementById("canvas1");
const ctx = matriCanvas.getContext("2d");
//const ctx = matriCanvas.getContext("2d") ;

matriCanvas.width = window.innerWidth;
matriCanvas.height = window.innerHeight;

let gradient = ctx.createLinearGradient(
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

    console.log(this.symbols);
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
    ctx.fillStyle = `rgba(0,0,0,0.05)`;
    ctx.fillRect(0, 0, matriCanvas.width, matriCanvas.height);
    ctx.textAlign = "center";

    ctx.fillStyle = gradient; // '#0aff0a';
    ctx.font = effect.fontsize + "px monospace";
    effect.symbols.forEach((symbol) => symbol.draw(ctx));

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

  gradient = ctx.createLinearGradient(
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
