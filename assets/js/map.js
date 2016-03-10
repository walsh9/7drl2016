Game.Map = {
  init: function(grid) {
    this.grid = grid;
    this.entities = {};
    return this;
  },
  find: function(qualifyFunction) {
    var candidates = this.grid.filterCells(qualifyFunction);
    var length = candidates.length;
    return candidates[Math.floor(ROT.RNG.getUniform() * (length - 1))];
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
    return this.find(function(cell) {
      return !cell.dug && cell.south && !cell.south.dug;
    });
  },
  addEntity: function(entity) {
    entity.map = this;
    this.updateEntityPosition(entity);
    //this.scheduler.add(entity, true);
  },
  removeEntity: function(entity) {
    var key = entity.x + ',' + entity.y;
    if (this.entities[key] == entity) {
        delete this.entities[key];
    }
    //this.scheduler.remove(entity);
  },
  updateEntityPosition: function(entity, oldX, oldY) {
    if (typeof oldX === 'number') {
        var oldKey = oldX + ',' + oldY;
        if (this.entities[oldKey] == entity) {
            delete this.entities[oldKey];
        }
    }
    if (entity.x < 0 || entity.x >= this.grid.columns ||
        entity.x < 0 || entity.y >= this.grid.rows) {
        throw new Error("Entity's position is out of bounds.");
    }
    var key = entity.x + ',' + entity.y;
    if (this.entities[key]) {
        throw new Error('Tried to add an entity at an occupied position.');
    }
    this.entities[key] = entity;
  },
  entityAt: function(x, y){
    return this.entities[x + ',' + y];
  }
};

Game.Map.Generators = {};

