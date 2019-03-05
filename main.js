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

function Background(game, spritesheet) {
    this.x = 0;
    this.y = 0;
    this.spritesheet = spritesheet;
    this.speed = 0;
    this.game = game;
    this.ctx = game.ctx;
};

Background.prototype.draw = function () {
    this.ctx.drawImage(this.spritesheet,
                   this.x, this.y);
};

Background.prototype.update = function () {
    this.x -= this.game.clockTick * this.speed;
    if (this.x < -500) this.x = 0;

};
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
    Entity.call(this, game, 4 + (Math.random() * 750) + 1, 4 + (Math.random() * 680) + 1);
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
     if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
   
}

Species.prototype = new Entity();
Species.prototype.constructor = Species;



Species.prototype.collideRight = function () {
    return this.x + this.radius > 780;
};
Species.prototype.collideLeft = function () {
    return this.x - this.radius < -10;
};
Species.prototype.collideBottom = function () {
    return this.y + this.radius > 690;
};
Species.prototype.collideTop = function () {
    return this.y - this.radius < -10;
};

Species.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


Species.prototype.update = function () {
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


  console.log(this.game.clockTick);
   



    
    Entity.prototype.update.call(this);
}

Species.prototype.draw = function (ctx) {
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

function SpeciesTwo(game) {
   this.animation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 200, 45, 45, 0.25, 3, true, false);
    this.leftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 245, 45, 45, 0.25, 3, true, false);
    this.rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 290, 45, 45, 0.25, 3, true, false);
    this.upAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 2, 340, 45, 45, 0.25, 3, true, false);
    this.left = false;
    this.up = false;
    this.down = false;
     this.size = 1.2;
    this.jumping = false;
    this.radius = 20;
    this.id = 2;
    Entity.call(this, game, 4 + (Math.random() * 780) + 1, 4 + (Math.random() * 680) + 1);
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
     if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
   
}

SpeciesTwo.prototype = new Entity();
Species.prototype.constructor = Species;



SpeciesTwo.prototype.collideRight = function () {
    return this.x + this.radius > 780;
};
SpeciesTwo.prototype.collideLeft = function () {
    return this.x - this.radius < -10;
};
SpeciesTwo.prototype.collideBottom = function () {
    return this.y + this.radius > 690;
};
SpeciesTwo.prototype.collideTop = function () {
    return this.y - this.radius < -10;
};

SpeciesTwo.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


SpeciesTwo.prototype.update = function () {
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

   
     
  console.log(this.game.clockTick);
    



    
    Entity.prototype.update.call(this);
}

SpeciesTwo.prototype.draw = function (ctx) {
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

function SpeciesThree(game) {
   this.animation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 290, 200, 45, 45, 0.25, 3, true, false);
    this.leftAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 290, 250, 45, 45, 0.25, 3, true, false);
    this.rightAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 290, 290, 45, 45, 0.25, 3, true, false);
    this.upAnimation = new Animation(ASSET_MANAGER.getAsset("./img/species.png"), 290, 340, 45, 45, 0.25, 3, true, false);
    this.left = false;
    this.up = false;
    this.down = false;
     this.size = 1.2;
    this.radius = 20;
    this.id = 3;
    Entity.call(this, game, 4 + (Math.random() * 780) + 1, 4 + (Math.random() * 680) + 1);
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
     if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
   
}

SpeciesThree.prototype = new Entity();
SpeciesThree.prototype.constructor = Species;



SpeciesThree.prototype.collideRight = function () {
    return this.x + this.radius > 780;
};
SpeciesThree.prototype.collideLeft = function () {
    return this.x - this.radius < -10;
};
SpeciesThree.prototype.collideBottom = function () {
    return this.y + this.radius > 690;
};
SpeciesThree.prototype.collideTop = function () {
    return this.y - this.radius < -10;
};

SpeciesThree.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


SpeciesThree.prototype.update = function () {
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

   
  console.log(this.game.clockTick);
    


    
    Entity.prototype.update.call(this);
}

SpeciesThree.prototype.draw = function (ctx) {
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
    this.id = 4;
    Entity.call(this, game, 4 + (Math.random() * 780) + 1, 4 + (Math.random() * 680) + 1);
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
     if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
   
}

SpeciesFour.prototype = new Entity();
Species.prototype.constructor = Species;



