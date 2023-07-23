import { type SongId, makeDisconnectedState, makePlayerStatus } from "./state";

describe("makeCDisconnectedState", () => {
  it("should allow player Status to be set", () => {
    let state = makeDisconnectedState();
    const playerStatus = makePlayerStatus({
      currentTrack: "" as SongId,
      trackPosition: 0,
      volume: 0,
      state: "pause",
    });
    state = state.set("player", playerStatus);
    expect(state.player).toBe(playerStatus);
  });
});
