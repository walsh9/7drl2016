Game.Entity.actions = {};

Game.Entity.actions.playerAction = function () {
  this.acting = true;
  Game.refresh();
  this.map.engine.lock();
  this.acting = false;
  console.log(this.map.targets);
};

Game.Entity.actions.playerDie = function (killer) {
  console.log('GAME OVER');
};

Game.Entity.actions.die = function (killer) {
  this.map.removeEntity(this);
};

Game.Entity.actions.decoyDie = function (killer) {
  this.map.targets.pop();
  this.map.removeEntity(this);
};

Game.Entity.actions.botDie = function (killer) {
  var loot = Object.create(Game.Item).init(Game.Item.templates.datachip);
  this.map.addItem(this.x, this.y, loot);
  this.map.removeEntity(this);
  console.log(killer.tile, 'killed', this.tile);
};

Game.Entity.actions.randomWalk = function () {
  var targetCell = this.cellHere().randomLink();
  return this.tryMove(targetCell.x, targetCell.y, this.map);
};

Game.Entity.actions.seekPlayer = function () {
  var entity = this;
  var target = entity.map.targets.slice(-1)[0];
  var pathfinder = Object.create(Game.Pathfinder).init(entity.map.grid, target,
  function passable(here, there) {
    return ((here.linked(there)) || 
            (entity.canTunnel && there.dug) ||
            (entity.canDig) || // and diggable
            (entity.canPhase)
          );
  });
  var targetCell = pathfinder.getApproachFrom(entity.x, entity.y);
  return this.tryMove(targetCell.x, targetCell.y, this.map);
};

Game.Entity.actions.botMove = function () {
  if (this.isAngry) {
   this.relax(5);
  } else {
    this.frustrate(1);
  }
  if (!Game.Entity.actions.seekPlayer.call(this)) {
    Game.Entity.actions.randomWalk.call(this);
    this.frustrate(2);
  }
};

Game.Entity.actions.fall = function () {
  var targetCell = this.cellHere().south;
  if (this.falling > 0) {  // falling
    if (targetCell && (targetCell.dug || this.canDig)) { // falling further
      var fell = this.tryMove(targetCell.x, targetCell.y, this.map);
      if (fell) {
        this.falling += 1;
      }
    } else { // if only fell one tile, don't break;
      if (this.falling > 1) {
        this.kill(this);
      } else {
        this.falling = 0;
      }
    }
  } else {
    if (targetCell && targetCell.dug && this.map.unoccupiedAt(targetCell.x, targetCell.y) &&
       (this.tryMove(targetCell.x, targetCell.y, this.map))) {
        this.falling = 1;
    } else {
      this.falling = 0;
    }
  }
};

Game.Entity.actions.crateBreak = function (killer) {
  console.log(killer.tile, 'killed', this.tile);  
  if (killer === this) {
    var x = this.x;
    var y = this.y;
    var map = this.map;
    var crateType = this.crateType;
    this.map.removeEntity(this);
    if (crateType) {
      Game.Crates.doAction(crateType, x, y, map);
      Game.Crates.identify(crateType);
    }
  }
};


Game.Entity.actions.randomWalk = function () {
  var targetCell = this.cellHere().randomLink();
  this.tryMove(targetCell.x, targetCell.y, this.map);
};

Game.Entity.actions.nullAction = function() {};
