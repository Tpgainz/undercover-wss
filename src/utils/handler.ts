import { Socket } from "socket.io";
import { ActionDataTypes, ActionKey } from "../types";
import Actions from "../emits";

export const socketHandler = (socket: Socket) => {
  console.log("A user connected");

  Object.keys(Actions).forEach((action) => {
    socket.on(action, (data) =>
      delegateAction(socket, action as keyof ActionDataTypes<ActionKey>, data)
    );
  });

  socket.on("disconnect", () => {
    console.log("A user disconnected");
  });
};

const delegateAction = (socket: Socket, actionType: ActionKey, data: any) => {
  const action = Actions[actionType];
  if (action) {
    console.log("Action:", actionType);
    ensureData(socket, () => action(socket, data));
  } else {
    console.error("No handler found for action:", actionType);
  }
};

const ensureData = (socket: Socket, action: () => void) => {
  try {
    action();
  } catch (error) {
    console.error("Error during action:", error);
    socket.emit("action_error", {
      message: "An error occurred during the action.",
    });
  }
};
