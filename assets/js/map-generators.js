Game.Map.Generators.Basic = {
  create: function(width, height) {
    var linkTarget = {};
    var grid = Object.create(Game.Grid).init(width, height);
    var map = Object.create(Game.Map).init(grid);
    var cell = map.grid.randomCell();
    for (var linkCount = 0; linkCount < 100; linkCount++) {
      var undugNeighbors = cell.neighbors().filter(function(cell) {return !cell.dug;});
      linkTarget = undugNeighbors[Math.floor(ROT.RNG.getUniform() * (undugNeighbors.length))];
      if (linkTarget && ROT.RNG.getUniform() < 0.90) {
        cell.link(linkTarget);
        cell = linkTarget;
      } else {
        cell = map.randomUndug();
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
    var energyCount = 15;
    for(n = 0; n < energyCount; n++) {
      var energy = Object.create(Game.Item).init(Game.Item.templates.energy);
      map.addItem(5,5, energy);
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