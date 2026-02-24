import { EventObject } from "./utils";

export interface RoadhogMessage {
  msg: string;
  time: number;
}

export const onRoadhogJump = new EventObject<void>()
export const onRoadhogMessage = new EventObject<RoadhogMessage>()
export const onStopMessage = new EventObject<void>()

