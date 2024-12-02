let player = { 
  x: 190, 
  y: 700, 
  speed: 2, 
  currentImg: null, 
  currentState: 0, 
  direction: "up",
  width:50,
  height:50

  
};
var counter = 60;
let state = "start";
let bookImg;
let leftImgs = [];
let rightImgs = [];
let upImgs = [];
let downImgs = [];
let bckgrnd;
let books = []; // Array to hold book objects
let booksCollected = 0;
let playerWidth = 40; // width and height of the player to check collisions
let playerHeight = 40;
let buildingImages = [];
let npcImages = [];
let coffees = []; 
let coffeeCollected = 0;
let coffeeimg;
let clocks= [];


let npcs = [];
class NPC {
  constructor(x, y, width, height, img, messages){
    this.x = x;
    this.y = y;
    this.width = width;
    this.height = height;
    this.img = img;
    this.messages = messages;
    this.currentMessageIndex = 0;
    this.showTextBox = false;
  }

  draw(){
    image(this.img, this.x, this.y, this.width, this.height);
    if(this.showTextBox){
      push();
      fill(255);
      stroke(0);
      strokeWeight(3);
      rect(10, 600, 1250, 180); //Text box
      pop();
      push();
      fill(0);
      textFont('Verdana');
      textSize(20);
      textAlign(CENTER, CENTER);
      text(this.messages[this.currentMessageIndex], 1290/2, 700);
      pop();
    }
  }


  nextMessage(){
    if (this.showTextBox){
      this.currentMessageIndex++;
      if (this.currentMessageIndex >= this.messages.length){
        this.currentMessageIndex = 0;
        this.showTextBox = false;
      }
    }
  }

  npcCollision(){
    if (
      player.x < this.x + this.width &&
      player.x + player.width > this.x &&
      player.y < this.y + this.height &&
      player.y + player.height > this.y
    ){
      this.showTextBox = true;
      return true;
    } else {
      this.showTextBox = false;
      return false;
    }
  }
}

let buildings = [];

class Building {
  constructor(x, y, width, height, img) {
    this.x = x; 
    this.y = y; 
    this.width = width; 
    this.height = height;
    this.img = img; 
  }
 // draw the building
  draw() {
    image(this.img, this.x, this.y, this.width, this.height);
  }
}

function preload() {
  bckgrnd = loadImage('map.png');
  bookImg = loadImage('Book.png');
  coffeeimg= loadImage('Coffee.png');
  clockImg = loadImage('Clock.png');
 
  for (let i = 0; i < 5; i++) {
    buildingImages.push(loadImage(`building${i}.png`)); 
  }
  for (let i = 0; i < 3; i++) {
    leftImgs[i] = loadImage(`left_${i}.png`); 
    rightImgs[i] = loadImage(`right_${i}.png`);
    upImgs[i] = loadImage(`up_${i}.png`);
    downImgs[i] = loadImage(`down_${i}.png`);
  }

  for (let i = 0; i < 4 ; i++){
    npcImages[i]= loadImage(`npc${i}.png`);
  }
  
}
//control the random position for book and coffe to avoid buildings posit
function checkPosition(x, y, width, height) {
  for (let building of buildings) {
    if (
      x < building.x + building.width+60 &&
      x + width > building.x-60 &&
      y < building.y + building.height+60 &&
      y + height > building.y-60
    ) { 
      return false; 
    }
  }
  

 /* for (let book of books) {
    if (
      x < book.x + 20 && // Book width
      x + width > book.x &&
      y < book.y + 20 && // Book height
      y + height > book.y
    ) {
      return false; // Invalid position
    }
  }*/
 
  for (let coffee of coffees) {
    if (
      x < coffee.x + 20 && 
      x + width > coffee.x &&
      y < coffee.y + 20 && 
      y + height > coffee.y
    ) {
      return false; 
    }
  }
  for (let clock of clocks) {
    if (
      x < clock.x + 20 &&
      x + width > clock.x &&
      y < clock.y + 20 &&
      y + height > clock.y
    ) {
      return false; 
    }
  }
  return true; 
  
  
  
}

