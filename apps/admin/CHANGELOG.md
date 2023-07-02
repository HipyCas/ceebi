# CEEBI Admin App Changelog

## [2.0.0-rc.2]

### Added

- Performance monitoring using Firebase Performance Monitoring both the Android SDK and the web SDK, using the latter for custom traces
- Changing admin permissions for admins should now work
- Admins with the permission to modify admins can now make a user an admin
- When changing permissions from admin, if it gets an error from supabase, it will report them to firebase Crashlytics
- Autofocus email field on login page
- Hide login with biometrics button in login page if biometrics login is not enabled

### Fixed

- Activating login with biometrics in settings now properly saves user and password for login
- Deactivating biometric login now works

### Changed

- Removed some bits of code that were not being used

## [2.0.0-rc.1] - 2023/07/01

### Added

- Require login with your @biociencias.es account, relying on the website for confirmation
- Added option for biometric login
- Added users view, which loads all users from WordPress and allows you to modify permissions and change other stuff
- Granular permissions for notification edition
- Added notifications view, allowing to preview and modify notifications already sent to users as well as sending new ones through the different notification channels
- Granular permissions for registering attendance
- Redesign of the attendance registering view and integration with the new supabase backend
- Google Firebase project and Analytics dependencies, both in Gradle and in JS, yet to implement
- Google Crashlytics, implemented both in Vue app error handler and in window's onerror

### Changed

- Whole revamp of the UI and UX
- Remove unused `components/ExploreContainer.vue` from Ionic Vue template
- Reduced app size by specifying included capacitor plugins instead of including all
- Load notifications from WordPress instead of Supabase as they will be stored there
