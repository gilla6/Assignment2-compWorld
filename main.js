window.onload = function () {
  var socket = io.connect("http://24.16.255.56:8888");
  console.log("---socket----");

  socket.on("load", function (data) {
      console.log(data);
  });

  var text = document.getElementById("text");
  var saveButton = document.getElementById("save");
  var loadButton = document.getElementById("load");

  saveButton.onclick = function () {
    console.log("save");
    text.innerHTML = "Saved."
    var array = [map];
    var playerArray = PlayerState.playerArray;
    console.log(playerArray.length);

    
    socket.emit("save", { studentname: "Arshdeep", statename: "Emergence", data: "Goodbye World", playerArray: playerArray});
  };

  loadButton.onclick = function () {
    console.log("load");
    text.innerHTML = "Loaded."
    socket.emit("load", { studentname: "Arshdeep", statename: "Emergence" });
    socket.on("load", function(data){
console.log("++++++"+data.playerArray.length);
GameRestoreBoolean(data.playerArray);
    });
  };

};




function Animation(spriteSheet, startX, startY, frameWidth, frameHeight, frameDuration, frames, loop, reverse) {
    this.spriteSheet = spriteSheet;
    this.startX = startX;
    this.startY = startY;
    this.frameWidth = frameWidth;
    this.frameDuration = frameDuration;
    this.frameHeight = frameHeight;
    this.frames = frames;
    this.totalTime = frameDuration * frames;
    this.elapsedTime = 0;
    this.loop = loop;
    this.reverse = reverse;
}

Animation.prototype.drawFrame = function (tick, ctx, x, y, scaleBy) {
    var scaleBy = scaleBy || 1;
    this.elapsedTime += tick;
    if (this.loop) {
        if (this.isDone()) {
            this.elapsedTime = 0;
        }
    } else if (this.isDone()) {
        return;
    }
    var index = this.reverse ? this.frames - this.currentFrame() - 1 : this.currentFrame();
    var vindex = 0;
    if ((index + 1) * this.frameWidth + this.startX > this.spriteSheet.width) {
        index -= Math.floor((this.spriteSheet.width - this.startX) / this.frameWidth);
        vindex++;
    }
    while ((index + 1) * this.frameWidth > this.spriteSheet.width) {
        index -= Math.floor(this.spriteSheet.width / this.frameWidth);
        vindex++;
    }

    var locX = x;
    var locY = y;
    var offset = vindex === 0 ? this.startX : 0;
    ctx.drawImage(this.spriteSheet,
                  index * this.frameWidth + offset, vindex * this.frameHeight + this.startY,  // source from sheet
                  this.frameWidth, this.frameHeight,
                  locX, locY,
                  this.frameWidth * scaleBy,
                  this.frameHeight * scaleBy);
}

Animation.prototype.currentFrame = function () {
    return Math.floor(this.elapsedTime / this.frameDuration);
}

Animation.prototype.isDone = function () {
    return (this.elapsedTime >= this.totalTime);
}

function Background(game, spriteSheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spriteSheet;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
    this.key = 99;
    this.size = 99;

   
this.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

this.update = function () {
    this.x -= this.game.clockTick * this.speed;
    if (this.x < -500) this.x = 0;
    
   
};};
function distance(a, b) {
    var difX = a.x - b.x;
    var difY = a.y - b.y;
    return Math.sqrt(difX * difX + difY * difY);
};



function Species(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 8, 45, 45, 0.25, 3, true, false);
    this.leftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 50, 45, 45, 0.25, 3, true, false);
    this.rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 100, 45, 45, 0.25, 3, true, false);
    this.upAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 150, 45, 45, 0.25, 3, true, false);
    this.jumping = false;
    this.left = false;
    this.up = false;
    this.down = false;
    this.size = 1.2;
    this.radius = 20;
    this.id = 1;
    this.key = 1;
    this.x =  4 + (Math.random() * 750) + 1;
    this.y  =   4 + (Math.random() * 680) + 1;
    Entity.call(this, game, this.x, this.y);
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
     if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
   


Species.prototype = new Entity();
Species.prototype.constructor = Species;


this.collideRight = function () {
    return this.x + this.radius > 780;
};
this.collideLeft = function () {
    return this.x - this.radius < -10;
};
this.collideBottom = function () {
    return this.y + this.radius > 690;
};
this.collideTop = function () {
    return this.y - this.radius < -10;
};

this.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


