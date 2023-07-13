<template>
  <ion-page>
    <Header />
    <ion-content :fullscreen="true">
      <section
        class="flex-row title"
        style="background: var(--ion-color-primary-tint)"
      >
        <b>{{ $t('message.patron') }}</b>
      </section>
      <template v-if="mecenasPlatino.length > 0">
        <section class="flex-row title" style="background: #e5e4e2">
          🏆 &nbsp;&nbsp; {{ $t('message.platinum') }} &nbsp;&nbsp; 🏆
        </section>
        <div class="flex-row ion-padding images-container">
          <template v-for="platino in mecenasPlatino" :key="platino.name">
            <a class="img-link" :href="platino.site">
              <img :src="platino.src" :alt="platino.name" height="100" />
            </a>
          </template>
        </div>
      </template>
      <!--div class="flex-row ion-padding images-container">
        <template v-for="platino in mecenas.platino">
          <a
            class="img-link"
            v-if="imagesLoaded"
            :key="platino.nombre"
            :href="platino.web"
          >
            <img :src="platino.img" :alt="platino.nombre" height="100" />
          </a>
        </template>
      </!--div-->

      <template v-if="mecenasOro.length > 0">
        <section class="flex-row title" style="background: #d6ac39">
          🥇 &nbsp;&nbsp; {{ $t('message.gold') }} &nbsp;&nbsp; 🥇
        </section>
        <!--div-- class="flex-row ion-padding images-container">
          <template v-for="oro in mecenasOro">
            <a
              class="img-link"
              v-if="imagesLoaded"
              :key="oro.nombre"
              :href="oro.web"
            >
              <img :src="oro.img" :alt="oro.nombre" height="100" />
            </a>
          </template>
        </!--div-->
        <div class="flex-row ion-padding images-container">
          <a
            v-for="oro in mecenasOro"
            :key="oro.name"
            class="img-link silver-smaller-link"
            :href="oro.site"
          >
            <img class="colaborador-bronce" :src="oro.src" :alt="oro.name" />
          </a>
        </div>
      </template>
      <template v-if="mecenasPlata.length > 0">
        <section class="flex-row title" style="background: #bab7b2">
          🥈 &nbsp;&nbsp; {{ $t('message.silver') }} &nbsp;&nbsp; 🥈
        </section>
        <!--div-- class="flex-row ion-padding images-container">
          <template v-for="plata in mecenas.plata">
            <a
              class="img-link silver-smaller-link"
              v-if="imagesLoaded"
              :key="plata.nombre"
              :href="plata.web"
            >
              <img
                class="colaborador-plata"
                :src="plata.img"
                :alt="plata.nombre"
              />
            </a>
          </template>
        </!--div-->
        <div class="flex-row ion-padding images-container">
          <template v-for="plata in mecenasPlata" :key="plata.name">
            <a class="img-link silver-smaller-link" :href="plata.site">
              <img
                class="colaborador-bronce"
                :src="plata.src"
                :alt="plata.name"
              />
            </a>
          </template>
        </div>
      </template>
      <template v-if="mecenasBronce.length > 0">
        <section class="flex-row title" style="background: #cd7f32">
          🥉 &nbsp;&nbsp; {{ $t('message.bronze') }} &nbsp;&nbsp; 🥉
        </section>
        <!--div-- class="flex-row ion-padding images-container">
          <template v-for="bronce in mecenas.bronce">
            <a
              class="img-link silver-smaller-link"
              v-if="imagesLoaded"
              :href="bronce.web"
              :key="bronce.nombre"
            >
              <img
                class="colaborador-bronce"
                :src="bronce.img"
                :alt="bronce.nombre"
              />
            </a>
          </template>
        </!--div-->
        <div class="flex-row ion-padding images-container">
          <template v-for="bronce in mecenasBronce" :key="bronce.name">
            <a class="img-link silver-smaller-link" :href="bronce.site">
              <img
                class="colaborador-bronce"
                :src="bronce.src"
                :alt="bronce.name"
              />
            </a>
          </template>
        </div>
      </template>

      <template v-if="mecenasColaborador.length > 0">
        <section
          class="flex-row title"
          style="background: var(--ion-color-secondary-tint)"
        >
          <b>{{ $t('message.collaborators') }}</b>
        </section>
        <div class="flex-row ion-padding images-container">
          <template
            v-for="colaborador in mecenasColaborador"
            :key="colaborador.name"
          >
            <a class="img-link silver-smaller-link" :href="colaborador.site">
              <img
                class="colaborador-bronce"
                :src="colaborador.src"
                :alt="colaborador.name"
              />
            </a>
          </template>
        </div>
      </template>
      <!--div-- class="flex-row ion-padding images-container">
        <template v-for="colaborador in mecenas.colaborador">
          <a
            class="img-link silver-smaller-link"
            v-if="imagesLoaded"
            :href="colaborador.web"
            :key="colaborador.nombre"
          >
            <img
              class="colaborador-bronce"
              :src="colaborador.img"
              :alt="colaborador.nombre"
            />
          </a>
        </template>
      </!--div-->

      <div class="flex-row ion-margin-top">
        <p>
          {{ $t('message.developedBy') }}
          <strong>Lucas de Uña Ocampo</strong>
        </p>
      </div>
      <div class="flex-row ion-margin-bottom">
        <ion-button
          color="secondary"
          @click="goto('https://github.com/HipyCas/', 'personal_profile')"
        >
          {{ $t('message.aboutMe') }}
          <ion-icon slot="start" :md="planet" :ios="planet"></ion-icon>
        </ion-button>
        <ion-button
          fill="outline"
          color="secondary"
          @click="
            goto('https://github.com/biocienciasgrx/ceebi/', 'source_code')
          "
        >
          {{ $t('message.sourceCode') }}
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

