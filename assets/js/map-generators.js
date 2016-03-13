Game.Map.Generators.Basic = {
  create: function(width, height) {
    var grid = Object.create(Game.Grid).init(width, height);
    var map = Object.create(Game.Map).init(grid);
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
    return map;
  },
  placeItems: function(map) {
    var energyCount = 10;
    var energy;
    var pos = map.randomPristine();
    for(var n = 0; n < energyCount; n++) {
      energy = Object.create(Game.Item).init(Game.Item.templates.energy);
      map.addItem(pos.x, pos.y, energy);
    }
    pos = map.randomPristine();
    for(n = 0; n < energyCount; n++) {
      energy = Object.create(Game.Item).init(Game.Item.templates.energy);
      map.addItem(pos.x, pos.y, energy);
    }

    return(map);
  },
  digPaths: function(map) {
    var linkTarget = {};
    var cell = map.randomPristine();
    for (var linkCount = 0; linkCount < 100; linkCount++) {
      var undugNeighbors = cell.neighbors().filter(function(cell) {
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
    console.log(map);
    return map;
  },
  populate: function(map) {
    var targetCell, n;
    var enemyCount = 4;
    var crateCount = 8;
    for (n = 0; n < crateCount; n++) {
      targetCell = map.randomStable();
      if (!targetCell) {break;}
      var crate = Object.create(Game.Entity).init(Game.Entity.templates.crate, targetCell.x, targetCell.y);
      crate.crateType = Game.Crates.random();
      map.addEntity(crate);
    }
    for (n = 0; n < enemyCount; n++) {
      targetCell = map.randomEmpty();
      if (!targetCell) {break;}
      var enemy = Object.create(Game.Entity).init(Game.Entity.templates.skullbot, targetCell.x, targetCell.y);
      map.addEntity(enemy);
    }
    return map;
  },
  addPlayer: function(map, player) {
    var playerPosition = map.randomEmpty();
    player.x = playerPosition.x;
    player.y = playerPosition.y;
    map.addEntity(player);
    map.targets = [player];
  }
};