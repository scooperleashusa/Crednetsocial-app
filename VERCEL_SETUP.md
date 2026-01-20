# Vercel Deployment Setup

## Required Configuration

Vercel is a great alternative to Cloudflare Pages and Firebase Hosting.

### 1. Project Configuration

The project is already configured with `vercel.json` to:
- **Build Command**: `npm run build`
- **Output Directory**: `build`
- **Single Page App Routing**: Redirects all requests to `index.html`

### 2. Environment Variables

You must add these environment variables in the Vercel Dashboard:
**Project Settings → Environment Variables**

| Variable Name | Example Value |
|---------------|---------------|
| `REACT_APP_FIREBASE_API_KEY` | `AIzaSyC...` |
| `REACT_APP_FIREBASE_AUTH_DOMAIN` | `your-project.firebaseapp.com` |
| `REACT_APP_FIREBASE_PROJECT_ID` | `your-project-id` |
| `REACT_APP_FIREBASE_STORAGE_BUCKET` | `your-project.appspot.com` |
| `REACT_APP_FIREBASE_MESSAGING_SENDER_ID` | `123456789` |
| `REACT_APP_FIREBASE_APP_ID` | `1:123:web:abc...` |

### 3. Deployment Steps

#### Via Vercel Dashboard (Recommended)
1. Go to [https://vercel.com/new](https://vercel.com/new)
2. Import your GitHub repository: `scooperleashusa/Crednetsocial-app`
3. Vercel should automatically detect the project as a React app.
4. Add the Environment Variables listed above.
5. Click **Deploy**.

#### Via Vercel CLI
If you have Vercel CLI installed:
```bash
npm i -g vercel
vercel login
vercel link
vercel env pull .env.local
vercel deploy --prod
```

## Benefits of Vercel Free Tier
- Automatic SSL
- Global CDN
- Fast Refresh on previews
- GitHub Integration (automatic deploys on push)
