const Engine = Matter.Engine;
const Render = Matter.Render;
const World = Matter.World;
const Bodies = Matter.Bodies;
const Constraint = Matter.Constraint;
const Body = Matter.Body;
const Composites = Matter.Composites;
const Composite = Matter.Composite;

let engine;
let world;
var ground;
var bunny;
var button, button2, button3;

var backgroundIMG;
var fruitIMG;
var bunnyIMG;
var rope, rope2, rope3, link, link2, link3;
var fruit;

var backgroundMusic, cuttingSound, bunnyEating, bunnySad, airblowerSound;

var blink, eat, sad;

var muteButton;

var blower;

var W, H;

function preload() {
  backgroundIMG = loadImage("assets/bkg.jpg");
  fruitIMG = loadImage("assets/melon.png");
  bunnyIMG = loadImage("assets/blink_1.png");
  blink = loadAnimation("assets/blink_1.png", "assets/blink_2.png", "assets/blink_3.png");
  eat = loadAnimation("assets/eat_0.png", "assets/eat_1.png", "assets/eat_2.png", "assets/eat_3.png", "assets/eat_4.png");
  sad = loadAnimation("assets/sad_1.png", "assets/sad_2.png", "assets/sad_3.png");
  blink.playing = true;
  eat.playing = true;
  eat.looping = false;
  sad.playing = true;
  sad.looping = false;
  backgroundMusic = loadSound("assets/sound1.mp3");
  cuttingSound = loadSound("assets/Cutting Through Foliage.mp3");
  bunnyEating = loadSound("assets/eating_sound.mp3");
  bunnySad = loadSound("assets/sad.wav");
  airblowerSound = loadSound("assets/air.wav");
}

function setup() {
  var isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
  if(isMobile){
    W = displayWidth;
    H = displayHeight;
    createCanvas(displayWidth+80, displayHeight);
  }
  else{
    W = windowWidth;
    H = windowHeight;
    createCanvas(windowWidth, windowHeight);
  }
 
  frameRate(80);
  backgroundMusic.play();
  backgroundMusic.setVolume(0.1);
  engine = Engine.create();
  world = engine.world;

  button = createImg("assets/cut_btn.png");
  button.position(20, 30);
  button.size(50, 50);
  button.mouseClicked(drop);

  button2 = createImg("assets/cut_btn.png");
  button2.position(330, 35);
  button2.size(50, 50);
  button2.mouseClicked(drop2);

  button3 = createImg("assets/cut_btn.png");
  button3.position(360, 200);
  button3.size(50, 50);
  button3.mouseClicked(drop3);

  muteButton = createImg("assets/mute.png");
  muteButton.position(440, 20);
  muteButton.size(50, 50);
  muteButton.mouseClicked(mute);

  blower = createImg("assets/blower.png");
  blower.position(10, 250);
  blower.size(100,100);
  blower.mouseClicked(blow);

  ground = new Ground(200,H,600,20);
  rope = new Rope(9,{x:40, y:30});
  rope2 = new Rope(7,{x:370, y:40});
  rope3 = new Rope(4,{x:400, y:225});
  var fruit_options = {
    density: 0.001
  }

  fruit = Bodies.circle(300,300,15, fruit_options);
  Matter.Composite.add(rope.body, fruit);
  link = new Link(rope, fruit);
  link2 = new Link(rope2, fruit);
  link3 = new Link(rope3, fruit);

  blink.frameDelay = 30;
  eat.frameDelay = 30;
  sad.frameDelay = 20;

  bunny = createSprite(420,H-80,100,100);
  bunny.x = Math.round(random(100,W-100));
  bunny.addAnimation("blinking", blink);
  bunny.addAnimation("eating", eat);
  bunny.addAnimation("crying", sad);
  bunny.changeAnimation("blinking");
  bunny.scale = 0.15;

  rectMode(CENTER);
  ellipseMode(RADIUS);
  textSize(50);
  imageMode(CENTER);
}

function draw() {
  background(51);
  image(backgroundIMG, W/2, H/2);
  ground.show();
  rope.show();
  rope2.show();
  rope3.show();
  //ellipse(fruit.position.x, fruit.position.y, 15, 15);
  push();
  
  if(fruit != null){
    image(fruitIMG, fruit.position.x, fruit.position.y, 50, 50);
  }

  pop();
  Engine.update(engine);
  if(collide(fruit, bunny) == true){
    bunnyEating.play();
    bunny.changeAnimation("eating");
  }

  if(fruit != null && fruit.position.y >= 650){
    backgroundMusic.stop();
    bunny.changeAnimation("crying");
    bunnySad.play();
    bunnySad.setVolume(0.1);
    fruit = null;
  }
  drawSprites();
}

function drop(){
  cuttingSound.play();
  rope.break();
  link.detach();
  link = null;
}
function drop2(){
  cuttingSound.play();
  rope2.break();
  link2.detach();
  link2 = null;
}
function drop3(){
  cuttingSound.play();
  rope3.break();
  link3.detach();
  link3 = null;
}

function collide(body, sprite){
  if(body != null){
    var d = dist(body.position.x, body.position.y, sprite.position.x, sprite.position.y);
    if(d <= 80){
      World.remove(engine.world, fruit);
      fruit = null;
      return true;
    }
    else{
      return false;
    }
  }
}

function mute(){
  if(backgroundMusic.isPlaying()){
    backgroundMusic.stop();
  }
  else{
    backgroundMusic.play();
  }
}

function blow(){
  Matter.Body.applyForce(fruit, {x:0, y:0}, {x:0.02, y:0});
  airblowerSound.play();
}