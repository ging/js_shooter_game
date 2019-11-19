const KEY_LEFT = "LEFT";
const KEY_RIGHT = "RIGHT";
const KEY_SHOOT = "SHOOT";

const PLAYER_WIDTH = 10; //percentage of screen width
const PLAYER_HEIGHT = 5; //percentage of screen height
const PLAYER_SPEED = 20;
const SHOT_WIDTH = 3;
const SHOT_HEIGHT = 3;
const ENEMY_WIDTH = 10;
const ENEMY_HEIGHT = 5;
const ENEMY_SPEED = 5;


function getRandomNumber(range) {
    return Math.floor(Math.random() * range);
}

function collision(div1, div2) {
  const a = div1.getBoundingClientRect();
  const b = div2.getBoundingClientRect();
  return ! (a.bottom < b.top || a.top > b.bottom || a.right < b.left || a.left > b.right);
}

class Character {
  constructor(game, width, height, x, y, speed, myImage) {
    this.dead = false;
    this.game = game;
    this.width = width;
    this.height = height;
    this.x = x;
    this.y = y;
    this.speed = speed;
    this.myImage = myImage;
    this.myImage.style.position = "absolute";
    this.myImage.style.top = this.y + "px";
    this.myImage.style.left = this.x + "px";
    document.body.appendChild(this.myImage);
  }
}

class Player extends Character{
  constructor(game, width, height, x, y, speed, myImage) {
    super(game, width, height, x, y, speed, myImage);
  }
  die(){
    if(!this.dead){
      this.myImage.src = 'assets/bueno_muerto.png';
      this.dead = true;
      setTimeout(()=>{
        this.game.endGame();
        document.body.removeChild(this.myImage);
      }, 2000);
    }
  }
  update(){
    if(!this.dead){
      switch(this.game.keyPressed){
        case KEY_LEFT:
          if(this.x>this.speed)
            this.x = this.x - this.speed;
        break;
        case KEY_RIGHT:
          if(this.x < this.game.width - this.width - this.speed)
            this.x = this.x + this.speed;
        break;
        case KEY_SHOOT:
            this.game.shoot(this);
        break;
      }
    }
  }
  render(){
    //this.myImage.style.top = this.y + "px";
    this.myImage.style.left = this.x + "px";
  }
}

class Enemy extends Character{
  constructor(game, width, height, x, y, speed, myImage) {
    super(game, width, height, x, y, speed, myImage);
    this.direction = 'R';
    setTimeout(()=>this.shoot(), 1000 + getRandomNumber(2500));
  }
  shoot(){
    if(!this.dead && !this.game.ended){
      this.game.shoot(this);
      setTimeout(()=>this.shoot(), 1000 + getRandomNumber(2500));
    }
  }
  die(){
    if(!this.dead){
      this.myImage.src = 'assets/malo_muerto.png';
      this.dead = true;
      setTimeout(()=>{
        this.game.removeEnemy();
        document.body.removeChild(this.myImage);
      }, 2000);
    }
  }
  update(){
    if(!this.dead && !this.game.ended){
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
    this.height = SHOT_HEIGHT*this.game.height/100;
    this.width = SHOT_WIDTH*this.game.width/100;
    this.myImage = new Image(this.width, this.height);
    this.myImage.src = this.type==="PLAYER" ? 'assets/shot1.png':'assets/shot2.png';
    this.myImage.style.position = "absolute";
    this.x = character.x;
    this.y = character.y;
    this.myImage.style.top = this.y + "px";
    this.myImage.style.left = this.x + "px";
    document.body.appendChild(this.myImage);
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
    this.started = false;
    this.ended = false;
    this.keyPressed = undefined;
    this.width = 0;
    this.height = 0;
    this.player = undefined;
    this.playerShots = [];
    this.enemy = undefined;
    this.enemyShots = [];
  }
  start(){
    if(!this.started){
      //requestAnimationFrame(this.update());
      window.addEventListener('keydown', (e)=>this.checkKey(e,true));
      window.addEventListener('keyup', (e)=>this.checkKey(e,false));
      this.started = true;

      this.width = window.innerWidth;
      this.height = window.innerHeight;

      let height = PLAYER_HEIGHT*this.height/100;
      let width = PLAYER_WIDTH*this.width/100;
      let x = this.width/2 - width;
      let y = this.height - height;
      let myImage = new Image(width, height);
      myImage.src = 'assets/bueno.png';
      this.player = new Player(this, width, height, x, y, PLAYER_SPEED, myImage);
      setInterval(()=>this.update(), 50);
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
  					this.keyPressed = KEY_LEFT;
  				break;
  				case 32: //spacebar
  					this.keyPressed = KEY_SHOOT;
  				break;
  				case 39: //right arrow
  					this.keyPressed = KEY_RIGHT;
  				break;
        }
    }
  }
  checkCollisions(){
    //player can collide with enemy or shots
    let impact = false;
    for (let i = 0; i < this.enemyShots.length; i++) {
      impact = impact || this.hasCollision(this.player, this.enemyShots[i]);
    }
    if(impact || this.hasCollision(this.player, this.enemy)){
      this.player.die();
    }
    let killed = false;
    for (let i = 0; i < this.playerShots.length; i++) {
      killed = killed || this.hasCollision(this.enemy, this.playerShots[i]);
    }
    if(killed){
      this.enemy.die();
    }
  }
  hasCollision(item1, item2){
    if(item2===undefined){
      return false; //when enemy is undefined, there is no collision
    }
    let b1 = item1.y + item1.height;
    let r1 = item1.x + item1.width;
    let b2 = item2.y + item2.height;
    let r2 = item2.x + item2.width;
    if (b1 < item2.y || item1.y > b2 || r1 < item2.x || item1.x > r2) return false;
    return true;
  }
  endGame(){
    console.log("FIN");
    this.ended = true;
    this.myImage = new Image(this.width/2, this.height/2);
    this.myImage.src = 'assets/game_over.jpg';
    this.myImage.style.position = "absolute";
    this.myImage.style.top = this.width/4 + "px";
    this.myImage.style.left = this.height/4 + "px";
    document.body.appendChild(this.myImage);
  }
  update(){
    if(!this.ended) {
      this.player.update();
      if(this.enemy===undefined){
        let height = ENEMY_HEIGHT*this.height/100;
        let width = ENEMY_WIDTH*this.width/100;
        let x = getRandomNumber(this.width - width);
        let y = 0;
        let myImage = new Image(width, height);
        myImage.src = 'assets/malo.png';
        this.enemy = new Enemy(this, width, height, x, y, ENEMY_SPEED, myImage);
      }
      this.enemy.update();
      this.playerShots.forEach((shot)=>{
        shot.update();
      });
      this.enemyShots.forEach((shot)=>{
        shot.update();
      });
      this.checkCollisions();
      this.render();
    }
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
