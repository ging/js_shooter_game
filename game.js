const KEYLEFT = "LEFT";
const KEYRIGHT = "RIGHT";
const KEYSHOOT = "SHOOT";

const PLAYERWIDTH = 10; //percentage of screen width
const PLAYERHEIGHT = 5; //percentage of screen height
const SHOTWIDTH = 1;
const SHOTHEIGHT = 1;
const ENEMYWIDTH = 10;
const ENEMYHEIGHT = 5;

function getRandomNumber(range) {
    return Math.floor(Math.random() * range);
}

class Player {
  constructor(game) {
    this.game = game;
    this.speed = 20;
    this.height = PLAYERHEIGHT*this.game.height/100;
    this.width = PLAYERWIDTH*this.game.width/100;
    this.myImage = new Image(this.width, this.height);
    this.myImage.src = 'assets/bueno.png';
    this.myImage.style.position = "absolute";
    this.x = this.game.width/2 - this.width;
    this.y = this.game.height - this.height;
    this.myImage.style.top = this.y + "px";
    this.myImage.style.left = this.x + "px";
    document.body.appendChild(this.myImage);

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }
  update(){
    switch(this.game.keyPressed){
      case KEYLEFT:
        if(this.x>this.speed)
          this.x = this.x - this.speed;
      break;
      case KEYRIGHT:
        if(this.x < this.game.width - this.width - this.speed)
          this.x = this.x + this.speed;
      break;
      case KEYSHOOT:
          this.game.shoot(this);
      break;
    }
  }
  render(){
    //this.myImage.style.top = this.y + "px";
    this.myImage.style.left = this.x + "px";
  }
}

class Enemy {
  constructor(game) {
    this.game = game;
    this.speed = 5;
    this.height = ENEMYHEIGHT*this.game.height/100;
    this.width = ENEMYWIDTH*this.game.width/100;
    this.direction = 'R';
    this.horizontalMov = getRandomNumber(this.game.width/2);
    this.myImage = new Image(this.width, this.height);
    this.myImage.src = 'assets/malo1.png';
    this.myImage.style.position = "absolute";
    this.x = getRandomNumber(this.game.width - this.width);
    this.y = 0;
    this.myImage.style.top = this.y + "px";
    this.myImage.style.left = this.x + "px";
    document.body.appendChild(this.myImage);

    setTimeout(()=>this.shoot(), 1000 + getRandomNumber(2500));

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
    this.shoot = this.shoot.bind(this);
  }
  shoot(){
    this.game.shoot(this);
    setTimeout(()=>this.shoot(), 1000 + getRandomNumber(2500));
  }
  update(){
    this.y = this.y + this.speed;
    if(this.y>this.game.height){
      this.game.removeEnemy();
      document.body.removeChild(this.myImage);
    }
    if(this.direction==="R"){ //Right movement
      if(this.x < this.game.width - this.width - this.speed){
        this.x = this.x + this.speed;
      } else {
        this.horizontalMov = 0;
      }
    } else {
      if(this.x>this.speed){
        this.x = this.x - this.speed;
      } else {
        this.horizontalMov = 0;
      }
    }
    this.horizontalMov = this.horizontalMov - this.speed; //update the remaining movement
    if(this.horizontalMov < this.speed){
      this.horizontalMov = getRandomNumber(this.game.width/2);
      this.direction = this.direction === "R" ? "L":"R"; //change direction
    }
  }
  render(){
    this.myImage.style.top = this.y + "px";
    this.myImage.style.left = this.x + "px";
  }
}

class Shot {
  constructor(game, character) {
    this.game = game;
    this.speed = 20;
    this.type = character instanceof Player ? "PLAYER":"ENEMY";
    let height = SHOTHEIGHT*this.game.height/100;
    let width = SHOTWIDTH*this.game.width/100;
    this.myImage = new Image(width, height);
    this.myImage.src = this.type==="PLAYER" ? 'assets/shot1.png':'assets/shot2.png';
    this.myImage.style.position = "absolute";
    this.x = character.x;
    this.y = character.y;
    this.myImage.style.top = this.y + "px";
    this.myImage.style.left = this.x + "px";
    document.body.appendChild(this.myImage);

    this.update = this.update.bind(this);
    this.render = this.render.bind(this);
  }
  update(){
    if(this.type === "PLAYER"){
      this.y = this.y - this.speed; //goes up
    } else {
      this.y = this.y + this.speed; //goes down
    }
    if(this.y < 0 || this.y > this.game.height){
      this.game.removeShot(this);
      document.body.removeChild(this.myImage);
    }
  }
  render(){
    this.myImage.style.top = this.y + "px";
    this.myImage.style.left = this.x + "px";
  }
}



class Game {
  constructor(){
    this.i = 0;
    this.started = false;
    this.keyPressed = undefined;
    this.width = 0;
    this.height = 0;
    this.player = undefined;
    this.playerShots = [];
    this.enemy = undefined;
    this.enemyShots = [];

    this.update = this.update.bind(this);
    this.start = this.start.bind(this);
    this.checkKey = this.checkKey.bind(this);
    this.render = this.render.bind(this);
  }
  start(){
    if(!this.started){
      //requestAnimationFrame(this.update());
      window.addEventListener('keydown', (e)=>this.checkKey(e,true));
      window.addEventListener('keyup', (e)=>this.checkKey(e,false));
      this.started = true;

      this.width = window.innerWidth;
      this.height = window.innerHeight;
      this.player = new Player(this);
      setInterval(()=>this.update(), 50);
      //this.update();
    }
  }
  shoot(character){
    let arrayShots = character instanceof Player ? this.playerShots:this.enemyShots;
    arrayShots.push(new Shot(this, character));
  }
  removeShot(shot){
    let shotsArray = shot.type==="PLAYER" ? this.playerShots:this.enemyShots;
    let index = shotsArray.indexOf(shot);
    if (index > -1) {
      shotsArray.splice(index, 1);
    }
  }
  removeEnemy(){
    this.enemy = undefined;
  }
  checkKey(event, isKeyDown){
    if(!isKeyDown){
      this.keyPressed = undefined;
    } else {
        switch(event.keyCode){
  				case 37: //left arrow
  					this.keyPressed = KEYLEFT;
  				break;
  				case 32: //spacebar
  					this.keyPressed = KEYSHOOT;
  				break;
  				case 39: //right arrow
  					this.keyPressed = KEYRIGHT;
  				break;
        }
    }
  }
  update(){
    this.i = this.i + 1;
    this.player.update();
    if(this.enemy===undefined){
      this.enemy = new Enemy(this);
    }
    this.enemy.update();

    //requestAnimationFrame(this.update());

    this.playerShots.forEach((shot)=>{
      shot.update();
    });
    this.enemyShots.forEach((shot)=>{
      shot.update();
    });
    this.render();
  }
  render(){
    this.player.render();
    this.enemy.render();
    this.playerShots.forEach((shot)=>{
      shot.render();
    });
    this.enemyShots.forEach((shot)=>{
      shot.render();
    });
  }
}

document.addEventListener("DOMContentLoaded", function(){
  let game = new Game();
  game.start();
});
