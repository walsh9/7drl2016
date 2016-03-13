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
  dies: Game.Entity.actions.crateBreak
};

Game.Entity.templates.angrySkullBot = {
  tile: "skullbot_spiky",
  color: 0xff0000,
  canDig: true,
  canTunnel: true,
  action: Game.Entity.actions.botMove,
  dies: Game.Entity.actions.botDie
};

Game.Entity.templates.skullbot = {
  tile: "skullbot",
  color: 0xffffff,
  canDig: false,
  canTunnel: false,
  canKill: true,
  action: Game.Entity.actions.botMove,
  dies: Game.Entity.actions.botDie,
  angryForm: Game.Entity.templates.angrySkullBot
};

Game.Entity.templates.decoy = {
  tile: "playerbot",
  color: 0x29ADFF,
  dies: Game.Entity.actions.decoyDie,
};
