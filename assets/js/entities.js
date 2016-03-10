Game.Entity.templates = {};

Game.Entity.templates.player = {
  tile: "player",
  canDig:    true,
  canTunnel: true,
  canPush:   true,
  isPlayer:  true,
};

Game.Entity.templates.crate = {
  tile: "crate",
  canFall: true,
};

Game.Entity.templates.skullbot = {
  tile: "skullbot",
};