function setup() {
  createCanvas(1300, 800);
  player.currentImg = downImgs[0];

  buildings.push(new Building(28, 308, 170, 130, buildingImages[0])); 
  buildings.push(new Building(1000, 300, 210, 210, buildingImages[1]));
  buildings.push(new Building(1009, 10, 210, 210, buildingImages[2]));
  buildings.push(new Building(500, 0, 140, 190, buildingImages[3]));
  buildings.push(new Building(500, 580, 140, 190, buildingImages[4]));


    for (let i = 0; i < 10; i++) {
      let valid = false;
      let bookX, bookY;
  
      while (!valid) {
        // Generate random position
        bookX = random(50, width - 50);
        bookY = random(50, height - 50);
  
        // Check if the position is valid
        valid = checkPosition(bookX, bookY, 20, 20); // Book size is 20x20
      }
  
      books.push({
        x: bookX,
        y: bookY,
        collected: false
      });
    }
    for (let i = 0; i < 10; i++) {
      let valid = false;
      let coffeeX, coffeeY;
  
      while (!valid) {
        coffeeX = random(50, width - 70);
        coffeeY = random(50, height - 70);
        valid = checkPosition(coffeeX, coffeeY, 20, 20); 
      }
  
      coffees.push({
         x: coffeeX,
         y: coffeeY,
          collected: false
         });
    }
    for (let i = 0; i<4; i++ ){
      let valid = false;
      let ClockX, ClockY; 
      while (!valid) {
        ClockX = random(50, width - 50);
        ClockY = random(50, height - 50);
        valid = checkPosition(ClockX, ClockY, 20, 20); 
      }
      clocks.push({
        x: ClockX,
        y: ClockY,
         collected: false
        });
    }
  
  
//NPCs
  npcs.push(new NPC(300, 345, 45, 45, npcImages[0],["Hey!","your building was destroyed, you no longer have class"]));  
  npcs.push(new NPC(450, 500, 35, 45, npcImages[1],["Hey there!","The building you are looking for has a different design compared to the other buildings"])); 
  npcs.push(new NPC(1000, 555, 35, 45, npcImages[2],["Hey there!","The building you are looking for has a different design compared to the other buildings"]));
  npcs.push(new NPC(790, 245, 35, 45, npcImages[3],["Hi","it is actually a supermarket"]));
}

function startScreen() {
  push();
  background(176,196,222);
  fill(0);
  textSize(40);
  textAlign(CENTER,CENTER);
  text("Press ENTER to START", 1300 / 2, 250);

  fill(255);
  strokeWeight(2);
  rect(550, 400, 150, 50, 50); 
  fill(0);
  textSize(20);
  text("Rules", 625, 425);
  pop();
}

function rulesScreen() {
  background(0);
  fill(255);
  textSize(25);
  textAlign(CENTER);
  //text ("", x, y);
  text("Is your first day as an international student at university", 1300 / 2, 150);
  text("Ask people to guide you to the correct building", 1300 / 2, 200);
  text("If you go into the wrong building it's game over", 1300 / 2, 250);
  text("Collect 10 books, if you drink less than 5 coffes you can go faster ", 1300 / 2, 300);
  text("but if you drink more than 5 it will slow you down", 1300 / 2, 350);
  text("Get on time! you have 1 min", 1300 / 2, 400);

  fill(255);
  rect(550, 520, 150, 50, 50); 
  fill(0);
  textSize(20);
  text("Main Menu", 625, 550);
}

