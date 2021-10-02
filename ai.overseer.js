const RCLStructure = require('object.rclAllowances')
const RoomPlanner = require('ai.planner');
const RoomBuilder = require('ai.builder');
const ProjectManager = require('ai.tasks');

module.exports = class Overseer {
  overseerMind
  
  constructor(name, rcl) {
     // if (forget) {
     //     if(Memory.rooms[name].overseer) {
     //       delete Memory.rooms[name].overseer;      
     //     }
     // }

      this.version = 1;
      this.overseerName = name;
      this.room = name;
      this.rcl = rcl;

      this.spawns = [];

      this.planner          = new RoomPlanner(this.room);
      this.builder          = new RoomBuilder(this.room);
      this.projectManager   = new ProjectManager(this.room);
      this.creeps           = Game.rooms[this.room].find(FIND_MY_CREEPS);

      if (this.forget === true || this.recall() === undefined)
      {
        "No memory - reconfiguring"
        this.tasks = [];
        this.sources = Game.rooms[this.room].find(FIND_SOURCES).map(s => s.id);
        this.spawners = Game.rooms[this.room].find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_SPAWN}).map(s => s.id);
        this.roomController = Game.rooms[this.room].find(FIND_MY_STRUCTURES, {filter: (s) => s.structureType == STRUCTURE_CONTROLLER}).map(s => s.id);

        this.rclStructure = new RCLStructure(this.rcl);
        this.maxCreeps = this.sources * 5;

        this.routes = this.planner.plan(this.getPOIs())
        this.constructionQueue = this.builder.planRoads(this.routes);
        this.builder.displayAll();
        this.builder.build();


      } else {
        console.log("Memory recalled");
      }
      this.projectManager.allocateTasks(this.getPOIs(), this.constructionQueue, this.maxCreeps) //Derive from energy?
      this.projectManager.completeTasks();
      //persist state
      Memory.rooms[this.room].overseer = this.remember();
      return this;
  }


  getPOIs() {
    return {
      spawners: this.spawners,
      sources: this.sources,
      roomController: this.roomController
    }
  }

  remember() {
    return {
        overseerName: this.overseerName,
        version: this.version,
        rcl : this.rcl,
        rclStructure: this.rcl,
        tasks: this.projectManager.tasks,
        spawns: this.spawns,
        spawners: this.spawners,
        sources: this.sources,
        routes: this.routes,
        constructionQueue: this.constructionQueue
      };
  }

  recall() {
    if (Memory.rooms[this.overseerName].overseer) {
      console.log("Recalling overseer " + this.overseerName);
      var _memory = Memory.rooms[this.overseerName].overseer;

      this.overseerName = _memory.overseerName;
      this.version = _memory.version;
      this.rcl = _memory.rcl;
      this.rclStructure = _memory.rcl;
      this.projectManager.tasks = _memory.tasks;
      this.spawns = _memory.spawns;
      this.spawners = _memory.spawners;
      this.sources = _memory.sources;
      this.routes = _memory.routes;
      this.constructionQueue = _memory.constructionQueue;
      this.builder.constructionQueue = this.constructionQueue;

      return true;
      } else {
        console.log("Sudden case of amnesia from " + this.overseerName);
        return undefined;
    }
  }

  addOrUpdateSpawn(_spawn) {
    if(this.spawns !== undefined) {
      const index2 = this.spawns.findIndex(item => item.name === _spawn.name);
      if (index2 > -1) {
        this.spawns[index2] = _spawn
      } else {
        if (!Game.creeps[_spawn.name])  { this.spawns.push(_spawn) }
      }
    }
  }

  getProtoSpawn() {
    return {
      exact: true,
      name : "",
      body : [WORK, CARRY, MOVE],
      memory : {role: '', target: {}, priority: 0}
    }
  }
}
