# 🎯 How to Enable GitHub Actions - Step by Step

## 📍 Where is GitHub Actions?

Based on your screenshot, I can see you're in **Settings → General**. Here's exactly where to find GitHub Actions:

---

## 🔍 Step-by-Step Visual Guide

### **Step 1: Go to Repository Settings**

You're already here! ✅ (I can see "session-angular" repository name)

```
https://github.com/kundan594/session-angular/settings
```

### **Step 2: Find "Actions" in Left Sidebar**

Look at the **left sidebar** under **"Code and automation"** section:

```
Left Sidebar:
├── Access
│   ├── Collaborators
│   └── Moderation options
├── Code and automation
│   ├── Branches
│   ├── Tags
│   ├── Rules
│   ├── Actions  ← ← ← CLICK HERE!
│   │   ├── General
│   │   ├── Runners
│   │   └── OIDC
│   ├── Models
│   ├── Webhooks
│   ├── Copilot
│   ├── Environments
│   ├── Codespaces
│   └── Pages
```

**Click on "Actions"** (it's between "Rules" and "Models")

### **Step 3: Enable GitHub Actions**

After clicking "Actions", you'll see:

1. **Actions permissions** section
2. Select: **"Allow all actions and reusable workflows"**
3. Click **Save**

---

## 🌐 Step 4: Enable GitHub Pages

Now scroll down in the left sidebar to find **"Pages"**:

```
Left Sidebar:
├── ...
├── Codespaces
└── Pages  ← ← ← CLICK HERE!
```

**Click on "Pages"**, then:

1. Under **"Source"**, select: **"GitHub Actions"**
2. Click **Save**

---

## 📋 Quick Navigation Links

Use these direct links:

1. **Enable Actions**: 
   ```
   https://github.com/kundan594/session-angular/settings/actions
   ```

2. **Enable Pages**:
   ```
   https://github.com/kundan594/session-angular/settings/pages
   ```

3. **View Workflows** (after pushing):
   ```
   https://github.com/kundan594/session-angular/actions
   ```

---

## 🎯 Complete Setup Checklist

### ✅ **Part 1: Enable Actions (in Settings)**

- [ ] Go to: Settings → Actions (left sidebar)
- [ ] Select: "Allow all actions and reusable workflows"
- [ ] Click: Save

### ✅ **Part 2: Enable Pages (in Settings)**

- [ ] Go to: Settings → Pages (left sidebar)
- [ ] Under "Source", select: "GitHub Actions"
- [ ] Click: Save

### ✅ **Part 3: Push Workflow Files**

```bash
# In your local project directory
cd C:\Users\061295CA8\Desktop\angular-session-workspace

# Add workflow files
git add .github/workflows/

# Commit
git commit -m "ci: add GitHub Actions workflows"

# Push
git push origin main
```

### ✅ **Part 4: Verify Deployment**

- [ ] Go to: https://github.com/kundan594/session-angular/actions
- [ ] Wait for workflow to complete (green checkmark)
- [ ] Visit: https://kundan594.github.io/session-angular/

---

## 🖼️ Visual Reference

### **Your Current Location (from screenshot):**
```
Settings → General ← You are here
```

### **Where You Need to Go:**
```
Settings → Actions ← Go here first
Settings → Pages   ← Then go here
```

---

## 📸 What You Should See

### **In Actions Settings:**

```
┌─────────────────────────────────────────────┐
│  Actions permissions                        │
│                                             │
│  ○ Disable actions                          │
│  ● Allow all actions and reusable workflows │ ← Select this
│  ○ Allow [org] actions and reusable...     │
│                                             │
│  [Save] button                              │
└─────────────────────────────────────────────┘
```

### **In Pages Settings:**

```
┌─────────────────────────────────────────────┐
│  Build and deployment                       │
│                                             │
│  Source:                                    │
│  ┌─────────────────────────────────────┐   │
│  │ GitHub Actions                      │ ← Select this
│  └─────────────────────────────────────┘   │
│                                             │
│  [Save] button                              │
└─────────────────────────────────────────────┘
```

---

## 🚀 After Setup

Once you've enabled Actions and Pages, and pushed the workflow files:

1. **Automatic Trigger**: GitHub Actions will run automatically
2. **Build Time**: 2-3 minutes
3. **Live Site**: https://kundan594.github.io/session-angular/

---

## 🔍 How to Check if Actions is Enabled

### **Method 1: Check Actions Tab**

Go to your repository main page:
```
https://github.com/kundan594/session-angular
```

Look at the top tabs:
```
Code | Issues | Pull requests | Actions | Projects | ...
                                  ↑
                            Click here
```

If you see the **Actions** tab, it's enabled!

### **Method 2: Check Settings**

Go to:
```
Settings → Actions → General
```

If you see options to configure Actions, it's enabled!

---

## 🐛 Troubleshooting

### **Problem: Can't find "Actions" in sidebar**

**Solution:**
1. Make sure you're in **Settings** (not Code or Issues)
2. Scroll down in the left sidebar
3. Look under "Code and automation" section
4. It's between "Rules" and "Models"

### **Problem: Actions tab is grayed out**

**Solution:**
1. You might not have admin access
2. Check if you're the repository owner
3. If it's an organization repo, check org settings

### **Problem: Workflow files not triggering**

**Solution:**
1. Ensure files are in `.github/workflows/` directory
2. Check file names: `deploy.yml` and `ci.yml`
3. Verify you pushed to `main` branch
4. Check Actions is enabled in Settings

---

## 📞 Need Help?

If you still can't find it:

1. **Take a screenshot** of your Settings page
2. **Check the URL** - should be: `https://github.com/kundan594/session-angular/settings`
3. **Look for "Actions"** in the left sidebar under "Code and automation"

---

## 🎉 Success Indicators

You'll know it's working when:

✅ Actions tab appears in repository
✅ Workflow runs appear after pushing
✅ Green checkmark on successful deployment
✅ Demo site is live at: https://kundan594.github.io/session-angular/

---

**Created**: 2026-05-05  
**Repository**: https://github.com/kundan594/session-angular