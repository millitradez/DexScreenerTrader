# DexScreenerTrader - iOS Safari Web Extension

Safari web extension for dexscreener trading tools, packaged as an iOS app.

## Project Structure

This repository contains an iOS Safari Web Extension that allows users to trade directly on Dexscreener from their iOS devices.

### Key Components

- **DexscreenerTrader/** - Main iOS app container
- **DexscreenerTrader Extension/** - Safari Web Extension implementation
- **DexscreenerTrader.xcodeproj** - Xcode project configuration

### Bundle Identifiers

- App: `com.millitradez.dexscreenertrader`
- Extension: `com.millitradez.dexscreenertrader.Extension`

## Building with Codemagic

This project is configured to build with Codemagic CI/CD. Two workflows are available:

### 1. Debug Build (`ios-safari-extension-debug`)
- Uses development provisioning profile
- Suitable for sideloading with AltStore
- Automatic code signing

### 2. Release Build (`ios-safari-extension-release`)
- Uses App Store distribution
- Automatically submits to TestFlight
- Suitable for App Store release

## Required Environment Variables

Configure these in Codemagic:

- `APP_STORE_CONNECT_ISSUER_ID` - App Store Connect API issuer ID
- `APP_STORE_CONNECT_KEY_IDENTIFIER` - App Store Connect API key ID
- `APP_STORE_CONNECT_PRIVATE_KEY` - App Store Connect API private key
- `CERTIFICATE_PRIVATE_KEY` - iOS certificate private key
- `APPLE_ID` - Apple Developer account email (tradezconsulting@icloud.com)

## Building Locally

### Prerequisites

- macOS with Xcode 15.0 or later
- iOS 15.0 or later deployment target

### Build Steps

1. Open `DexscreenerTrader.xcodeproj` in Xcode
2. Select your development team in the Signing & Capabilities tab
3. Select a target device or simulator
4. Build and run (⌘+R)

### Manual Archive and Export

```bash
# Archive
xcodebuild clean archive \
  -project DexscreenerTrader.xcodeproj \
  -scheme DexscreenerTrader \
  -configuration Release \
  -archivePath build/DexscreenerTrader.xcarchive

# Export IPA
xcodebuild -exportArchive \
  -archivePath build/DexscreenerTrader.xcarchive \
  -exportPath build/ipa \
  -exportOptionsPlist ExportOptionsRelease.plist
```

## Installing on iOS

### Method 1: AltStore (Sideloading)

1. Build using the Debug workflow
2. Download the `.ipa` file from artifacts
3. Install via AltStore on your device

### Method 2: TestFlight

1. Build using the Release workflow
2. The IPA is automatically uploaded to TestFlight
3. Install from TestFlight on your device

## Extension Features

- **Content Scripts**: Automatically inject trading functionality on dexscreener.com
- **Popup Interface**: Quick access to trading tools
- **Background Scripts**: Handle persistent operations
- **Storage**: Save user preferences and settings

## Development

### Extension Resources

All web extension files are located in:
```
DexscreenerTrader Extension/Resources/
├── manifest.json
├── script.js (content script)
├── popup.html
├── popup.css
├── popup.js
└── icon128.png
```

### Modifying the Extension

1. Edit files in `DexscreenerTrader Extension/Resources/`
2. Rebuild the project
3. Test in Safari on iOS Simulator or device

## Permissions

The extension requests:
- `activeTab` - Access to the current tab
- `storage` - Local data storage
- Domain access to `dexscreener.com`

## Support

Apple Developer Account: tradezconsulting@icloud.com

## License

Copyright © 2025 Millitradez

---

## 🚀 Original Development Notes

Develop on Windows:
1. Clone this repo
2. Open Chrome → Extensions → Developer Mode → **Load unpacked**
3. Select the project folder
4. Click the extension icon → "Test Jupiter API" to check connectivity
