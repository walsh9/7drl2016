Game.Screen = {};

Game.Screen.effects = {};

Game.Screen.addEffect = function(tile, pos, color, time) {
  var key = pos.x + "," + pos.y;
  Game.Screen.effects[key] = {x: pos.x, y: pos.y, tile: tile, color: color};
  setTimeout(function() { 
    delete Game.Screen.effects[key]; 
    Game.refresh();
  }, time);
};

Game.Screen.drawTile = function(container, tileIndex, pos, color) {
  var textures = PIXI.loader.resources["assets/i/tileset.json"].textures;
  var tile = new PIXI.Sprite(textures[tileIndex]);
  tile.tint = color || 0xFFFFFF;
  tile.position.x = Math.floor(pos.x * Game.tileSize.x);
  tile.position.y = Math.floor((pos.y + 2) * Game.tileSize.y);
  container.addChild(tile);
};

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
  thisLevel: 1,
  gameEnded: false,
  inputLocked: false,
  inputBuffer: [],
  enter: function() {
    this.player = Object.create(Game.Entity).init(Game.Entity.templates.player);
    Game.Crates.init();
    this.newLevel(this.level);
  },
  everyTurn: function() {

  },
  exit: function() { 
    console.log("Exited play screen."); 
  },
  nextLevel: function() {
    this.level += 1;
    if (Game.levels[this.level - 1]) {
      this.newLevel(this.level);
      Game.Sound.play('new_level');
      console.log('level ' + this.level)
    } else {
      Game.switchScreen(Game.Screen.winScreen);
    }
  },
  newLevel: function(level) {
    this.lockInput();
    var width = Game.mapSize.x;
    var height = Game.mapSize.y;
    this.levelOptions = Game.levels[level - 1];
    var generator = Game.Map.Generators.Basic;
    this.map = generator.create(width, height, this.levelOptions);
    this.map.screen = this;
    this.player.items.energy = 0;
    this.player.items.datachip = 0;
    generator.placeWalls(this.map);
    generator.addPlayer(this.map, this.player);
    generator.placeItems(this.map);
    generator.digPaths(this.map);
    generator.populate(this.map);
    this.grid = this.map.grid;
    this.inputBuffer = [];
    this.unlockInput();
    this.map.engine.start();
  },
  render: function(display) {
    this.renderTiles(display);
    this.renderItems(display);
    this.renderEntities(display);
    this.renderEffects(display);
    this.renderStatus(display);
    Game.display.render(Game.stage);
  },
  renderTiles: function(display) {
    Game.display.backgroundColor = this.map.color;
    var map = this.map;
    this.map.grid.eachCell( function(cell) {
      drawCell(Game.stage, cell);
    });
    function drawCell(container, cell) {
      var x = cell.x;
      var y = cell.y;
      var pos = {x: x, y: y};
      if (cell.impassable) {
        Game.Screen.drawTile(container, "wall", pos, map.color);
      } else if (cell.dug) {
        if (cell.east  && cell.east.dug && cell.linked(cell.east))  { Game.Screen.drawTile(container, "dugeast", pos); }
        if (cell.west  && cell.west.dug && cell.linked(cell.west))  { Game.Screen.drawTile(container, "dugwest", pos); }
        if (cell.north && cell.north.dug && cell.linked(cell.north)) { Game.Screen.drawTile(container, "dugnorth", pos); }
        if (cell.south && cell.south.dug && cell.linked(cell.south)) { Game.Screen.drawTile(container, "dugsouth", pos); }
      }
    }
  },
  renderStatus: function(display) {
    var graphics = new PIXI.Graphics();
    graphics.beginFill(0x000000);
    graphics.drawRect(0, 0, Game.stage.width, Game.tileSize.y * 2);
    Game.stage.addChild(graphics);

    if (this.gameEnded) {
      var levelLabel = new PIXI.Text("LEVEL B" + (8 - this.level), {font:"20px Audiowide", fill:"#888888"});
      levelLabel.x = Game.stage.width - 10;
      levelLabel.y = 2;
      levelLabel.anchor.set(1, 0);
      Game.stage.addChild(levelLabel);

      var gameOverLabel = new PIXI.Text("GAME OVER", {font:"30px Audiowide", fill:"white"});
      gameOverLabel.x = Game.stage.width / 2;
      gameOverLabel.y = 0;
      gameOverLabel.anchor.set(0.5, 0);
      Game.stage.addChild(gameOverLabel);

      var pressKeyLabel = new PIXI.Text("Press [space] to try again.", {font:"20px Audiowide", fill:"white"});
      pressKeyLabel.x = Game.stage.width / 2;
      pressKeyLabel.y = Game.tileSize.y;
      pressKeyLabel.anchor.set(0.5, 0);
      Game.stage.addChild(pressKeyLabel);

    } else {
      var line1y = 2;
      var line2y = Game.tileSize.y + 2;

      var levelLabel = new PIXI.Text("LEVEL B" + (8 - this.level), {font:"20px Audiowide", fill:"white"});
      levelLabel.x = Game.stage.width - 10;
      levelLabel.y = line1y;
      levelLabel.anchor.set(1, 0);
      Game.stage.addChild(levelLabel);

      var soundStatus = Game.Sound.muted ? "OFF" : "ON";
      var soundLabel = new PIXI.Text("OUND " + soundStatus, {font:"20px Audiowide", fill:"white"});
      soundLabel.x = Game.stage.width - 10;
      soundLabel.y = line2y;
      soundLabel.anchor.set(1, 0);
      Game.stage.addChild(soundLabel);

      var soundLabelPrefix = new PIXI.Text("S", {font:"20px Audiowide", fill:"#ffff00"})
      soundLabelPrefix.x = Game.stage.width - 10 - soundLabel.width;
      soundLabelPrefix.y = line2y;
      soundLabelPrefix.anchor.set(1, 0);
      Game.stage.addChild(soundLabelPrefix);

      Game.Screen.drawTile(Game.stage, Game.Item.templates.energy.tile, {x: 0, y: -2}, Game.Item.templates.energy.color );
      Game.Screen.drawTile(Game.stage, Game.Item.templates.datachip.tile, {x: 0, y: -1}, Game.Item.templates.datachip.color );
      
      var energyCounter = new PIXI.Text("x " + this.player.items.energy + " / " + this.levelOptions.energyNeeded, 
        {font:"20px Audiowide", fill:"white"});
      energyCounter.x = Game.tileSize.x;
      energyCounter.y = line1y;
      Game.stage.addChild(energyCounter);

      var datachipCounter = new PIXI.Text("x " + this.player.items.datachip + " / " + this.levelOptions.datachipsNeeded, 
        {font:"20px Audiowide", fill:"white"});
      datachipCounter.x = Game.tileSize.x;
      datachipCounter.y = line2y;
      Game.stage.addChild(datachipCounter);
    }

  },
  renderEntities: function(display) {
    for (var key in this.map.entities) {
      var entity = this.map.entities[key];
      Game.Screen.drawTile(Game.stage, entity.getTile(), {x: entity.slidingX || entity.x, y: entity.slidingY || entity.y}, entity.getColor() );
    }
  },
  renderItems: function(display) {
    for (var key in this.map.items) {
      var item = this.map.items[key];
      Game.Screen.drawTile(Game.stage, item.tile, {x: item.x, y: item.y}, item.color );
    }
  },
  renderEffects: function(display) {
    for (var key in Game.Screen.effects) {
      var effect = Game.Screen.effects[key];
      Game.Screen.drawTile(Game.stage, effect.tile, {x: effect.x, y: effect.y}, effect.color );
    }
  },
  lockInput:  function() {
    this.inputLocked = true;
  },
  unlockInput:  function() {
    this.inputLocked = false;
    this.nextInput();
  },
  nextInput: function() {
    if (this.inputBuffer.length > 0) {
      var input = this.inputBuffer.pop();
      this.handleInput(input.type, input.data);
    };
  },
  bufferInput: function(inputType, inputData) {
    if (this.inputBuffer.length < 3) {
      this.inputBuffer.unshift({type: inputType, data: inputData});
    }
  },
  handleInput: function(inputType, inputData) {
    // If the game is over, enter will bring the user to the losing screen.
    if (this.gameEnded && inputType === 'keydown' && inputData.keyCode === ROT.VK_SPACE) {
      document.location.reload();
      return;
    }
    if (inputType === 'keydown') {
      if (inputData.keyCode === ROT.VK_S) {
        Game.Sound.toggleMute();
        Game.refresh();
      } else if (this.inputLocked) {
        this.bufferInput(inputType, inputData);
      } else if (inputData.keyCode === ROT.VK_LEFT || 
        inputData.keyCode === ROT.VK_H ||
        inputData.keyCode === ROT.VK_NUMPAD4) {
        this.lockInput();
        this.move(-1, 0);
      } else if (inputData.keyCode === ROT.VK_RIGHT || 
                 inputData.keyCode === ROT.VK_L ||
                 inputData.keyCode === ROT.VK_NUMPAD6) {
        this.lockInput();
        this.move(1, 0);
      } else if (inputData.keyCode === ROT.VK_UP || 
                 inputData.keyCode === ROT.VK_K ||
                 inputData.keyCode === ROT.VK_NUMPAD8) {
        this.lockInput();
        this.move(0, -1);
      } else if (inputData.keyCode === ROT.VK_DOWN || 
                 inputData.keyCode === ROT.VK_J ||
                 inputData.keyCode === ROT.VK_NUMPAD2) {
        this.lockInput();
        this.move(0, 1);
        // No wait button is intentional to create zugzwang
      } else {
        // Not a valid key
        return;
      }
    } 
  },
  move: function(dX, dY) {
    var newX = this.player.x + dX;
    var newY = this.player.y + dY;
    // Try to move to the new cell
    var self = this;
    this.player.tryMove(newX, newY, this.player.map)
    .then(function(didMove) {
      if (didMove) {
        //collect items
        var item = self.player.map.itemAt(newX, newY);
        if (item) {
          Game.Sound.play(item.pickupSound);
          var itemname = item.collect();
          if (self.player.items[itemname]) {
            self.player.items[itemname] += 1;
          } else {
            self.player.items[itemname] = 1;
          }
          var doorPos;
          if (self.map.energyDoor && self.player.items.energy >= self.levelOptions.energyNeeded) {
            doorPos = {x: self.map.energyDoor.x, y: self.map.energyDoor.y};
            self.map.removeEntity(self.map.energyDoor);
            self.map.energyDoor = undefined;
            var openEnergyDoor = Object.create(Game.Entity).init(Game.Entity.templates.openEnergyDoor, doorPos.x, doorPos.y);
            Game.Sound.play('door_open');
            self.map.addEntity(openEnergyDoor);
          }
          if (self.map.datachipDoor && self.player.items.datachip >= self.levelOptions.datachipsNeeded) {
            doorPos = {x: self.map.datachipDoor.x, y: self.map.datachipDoor.y};
            self.map.removeEntity(self.map.datachipDoor);
            self.map.datachipDoor = undefined;
            Game.Sound.play('door_open');
            var openDatachipDoor = Object.create(Game.Entity).init(Game.Entity.templates.openDatachipDoor, doorPos.x, doorPos.y);
            self.map.addEntity(openDatachipDoor);
          }
        }
        self.thisLevel = self.level;
        self.player.map.engine.unlock();
      } else {
        if (self.level === self.thisLevel) {
          self.thisLevel = self.level;
          Game.Sound.play('cant_move');
        }
        self.unlockInput();
      }
    }); 
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
    Game.display.backgroundColor = 0x01579B;
    for (var x = 0; x < 13; x++) {
      Game.Screen.drawTile(Game.stage, 'wall', {x: x, y: 14}, 0xffffff );
    }
    Game.Screen.drawTile(Game.stage, 'playerbot', {x: 3, y: 13}, 0xffffff);

    var congrats = new PIXI.Text("CONGRATULATIONS!", {font:"35px Audiowide", fill:"#ffffff"});
    congrats.x = Game.stage.width / 2;
    congrats.y = 200;
    congrats.anchor.set(0.5, 0.5);
    Game.stage.addChild(congrats);

    var message = new PIXI.Text("YOU MADE IT TO THE SURFACE", {font:"16px Audiowide", fill:"#ffffff"});
    message.x = Game.stage.width / 2;
    message.y = 260;
    message.anchor.set(0.5, 0.5);
    Game.stage.addChild(message);

    Game.display.render(Game.stage);
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