<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true" class="ion-padding">
      <NoConnection v-if="!connected && !haveCachedNews">
        <template
          style="display: flex; flex-direction: column; align-items: center"
        >
          {{ $t('news.connectAtLeastOnce') }}
          <ion-button @click="openMore('offline')">
            <!-- TODO Translate -->
            {{ $t('news.moreOnWeb') }}
            <ion-icon
              slot="end"
              :md="openOutline"
              :ios="openOutline"
            ></ion-icon>
          </ion-button>
        </template>
      </NoConnection>
      <template v-else>
        <div v-if="loaded">
          <ion-refresher slot="fixed" @ionRefresh="refreshNews($event)">
            <ion-refresher-content></ion-refresher-content>
          </ion-refresher>
          <div
            class="ion-margin-bottom ion-padding-vertical new"
            v-for="_new in news"
            :key="_new.title"
          >
            <strong>{{ _new.title }}</strong>
            <ion-text color="medium" class="clamp-3">{{
              _new.excerpt || ''
            }}</ion-text>
            <ion-button fill="clear" @click="open(_new)"
              >{{ $t('news.readMore') }}
              <ion-icon :icon="openOutline" slot="end"></ion-icon>
            </ion-button>
          </div>
          <div class="flex-center">
            <ion-button @click="openMore('end')">
              {{ $t('news.moreOnWeb') }}
              <ion-icon
                slot="end"
                :md="openOutline"
                :ios="openOutline"
              ></ion-icon>
            </ion-button>
          </div>
        </div>
        <div v-if="!loaded">
          <div
            class="ion-margin-bottom ion-padding-vertical new"
            v-for="i in 5"
            :key="i"
          >
            <ion-skeleton-text
              animated
              style="width: 100%; margin-bottom: 0.75em"
            ></ion-skeleton-text
            ><br />
            <ion-skeleton-text
              animated
              :style="{ width: randWidth() }"
            ></ion-skeleton-text>
            <ion-skeleton-text
              animated
              :style="{ width: randWidth() }"
            ></ion-skeleton-text>
            <ion-skeleton-text
              animated
              :style="{ width: randWidth() }"
            ></ion-skeleton-text>
            <ion-button fill="clear"
              ><ion-skeleton-text
                animated
                style="width: 5em"
              ></ion-skeleton-text>
            </ion-button>
          </div>
        </div>
      </template>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import {
  IonPage,
  IonContent,
  IonText,
  IonButton,
  IonIcon,
  IonSkeletonText,
  IonRefresher,
  IonRefresherContent,
} from '@ionic/vue';
import {
  openOutline,
  cloudOfflineOutline,
  cloudDownloadOutline,
} from 'ionicons/icons';
import Header from '../components/Header.vue';
import NoConnection from '../components/NoConnection.vue';

import { Encoding } from '@capacitor/filesystem';
import { useI18n } from 'vue-i18n';
import { wpapi } from '../req';
import { extractContent } from '../util';
import type { Post, PostRawShortenedReq } from '../types';
import { logEvent } from 'firebase/analytics';
import { analytics, performance } from '../firebase';
import { trace } from 'firebase/performance';
import { logCatchError } from '@code/capacitor-utils';

type Item = Post;

const { t } = useI18n();
const logger = useLogger();

/** Load news from cache file */
async function loadNews(finished: Ref<boolean>, toStore: Ref<Item[]>) {
  const loadTrace = trace(performance, 'load_news');
  loadTrace.putMetric('total', toStore.value.length);
  loadTrace.putAttribute('total', toStore.value.length.toString());
  loadTrace.start();

  finished.value = false;
  const { data } = await Filesystem.readFile({
    directory: Directory.Cache,
    path: 'news.json',
    encoding: Encoding.UTF8,
  });
  toStore.value = JSON.parse(data);
  finished.value = true;

  loadTrace.stop();
}

