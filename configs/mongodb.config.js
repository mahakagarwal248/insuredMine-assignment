import mongoose from "mongoose";

mongoose.set("strictQuery", true);

mongoose
  .connect(process.env["MONGO-DB-URL"], {
    auth: {
      username: process.env["MONGO-AUTH-USER"],
      password: process.env["MONGO-AUTH-PASSWORD"],
    },
    connectTimeoutMS: 10000,
  })
  .catch((error) =>
    console.error(`Failed to Connect to Mongoose 💥 | Error - ${error}`)
  );

const db = mongoose.connection;

/* This is a callback function that is called when the connection to the database is made. */
db.once("connected", function () {
  console.info(
    `Server Connected to Mongoose 💚 @ ${process.env["MONGO-DB-URL"]}`
  );
});

/* This is a callback function that is called when the connection to the database is disconnected due to error. */
db.on("error", function (err) {
  console.error(`Failed to Connect to Mongoose 💥 | Error - ${err}`);
});

/* This is a callback function that is called when the connection to the database is disconnected. */
db.on("disconnected", function (info) {
  console.error(
    `Server and Mongoose Disconnected from 💥 @ ${process.env["RE-WEB-MONGO-DB"]} | Error - ${info}`
  );
});
