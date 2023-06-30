import * as components from './components';
import type { App } from 'vue';
import type { Database } from '@code/supabase';
import type { createClient } from '@supabase/supabase-js';
import { modalController } from '@ionic/vue';

export default {
  install(vue: App) {
    //@ts-expect-error cannot infer components is a vue component array
    for (const component of components) {
      vue.component('ceebiui-' + component.name, component);
    }
  },
};

export const showNotification = async (
  supabase: ReturnType<typeof createClient<Database>>,
  notificationId: number
) => {
  // TODO Error handling
  const { data } = await supabase
    .from('notifications')
    .select('*')
    .eq('id', notificationId)
    .single();
  const modal = await modalController.create({
    component: components.NotificationModal,
    breakpoints: [0, 0.45, 0.65, 1],
    initialBreakpoint: 0.45,
    componentProps: {
      notification: {
        ...data,
        schedule: new Date(data?.schedule || Date.now()),
      },
    },
  });
  modal.present();
  return modal;
};

export * from './components';
export * from './composables';
