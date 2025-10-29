# Codemagic Setup Instructions

This document provides step-by-step instructions for configuring Codemagic CI/CD to build the DexscreenerTrader iOS Safari Web Extension.

## Prerequisites

Before setting up Codemagic, ensure you have:

1. An Apple Developer account (tradezconsulting@icloud.com)
2. A Codemagic account connected to this GitHub repository
3. App Store Connect API credentials

## Step 1: Connect Repository to Codemagic

1. Log in to [Codemagic](https://codemagic.io/)
2. Click "Add application"
3. Connect to GitHub and select `millitradez/DexScreenerTrader`
4. Codemagic will automatically detect the `codemagic.yaml` file

## Step 2: Configure Code Signing

### Option A: Automatic Code Signing (Recommended)

1. In Codemagic, go to your app settings
2. Navigate to "Code signing identities"
3. Click "iOS code signing"
4. Select "Automatic code signing"
5. Add your Apple Developer account credentials
6. Codemagic will automatically manage certificates and provisioning profiles

### Option B: Manual Code Signing

1. Generate certificates and provisioning profiles in Apple Developer Portal
2. Download the certificates and profiles
3. In Codemagic settings, upload:
   - iOS Distribution Certificate (.p12)
   - Provisioning Profile (.mobileprovision)
4. Add the certificate password as an environment variable

## Step 3: Configure App Store Connect API

1. Go to [App Store Connect](https://appstoreconnect.apple.com)
2. Navigate to "Users and Access" → "Keys"
3. Generate a new API key with "Developer" or "Admin" access
4. Download the API key (.p8 file)
5. Note the Key ID and Issuer ID

## Step 4: Add Environment Variables in Codemagic

Go to your app settings in Codemagic and add the following environment variables:

### Required Variables

| Variable Name | Description | Where to Find |
|--------------|-------------|---------------|
| `APP_STORE_CONNECT_ISSUER_ID` | Issuer ID from App Store Connect | App Store Connect → Users and Access → Keys |
| `APP_STORE_CONNECT_KEY_IDENTIFIER` | Key ID from App Store Connect | App Store Connect → Users and Access → Keys |
| `APP_STORE_CONNECT_PRIVATE_KEY` | Contents of the .p8 API key file | Downloaded .p8 file (paste entire contents) |
| `CERTIFICATE_PRIVATE_KEY` | iOS certificate password | Password you set when creating the certificate |
| `APPLE_ID` | Apple Developer account email | `tradezconsulting@icloud.com` |

### How to Add Variables

1. In Codemagic, go to your app settings
2. Click "Environment variables"
3. Click "Add variable"
4. For each variable:
   - Enter the variable name
   - Enter/paste the value
   - Check "Secure" for sensitive values
   - Click "Add"

## Step 5: Configure Bundle Identifiers in Apple Developer Portal

1. Go to [Apple Developer Portal](https://developer.apple.com)
2. Navigate to "Certificates, Identifiers & Profiles"
3. Click "Identifiers" → "+" to add new
4. Register the following App IDs:
   - `com.millitradez.dexscreenertrader` (Main app)
   - `com.millitradez.dexscreenertrader.Extension` (Safari extension)

## Step 6: Trigger a Build

### Debug Build (for AltStore)

1. In Codemagic, select the `ios-safari-extension-debug` workflow
2. Click "Start new build"
3. Select the branch to build
4. Click "Start build"
5. Download the IPA from artifacts when complete

### Release Build (for TestFlight)

1. In Codemagic, select the `ios-safari-extension-release` workflow
2. Click "Start new build"
3. The IPA will be automatically uploaded to TestFlight
4. You'll receive an email when the build is available

## Step 7: Configure Automatic Builds (Optional)

To enable automatic builds on every commit:

1. In Codemagic, go to your app settings
2. Click "Build triggers"
3. Enable "Trigger on push"
4. Select which branches should trigger builds
5. Choose which workflow to run

## Workflow Overview

### ios-safari-extension-debug
- **Purpose**: Development builds for sideloading
- **Distribution**: Development provisioning profile
- **Output**: IPA file suitable for AltStore
- **Duration**: ~5-10 minutes
- **Notifications**: Email on success/failure

### ios-safari-extension-release
- **Purpose**: Production builds for App Store
- **Distribution**: App Store provisioning profile
- **Output**: IPA file uploaded to TestFlight
- **Duration**: ~5-10 minutes
- **Notifications**: Email on success/failure + TestFlight ready

## Troubleshooting

### Build Fails: "No matching provisioning profile found"

**Solution**: 
1. Ensure bundle identifiers are registered in Apple Developer Portal
2. Verify code signing settings in Codemagic
3. Try regenerating provisioning profiles

### Build Fails: "Xcodebuild command failed"

**Solution**:
1. Check the build logs for specific errors
2. Verify the Xcode project opens correctly locally
3. Ensure all required files are committed to the repository

### Export Fails: "Invalid export options"

**Solution**:
1. Verify export options plist files are correct
2. Check that DEVELOPMENT_TEAM is set (if using manual code signing)
3. Ensure proper entitlements are configured

### TestFlight Upload Fails

**Solution**:
1. Verify App Store Connect API credentials are correct
2. Check that the bundle identifier matches an existing app in App Store Connect
3. Ensure your API key has sufficient permissions

## Support

For Codemagic-specific issues:
- Documentation: https://docs.codemagic.io/
- Support: https://codemagic.io/contact/

For Apple Developer issues:
- Developer Support: https://developer.apple.com/support/
- Account: tradezconsulting@icloud.com

## Build Artifacts

After a successful build, you'll find:

### Debug Build
- `build/debug-ipa/DexscreenerTrader.ipa` - IPA for sideloading
- `build/DexscreenerTrader.xcarchive` - Xcode archive

### Release Build
- `build/release-ipa/DexscreenerTrader.ipa` - IPA for App Store
- `build/DexscreenerTrader.xcarchive` - Xcode archive

## Installing the App

### Via AltStore (Debug builds)
1. Install AltStore on your iOS device
2. Download the Debug IPA from Codemagic artifacts
3. In AltStore, tap "+" and select the IPA
4. The app will be installed on your device

### Via TestFlight (Release builds)
1. Install TestFlight from the App Store
2. Wait for the email notification that the build is ready
3. Open the email and click "View in TestFlight"
4. Install the app from TestFlight

## Enabling the Safari Extension

After installing the app:

1. Open the DexscreenerTrader app
2. Tap "Open Safari Settings"
3. In Safari Settings, go to "Extensions"
4. Enable "Dexscreener Trader Extension"
5. Tap the extension and enable it for dexscreener.com
6. The extension is now active in Safari

## Next Steps

1. Complete the Codemagic setup following these instructions
2. Trigger a test build to verify the configuration
3. Install the app on a test device
4. Test the Safari extension functionality
5. Configure automatic builds for continuous deployment
