# GitHub Secrets Setup - Quick Reference

## Required Secrets

Go to your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

### Firebase Configuration Secrets

Add these from your Firebase Console (Project Settings):

| Secret Name | Where to Find | Example Value |
|------------|---------------|---------------|
| `FIREBASE_API_KEY` | Firebase Console → Project Settings → General | `AIzaSyC...` |
| `FIREBASE_AUTH_DOMAIN` | Firebase Console → Project Settings → General | `your-project.firebaseapp.com` |
| `FIREBASE_PROJECT_ID` | Firebase Console → Project Settings → General | `your-project-id` |
| `FIREBASE_STORAGE_BUCKET` | Firebase Console → Project Settings → General | `your-project.appspot.com` |
| `FIREBASE_MESSAGING_SENDER_ID` | Firebase Console → Project Settings → General | `123456789` |
| `FIREBASE_APP_ID` | Firebase Console → Project Settings → General | `1:123:web:abc...` |
| `FIREBASE_SERVICE_ACCOUNT` | Firebase Console → Project Settings → Service Accounts → Generate Key | Entire JSON file content |

### Cloudflare Configuration Secrets

| Secret Name | Where to Find | Example Value |
|------------|---------------|---------------|
| `CLOUDFLARE_API_TOKEN` | Cloudflare Dashboard → Profile → API Tokens → Create Token | `abc123...` |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare Dashboard → Account Home (right sidebar) | `6b861ea059ef5162e22df6a87ea17d77` |

## Quick Setup Commands

### 1. Copy environment template and fill in values:
```bash
cp .env.local.example .env.local
nano .env.local  # or use your preferred editor
```

### 2. Install dependencies:
```bash
npm install
```

### 3. Verify deployment configuration:
```bash
./verify-deployment.sh
```

### 4. Test build locally:
```bash
npm run build
npm run serve
```

### 5. Push to GitHub (triggers deployment):
```bash
git add .
git commit -m "Setup deployment"
git push origin main
```

## How to Get Firebase Service Account JSON

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Select your project
3. Click the gear icon → Project settings
4. Go to "Service accounts" tab
5. Click "Generate new private key"
6. Save the downloaded JSON file
7. Copy the ENTIRE contents of the JSON file
8. Paste it as the value for `FIREBASE_SERVICE_ACCOUNT` secret in GitHub

**Important:** The secret value should be the complete JSON, including braces:
```json
{
  "type": "service_account",
  "project_id": "...",
  "private_key_id": "...",
  ...
}
```

## How to Get Cloudflare API Token

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Click on your profile icon → My Profile
3. Select "API Tokens" from the left sidebar
4. Click "Create Token"
5. Use "Edit Cloudflare Workers" template OR create custom:
   - **Permissions:** `Account.Cloudflare Pages:Edit`
   - **Account Resources:** Include → Your Account
6. Click "Continue to summary" → "Create Token"
7. **IMPORTANT:** Copy the token immediately (you can only see it once!)
8. Add it as `CLOUDFLARE_API_TOKEN` in GitHub Secrets

## Deployment URLs

After successful deployment, your app will be available at:

- **Cloudflare Pages:** `https://crednetsocial-app.pages.dev`
- **Firebase Hosting:** `https://[your-project-id].web.app`
- **Firebase Hosting (custom):** `https://[your-project-id].firebaseapp.com`

## Troubleshooting

### "Secret not found" error
- Check secret names match exactly (case-sensitive)
- No extra spaces in secret names
- Secrets are added to the correct repository

### Firebase deployment fails
- Verify service account JSON is valid (paste entire content)
- Ensure Firebase Hosting is enabled in your project
- Check project ID matches exactly

### Cloudflare deployment fails
- Verify API token has correct permissions
- Check account ID has no spaces
- Ensure project name matches (`crednetsocial-app`)

### Build fails
```bash
# Clean and reinstall
rm -rf node_modules package-lock.json build
npm install
npm run build
```

## Verification Checklist

Before pushing to GitHub:

- [ ] All secrets added to GitHub repository
- [ ] `.env.local` configured for local development
- [ ] `npm install` completed successfully
- [ ] `npm run build` works locally
- [ ] Firebase project created and configured
- [ ] Cloudflare account set up
- [ ] Git repository connected to GitHub
- [ ] Ran `./verify-deployment.sh` with no errors

## Need Help?

See the complete guide: [DEPLOYMENT_GUIDE.md](DEPLOYMENT_GUIDE.md)