this.update = function () {
        if(PlayerObject.playerBoolean==true){
            console.log("inside----");
            this.game.entities = [];
           
            for(var i=0; i<PlayerObject.PlayerArray.length; i++){
                    if(PlayerObject.PlayerArray[i][2]==99){
                         this.game.entities.push(new Background(this.game, ASSET_MANAGER.getAsset("./img/background.jpeg")));
                          this.game.entities[this.game.entities.length-1].x = PlayerObject.PlayerArray[i][0];
                          this.game.entities[this.game.entities.length-1].y = PlayerObject.PlayerArray[i][1];

                    }
                
                    
                    else if(PlayerObject.PlayerArray[i][2]==1){
                        this.game.entities.push(new Species(this.game));
                        this.game.entities[this.game.entities.length-1].x = PlayerObject.PlayerArray[i][0];
                        this.game.entities[this.game.entities.length-1].y = PlayerObject.PlayerArray[i][1];
                        this.game.entities[this.game.entities.length-1].size = PlayerObject.PlayerArray[i][3];
                        console.log("--from main species--"+species.species.x);
                    }else if(PlayerObject.PlayerArray[i][2]==2){
                        this.game.entities.push(new SpeciesTwo(this.game));
                        this.game.entities[this.game.entities.length-1].x = PlayerObject.PlayerArray[i][0];
                        this.game.entities[this.game.entities.length-1].y = PlayerObject.PlayerArray[i][1];
                        this.game.entities[this.game.entities.length-1].size = PlayerObject.PlayerArray[i][3];
                    }else if(PlayerObject.PlayerArray[i][2]==3){
                        this.game.entities.push(new SpeciesThree(this.game));
                        this.game.entities[this.game.entities.length-1].x = PlayerObject.PlayerArray[i][0];
                        this.game.entities[this.game.entities.length-1].y = PlayerObject.PlayerArray[i][1];
                        this.game.entities[this.game.entities.length-1].size = PlayerObject.PlayerArray[i][3];
                    }else if(PlayerObject.PlayerArray[i][2]==4){
                        this.game.entities.push(new SpeciesFour(this.game));
                        this.game.entities[this.game.entities.length-1].x = PlayerObject.PlayerArray[i][0];
                        this.game.entities[this.game.entities.length-1].y = PlayerObject.PlayerArray[i][1];
                        this.game.entities[this.game.entities.length-1].size = PlayerObject.PlayerArray[i][3];
                    }else if(PlayerObject.PlayerArray[i][2]==5){
                        this.game.entities.push(new Food(this.game));
                        this.game.entities[this.game.entities.length-1].x = PlayerObject.PlayerArray[i][0];
                        this.game.entities[this.game.entities.length-1].y = PlayerObject.PlayerArray[i][1];
                        this.game.entities[this.game.entities.length-1].size = PlayerObject.PlayerArray[i][3];
                    }
                    
                    console.log("---key 3---");
                
            }
            
            PlayerObject.playerBoolean=false;

        }


    if(this.game.entities.length != 0){
    let lengthentities = this.game.entities.length;
    PlayerState.playerArray = [];
    for (var i=0; i<this.game.entities.length; i++){
            PlayerState.playerArray.push([this.game.entities[i].x, this.game.entities[i].y, this.game.entities[i].key, this.game.entities[i].size]);
    }
}
    // console.log(lengthentities+"------"+PlayerState.playerArray.length+"-----"+PlayerState.playerArray.key);
     Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;
     
        if (this.collideLeft()){
            this.left = false;
           this.right = true;
           this.velocity.x = -this.velocity.x;
        }
        if(this.collideRight()) {
            this.right = false;
            this.left = true;
        this.velocity.x = -this.velocity.x;
        }
    if (this.collideTop()){
        this.up = false;
        this.down = true;
        this.velocity.y = -this.velocity.y;
    } 
    if(this.collideBottom()) {
        this.down = false;
        this.up = true;
        this.velocity.y = -this.velocity.y;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent)) {

            var temp = this.velocity;
            this.velocity = ent.velocity;
            ent.velocity = temp;
            temp = this.left;
            this.left = ent.left;
            ent.left = temp;
            temp = this.right;
            this.right = ent.right;
            ent.right = temp;
            temp = this.up;
            this.up = ent.up;
            ent.up = temp;
            temp = this.down;
            this.down = ent.down;
            ent.down = temp;
                if(this.id != ent.id && ent.size < this.size){
                    ent.removeFromWorld = true;
                } else if (ent.id == 6){
                    
                    this.size = this.size * 1.25;
                    this.radius = this.radius * 1.25;
                    ent.removeFromWorld = true;
                }
           


        };
    };

    

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;


  
   


    map[this.key] = dimension(this.x,this.y, this.size);

    
    Entity.prototype.update.call(this);
}

