import { makeDisconnectedState, makePlayerStatus } from "./state";

describe("makeDisconnectedState", () => {
  it("should allow player Status to be set", () => {
    let state = makeDisconnectedState();
    const playerStatus = makePlayerStatus({
      currentTrack: 0,
      trackPosition: 0,
      volume: 0,
      state: "pause",
    });
    state = state.set("player", playerStatus);
    expect(state.player).toBe(playerStatus);
  });
});
