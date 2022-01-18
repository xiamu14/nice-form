import OnFire from "onfire.js";

const onFire = new OnFire();

const pubSub = {
  clearAllSubscriptions: () => {
    onFire.off();
  },
  subscribe: (event: string, callback: (data?: any) => void) => {
    onFire.on(event, callback);
  },
  publish: (event: string, data?: any) => {
    onFire.fire(event, data);
  },
};

export default pubSub;
