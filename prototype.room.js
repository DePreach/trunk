require('prototype.spawn')();
require('prototype.creep')();
const Overseer = require('ai.overseer');
//require('object.tasks')();
module.exports = function() {

	Room.prototype.analyseRoom = function(name) {
			this.overseer = new Overseer(this.name, this.controller.level, 1);

			console.log("=================Analysing Room=======================");
			//Set Sources
			//this.setSpawner();
			this.analyseWorkforce()
			this.assignCreeps();
			this.runTasks();
			this.reportRoom();
			var spawner = Game.getObjectById(this.overseer.spawners[0]);
			spawner.createACreep();

			//this.Reset();
 	}

	Room.prototype.Reset = function()
	{
			delete this.memory.overseer;//this.Overseer;
			this.overseer = undefined;
	}

	Room.prototype.analyseWorkforce = function() {
		for(var name in Memory.creeps) {
			if(!Game.creeps[name]) {
					delete Memory.creeps[name];
					console.log('Clearing non-existing creep memory:', name);
			}
		}
	}

	Room.prototype.assignCreeps = function() {

		//Assign harvesters first
		var self = this
		_.forEach(this.overseer.projectManager.tasks.filter(e => e.type == 'harvester' && e.status == 'Active'), function(_task) {
				var _creep = self.overseer.getProtoSpawn();
				_creep.exact 		= true;
				_creep.name = _task.taskName;
				_creep.memory.role = _task.type;
				_creep.memory.target 	= _task.target;
				_creep.memory.priority = 1;
				self.overseer.addOrUpdateSpawn(_creep);
		});


		_.forEach(this.overseer.projectManager.tasks.filter(e => e.type == 'builder' && e.status == 'Active') , function(_task) {
			var _taskFound = self.lookForAt(LOOK_CONSTRUCTION_SITES, _task.position)
			if (_taskFound.length === 0) {
					self.construct(_task);
			}
			var _creep = self.overseer.getProtoSpawn();
			_creep.name = _task.taskName;
			_creep.exact 		= true;
			_creep.memory.target = {};
			_creep.memory.target.type 	  = _task.target;
			_creep.memory.target.position = _task.position;
			_creep.memory.taskName= _task.taskName;
			_creep.memory.role = _task.type;
			_creep.memory.priority = 1;
			self.overseer.addOrUpdateSpawn(_creep);
		});

		_.forEach(this.overseer.projectManager.tasks.filter(e => e.type == 'repair' && e.status == 'Active'), function(_task) {
			var _creep = self.overseer.getProtoSpawn();
			_creep.exact 		= true;
			_creep.name= _task.taskName;
			_creep.memory.role = _task.type;
			_creep.memory.target = {};
			_creep.memory.target.type 	  = _task.target;
			_creep.memory.target.position = _task.position;
			_creep.memory.priority = 1;
			self.overseer.addOrUpdateSpawn(_creep);
		});
	}

	Room.prototype.construct = function(_task)	{
  	var ret = Game.rooms[this.name].createConstructionSite(_task.position.x, _task.position.y, _task.structure);
	}

	Room.prototype.checkContainers = function()  {
			 //console.log(this.memory.spawns[0].id);
			 for (source in this.memory.sources)  {


			 }
		}

	Room.prototype.runTasks	= function()
	{
		_.forEach(this.overseer.creeps.filter(e => e.memory.role == 'harvester'), function(_creep) {
					_creep.harvests();
		})
		_.forEach(this.overseer.creeps.filter(e => e.memory.role == 'builder'), function(_creep) {
					_creep.builds();
		})
		_.forEach(this.overseer.creeps.filter(e => e.memory.role == 'repair'), function(_creep) {
					_creep.repairs();
		})
	}

		/*let harvestCreeps = this.overseer.creeps.filter(e => e.memory.role == 'harvester');
		for (i=0;i<harvestCreeps.length;i++)
		{
			var creep = harvestCreeps[i];
			creep.harvests();
		}
	}*/

	Room.prototype.defendRoom = function() {
			var hostiles = Game.creeps[this.room.name].find(FIND_HOSTILE_CREEPS);
			if(hostiles.length > 0) {
					var username = hostiles[0].owner.username;
					Game.notify(`User ${username} spotted in room ${this.room.name}`);
					var towers = Game.rooms[this.room.name].find(FIND_MY_STRUCTURES, {filter: {structureType: STRUCTURE_TOWER}});
					towers.forEach(tower => tower.attack(hostiles[0]));
			}
		}

		Room.prototype.reportRoom = function()  {
			var reportCreeps = false;
			var reportSources = false;
			var reportTasks = false;
			var reportSpawns = false;
			var reportMemory = false;
			var reportRCL = false;
			var reportPlans = false;
			console.log("----------------------------Room " + this.name + " Analysis Results-------------------------------------");
			console.log("Sources Found === " + this.overseer.sources.length + " sources");
			if (reportSources) {for (source in this.overseer.sources)		{	console.log('Source - ' + JSON.stringify(this.overseer.sources[source]));			}}
			console.log("Screeps Found === " + this.overseer.creeps.length + " screeps");
			if (reportCreeps) {for (screep in this.overseer.creeps)		{	console.log('Screep - ' + JSON.stringify(this.memory.creeps[screep]));			}}
			this.overseer.projectManager.report(reportTasks);
			console.log("Spawn Queue === " + this.overseer.spawns.length + " screeps awaiting spawn");
			if (reportSpawns)  {for (spawn in this.overseer.spawns)		{	console.log('Spawning - ' + JSON.stringify(this.overseer.spawns[spawn]));			}}
			if (reportMemory)  {console.log("I remember " + JSON.stringify(this.overseer.remember()))};
			if (reportRCL) (console.log("My room level (" + this.controller.level + ") allows " + JSON.stringify(this.overseer.rclStructure)));
			if (reportPlans) (console.log("Construction Sites: " + this.overseer.planner.constructionQueue.length));
			console.log("Routes === " + JSON.stringify(this.overseer.routes.length));
			console.log("Construction Queue === "  +  this.overseer.constructionQueue.length);
			console.log("----------------------------Room " + this.name + " End Analysis-------------------------------------");
		};

	Room.prototype.clear = function() {	};

};
