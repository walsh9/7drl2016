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
  console.log('splat');
};

Game.Entity.actions.randomWalk = function () {
  var targetCell = this.cellHere().randomLink();
  this.tryMove(targetCell.x, targetCell.y, this.map);
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

Game.Entity.templates = {};

Game.Entity.templates.player = {
  tile: "playerbot",
  canDig:    true,
  canTunnel: true,
  canPush:   true,
  isPlayer:  true,
  action: Game.Entity.actions.playerAction,
  dies: Game.Entity.actions.playerDie
};

Game.Entity.templates.crate = {
  tile: "crate",
  canTunnel:  true,
  canCrush:   true,
  canPush:    true,
  canPhase:   true,
  isPushable: true,
  speed: 1000,
  action: Game.Entity.actions.fall,
  //dies: Game.Entity.actions.botDie
};

Game.Entity.templates.skullbot = {
  tile: "skullbot",
  canKill: true,
  action: Game.Entity.actions.randomWalk,
  dies: Game.Entity.actions.botDie
};