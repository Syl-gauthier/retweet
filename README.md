# retweet

(Since the the twitter REST API does allor to use cursor on the retweets, for now this module return 10 retweeter max)

Simple twitter-API tool to list the information about the users that retweeted a given tweet. 

```javascript
const retweet = require("retweet")({
  consumer_key: "########",
  consumer_secret: "########",
  access_token_key: "########",
  access_token_secret: "########"
});


retweet.get("########", {style: "tiny"}).then(function(result) {
  console.log(result);
});
```
## Installation

'npm install retweet'

## Autentification...

Credentials are require for twitter to authenticate your requests.

### ...with a credential object

```javascript
const retweet = require("retweet")({
  consumer_key: "########",
  consumer_secret: "########",
  access_token_key: "########",
  access_token_secret: "########"
});
```

### ...with a twitter object

```javascript
const Twitter = require("twitter");

var client = new Twitter({
  consumer_key: process.env.TWITTER_CONS_KEY,
  consumer_secret: process.env.TWITTER_CONS_SECRET,
  access_token_key: process.env.TWITTER_ACCESS_TOKEN,
  access_token_secret: process.env.TWITTER_ACCESS_TOKEN_SECRET
});
```