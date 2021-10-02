require('prototype.room')();

var AIController = {};

AIController.setPriorities = function() {
console.log("Running")
//New game or room deleted
  
  for (var i in Memory.rooms)  {
    if (Game.rooms[i] === undefined) {
      console.log("Clearing room memory " + Memory.rooms[i].name)
      delete Memory.rooms[i]; 
    }
  }
  for(var roomName in Game.rooms)  {
    Game.rooms[roomName].analyseRoom(roomName);
  }
}

module.exports = AIController;