SpeciesFour.prototype.collideRight = function () {
    return this.x + this.radius > 780;
};
SpeciesFour.prototype.collideLeft = function () {
    return this.x - this.radius < -10;
};
SpeciesFour.prototype.collideBottom = function () {
    return this.y + this.radius > 690;
};
SpeciesFour.prototype.collideTop = function () {
    return this.y - this.radius < -10;
};

SpeciesFour.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


SpeciesFour.prototype.update = function () {
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

   
     
  console.log(this.game.clockTick);
    


    
    Entity.prototype.update.call(this);
}

SpeciesFour.prototype.draw = function (ctx) {
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


function Food(game) {
    this.animation = new Animation(ASSET_MANAGER.getAsset("./img/food.png"), 300, 150, 30, 16, 0.5, 1, true, false);
    this.radius = 10;
    this.id = 6;
    Entity.call(this, game, 4 + (Math.random() * 780) + 1, 4 + (Math.random() * 680) + 1);
    this.velocity = { x: Math.random() * 100, y: Math.random() * 100 };
    var speed = Math.sqrt(this.velocity.x * this.velocity.x + this.velocity.y * this.velocity.y);
    
     if (speed > maxSpeed) {
        var ratio = maxSpeed / speed;
        this.velocity.x *= ratio;
        this.velocity.y *= ratio;
    };
   
}

Food.prototype = new Entity();
Food.prototype.constructor = Species;



Food.prototype.collideRight = function () {
    return this.x + this.radius >780;
};
Food.prototype.collideLeft = function () {
    return this.x - this.radius < 0;
};
Food.prototype.collideBottom = function () {
    return this.y + this.radius > 690;
};
Food.prototype.collideTop = function () {
    return this.y - this.radius < 0;
};

Food.prototype.collide = function (other) {
    return distance(this, other) < this.radius + other.radius;
};


Food.prototype.update = function () {
     Entity.prototype.update.call(this);



    for (var i = 0; i < this.game.entities.length; i++) {
        var ent = this.game.entities[i];
        if (this != ent && this.collide(ent)) {
             
            if(this.id != ent.id){
            this.removeFromWorld = true;
             ent.survive = 1;
         }


        };
    };
  console.log(this.game.clockTick);
   


    
    Entity.prototype.update.call(this);
}

Food.prototype.draw = function (ctx) {
    
        this.animation.drawFrame(this.game.clockTick, ctx, this.x, this.y,1.5);
  
    Entity.prototype.draw.call(this);
};


// the "main" code begins here
var friction = 1;
var acceleration = 10000;
var maxSpeed = 2000;

var ASSET_MANAGER = new AssetManager();


ASSET_MANAGER.queueDownload("./img/background.jpeg");
ASSET_MANAGER.queueDownload("./img/species.png");
ASSET_MANAGER.queueDownload("./img/food.png");

ASSET_MANAGER.downloadAll(function () {
    console.log("starting up da sheild");
    var canvas = document.getElementById('gameWorld');
    var ctx = canvas.getContext('2d');
    
    var gameEngine = new GameEngine();
    
    gameEngine.init(ctx);
    var bg = new Background(gameEngine, ASSET_MANAGER.getAsset("./img/background.jpeg"));
      gameEngine.addEntity(bg);
   
   
    var spec = new Species(gameEngine);
    gameEngine.addEntity(spec);

    
    for (var i = 0; i < 15; i++) {
        spec = new Species(gameEngine);
        gameEngine.addEntity(spec);

    };
 
     var spec3 = new SpeciesTwo(gameEngine);
    gameEngine.addEntity(spec3);
    for (var i = 0; i < 15; i++) {
        spec3 = new SpeciesTwo(gameEngine);
        gameEngine.addEntity(spec3);

    };
     var spec4 = new SpeciesThree(gameEngine);
    gameEngine.addEntity(spec4);
    for (var i = 0; i < 15; i++) {
        spec4 = new SpeciesThree(gameEngine);
        gameEngine.addEntity(spec4);

    };
     var spec5 = new SpeciesFour(gameEngine);
    gameEngine.addEntity(spec5);
    for (var i = 0; i < 15; i++) {
        spec5 = new SpeciesFour(gameEngine);
        gameEngine.addEntity(spec5);

    };

    var food = new Food(gameEngine);
    gameEngine.addEntity(food);
    for (var i = 0; i < 20; i++) {
        food = new Food(gameEngine);
        gameEngine.addEntity(food);

    };
    
      gameEngine.start();
    
    
 
   
});
