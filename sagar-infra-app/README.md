# Sagar Infra Mobile App

React Native + Expo Router Android app for the Sagar Infra real-estate platform. It uses the existing Express/MongoDB backend APIs for properties, auth, leads, and favorites.

## 1. Install Dependencies

```bash
cd sagar-infra-app
npm install
```

## 2. Create Environment File

Create `sagar-infra-app/.env`:

```env
EXPO_PUBLIC_API_URL=http://YOUR_LOCAL_IP:5000
```

Use the backend origin only. Do not add `/api` in the recommended setup. The mobile app appends exactly one `/api` internally.

Use your computer LAN IP for Android physical devices, not `localhost`. Example:

```env
EXPO_PUBLIC_API_URL=http://192.168.1.10:5000
```

To find your Windows LAN IPv4 address:

```powershell
ipconfig
```

Look for the active Wi-Fi or Ethernet adapter and copy the `IPv4 Address`, usually something like `192.168.1.10`.

Your Android phone and computer must be on the same Wi-Fi/network when testing against a local backend. `localhost` on a phone means the phone itself, not your computer, so it will not reach the Node.js backend running on your PC.

For production, set it to your deployed backend origin:

```env
EXPO_PUBLIC_API_URL=https://your-backend-domain.com
```

Use the production deployed backend URL when testing a release build, sharing the app outside your local network, or building for Google Play. The app also safely accepts a value ending in `/api`, but the recommended format is still the backend origin without `/api`.

## 3. Start Expo

```bash
npx expo start
```

## 4. Test On Android With Expo Go

1. Install Expo Go from the Play Store.
2. Make sure your phone and computer are on the same Wi-Fi.
3. Run `npx expo start`.
4. Scan the QR code.
5. Confirm the backend is running and `EXPO_PUBLIC_API_URL` points to your computer LAN IPv4 address.

## 5. Optional Development Build

Install EAS CLI:

```bash
npm install -g eas-cli
eas login
```

Create a development build:

```bash
eas build --platform android --profile development
```

## 6. Configure EAS Build

This project includes `eas.json` with:

- `development`: internal APK with development client
- `preview`: internal APK
- `production`: Android App Bundle (`.aab`) for Play Store

If this is the first EAS setup for the project, run:

```bash
eas build:configure
```

## 7. Build Android AAB

```bash
eas build --platform android --profile production
```

## 8. Play Store Preparation

Configured in `app.json`:

- App name: `Sagar Infra`
- Android package: `in.sagarinfra.app`
- Version: `1.0.0`
- Android `versionCode`: `1`
- Icon, splash, and adaptive icon placeholders use files from `assets/images`

Before Google Play submission:

1. Replace placeholder icon and splash assets with final Sagar Infra branding.
2. Set production `EXPO_PUBLIC_API_URL` to the deployed backend origin.
3. Confirm the deployed backend is reachable from a real Android device.
4. Test login, register, property listing, details, inquiry, and favorites on a real Android device.
5. Build the production AAB with EAS.
6. Upload the AAB to Google Play Console.
7. Complete store listing, privacy policy, app access, content rating, data safety, and target audience forms.

## Useful Commands

```bash
npm run typecheck
npm run lint
npx expo start
npx expo start --android
eas build --platform android --profile production
```

## Environment Variables

Required:

```env
EXPO_PUBLIC_API_URL=http://YOUR_BACKEND_ORIGIN
```

Examples:

```env
EXPO_PUBLIC_API_URL=http://10.213.45.167:5000
EXPO_PUBLIC_API_URL=https://your-production-backend.com
```

Do not use this for physical Android testing:

```env
EXPO_PUBLIC_API_URL=http://localhost:5000
```

Do not put private backend secrets, MongoDB credentials, or JWT secrets in the mobile app. Only public Expo variables prefixed with `EXPO_PUBLIC_` are safe for client-side configuration.

## Production Backend Configuration

Use a verified public HTTPS backend origin for production mobile builds:

```env
EXPO_PUBLIC_API_URL=https://your-production-backend.com
```

Do not put `/api` in the recommended value. The app appends exactly one `/api`, so these requests are produced:

```text
GET  https://your-production-backend.com/api/health
GET  https://your-production-backend.com/api/property
GET  https://your-production-backend.com/api/property/:id
POST https://your-production-backend.com/api/auth/login
POST https://your-production-backend.com/api/auth/register
GET  https://your-production-backend.com/api/auth/me
GET  https://your-production-backend.com/api/favorites
POST https://your-production-backend.com/api/favorites/:propertyId
DELETE https://your-production-backend.com/api/favorites/:propertyId
POST https://your-production-backend.com/api/leads
```

For EAS production builds, set the public API URL in EAS before building:

```bash
eas env:create --environment production --name EXPO_PUBLIC_API_URL --value https://your-production-backend.com --visibility public
eas build --platform android --profile production
```

Only use the LAN URL for local Expo testing:

```env
EXPO_PUBLIC_API_URL=http://10.213.45.167:5000
```
