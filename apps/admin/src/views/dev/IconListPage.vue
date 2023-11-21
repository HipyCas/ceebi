<template>
  <PageWrapper :title="'Update Users'" :back="true">
    <main class="px-5">
      <h1>Icon List</h1>
      <p>List of all available icons from IonIcons</p>

      <IonButton expand="block" @click="copyList">export</IonButton>

      <ul>
        <li
          class="mt-2"
          v-for="[name, value] in entries(ionicons).filter(
            ([key, _]) => key.endsWith('Outline') || key.startsWith('logo'),
          )"
          :key="name"
        >
          <IonIcon
            :md="value"
            :ios="value"
            class="inline-block w-8 h-8 -mb-1"
          ></IonIcon>
          <span
            class="text-lg ml-2"
            @click="
              copy(
                capitalizeFirstLetter(
                  name
                    .replace('Outline', '')
                    .replace(/([a-z])([A-Z])/g, '$1 $2'),
                ),
              )
            "
            >{{
              capitalizeFirstLetter(
                name.replace('Outline', '').replace(/([a-z])([A-Z])/g, '$1 $2'),
              )
            }}</span
          >
          <span class="text-md ml-2 text-zinc-500" @click="copy(name)">{{
            name
          }}</span>
        </li>
      </ul>
    </main>
  </PageWrapper>
</template>

<script setup lang="ts">
import PageWrapper from '../../components/PageWrapper.vue';
import { IonButton, IonIcon, toastController } from '@ionic/vue';
import * as ionicons from 'ionicons/icons';
import { Clipboard } from '@capacitor/clipboard';

// TODO Organize by groups in WP the notification buttons so that you have a buttons group having all other groups, and then you only have to do button.forEach({title, link, icon} => {}), so buttons is = {button1, button2, button3}

function copy(contents: string) {
  Clipboard.write({
    string: contents,
  });
}

function entries(obj: Record<any, any>) {
  return Object.entries(obj);
}

function capitalizeFirstLetter(s: string) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}

const copyList = async () => {
  const string = Object.keys(ionicons)
    .filter((icon) => icon.endsWith('Outline') || icon.startsWith('logo'))
    .map(
      (icon) =>
        `${icon} : ${capitalizeFirstLetter(
          icon.replace('Outline', '').replace(/([a-z])([A-Z])/g, '$1 $2'),
        )}`,
    )
    .join('\n');

  Clipboard.write({
    string,
  })
    .then(() =>
      toastController
        .create({
          color: 'success',
          message: 'Copied to clipboard!',
          icon: ionicons.checkmarkCircleOutline,
          duration: 1000,
        })
        .then((t) => t.present()),
    )
    .catch(() =>
      toastController
        .create({
          color: 'danger',
          message: 'Error when copying to clipboard',
          icon: ionicons.closeCircleOutline,
          duration: 1000,
        })
        .then((t) => t.present()),
    );
};
</script>
