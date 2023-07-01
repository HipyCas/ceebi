import { setTranslateSchedule } from './translateSchedule';
import { KEY_TRANSLATE_SCHEDULE } from './vars';

export default async () => {
  // Load translateSchedule
  const { value: translateSchedule } = await Preferences.get({
    key: KEY_TRANSLATE_SCHEDULE,
  });
  if (translateSchedule && translateSchedule === 'true')
    setTranslateSchedule(true);
};
