/*
* Module code goes here. Use 'module.exports' to export things:
* module.exports.thing = 'a thing';
*
* You can import it from another modules like this:
* var mod = require('ai.logistics');
* mod.thing == 'a thing'; // true
*/
module.exports = class RoomPlanner {
  constructor(_room) {
    this.room = _room;
    this.routes = [];
    this.constructions = [];
    this.constructionQueue = [];
    }

    plan(_pois) {
      this.planRoutes(_pois);
      this.planBase(_pois);
      this.planExtensions(_pois);
      this.displayPlan();
      return this.routes;
    }

    planBase(_pois) {
      this.origin = Game.getObjectById(_pois.spawners[0]).pos;
      for(var i = 0; i < 6; i++) {
        new RoomVisual(this.room).circle(this.origin.x - i, this.origin.y - i,  {fill: 'transparent', radius: 0.25, stroke: 'green'});
        new RoomVisual(this.room).circle(this.origin.x - i - 1, this.origin.y - i,  {fill: 'transparent', radius: 0.25, stroke: 'blue'});
        new RoomVisual(this.room).circle(this.origin.x - i + 1, this.origin.y - i,  {fill: 'transparent', radius: 0.25, stroke: 'blue'});
        new RoomVisual(this.room).circle(this.origin.x + i, this.origin.y + i,  {fill: 'transparent', radius: 0.25, stroke: 'green'});
        new RoomVisual(this.room).circle(this.origin.x + i - 1, this.origin.y - i,  {fill: 'transparent', radius: 0.25, stroke: 'blue'});
        new RoomVisual(this.room).circle(this.origin.x + i + 1, this.origin.y - i,  {fill: 'transparent', radius: 0.25, stroke: 'blue'});
        new RoomVisual(this.room).circle(this.origin.x - i, this.origin.y + i,  {fill: 'transparent', radius: 0.25, stroke: 'green'});
        new RoomVisual(this.room).circle(this.origin.x + i, this.origin.y - i,  {fill: 'transparent', radius: 0.25, stroke: 'green'});
      }

    }

    planExtensions(_pois) {
      this.origin = Game.getObjectById(_pois.spawners[0]).pos;
        for (var i = 0; i < 11; i++) {
          for (var j = 0; j < 11; j++) {
            //new RoomVisual(this.room).circle(this.origin.x + i - 5, this.origin.y + j - 5,  {fill: 'transparent', radius: 0.25, stroke: 'purple'});
          }
        }
      }

    planRoutes(_pois) {
      var self = this
      //Route from source to room controller, start at container
      _.forEach(_pois.sources, function(value) {
        self.addOrUpdateRoute(self.getProtoRoute({
          crateAt1: true,
          source: value,
          destination: _pois.roomController,
          name: value + "_" + _pois.roomController,
          path: self.planRoute(value, _pois.roomController, {source: true}),
        }));
      });


      //Route from spawner to room controller
      _.forEach(_pois.spawners, function(spawn) {
        _.forEach(_pois.sources, function(source) {
          self.addOrUpdateRoute(self.getProtoRoute({
            crateAt1: true,
            source: source,
            destination: spawn,
            name: source + "_" + spawn,
            path: self.planRoute(source, spawn, {source: false})
          }));
        });
      });

      _.forEach(_pois.spawners, function(spawn) {
        self.addOrUpdateRoute(self.getProtoRoute({
          crateAt1: true,
          source: spawn,
          destination: _pois.roomController,
          name: spawn + "_" + _pois.roomController,
          path: self.planRoute(spawn, _pois.roomController, {source: false})
        }));
      });
    }

    planRoute(source, destination, opts) {
      var from = Game.getObjectById(source);
      var to = Game.getObjectById(destination);
      var path = Game.rooms[this.room].findPath(from.pos, to.pos, {ignoreCreeps: true});
      return path;
    }

    addOrUpdateRoute(_route) {
      const index2 = this.routes.findIndex(item => item.name === _route.name);
      if (index2 > -1) {
        this.routes[index2] = _route
      } else {
        this.routes.push(_route)
      }
    }

    displayPlan() {
      for (var i=0; i < this.constructionQueue.length; i++) {
        switch (this.constructionQueue[i].type) {
        case 'STRUCTURE_ROAD':
          new RoomVisual(this.room).circle(this.constructionQueue[i].x, this.constructionQueue[i].y,  {fill: 'grey', radius: 0.25, stroke: 'blue'});
          break;
        case 'STRUCTURE_CONTAINER':
          new RoomVisual(this.room).circle(this.constructionQueue[i].x, this.constructionQueue[i].y,  {fill: 'transparent', radius: 0.25, stroke: 'yellow'});
          break;
        default:
          new RoomVisual(this.room).circle(this.constructionQueue[i].x, this.constructionQueue[i].y,  {fill: 'transparent', radius: 0.25, stroke: 'orange'});
          break;
      }
    }
  }

  getProtoRoute(_route) {
    return {
        name: _route.name || '',
        path: _route.path || [],
        source: _route.source || '',
        destination: _route.destination || '',
        crateAt1: _route.crateAt1 || false,
        priority : _route.priority || 999
    }
  }
};




/*    roads:            this.roads[i],
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
*/
