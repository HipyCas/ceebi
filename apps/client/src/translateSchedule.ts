const translateSchedule = ref(false);

export const getTranslateSchedule = () => translateSchedule;

export const setTranslateSchedule = (val: boolean) =>
  (translateSchedule.value = val);
