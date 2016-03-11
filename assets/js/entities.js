Game.Entity.actions = {};

Game.Entity.actions.playerAction = function () {
  this.acting = true;
  Game.refresh();
  console.log('waiting');
  this.map.engine.lock();
  this.acting = false;
};

Game.Entity.actions.randomWalk = function () {
  var targetCell = this.cellHere().randomLink();
  this.tryMove(targetCell.column, targetCell.row, this.map);
};

Game.Entity.actions.fall = function () {
  var targetCell = this.cellHere().south;
  if (targetCell.dug && this.map.unoccupiedAt(targetCell.column, targetCell.row)) {
    this.tryMove(targetCell.column, targetCell.row, this.map);
  }
};

Game.Entity.actions.nullAction = function() {};


Game.Entity.templates = {};

Game.Entity.templates.player = {
  tile: "playerbot",
  canDig:    true,
  canTunnel: true,
  canPush:   true,
  isPlayer:  true,
  action: Game.Entity.actions.playerAction
};

Game.Entity.templates.crate = {
  tile: "crate",
  canTunnel: true,
  isPushable: true,
  speed: 1000,
  action: Game.Entity.actions.fall,
};

Game.Entity.templates.skullbot = {
  tile: "skullbot",
  action: Game.Entity.actions.randomWalk
};