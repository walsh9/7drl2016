Game.Entity = {
  init: function(options) {
    options      = options       || {};
    this.x       = options.x     || 0;
    this.y       = options.y     || 0;
    this.tile    = options.tile  || "error";
    this.color   = options.color || "#ffffff";
    this.canDig  = options.canDig       || false;
    this.canTunnel  = options.canTunnel  || false;
    this.canFall    = options.canTunnel  || false;
    this.isFalling  = options.isFalling  || false;
    this.isPlayer   = options.isPlayer   || false;
    this.map = null;
    return this;
  },
  setPosition: function (x, y) {
    var oldX = this.x;
    var oldY = this.y;
    this.x = x;
    this.y = y;
    if (this.map) {
        this.map.updateEntityPosition(this, oldX, oldY);
    }
    return this;
  },
  tryMove: function(x, y) {
    //Check for valid moves, pushes, do other things
    this.setPosition(x, y);
    return this;
  },
};
