module.exports = class RoomBuilder {

  constructor(room) {
    this.priority = 999;
    this.room = room;
    this.roads = [];
    this.constructionQueue = [];
    this.visual = true;
  }

  planRoads(routes) {
    this.roads = routes;
    //console.log("mapping " + source + " to " + destination)
    var self = this
    _.forEach(this.roads, function(_road) {
      let priority = 0
      _.forEach(_road.path, function(_step) {
        var construction = self.getProtoConstruction();
        construction.name = _step.x + "_" + _step.y;
        construction.pos = new RoomPosition(_step.x, _step.y, self.room);
        construction.type = priority == 0 && _road.crateAt1 === true ? 'container' : 'road';
        construction.priority = priority;
        priority++;
        self.addOrUpdateConstruction(construction);
      });
    });
    return this.constructionQueue;
  }

  getConstructionSite(_type, _position) {

    let _constructions = Game.rooms[this.room].lookForAt(LOOK_CONSTRUCTION_SITES, _position.x, _position.y);
    if (_constructions.length == 0)  {
      console.log("CREATING CONSTRUCTION AT: " + _position + " TYPE: " + _type);
      _construction = Game.rooms[this.room].createConstructionSite(_position, _type);
      console.log("CREATED CONSTRUCTION WITH ID " + _construction);
    }
    console.log("RETURNING:" + _constructions[0].id)
    return _constructions[0].id;
  }

  addOrUpdateConstruction(_construction) {
    this.constructionQueue === undefined ? this.constructionQueue = [] : this.constructionQueue;
    const index2 = this.constructionQueue.findIndex(item => item.name === _construction.name);
    if (index2 > -1) {
      this.constructionQueue[index2] = _construction
    } else {
      this.constructionQueue.push(_construction)
    }
  }

  completeConstruction(position) {
      var tasks = this.constructionQueue.filter(o => o.pos == position)
      console.log("Removing item from array of constructions " + this.constructionQueue.length + " @ " + position.x + "_" + position.y)
      _.remove(this.constructionQueue, function(e) {
        return e.pos.x == position.x && e.pos.y == position.y;
      });
      console.log("Removed item from array of constructions " + this.constructionQueue.length)
    }

  getPriority() {
    for(var i=0; i < 11; i++) {
      if(_.find(this.constructionQueue, {'priority':i}))  {
        break;
      }
    }
    console.log("Priority " + i)
    return i;
  }

  build() {
    var self = this
    let priority = this.getPriority()
    if(this.contructionQueue !== undefined && this.constructionQueue.length > 0)
    {
      _.forEach(this.constructionQueue.filter(e => e.priority == priority), function(_construction) {
        new RoomVisual(self.room).circle(_construction.pos, {fill: 'green', radius: 0.50, stroke: 'green'});
      })
    }
  }

  getProtoConstruction() {
    return {
      name: '',
      pos: {},
      type: '',
      priority: 9
    }
  }

  displayAll() {
    var self = this
    _.forEach(this.constructionQueue, function(_construction) {
      switch (_construction.type) {
      case 'road':
        new RoomVisual(self.room).circle(_construction.pos, {fill: 'grey', radius: 0.25, stroke: 'green'});
        break;
      case 'container':
        var visuals = new RoomVisual(self.room).circle(_construction.pos, {fill: 'yellow', radius: 0.40, stroke: 'white'});
        new RoomVisual(self.room).text('🛠️', _construction.pos, {fill: 'white', radius: 0.40, stroke: 'white'});
        break;
      default:
        new RoomVisual(self.room).circle(_construction.pos, {fill: 'transparent', radius: 0.25, stroke: 'orange'});
        break;
      }
    });
  }
}
