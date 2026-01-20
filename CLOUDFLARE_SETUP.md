# Cloudflare Pages Deployment Setup

## Required Secrets

Add these secrets in your GitHub repository:
**Settings → Secrets and variables → Actions → New repository secret**

### 1. CLOUDFLARE_API_TOKEN
- Go to https://dash.cloudflare.com/profile/api-tokens
- Click "Create Token"
- Use "Edit Cloudflare Workers" template or create custom token with:
  - Permissions: `Account.Cloudflare Pages:Edit`
  - Account Resources: Include your account
- Copy the token and add it as `CLOUDFLARE_API_TOKEN`

### 2. CLOUDFLARE_ACCOUNT_ID
- Go to https://dash.cloudflare.com/
- Select your site or go to Workers & Pages
- Find your Account ID in the right sidebar
- Copy it and add as `CLOUDFLARE_ACCOUNT_ID`

## Project Configuration

The workflow is configured to:
- **Build directory**: `build` (React's default output)
- **Project name**: `crednetsocial-app`
- **Deploy on**: push to `main` and pull requests
- **Node version**: 18

## Local Testing

Test the production build locally:
```bash
npm run build
npm run serve
```

## Deployment Process

1. Push to `main` branch or create a PR
2. GitHub Actions will automatically:
   - Install dependencies
   - Build the React app
   - Deploy to Cloudflare Pages
3. Check deployment at: `https://crednetsocial-app.pages.dev`

## Troubleshooting

- **Build fails**: Check that all dependencies are in `package.json`
- **Wrong directory**: Ensure build outputs to `build/` not `out/`
- **Secrets not found**: Verify secrets are added with exact names
- **API token expired**: Generate a new token in Cloudflare dashboard