function gameScreen() {
  
  background(bckgrnd);
  
  push();
  counter -= 1/60;
  fill(0);
  textSize(20);
  textFont('Verdana');
  text(round(counter), 10, 80);

  pop();

  for (let building of buildings) {
    building.draw();
  }
  for (let book of books) {
    if (!book.collected) {
image(bookImg, book.x , book.y , 20, 20); 
      
      
    }
  }
   for (let coffee of coffees) {
    if (!coffee.collected) {
      image(coffeeimg, coffee.x, coffee.y, 20, 20);
    }
  }

  for (let clock of clocks) {
    if (!clock.collected) {
      image(clockImg, clock.x, clock.y, 20, 20);
    }
  }

  image(player.currentImg, player.x, player.y, 40,40);
  
  fill(0);
  textSize(20);
  textFont('Verdana');
  text(`Books Collected: ${booksCollected}`, 10, 30);
  text(`Coffee Collected: ${coffeeCollected}`, 10, 60);
  /*counter -= 1 / 60;
  text(`Time: ${round(counter)}`, 10, 90);*/
   
   handleMovement();
   checkBookCollision();
   checkCoffeeCollision();
   checkClockCollision();

   for (let npc of npcs){
    npc.draw();
    npc.npcCollision();
   }
}

function resultScreenGameOver() {
  background(202, 11, 11);
  textSize(42);
  fill(255);
  textAlign(CENTER);
  textFont('Verdana');
  text("Game Over", 1300 / 2, 250);

  fill(255);
  rect(700, 520, 150, 50, 50); // Retry - Button
  rect(450, 520, 150, 50, 50); // Main Menu - Button
  fill(0);
  textSize(20);
  text("Retry", 780, 550);
  text("Main Menu", 525, 550);
}

function resultScreenWin() {
  background(0, 200, 0);
  textSize(42);
  fill(255);
  textAlign(CENTER);
  text("You arrived on time!!", 1300/ 2, 250);

  fill(255);
  rect(550, 520, 150, 50, 50); // Main Menu - Button
  fill(0);
  textSize(20);
  text("Main Menu", 630, 550);
}

function resetGame() {
  state = "game";
  
  player.x = 190;
  player.y = 700;
  player.direction = "up";
  player.speed = 2;
  player.currentImg = downImgs[0]; //initial
  player.currentState = 0;
  booksCollected = 0;
  coffeeCollected = 0;
  counter = 60;
  
  books = [];
  for (let i = 0; i < 10; i++) {
    let valid = false;
    let bookX, bookY;
    while (!valid) {
      bookX = random(50, width - 50);
      bookY = random(50, height - 50);
      valid = checkPosition(bookX, bookY, 20, 20); }
      books.push({
        x: bookX,
        y: bookY,
        collected: false,
      });
    }
    coffees = [];
    for (let i = 0; i < 10; i++) {
      let valid = false;
      let coffeeX, coffeeY;
  
      while (!valid) {
        coffeeX = random(50, width - 50);
        coffeeY = random(50, height - 50);
        valid = checkPosition(coffeeX, coffeeY, 20, 20);
      }
  
      coffees.push({
        x: coffeeX,
        y: coffeeY,
        collected: false,
      });
    }
    clocks = [];
  for (let i = 0; i < 4; i++) {
    let valid = false;
    let clockX, clockY;

    while (!valid) {
      clockX = random(50, width - 50);
      clockY = random(50, height - 50);
      valid = checkPosition(clockX, clockY, 20, 20);
    }

    clocks.push({
      x: clockX,
      y: clockY,
      collected: false,
    });
  }
  npcs = [];
  npcs.push(new NPC(700, 345, 35, 45, npcImage, [
    "Hey there! (press enter ->)",
    "The building you are looking for has a different design compared to the other buildings",
  ]));


   /*for (let npc of npcs){
    npc.draw();
    npc.npcCollision();
   }*/


}

function draw() {

  if (state === "start") {
    startScreen();
    if (keyIsDown(13)) {
        resetGame();
    }
} else if (state === "game") {
    gameScreen();

    // Winning or losing in the game
    if (counter >= 0 ){
      if (player.x >=1050 && player.x <=1150 &&
        player.y >=160 && player.y <=170){
        if (booksCollected === 10){
          state = "win";   
    } else {
      state = "lose";
   }
  }
}else{
      state = "lose";
}
} else if (state === "lose") {
    resultScreenGameOver();
} else if (state === "win") {
    resultScreenWin();
} else if (state === "rules") {
    rulesScreen();
}
  
}

