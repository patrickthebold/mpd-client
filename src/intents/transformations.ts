import type { MpdCommand, MpdCommandString, UserIntent } from "./types";

export const intent2Commands = (intent: UserIntent): MpdCommand[] => [intent];
export const command2String = (command: MpdCommand): MpdCommandString => {
  switch (command.type) {
    case "pause":
      return "pause";
    case "stop":
      return "stop";
    case "next_track":
      return "next";
    case "previous_track":
      return "previous";
    case "set_volume":
      return `setvol ${command.volume}`;
    case "idle":
      return "idle";
  }
};
