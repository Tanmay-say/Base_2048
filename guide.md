# Base 2048 → Base Mini App Guide

This guide explains **exactly** what changed in the code and what **you** need to do to finish deploying Base 2048 as a Base / Farcaster Mini App.

Use this as a checklist from top to bottom.

---

## 1. Overview of what we implemented for you

We have already done the following in this repo:

1. **Installed & wired the Mini App SDK**
   - Added dependency: `@farcaster/miniapp-sdk`.
   - In `src/main.jsx`, we import the SDK and call `sdk.actions.ready()` once when the React tree mounts.

2. **Added the Mini App manifest**
   - Created `public/.well-known/farcaster.json` with a valid schema and **placeholder URLs** using `https://YOUR_DOMAIN_HERE`.
   - `accountAssociation` is present but empty; you will fill this via Base tools later.

3. **Added `fc:miniapp` meta tag for rich embeds**
   - Updated `index.html` `<head>` to include a `<meta name="fc:miniapp" ...>` tag with placeholder URLs.

4. **Kept your existing app logic intact**
   - Wallet integration (wagmi/Web3Modal) and game logic were not changed.
   - PWA setup (service worker, icons, manifest) still works.

The remaining steps are mostly **configuration + deployment + verification**.

---

## 2. Choose your production domain

Before you can finish the Mini App configuration, you need to know **where** the app will live in production.

Examples:
- `https://base2048.yourdomain.com/`
- `https://yourdomain.com/base2048/`

### Your task
1. Decide the exact **public HTTPS URL** for the app root.
2. For the rest of this guide, we’ll refer to it as:
   - `https://YOUR_DOMAIN_HERE/`

You’ll replace `YOUR_DOMAIN_HERE` in a couple of places in the codebase.

---

## 3. Update the Mini App manifest: `public/.well-known/farcaster.json`

File: `public/.well-known/farcaster.json`

This file is served at:

```text
https://YOUR_DOMAIN_HERE/.well-known/farcaster.json
```

### 3.1. Replace placeholder URLs

Open `public/.well-known/farcaster.json` and update:

- `homeUrl`
- `iconUrl`
- `splashImageUrl`
- `heroImageUrl`
- `screenshotUrls[]`
- `ogImageUrl`

Replace every `https://YOUR_DOMAIN_HERE` with your **real** domain.

If you don’t yet have real images for `hero` / `screenshot` / `og`, you can:
- Temporarily point them to existing images (for example, your 512x512 icon), or
- Upload simple PNGs/JPGs to your hosting and use those URLs.

### 3.2. Check the descriptive fields

Still in `farcaster.json`, review these fields and customize as you like:

- `name`: e.g. `"Base 2048"` (already set).
- `subtitle`: short tagline.
- `description`: one or two sentences describing the app.
- `tagline`: short marketing blurb.
- `primaryCategory`: e.g. `"gaming"`.
- `tags`: keywords like `"game"`, `"puzzle"`, `"2048"`, `"base"`, `"miniapp"`.

You can ship with the defaults, but it’s better to tune them for your branding.

Do **not** add comments inside the JSON; it must remain valid JSON.

---

## 4. Fill `accountAssociation` after deployment

The `accountAssociation` section in `farcaster.json` proves which **Base account** owns this mini app.

Right now it looks like this:

```json
{
  "accountAssociation": {
    "header": "",
    "payload": "",
    "signature": ""
  },
  ...
}
```

You’ll fill this **after** your app is deployed and accessible over HTTPS.

### 4.1. Deploy first (temporary values are okay)

You can deploy the app with `accountAssociation` empty – the Base tools will still be able to read your manifest and then help you fill this section.

### 4.2. Generate accountAssociation via Base tools

After deployment (see Section 8):

1. Open the Base / Farcaster **Mini App association tool** (from the Base docs).
2. Enter your app URL: `https://YOUR_DOMAIN_HERE/`.
3. Follow the instructions to sign and generate the three fields:
   - `header`
   - `payload`
   - `signature`
4. Paste the generated strings back into `public/.well-known/farcaster.json`.
5. Redeploy (or otherwise update) your production hosting so the updated JSON is live.

From that point on, your app will be considered **owned/verified** by that Base account.

---

## 5. `fc:miniapp` meta tag: check and update

File: `index.html`

We added the following block inside `<head>`:

```html
<meta
  name="fc:miniapp"
  content='{
    "version": "next",
    "imageUrl": "https://YOUR_DOMAIN_HERE/og/embed-card.png",
    "button": {
      "title": "Play Base 2048",
      "action": {
        "type": "launch_miniapp",
        "name": "Base 2048",
        "url": "https://YOUR_DOMAIN_HERE/"
      }
    }
  }'
/>
```

### Your tasks

