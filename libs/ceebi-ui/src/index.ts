import * as components from './components';
import type { App } from 'vue';
import { modalController } from '@ionic/vue';
import type { Logger } from '@code/logger';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import type { ShareOptions } from '@capacitor/share';
import type { Analytics } from 'firebase/analytics';
import { Packr } from 'msgpackr';
import { fromUint8Array } from 'js-base64';

export default {
  install(vue: App) {
    //@ts-expect-error cannot infer components is a vue component array
    for (const component of components) {
      vue.component('ceebiui-' + component.name, component);
    }
  },
};

export type NotificationContents = {
  id: number;
  title: string;
  shortname?: string;
  body: string;
  schedule: Date;
  ionIcon: string;
  buttons: Array<{
    icon: string;
    text: string;
    shortname?: string;
    ionIcon: string;
    link: string;
  }>;
};

export const showNotification = async (
  notification: NotificationContents,
  analytics?: Analytics,
) => {
  // TODO Error handling
  // const { data } = await supabase
  //   .from('notifications')
  //   .select('*')
  //   .eq('id', notificationId)
  //   .single();
  const modal = await modalController.create({
    component: components.NotificationModal,
    breakpoints: [0, 0.45, 0.65, 1],
    initialBreakpoint: 0.45,
    componentProps: {
      notification,
      analytics,
    },
  });
  modal.present();
  return modal;
};

export const shareLogs = async (
  logger: Logger,
  exportFileName: string,
  shareOptions?: ShareOptions,
) => {
  const msg = new Packr({ structuredClone: true }).pack(logger.stream);
  // .toString('base64');
  // const str = new Uint8Array(msg).reduce((str, byte) => str + byte.toString(2).padStart(8, '0'), '');
  // const data = btoa(str)
  const file = await Filesystem.writeFile({
    path: `${exportFileName}.log`,
    data: fromUint8Array(msg),
    directory: Directory.Cache,
  });
  Share.share({
    dialogTitle: 'Logs export',
    files: [file.uri],
    ...shareOptions,
  });
};

export * from './components';
export * from './composables';
