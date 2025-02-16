import { Socket } from "socket.io";
import Actions from "./emits";
import { schemas } from "@tpgainz/undercover-lib";

export type ExtractDataTypes<T> = {
  [K in keyof T]: T[K] extends (socket: Socket, data: infer D) => any
    ? D
    : never;
};

type TActions = typeof Actions;

export type ActionKey = keyof TActions;

export type ActionDataTypes<T extends ActionKey> = ExtractDataTypes<
  Pick<TActions, T>
>[T];

//From the schema to avoid circular dependency

export type SchemaKeys = keyof typeof schemas;

export type InferedDataTypes<T extends SchemaKeys> = ReturnType<
  typeof schemas[T]["parse"]
>;
