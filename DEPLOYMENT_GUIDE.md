# Complete Deployment Guide: Codespace → GitHub → Cloudflare & Firebase

This guide covers the complete setup for deploying CredNet Social App from GitHub Codespaces to both Cloudflare Pages and Firebase Hosting.

## Architecture Overview

```
GitHub Codespace (Development)
    ↓
GitHub Repository (Source Control)
    ↓
GitHub Actions (CI/CD)
    ├─→ Cloudflare Pages (Primary Hosting)
    ├─→ Vercel (Alternative Hosting)
    └─→ Firebase Hosting (Alternative/Backup)
```

## Prerequisites

- GitHub account with this repository
- Cloudflare account (free tier works)
- Firebase/Google Cloud account
- Access to GitHub Codespaces

## Part 1: Firebase Setup

### 1.1 Create Firebase Project

1. Go to https://console.firebase.google.com/
2. Click "Add project" or select existing project
3. Enable the following services:
   - **Authentication** (Email/Password, Google OAuth, etc.)
   - **Firestore Database** (Start in production or test mode)
   - **Storage** (for user uploads)
   - **Hosting** (for deployment)

### 1.2 Get Firebase Configuration

1. Go to Project Settings (gear icon)
2. Under "Your apps", click the web icon `</>`
3. Register app (nickname: "crednetsocial-app")
4. Copy the configuration values:
   ```javascript
   apiKey: "..."
   authDomain: "..."
   projectId: "..."
   storageBucket: "..."
   messagingSenderId: "..."
   appId: "..."
   ```

### 1.3 Generate Firebase Service Account

