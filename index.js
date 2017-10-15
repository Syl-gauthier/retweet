//index.js
/* eslint no-console: "off" */

var retweet = function(params) {
  var client;
  if (params.VERSION) { //params is a Titter client
    client = params;
  } else { //params contain all the credentials
    const Twitter = require("twitter");
    client = new Twitter(params);
  }

  var module = {client};

  function get(id, options) {
    var result = {};

    return getTweet(id).then(function(tweet) {
      result.tweet = tweet;
      return getRetweetIds(id, -1, []);
    }).then(function(ids) {
      return getRetweeters(ids);
    }).then(function(retweeters) {
      result.retweeters = retweeters;
      if(options) {
        switch(options.style) {
        case "tiny":
          result.tweet = {
            id: result.tweet.id_str, 
            text: result.tweet.text, 
            user: {
              id: result.tweet.user.id_str, 
              name: result.tweet.user.name, 
              screen_name: result.tweet.user.srceen_name
            }
          };
          result.retweeters = result.retweeters.map(function(retweeter) {
            return {
              id: retweeter.id_str,
              name: retweeter.name,
              screen_name: retweeter.screen_name,
              description: retweeter.description
            };
          });
          break;
        }
      }
      return result;
    }
    ).catch(function(error) {
      console.log(error);
      return "error";
    });
  }

  function getTweet(id) {
    return new Promise (function(resolve,reject) {
      client.get("statuses/show/" + id, function (error, tweet) {
        if(error) reject(error);
        resolve(tweet);
      });
    });
  }

  function getRetweetIds(id, cursor, ids) {
    return new Promise(function(resolve, reject) {
      if(cursor) {
        client.get("statuses/retweeters/ids", {id, cursor, stringify_ids: true}, function(error, tweets) {
          if(error) reject(error);
          ids.push(tweets.ids);
          cursor = tweets.next_cursor;
          getRetweetIds(id, cursor, ids).then(function(ids) {resolve(ids);}).catch(function(err) {reject(err);});
        });
      } else {
        resolve(ids);
      }
    });
  }

  function getRetweeters(ids) {
    var usersPromises = ids.map(function(idsShare) {
      return new Promise (function(resolve, reject) {
        console.log(idsShare);
        client.post("users/lookup", {user_id: idsShare.toString()}, function(error, users) {
          if(error) reject(error);
          resolve(users);
        });
      });
    });

    return Promise.all(usersPromises).then(function(usersArrays) {
      return usersArrays.reduce(function(acc, curr){
        return acc.concat(curr);
      }, []);
    });
  }

  module.get = get;
  return module;
};

module.exports = retweet;