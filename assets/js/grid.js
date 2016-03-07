var Grid = {
  init: function(rows, columns) {
    this.rows = rows;
    this.columns = columns;
    this.size = rows * columns;
    this.grid = this.prepareGrid();
    this.configureCells();
    return this;
  },
  prepareGrid: function() {
    var i, j;
    var grid = [];
    for(i = 0; i < this.rows; i++) {
      grid[i] = [];
      for(j = 0; j < this.rows; j++) {
        grid[i][j] = Object.create(Cell).init(i, j);
      }
    }
    return grid;
  },
  configureCells: function() {
    this.eachCell( function(cell) {
      var row = cell.row;
      var col = cell.column;
      cell.north = this.getCell(row - 1, col);
      cell.south = this.getCell(row + 1, col);
      cell.east  = this.getCell(row, col - 1);
      cell.west  = this.getCell(row, col + 1);
    });
  },
  getCell: function(row, column) {
    if ((row < 0 || row >= this.rows) || (column < 0 || column >= this.columns)) {
      return undefined;
    }
    return this.grid[row][column];
  },
  randomCell: function() {
    var row = Math.floor(ROT.RNG.getUniform() * (rows - 1));
    var column = Math.floor(ROT.RNG.getUniform() * (columns - 1));
    return this.getCell(row, column);
  },
  eachCell: function(callback) {
    var self = this;
    this.grid.forEach(function (row) {
      row.forEach(function(cell) {
        callback.call(self, cell);
      });
    });
  }
};

var Cell = {
  init: function(row, column) {
    this.row = row;
    this.column = column;
    this.links = [];
    return this;
  },
  link: function(cell, bidi) {
    if (bidi !== false) 
      {bidi = true;}
    if (!this.linked(cell))  {
      links.push(cell);
    }
    if (bidi) {
      cell.link(this, false);
    }
  },
  unlink: function(cell, bidi) {
    if (bidi !== false) 
      {bidi = true;}
    this.links = this.links.filter( function(link) {return link !== cell;} );
    if (bidi) {
      cell.unlink(this, false);
    }
  },
  linked: function(cell) {
    return this.links.filter( function(link) {return link === cell;} ).length === 0;
  },
  neighbors: function() {
    var list = [];
    if (this.north) { list.push(this.north); }
    if (this.south) { list.push(this.south); }
    if (this.east) { list.push(this.east); }
    if (this.west) { list.push(this.west); }
  }
};