Game.Entity.actions = {};

Game.Entity.actions.playerAction = function () {
  this.acting = true;
  Game.refresh();
  this.map.engine.lock();
  this.acting = false;
};

Game.Entity.actions.playerDie = function (killer) {
  console.log('GAME OVER');
};

Game.Entity.actions.botDie = function (killer) {
  this.map.removeEntity(this);
  console.log(killer.tile, 'killed', this.tile);
};

Game.Entity.actions.randomWalk = function () {
  var targetCell = this.cellHere().randomLink();
  return this.tryMove(targetCell.x, targetCell.y, this.map);
};

Game.Entity.actions.seekPlayer = function () {
  var entity = this;
  var pathfinder = Object.create(Game.Pathfinder).init(entity.map.grid, entity.map.player,
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
    if (targetCell && targetCell.dug) { // falling further
      if (this.tryMove(targetCell.x, targetCell.y, this.map)) {
        this.falling += 1;
      }
      else { // if only fell one tile, don't break;
        if (this.falling > 1) {
          this.kill(this);
        } else {
          this.falling = 0;
        }
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

Game.Entity.actions.randomWalk = function () {
  var targetCell = this.cellHere().randomLink();
  this.tryMove(targetCell.x, targetCell.y, this.map);
};

Game.Entity.actions.nullAction = function() {};
