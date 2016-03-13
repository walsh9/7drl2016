Game.Map = {
  init: function(grid) {
    this.grid = grid;
    this.color = 0xaaaaff;
    this.entities = {};
    this.items = {};
    this.targets = [];
    this.scheduler = new ROT.Scheduler.Simple();
    this.engine = new ROT.Engine(this.scheduler);
    return this;
  },
  find: function(qualifyFunction) {
    var candidates = this.grid.filterCells(qualifyFunction);
    var length = candidates.length;
    return candidates[Math.floor(ROT.RNG.getUniform() * (length))];
  },
  randomEmpty: function() {
    var map = this;
    return this.find(function(cell) {
      return cell.dug && 
      map.unoccupiedAt(cell.x, cell.y);
    });
  },
  randomDug: function() {
    return this.find(function(cell) {
      return cell.dug;
    });
  },
  randomUndug: function() {
    return this.find(function(cell) {
      return !cell.dug;
    });
  },
  randomStable: function() {
    var map = this;
    return this.find(function(cell) {
      return !cell.dug && 
        cell.south && 
        !cell.south.dug && 
        map.unoccupiedAt(cell.x, cell.y);
    });
  },
  addEntity: function(entity) {
    entity.map = this;
    this.updateEntityPosition(entity);
    if (entity.isPlayer) {
        this.player = entity;
    }
    this.scheduler.add(entity, true);
  },
  removeEntity: function(entity) {
    var key = entity.x + ',' + entity.y;
    if (this.entities[key] == entity) {
        delete this.entities[key];
    }
    this.scheduler.remove(entity);
  },
  addItem: function(x, y, item) {
    
    item.map = this;
    item.x = x;
    item.y = y;
    var key = x + ',' + y;
    if (this.items[key]) {
      var neighbors = item.map.grid.getCell(x,y).neighbors();
      neighbors.some(function (neighbor) {
         item.map.addItem(neighbor.x, neighbor.y, item);
      }, item.map);
    } else {
      this.items[key] = item;
      return true;
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
        throw new Error('Tried to add an entity at an occupied position.');
    }
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

