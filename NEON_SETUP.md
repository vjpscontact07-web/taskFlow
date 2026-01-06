# Neon Database Setup for TaskFlow

## 🎯 Quick Setup Guide

### Step 1: Get Your Connection String

1. **Login to Neon Console:**
   - Go to: https://console.neon.tech/app/projects/proud-dawn-00549700?database=neondb
   - Sign in with your Google account

2. **Find Connection String:**
   - Once logged in, you'll see your project dashboard
   - Look for **"Connection Details"** or **"Connection String"**
   - It will look like this:
     ```
     postgresql://[username]:[password]@[host]/neondb?sslmode=require
     ```
   - Click the **copy** button to copy it

### Step 2: Configure TaskFlow

1. **Navigate to project:**
   ```bash
   cd ~/taskflow
   ```

2. **Create `.env.local` file:**
   ```bash
   nano .env.local
   ```
   
   Or create it manually with this content:
   ```env
   # Neon Database
   DATABASE_URL="paste-your-connection-string-here"

   # NextAuth (generate with: openssl rand -base64 32)
   NEXTAUTH_URL="http://localhost:3000"
   NEXTAUTH_SECRET="your-secret-here"

   # Cloudinary (optional - for file uploads)
   NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=""
   CLOUDINARY_API_KEY=""
   CLOUDINARY_API_SECRET=""

   # Resend (optional - for emails)
   RESEND_API_KEY=""
   ```

3. **Generate NextAuth Secret:**
   ```bash
   openssl rand -base64 32
   ```
   Copy the output and paste it as `NEXTAUTH_SECRET` value

### Step 3: Initialize Database

```bash
# Push Prisma schema to Neon database
npm run db:push

# Seed with sample data (admin & user accounts + tasks)
npm run db:seed
```

### Step 4: Start the App

```bash
npm run dev
```

Open http://localhost:3000

---

## ✅ Test Accounts (After Seeding)

**Admin:**
- Email: `admin@taskflow.com`
- Password: `Admin123!`

**User:**
- Email: `user@taskflow.com`
- Password: `User123!`

---

## 🔍 Verify Database Connection

To check if everything is working:

```bash
# Open Prisma Studio (database GUI)
npm run db:studio
```

This will open a browser showing your database tables and data.

---

## 🐛 Troubleshooting

### Connection Error?

**Error:** `Can't reach database server`

**Solution:**
1. Verify your Neon database is active (not paused)
2. Check the connection string is correct in `.env.local`
3. Ensure `?sslmode=require` is at the end of the connection string

### Prisma Client Not Generated?

```bash
npx prisma generate
```

### Need to Reset Database?

```bash
# This will delete all data and recreate tables
npm run db:push -- --force-reset

# Then re-seed
npm run db:seed
```

---

## 💡 Why Neon?

- ✅ **Serverless** - Automatically scales, pauses when not in use
- ✅ **Free Tier** - Generous limits for learning projects
- ✅ **Fast** - Low latency, global edge network
- ✅ **Prisma Compatible** - Works perfectly with Prisma ORM
- ✅ **No Setup** - No need to install PostgreSQL locally

---

## 📚 Next Steps

Once your database is set up:

1. ✅ Test the authentication flow
2. ✅ Create some tasks
3. ✅ Upload file attachments
4. ✅ Explore the code with comments
5. ✅ Try adding new features

**Happy coding! 🚀**
