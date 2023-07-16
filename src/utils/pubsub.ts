import PubSub from "@redchili/pubsub";
import { FieldStateType, ValuesType } from "../types";

interface EventType {
  reset: undefined;
  change: ValuesType;
  onValueChange: { key: string; data: { value: any } };
  setState: { key: string; fieldState: FieldStateType };
  show: string;
  hide: string;
  verify: ValuesType;
}

const pubsub = new PubSub<EventType>();

export default pubsub;
