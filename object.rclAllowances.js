module.exports = class RCLAllowance {


  constructor(i) {
    this.roads      = [9999,9999,9999,9999,9999,9999,9999,9999,9999];
    this.containers = [5,5,5,5,5,5,5,5,5];
    this.spawns     = [0,1,1,1,1,1,1,2,3];
    this.extensions = [0,0,5,10,20,30,40,50,60];
    this.ramparts   = [0,0,300000, 1000000, 3000000, 10000000, 30000000, 100000000, 300000000];
    this.walls      = [0,0,9999, 9999, 9999, 9999, 9999, 9999, 9999];
    this.towers     = [0,0,0,1,1,2,2,3,6];
    this.storage    = [0,0,0,0,1,1,1,1,1];
    this.links      = [0,0,0,0,0,2,3,4,6];
    this.extractor  = [0,0,0,0,0,0,1,1,1];
    this.labs       = [0,0,0,0,0,0,3,6,10];
    this.terminal   = [0,0,0,0,0,0,1,1,1];
    this.observer   = [0,0,0,0,0,0,0,0,1];
    this.powerSpawn = [0,0,0,0,0,0,0,0,1];
    return {
      roads:            this.roads[i],
      containers:       this.containers[i],
      spawns:           this.spawns[i],
      extensions:       this.extensions[i],
      ramparts:         this.ramparts[i],
      walls:            this.walls[i],
      towers:           this.towers[i],
      storage:          this.storage[i],
      links:            this.links[i],
      extractor:        this.extractor[i],
      labs:             this.labs[i],
      terminal:         this.terminal[i],
      observer:         this.observer[i],
      powerSpawn:       this.powerSpawn[i]
    }
  }

  getProtoAllowance(i) {
    return {
      roads:            this.roads[i],
      containers:       this.containers[i],
      spawns:           this.spawns[i],
      extensions:       this.extensions[i],
      ramparts:         this.ramparts[i],
      walls:            this.walls[i],
      towers:           this.towers[i],
      storage:          this.storage[i],
      links:            this.links[i],
      extractor:        this.extractor[i],
      labs:             this.labs[i],
      terminal:         this.terminal[i],
      observer:         this.observer[i],
      powerSpawn:       this.powerSpawn[i]
    }
  }

}