async function getNews(finished: Ref<boolean>, toStore: Ref<Item[]>) {
  finished.value = false;

  // Suggest to load news from cache if it takes too long
  const suggestCache = () => {
    if (!finished.value) {
      useToast({
        message: t('news.loadedOffline'),
        icon: cloudDownloadOutline,
      });
      loadNews(finished, toStore);
    }
  };
  setTimeout(suggestCache, 5000); //* Increased after ceebi-15

  const fetchTrace = trace(performance, 'fetch_news');
  fetchTrace.start();

  try {
    const res = (await wpapi
      .get('wp/v2/posts', {
        searchParams: {
          _fields: 'id,title,excerpt,link',
        },
        throwHttpErrors: true,
      })
      .json()) as PostRawShortenedReq[];

    fetchTrace.putMetric('total', res.length);
    fetchTrace.putAttribute('total', res.length.toString());
    fetchTrace.stop();

    logger.trace('news:getNews', `loaded ${res.length} news from server`, {
      news: res,
    });

    toStore.value = res.map((it) => ({
      ...it,
      title: it.title.rendered.replace(/(&#8220;)|(&#8221)/g, '"'),
      excerpt: extractContent(
        it.excerpt.rendered.replace(
          `<span class="screen-reader-text">${it.title.rendered}</span> Leer más »`,
          '',
        ),
      ),
    }));

    finished.value = true;

    logger.trace('news:getNews', 'saving to cache news', toStore.value);
    const saveNews = trace(performance, 'save_news');
    saveNews.start();
    Filesystem.writeFile({
      directory: Directory.Cache,
      path: 'news.json',
      recursive: true,
      data: JSON.stringify(toStore.value),
      encoding: Encoding.UTF8,
    }).catch(() => saveNews.stop());
  } catch (e) {
    logCatchError(
      logger,
      'news:getNews',
      'error when getting and saving news from the server',
      e,
    );
  }
}

const news: Ref<Item[]> = ref([]);
const loaded = ref(false);

const connected = ref(true);
const haveCachedNews = ref(false);
(async () => {
  const status = await Network.getStatus();
  connected.value = status.connected;
  if (connected.value) {
    getNews(loaded, news);
    haveCachedNews.value = true;
  } else {
    try {
      await Filesystem.stat({
        path: 'news.json',
        directory: Directory.Cache,
      });
      haveCachedNews.value = true;
      loadNews(loaded, news);
    } catch (e) {
      haveCachedNews.value = false;
    }
  }
})();
Network.addListener('networkStatusChange', (status) => {
  connected.value = status.connected;
  if (status.connected) getNews(loaded, news); // TODO Something here raises an error: Uncaught (in promise) Error: File does not exist. -> Ok, I think I don't have to fix it and my problem was CORS
  //* I don't actually need to reload the news from cache if user goes offline, they should already be loaded
});

const refreshNews = (event: any) => {
  setTimeout(() => {
    event.target.complete();
  }, 5000);
  (async () => {
    if (connected.value) await getNews(loaded, news);
    else
      useToast({
        message: t('news.cannotRefreshOffline'),
        icon: cloudOfflineOutline,
      });
  })();
};

function open(_new: Post) {
  logEvent(analytics, `open_noticias_${_new.title}`);
  Browser.open({
    url: _new.link,
    presentationStyle: 'popover',
  });
}

function openMore(where: string) {
  logEvent(analytics, `open_noticias_mas_${where}`);
  Browser.open({
    url: 'https://biociencias.es/noticias/',
    presentationStyle: 'popover',
  });
}

const randWidth = () => `${Math.floor(Math.random() * (90 - 75) + 75)}%`;
</script>

<style scoped>
.new {
  display: flex !important;
  flex-direction: column !important;
  justify-content: center;
  align-items: flex-start;
  background-color: var(--ion-item-background);
  padding: 1em;
  gap: 0.1em;
  border-radius: 5px;
  box-shadow: 0 0px 10px -3px rgba(55, 55, 55, 0.5);
}

.clamp-3 {
  font-size: 0.8em;
  display: -webkit-box;
  -webkit-line-clamp: 3;
  -webkit-box-orient: vertical;
  overflow: hidden;
}

.flex-center {
  display: flex;
  width: 100%;
  align-items: center;
  justify-content: center;
  margin: 2rem 0 1rem 0;
}
</style>
