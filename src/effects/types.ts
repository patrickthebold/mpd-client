import { type State } from "../state";

export type Effect = (state: State) => State;
