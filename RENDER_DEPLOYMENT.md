# Render Deployment Guide

## GitHub Account Information
- **Username**: Kreemy29
- **Email**: krimirayen296@gmail.com
- **Repository**: https://github.com/Kreemy29/FLOWAI.git

## Render Deployment Settings

### Static Site Configuration

1. **Service Type**: Static Site
2. **Repository**: `https://github.com/Kreemy29/FLOWAI.git`
3. **Branch**: `main`
4. **Root Directory**: (leave empty - root of repo)
5. **Build Command**: `npm install && npm run build`
6. **Publish Directory**: `dist`
7. **Start Command**: (not needed for static sites)

### Manual Configuration Steps

1. Go to [Render Dashboard](https://dashboard.render.com)
2. Click "New +" → "Static Site"
3. Connect GitHub repository: `Kreemy29/FLOWAI`
4. Configure:
   - **Name**: `media-flow-maker` (or any name you prefer)
   - **Branch**: `main`
   - **Build Command**: `npm install && npm run build`
   - **Publish Directory**: `dist`
5. Click "Create Static Site"

### Environment Variables
No environment variables needed for this deployment.

### Build Settings Summary
- **Build Command**: `npm install && npm run build`
- **Publish Directory**: `dist`
- **Node Version**: Auto-detected (should be 18+)
- **Start Command**: Not required for static sites

## After Deployment

- Your site will be live at: `https://your-app-name.onrender.com`
- Admin login: `krimirayen296@gmail.com` / `password346139`
- All features will work: login, signup, admin dashboard, orders management

## Troubleshooting

If build fails:
- Check Node.js version (should be 18+)
- Verify all dependencies are in `package.json`
- Check build logs in Render dashboard