this.draw = function (ctx) {
    if (this.left) {
        this.leftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }else if(this.right){
         this.rightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }else if(this.up){
           this.upAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }
    Entity.prototype.draw.call(this);
}; };

var PlayerState = function(){
    this.playerArray = [];
}
var PlayerState = new PlayerState();
function GameRestoreBoolean(playerarray){
    // gamerestore = false;
    PlayerObject.PlayerArray = playerarray;
    console.log("*******"+PlayerObject.PlayerArray[0][2]);
    PlayerObject.playerBoolean = true;

}

var PlayerObject = {
PlayerArray:'',
playerBoolean:false
};

function SpeciesTwo(game) {
   this.animation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 200, 45, 45, 0.25, 3, true, false);
    this.leftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 245, 45, 45, 0.25, 3, true, false);
    this.rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 290, 45, 45, 0.25, 3, true, false);
    this.upAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 340, 45, 45, 0.25, 3, true, false);
    this.left = false;
    this.up = false;
    this.down = false;
     this.size = 1.2;
     this.key = 2;
    this.jumping = false;
    this.radius = 20;
    this.id = 2;
    this.x = 4 + (Math.random() * 780) + 1;
    this.y =   4 + (Math.random() * 680) + 1 ;
    Entity.call(this, game, this.x,this.y);
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
     if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
   


SpeciesTwo.prototype = new Entity();
Species.prototype.constructor = Species;



this.collideRight = function () {
    return this.x + this.radius > 780;
};
this.collideLeft = function () {
    return this.x - this.radius < -10;
};
this.collideBottom = function () {
    return this.y + this.radius > 690;
};
this.collideTop = function () {
    return this.y - this.radius < -10;
};

this.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};

this.update = function () {
     Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

        if (this.collideLeft()){
            this.left = false;
           this.right = true;
           this.velocity.x = -this.velocity.x;
        }
        if(this.collideRight()) {
            this.right = false;
            this.left = true;
        this.velocity.x = -this.velocity.x;
        }
    if (this.collideTop()){
        this.up = false;
        this.down = true;
        this.velocity.y = -this.velocity.y;
    } 
    if(this.collideBottom()) {
        this.down = false;
        this.up = true;
        this.velocity.y = -this.velocity.y;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent)) {
            var temp = this.velocity;
            this.velocity = ent.velocity;
            ent.velocity = temp;
            temp = this.left;
            this.left = ent.left;
            ent.left = temp;
            temp = this.right;
            this.right = ent.right;
            ent.right = temp;
            temp = this.up;
            this.up = ent.up;
            ent.up = temp;
            temp = this.down;
            this.down = ent.down;
            ent.down = temp;
           if(this.id != ent.id && ent.size < this.size){
                    ent.removeFromWorld = true;
                } else if (ent.id == 6){
                    
                    this.size = this.size * 1.25;
                    this.radius = this.radius * 1.25;
                    ent.removeFromWorld = true;
                }


        };
    };

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent) {
            var dist = distance(this, ent);
            var difX = (ent.x - this.x) / dist;
            var difY = (ent.y - this.y) / dist;
            // this.velocity.x += difX / (dist * dist) * acceleration;
            // this.velocity.y += difY / (dist * dist) * acceleration;

            var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (speed > maxSpeed) {
                var ratio = maxSpeed / speed;
                this.velocity.x *= ratio;
                this.velocity.y *= ratio;
            };
        };
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;

   
     

    

    map[this.key] = dimension(this.x,this.y, this.size);

    
    Entity.prototype.update.call(this);
}

this.draw = function (ctx) {
     if (this.left) {
        this.leftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }else if(this.right){
         this.rightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }else if(this.up){
           this.upAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }
    Entity.prototype.draw.call(this);
};
};

function SpeciesThree(game) {
   this.animation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 290, 200, 45, 45, 0.25, 3, true, false);
    this.leftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 290, 250, 45, 45, 0.25, 3, true, false);
    this.rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 290, 290, 45, 45, 0.25, 3, true, false);
    this.upAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 290, 340, 45, 45, 0.25, 3, true, false);
    this.left = false;
    this.up = false;
    this.down = false;
     this.size = 1.2;
     this.key = 3;
    this.radius = 20;
    this.id = 3;
    this.x =  4 + (Math.random() * 780) + 1 ;
    this.y   =   4 + (Math.random() * 680) + 1 ;
    Entity.call(this, game, this.x, this.y);
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
     if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
   


SpeciesThree.prototype = new Entity();
SpeciesThree.prototype.constructor = Species;



