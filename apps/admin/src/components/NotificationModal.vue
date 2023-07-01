<template>
  <ion-header translucent>
    <ion-toolbar>
      <ion-title>{{ action === 'edit' ? 'Editar ' : action === 'create' ? 'Nueva '  : 'Ver ' }}Notificación</ion-title>
      <ion-buttons slot="end">
        <ion-button fill="clear">
          <ion-icon
            slot="icon-only"
            :md="helpCircleOutline"
            :ios="helpCircleOutline"
          ></ion-icon>
        </ion-button>
        <ion-button @click="dismissModal()">Cerrar</ion-button>
      </ion-buttons>
    </ion-toolbar>
  </ion-header>
  <ion-content>
    <!--* Aviso sobre edición -->
    <ion-item v-if="action === 'edit'" color="warning" class="warn">
      <ion-icon
        slot="start"
        :md="warningOutline"
        :ios="warningOutline"
      ></ion-icon>
      Editar una notificación solo actualizará la vista en la app
      <ion-button slot="end" color="primary" fill="outline" size="default"
        >+ INFO</ion-button
      >
    </ion-item>

    <ion-button id="trigger-loading" expand="full" v-if="action !== 'view'" @click="publishOrUpdate()">
      {{ action === 'create' ? 'Publicar' : 'Actualizar' }}
    </ion-button>
    <ion-modal id="publishing-progress" :is-open="loadingOpen" :can-dismiss="false">
      <ion-item class="center"><p style="width: 100%; font-weight: bold;">{{ action === 'create' ? 'Publicando' : 'Actualizando'}}...</p></ion-item>
      <loading-step
        :current-step="loadingStep"
        :target-step="1"
        text="Guardando">
      </loading-step>
      <loading-step
        :current-step="loadingStep"
        :target-step="2"
        text="Programando para Android">
      </loading-step>
      <loading-step
        :current-step="loadingStep"
        :target-step="3"
        text="Programando para iOS">
      </loading-step>
      <!--loading-step
        :current-step="loadingStep"
        :target-step="4"
        text="Programando Ntfy.sh">
      </!--loading-step-->
    </ion-modal>

    <!-- TODO Allow disabling autocorrect in settings -->
    <!--* Título -->
    <ion-item lines="full">
      <ion-input
        label="Título"
        label-placement="fixed"
        autocorrect="on"
        autofocus
        clear-input
        inputmode="text"
        spellcheck
        :readonly="action === 'view'"
      ></ion-input>
    </ion-item>

    <!--* Icono -->
    <ion-item lines="full" :button="action !== 'view'" @click="action === 'view' ? {} : selectIcon()" read>
      <ion-label slot="start">Icono</ion-label>
      <ion-icon
        slot="end"
        v-if="selectedIcon"
        :md="ionicons[selectedIcon]"
        :ios="ionicons[selectedIcon]"
      ></ion-icon>
      <ion-label
        v-else
        slot="end"
        color="primary"
        style="text-transform: uppercase"
        >Seleccionar</ion-label
      >
    </ion-item>

    <!--* Programación (fecha y hora)-->
    <ion-item lines="full">
      <ion-label slot="start">Programar</ion-label>
      <ion-datetime-button
        slot="end"
        datetime="datetime"
        :disabled="action === 'view'"
      ></ion-datetime-button>
    </ion-item>
    <ion-modal :keep-contents-mounted="true">
      <ion-datetime id="datetime" locale="es-ES" :first-day-of-week="1">
        <span slot="time-label">Tiempo</span>
      </ion-datetime>
    </ion-modal>

    <!--* Botones -->
    <ion-item lines="full" :button="action !== 'view'" @click="action === 'view' ? {} : addButton()">
      <ion-label slot="start">Botones</ion-label>
      <ion-label v-if="action !== 'view'" slot="end" color="primary" style="text-transform: uppercase"
        >Añadir</ion-label
      >
    </ion-item>
    <ion-accordion-group class="ion-padding" v-show="buttons.length > 0">
      <ion-accordion v-for="button, index in buttons" :key="button.id">
        <ion-item slot="header">
          {{ button.name || '<unnamed>' }} &nbsp;<ion-text color="medium">{{ button.id }}</ion-text>
        </ion-item>
        <div slot="content">
          <ion-item>
            <ion-input
              label="Nombre"
              label-placement="fixed"
              v-model="button.name"
              :clear-on-edit="button.name === 'New Button'"
              :readonly="action === 'view'"
            ></ion-input>
          </ion-item>
          <ion-item>
            <ion-input label="Link" label-placement="fixed" v-model="button.link" type="url" inputmode="url" :readonly="action === 'view'"></ion-input>
          </ion-item>
          <ion-item lines="full" :button="action !== 'view'" @click="action === 'view' ? {} : selectButtonIcon(index)">
            <ion-label slot="start">Icono</ion-label>
            <ion-icon
              slot="end"
              v-if="button.icon !== ''"
              :md="ionicons[button.icon]"
              :ios="ionicons[button.icon]"
            ></ion-icon>
            <ion-label
              v-else
              slot="end"
              color="primary"
              style="text-transform: uppercase"
              >Seleccionar</ion-label
            >
          </ion-item>
          <ion-item v-if="action!== 'view'">
            Delete button
            <ion-button slot="end" fill="outline" color="danger" @click="buttons.splice(index, 1)">
              Delete
              <ion-icon slot="end" :md="trashOutline"></ion-icon>
            </ion-button>
          </ion-item>
        </div>
      </ion-accordion>
    </ion-accordion-group>

    <!--* Imagen -->

    <!--* Contenido en HTML-->
    <!-- TODO Make this Markdown -->
    <div class="ion-padding editor-wrapper">
      <IonLabel>Contenido</IonLabel>
        <bubble-menu
        :editor="editor"
        :tippy-options="{ duration: 100,
        animateFill: true, maxWidth: 500 }"
        v-if="editor"
        class="editor-menu"
      >
        <button @click="editor.chain().focus().toggleHeading({level: 2}).run()"  :class="{ 'menu-is-active': editor.isActive('heading') }">
          <IonRippleEffect></IonRippleEffect>
          <IconHeading></IconHeading>
        </button>
        <button @click="editor.chain().focus().toggleBulletList().run()"  :class="{ 'menu-is-active': editor.isActive('bulletList') }">
          <IonRippleEffect></IonRippleEffect>
          <IconList></IconList>
        </button>
        <button @click="editor.chain().focus().toggleOrderedList().run()"  :class="{ 'menu-is-active': editor.isActive('orderedList') }">
          <IonRippleEffect></IonRippleEffect>
          <IconListNumbers></IconListNumbers>
        </button>
        <div class="divider"></div>
        <button @click="editor.chain().focus().toggleBold().run()"  :class="{ 'menu-is-active': editor.isActive('bold') }">
          <IonRippleEffect></IonRippleEffect>
          <IconBold></IconBold>
        </button>
        <button @click="editor.chain().focus().toggleItalic().run()" class="relative rounded-md" :class="{ 'menu-is-active': editor.isActive('italic') }">
          <IonRippleEffect></IonRippleEffect>
          <IconItalic></IconItalic>
        </button>
        <button @click="editor.chain().focus().toggleStrike().run()" :class="{ 'menu-is-active': editor.isActive('strike') }">
          <IonRippleEffect></IonRippleEffect>
          <IconStrikethrough></IconStrikethrough>
        </button>
        <button @click="editor.chain().focus().toggleCode().run()" :class="{ 'menu-is-active': editor.isActive('code') }">
          <IonRippleEffect></IonRippleEffect>
          <IconCode></IconCode>
        </button>
        <div class="divider"></div>
        <button @click="editorSetLink"  :class="{ 'menu-is-active': editor.isActive('link') }">
          <IonRippleEffect></IonRippleEffect>
          <IconLink></IconLink>
        </button>
        <button @click="editor.chain().focus().unsetLink().run()" v-show="editor.isActive('link')">
          <IonRippleEffect></IonRippleEffect>
          <IconUnlink></IconUnlink>
        </button>
        <button @click="fireContextMenu" v-show="editor.isActive('link')">
          <IonRippleEffect></IonRippleEffect>
          <IconUnlink></IconUnlink>
        </button>
      </bubble-menu>
        <EditorContent @contextmenu="checkContextMenu($event)" class="editor" :editor="editor"></EditorContent>
    </div>
  </ion-content>
