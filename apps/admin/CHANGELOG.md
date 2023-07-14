# CEEBI Admin App Changelog

All notable changes to this project will be documented in this file.

The format is based on [Keep a Changelog](https://keepachangelog.com/en/1.0.0/), and this project adheres to [Semantic Versioning](https://semver.org/spec/v2.0.0.html).

## [Unreleased]

### Added

- Icon added for both iOS and Android

### Fixed

- If a user is not synced with Supabase, instead of failing to load details it only shows WP data and shows a banner that user is not synced

### Changed

- Removed unused dependencies and optimized other
- Improved error logging on overwritten error and warning handlers

## [2.0.0-rc.4]

### Added

- All catch clauses now log to Firebase Crashlytics
- Further error reporting to Crashlytics in more places, both manual and in catch clauses
- In general, more error catching and reporting
- Gradient to attendance progress
- Include all JS Sourcemap to make error debugging in Crashlytics easier

### Fixed

- Added @capacitor/browser plugin to Capacitor included plugins, fixing links in notifications not opening
- Cleaned up code and some warnings
- Permissions in WordPress for volunteer accounts

### Changed

- Cleaned up some user list code

## [2.0.0-rc.3] - 2023/07/09

### Added

- Option to modify whether a person presents a poster to the CEEBI (so they can download the certificate)
- You can only modify users (including yourself) permissions if you have permission to modify them (`allow_admins` permission)
- Notification editor now uploads notification to the web and publishes them to the app (not to push neither in Android nor in iOS)
- Removed lines in popover account menu
- Permission check when accessing user and attendance list
- More checks for notification permission
- Option to delete notifications
- Attendance details for all users from attendance page, same as `assistance-check` for last year except for QR but adding the option to manually add or delete attendance
- Check for permission when directly accessing a user or attendance detail page

### Fixed

- Removed detail arrow in button item to change user to admin

### Changed

- User virtual list for users and attendance list page are now the same component
- Search in users and attendance list pages now support searching also email and they ignore case

## [2.0.0-rc.2] - 2023/07/02

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
