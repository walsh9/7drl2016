Game.Entity = {
  init: function(options, x, y) {
    options      = options         || {};
    this.x       = x               || 0;
    this.y       = y               || 0;
    this.items   = {};
    this.tile    = options.tile    || "error";
    this.color   = options.color   || 0xffffff;
    this.speed   = options.speed   || 1000;
    this.canTunnel  = options.canTunnel  || false;
    this.canDig     = options.canDig     || false;
    this.canPhase   = options.canPhase   || false;
    this.canCrush   = options.canCrush   || false;
    this.canPush    = options.canPush    || false;
    this.canKill    = options.canKill    || false;
    this.isFalling  = options.isFalling  || false;
    this.isPushable = options.isPushable || false;
    this.isPlayer   = options.isPlayer   || false;
    this.action = options.action || Game.Entity.actions.nullAction;
    this.dies   = options.dies   || Game.Entity.actions.nullAction;
    this.map = null;
    return this;
  },
  setPosition: function (x, y, map) {
    var oldX = this.x;
    var oldY = this.y;
    this.x = x;
    this.y = y;
    if (map) {
        map.updateEntityPosition(this, oldX, oldY);
    }
    return this;
  },
  cellHere: function() {
    return this.map.grid.getCell(this.x, this.y);
  },
  tryMove: function(x, y, map) {
    //Check for valid moves, pushes, do other things
    var oldX = this.x;
    var oldY = this.y;
    var thisCell = this.cellHere();
    var targetCell = this.map.grid.getCell(x, y);
    if (targetCell) {
      var target = this.map.entityAt(x, y);
      if (target) { // Bump logic
        if (this.canPush && target.isPushable && target.y == oldY) {
          var pushX = x + (x - oldX);
          var pushY = y + (y - oldY);
          target.tryMove(pushX, pushY, map);
        } else if (this.canKill || this.canCrush && target.y == oldY + 1) {
          target.kill(this);
        }
      }
      if (this.map.unoccupiedAt(x, y)) { // Moving into unoccupied cell
        if (thisCell.linked(targetCell)) {
          return this.setPosition(x, y, map);
        } else if (targetCell.dug && this.canTunnel) {
          thisCell.link(targetCell);
          return this.setPosition(x, y, map);  
        } else if (!targetCell.dug && this.canDig) {
          targetCell.dug = true;
          thisCell.link(targetCell);
          return this.setPosition(x, y, map);  
        } else if (this.canPhase) {
          return this.setPosition(x, y, map);
        }
      }
    }
    return false;
  },
  getSpeed: function() {
    return this.speed;
  },
  act: function() {
    var entity = this;
    this.action.call(this);
    this.map.engine.lock();
    setTimeout(function() {
      entity.map.engine.unlock();
      Game.refresh();
    }, 50);
  },
  kill: function() {
    this.dies.call(this);
  }
};
