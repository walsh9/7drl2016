Game.Entity = {
  init: function(options, x, y) {
    options      = options         || {};
    this.defaultTemplate = options || {};
    this.x       = x               || 0;
    this.y       = y               || 0;
    this.items   = {};
    this.frustration = 0;
    this.boilingPoint = options.boilingPoint || 40;
    this.isAngry = false;
    this.unknown = options.unknown || false;
    this.tile    = options.tile    || "error";
    this.color   = options.color   || 0xffffff;
    this.speed   = options.speed   || 1000;
    this.niceToBots = options.niceToBots || false;
    this.canTunnel  = options.canTunnel  || false;
    this.canDig     = options.canDig     || false;
    this.canPhase   = options.canPhase   || false;
    this.canCrush   = options.canCrush   || false;
    this.canPush    = options.canPush    || false;
    this.canKill    = options.canKill    || false;
    this.isFalling  = options.isFalling  || false;
    this.isPushable = options.isPushable || false;
    this.isPlayer   = options.isPlayer   || false;
    this.angryForm  = options.angryForm  || {};
    this.angrySound = options.angrySound || '';
    this.calmSound  = options.calmSound  || '';
    this.action    = options.action     || Game.Entity.actions.nullAction;
    this.dies      = options.dies       || Game.Entity.actions.nullAction;
    this.activate  = options.activate   || Game.Entity.actions.nullAction;
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
  movePosition: function (x, y) {
    let thisEntity = this;
    var oldX = this.x;
    var oldY = this.y;
    return new Promise(function(resolve) {
      thisEntity.slidingX = oldX;
      thisEntity.slidingY = oldY;
      function slide(entity, x, y) {
        let threshold = 0.01;
        if ((entity.slidingX < x + threshold && entity.slidingX > x - threshold) && 
            (entity.slidingY < y + threshold && entity.slidingY > y - threshold)) {    
          entity.slidingX = entity.x = x;
          entity.slidingY = entity.y = y;
          thisEntity.map.updateEntityPosition(thisEntity, oldX, oldY);
          resolve(thisEntity);
        } else {
          var speed = 0.25;
          var interval = 1/60 * 1000;
          if      (entity.slidingX > x) {entity.slidingX = entity.slidingX - speed}
          else if (entity.slidingX < x) {entity.slidingX = entity.slidingX + speed} 
          if      (entity.slidingY > y) {entity.slidingY = entity.slidingY - speed}
          else if (entity.slidingY < y) {entity.slidingY = entity.slidingY + speed}
          Game.refresh();
          setTimeout(function() { slide(entity, x, y); }, interval);
        }
      }
      slide(thisEntity, x, y);
    });
  },
  cellHere: function() {
    return this.map.grid.getCell(this.x, this.y);
  },
  tryMove: function(x, y, map) {
    if (this.x === x && this.y === y) {
      return Promise.resolve(false);
    }
    if (this.isPlayer && this.map.entityAt(x, y)) {
      this.map.entityAt(x, y).activate.call(null, this);
    }
    //Check for valid moves, pushes, do other things
    var oldX = this.x;
    var oldY = this.y;
    var thisCell = this.cellHere();
    var targetCell = this.map.grid.getCell(x, y);
    var thisEntity = this;
    if (targetCell && !targetCell.impassable) {
      return thisEntity.tryClearEntityAt(targetCell)
      .then(function(x) {
        return thisEntity.tryEnter(targetCell);
      });
    }
    return Promise.resolve(false);
  },
  canEnterCell: function(x, y) {
    var targetCell = this.map.grid.getCell(x, y);
    if (this.map.unoccupiedAt(x, y)) {
      if (this.cellHere().linked(targetCell)) {
        return true;
      } else if (targetCell.dug && this.canTunnel) {
        return true;
      } else if (!targetCell.dug && this.canDig) {
        return true;
      } else if (this.canPhase) {
        return true;
      }
    }
  },
  canPushTarget: function(target) {
    if (this.canPush && target.isPushable && target.y === this.y) {
      var pushX = target.x + (target.x - this.x);
      var pushY = target.y + (target.y - this.y);
      return target.canMove(pushX, pushY);
    }
    return false;
  },
  canMove: function(x, y) {
    var targetCell = this.map.grid.getCell(x, y);
    if (targetCell && !targetCell.impassable) {
      var target = this.map.entityAt(x, y);
      if (target && this.canPushTarget(target)) {
        return true;
      }
      if (this.canEnterCell(x, y)) {
        return true;
      }
    }
    return false;
  },
  getSpeed: function() {
    return this.speed;
  },
  getAngry: function() {
    Game.Sound.play(this.angrySound);
    this.isAngry = true;
    Object.assign(this, this.angryForm);
  },
  frustrate: function(n) {
    this.frustration += n;
    if (this.frustration > this.boilingPoint) {
      this.getAngry();
    }
  },
  relax: function(n) {
    this.frustration -= n;
    if (this.frustration < 0) {
      Game.Sound.play(this.calmSound);
      this.calmDown();
    }
  },
  calmDown: function() {
    this.frustration = 0;
    this.isAngry = false;
    Object.assign(this, this.defaultTemplate);
  },
  getTile: function() {
    if (this.crateType === undefined) {
      return this.tile;
    } else {
      return Game.Crates.getTile(this.crateType);
    }
  },
  getColor: function() {
    if (this.crateType === undefined) {
      return this.color;
    } else {
      return Game.Crates.getColor(this.crateType);
    }
  },
  act: function() {
    var entity = this;
    return new Promise(function(resolve) {
      Promise.resolve(entity.action.call(entity))
      .then(Game.refresh)
      .then(resolve);
    });
  },
  kill: function(killer) {
    return this.dies.call(this, killer);
  },
  isCheckmatedPlayer: function() {
    var player = this;
    var here = this.map.grid.getCell(this.x, this.y);
    var neighbors = here.neighbors();
    var passableNeigbors = neighbors.filter(function(neighbor) {
      return (player.canMove(neighbor.x, neighbor.y, player.map));
    });
    return passableNeigbors.length === 0;
  },
  tryClearEntityAt(targetCell) {
    var thisEntity = this;
    var oldX = this.x;
    var oldY = this.y;
    var x = targetCell.x;
    var y = targetCell.y;
    return new Promise(function(resolve) {
      var target = thisEntity.map.entityAt(x, y);
      if (target) { // Bump logic
        if (thisEntity.canPushTarget(target)) {
          var pushX = target.x + (target.x - thisEntity.x);
          var pushY = target.y + (target.y - thisEntity.y);
          resolve(target.tryMove(pushX, pushY));
        } else if (thisEntity.canKill || thisEntity.canCrush && target.y == oldY + 1) {
          target.kill(thisEntity);
          resolve(true);
        }
      }
      resolve(false);
    });
  },
  tryEnter(targetCell) {
    var x = targetCell.x;
    var y = targetCell.y;
    var thisCell = this.cellHere();
    if (this.canEnterCell(x, y)) {
      if (targetCell.dug && this.canTunnel) {
        thisCell.link(targetCell);
      } else if (!targetCell.dug && this.canDig) {
        Game.Sound.play('dig');
        targetCell.dug = true;
        thisCell.link(targetCell);
      }
      return this.movePosition(x, y);      
    }
    return false;
  }
};
