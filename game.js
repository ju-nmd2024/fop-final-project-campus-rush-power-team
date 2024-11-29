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


