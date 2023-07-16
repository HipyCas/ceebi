const messages = {
  en: {
    ui: {
      close: 'Close',
      save: 'Save',
      cancel: 'Cancel',
      loading: 'Loading',
      send: 'Send',
      minutes: 'minutes',
    },
    auth: {
      loggingIn: 'Logging in',
      privacyPolicyAcceptance:
        'By using this app, you agree you accept the AEBI\'s <a href="https://biociencias.es/politica-privacidad/">Privacy Policy</a>',
      logout: 'Log out',
      loggedOutSuccess: 'Successfully logged out',
    },
    tab: {
      attendance: 'Attendance',
      schedule: 'Schedule',
      news: 'News',
      notifications: 'Notifications',
    },
    appUpdate: {
      alertHeader: 'App update available',
      alertMessage:
        'We recommend you to update the application.\nCurrent version: {currentVersion} . New version: {availableVersion}',
      alertLater: 'Later',
      alertUpdate: 'Update',
      toastUpdated: 'App updated, restart to apply updates',
    },
    news: {
      loadedOffline: "Couldn't fetch news, loaded locally saved news",
      cannotRefreshOffline: 'Cannot refresh news while offline',
      readMore: 'Read more',
      connectAtLeastOnce: 'You have to connect at least once to see news',
      moreOnWeb: 'More on the web',
    },
    settings: {
      title: 'Settings',
      interfaceTitle: 'Interface',
      localeSelection: 'Select language',
      darkMode: 'Dark mode',
      notificationsTitle: 'Notifications',
      eventRemindersToggle: 'Enable event reminders',
      eventRemindersChooseTime: 'Time before event for notification',
      eventsRemindersTime0: 'At start time',
      helpTitle: 'Help',
      helpFaqAndInfo: 'FAQ and more info',
      helpShareLogs: 'Share error logs',
      viewSlides: 'Watch presentation again',
    },
    about: {
      patron: 'PATRONS',
      platinum: 'Platinum',
      gold: 'Gold',
      silver: 'Silver',
      bronze: 'Bronze',
      collaborators: 'COLLABORATORS',

      developedBy: 'Developed by',
      aboutMe: 'About me',
      sourceCode: 'Source code',

      errorLoadingImages: 'Error when downloading images',
    },
    message: {
      // QRCode
      qrcodeIdNotSet: 'Setup an ID to use QR code access',
      qrcodeSetId: 'Set ID',
      viewAttendance: 'View attendance',

      // components/AttendanceModal.vue
      attendance: 'Attendance',
      youveAssistedTo: 'You have attended to',
      outOfTotalOf: 'hours out of a total of 25 hours',
      eventsYouveAssisted: 'Events you have attended',
      noAssistance: 'No attendance registered',
      attendanceConnectToSee: 'Go online to check your attendance',

      // components/NoConnection.vue
      noConnection: 'No connection',

      // Schedule
      scheduleGoOnline: 'Go back online to get the updated schedule',

      // Notifications
      noNotificationsYet: 'No notifications yet',
      notificationSentOn: 'Sent on',

      // ---
      eventNoLocation: 'No location assigned',
      eventSpeakers: 'Speakers',
      eventViewOnWeb: 'View on the web',
    },
  } as Translation,
  es: {
    ui: {
      close: 'Cerrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      loading: 'Cargando',
      send: 'Enviar',
      minutes: 'minutos',
    },
    tab: {
      attendance: 'Asistencia',
      schedule: 'Horario',
      news: 'Noticias',
      notifications: 'Notificaciones',
    },
    auth: {
      loggingIn: 'Iniciando sesión',
      privacyPolicyAcceptance:
        'Al usar la aplicación, aceptas la <a href="https://biociencias.es/politica-privacidad/">Política de Privacidad de AEBI</a>',
      logout: 'Cerrar sesión',
      loggedOutSuccess: 'Sesión cerrada con éxito',
    },
    appUpdate: {
      alertHeader: 'Actualización disponible',
      alertMessage:
        'Te recomendamos que atualices la aplicación a la última versión.\nVersión actual: {currentVersion} . Versión disponible: {availableVersion}',
      alertLater: 'Más tarde',
      alertUpdate: 'Actualizar',
      toastUpdated: 'App actualizada, reinicia para aplicar los cambios',
    },
    news: {
      loadedOffline: 'No se pueden obtener las noticias, cargando guardadas',
      cannotRefreshOffline: 'No es posible recargar las noticias sin conexión',
      readMore: 'Leer más',
      connectAtLeastOnce:
        'Conéctese a internet polo menos unha vez para poder ver as novas',
      moreOnWeb: 'Más en la web',
    },
    settings: {
      title: 'Configuración',

      interfaceTitle: 'Interfaz',
      localeSelection: 'Seleccionar idioma',
      localeSavingError: 'Error al guardar el idioma',
      darkMode: 'Modo oscuro',

      notificationsTitle: 'Notificaciones', // TODO Repeated, can't be
      eventRemindersToggle: 'Habilitar recordatorios de eventos',
      eventRemindersChooseTime: 'Antelación al evento',
      eventsRemindersTime0: 'Al empezar',

      helpTitle: 'Ayuda',
      helpFaqAndInfo: 'Preguntas frecuentes y más info',
      helpShareLogs: 'Compartir registro de errores',
      helpShareLogsAlertHeader: 'Compartir registro de errores',
      helpShareLogsAlertMessage:
        'Comparte este archivo con los desarrolladores de la aplicación via correo a {email} o por Telegram a {telegram} para que se revisen y se intenten arreglar los problemas que hayan surgido',
      helpShareLogsDialogTitle: 'Comparte este archivo con la organización',

      viewSlides: 'Ver introducción de nuevo',
    },
    about: {
      developedBy: 'App desarrollada por',
      aboutMe: 'Sobre mí',
      sourceCode: 'Código fuente',
      patron: 'MECENAS',
      platinum: 'Platino',
      gold: 'Oro',
      silver: 'Plata',
      bronze: 'Bronce',
      collaborators: 'COLABORADORES',
      errorLoadingImages: 'Error al intentar descargar imágenes',
    },
    message: {
      close: 'Cerrar',
      save: 'Guardar',
      cancel: 'Cancelar',
      loading: 'Cargando',

      // QRCode
      qrcodeIdNotSet: 'Configura tu ID para usar el acceso por QR',
      qrcodeSetId: 'Añadir ID',
      viewAttendance: 'Ver asistencia',

      // components/AttendanceModal.vue
      attendance: 'Asistencia',
      youveAssistedTo: 'Has asistido a',
      outOfTotalOf: 'horas de un total de 25 horas',
      eventsYouveAssisted: 'Eventos a los que has asistido',
      noAssistance: 'Aún no tienes asistencia registrada',
      attendanceConnectToSee:
        'Conéctate a internet para poder ver tu asistencia',

      // components/NoConnection.vue
      noConnection: 'Sin conexión',

      // Schedule
      scheduleGoOnline: 'Conéctate de nuevo para ver el horario',

      // Notifications
      noNotificationsYet: 'Aún no hay notificaciones',
      notificationSentOn: 'Enviado el',

      // ---
      eventNoLocation: 'Sin localización asignada',
      eventSpeakers: 'Ponentes',
      eventViewOnWeb: 'Ver en la web',
    },
  } as Translation,
  gl: {
    ui: {
      close: 'Pechar',
      save: 'Gardar',
      cancel: 'Cancelar',
      loading: 'Cargando',
      send: 'Enviar',
      minutes: 'minutos',
    },
    auth: {
      loggingIn: 'Iniciando sesión',
      privacyPolicyAcceptance:
        'Ao usar a aplicación, aceptas a <a href="https://biociencias.es/politica-privacidad/">Política de Privacidade de AEBI</a>',
      logout: 'Pechar sesión',
    },
    tab: {
      attendance: 'Asistencia',
      schedule: 'Horario',
      news: 'Novas',
      notifications: 'Notificacións',
    },
    appUpdate: {},
    news: {
      takingLongMessage: 'A descarga está a tardar máis do esperado',
      takingLongerLoadCache: 'Ver offline',
      takingLongerWait: 'Agardar',
      cannotRefreshOffline: 'Non é posible recargar as noticias sen conexión',
      readMore: 'Ler máis',
      loadedOffline: 'Cargadas as noticias descargadas',
      connectAtLeastOnce:
        'Conéctate a internet por lo menos una vez para poder ver las noticias',
      moreOnWeb: 'Máis na nosa web',
    },
    settings: {
      title: 'Configuración',
      localeSelection: 'Seleccionar idioma',
      interfaceTitle: 'Interface',
      darkMode: 'Modo oscuro',
      notificationsTitle: 'Notificacións',
      eventRemindersToggle: 'Habilitar recordatorios de eventos',
      eventRemindersChooseTime: 'Antelación ao evento',
      eventsRemindersTime0: 'Ao comezar',
    },
    about: {
      patron: 'MECENAS',
      platinum: 'Platino',
      gold: 'Ouro',
      silver: 'Plata',
      bronze: 'Bronce',
      collaborators: 'COLABORADORES',

      developedBy: 'Creado por',
      aboutMe: 'Sobre mín',
      sourceCode: 'Código fonte',

      errorLoadingImages: 'Erro ao tentar descargar imaxes',
    },
    message: {
      // QRCode
      qrcodeIdNotSet: 'Configura o teu ID para usar o acceso por QR',
      qrcodeSetId: 'Engadir ID',
      viewAttendance: 'Ver asistencia',

      // components/AttendanceModal.vue
      attendance: 'Asistencia',
      youveAssistedTo: 'Asistiches a',
      outOfTotalOf: 'horas dun total de 25 horas',
      eventsYouveAssisted: 'Eventos aos que asistiches',
      noAssistance: 'Aínda non tes asistencia rexistrada',
      attendanceConnectToSee:
        'Conéctate ao internet para poder ver a túa asistencia',

      // components/NoConnection.vue
      noConnection: 'Sen conexión',

      // Schedule
      scheduleGoOnline: 'Recupera a conexión a internet para ver o horario',

      // Notifications
      noNotificationsYet: 'Aínda non hay notificacións',
      notificationSentOn: 'Enviado o',

      // ---
      eventNoLocation: 'Sen localización asignada',
      eventSpeakers: 'Poñentes',
      eventViewOnWeb: 'Ver na web',
    },
  } as Translation,
  de: {
    ui: {
      close: '',
      save: '',
      cancel: '',
      loading: '',
      send: '',
      minutes: 'Minuten',
    },
    auth: {},
    tab: {
      attendance: 'QR-Code',
      schedule: 'Plan',
      news: 'Nachrichten',
      notifications: 'Mitteilung',
    },
    appUpdate: {},
    news: {
      takingLongMessage: 'Das wird länger als wir gedacht haben',
      takingLongerLoadCache: 'Laden aus dem Cachespeicher',
      takingLongerWait: 'Abwarten Sie, bitte',
      cannotRefreshOffline: 'Nachrichten sind nicht offline zu laden',
      readMore: 'Lessen mehr',
      moreOnWeb: 'Mehr im Web',
    },
    settings: {
      localeSelection: 'Wählen Sie die Sprache',
      interfaceTitle: 'Interface',
      darkMode: 'Dunkelmodus',
      notificationsTitle: 'Mitteilungen',
      eventRemindersToggle: 'Aktivieren Eventserinnerungen',
      eventRemindersChooseTime: 'Zeit zu EventsMitteilung',
      eventsRemindersTime0: 'Im Startzeit',
    },
    about: {},
    message: {
      // QRCode
      qrcodeIdNotSet: 'Stellen Sie eine ID auf, um QR-Code zu benutzen',
      qrcodeSetId: 'Set ID',
      viewAttendance: 'Anwesenheit nachweisen',

      attendance: 'Anwesenheit',
      youveAssistedTo: 'Sie haben zu',
      outOfTotalOf: 'von den ingesamt y Stunden  teilgenomen',

      // components/NoConnection.vue
      noConnection: 'Keine Verbindung',

      // ---
      eventSpeakers: 'Rednen',
    },
  } as Translation,
  eu: {
    ui: {
      close: 'Itxi',
      save: 'Gorde',
      cancel: 'Ezeztatu',
      loading: 'Kargatzen',
      send: '',
      minutes: 'minutu',
    },
    auth: {},
    tab: {
      attendance: 'QR kodea',
      schedule: 'Ordutegia',
      news: 'Berriak',
      notifications: 'Jakinarazpenak',
    },
    appUpdate: {},
    news: {
      loadedOffline: 'Ezin dira berriak lortu, gordetakoak kargatzen',
      cannotRefreshOffline: 'Ezin dira berriak berriro kargatu konexiorik gabe',
      readMore: 'Gehiago irakurri',
      connectAtLeastOnce:
        'Berriak ikusteko Internetera konekta zaitez gutxienez aldi bat',
      moreOnWeb: 'Web-orrian gehiago',
    },
    settings: {},
    about: {
      patron: 'MEZENAS',
      platinum: 'Platinoa',
      gold: 'Urreaa',
      silver: 'Zilarra',
      bronze: 'Brontzea',
      collaborators: 'KOLABORATZAILEAK',

      developedBy: '-(e)k garatutako App-a',
      aboutMe: 'Niri buruz',
      sourceCode: 'Iturburu-kodea',

      errorLoadingImages: 'Irudiak deskargatzerakoan errore bat gertatu da',
    },
    message: {
      // QRCode
      qrcodeIdNotSet:
        'Zure IDa konfigura ezazu QR-en bidez sarrera erabiltzeko',
      qrcodeSetId: 'IDa gehitu',
      viewAttendance: 'Jendea ikusi',

      // components/AttendanceModal.vue
      attendance: 'Jendea',
      youveAssistedTo: '-(e)ra azaldu zara',
      outOfTotalOf: 'ordu guztizko 25 orduetatik',
      eventsYouveAssisted: 'Azaldu naizen ekitaldiak',
      noAssistance: 'Oraindik ez duzu zure etortzea erregistratu',
      attendanceConnectToSee: 'Internetera konektatu zure bertaratzea ikusteko',

      // components/NoConnection.vue
      noConnection: 'Konexiorik gabe',

      // Schedule
      scheduleGoOnline: 'Ordutegia ikusteko berriro konekta zaitez',

      // Notifications
      noNotificationsYet: 'Oraindik ez dago jakinarazpenik',
      notificationSentOn: '-(e)an bidalita',

      // ---
      eventNoLocation: 'Oraindik ez dago kokapenik',
      eventSpeakers: 'Hizlariak',
      eventViewOnWeb: 'Web-orrian ikusi',
    },
  } as Translation,
  ca: {
    ui: {
      close: 'Tancar',
      save: 'Guardar',
      cancel: 'Cancel·lar',
      loading: 'Carregant',
      send: 'Enviar',
      minutes: 'minuts',
    },
    auth: {
      loggingIn: 'Iniciant sessió',
      privacyPolicyAcceptance:
        'En usar l\'aplicació, acceptes la <a href="https://biociencias.es/politica-privacidad/">Política de Privacitat d\'AEBI</a>',
      logout: 'Tancar sessió',
    },
    tab: {
      attendance: 'Assistència',
      schedule: 'Horari',
      news: 'Notícies',
      notifications: 'Notificacions',
    },
    appUpdate: {
      alertUpdate: 'Actualitzar',
      alertLater: 'Més tard',
      toastUpdated: 'App actualitzada, reinicia per aplicar els canvis',
    },
    news: {
      loadedOffline: 'No es poden obtenir les notícies, carregant desades',
      cannotRefreshOffline:
        'No és possible recarregar les notícies sense connexió',
      readMore: 'Llegir més',
      connectAtLeastOnce:
        "Connecta't a internet com a mínim un cop per poder veure les notícies",
      moreOnWeb: 'Més al web',
    },
    settings: {
      title: 'Configuració',

      interfaceTitle: 'Interfície',
      localeSelection: 'Seleccionar idioma',
      darkMode: 'Mode fosc',

      notificationsTitle: 'Notificacions', // This is the same name as tabs
      eventRemindersToggle: "Habilitar recordatoris d'esdeveniments",
      eventRemindersChooseTime: "Antelació a l'esdeveniment",
      eventsRemindersTime0: 'En començar',
    },
    about: {
      patron: 'MECENES',
      platinum: 'Platí',
      gold: 'Or',
      silver: 'Plata',
      bronze: 'Bronze',
      collaborators: 'COL·LABORADORS',

      developedBy: 'App desenvolupada per',
      aboutMe: 'Sobre mi',
      sourceCode: 'Codi font',

      errorLoadingImages: 'Error en intentar descarregar imatges',
    },
    message: {
      qrcodeIdNotSet: "Configura la teva ID per utilitzar l'accés per QR",
      qrcodeSetId: 'Afegir ID',
      viewAttendance: 'Veure assistència',

      attendance: 'Assistència',
      youveAssistedTo: 'Has assistit a',
      outOfTotalOf: "hores d'un total de 25 hores",
      eventsYouveAssisted: 'Esdeveniments als quals has assistit', // FIXME Attendance not assistance
      noAssistance: 'Encara no tens assistència enregistrada',
      attendanceConnectToSee:
        "Connecta't a internet per veure la teva assistència",

      noConnection: 'Sense connexió',

      noNotificationsYet: 'Encara no hi ha notificacions',
      notificationSentOn: 'Enviat el',

      eventNoLocation: 'Sense localització assignada',
      eventSpeakers: 'Ponents',
      eventViewOnWeb: 'Veure al web',
    },
  } as Translation,
};

