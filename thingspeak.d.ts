declare namespace TSC {
  export interface TSCKeys {
    writeKey: any;
    readKey: any;
  }
  export class ThingSpeakClient {
    constructor(opts: any);
    attachChannel(channelId: number, keys: TSCKeys, callback: Function): void;
  }
}

declare module 'thingspeakclient' {
  import ThingSpeakClient = TSC.ThingSpeakClient;
  export = ThingSpeakClient;
}
