const mongoose = require("mongoose");

class DJS_Cooldown {
  constructor(database) {
    if (!database.connection)
      throw new Error("No connection URL to database is provided");

    this.database = {
      connection: database.connection,
      message: database.message || "Connected to MongoDB",
      disconnect: database.disconnect || "Disconnected to MongoDB",
    };

    this.db = mongoose.model(
      "djs-cooldown",
      new mongoose.Schema({
        identity: {
          type: String,
          required: true,
        },
        name: {
          type: String,
          required: true,
        },
        cooldown: {
          type: Number,
          required: true,
        },
        usedAt: {
          type: String,
          required: true,
        },
      })
    );

    this.isConnect = false;
  }

  async callbackPass(error = false, message, data = {}) {
    if (!message) return;
    if (error) throw new Error(message);
  }

  async setDB(connection, message) {
    if (!message) message = this.database.message;
    this.database = { connection, message };
  }

  async connect() {
    if (this.isConnect) throw new Error("Already connected to MongoDB");
    await mongoose.connect(this.database.connection).then(() => {
      console.log(this.database.message);
      this.isConnect = true;
    });
  }

  async disconnect() {
    if (!this.isConnect) throw new Error("Already disconnected from MongoDB");
    await mongoose.disconnect().then(() => {
      console.log(this.database.disconnect);
      this.isConnect = false;
    });
  }

  async set(
    { identity, name, cooldown, usedAt },
    callback = this.callbackPass
  ) {
    if (!this.isConnect) throw new Error("Did not connect to MongoDB");
    if (!identity) throw new Error("No identity is provided");
    if (!name) throw new Error("No name is provided");
    if (!cooldown) throw new Error("No cooldown is provided");
    if (!usedAt) throw new Error("No timestamp is provided");

    const db = this.db;

    let data = await db.findOne({ identity, name });
    if (data) {
      if (parseInt(data.usedAt) + data.cooldown > Date.now())
        return callback(true, "The given information was found on database.");
      else await db.findOneAndDelete({ identity, name });
    }

    try {
      await db.create({
        identity,
        name,
        cooldown,
        usedAt,
      });
      callback(false, "Successfully  created.");
    } catch (e) {
      callback(true, e.message);
    }
  }

  async remove({ identity, name }, callback = this.callbackPass) {
    if (!this.isConnect) throw new Error("Did not connect to MongoDB");
    if (!identity) throw new Error("No identity is provided");
    if (!name) throw new Error("No name is provided");

    const db = this.db;

    let data = await db.findOne({ identity, name });
    if (!data)
      return callback(
        true,
        "The given information was not stored on database."
      );

    try {
      await db.findOneAndDelete({ identity, name });
      callback(false, "Successfully deleted.");
    } catch (e) {
      callback(true, e.message);
    }
  }

  async handleCooldown({ identity, name }, callback = this.callbackPass) {
    if (!this.isConnect) throw new Error("Did not connect to MongoDB");
    if (!identity) throw new Error("No identity is provided");
    if (!name) throw new Error("No name is provided");

    const db = this.db;

    let data = await db.findOne({ identity, name });
    if (!data)
      return callback(
        true,
        "The given information was not stored on database."
      );
    if (parseInt(data.usedAt) + data.cooldown > Date.now())
      return callback(false, "The cooldown is not ended yet", data);
    callback(false, "The cooldown is ended", data);
  }

  async checkCooldown({ identity, name }, callback = this.callbackPass) {
    if (!this.isConnect) throw new Error("Did not connect to MongoDB");
    if (!identity) throw new Error("No identity is provided");
    if (!name) throw new Error("No name is provided");

    const db = this.db;

    let data = await db.findOne({ identity, name });
    if (!data) {
      callback(true, "The given information was not stored on database.");
      return ture;
    }
    if (parseInt(data.usedAt) + data.cooldown > Date.now()) {
      callback(false, "The cooldown is not ended yet", data);
      return false;
    }
    callback(false, "The cooldown is ended", data);
    return true;
  }
}

module.exports = { DJS_Cooldown };
