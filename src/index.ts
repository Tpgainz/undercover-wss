import express from "express";
import { createServer } from "http";
import { Server, Socket } from "socket.io";
import { socketHandler } from "./utils/handler";
import {schemas} from "@tpgainz/undercover-lib";
import Actions from "./emits";
import { games } from "./utils/games";

const app = express();
const server = createServer(app);

const io = new Server(server, {
  cors: {
    origin: process.env.ORIGIN ?? "http://localhost:3000",
    methods: ["GET", "POST"],
    credentials: true,
  },
});

io.on("connection", (socket: Socket) => {
  socketHandler(socket);
});

server.listen(3001, () => {
  console.log("Server is running on port 3001");
});

if (process.env.NODE_ENV === "development") {
  const areKeysIdentical = (keys1: string[], keys2: string[]) => {
    return (
      keys1.length === keys2.length && keys1.every((key) => keys2.includes(key))
    );
  };
  const keysAreIdentical = areKeysIdentical(
    Object.keys(schemas),
    Object.keys(Actions)
  );

  if (!keysAreIdentical) {
    console.error(
      "Les clés des schémas et des actions ne sont pas identiques!"
    );
  }
}

app.get("/room/:roomId", getRoomState);

function getRoomState(req: express.Request, res: express.Response) {
  const { roomId } = req.params;
  if (!roomId) {
    return res.status(404).json({ error: "Missing roomId" });
  }

  const game = games[roomId];
  if (!game) {
    return res.status(404).json({ error: "Party data not found" });
  }

  return res.json(game.state);
}
