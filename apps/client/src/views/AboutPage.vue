<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <section
        class="flex-row title"
        style="background: var(--ion-color-primary-tint)"
      >
        <b>{{ $t('about.patron') }}</b>
      </section>

      <template v-if="mecenasPlatino.length > 0">
        <section class="flex-row title" style="background: #e5e4e2">
          🏆 &nbsp;&nbsp; {{ $t('about.platinum') }} &nbsp;&nbsp; 🏆
        </section>
        <div class="flex-row ion-padding images-container">
          <img
            v-for="platino in mecenasPlatino"
            :key="platino.name"
            class="img-link"
            :src="platino.src"
            :alt="platino.name"
            height="100"
            @click="openMecena(platino)"
          />
        </div>
      </template>

      <template v-if="mecenasOro.length > 0">
        <section class="flex-row title" style="background: #d6ac39">
          🥇 &nbsp;&nbsp; {{ $t('about.gold') }} &nbsp;&nbsp; 🥇
        </section>
        <div class="flex-row ion-padding images-container">
          <img
            v-for="oro in mecenasOro"
            :key="oro.name"
            class="colaborador-bronce img-link silver-smaller-link"
            :src="oro.src"
            :alt="oro.name"
            @click="openMecena(oro)"
          />
        </div>
      </template>

      <template v-if="mecenasPlata.length > 0">
        <section class="flex-row title" style="background: #bab7b2">
          🥈 &nbsp;&nbsp; {{ $t('about.silver') }} &nbsp;&nbsp; 🥈
        </section>
        <div class="flex-row ion-padding images-container">
          <template v-for="plata in mecenasPlata" :key="plata.name">
            <img
              class="colaborador-bronce img-link silver-smaller-link"
              :src="plata.src"
              :alt="plata.name"
              @click="openMecena(plata)"
            />
          </template>
        </div>
      </template>

      <template v-if="mecenasBronce.length > 0">
        <section class="flex-row title" style="background: #cd7f32">
          🥉 &nbsp;&nbsp; {{ $t('about.bronze') }} &nbsp;&nbsp; 🥉
        </section>
        <div class="flex-row ion-padding images-container">
          <template v-for="bronce in mecenasBronce" :key="bronce.name">
            <img
              class="colaborador-bronce img-link silver-smaller-link"
              :src="bronce.src"
              :alt="bronce.name"
              @click="openMecena(bronce)"
            />
          </template>
        </div>
      </template>

      <template v-if="mecenasColaborador.length > 0">
        <section
          class="flex-row title"
          style="background: var(--ion-color-secondary-tint)"
        >
          <b>{{ $t('about.collaborators') }}</b>
        </section>
        <div class="flex-row ion-padding images-container">
          <template
            v-for="colaborador in mecenasColaborador"
            :key="colaborador.name"
          >
            <img
              class="colaborador-bronce img-link silver-smaller-link"
              :src="colaborador.src"
              :alt="colaborador.name"
              @click="openMecena(colaborador)"
            />
          </template>
        </div>
      </template>

      <div class="flex-row ion-margin-top">
        <p>
          {{ $t('about.developedBy') }}
          <strong>Lucas de Uña Ocampo</strong>
        </p>
      </div>
      <div class="flex-row ion-margin-bottom">
        <ion-button
          color="secondary"
          @click="open('https://github.com/HipyCas/', 'personal_profile')"
        >
          {{ $t('about.aboutMe') }}
          <ion-icon slot="start" :md="planet" :ios="planet"></ion-icon>
        </ion-button>
        <ion-button
          fill="outline"
          color="secondary"
          @click="
            open('https://github.com/biocienciasgrx/ceebi/', 'source_code')
          "
        >
          {{ $t('about.sourceCode') }}
          <ion-icon slot="start" :md="logoGithub" :ios="logoGithub"></ion-icon>
        </ion-button>
      </div>
    </ion-content>
  </ion-page>
</template>

<script setup lang="ts">
import { IonPage, IonContent, IonButton, IonIcon } from '@ionic/vue';
import Header from '../components/Header.vue';
// import { trophy } from "ionicons/icons";

import { Filesystem, Directory, Encoding } from '@capacitor/filesystem';
import { Capacitor } from '@capacitor/core';

import { logoGithub, planet } from 'ionicons/icons';
import { wpapi } from '../wpapi';
import { extractContent } from '../util';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';
import { CapacitorHttp } from '@capacitor/core';

import { logCatchError } from '@code/capacitor-utils';
import { logEvent } from 'firebase/analytics';
import { analytics } from '../firebase';

// TODO Show error toast in case images don't load (there is a translation for that)

const logger = useLogger();