this.collideRight = function () {
    return this.x + this.radius > 780;
};
this.collideLeft = function () {
    return this.x - this.radius < -10;
};
this.collideBottom = function () {
    return this.y + this.radius > 690;
};
this.collideTop = function () {
    return this.y - this.radius < -10;
};

this.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


this.update = function () {
     Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

         if (this.collideLeft()){
            this.left = false;
           this.right = true;
           this.velocity.x = -this.velocity.x;
        }
        if(this.collideRight()) {
            this.right = false;
            this.left = true;
        this.velocity.x = -this.velocity.x;
        }
    if (this.collideTop()){
        this.up = false;
        this.down = true;
        this.velocity.y = -this.velocity.y;
    } 
    if(this.collideBottom()) {
        this.down = false;
        this.up = true;
        this.velocity.y = -this.velocity.y;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent)) {
            var temp = this.velocity;
            this.velocity = ent.velocity;
            ent.velocity = temp;
            temp = this.left;
            this.left = ent.left;
            ent.left = temp;
            temp = this.right;
            this.right = ent.right;
            ent.right = temp;
            temp = this.up;
            this.up = ent.up;
            ent.up = temp;
            temp = this.down;
            this.down = ent.down;
            ent.down = temp;
            if(this.id != ent.id && ent.size < this.size){
                    ent.removeFromWorld = true;
                } else if (ent.id == 6){
                    
                    this.size = this.size * 1.25;
                    this.radius = this.radius * 1.25;
                    ent.removeFromWorld = true;
                }


        };
    };


    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent) {
            var dist = distance(this, ent);
            var difX = (ent.x - this.x) / dist;
            var difY = (ent.y - this.y) / dist;
            // this.velocity.x += difX / (dist * dist) * acceleration;
            // this.velocity.y += difY / (dist * dist) * acceleration;

            var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (speed > maxSpeed) {
                var ratio = maxSpeed / speed;
                this.velocity.x *= ratio;
                this.velocity.y *= ratio;
            };
        };
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;

   

     map[this.key] = dimension(this.x,this.y, this.size);


    
    Entity.prototype.update.call(this);
}

this.draw = function (ctx) {
     if (this.left) {
        this.leftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }else if(this.right){
         this.rightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }else if(this.up){
           this.upAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }
    Entity.prototype.draw.call(this);
};
};
function SpeciesFour(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 140, 200, 45, 45, 0.25, 3, true, false);
    this.leftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 140, 250, 45, 45, 0.25, 3, true, false);
    this.rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 140, 290, 50, 45, 0.25, 3, true, false);
    this.upAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 140, 340, 45, 45, 0.25, 3, true, false);
    this.left = false;
    this.up = false;
    this.down = false;
     this.size = 1.2;
    this.radius = 20;
    this.key = 4;
    this.id = 4;
    this.x  =  4 + (Math.random() * 780) + 1 ;
    this.y  =  4 + (Math.random() * 680) + 1;
    Entity.call(this, game, this.x, this.y);
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
     if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
   


SpeciesFour.prototype = new Entity();
Species.prototype.constructor = Species;



this.collideRight = function () {
    return this.x + this.radius > 780;
};
this.collideLeft = function () {
    return this.x - this.radius < -10;
};
this.collideBottom = function () {
    return this.y + this.radius > 690;
};
this.collideTop = function () {
    return this.y - this.radius < -10;
};

this.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


this.update = function () {
     Entity.prototype.update.call(this);

    this.x += this.velocity.x * this.game.clockTick;
    this.y += this.velocity.y * this.game.clockTick;

         if (this.collideLeft()){
            this.left = false;
           this.right = true;
           this.velocity.x = -this.velocity.x;
        }
        if(this.collideRight()) {
            this.right = false;
            this.left = true;
        this.velocity.x = -this.velocity.x;
        }
    if (this.collideTop()){
        this.up = false;
        this.down = true;
        this.velocity.y = -this.velocity.y;
    } 
    if(this.collideBottom()) {
        this.down = false;
        this.up = true;
        this.velocity.y = -this.velocity.y;
    }

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent)) {
            var temp = this.velocity;
            this.velocity = ent.velocity;
            ent.velocity = temp;
            temp = this.left;
            this.left = ent.left;
            ent.left = temp;
            temp = this.right;
            this.right = ent.right;
            ent.right = temp;
            temp = this.up;
            this.up = ent.up;
            ent.up = temp;
            temp = this.down;
            this.down = ent.down;
            ent.down = temp;
           if(this.id != ent.id && ent.size < this.size){
                    ent.removeFromWorld = true;
                } else if (ent.id == 6){
                    
                    this.size = this.size * 1.25;
                    this.radius = this.radius * 1.25;
                    ent.removeFromWorld = true;
                }


        };
    };

    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent) {
            var dist = distance(this, ent);
            var difX = (ent.x - this.x) / dist;
            var difY = (ent.y - this.y) / dist;
            // this.velocity.x += difX / (dist * dist) * acceleration;
            // this.velocity.y += difY / (dist * dist) * acceleration;

            var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
            if (speed > maxSpeed) {
                var ratio = maxSpeed / speed;
                this.velocity.x *= ratio;
                this.velocity.y *= ratio;
            };
        };
    }

    this.velocity.x -= (1 - friction) * this.game.clockTick * this.velocity.x;
    this.velocity.y -= (1 - friction) * this.game.clockTick * this.velocity.y;

   

    
     map[this.key] = dimension(this.x,this.y, this.size);

    
    Entity.prototype.update.call(this);
}

