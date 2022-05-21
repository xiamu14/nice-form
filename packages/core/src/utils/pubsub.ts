import PubSub from "@redchili/pubsub";
import { FieldStateType } from "../types";

interface EventType {
  reset: undefined;
  change: Record<string, any>;
  onValueChange: { key: string; data: { value: any } };
  setState: { key: string; fieldState: FieldStateType };
  show: string;
  hide: string;
  verify: Record<string, any>;
}

const pubsub = new PubSub<EventType>();

export default pubsub;
