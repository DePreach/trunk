/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* var mod = require('ai.tasks');
* mod.thing == 'a thing'; // true
*/

module.exports = class ProjectManager {

  constructor(room) {
    this.room = room;
    this.tasks = [];
  }

  allocateTasks(_pois, _queue, _count) {
      this.setHarvestTasks(_pois);
      this.setConstructionTasks(_queue);
      this.setBuilders();
      this.setRepairTasks();
  }

  addOrUpdateTask(_task) {
    const index = this.tasks.findIndex(item => item.taskName === _task.taskName);
    if (index > -1) {
      this.tasks[index] = _task
    } else {
      this.tasks.push(_task) }
  }

  setHarvestTasks(_pois)  {
    var self = this
    _.forEach(_pois.sources, function(value) {
      self.addOrUpdateTask(self.getProtoTask({
                  taskName: "harvesting_" + Game.getObjectById(value).id,
                  type 		: 'harvester',
                  target 	: Game.getObjectById(value).id,
                  priority: 1,
                  status : 'Active'
                }));
      });
  }

  setConstructionTasks(_constructions) {
    var self = this;
    var buildQueueLength = 3;

    _.forEach(_constructions, function(_construction) {
      var actives = 0;
      const checkObject = Game.rooms[self.room].lookForAt(LOOK_STRUCTURES, _construction.pos.x, _construction.pos.y);
      //console.log("Checking " + checkObject.type + " is " + checkObject.structure + " _construction:" + _construction.type)
      var _status = 'Hold';
      if(checkObject.length > 0) {
        _status = 'Complete';
      }
      if(_construction.status !== undefined)
      {
        console.log(_construction.name + " " + _construction.status)
        self.addOrUpdateTask(self.getProtoTask({
                    taskName: "construction_" + _construction.name,
                    type: "construction",
                    target 	: _construction.type,
                    position: _construction.pos,
                    priority: _construction.priority,
                    structure: _construction.type,
                    status: _status
       }));
     }
    });
  }

  updateTask(_taskName, _status) {

  }

  setBuilders() {
    let builderCount = 6;
    for(var i=0; i < builderCount; i++) {
      var _task = this.getProtoTask({
                  taskName: "builder_" + i,
                  type: "builder",
                  priority: 1,
                  status: 'Active'
    });
    this.addOrUpdateTask(_task);
  }
  }

  setRepairTasks() {
    var damagedStructure = _.filter(Game.structures, function(structure) {
        return(structure.hits < structure.hitsMax);
    });
    _.forEach(damagedStructure, function(structure) {
      console.log("REPAIR TASK:" + JSON.stringify(structure.position))
    })

      let repairCount = 3;
      for(var i=0; i < repairCount; i++) {
        var _task = this.getProtoTask({
                    taskName: "repairer_" + i,
                    type: "repair",
                    priority: 1,
                    status: 'Active'
      });
      this.addOrUpdateTask(_task);
    }
  }

  getTask() {
    var activeCount = 0;
    var buildCount = 3;
    var activeTasks = this.tasks.filter(o => o.type == 'construction' && o.status != 'Complete')
    var testing = _.map(_.sortByOrder(activeTasks, ['priority'], ['asc'], _.values));
    _.forEach(testing, function(_object) {
      switch(_object.status) {
        case 'Hold':
          if (activeCount < buildCount) {
            _object.status = 'Active';
            activeCount++;
          }
        break;
        case 'Active':
          return(_object);
        break;
        case 'Complete':
        break;
      }
      //console.log(JSON.stringify(_object))
    })
    return testing[0];
  }

  completeTasks() {
    var self = this
    _.forEach(Game.rooms[this.room].find(FIND_CREEPS), {filter: (s) => s.memory.taskName == ""} , function(_object)   {
      if (_object.taskName !== "") {

          //self.completeTask(_object.name);
        }
        console.log(JSON.stringify(_object.memory));
      })
  }


  completeTask(_taskName) {
    var tasks = this.tasks.filter(o => o.taskName == _taskName.name)
    if (tasks.length > 0 && tasks !== undefined) {
      tasks[0].status = 'Complete';
    }
  }

  getProtoTask(_protoTask) {
    return {
      taskName:   _protoTask.taskName || '',
      type:       _protoTask.type || '',
      position:   _protoTask.position || {},
      target:     _protoTask.target || '',
      creep:      _protoTask.creep || '',
      priority:   _protoTask.priority || 999,
      structure:  _protoTask.structure || '',
      status:     _protoTask.status || 'Hold'  //Active   //Complete
    }
  }

  report(_detailed) {
    console.log("Tasks Found === " + this.tasks.length + " tasks");
    if (_detailed)  {
      _.forEach(this.tasks, function(_task) {
        console.log('Task - ' + JSON.stringify(_task));
      });
    } else {
      console.log("Tasks found " + this.tasks.length);
    }
  }
};