interface Mecena {
  name: string;
  src: string;
  category: 'Platino' | 'Plata' | 'Oro' | 'Bronce' | 'Colaborador';
  site: string;
}

interface MediaItem {
  id: number;
  date: string;
  date_gmt: string;
  link: string;
  title: {
    rendered: string; // Text
  };
  description: {
    rendered: string; // HTML
  };
  alt_text: string; // Text
  source_url: string;
}

const dbg: <T>(msg: string, content: T) => T = (msg: string, content) => {
  console.log(msg, content);
  return content;
};

const parsed = ref([] as Mecena[]);

(async () => {
  let dirExisted;
  try {
    await Filesystem.mkdir({
      directory: Directory.Cache,
      path: 'ceebi-mecenas-cache',
    });
    dirExisted = false;
  } catch (e) {
    dirExisted = true;
  }

  let cacheExists = true;
  try {
    await Filesystem.readFile({
      directory: Directory.Cache,
      path: 'ceebi-mecenas-cache/__cap_cache_datetime.txt',
      encoding: Encoding.UTF8,
    });
  } catch (e) {
    cacheExists = false;
  }

  let lastFetchDate = undefined;
  if (cacheExists) {
    logger.trace(
      'about:mainAsync',
      'loading date cache file:',
      'ceebi-mecenas-cache/__cap_cache_datetime.txt'
    );
    const cacheDateFile = await Filesystem.readFile({
      directory: Directory.Cache,
      path: 'ceebi-mecenas-cache/__cap_cache_datetime.txt',
      encoding: Encoding.UTF8,
    });
    logger.info('about:mainAsync', 'loaded last update date from cache', {
      file: cacheDateFile,
      data: cacheDateFile.data,
      date: parseISO(cacheDateFile.data),
    });
    if (cacheDateFile.data) {
      const d = parseISO(cacheDateFile.data);
      if (d instanceof Date && !isNaN(d)) lastFetchDate = d;
      else cacheExists = false;
    }
  }

  let cacheData;
  if (cacheExists) {
    try {
      const cacheDataFile = await Filesystem.readFile({
        directory: Directory.Cache,
        path: 'ceebi-mecenas-cache/__cap_cache_data.json',
        encoding: Encoding.UTF8,
      });
      cacheData = JSON.parse(cacheDataFile.data) as Mecena[];
      logger.info('about:mainAsync', 'loaded cached JSON data', {
        file: cacheDataFile,
        data: cacheData,
      });
      parsed.value = parsed.value.concat(cacheData);
    } catch (e) {
      logger.error(
        'about:mainAsync',
        'error when loading cache data from',
        'ceebi-mecenas-cache/__cap_cache_data.json',
        { error: e, lastFetchDate, cacheExists, dirExisted }
      );
      logCatchError(
        logger,
        'about:mainAsync',
        'error when loading cache data from ceebi-mecenas-cache/__cap_cache_data.json',
        e,
        false
      );
      lastFetchDate = undefined;
      cacheExists = false;
    }
  }

  const searchParams: Record<string, string | number> = {
    per_page: 100,
    search: 'Mecenas',
  };
  if (lastFetchDate !== undefined) {
    searchParams['modified_after'] = formatISO(lastFetchDate);
  }

  const raw = await wpapi
    .get('wp/v2/media', {
      searchParams,
    })
    .json<MediaItem[]>();
  logger.trace('auth:mainAsync', 'requested media, response', raw, {
    endpoint: 'wp/v2/media',
    searchParams,
  });
  const _this_parsed = raw
    .filter((media) =>
      dbg(
        'MEDIA> to extracted',
        extractContent(dbg('MEDIA> to extract', media.description.rendered))
      )
        .trim()
        .startsWith('=Mecenas= ')
    )
    .map((media) => {
      const matches =
        /=Mecenas= =(?<category>(Bronce|Colaborador|Oro|Plata|Platino))= =(?<site>.+)=/gim.exec(
          extractContent(media.description.rendered).trim()
        )?.groups;
      return dbg('MEDIA > map', {
        name: media.alt_text,
        src: media.source_url,
        ...matches,
      });
    });
  parsed.value = parsed.value.concat(_this_parsed);
  logger.info('about:mainAsync', 'loaded new mecenas from web', _this_parsed);
  saveToCache(cacheExists, _this_parsed, cacheData);
})();