this.draw = function (ctx) {
     if (this.left) {
        this.leftAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }else if(this.right){
         this.rightAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }else if(this.up){
           this.upAnimation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }
    else {
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y,this.size);
    }
    Entity.prototype.draw.call(this);
};
};

function Food(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/food.png"), 300, 150, 30, 16, 0.5, 1, true, false);
    this.radius = 10;
    this.id = 6;
    this.key = 5;
    this.size = 7;
    this.x = 4 + (Math.random() * 780) + 1;
    this.y = 4 + (Math.random() * 680) + 1;
    Entity.call(this, game, this.x, this.y);
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
     if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
   


Food.prototype = new Entity();
Food.prototype.constructor = Species;



this.collideRight = function () {
    return this.x + this.radius >780;
};
this.collideLeft = function () {
    return this.x - this.radius < 0;
};
this.collideBottom = function () {
    return this.y + this.radius > 690;
};
this.collideTop = function () {
    return this.y - this.radius < 0;
};

this.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


this.update = function () {
     //Entity.prototype.update.call(this);



    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent)) {
             
            if(this.id != ent.id){
            this.removeFromWorld = true;
             ent.survive = 1;
         }


        };
    };
  
   
  /// map[this.key] = new dimension(this.x,this.y, 1.5);

    
    Entity.prototype.update.call(this);
}

this.draw = function (ctx) {
    
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y,1.5);
  
    Entity.prototype.draw.call(this);
};

};
// the "main" code begins here
var friction = 1;
var acceleration = 10000;
var maxSpeed = 2000;

var map  = new Object();

var dimension = function(x,y, size){
    this.x = x;
    this.y = y;
    this.size = size;
}
var ASSET_MANAGER = new AssetManager();


ASSET_MANAGER.queueDownload("./img/background.jpeg");
ASSET_MANAGER.queueDownload("./img/species.png");
ASSET_MANAGER.queueDownload("./img/food.png");
var bg={
bg:''
};
var species = {
species:''
};

var species3 = {
    species:''
};

var species4 = {
        species:''
};

var species2 = {
        species:''
            };
            var food = {
                food:''
                };

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    
    var gameEngine = new GameEngine();
    
    gameEngine.init(ctx);
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/background.jpeg"));
    bg.bg = bg;
      gameEngine.addEntity(bg);
   
   
    var spec = new Species(gameEngine);
    species.species=spec;
    console.log("((((((((---"+species.species.x);
    gameEngine.addEntity(spec);

    
    for (var i = 0; i < 15; i++) {
        spec = new Species(gameEngine);
        gameEngine.addEntity(spec);

    };
 
     var spec3 = new SpeciesTwo(gameEngine);
     species2.species = spec3;
    gameEngine.addEntity(spec3);
    for (var i = 0; i < 15; i++) {
        spec3 = new SpeciesTwo(gameEngine);
        gameEngine.addEntity(spec3);

    };
     var spec4 = new SpeciesThree(gameEngine);
     species3.species = spec4;
    gameEngine.addEntity(spec4);
    for (var i = 0; i < 15; i++) {
        spec4 = new SpeciesThree(gameEngine);
        gameEngine.addEntity(spec4);

    };
     var spec5 = new SpeciesFour(gameEngine);
     species4.species = spec5;
    gameEngine.addEntity(spec5);
    for (var i = 0; i < 15; i++) {
        spec5 = new SpeciesFour(gameEngine);
        gameEngine.addEntity(spec5);

    };
     
    var food = new Food(gameEngine);
    food.food = food;
    gameEngine.addEntity(food);
    for (var i = 0; i < 20; i++) {
        food = new Food(gameEngine);
        gameEngine.addEntity(food);

    };
    

      gameEngine.start();
    
    
 
   
});
