declare module 'attendance.json' {
  interface Session {
    name: string;
    hasEvents: boolean;
    hours: number;
    events: Array<string>;
    eventHours: Array<number>;
  }

  const attendance: Array<Session>;
  export default attendance;
}
