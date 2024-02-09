<div align="center">
	<br />
  <p><a href="https://www.npmjs.com/package/djs-cooldown"><img src="https://nodei.co/npm/djs-cooldown.png"></a></p>
	<p>
		<a href="https://discord.gg/569UsPjmBW"><img src="https://img.shields.io/discord/1122881031633129542?color=5865F2&logo=discord&logoColor=white" alt="Discord server" /></a>
		<a href="https://www.npmjs.com/package/djs-cooldown"><img src="https://img.shields.io/npm/v/djs-cooldown.svg?maxAge=3600" alt="npm version" /></a>
		<a href="https://www.npmjs.com/package/djs-cooldown"><img src="https://img.shields.io/npm/dt/djs-cooldown.svg?maxAge=3600" alt="npm downloads" /></a>
    <a href="#"><img src="https://img.shields.io/github/repo-size/KaizOffical/djs-cooldown" alt="repo size"></a>
	</p>
</div>

## About

`djs-cooldown` is a [Node.js](https://nodejs.org/en) package to add cooldown for everything you want using [MongoDB](https://mongodb.com/), but the main purpose of this package is for Discord BOT commands made by [discord.js](https://www.npmjs.com/package/discord.js)

## Installation

**Node.js 16.11.0 or newer is required.**

```sh
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
  message: "Connected to MongoBD Successfully",
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

### Count time left

```js
let time_left = await djs_cooldown.timeLeft({
  identity: "11111111111",
  name: "somethinghereig?",
});
```

- Output: Time in MS
- If no data was found or `timeLeft < 0`, output will be `0`

## Support

If you have any problems or want to report some bugs, let us know

- Report in [Discord Server](https://discord.gg/569UsPjmBW)
- Create an issue on [Github Issue](https://github.com/KaizOffical/djs-cooldown/issues)
- Directly contact [Head Developer](https://discord.com/users/744831818632658944)
