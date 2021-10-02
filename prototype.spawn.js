//require('prototype.room')();

module.exports = function() {


  Spawn.prototype.createACreep = function() {
      //If we're spawning a creep or there is no creep to spawn, return early
      console.log("========================Spawning " + this.room.overseer.spawns.length + " creeps==============================");
      if(this.spawning || this.room.overseer.spawns.length === 0) return;  //   if(this.spawning || this.room.spawnQueue.length === 0) return;

      //We know the spawnQueue has at least 1 object, so we pull it
      let opts = this.room.overseer.spawns[0];
      let body = []; let spawnResult;
      let maxBodyParts = 50;                                //Rooms can only spawn creeps with a max of 50, so this is our upper limit
      let maxEnergy = this.room.energyCapacityAvailable;    //Pull the maximum possible energy to be spent

      //if the options for the creep are exact
      console.log(opts.body);
      if(opts.exact){
          //cycle through the body parts in options
          for(let bodyPart in opts.body) {

              if(BODYPART_COST[bodyPart] > maxEnergy || maxBodyParts === 0) break;              //Need to break out of both for loops
              //cycle through the number of bodyparts for each body part
              for (let i = 0; i < opts.body[bodyPart]; i++) {
                  //if the next body part costs too much or we've run into our 50 bodypart limit, break
                  if(BODYPART_COST[bodyPart] > maxEnergy || maxBodyParts === 0){
                      maxEnergy = 0; break;             }
                  body.push(bodyPart);     //push this body part into the body array
                  maxEnergy -= BODYPART_COST[bodyPart];    //decrement the maximum energy allowed for the next iteration
                  maxBodyParts--;
              }
          }
      } else {
          let ratioCost = 0;          //ratioCost will tell us how much each iteration of the ratio will cost
          for(let bodyPart in opts.body){
              for(let i = 0; i < opts.body[bodyPart]; i++){
                  ratioCost += BODYPART_COST[bodyPart];
              }
          }
          let maxUnits = Math.min(
              Math.floor(maxEnergy / ratioCost),
              Math.floor((opts.maxBodyParts || 50) / _.sum(opts.body)),
              Math.floor(maxBodyParts / _.sum(opts.body))
          );
          for(let bodyPart in opts.body){
              for(let i = 0; i < maxUnits * opts.body[bodyPart]; i++)
                  body.push(bodyPart);
          }
      }

      spawnResult = this.spawnCreep(opts.body, opts.name, {memory: opts.memory});
      console.log(spawnResult)
      if(!spawnResult) _.pullAt(this.room.overseer.spawns, [0]);
  };
}
