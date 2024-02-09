<div align="center">
	<br />
  <p><a href="https://www.npmjs.com/package/djs-cooldown"><img src="https://nodei.co/npm/djs-cooldown.png"></a></p>
	<p>
		<a href="https://discord.gg/569UsPjmBW"><img src="https://img.shields.io/discord/1122881031633129542?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/djs-cooldown"><img src="https://img.shields.io/npm/v/djs-cooldown.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/djs-cooldown"><img src="https://img.shields.io/npm/dt/djs-cooldown.svg?maxAge=3600" alt="npm downloads" /></a>
    <a href="#"><img src="https://img.shields.io/github/repo-size/KaizOffical/djs-cooldown" alt="repo size"></a>
    <a href="#"><img src="https://img.shields.io/github/package-json/dependency-version/KaizOffical/djs-cooldown/mongoose"></a>
	</p>
</div>

## About

`djs-cooldown` is a [Node.js](https://nodejs.org/en) package to add cooldown for everything you want using [MongoDB](https://mongodb.com/), but the main purpose of this package is for Discord BOT commands made by [discord.js](https://www.npmjs.com/package/discord.js)

## Installation

**Node.js 16.11.0 or newer is required.**

```sh
# These are common JS runtime environment that you may use
# Just choose one that suitable for you

npm install djs-cooldown
yarn add djs-cooldown
pnpm add djs-cooldown
bun add djs-cooldown
```

## Quick Setup

```js
const { DJS_Cooldown } = require("djs-cooldown");

const djs_cooldown = new DJS_Cooldown({
  connection: "mongodb+srv://...", // your MongoDB Connection
  message: "Connected to MongoDB Successfully",
});
```

<br>

`connection`: `String` - The MongoDB connection string, <br>
`message`: `String` - The success message when connected to MongoDB. <br>
`disconnect`: `String` - The success message when disconnected from MongoDB.<br>

## Example usage

Set and check cooldown when user uses a command

```js
client.on("message", async (message) => {
  // example Command Handler
  let cmd = client.getCommand(message.content);
  if (!cmd) return;

  // Cooldown System
  let isEnded = await djs_cooldown.checkCooldown({
    identity: message.author.id,
    name: `text/${cmd.name}`,
  });
  if (!isEnded) return message.channel.send(`You are on cooldown!`);

  // cooldown not found or ended
  cmd.run(...);

  // set new cooldown
  await djs_cooldown.set({
    identity: message.author.id,
    name: `text/${cmd.name}`,
    cooldown: 15 * 1000, // 15 seconds in ms
    usedAt: Date.now()
  }, function(error, message) {
    if(error) console.error(error);
  });
});
```

<br>

## Features

### Database Utilities

```js
await djs_cooldown.setDB("mongodb+srv://..."); // new connetion URL

// You need to re-connect to MongoDB to change URL
await djs_cooldown.disconnect();
await djs_cooldown.connect();

// or simple way
await djs_cooldown.reconnect();

// shorter
await djs_cooldown.setDB("mongodb+srv://...", true); // "true" here means turn on automatically reconnect when reset connection URL
```

### Cooldown Ultilities

```js
// Set new cooldown for user
await djs_cooldown.set({
  identity: "1234812",
  name: "somethingherer??",
  cooldown: 15 * 1000,
  usedAt: Date.now(),
});

// Remove a created cooldown if you think something went wrong
await djs_cooldown.remove({
  identity: "1234812",
  name: "somethingherer??",
});
```

### Check is cooldown ended

```js
await djs_cooldown.checkCooldown({
  identity: "1234812",
  name: "somethingherer??",
});

// > true
// Is the cooldown ended? (true/false)
```

### Count "Time Left"

```js
await djs_cooldown.timeLeft({
  identity: "11111111111",
  name: "somethinghereig?",
});

// > 123412
// Time left in milliseconds
```

- Output: Time in MS
- If no data was found or `timeLeft < 0`, output will be `0`

### Default options

> `data` - `Object`: Provide data to do job
>
> - `identity` - `String`: User ID / Guild ID / etc...
> - `name` - `String`: Cooldown for "name"
> - `cooldown` - `Number`: Cooldown time (in ms)
> - `usedAt` - `Number | String`: Timestamp when the cooldown was used
>
> `callback` - `Function | null` (optional): Callback when code complete jobs. Return 2/3 variables:
>
> - `error` - `Boolean`: Check if error occurs
> - `message` - `String`: Return message
> - `data` - `Object | null` (depends on purpose): Return collected data (used for some functions)

Some functions do not required all fields, you can provide only what needed.

## Support

If you have any problems or want to report some bugs, let us know

- Report in [Discord Server](https://discord.gg/569UsPjmBW)
- Create an issue on [Github Issue](https://github.com/KaizOffical/djs-cooldown/issues)
- Directly contact [Head Developer](https://discord.com/users/744831818632658944)