function saveToCache(
  cacheExists: boolean,
  newData: Mecena[],
  cacheData?: Mecena[]
) {
  logger.info('about:saveToCache', 'saving new mecenas to cache', {
    cacheExists,
    newData,
    cacheData,
  });
  const loaded = Array.from(Array(newData.length), () => false);
  newData.forEach(async (mecena, index) => {
    logger.trace('about:saveToCache', 'caching mecena', mecena);
    let imageRes;
    try {
      // imageRes = await fetch(mecena.src);
      imageRes = await CapacitorHttp.get({
        url: mecena.src,
        responseType: 'blob',
      });
    } catch (error) {
      logger.error(
        'about:saveToCache',
        'error fetching mecena img',
        mecena.name,
        (error as unknown & { toString: () => string }).toString(),
        {
          error,
        }
      );
      logCatchError(
        logger,
        'about:saveToCache',
        'error fetching mecena img',
        error,
        false
      );
      return;
    }
    let imageBlob: string;
    try {
      imageBlob = await imageRes.data;
    } catch (error) {
      logger.error(
        'about:saveToCache',
        'error getting blob of image for',
        mecena.name,
        (error as unknown & { toString: () => string }).toString(),
        {
          error,
        }
      );
      logCatchError(
        logger,
        'about:saveToCache',
        'error getting blob of image for',
        error,
        false
      );
      return;
    }
    logger.trace(
      'about:saveToCache',
      'obtained image blob from mecena',
      mecena.name,
      'data:image/' + mecena.src.split('.').at(-1) + ';base64,' + imageBlob,
      {
        blob: imageBlob,
        type: typeof imageBlob,
        // instanceof: imageBlob instanceof Blob,
      }
    );
    try {
      // const reader = new FileReader();
      // reader.onload = async () => {
      const dataUri =
        'data:image/' + mecena.src.split('.').at(-1) + ';base64,' + imageBlob;
      logger.trace(
        'about:saveToCache',
        'obtained image as data URL for mecena',
        mecena.name,
        dataUri
      );
      const newFile = await Filesystem.writeFile({
        directory: Directory.Cache,
        path: `ceebi-mecenas-cache/${mecena.src.replace(/\//g, '-')}`,
        data: dataUri as string,
      });
      const webViewSrc = Capacitor.convertFileSrc(newFile.uri);
      // FIXME in the web breaks, but locally it may work
      parsed.value[index]['src'] = webViewSrc;
      loaded[index] = true;
      logger.trace('about:saveToCache', 'cached mecena', mecena, {
        webViewSrc,
        loaded: loaded[index],
        cacheFile: newFile,
      });
      // };
      // reader.readAsDataURL(new Blob(imageBlob));
    } catch (error) {
      logger.error(
        'about:saveToCache',
        'error when saving mecena',
        mecena,
        (error as unknown & { toString: () => string }).toString(),
        {
          error,
        }
      );
      logCatchError(
        logger,
        'about:saveToCache',
        'error when saving mecena',
        error,
        false
      );
    }
  });

  Filesystem.writeFile({
    directory: Directory.Cache,
    path: 'ceebi-mecenas-cache/__cap_cache_datetime.txt',
    encoding: Encoding.UTF8,
    data: formatISO(new Date()),
  });
  const handler = setInterval(() => {
    if (loaded.every((bool) => bool)) {
      Filesystem.writeFile({
        directory: Directory.Cache,
        path: 'ceebi-mecenas-cache/__cap_cache_data.json',
        encoding: Encoding.UTF8,
        data: JSON.stringify(parsed.value),
      });
      clearInterval(handler);
    }
  }, 500);
}

const mecenasPlatino = computed(() =>
  parsed.value.filter((p) => p.category === 'Platino')
);
const mecenasOro = computed(() =>
  parsed.value.filter((p) => p.category === 'Oro')
);
const mecenasPlata = computed(() =>
  parsed.value.filter((p) => p.category === 'Plata')
);
const mecenasBronce = computed(() =>
  parsed.value.filter((p) => p.category === 'Bronce')
);
const mecenasColaborador = computed(() =>
  parsed.value.filter((p) => p.category === 'Colaborador')
);

const open = (url: string, msg: string) => {
  logEvent(analytics, `open_${msg}`);
  window.location.href = url;
};

const openMecena = (mecena: Mecena) => {
  logEvent(analytics, 'open_mecena_' + mecena.name.replace(/ \//g, '_'));
  Browser.open({
    url: mecena.site,
    presentationStyle: 'popover',
  });
};
</script>

<style scoped>
.flex-row {
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;
  gap: 1em;
  text-align: center;
}

.title {
  padding: 1em;
  color: #111;
}

.img-link {
  color: var(--ion-color-primary-shade);
}

.silver-smaller-link {
  max-width: 50%;
}

.colaborador-plata {
  max-height: 70px;
}

.colaborador-bronce {
  max-height: 40px;
}

.images-container {
  background-color: #fff;
}
</style>