function handleMovement() {
  let isMoving = false;
  if (keyIsDown(LEFT_ARROW)) {
    //change the value of direction so that the switch know which frame to display
    
    player.direction = "left";
    if (player.x > 0) {
      player.x -= player.speed;
      isMoving = true;
    }
  } else if (keyIsDown(RIGHT_ARROW)) {
    player.direction = "right";
    if (player.x + player.width < width) {
      player.x += player.speed;
      isMoving = true;
    }
  } else if (keyIsDown(UP_ARROW)) {
    player.direction = "up";
    if (player.y > 0) {
      player.y -= player.speed;
      isMoving = true;
    }
  } else if (keyIsDown(DOWN_ARROW)) {
    player.direction = "down";
    if (player.y + player.height < height) {
      player.y += player.speed;
      isMoving = true;
    }
  }
  
  if (isMoving) {
    
    if (frameCount % 6 === 0) { 
      player.currentState = (player.currentState + 1) % 3; 
    }
  } else {
    player.currentState = 0;
  }


      if (player.direction === "left") {
        
        player.currentImg = leftImgs[player.currentState];
    } else if (player.direction === "right") {
        player.currentImg = rightImgs[player.currentState];
    } else if (player.direction === "up") {
        player.currentImg = upImgs[player.currentState];
    } else if (player.direction === "down") {
        player.currentImg = downImgs[player.currentState];
    }

 
}

// Check for overlap between player and books
function checkBookCollision() {
  for (let book of books) {
    if (!book.collected) {
      
      if (
        player.x < book.x + 20 && 
        player.x + playerWidth > book.x &&
        player.y < book.y + 20 && // Book's height is 20
       
        player.y + playerHeight > book.y
      ) {
        book.collected = true; // Mark the book as collected
        booksCollected++; 
      }
    }
  }
}
function checkCoffeeCollision() {
  for (let coffee of coffees) {
    if (!coffee.collected) {
      if (
        player.x < coffee.x + 20 && 
        player.x + playerWidth > coffee.x &&
        player.y < coffee.y + 20 && 
        player.y + playerHeight > coffee.y
      ) {
        coffee.collected = true; 
        coffeeCollected++; 

        // Adjust player speed
        if (coffeeCollected <= 5) {
          player.speed += 0.5; 
        } else {
          player.speed = max(1, player.speed - 0.3); // Gradually lower speed with a minimum limit
        }
      }
    }
  }
}
function checkClockCollision() {
  for (let clock of clocks) {
    if (!clock.collected) {
      if (
        player.x < clock.x + 20 &&
        player.x + player.width > clock.x &&
        player.y < clock.y + 20 &&
        player.y + player.height > clock.y
      ) {
        clock.collected = true;
        counter+= 10;
         }
     }
  }
 }
function keyPressed(){
  if (keyCode === (13)) {
    for (let npc of npcs) {
      if (npc.showTextBox) {
        npc.nextMessage();
      }
    }
  }
}
function mousePressed() {
  if (state === "start" && mouseX > 550 && mouseX < 700 && mouseY > 400 && mouseY < 450) {
      state = "rules";
  } else if (state === "rules" && mouseX > 550 && mouseX < 700 && mouseY > 520 && mouseY < 570) {
      state = "start";
  } else if (state === "lose") {
      if (mouseX > 700 && mouseX < 850 && mouseY > 520 && mouseY < 570) {
          resetGame();
      } else if (mouseX > 450 && mouseX < 600 && mouseY > 520 && mouseY < 570) {
         resetGame();
          state = "start";
      }
  } else if (state === "win" && mouseX > 550 && mouseX < 700 && mouseY > 520 && mouseY < 570) {
      state = "start";
  }
}
