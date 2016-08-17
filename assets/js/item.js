Game.Item = {
  init: function(options, x, y) {
    options      = options         || {};
    this.x = x || 0;
    this.y = y || 0;
    this.name    = options.name    || "";
    this.tile    = options.tile    || "error";
    this.color   = options.color   || "#ffffff";
    this.pickupSound = options.pickupSound || '';
    this.map = null;
    return this;
  },
  collect: function() {
    return this.map.removeItem(this);
  }
};
