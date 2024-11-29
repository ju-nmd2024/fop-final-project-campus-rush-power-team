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
  bckgrnd = loadImage(`map.png`);
  bookImg = loadImage('Book.png');
  
  for (let i = 0; i < 5; i++) {
    buildingImages.push(loadImage(`building${i}.png`)); 
  }
  for (let i = 0; i < 3; i++) {
    leftImgs[i] = loadImage(`left_${i}.png`); 
    rightImgs[i] = loadImage(`right_${i}.png`);
    upImgs[i] = loadImage(`up_${i}.png`);
    downImgs[i] = loadImage(`down_${i}.png`);}
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
    books.push({
      x: random(50, width - 50), 
      y: random(50, height - 50),
      collected: false // Track if the books are collected
    });
  }
  
}



function draw() {
  background(bckgrnd);
  for (let building of buildings) {
    building.draw();
  }
  for (let book of books) {
    if (!book.collected) {

      noStroke();
      image(bookImg, book.x - 10, book.y - 10, 20, 20); 
      
      
    }
  }
  clear();
  image(player.currentImg, player.x, player.y, 40,40);
 
  fill(0);
  textSize(20);
  text(`Books Collected: ${booksCollected}`, 10, 30);
  

   
   handleMovement();
   checkBookCollision();
  
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
        player.y < book.y + 20 && 
        player.y + playerHeight > book.y
      ) {
        book.collected = true; // Mark the book as collected
        booksCollected++; 
      }
    }
  }
}


