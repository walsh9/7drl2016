Game.Screen = {};

Game.Screen.titleScreen = {
  enter: function() {    console.log("Entered start screen."); },
  exit: function() { console.log("Exited start screen."); },
  render: function(display) {
    // Render title screen
  },
  handleInput: function(inputType, inputData) {
    Game.switchScreen(Game.Screen.playScreen);
  }
};

Game.Screen.playScreen = {
  player: null,
  level: 1,
  gameEnded: false,
  enter: function() {
    this.newLevel(this.level);
  },
  everyTurn: function() {

  },
  exit: function() { 
    console.log("Exited play screen."); 
  },
  newLevel: function(level) {
    var width = Game.mapSize.x;
    var height = Game.mapSize.y;
    this.grid = Object.create(Game.Grid).init(width, height);
    this.map = Object.create(Game.Map).init(this.grid).generateTunnels();
  },
  render: function(display) {
    this.renderTiles(display);
  },
  renderTiles: function(display) {
    Game.display.backgroundColor = 0x996633;
    this.map.grid.eachCell( function(cell) {
      drawCell(Game.stage, cell);
    });

    function drawTile(container, tileIndex, pos) {
      var textures = PIXI.loader.resources["assets/i/tileset.json"].textures;
      var tile = new PIXI.Sprite(textures[tileIndex]);
      tile.position.x = pos.x;
      tile.position.y = pos.y;
      container.addChild(tile);
    }

    function drawCell(container, cell) {
      var x = cell.column * Game.tileSize.x;
      var y = cell.row * Game.tileSize.y;
      var pos = {x: x, y: y};
      if (cell.dug) {
        if (cell.east  && cell.east.dug && cell.linked(cell.east))  { drawTile(container, "dugeast", pos); }
        if (cell.west  && cell.west.dug && cell.linked(cell.west))  { drawTile(container, "dugwest", pos); }
        if (cell.north && cell.north.dug && cell.linked(cell.north)) { drawTile(container, "dugnorth", pos); }
        if (cell.south && cell.south.dug && cell.linked(cell.south)) { drawTile(container, "dugsouth", pos); }
      }
    }

    Game.display.render(Game.stage);
  },
  handleInput: function(inputType, inputData) {

  },
};

Game.Screen.winScreen = {
  enter: function() {
      console.log("Entered win screen."); 
  },
  exit: function() { 
    console.log("Exited win screen."); 
  },
  render: function(display) {
      //render win screen
  },
  handleInput: function(inputType, inputData) {

  }
};

Game.Screen.loseScreen = {
  enter: function() { 
    console.log("Entered lose screen."); 
  },
  exit: function() { console.log("Exited lose screen."); },
  render: function(display) {
    //render lose screen
  },
  handleInput: function(inputType, inputData) {

  }
};