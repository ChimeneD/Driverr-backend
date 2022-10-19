const ThingSpeakClient = require("thingspeakclient");
import express, { Express, Request, Response } from "express";
import dotenv from "dotenv";
import { createServer } from "http";
import { Server } from "socket.io";
dotenv.config();
const port = process.env.PORT;

// creating server
const app: Express = express();
const server = createServer(app);

const io = new Server(server, {
  transports: ["websocket", "polling"]
});
//initializing web socket

// create the thingspeak client
const client = new ThingSpeakClient({
  //server: `${process.env.THING_SPEAK_SERVER}`,
  useTimeoutMode: false,
  updateTimeout: 20000
});

// attach channel and keys to client
client.attachChannel(
  1788967,
  { writeKey: process.env.WRITE_KEY, readKey: process.env.READ_KEY },
  (error: any, response: any) => {
    if (error) {
      console.log(error.message);
    } else {
      console.log("Response => Connected!");
    }
  }
);

app.get("/", (req: Request, res: Response) => {
  /*client.updateChannel(1788967, { field1: 1, field2: 2 }, function (err, resp) {
    if (!err && resp > 0) {
      console.log('update successfully. Entry number was: ' + resp);
    } else {
      console.log(err.message);
    }
  });*/
  res.send("Server Running");
});
app.get("/get-location", (req: Request, res: Response) => {
  console.log("Yes");
  client.getLastEntryInChannelFeed(
    1788967,
    null,
    (error: any, response: any) => {
      if (!error && response) {
        res.send({ data: response });
      } else {
        console.log("Error => " + error);
      }
    }
  );
});

//socket io sending data to the front end every second
io.on("connection", (socket: any) => {
  console.log(`
  \n A socket has been connected: \nID: ${socket.id} \nOrigin: ${socket.handshake.headers.origin}`);
  io.emit("congrats", {
    msg: "Successfully Connected!"
  });
  setInterval(() => {
    client.getLastEntryInChannelFeed(
      1788967,
      null,
      (error: any, response: any) => {
        if (!error && response) {
          socket.send(response);
        } else {
          console.log("Error => " + error);
        }
      }
    );
    // console.log('topic: ' + topic + ', payload: ' + thePayload.toString());
    // socket.send(thePayload.toString());
  }, 2000);

  socket.on("control", () => {
    socket.emit("yes");
    console.log("Yes");
  });
});

server.listen(`${port}`, () => {
  console.log(`🚀 server started on http://localhost:${port}`);
});
