Game.Entity.templates = {};

Game.Entity.templates.player = {
  tile: "playerbot",
  canDig:    true,
  canTunnel: true,
  canPush:   true,
  isPlayer:  true,
  action: Game.Entity.actions.playerAction,
  dies: Game.Entity.actions.playerDie
};

Game.Entity.templates.crate = {
  tile: "crate",
  canTunnel:  true,
  canCrush:   true,
  canPush:    true,
  canPhase:   true,
  isPushable: true,
  action: Game.Entity.actions.fall,
  //dies: Game.Entity.actions.botDie
};

Game.Entity.templates.skullbot = {
  tile: "skullbot",
  canKill: true,
  action: Game.Entity.actions.botMove,
  dies: Game.Entity.actions.botDie
};