let shoot = false;
let reStart = false;

class arrow {
  constructor(name, pos_x, pos_y) {
    this.name = name;
    this.x = pos_x;
    this.y = pos_y;
    this.absX = 0;
    this.absY = 0;
    
    this.arrowVel = 3;
    this.arrowSize = 21;
    this.arrowDis = 0.0;
    
    this.angleStep = 3; 
    this.angleStart = -90;
    this.angle = 0;
    this.angleMax = 180; 
  }
  
  display(){
  
    this.absX = this.x + cos(this.angleStart+this.angle) * (this.arrowDis+this.arrowSize);
    this.absY = this.y + sin(this.angleStart+this.angle) * (this.arrowDis+this.arrowSize);
    stroke(0);
    line(this.x + cos(this.angleStart+this.angle) * (this.arrowDis) ,
         this.y + sin(this.angleStart+this.angle) * (this.arrowDis) ,
         this.absX ,
         this.absY
        );
    
    if(mouseIsPressed == true && shoot == false){
      this.count();
    }else if(shoot){
      this.run();
    }
  }
  
  run(){ 
    this.arrowDis += this.arrowVel;
  }
  
  count(){
    if(this.angle == 0){
      this.angleStep = abs(this.angleStep);
    }else if(this.angle == this.angleMax){
      this.angleStep = abs(this.angleStep) * -1;
    }
    
    this.angle += this.angleStep;  
  }
  
  reset(){
    this.absX = 0;
    this.absY = 0;
    this.arrowDis = 0.0;    
    this.angleStep = 3; 
    this.angle = 0;
    
    shoot = false;
  }
}

class target {
  constructor(name, pos_x, pos_y) {
    this.name = name;
    this.x = pos_x;
    this.y = pos_y;
    
    this.xMin = 280;
    this.xMax = 300;
    this.xTarget = 300;
    
    this.yMin = 150;
    this.yMax = 250;
    this.yTarget = this.yMax;
    
    this.moveX = 0;
    this.moveY = 0;
    
    this.color = 255;
    this.size = 60;
  }
  
  display(){ 
    stroke(0);
    
    this.y = this.y + (this.yTarget - this.y)/30;
    this.count();
    fill(0);
    ellipse(this.x+ this.moveX,this.y + this.moveY,this.size,this.size);   
  }
  
  count(){
    if(this.yTarget == this.yMax && abs(this.yTarget - this.y) < 3) {
      this.yTarget = this.yMin;
    } else if(this.yTarget == this.yMin && abs(this.yTarget - this.y) < 3) {
      this.yTarget = this.yMax;
    } 
  }
  
  reset(){
    this.color = 255;
    fill(this.color);
    ellipse(this.x+ this.moveX,this.y + this.moveY,this.size,this.size); 
    testTarget.yRangeSet(random(height*1/9, height*3/6), 
                         random(height*3/6, height*8/9));
    //this.moveX = random(-10,10);
    //this.moveY = random(-10,10);
    console.log("good");
  }
  
  yRangeSet(ymin,ymax){
    this.yMin = ymin;
    this.yMax = ymax;
    this.yTarget = this.yMax;    
  }
}


let testArrow = new arrow('arrow1', 50, 0); 
let testTarget = new target('target1', 300, 150); 
let audio_bonk;

function setup() {
  createCanvas(400, 400);
  randomSeed(99);
  angleMode(DEGREES);
  fontSet();
  
  testArrow.y = height/2;
  testTarget.yRangeSet(height*1/4, height*3/4);

  audio_bonk = createAudio('bonk.mp3');
}

function draw() {
  if(!shoot){
    background(240);
  }else{
    fill(240,10);
    noStroke();
    rect(0,0,width,height);
  }
  
  testArrow.display();
  testTarget.display();
  judge();
  scoreDisplay();
  youAreGooud()
}

function mouseReleased() { 
  shoot = true;
}

function mousePressed() {
    if(reStart){
      reStart = false;
      scoreReset();
    }
}

function youAreGooud(){
  if(scoreCount > 0 && reStart){
    textStyle(BOLD);
    noStroke();
    textSize(72);
    fill(frameCount*3%255,frameCount*3%512,frameCount*3%765);
    text("打 的 不 錯", width/2,250);
  }
}

function judge(){
  // out of canvas size
  if(testArrow.absX < 0 || testArrow.absX > 390 || testArrow.absY > 390 || testArrow.absY < 0){
    testArrow.reset();
    reStart = true;
  }
  
  let d = dist(testArrow.absX,testArrow.absY,testTarget.x,testTarget.y);
  
  if(d < testTarget.size/2){
    audio_bonk.play();
    testTarget.reset();
    testArrow.reset();
    scoreAdd(10);
  }
}

let scoreCount = 0;

function scoreAdd(_add){
  scoreCount += 10;
}

function scoreReset(){
  scoreCount = 0;
}

function scoreDisplay(){
  textStyle(NORMAL);
  noStroke();
  fill(0);
  textSize(24);
  text(scoreCount, width/2,50);
}

function fontSet(){
  textAlign(CENTER);
  textSize(24);
  textFont('Helvetica');
}

