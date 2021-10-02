/*
    This method will spawn pretty much anything you want. You have two options, exact or ratio

    Exact: An example of what's in the spawnQueue is my miner code, which in the beginning of a
           new room builds up the body as the level allows:
    {
        exact: true,
        name: (unique name),
        body: {"work": 1, "carry": 1, "move": 1, "work": 4, "move": 2, "work": 1},
        memory: {role: 'miner', homeRoom: this.room.name, sourceId: opts.sourceId}
    }

    Ratio: This will take whatever ratio you give it and figure out the maximum amount your spawn
           can make.
           You can specify the maximum size of the creep or not.
           The body will create all the first body parts first, and then the next...like if you have
           2 carrys and 1 moves in the ratio, it will create all the carrys first and then the moves

        Example: Here is my refill cart spawnQueue code:
    {
        exact: false,
        maxBodyParts: 30,
        body: {"carry": 2, "move": 1},
        name: (unique name),
        memory: {role: 'refillCart', homeRoom: this.room.name, working: false}
    }

    if (Game.creeps[this.memory.creeps.findIndex(x => x.memory.target === this.memory.sources[source].id)]===undefined)  {

      console.log("creep doesn exist delete from memory")
<td class="chars">⛔👁️‍🗨️   /td>
    }	<td class="chars">🚈</td>⛏⚒🏹🔫⚔🗡🛠🔧💉‼❓🔧⛏

    delete this.memory.creeps[this.memory.creeps.findIndex(x => x.memory.target === this.memory.sources[source].id)];
    this.memory.sources[source].creep = '';
    if(this.memory.creeps.findIndex(x => x.memory.target === this.memory.sources[source].id)!==undefined)
    //if(found !== -1)
    {
      console.log("Found creep in memory allocated to task " + this.memory.sources[source].id);
      if (Game.creeps[this.memory.creeps.findIndex(x => x.memory.target === this.memory.sources[source].id)]===undefined)  {

        console.log("creep doesn exist delete from memory")
        delete this.memory.creeps[this.memory.creeps.findIndex(x => x.memory.target === this.memory.sources[source].id)];
        this.
*/
.memory.sources[source].id)];
        this.
*/