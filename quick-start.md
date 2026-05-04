# 🚀 Quick Start - 3 Simple Steps

Get the demo running in under 5 minutes!

## Step 1: Install Dependencies

```bash
npm install
```

Wait for installation to complete (~2-3 minutes).

## Step 2: Build the Library

```bash
npm run build
```

This builds the session management library (~30 seconds).

## Step 3: Start the Demo

```bash
npm start
```

The app will open automatically at `http://localhost:4200/`

## ✅ You're Done!

Click **"Login to Start Demo"** and explore the features!

### What You Can Test (No Backend Needed):

✅ **Idle Timeout** - Stop interacting for 4 minutes  
✅ **Warning Dialog** - See warning at 1 minute remaining  
✅ **Multi-Tab Sync** - Open in multiple tabs, logout from one  
✅ **Session Extension** - Click "Extend Session" or move mouse  
✅ **Storage Inspection** - Check DevTools > Application > Local Storage  
✅ **Console Logs** - Open DevTools Console (F12) to see events  

## 🎯 Quick Commands

```bash
# Build library
npm run build

# Start demo app
npm start

# Run tests
npm test

# Build for production
ng build session-management --configuration production
```

## 📖 Full Documentation

- **[Complete Setup Guide](RUNNING_LOCALLY.md)** - Detailed instructions
- **[Library Documentation](projects/session-management/README.md)** - API reference
- **[Usage Examples](EXAMPLES.md)** - Code examples
- **[API Reference](API.md)** - Complete API docs

## ❓ Common Issues

### "Cannot find module 'session-management'"
**Solution:** Build the library first: `npm run build`

### Port 4200 already in use
**Solution:** Use different port: `ng serve demo-app --port 4300`

### Changes not reflecting
**Solution:** Rebuild library: `ng build session-management`

## 🎉 That's It!

You now have a fully functional session management demo running locally with **zero backend dependencies**!

---

**Made with Bob** 🤖