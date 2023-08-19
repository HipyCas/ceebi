export const IMAGES_DIRECTORY = 'images';
export const MECENAS_JSON_PATH = 'mecenas.json';

//* Storage keys
export const STORAGE_PREFIX = 'ceebi';
// TODO Manually type these so it doesn't run the sum each time the file is imported
export const KEY_ID = STORAGE_PREFIX + 'ID';
export const KEY_LOCALE = STORAGE_PREFIX + 'Locale';
export const KEY_PUSH_ENABLED = STORAGE_PREFIX + 'PushNotifications';
export const KEY_EVENTS_NOTIFICATIONS = STORAGE_PREFIX + 'EventNotifications';
export const KEY_EVENTS_NOTIFICATIONS_TIME =
  STORAGE_PREFIX + 'EventNotificationsTime';
export const KEY_DARK_MODE = STORAGE_PREFIX + 'DarkMode';
export const KEY_WP_TOKEN = STORAGE_PREFIX + 'WPToken';
export const KEY_TRANSLATE_SCHEDULE = STORAGE_PREFIX + 'TranslateSchedule';

//* MEC Properties for events
export const EVENT_ICON_FIELD_LABEL = 'Icono';

//* Firebase
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
export const firebaseConfig = {
  apiKey: 'AIzaSyAzeQ3iQTY9mYBbacYdWbCUCfWiWlIXA_8',
  authDomain: 'ceebi-client.firebaseapp.com',
  projectId: 'ceebi-client',
  storageBucket: 'ceebi-client.appspot.com',
  messagingSenderId: '349028882075',
  appId: '1:349028882075:web:2d4fe842b9485ef1a2d83e',
  measurementId: 'G-QEWRLGY5SV',
};

//* Provide/Inject
export const FIREBASE_APP = 'firebaseApp';
export const FIREBASE_ANALYTICS = 'firebaseAnalytics';
export const FIREBASE_PERFORMANCE = 'firebasePerformance';

export const MICROCURSOS_DOS_DIAS = [
  'Investigación Traslacional y Terapias Avanzadas en Dermatología: de la investigación básica a la clínica',
  'Estudio de las enfermedades genéticas humanas: análisis molecular mediante el uso de herramientas online',
  'Uso de parámetros usados actualmente en la Antropología Física y Forense. Identificación de restos óseos, patologías y traumatismos',
  'Diseño digital e Impresión 3D para el desarrollo de dispositivos personalizados en biomedicina',
  'Técnicas de (Bio)Impresión 3D y desarrollo de biotintas para aplicación en biomedicina',
  'Difracción de rayos X. Identificación de fases sólidas en muestras mono y polifásicas. Informaciones complementarias que ofrece la técnica',
  'Bases moleculares de la nutrición personalizada: Nutrigenómica',
  'HANDS-ON! Aprende las diferencias técnicas para el análisis de la microbiota intestinal con ejemplos prácticos',
];