1. Replace `https://YOUR_DOMAIN_HERE/` with your real domain in:
   - `imageUrl`
   - `button.action.url`

2. Ensure `imageUrl` points to a **real image** (PNG or JPG) that will be used in rich embeds.
   - Ideal: create an `og/embed-card.png` under your hosting (e.g. output folder) and use that.

3. Keep the JSON structure the same:
   - `version` must be `"next"`.

If you change the JSON, keep it valid (double quotes, no trailing commas).

---

## 6. What changed in the React code (Mini App SDK wiring)

### 6.1. New dependency in `package.json`

In `package.json` we added:

```json
"@farcaster/miniapp-sdk": "^0.2.1"
```

Run this after pulling changes:

```bash
npm install
```

### 6.2. Entrypoint change: `src/main.jsx`

We updated `src/main.jsx` so that:

- It imports the Mini App SDK.
- It wraps your `<App />` tree in a small component that calls `sdk.actions.ready()` once on mount.

The key pieces (simplified) look like this:

```jsx
import { StrictMode, useEffect } from 'react';
import { createRoot } from 'react-dom/client';
import { sdk } from '@farcaster/miniapp-sdk';
import App from './App.jsx';

const RootWithMiniAppReady = () => {
  useEffect(() => {
    try {
      sdk.actions.ready();
    } catch (err) {
      console.warn('[MiniApp] sdk.actions.ready() failed or is unavailable:', err);
    }
  }, []);

  return (
    <StrictMode>
      {/* existing WagmiProvider, QueryClientProvider, etc. */}
      <App />
    </StrictMode>
  );
};

createRoot(document.getElementById('root')).render(<RootWithMiniAppReady />);
```

This ensures that when the app loads inside the Base / Farcaster client, it knows exactly when to stop showing the loading shell and display your UI.

You do **not** need to change anything here unless you want to conditionally call `sdk.actions.ready()` only when inside a mini app context.

---

## 7. Local sanity check

After updating domains/URLs as described above, run a quick local check:

```bash
npm install   # if you haven’t since pulling these changes
npm run dev
```

Verify:

1. The app still loads at your local dev URL (e.g. `http://localhost:5173/`).
2. Game, wallet connection, and navigation behave as before.
3. No errors in the browser console related to `@farcaster/miniapp-sdk`.

Note: in a normal browser, `sdk.actions.ready()` should be safe – worst case, the catch block logs a warning.

---

## 8. Build and deploy to your production domain

When you’re ready to deploy:

```bash
npm run build
```

This produces a static bundle (typically in `dist/`). Deploy this to your hosting provider (Vercel, Netlify, Cloudflare Pages, S3 + CloudFront, etc.) so that:

- `https://YOUR_DOMAIN_HERE/` serves the app.
- `https://YOUR_DOMAIN_HERE/.well-known/farcaster.json` serves the manifest file.

Confirm both URLs work in your browser.

---

## 9. Use the Base Mini App Preview / Association tools

With your app live at `https://YOUR_DOMAIN_HERE/`:

1. Open the Base Mini App **Preview** tool (linked from the official docs).
2. Paste your app URL.
3. Verify in the tool that:
   - The embed preview looks correct (image + "Play Base 2048" button).
   - The mini app launches successfully and shows your game.
   - The manifest (`farcaster.json`) is parsed correctly.

Then, open the **Account Association** tool:

1. Enter `https://YOUR_DOMAIN_HERE/`.
2. Follow the instructions to sign with your Base account.
3. Copy the generated `header`, `payload`, and `signature`.
4. Paste them into `public/.well-known/farcaster.json` under `accountAssociation`.
5. Redeploy the updated JSON.

Re-run the Preview tool to confirm that the app now shows as **associated** with your account.

---

## 10. Publish via a post in the Base app

Once everything looks correct in the Preview tool:

1. Open the Base app on your device.
2. Create a new post that includes your app URL, e.g.: `https://YOUR_DOMAIN_HERE/`.
3. When you post, Base / Farcaster will render the embed card using your `fc:miniapp` metadata.
4. Tapping the button on that card should launch your mini app using the configuration from `farcaster.json`.

At this point, your Base 2048 app is effectively a **Base Mini App**.

---

## 11. Optional next steps / tweaks

Some ideas for future improvements (not required to be a valid mini app):

- Detect whether you’re running **inside** a mini app and adjust UI accordingly (e.g. hide external links, tweak layout).
- Add analytics (respecting Base / Farcaster guidelines) to measure engagement.
- Customize screenshots, hero image, and OG image to better match your branding.
- Add a dedicated "Share" button inside the game that copies your mini app URL.

For now, if you follow the steps in this `guide.md` from top to bottom, you’ll have a fully functioning Base Mini App version of Base 2048.