import { Mecenas, MecenasLevel } from '../types';
import { IMAGES_DIRECTORY, MECENAS_JSON_PATH } from '../vars';
// import { analytics, performance } from '../firebase';

import { logoGithub, planet } from 'ionicons/icons';
import { wpapi } from '../wpapi';
import { extractContent } from '../util';
import parseISO from 'date-fns/parseISO';
import formatISO from 'date-fns/formatISO';
import { CapacitorHttp } from '@capacitor/core';

import { logCatchError } from '@code/capacitor-utils';

// const modMecenas: Mecenas = {
//   colaborador: [],
//   bronce: [],
//   plata: [],
//   oro: [],
//   platino: [],
// };
// for (const prop of Object.keys(_mecenas)) {
//   for (let i = 0; i < _mecenas[prop as MecenasLevel].length; i++)
//     //@ts-expect-error
//     _mecenas[prop as MecenasLevel][i]["finalImg"] === undefined
//       ? (modMecenas[prop as MecenasLevel][i] = {
//           ..._mecenas[prop as MecenasLevel][i],
//           finalImg: "",
//         } as Mecena)
//       : (modMecenas[prop as MecenasLevel][i] = {
//           ..._mecenas[prop as MecenasLevel][i],
//           //@ts-ignore
//           finalImg: _mecenas["finalmg"],
//         });
// }
const i18n = useI18n();
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

const dbg = (msg: string, content: any) => {
  console.log(msg, content);
  return content;
};

console.log('MEDIA> start');
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

const goto = (url: string, msg: string) => {
  // logEvent(analytics, 'open_' + msg);
  window.location.href = url;
};

// const mecenas = ref({
//   colaborador: [],
//   bronce: [],
//   plata: [],
//   oro: [],
//   platino: [],
// } as Mecenas);e() {}

// const imagesLoaded = ref(false);
// const imageLoadings = ref({
//   colaborador: false,
//   bronce: false,
//   plata: false,
//   oro: true,
//   platino: false,
// });

// const imageExists = async (path: string) => {
//   const read = await Filesystem.readdir({
//     path: IMAGES_DIRECTORY,
//     directory: Directory.Cache,
//   });
//   console.info('dirread: ', read.files, '; look for ', path);
//   return read.files.map((file) => file.name).includes(path);
// };

// // const imageTrace = trace(performance, 'sponsor_images_load');
// const imageTrace = {
//   start: () => false,
//   stop: () => false,
// };

