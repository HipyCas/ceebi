import * as components from './components';
import type { App } from 'vue';
import { modalController } from '@ionic/vue';
import { encode } from 'js-base64';
import type { Logger } from '@code/logger';
import { Directory, Filesystem } from '@capacitor/filesystem';
import { Share } from '@capacitor/share';
import type { ShareOptions } from '@capacitor/share';
import type { Analytics } from 'firebase/analytics';
import { stringify } from 'flatted';

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
  analytics?: Analytics
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
  shareOptions?: ShareOptions
) => {
  const data = encode(
    logger.stream
      .map(
        (log) =>
          `${log.time.toISOString()};${log.level};${log.scope};${stringify(
            log.parts
          )}`
      )
      .join('\n')
  );
  const file = await Filesystem.writeFile({
    path: `${exportFileName}.log`,
    data,
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
