var db = require('diskdb');
db.connect('./packages/YARP/db');
db.loadCollections(['srv_data','users','groups']);

function getFormattedDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth()+1; //January is 0!
  var yyyy = today.getFullYear();
  var h = today.getHours();
  var m = today.getMinutes();
  var s = today.getSeconds();
  if(dd<10){
    dd='0'+dd;
  }
  if(mm<10){
    mm='0'+mm;
  }
  var today = `${dd}/${mm}/${yyyy} ${h}:${m}:${s}`;
  return today;
}

module.exports = {
  //User Database Interaction
  getUser : function(player){
    var user = db.users.findOne({identifier : player.socialClub});
    return user
  },
  loginUser : function(player){
    var user = db.users.findOne({identifier : player.socialClub});
    var last_login = {
      ip : player.ip,
      date : getFormattedDate()
    }
    if (user == null) {
      user = {
          id : db.users.count()+1,
          last_login : last_login,
          whitelisted : false,
          banned : false,
          identifier : player.socialClub,
          groups : ["user"],
          characters : []
      };
      db.users.save(user);
    } else {
      db.users.update(user, {last_login : last_login}, {multi: false, upsert: true});
    }
    return user;
  },
  //Group Database Interaction
  addGroup : function(name){
    var group = db.groups.findOne({name : name});
    if (group == null){
      group = {
        name : name,
        permissions : []
      }
      db.groups.save(group);
      return true;
    }
    return false;
  },
  addPermission: function(name,permission){
    var group = db.groups.findOne({name : name});
    if (group == null){
      group = {
        name : name,
        permissions : [permission]
      }
    } else if (group.permissions.indexOf(permission) > -1) {
      return false;
    } else {
      group.permissions.push(permission);
    }
    db.groups.update({name : name}, group, {multi: false, upsert: true});
    return true;
  },
  removeGroup : function(name){
    var group = db.groups.findOne({name : name});
    if (group == null){
      return false;
    } else {
      db.groups.remove({name : name});
      return true;
    }
  },
  removePermission: function(name,permission){
    var group = db.groups.findOne({name : name});
    if (group == null){
      return false;
    } else if (group.permissions.indexOf(permission) < 0){
      return false;
    } else {
      db.groups.update({name : name}, {permissions : group.permissions.filter(e => e !== permission)}, {multi: false, upsert: false});
      return true;
    }
  },
  takeGroup : function(userid,group){
    var user = db.users.findOne({id : parseInt(userid)});
    if (user == null){
      return false;
    } else {
      db.users.update(user, {groups : user.groups.filter(e => e !== group)}, {multi: false, upsert: false});
      return true;
    }
  },
  giveGroup : function(userid,group){
    var user = db.users.findOne({id : parseInt(userid)});
    if (user == null){
      return false;
    } else {
      user.groups.push(group);
      db.users.update(user, {groups : user.groups}, {multi: false, upsert: false});
      return true;
    }
  },
  hasPermission : function(player,permission){
    var user = db.users.findOne({identifier : player.socialClub});
    var result = false;
    var removed = false;
    var readd = false;
    user.groups.forEach(function(g){
      var group = db.groups.findOne({name : g});
      if (group != null) {
        if (group.permissions.indexOf("*") > -1){
          result = true;
        }
        if (group.permissions.indexOf(permission) > -1){
          result = true;
        }
        if (group.permissions.indexOf(`-${permission}`) > -1){
          removed = true;
        }
        if (group.permissions.indexOf(`+${permission}`) > -1){
          readd = true;
        }
      }
    });
    if (removed && !readd){
      result = false;
    }
    return result;
  }
};
