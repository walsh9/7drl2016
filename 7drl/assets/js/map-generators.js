Game.Map.Generators.Basic = {
  create: function(width, height, options) {
    this.options = options || {};
    var grid = Object.create(Game.Grid).init(width, height);
    var map = Object.create(Game.Map).init(grid, options);
    return map;
  },
  placeWalls: function(map) {
    for(var y = 0; y < map.grid.height; y++) {
      map.grid.getCell(0, y).impassable = true;
      map.grid.getCell(map.grid.width - 1, y).impassable = true;
    }
    for(var x = 0; x < map.grid.width; x++) {
      map.grid.getCell(x, 0).impassable = true;
      map.grid.getCell(x, map.grid.height - 1).impassable = true;
    }

    var doorPositions = [{x:1, y:0}, {x:map.grid.width - 2, y:0}].randomize();

    var energyDoor = Object.create(Game.Entity).init(Game.Entity.templates.energyDoor, doorPositions[0].x, doorPositions[0].y);
    var datachipDoor = Object.create(Game.Entity).init(Game.Entity.templates.datachipDoor, doorPositions[1].x, doorPositions[1].y); 
    map.addEntity(energyDoor);
    map.addEntity(datachipDoor);
    map.energyDoor   = energyDoor;
    map.datachipDoor = datachipDoor;
    return map;
  },
  placeItems: function(map) {
    var energyCount = this.options.energy;
    var energySpread = this.options.energySpread;
    var pos = map.randomPristine();
    while (energyCount > 0) {
      for(var n = 0; n < energySpread; n++) {
        if (energyCount > 0) {
          energy = Object.create(Game.Item).init(Game.Item.templates.energy);
          map.addItem(pos.x, pos.y, energy);
          energyCount--;
        }
      }
      pos = map.randomPristine();
    }
    return(map);
  },
  digPaths: function(map) {
    var linkTarget = {};
    var cell = map.grid.getCell(Math.floor(map.grid.width / 2), map.grid.height - 2);
    var undugNeighbors = cell.neighbors().filter(function(cell) {
      return !cell.dug;
    });
    if (linkTarget) {
    linkTarget = undugNeighbors[Math.floor(ROT.RNG.getUniform() * (undugNeighbors.length))];
      cell.link(linkTarget);
      cell = linkTarget;
    }
    for (var linkCount = 0; linkCount < 80; linkCount++) {
      undugNeighbors = cell.neighbors().filter(function(cell) {
        return !cell.dug && !map.itemAt(cell.x, cell.y);
      });
      linkTarget = undugNeighbors[Math.floor(ROT.RNG.getUniform() * (undugNeighbors.length))];
      if (linkTarget && ROT.RNG.getUniform() < 0.90) {
        cell.link(linkTarget);
        cell = linkTarget;
      } else {
        cell = map.randomPristine();
        if (!cell) {return map;}
      }
    }
    return map;
  },
  populate: function(map) {
    var targetCell, n, enemy, crate;
    var hunterCount  = this.options.hunters;
    var stalkerCount = this.options.stalkers;
    var crateCount = this.options.crates;
    var crateTypes = this.options.crateTypes;
    for (n = 0; n < crateCount; n++) {
      targetCell = map.randomStable();
      if (!targetCell) {break;}
      crate = Object.create(Game.Entity).init(Game.Entity.templates.crate, targetCell.x, targetCell.y);
      crate.crateType = Game.Crates.random(crateTypes);
      map.addEntity(crate);
    }
    for (n = 0; n < hunterCount; n++) {
      targetCell = map.randomEmpty(0, 0, map.grid.width, map.grid.height - 5);
      if (!targetCell) {break;}
      enemy = Object.create(Game.Entity).init(Game.Entity.templates.skullbot, targetCell.x, targetCell.y);
      map.addEntity(enemy);
    }
    for (n = 0; n < stalkerCount; n++) {
      targetCell = map.randomEmpty(0, 0, map.grid.width, map.grid.height - 5);
      if (!targetCell) {break;}
      enemy = Object.create(Game.Entity).init(Game.Entity.templates.spookbot, targetCell.x, targetCell.y);
      map.addEntity(enemy);
    }
    return map;
  },
  addPlayer: function(map, player) {
    player.x = Math.floor(map.grid.width / 2);
    player.y = map.grid.height - 2;
    map.addEntity(player);
    map.targets = [player];
  }
};