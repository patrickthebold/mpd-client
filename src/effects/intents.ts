import { List } from "immutable";
import { type MpdCommand, command2String, intent2Commands } from "../intents";
import type { Effect } from "./types";
import type { ConnectedState, PlayerStatusProps, State } from "../state";

export const sendCommands: Effect = (state) => {
  if (
    state.websocketStatus === "connected" &&
    state.sentCommands.isEmpty() &&
    !state.pendingIntents.isEmpty()
  ) {
    const commands = state.pendingIntents.flatMap(intent2Commands);
    const commandList = commands.map(command2String).join("\n");
    const isCommandList = commands.size > 1;
    const fullCommand = isCommandList
      ? `command_list_ok_begin\n${commandList}\ncommand_list_end\n`
      : commandList;
    state.ws.send(fullCommand);

    return state
      .set("sentCommands", commands)
      .set("isCommandList", isCommandList)
      .set("pendingIntents", List());
  }
  return state;
};

export const handleResponseData: Effect = (state, now) => {
  if (state.websocketStatus === "connected") {
    const maybeCommand = state.sentCommands.first();
    if (maybeCommand) {
      return responseHandlers[maybeCommand.type](state, now);
    }
  }
  return state;
};

/** This is a common case where hand handler needs all of the
 *  data in the response to do anything
 */
type FullResponseHandler = (
  state: ConnectedState,
  response: List<string>,
  command: MpdCommand
) => State;

const liftFullResponseHandler =
  (handler: FullResponseHandler): Effect =>
  (state) => {
    if (state.websocketStatus !== "connected" || state.sentCommands.isEmpty()) {
      return state;
    }
    const isCommandList = state.isCommandList;
    const maybeOkIndex = state.responseData.findIndex(
      (value) => value === (isCommandList ? "list_OK" : "OK")
    );
    if (maybeOkIndex === -1) {
      return state;
    }
    const skipIndex =
      isCommandList && state.responseData.get(maybeOkIndex + 1) === "OK"
        ? maybeOkIndex + 2
        : maybeOkIndex + 1;
    const shiftedState = state
      .update("responseData", (data) => data.skip(skipIndex))
      .update("sentCommands", (commands) => commands.shift());
    return handler(
      shiftedState,
      state.responseData.take(maybeOkIndex),
      state.sentCommands.first()
    );
  };

const responseHandlers: Record<MpdCommand["type"], Effect> = {
  pause: liftFullResponseHandler((state) =>
    state.updateIn(["player", "state"], (status): PlayerStatusProps["state"] =>
      status === "pause" ? "play" : status === "play" ? "pause" : "stop"
    )
  ),
  stop: liftFullResponseHandler((state) =>
    state.updateIn(
      ["player", "state"],
      (): PlayerStatusProps["state"] => "stop"
    )
  ),
  next_track: liftFullResponseHandler((state) =>
    state.updateIn(
      ["player", "currentTrack"],
      (i): PlayerStatusProps["currentTrack"] =>
        ((i as number) + 1) % state.q.size
    )
  ),
  set_volume: liftFullResponseHandler((state, _, command) =>
    command.type !== "set_volume"
      ? state
      : state.updateIn(
          ["player", "volume"],
          (): PlayerStatusProps["volume"] => command.volume
        )
  ),
  previous_track: liftFullResponseHandler((state) =>
    state.updateIn(
      ["player", "currentTrack"],
      (i): PlayerStatusProps["currentTrack"] =>
        ((i as number) - 1 + state.q.size) % state.q.size
    )
  ),
};