</template>

<script setup lang="ts">
import {
  IonHeader,
  IonToolbar,
  IonTitle,
  IonButtons,
  IonButton,
  IonContent,
  IonItem,
  IonIcon,
  IonInput,
  IonLabel,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonAccordion,
  IonAccordionGroup,
  IonText,
  modalController,
IonRippleEffect,
alertController,
} from '@ionic/vue';
import {
  warningOutline,
  helpCircleOutline,
  trashOutline,
} from 'ionicons/icons';
import * as ionicons from 'ionicons/icons';
import IconSearchModal from './IconSearchModal.vue';
import {IconBold, IconItalic, IconStrikethrough, IconCode, IconHeading, IconList, IconListNumbers, IconLink, IconUnlink} from '@tabler/icons-vue'
import { nanoid } from 'nanoid';
import LoadingStep from './LoadingStep.vue';
import { Editor, EditorContent, BubbleMenu } from '@tiptap/vue-3'
import StarterKit from '@tiptap/starter-kit'
import Link from '@tiptap/extension-link'

// FIXME Client app should remove 'Outline' at the end from icon names (easier for admin app and no problem with brands)

interface Button {
  id: string;
  open: boolean;
  name: string;
  link: string;
  icon: string;
}

withDefaults(
  defineProps<{
    action?: 'create' | 'edit' | 'view'
    notificationId?: number;
  }>(),
  {
    action: 'view'
  }
);

