# 🕐 24/7 Uptime Guide

This guide explains how to keep your Prank Wizard website running 24/7.

## Current Setup

- **Frontend**: Vercel (always-on, free tier available)
- **Backend**: Render (free tier spins down after 15 min inactivity)
- **Database**: MongoDB Atlas (recommended for 24/7) or Render MongoDB

## 🎯 Solution Options

### Option 1: External Monitoring Service (Recommended - FREE)

Use a free monitoring service to ping your backend every 5-14 minutes:

#### **UptimeRobot** (Recommended)
1. Sign up at https://uptimerobot.com (free tier: 50 monitors)
2. Click "Add New Monitor"
3. Configure:
   - **Monitor Type**: HTTP(s)
   - **Friendly Name**: Prank Wizard Backend
   - **URL**: `https://your-backend-url.onrender.com/health`
   - **Monitoring Interval**: 5 minutes (free tier minimum)
   - **Alert Contacts**: Add your email
4. Click "Create Monitor"

**Benefits:**
- ✅ Free forever
- ✅ Email alerts when service is down
- ✅ Prevents Render free tier spin-down
- ✅ Dashboard to monitor uptime
- ✅ Mobile app available

#### **Other Free Options:**
- **Pingdom** (free tier: 1 monitor)
- **StatusCake** (free tier: 10 monitors)
- **Better Uptime** (free tier available)

---

### Option 2: Upgrade Render Plan (Best for Production)

Upgrade to Render's **Starter Plan ($7/month)**:
- ✅ Always-on (no spin-down)
- ✅ Better performance
- ✅ More resources
- ✅ Priority support

**Steps:**
1. Go to Render Dashboard
2. Select your backend service
3. Click "Settings" → "Plan"
4. Upgrade to "Starter" plan

---

### Option 3: Self-Hosted Keep-Alive Script

Run the keep-alive script on a separate free service:

#### Using Render Cron Job (Free)
1. Create a new "Background Worker" on Render
2. Set environment variable: `BACKEND_URL=https://your-backend-url.onrender.com`
3. Set start command: `node scripts/keep-alive.js`
4. Deploy

#### Using GitHub Actions (Free)
Create `.github/workflows/keep-alive.yml`:

```yaml
name: Keep Backend Alive

on:
  schedule:
    - cron: '*/14 * * * *'  # Every 14 minutes
  workflow_dispatch:

jobs:
  ping:
    runs-on: ubuntu-latest
    steps:
      - name: Ping Health Endpoint
        run: |
          curl -f https://your-backend-url.onrender.com/health || exit 1
```

---

### Option 4: Use MongoDB Atlas (Recommended for Database)

For 24/7 database availability:

1. Sign up at https://www.mongodb.com/cloud/atlas (free tier: M0 cluster)
2. Create a free cluster
3. Get connection string
4. Update `MONGODB_URI` in Render environment variables

**Benefits:**
- ✅ Always-on database
- ✅ Free tier: 512MB storage
- ✅ Automatic backups
- ✅ Better performance than local MongoDB

---

## 🔧 Configuration Steps

### 1. Update Render Configuration

Your `render.yaml` already includes health check configuration. Make sure:
- Health check path is set: `/health`
- Auto-deploy is enabled

### 2. Set Up Monitoring

**Recommended**: Use UptimeRobot (see Option 1 above)

### 3. Configure Alerts

Set up email/SMS alerts in your monitoring service to get notified when:
- Service goes down
- Service is slow
- Health check fails

### 4. Database Setup

**For Production:**
- Use MongoDB Atlas (free tier available)
- Or upgrade Render MongoDB to paid tier

---

## 📊 Monitoring Your Uptime

### Check Backend Health

```bash
# Check health endpoint
curl https://your-backend-url.onrender.com/health

# Expected response:
{
  "status": "ok",
  "timestamp": "2024-01-01T00:00:00.000Z",
  "database": "connected",
  "uptime": 3600
}
```

### Monitor Logs

1. Go to Render Dashboard
2. Select your backend service
3. Click "Logs" tab
4. Monitor for errors and warnings

---

## 🚨 Troubleshooting

### Backend Keeps Spinning Down

**Solution**: Set up UptimeRobot or upgrade to paid tier

### Database Connection Issues

**Solution**: 
- Check MongoDB Atlas connection string
- Verify network access (IP whitelist)
- Check environment variables in Render

### Frontend Can't Connect to Backend

**Solution**:
- Verify `NEXT_PUBLIC_API_URL` in Vercel environment variables
- Check CORS settings in backend
- Verify backend is running (check Render dashboard)

---

## 💰 Cost Comparison

| Solution | Cost | Uptime | Best For |
|----------|------|--------|----------|
| UptimeRobot (Free) | $0 | 99%+ | Development, Testing |
| Render Starter | $7/mo | 99.9% | Production |
| Render Free + UptimeRobot | $0 | 99%+ | Budget Production |
| MongoDB Atlas Free | $0 | 99.9% | Database (Recommended) |

---

## ✅ Quick Setup Checklist

- [ ] Set up UptimeRobot monitor (or similar)
- [ ] Configure health check URL: `/health`
- [ ] Set monitoring interval: 5-14 minutes
- [ ] Add email alerts
- [ ] Test health endpoint manually
- [ ] Verify backend stays awake
- [ ] Set up MongoDB Atlas (if not already)
- [ ] Configure environment variables
- [ ] Test full application flow

---

## 📞 Support

If you encounter issues:
1. Check Render logs
2. Verify health endpoint responds
3. Check MongoDB connection
4. Review environment variables
5. Check UptimeRobot status

---

## 🎉 Result

After following this guide, your website will:
- ✅ Stay online 24/7
- ✅ Auto-restart if it crashes
- ✅ Send alerts when issues occur
- ✅ Maintain database connections
- ✅ Handle traffic spikes better