// (async () => {
//   imageTrace.start();
//   console.log('> Tracing started');
//   try {
//     const response = await fetch(
//       'https://raw.githubusercontent.com/biocienciasgrx/ceebi/master/mecenas.json'
//     );
//     mecenas.value = await response.json();
//     // Cache mecenas info
//     Filesystem.writeFile({
//       directory: Directory.Cache,
//       path: MECENAS_JSON_PATH,
//       encoding: Encoding.UTF8,
//       data: JSON.stringify(mecenas.value),
//     });
//   } catch (e) {
//     try {
//       const { data } = await Filesystem.readFile({
//         directory: Directory.Cache,
//         path: MECENAS_JSON_PATH,
//         encoding: Encoding.UTF8,
//       });
//       mecenas.value = JSON.parse(data);
//     } catch (e) {
//       return;
//     }
//   }
//   console.info(' > Response JSON: ', mecenas.value);
//   for (const type in mecenas.value) {
//     console.info(`>> ===== ${type} =====`);
//     for (let i = 0; i < mecenas.value[type as MecenasLevel].length; i++) {
//       const element = mecenas.value[type as MecenasLevel][i];
//       console.info(
//         '>> Processing image for ',
//         element.nombre,
//         'with src',
//         element.img
//       );
//       const imageCached = await imageExists(element.img.replace(/\//g, '-'));
//       console.info('>> Checking for mecena ', element);
//       if (imageCached) {
//         console.info('>>> Image is cached, loading it');
//         const { uri: imageUri } = await Filesystem.getUri({
//           directory: Directory.Cache,
//           path: `${IMAGES_DIRECTORY}/${element.img.replaceAll('/', '-')}`,
//         });
//         element.img = Capacitor.convertFileSrc(imageUri);
//       } else {
//         console.info('>>> Image not cached, downloading and saving');
//         try {
//           // const imageRes = await Http.get({
//           //   url: element.img,
//           //   responseType: 'blob',
//           // });
//           const imageRes = await (
//             await (await fetch(element.img)).blob()
//           ).text();
//           console.info('>>> Response: ', imageRes);
//           console.info(
//             '>>> Is data base64?',
//             /^([A-Za-z0-9+/]{4})*([A-Za-z0-9+/]{3}=|[A-Za-z0-9+/]{2}==)?$/.test(
//               imageRes
//             )
//           );
//           await Filesystem.writeFile({
//             directory: Directory.Cache,
//             path: `${IMAGES_DIRECTORY}/${element.img.replaceAll('/', '-')}`,
//             data: imageRes,
//           });
//         } catch {
//           toast(i18n.t('message.errorLoadingImages'), undefined, 'danger');
//         }
//       }
//       console.info('>> Processed mecena ', element);
//       console.info('>> So, this is', element.nombre, 'image:', element.img);
//       if (
//         mecenas.value[type as MecenasLevel].indexOf(element) ===
//         mecenas.value[type as MecenasLevel].length - 1
//       )
//         imageLoadings.value[type as MecenasLevel] = true;
//       console.info(
//         `[${type}] >> ${element} has index ${mecenas.value[
//           type as MecenasLevel
//         ].indexOf(element)} / ${
//           mecenas.value[type as MecenasLevel].length - 1
//         }, so colaborador images loaded? ${
//           mecenas.value[type as MecenasLevel].indexOf(element) ===
//           mecenas.value[type as MecenasLevel].length - 1
//         }`
//       );
//     }
//   }
// })();

// watch(
//   imageLoadings,
//   (value) => {
//     let areLoaded = true;
//     for (const type of Object.keys(value))
//       if (!value[type as MecenasLevel]) areLoaded = false;
//     imagesLoaded.value = areLoaded;
//     if (areLoaded) {
//       imageTrace.stop();
//       console.log('> Tracing stopped');
//     }
//     // for (const type in mecenas) {
//     //   mecenas[type as MecenasLevel].forEach(async (element) => {
//     //     console.info(
//     //       "About:watch<imageLoadings> >>",
//     //       JSON.stringify(value),
//     //       "&",
//     //       imagesLoaded.value,
//     //       "Here we are: ",
//     //       // JSON.stringify(element),
//     //       "(come from ",
//     //       JSON.stringify(oldValue),
//     //       ")"
//     //     );
//     //   });
//     // }
//   },
//   { deep: true }
// );
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
  text-decoration: none;
  /* color: inherit; */
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