// FIXME I think it's not working
const fireContextMenu = () => {
  const evt = new MouseEvent('contextmenu', {
      bubbles: true,
      cancelable: true,
      view: window,
      buttons: 2
    })
  document.querySelector('.editor')?.dispatchEvent(evt)
}
const checkContextMenu = (ev: Event) => {
  if (ev.isTrusted) ev.preventDefault()

}

const editor= new Editor({
    content: '',
    extensions: [
      StarterKit,
      Link.configure({
        openOnClick: false,
        autolink: true,
        protocols: ['mailto', 'tel'],
        HTMLAttributes: {
          rel: ''
        }
      })
    ]
  })

const selectedIcon: Ref<string | undefined> = ref();
const buttons = ref([] as Button[]);
const loadingOpen = ref(false)
const loadingStep = ref(1)

const dismissModal = modalController.dismiss;

const selectIcon = async () => {
  const m = await modalController.create({
    component: IconSearchModal,
    // TODO Need it to be inline for this: keepContentsMounted: true
  });
  m.present();

  const { data } = await m.onWillDismiss();

  if (data !== undefined) {
    selectedIcon.value = data;
  }
};

const selectButtonIcon = async (index: number) => {
  const m = await modalController.create({
    component: IconSearchModal,
  });
  m.present();

  const { data } = await m.onWillDismiss();

  if (data !== undefined) {
    buttons.value[index].icon = data;
  }
};

const addButton = () => {
  buttons.value.push({
    id: nanoid(),
    name: 'New Button',
    link: 'https://',
    icon: '',
    open: true,
  });
};

const publishOrUpdate = async () => {
  loadingOpen.value = true
  setTimeout(() => loadingStep.value = 2, 600)
  setTimeout(() => loadingStep.value = 3, 1200)
  setTimeout(() => loadingStep.value = 4, 1800)
  setTimeout(() => loadingStep.value = 5, 2400)
}

const editorSetLink = () => {
  const previousUrl = editor.getAttributes('link').href
  alertController.create({
    header: 'Create link',
    message: 'Input URL to link text to',
    inputs: [
      {
        placeholder: 'https://example.com',
        value: previousUrl
      }
    ],
    buttons: [{
      text: 'Cancel',
      role: 'cancel'
    }, {
      text: 'Save',
      handler: (ret) => {
        const url = ret[0]
        if (url === "")
          editor.chain().focus().extendMarkRange('link').unsetLink().run()
        else
          editor.chain().focus().extendMarkRange('link').setLink({
            href: url
          }).run()
      }
    },]
  }).then(a => a.present())
}

watch(
  buttons,
  (val) => {
    console.info('buttons', val);
  },
  {
    deep: true,
  }
);
</script>

<style scoped>
.warn::part(native) {
  height: 4rem;
}

ion-modal#publishing-progress {
  --width: fit-content;
  --min-width: 250px;
  --height: fit-content;
  --border-radius: 6px;
  --box-shadow: 0 28px 48px rgba(0, 0, 0, 0.4);
}

.center::part(native) {
  text-align: center;
  width: 100%;
}

input[type="checkbox"] {
  margin-right: 4px;
}

.ProseMirror
  > * + * {
    margin-top: 0.75em;
  }




</style>

<style>
.editor-wrapper {
  background-color: var(--ion-card-background);
}

.editor .ProseMirror {
  @apply mt-2 !outline-none border-b-2 border-transparent
}

.editor .ProseMirror:focus {
  @apply  border-[var(--ion-color-primary)]
}

.editor ul {
  @apply list-inside list-disc
}

.editor ol {
  @apply list-inside list-decimal
}

.editor ul > li > p:first-child,
.editor ol > li > p:first-child {
  @apply ml-0 inline
}

.editor-menu {
  @apply rounded-md relative;
  background-color: var(--ion-background-color);
}

.editor-menu button {
  @apply inline-block p-2 transition-all duration-150 relative rounded-md;
}

.editor-menu .menu-is-active {
  background-color: var(--ion-color-primary-shade);
}

.editor-menu div.divider {
  @apply w-0.5 mx-1 inline-block bg-white h-[24px] relative;
}
</style>
