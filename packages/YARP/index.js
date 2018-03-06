'use strict';

//Load YARP Gamemode
require('./gamemode/yarp.js').then(() => {
  //Load RAGE.MP Events
  console.log(chalk.yellowBright("[YARP] ")+"Loading RAGE.MP Events");
  //require('./events/ragemp/checkpoint.js');
  //require('./events/ragemp/colshape.js');
  //require('./events/ragemp/entity.js');
  require('./events/ragemp/player.js');
  //require('./events/ragemp/stream.js');
  //require('./events/ragemp/vehicle.js');
  //require('./events/ragemp/waypoint.js');

  //Load YARP Events
  console.log(chalk.yellowBright("[YARP] ")+"Loading YARP Events");
  //require('./events/yarp/bank.js');
  require('./events/yarp/character.js');
  //require('./events/yarp/inventory.js');
  //require('./events/yarp/item.js');
  require('./events/yarp/menu.js');
  //require('./events/yarp/object.js');

  //Load YARP Commands
  console.log(chalk.yellowBright("[YARP] ")+"Loading YARP Commands");
  //require('./commands/admins.js');
  //require('./commands/groups.js');
  //require('./commands/users.js');
  console.log(chalk.greenBright("[YARP] ")+"Loading Complete");
  mp.players.forEach((player, i) => {
    mp.events.call('playerJoin', player)
  });
});
