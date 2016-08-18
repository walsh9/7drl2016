Game.Map = {
  init: function(grid, options) {
    this.grid = grid;
    this.options = options || {};
    this.color = options.color || 0xaaaaff;
    this.entities = {};
    this.items = {};
    this.targets = [];
    this.crates = Object.create(Game.Crates.Group).init();
    this.scheduler = new ROT.Scheduler.Simple();
    this.engine = new ROT.Engine(this.scheduler);
    return this;
  },
  find: function(qualifyFunction) {
    var candidates = this.grid.filterCells(qualifyFunction);
    var length = candidates.length;
    return candidates[Math.floor(ROT.RNG.getUniform() * (length))];
  },
  randomEmpty: function(x, y, w, h) {
    x = x || 0;
    y = y || 0;
    w = w || this.grid.width;
    h = h || this.grid.height;
    var map = this;
    var emptyCell = this.find(function(cell) {
      return cell.dug && 
      !cell.impassable &&
      cell.x >= x && cell.x < x + w &&
      cell.y >= y && cell.y < y + h &&
      map.unoccupiedAt(cell.x, cell.y);
    });
    return emptyCell;
  },
  randomDug: function() {
    return this.find(function(cell) {
      return cell.dug && !cell.impassable;
    });
  },
  randomUndug: function() {
    return this.find(function(cell) {
      return !cell.dug && !cell.impassable;
    });
  },
  randomPristine: function() {
    var map = this;
    return this.find(function(cell) {
      return (!cell.dug && !map.itemAt(cell.x, cell.y) && !cell.impassable);
    });
  },
  randomStable: function() {
    var map = this;
    return this.find(function(cell) {
      return !cell.dug && 
        cell.south && 
        !cell.south.dug && 
        cell.y < map.grid.height - 5 &&
        !cell.impassable && 
        map.unoccupiedAt(cell.x, cell.y);
    });
  },
  addEntity: function(entity) {
    entity.map = this;
    this.updateEntityPosition(entity);
    if (entity.isPlayer) {
      this.player = entity;
    }
    if (entity.crateType !== undefined) {
      this.crates.add(entity);
    } else {
      this.scheduler.add(entity, true);
    }
  },
  removeEntity: function(entity) {
    var key = entity.x + ',' + entity.y;
    if (this.entities[key] == entity) {
      delete this.entities[key];
    }
    if (entity.crateType !== undefined) {
      this.crates.remove(entity);
    } else {
      this.scheduler.remove(entity);
    }
  },
  addItem: function(x, y, item) {
    item.map = this;
    item.x = x;
    item.y = y;
    var key = x + ',' + y;
    if (!this.items[key]) { // no item here, put it down
      this.items[key] = item;
    } else { // oh boy...
      var grid = this.grid;
      var itemOverflowMap = Object.create(grid).init(grid.width, grid.height);
      var here = itemOverflowMap.getCell(x, y);
      here.searched = true;
      var frontier = [here];
      while (frontier.length > 0) {
        current = frontier.shift();
        current.neighbors().some( function(neighbor) {
          if (neighbor.searched === undefined && 
              !item.map.grid.getCell(neighbor.x, neighbor.y).impassable &&
              !item.map.entityAt(neighbor.x, neighbor.y)) {
            key = neighbor.x + ',' + neighbor.y;
            if (!item.map.items[key]) {
              item.x = neighbor.x;
              item.y = neighbor.y;
              item.map.items[key] = item;
              frontier = [];
              return true;
            } else {
              neighbor.searched = true;
              frontier.push(neighbor);
            }
          }
        }, this);
      }
    }
  },
  removeItem: function(item) {
    var key = item.x + ',' + item.y;
    if (this.items[key] == item) {
      var name = item.name;
      delete this.items[key];
      return name;
    }
    return null;
  },
  updateEntityPosition: function(entity, oldX, oldY) {
    if (typeof oldX === 'number') {
        var oldKey = oldX + ',' + oldY;
        if (this.entities[oldKey] == entity) {
            delete this.entities[oldKey];
        }
    }
    if (entity.x < 0 || entity.x >= this.grid.width ||
        entity.x < 0 || entity.y >= this.grid.height) {
        throw new Error("Entity's position is out of bounds.");
    }
    var key = entity.x + ',' + entity.y;
    if (this.entities[key]) {
      var errorMessage = 'Tried to add ' + entity.tile + ' at ' + key + ', but ' + this.entities[key].tile + ' was already there.';
      throw new Error(errorMessage);
    }
    entity.slidingX = entity.x;
    entity.slidingY = entity.y;
    this.entities[key] = entity;
  },
  itemAt: function(x, y){
    return this.items[x + ',' + y];
  },
  entityAt: function(x, y){
    return this.entities[x + ',' + y];
  },
  unoccupiedAt: function(x, y) {
    return !!(this.entities[x + ',' + y] === undefined);
  }
};

Game.Map.Generators = {};

