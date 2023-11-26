export type UserIntent = Readonly<
  | { type: "pause" }
  | { type: "stop" }
  | { type: "next_track" }
  | { type: "previous_track" }
  | { type: "set_volume"; volume: number }
  | { type: "idle"; canceled?: boolean }
>;

// We expect these to drift over time. A single user intent might need to
// turn into multiple MPD commands (for example)
export type MpdCommand = UserIntent;
export type MpdCommandString =
  | "pause"
  | "stop"
  | "next"
  | "previous"
  | "idle"
  | `setvol ${number}`;
