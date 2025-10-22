# MongoDB Atlas Setup Guide

## 🎯 Quick Setup Steps

### 1. Create MongoDB Atlas Account
1. Go to https://www.mongodb.com/atlas
2. Click "Try Free" or "Sign In"
3. Create account with your email: `ronitwindows04@gmail.com`

### 2. Create New Project
1. Click "New Project"
2. Name: `Stock Tracker App`
3. Click "Next" → "Create Project"

### 3. Create Database Cluster
1. Click "Build a Database"
2. Choose **"M0 Sandbox"** (FREE tier)
3. Cloud Provider: **AWS** (recommended)
4. Region: Choose closest to your users
5. Cluster Name: `stock-tracker-cluster`
6. Click "Create Cluster" (takes 1-3 minutes)

### 4. Create Database User
1. You'll see "Security Quickstart"
2. Choose "Username and Password"
3. Username: `stocktracker`
4. Password: Click "Autogenerate Secure Password" (SAVE THIS!)
5. Click "Create User"

### 5. Add IP Address
1. Click "Add My Current IP Address"
2. Also click "Add a Different IP Address"
3. Enter: `0.0.0.0/0` (allows access from anywhere)
4. Description: "Allow all IPs for Vercel"
5. Click "Add Entry"
6. Click "Finish and Close"

### 6. Get Connection String
1. Click "Connect" on your cluster
2. Choose "Drivers"
3. Select "Node.js" and version "4.1 or later"
4. Copy the connection string
5. It looks like: `mongodb+srv://stocktracker:<password>@stock-tracker-cluster.xxxxx.mongodb.net/?retryWrites=true&w=majority`

### 7. Prepare Final Connection String
Replace `<password>` with your actual password and add database name:
```
mongodb+srv://stocktracker:YOUR_ACTUAL_PASSWORD@stock-tracker-cluster.xxxxx.mongodb.net/stocks_app?retryWrites=true&w=majority
```

## 🔧 Add to Vercel

Once you have your connection string, add it to Vercel:

### Option 1: Via CLI (Recommended)
```bash
npx vercel env add MONGODB_URI
# Paste your connection string when prompted
# Select: Production, Preview, Development
```

### Option 2: Via Dashboard
1. Go to https://vercel.com/dashboard
2. Find your project: `signalist-stock-tracker-app`
3. Settings → Environment Variables
4. Add new variable:
   - Name: `MONGODB_URI`
   - Value: Your connection string
   - Environments: Production, Preview, Development

## ✅ Test Connection

After adding the MongoDB URI, test it:
```bash
node scripts/setup-production-db.js
```

## 🚀 Redeploy

Trigger a new deployment to apply the database:
```bash
npx vercel --prod
```

## 📋 Checklist
- [ ] MongoDB Atlas account created
- [ ] Free cluster created
- [ ] Database user created
- [ ] IP whitelist configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] MONGODB_URI added to Vercel
- [ ] Connection tested
- [ ] App redeployed

Your app will be fully functional once this is complete!