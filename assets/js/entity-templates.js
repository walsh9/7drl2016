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

Game.Entity.templates.digCrate = {
  tile: "crate_fall",
  canTunnel:  true,
  canDig:     true,
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
  niceToBots: false,
  action: Game.Entity.actions.botMove,
  dies: Game.Entity.actions.botDie
};

Game.Entity.templates.skullbot = {
  tile: "skullbot",
  color: 0xffffff,
  canDig: false,
  canTunnel: false,
  canKill: true,
  niceToBots: true,
  action: Game.Entity.actions.botMove,
  dies: Game.Entity.actions.botDie,
  angryForm: Game.Entity.templates.angrySkullBot
};

Game.Entity.templates.angrySpookBot = {
  tile: "spookbot_phasing",
  color: 0xff99ff,
  canPhase: true,
  action: Game.Entity.actions.botMove,
  dies: Game.Entity.actions.botDie
};

Game.Entity.templates.spookbot = {
  tile: "spookbot",
  color: 0xffffff,
  canPhase: false,
  canKill: true,
  niceToBots: true,
  action: Game.Entity.actions.botMove,
  dies: Game.Entity.actions.botDie,
  angryForm: Game.Entity.templates.angrySpookBot
};

Game.Entity.templates.decoy = {
  tile: "playerbot",
  color: 0x29ADFF,
  canPush:    true,
  dies: Game.Entity.actions.decoyDie,
};

Game.Entity.templates.energyDoor = {
  tile: "door_locked",
  color: 0xffff00,
};

Game.Entity.templates.datachipDoor = {
  tile: "door_locked",
  color: 0x00ffff,
};

Game.Entity.templates.openEnergyDoor = {
  tile: "door_open",
  color: 0xffff00,
  activate: Game.Entity.actions.gotoNextLevel
};

Game.Entity.templates.openDatachipDoor = {
  tile: "door_open",
  color: 0x00ffff,
  activate: Game.Entity.actions.gotoNextLevel
};
