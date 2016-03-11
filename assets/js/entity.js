Game.Entity = {
  init: function(options) {
    options      = options         || {};
    this.x       = options.x       || 0;
    this.y       = options.y       || 0;
    this.tile    = options.tile    || "error";
    this.color   = options.color   || "#ffffff";
    this.speed   = options.speed   || 1000;
    this.canTunnel  = options.canTunnel  || false;
    this.canDig     = options.canDig     || false;
    this.canPhase   = options.canPhase   || false;
    this.isFalling  = options.isFalling  || false;
    this.isPushable = options.isPushable || false;
    this.isPlayer   = options.isPlayer   || false;
    this.action = options.action || Game.Entity.actions.nullAction;
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
    if (this.map.unoccupiedAt(x, y)) {
      if (thisCell.linked(targetCell)) {
        this.setPosition(x, y, map);
        return true;
      } else if (targetCell.dug && this.canTunnel) {
        thisCell.link(targetCell);
        this.setPosition(x, y, map);  
      } else if (!targetCell.dug && this.canDig) {
        targetCell.dug = true;
        thisCell.link(targetCell);
        this.setPosition(x, y, map);  
      }
    } else {
      var target = this.map.entityAt(x, y);
      if (target.isPushable){
        var pushX = x + (x - oldX);
        var pushY = y + (y - oldY);
        target.tryMove(pushX, pushY, map);
      }
    }
    return false;
  },
  getSpeed: function() {
    return this.speed;
  },
  act: function() {
    this.action.call(this);
  }
};