1. Go to Project Settings → Service Accounts
2. Click "Generate new private key"
3. Save the JSON file securely (you'll need it for GitHub Secrets)

### 1.4 Install Firebase CLI (in Codespace)

```bash
npm install -g firebase-tools
firebase login --no-localhost
firebase init hosting
```

Select:
- Existing project
- Public directory: `build`
- Configure as single-page app: `Yes`
- Set up automatic builds with GitHub: `No` (we'll use GitHub Actions)

## Part 2: Cloudflare Setup

### 2.1 Get Cloudflare Credentials

1. Go to https://dash.cloudflare.com/
2. Click on your account name → Account ID (copy this)
3. Go to https://dash.cloudflare.com/profile/api-tokens
4. Click "Create Token"
5. Use template: "Edit Cloudflare Workers" or create custom with:
   - Permissions: `Account.Cloudflare Pages:Edit`
   - Account Resources: Include your account
6. Click "Continue to summary" → "Create Token"
7. Copy the token (you can only see it once!)

### 2.2 Create Cloudflare Pages Project

1. Go to https://dash.cloudflare.com/
2. Navigate to "Workers & Pages"
3. Click "Create application" → "Pages" tab
4. Connect to GitHub repository (or create direct upload)
5. Project name: `crednetsocial-app`
6. Build settings:
   - Framework preset: `Create React App`
   - Build command: `npm run build`
   - Build output directory: `build`
7. Add environment variables (same as Firebase config)

## Part 3: GitHub Secrets Setup

### 3.1 Add Repository Secrets

Go to: Repository → Settings → Secrets and variables → Actions → New repository secret

Add these secrets:

#### Firebase Secrets
- `FIREBASE_API_KEY` - from Firebase config
- `FIREBASE_AUTH_DOMAIN` - from Firebase config
- `FIREBASE_PROJECT_ID` - from Firebase config
- `FIREBASE_STORAGE_BUCKET` - from Firebase config
- `FIREBASE_MESSAGING_SENDER_ID` - from Firebase config
- `FIREBASE_APP_ID` - from Firebase config
- `FIREBASE_SERVICE_ACCOUNT` - entire JSON from service account file (paste all)

#### Cloudflare Secrets
- `CLOUDFLARE_API_TOKEN` - from Part 2.1
- `CLOUDFLARE_ACCOUNT_ID` - from Part 2.1

### 3.2 Verify Secrets

Run this in your Codespace to verify the format:

```bash
# Check if secrets are properly formatted (don't actually run with real values)
echo "Verifying secret format..."
# FIREBASE_SERVICE_ACCOUNT should be valid JSON
# All other values should be strings without quotes
```

## Part 4: Local Development in Codespace

### 4.1 Setup Local Environment

```bash
# Create local environment file
cp .env.local.example .env.local

# Edit .env.local with your Firebase credentials
nano .env.local
```

Add your Firebase config:
```env
REACT_APP_FIREBASE_API_KEY=your_actual_key
REACT_APP_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
REACT_APP_FIREBASE_PROJECT_ID=your_project_id
REACT_APP_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
REACT_APP_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
REACT_APP_FIREBASE_APP_ID=your_app_id
```

### 4.2 Install and Test

```bash
# Install dependencies
npm install

# Start development server
npm start

# Test production build
npm run build
npm run serve
```

### 4.3 Commit and Push

```bash
git add .
git commit -m "Setup deployment configuration"
git push origin main
```

## Part 5: Verify Deployment

### 5.1 Monitor GitHub Actions

1. Go to repository → Actions tab
2. Watch the "Deploy to Cloudflare Pages and Firebase" workflow
3. Check for any errors in:
   - Build job
   - Deploy-cloudflare job
   - Deploy-firebase job

### 5.2 Access Your Deployed Sites

After successful deployment:

**Cloudflare Pages:**
- Production: `https://crednetsocial-app.pages.dev`
- Preview (for PRs): `https://[branch].crednetsocial-app.pages.dev`

**Firebase Hosting:**
- Production: `https://[project-id].web.app` or custom domain
- Check in Firebase Console → Hosting

### 5.3 Common Deployment Issues

#### Build Fails
```bash
# Clean and rebuild locally
npm run clean
rm -rf node_modules package-lock.json
npm install
npm run build
```

#### Environment Variables Not Working
- Verify all `REACT_APP_*` prefixes are correct
- Check GitHub Secrets are named exactly as in workflow
- Ensure no trailing spaces in secret values

#### Firebase Deploy Fails
- Verify service account JSON is valid
- Check project ID matches exactly
- Ensure Firebase Hosting is enabled in console

#### Cloudflare Deploy Fails
- Verify API token has correct permissions
- Check account ID is correct (no spaces)
- Ensure project name matches exactly

## Part 6: Development Workflow

### 6.1 Feature Development

```bash
# Create feature branch
git checkout -b feature/your-feature

# Make changes in Codespace
# Test locally: npm start

# Commit and push
git add .
git commit -m "Add feature"
git push origin feature/your-feature

# Create Pull Request
# This triggers preview deployment to Cloudflare
```

### 6.2 Production Deployment

```bash
# Merge PR to main
# This automatically triggers:
# 1. Build in GitHub Actions
# 2. Deploy to Cloudflare Pages
# 3. Deploy to Firebase Hosting
```

## Part 7: Monitoring and Maintenance

### 7.1 Check Deployment Status

```bash
# Firebase
firebase hosting:sites:list

# Cloudflare (via dashboard)
# Go to Workers & Pages → crednetsocial-app → Deployments
```

### 7.2 Rollback if Needed

**Cloudflare:**
- Go to deployments
- Click "..." on previous deployment
- Select "Rollback to this deployment"

**Firebase:**
```bash
firebase hosting:rollback
```

### 7.3 Custom Domains

**Cloudflare:**
1. Workers & Pages → crednetsocial-app → Custom domains
2. Add domain and follow DNS instructions

**Firebase:**
```bash
firebase hosting:channel:deploy production
```

## Part 8: Security Best Practices

### 8.1 Environment Variables
- ✅ Never commit `.env` files
- ✅ Use GitHub Secrets for sensitive data
- ✅ Different configs for dev/staging/prod
- ✅ Rotate API tokens periodically

### 8.2 Firebase Security
- Configure Firestore rules properly
- Enable App Check for abuse prevention
- Use Firebase Auth for authentication
- Set up Storage rules

### 8.3 Cloudflare Security
- Enable Web Application Firewall (WAF)
- Set up rate limiting
- Use Access for authenticated routes
- Enable Bot Management (if needed)

## Part 9: Troubleshooting Commands

### Debug Build Issues
```bash
# Clear all caches
rm -rf node_modules build .cache
npm cache clean --force
npm install
npm run build

# Check for missing dependencies
npm audit
npm outdated
```

### Check GitHub Actions Logs
```bash
# Install GitHub CLI
gh workflow list
gh run list --workflow=deploy.yml
gh run view [run-id]
```

### Test Firebase Connection
```bash
firebase projects:list
firebase use [project-id]
firebase hosting:channel:list
```

## Part 10: Additional Resources

- [Cloudflare Pages Docs](https://developers.cloudflare.com/pages/)
- [Firebase Hosting Guide](https://firebase.google.com/docs/hosting)
- [GitHub Actions Documentation](https://docs.github.com/en/actions)
- [React Deployment](https://create-react-app.dev/docs/deployment/)

## Support

If you encounter issues:
1. Check GitHub Actions logs
2. Review Firebase Console logs
3. Check Cloudflare dashboard
4. Review this guide's troubleshooting section
5. Check repository issues for similar problems

---

**Last Updated:** January 2026
**Version:** 1.0.0
