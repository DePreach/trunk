module.exports = function() {

  Creep.prototype.tasks = [];

  //Creep.prototype.memory.activity;

  Creep.prototype.clear =  function(){
    this.say("Huh");
  };

  Creep.prototype.harvests = function(){

      if (this.carry.energy == this.carryCapacity) {
          this.memory.activity = 'delivering';
        }
      else if (this.carry.energy == 0) {
          this.memory.activity = 'harvesting';
      }
    switch (this.memory.activity) {
        case 'harvesting':
          this.say("⛏")
          let source = Game.getObjectById(this.memory.target);
          if(this.harvest(source) == ERR_NOT_IN_RANGE) {
              this.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
          }
          break;
        case 'delivering':
          var targets = this.room.find(FIND_STRUCTURES, {
            filter: (structure) => {
              return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN || structure.structureType == STRUCTURE_CONTAINER) &&
              structure.energy < structure.energyCapacity || structure.store < structure.storeCapacity;
            }
          });

          if(targets.length > 0) {
            if(this.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
              this.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
              this.say("🚈")
            }
          } else {
            this.moveTo(this.room.controller, {visualizePathStyle: {stroke: '#ffffff'}});
            this.upgradeController(this.room.controller);
            this.say("🔧")
          }
          break;
        };
      }

  Creep.prototype.builds = function() {
    var self = this;
    console.log(this.memory.target === undefined);
    if (this.memory.target === undefined || this.memory.target.x === undefined) {
      var _task = this.room.overseer.projectManager.getTask();
      if (_task === undefined) return;

      console.log(JSON.stringify(_task))
      this.memory.target = {type: _task.target, position: _task.position};
      this.memory.taskName = _task.taskName;
      this.memory.structure = _task.structure;
      console.log(this.memory.target.position)
      this.memory.constructionSite = this.room.overseer.builder.getConstructionSite(this.memory.structure, this.memory.target.position)
    }
    if (this.carry.energy == this.carryCapacity) {
        this.memory.activity = 'building';
    }
    else if (this.carry.energy == 0) {
        this.memory.activity = 'refuelling';
    }
    console.log(JSON.stringify(this.memory.targetPosition))
    switch (this.memory.activity) {
    case 'refuelling':
      this.say("⛏");
      let source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
      if(this.harvest(source) == ERR_NOT_IN_RANGE) {
          this.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
      break;
    case 'building':
      this.say("🛠");
      let construction = Game.getObjectById(this.memory.constructionSite)
      var response = this.build(construction)
      console.log("BULD RESPONSE " + response)
      //Error cannot find object - Unenroll from task and constructions
      if (response == -7 ) {
        const checkObject = this.room.lookForAt(LOOK_STRUCTURES, this.memory.target.position);
        if (checkObject.length > 0) {
          this.memory.percentComplete = 100
        }
      }
      if (response == -9 ) {
        this.moveTo(construction, {visualizePathStyle: {stroke: '#ffaa00'}})
      }
      break;
    } /**/
  }

  Creep.prototype.repairs = function() {
    var self = this;
    if (this.carry.energy == this.carryCapacity) { this.memory.activity = 'repairing'; }
    else if (this.carry.energy == 0) { this.memory.activity = 'refuelling';  }
    switch (this.memory.activity) {
    case 'refuelling':
      this.say("⛏");
      let source = this.pos.findClosestByRange(FIND_SOURCES_ACTIVE)
      if(this.harvest(source) == ERR_NOT_IN_RANGE) {
        this.moveTo(source, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
      break;
    case 'repairing':
        this.say("🔧")
        const targets = this.room.find(FIND_STRUCTURES, {
          filter: object => object.hits < object.hitsMax  && object.structureType !== STRUCTURE_WALL
        });
        targets.sort((a,b) => a.hits - b.hits);
        if(targets.length > 0) {
          if(this.repair(targets[0]) == ERR_NOT_IN_RANGE) {
            this.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffaa00'}});
          }
        } else {
            this.moveTo(0, 0, {visualizePathStyle: {stroke: '#ffaa00'}});
      }
    }
  }
}
