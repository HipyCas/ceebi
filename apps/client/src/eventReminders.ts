const eventRemindersOn = ref(false);
const eventRemindersTime = ref(15);

export const useEventReminders = () =>
  [eventRemindersOn, eventRemindersTime] as [
    typeof eventRemindersOn,
    typeof eventRemindersTime
  ];

export const setEventReminders = ({
  on,
  time,
}: {
  on?: boolean;
  time?: number;
}) => {
  if (on !== undefined) eventRemindersOn.value = on;
  if (time !== undefined) eventRemindersTime.value = time;
};
