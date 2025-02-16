import { Socket } from "socket.io";
import { inferData } from "./utils/infer-data";
import { InferedDataTypes } from "./types";
import { games } from "./utils/games";


const Actions = {
  edit_room: (socket: Socket, data: InferedDataTypes<"edit_room">) => {
    const { roomId, newRoomId } = inferData("edit_room", data);
    socket.leave(roomId);
    socket.join(newRoomId);
    socket.emit("room_edited", { oldRoomId: roomId, newRoomId });
    console.log("room edited", roomId, newRoomId);
  },
  create_room: (socket: Socket, data: InferedDataTypes<"create_room">) => {
    const { roomId } = inferData("create_room", data);
    socket.join(roomId);
    socket.emit("room_created", { roomId: roomId });
    console.log("room created", roomId);
  },

  join_room: (socket: Socket, data: InferedDataTypes<"join_room">) => {
    const { roomId } = inferData("join_room", data);
    socket.join(roomId);
    socket.in(roomId).emit("room_joined", { roomId });
    console.log(socket.rooms);

    console.log(socket.id, "joined", roomId);
  },
  game: (socket: Socket, data: InferedDataTypes<"game">) => {
    const inferedData = inferData("game", data);
    games[inferedData.roomId!] = inferedData;
    socket.in(inferedData.roomId!).emit("game_update", inferedData);
    console.log("game_update", inferedData);
  },
  emit: (socket: Socket, data: InferedDataTypes<"emit">) => {
    const { event, data: eventData } = inferData("emit", data);
    socket.emit(event, eventData);
    console.log("emitted", event, eventData);
  },
  players: (socket: Socket, data: InferedDataTypes<"players">) => {
    const { name, word, isAlive } = inferData("players", data);
    socket.emit("players_update", { name, word, isAlive });
    console.log("players_update", name, word, isAlive);
  },
  gameOptions: (socket: Socket, data: InferedDataTypes<"gameOptions">) => {
    const { joueurs, misterWhite, intrus, words } = inferData(
      "gameOptions",
      data
    );
    socket.emit("gameOptions_update", { joueurs, misterWhite, intrus, words });
    console.log("gameOptions_update", joueurs, misterWhite, intrus, words);
  },
  gameContext: (socket: Socket, data: InferedDataTypes<"gameContext">) => {
    const { game, isConnected } = inferData("gameContext", data);
    socket.emit("gameContext_update", { game, isConnected });
    console.log("gameContext_update", game, isConnected);
  },
} as const;

export default Actions;
