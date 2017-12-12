// Description:
//   Allows Hubot to notify you when a specified user comes online.
//
// Configuration:
//   None
//
// Commands:
//   hubot stalk @<user> - sends you a notification once <user> comes online

module.exports = function (robot) {
  var watched = {}; // Keyed on watched user IDs; values are arrays of bound res.reply calls.

  robot.adapter && robot.adapter.client && robot.adapter.client.on("raw_message", function (message) {
    messageJSON = JSON.parse(message);
    
    if(messageJSON.type === 'presence_change' && messageJSON.presence === 'active' && watched[messageJSON.user]) {
      for(var i = 0, functions = watched[messageJSON.user]; i < functions.length; i++) functions[i]();
      watched[messageJSON.user] = [];
    }
  });

  robot.respond(/stalk\s+@(.+)/i, function (res) {
    var targetUsername = res.match[1];
    var targetIdMatch = /stalk\s+<@([\w\d]+)>/.exec(res.message.rawText);
    if(targetIdMatch) {
      var targetId = targetIdMatch[1]; // rawText has plain user IDs in the place of usernames
      robot.http("https://slack.com/api/users.getPresence?user=" + targetId + "&token=" + process.env.HUBOT_SLACK_TOKEN)
        .get()(function (_, __, body) {
          if(JSON.parse(body).presence === "active") {
            res.reply(targetUsername + " is active right now.");
          } else {
            res.reply("I will notify you when " + targetUsername + " comes online.");
            watched[targetId] = (watched[targetId] || []).concat(res.reply.bind(res, targetUsername + " is online."));
          }
        });
    } else {
      res.reply("@" + targetUsername + " doesn't exist!");
    }
  });
};
