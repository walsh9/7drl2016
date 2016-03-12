Game.Pathfinder = {
  init: function(grid, target, passabilityFunction) {
    this.grid = grid;
    this.passable = passabilityFunction;
    this.pathmap = Object.create(grid).init(grid.width, grid.height);
    this.floodFill(target.x, target.y, 0);
    return this;
  },
  update: function(grid, target) {
    this.grid = grid;
    this.floodFill(target.x, target.y);
  },
  floodFill: function(x, y) {
    var here = this.grid.getCell(x, y);
    var pathfinder = this;
    this.pathmap.getCell(x,y).distance = 0 ;
    var frontier = [here];
    while (frontier.length > 0) {
      currentCell = frontier.shift();
      currentPathCell = pathfinder.pathmap.getCell(currentCell.x, currentCell.y);
      currentCell.neighbors().forEach( function(neighborCell) {
        var neighborPathcell = pathfinder.pathmap.getCell(neighborCell.x, neighborCell.y);
        if (neighborPathcell.distance === undefined && 
            pathfinder.passable(currentCell, neighborCell)) {
          neighborPathcell.distance = currentPathCell.distance + 1;
          frontier.push(neighborCell);
        }
      });
    }
  },
  getApproachFrom: function(x, y) {
    var here = this.pathmap.getCell(x, y);
    hereMap =  this.grid.getCell(x, y);
    var pathfinder = this;
    var approachCell = here; // default if unreachable
    if (approachCell.distance) {
      here.neighbors().forEach( function(neighbor) {
        var neighborMap = pathfinder.grid.getCell(neighbor.x, neighbor.y);
        if(neighbor.distance &&
           pathfinder.passable(hereMap, neighborMap) &&
           neighbor.distance < approachCell.distance) {
          approachCell = neighbor;
        }
      });
    }
    return approachCell;
  },
};