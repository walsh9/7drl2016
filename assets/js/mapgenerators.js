Game.Map.Generators.Basic = {
  create: function(width, height) {
    var linkTarget = {};
    var grid = Object.create(Game.Grid).init(width, height);
    var map = Object.create(Game.Map).init(grid);
    var cell = map.grid.randomCell();
    for (var linkCount = 0; linkCount < 100; linkCount++) {
      var undugNeighbors = cell.neighbors().filter(function(cell) {return !cell.dug;});
      linkTarget = undugNeighbors[Math.floor(ROT.RNG.getUniform() * (undugNeighbors.length - 1))];
      if (linkTarget && ROT.RNG.getUniform() < 0.50) {
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
    var crateCount = 6;
    for (n = 0; n < enemyCount; n++) {
      targetCell = map.randomEmpty();
      if (!targetCell) {break;}
      var enemy = Object.create(Game.Entity).init(Game.Entity.templates.skullbot);
      map.addEntity(enemy);
      enemy.setPosition(targetCell.x, targetCell.y, map);
    }
    for (n = 0; n < crateCount; n++) {
      targetCell = map.randomStable();
      if (!targetCell) {break;}
      var crate = Object.create(Game.Entity).init(Game.Entity.templates.crate);
      map.addEntity(crate);
      crate.setPosition(targetCell.x, targetCell.y, map);
    }
    return map;
  },
  addPlayer: function(map, player) {
    var playerPosition = map.randomEmpty();
    player.x = playerPosition.x;
    player.y = playerPosition.y;
    map.addEntity(player);
  }
};