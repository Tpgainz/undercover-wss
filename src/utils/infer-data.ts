import { schemas } from "@tpgainz/undercover-lib";
import { z } from "zod";
import { ActionDataTypes, SchemaKeys } from "../types";

export const inferData = <T extends SchemaKeys>(
  action: T,
  data: ActionDataTypes<T>
): z.infer<typeof schemas[T]> => {
  const schema = schemas[action];
  const validationResult = schema.safeParse(data);
  if (!validationResult.success) {
    throw new Error("Validation error");
  }
  return validationResult.data;
};
