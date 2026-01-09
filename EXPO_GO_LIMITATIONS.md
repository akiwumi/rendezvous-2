# Expo Go Limitations & Solutions

## 🚨 Current Issue: Stripe Native Module Error

When running the app in **Expo Go**, you'll see this error:

```
ERROR: Invariant Violation: TurboModuleRegistry.getEnforcing(...): 
'OnrampSdk' could not be found.
```

This is **expected behavior** and **NOT a bug** in your code.

---

## 📱 Why This Happens

**Expo Go** is a development app that runs your code, but it **only includes a limited set of native modules**. Custom native modules like `@stripe/stripe-react-native` require native code compilation and **cannot run in Expo Go**.

### What Won't Work in Expo Go:
- ❌ Stripe payment processing
- ❌ Any custom native modules
- ❌ Features requiring native code modifications

### What Still Works in Expo Go:
- ✅ All UI components and screens
- ✅ Navigation
- ✅ Supabase integration (database, storage, auth)
- ✅ Most app features except payments
- ✅ Testing the overall app flow

---

## ✅ Solutions

### Option 1: Build a Development Client (Recommended)

A **development client** includes all native modules and allows full functionality:

```bash
# For iOS (requires Mac)
npx expo run:ios

# For Android
npx expo run:android
```

**Benefits:**
- ✅ Full Stripe payment functionality
- ✅ All native modules work
- ✅ Closest to production build
- ✅ Fast refresh still works

**Requirements:**
- iOS: Mac with Xcode installed
- Android: Android Studio installed

### Option 2: Build for Production Testing

```bash
# Build production version
eas build --platform ios --profile development
eas build --platform android --profile development

# Install on device and test
```

### Option 3: Test Without Stripe (Current Setup)

The app is already configured to **handle Stripe gracefully** when it's not available:

1. ✅ App runs in Expo Go without crashing
2. ✅ You can navigate to all screens
3. ✅ Payment button shows a helpful message
4. ✅ All other features work normally

When you tap "Pay Now" on a paid event, you'll see:

> "Stripe payments are not available in Expo Go. To test payments:
> 1. Build a development client: npx expo run:ios
> 2. Or test in production build"

---

## 🎯 Recommended Development Workflow

### Phase 1: Rapid Development (Current) ✅
- Use **Expo Go** for quick iteration
- Test UI, navigation, layouts
- Test Supabase features
- Skip payment testing for now

### Phase 2: Native Feature Testing
- Build a **development client** once
- Test Stripe payments
- Test any other native features
- Still get fast refresh

### Phase 3: Production Testing
- Build production versions
- Test on real devices
- Submit to TestFlight/Play Console

---

## 🔧 Current Status

The app has been **updated** to handle this gracefully:

### Changes Made:
1. ✅ Stripe imports wrapped in try-catch
2. ✅ Runtime check for Stripe availability
3. ✅ Helpful alert when payments not available
4. ✅ App continues running normally
5. ✅ No crashes or errors blocking development

### What You Can Do Now:
- ✅ Continue development in Expo Go
- ✅ Test all non-payment features
- ✅ Build UI and layouts
- ✅ Test Supabase integration
- ✅ Navigate all screens

### When You Need Payments:
```bash
# Option 1: iOS Development Build
npx expo run:ios

# Option 2: Android Development Build  
npx expo run:android

# Option 3: Production Build
eas build --platform ios --profile development
```

---

## 📝 Code Changes Explanation

### Before (Would Crash):
```typescript
import { StripeProvider, useStripe } from '@stripe/stripe-react-native';
// ❌ Crashes if module not available
```

### After (Handles Gracefully):
```typescript
// Check if Stripe is available
let StripeProvider = null;
let useStripe = null;
let isStripeAvailable = false;

try {
  const stripe = require('@stripe/stripe-react-native');
  StripeProvider = stripe.StripeProvider;
  useStripe = stripe.useStripe;
  isStripeAvailable = true;
} catch (error) {
  console.log('Stripe not available in Expo Go');
}
// ✅ Continues running if not available
```

---

## 🚀 Next Steps

### For Continued Development:
1. Keep using **Expo Go** for rapid iteration
2. Build features and test UI
3. Set up Supabase and test those features

### When Ready to Test Payments:
1. Install Xcode (Mac) or Android Studio
2. Run `npx expo run:ios` or `npx expo run:android`
3. Test full payment flow
4. Verify Stripe integration

### Before Production:
1. Test payments in development client
2. Verify all features work
3. Build production versions
4. Submit to app stores

---

## ❓ FAQ

### Q: Is this error breaking my app?
**A:** No, the error appears but the app continues running normally. All features except Stripe payments work in Expo Go.

### Q: Do I need to fix this now?
**A:** No, you can continue development. Only build a development client when you're ready to test payments.

### Q: Will this affect production?
**A:** No, production builds include all native modules. This only affects Expo Go development.

### Q: Can I ignore the error?
**A:** Yes, the error is logged but doesn't prevent development. You can safely continue building features.

### Q: How do I stop seeing the error?
**A:** Build a development client with `npx expo run:ios` or `npx expo run:android`.

---

## 📚 More Information

- **Expo Development Builds:** https://docs.expo.dev/develop/development-builds/introduction/
- **Stripe React Native:** https://stripe.dev/stripe-react-native/
- **EAS Build:** https://docs.expo.dev/build/introduction/

---

**TL;DR:** The error is expected in Expo Go. The app is configured to handle it gracefully. Continue developing normally, and build a development client when you need to test payments. 🎉
