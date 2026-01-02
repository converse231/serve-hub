# ServeHub - Supabase Setup Guide

## 📋 Quick Checklist

- [ ] Run SQL schema in Supabase
- [ ] Create `.env.local` file with credentials
- [ ] Restart dev server
- [ ] Test the signup flow
- [ ] Verify data persists

---

## Step 1: Run Database Schema

1. Go to your Supabase SQL Editor:
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT/sql
   ```

2. Click **"New Query"**

3. Copy ALL content from `supabase-schema.sql`

4. Paste into the SQL editor

5. Click **"Run"** (or Ctrl/Cmd + Enter)

6. You should see success messages like:
   ```
   ✅ ServeHub database schema created successfully!
   📊 Tables: churches, managers, people, schedules, assignments, songs, settings
   🔒 Row Level Security enabled on all tables
   ```

---

## Step 2: Get Your Supabase Credentials

1. Go to Project Settings:
   ```
   https://supabase.com/dashboard/project/YOUR_PROJECT/settings/api
   ```

2. Copy these two values:
   - **Project URL** (e.g., `https://xxxxx.supabase.co`)
   - **anon public** key (long string under "Project API keys")

---

## Step 3: Create Environment File

Create a file named `.env.local` in your project root:

```env
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-long-anon-key-here
```

**⚠️ Important:**
- Replace with YOUR actual values
- Don't commit this file to git (it's already in `.gitignore`)
- Restart your dev server after creating this file

---

## Step 4: Restart Development Server

```bash
# Stop current server (Ctrl+C)
# Then start again:
npm run dev
```

---

## Step 5: Test Authentication

1. Go to `http://localhost:3000/signup`
2. Fill in the signup form:
   - Name: Your Name
   - Church Name: Your Church
   - Email: test@example.com
   - Password: test123
3. Click "Create account"
4. You should be redirected to the dashboard!

---

## What Was Created

### Database Tables

1. **churches** - Church information
2. **managers** - User profiles (linked to auth)
3. **people** - Ministry members
4. **schedules** - Service schedules
5. **assignments** - People assigned to schedules
6. **songs** - Song lyrics database
7. **settings** - Default rules and preferences

### Security (RLS)

- ✅ Row Level Security enabled on all tables
- ✅ Users can only see/edit data for their church
- ✅ Automatic church_id filtering
- ✅ Secure by default

### Performance

- ✅ Indexes on all foreign keys
- ✅ Indexes on frequently queried columns
- ✅ Optimized for fast queries

---

## What's Next

After setup is complete, I'll update:

1. ✅ Authentication pages (login/signup) - DONE (you reverted to demo)
2. ⏳ Data fetching (replace mock data)
3. ⏳ CRUD operations (people, schedules, songs)
4. ⏳ Real-time features (optional)

---

## Troubleshooting

### "Invalid API key"
- Check your `.env.local` file has correct credentials
- Restart dev server

### "Row Level Security policy violation"
- Make sure you ran the complete SQL schema
- Verify RLS policies were created

### "Table does not exist"
- Run the SQL schema again
- Check for any SQL errors in Supabase

### "Cannot read properties of undefined"
- Restart your dev server after creating `.env.local`

---

## Testing Connection

Once setup is complete, open browser console and run:

```javascript
testSupabase()
```

You should see:
```
✅ Supabase client created
✅ Database connection successful
✅ Row Level Security is working
```

---

## Need Help?

If you encounter any issues:
1. Check the Supabase logs: Dashboard → Logs
2. Verify your environment variables
3. Make sure the SQL schema ran without errors

---

**Ready to continue?** Let me know once you've completed steps 1-3 and I'll update the app code to use real data!

