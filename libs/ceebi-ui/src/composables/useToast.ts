import { toastController } from '@ionic/vue';
import type { ToastOptions } from '@ionic/vue';
import { Haptics } from '@capacitor/haptics';
import { ImpactStyle } from '@capacitor/haptics';

export const useToast = async (
  options: ToastOptions,
  impactStyle?: ImpactStyle
) => {
  const toast = await toastController.create({
    duration: 2000,
    cssClass: 'ceebi-toast',
    // TODO Add offset according to tab bar
    ...options,
  });
  Haptics.impact({
    style: impactStyle ?? ImpactStyle.Light,
  });
  toast.present();
  return toast;
};