console.log(JSON.stringify(messages, null, 2));

export default messages;

export type Translation = {
  ui: {
    close?: string;
    save?: string;
    cancel?: string;
    loading?: string;
    send?: string;
    minutes?: string;
  };
  auth: {
    loggingIn?: string;
    privacyPolicyAcceptance?: string;
    logout?: string;
    loggedOutSuccess?: string;
  };
  tab: {
    attendance?: string;
    schedule?: string;
    news?: string;
    notifications?: string;
  };
  appUpdate: {
    alertHeader?: string;
    alertMessage?: string;
    alertLater?: string;
    alertUpdate?: string;
    toastUpdated?: string;
  };
  news: {
    newsLoadedOffline?: string;
    newsCannotRefreshOffline?: string;
    newsReadMore?: string;
    newsConnectAtLeastOnce?: string;
    newsMoreOnWeb?: string;
  };
  settings: {
    title?: string;

    interfaceTitle?: string;
    localeSelection?: string;
    localeSavingError?: string;
    darkMode?: string;

    notificationsTitle?: string;
    eventRemindersToggle?: string;
    eventRemindersChooseTime?: string;
    eventsRemindersTime0?: string;

    helpTitle?: string;
    helpFaqAndInfo?: string;
    helpShareLogs?: string;
    helpShareLogsAlertHeader?: string;
    helpShareLogsAlertMessage?: string;
    helpShareLogsDialogTitle?: string;

    viewSlides?: string;
  };
  about: {
    patron?: string;
    platinum?: string;
    gold?: string;
    silver?: string;
    bronze?: string;
    collaborators?: string;

    developedBy?: string;
    aboutMe?: string;
    sourceCode?: string;

    errorLoadingImages?: string;
  };
  message: {
    // QRCode
    qrcodeIdNotSet?: string;
    qrcodeSetId?: string;
    viewAttendance?: string;

    // components/AttendanceModal.vue
    attendance?: string;
    youveAssistedTo?: string;
    outOfTotalOf?: string;
    eventsYouveAssisted?: string;
    noAssistance?: string;
    attendanceConnectToSee?: string;

    // components/NoConnection.vue
    noConnection?: string;

    // Schedule
    scheduleGoOnline?: string;

    // Notifications
    noNotificationsYet?: string;
    notificationSentOn?: string;

    // components/EventDetailsModal
    eventNoLocation?: string;
    eventSpeakers?: string;
    eventViewOnWeb?: string;
  };
};

export type SupportedLanguages = keyof typeof messages;
