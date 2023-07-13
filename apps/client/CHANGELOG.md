# CEEBI Client App - CHANGELOG

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Include all JS Sourcemap to make error debugging in Crashlytics easier
- Gradient to attendance progress

### Fixed

- Error when accessing schedule, caused by a dependency and making schedule load indefinitely
- Logs now get shared perfectly
- Titles in slides and login page are now properly styled
- (ios) Sharing logs item button now renders without the arrow
- Updated used plugins to match changes and solve breaks

### Changed

- (android) Input designs for the login form's input are now more visible in Android
- Added `expand="inset"` to the `IonAccordionGroup` in the event details to make it rounded and better looking, also removed the lines in the items inside for each speaker
- Clean up lots of code
- Removed unused dependencies and optimized other

## [2.0.0-rc.2] - 2023/07/01

### Added

- Toggle to turn on schedule translation if locale is not Spanish, as the translation is resource and time expensive so not everyone needs it
- Prototype for certificate downloads, missing microcursos and more tweaking

### Fixed

- When entering the QR view and not being logged in (therefore the QR doesn't show), brightness is not increased
- Pagination thumbs now visible in presentation slides
- The text color of the event description in the timeline has now been fixed

### Changed

- Moved android projects from `dist/<project>/android` to `android/<project>`
- The Source Sans Pro is now downloaded so should be quicker
- In Android, login inputs are of outline format, making it easier to view
- Update TailwindCSS and PostCSS config to use base config
- Load notifications from WordPress instead of Supabase as they will be stored there
- Removed the page to view and share logs in favour of a button item that shows an alert explaining what to do with them and shares the file after confirmation
- Reduced app size by specifying included capacitor plugins instead of including all
- Show a loading spinner in places where user info is shown while the app is logging in the user via the saved token

### Removed

- `IdChange.vue` page component which is no longer used
- `auth/RecoveryPage.vue` page component and `/auth/recovery` page in router as they depended on Supabase login which is no longer used

## [2.0.0-rc.1] - 2023-06-30

### Added

- Page to see all logs of the app and share them
- App is now in CEEBI's corporate font, Source Sans Pro
- Login with WordPress, form for logging at the end of presentation slides and in a banner showing login status in settings
- Presentation Slides

### Changed

- Drastically improved schedule loading performance
- Migrated to Supabase over Google Firebase for storage
- QR now represents a random and untraceable uuid instead of the user's ID
- Moved all code to a new monorepo

### Fixed

- Bug in weekday detection past event, as the condition was not evaluated

## [1.3.15] - 2022-07-18

### Added

- Translations to Basque
- Show message when not connected to internet and tried to view attendance
- Filter attendance when fetching to ensure that there is not duplicate registries

### Changed

- Improved German translations

### Fixed

- Report more info to Firebase Crashlytics on non-critical errors
- All app strings are translatable
- Improve double colons event title fix
- Restart Android project due to errors when compiling

## [1.3.7] - 2022-07-08

### Added

- Attendance registration and viewing inside a modal
- Dark mode, which can be toggled manually or manually picked from system
- Firebase Crashlytics reporting for uncaught exceptions

### Fixed

- Notch overlapping (added a dynamic padding to the header)
- Title positioning in ID Change page

### Changed

- Styling and other changes to support iOS and dark mode
- Apply wrap for labels in settings and reduce their content length

### Security

- Bump `protobufjs`
- Bump `eventsource`

## [1.1.2] - 2022-06-20

### Added

- Ripple effect when event is clicked in Schedule view
- Modal with event details is shown on click

### Fixed

- Quotation marks properly rendering in one of the events
- Toasts are now placed slightly higher so tab bar can be used while a toast is shown

## [1.0.2] - 2022-04-08

### Fixed

- Logo icons properly show up in notification buttons

## [1.0.0] - 2022-03-16

### Fixed

- Splash screen background color
- Missing translations added
- Remove detail arrows for toggle buttons in settings
- (iOS) Settings page title positioning

## [0.8.8-beta] - 2022-03-14

### Changed

- Date and time when a notification was sent does not show seconds now in the notification detail modal

### Fixed

- Error caused when quickly tapping a notification to open its modal

## [0.8.7-beta] - 2022-03-05

### Added

- Firebase user properties and performance monitoring for specific code
- Small delay to splash screen hide to ensure that the app is completely rendered before the splash screen goes out

### Changed

- Native splash screen is now white (instead of showing a weirdly stretched logo)

### Security

- Bumped `url-parse` from 1.5.3 to 1.5.10 (See [Dependabot alerts](https://github.com/biocienciasgrx/ceebi/security/dependabot?q=is%3Aclosed) for more info)

## [0.8.3-beta] - 2022-03-02

### Added

- Firebase Crashlytics

### Fixed

- App causing lock screen to show up multiple times when app is opened in some Samsung phones.

## [0.8.1-beta] - 2022-02-17

### Added

- App update checker and installer
- Firebase Performance Monitoring

## [0.7.3-alpha] - 2022-02-17

### Added

- Notifications tab: fetches notifications from JSON file in github and displays them in a list, opening a modal for each one when clicked that includes the full notification body and links

### Fixed

- About developer section buttons now properly linking
- Updated and fixed some errors in Galician translations
- Added 2s duration to toast that shows when offline news are loaded due to bad connection as previously it didn't disappear

## [0.6.5-alpha] - 2022-02-17

### Added

- Add app icon on Android
- Complete about page with translations and message about developer

### Changed

- Remove options when news take long to download, instead the app just loads the cached news without letting the user choose
- Improve sliding between dates in schedule so the vertical bar does not seem too long

## [0.6.1-alpha] - 2022-02-06

### Added

- Google Firebase Analytics for Android app
- First basic integration of web analytics for in-app use

## [0.5.1-alpha] - 2022-02-06

### Added

- Fetch [mecenas.json](https://raw.githubusercontent.com/biocienciasgrx/ceebi/master/mecenas.json) from the GitHub repo (@biocienciasgrx/ceebi) and save it locally (in cache) for use offline.

## [0.5.0-alpha] - 2022-02-05

### Added

- Push notifications: receive push notifications when the app is in background (or even in foreground)

## [0.4.4-alpha] - 2022-02-05 [YANKED]

### Added

- Sort locales by name in alphabetical order in locale selection dropdown
- Translations: German

### Changed

- Moved firebase and analytics account ownership to app@biociencias.es. (In a future, you may view the external services and the use that this app makes of your data in PRIVACY.md)

## [0.4.1-alpha] - 2022-02-05

### Fixed

- Android app splash screen set to CEEBI's

## [0.4.0-alpha] - 2022-02-05

### Added

- Icons to events set from the web itself
- Multiple speakers in events
- Provisional ripple effect for events

### Changed

- **BREAKING (Android)**: Changed package id to `es.biociencias.ceebi`

## [0.3.3-alpha] - 2022-02-04 [YANKED]

### Added

- Images for sponsors in about page
- Main structure of about page
- Changelog file
- Added error handling for image download without connection

### Changed

- Reduced characters in notification extract from 50 to 30
- Refactor code to centralize constants
- Clean up: `views/QRCode.vue`, `views/Settings.vue`
- Add 2 and 3 minutes options and remove 90 and 120 minutes options to event reminders time

### Fixed

- Images not properly loading from cache
- Showing _alt_ text in case images don't load

[unreleased]: https://github.com/biocienciasgrx/ceebi/compare/v1.1.2...HEAD
[1.3.15]: https://github.com/biocienciasgrx/ceebi/releases/tag/v1.3.15
[1.3.7]: https://github.com/biocienciasgrx/ceebi/releases/tag/v1.3.7
[1.1.2]: https://github.com/biocienciasgrx/ceebi/releases/tag/v1.1.2
[1.0.2]: https://github.com/biocienciasgrx/ceebi/releases/tag/v1.0.2
[1.0.0]: https://github.com/biocienciasgrx/ceebi/releases/tag/v1.0.0
[0.8.8-beta]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.8.8-beta
[0.8.7-beta]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.8.7-beta
[0.8.3-beta]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.8.3-beta
[0.8.1-beta]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.8.1-beta
[0.7.3-alpha]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.7.3-alpha
[0.6.5-alpha]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.6.5-alpha
[0.6.1-alpha]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.6.1-alpha
[0.5.1-alpha]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.5.1-alpha
[0.5.0-alpha]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.5.0-alpha
[0.4.4-alpha]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.4.4-alpha
[0.4.1-alpha]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.4.1-alpha
[0.4.0-alpha]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.4.1-alpha
[0.3.3-alpha]: https://github.com/biocienciasgrx/ceebi/releases/tag/v0.3.3-alpha
