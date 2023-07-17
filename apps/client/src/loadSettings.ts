import { setEventReminders } from './eventReminders';
import { setTranslateSchedule } from './translateSchedule';
import {
  KEY_EVENTS_NOTIFICATIONS,
  KEY_EVENTS_NOTIFICATIONS_TIME,
  KEY_TRANSLATE_SCHEDULE,
} from './vars';

export default async () => {
  // Load translateSchedule
  const { value: translateSchedule } = await Preferences.get({
    key: KEY_TRANSLATE_SCHEDULE,
  });
  if (translateSchedule && translateSchedule === 'true')
    setTranslateSchedule(true);

  const { value: eventRemindersOn } = await Preferences.get({
    key: KEY_EVENTS_NOTIFICATIONS,
  });
  if (eventRemindersOn && /(true|false);(true|false)/m.test(eventRemindersOn)) {
    const split = eventRemindersOn.split(';');
    setEventReminders({ on: split[0] === 'true' });
    const { value: eventRemindersTime } = await Preferences.get({
      key: KEY_EVENTS_NOTIFICATIONS_TIME,
    });
    if (eventRemindersTime)
      setEventReminders({ time: Number.parseInt(eventRemindersTime) });
  }
};
