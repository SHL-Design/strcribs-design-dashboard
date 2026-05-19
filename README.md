# STR Cribs Design Tracker — Setup Guide

Live dashboard that reads Gmail calendar invites + Slack staging-design channels
and auto-updates project statuses every 10 minutes.

---

## What you need before starting

1. A Google account (olivia@strcribs.com)
2. Your Slack bot token (xoxb-... from previous setup)
3. A free Vercel account → vercel.com

Total setup time: ~20 minutes

---

## Step 1 — Google Cloud Console (10 min)

### Create a project
1. Go to console.cloud.google.com
2. Click "Select a project" → "New Project"
3. Name it `STR Cribs Tracker` → Create

### Enable Gmail API
1. In the left menu → "APIs & Services" → "Library"
2. Search "Gmail API" → click it → click "Enable"

### Create OAuth credentials
1. Left menu → "APIs & Services" → "Credentials"
2. Click "Create Credentials" → "OAuth client ID"
3. Application type: **Web application**
4. Name: `STR Cribs Tracker`
5. Authorized redirect URIs → Add:
   - `http://localhost:3000/api/auth/callback` (for local testing)
   - `https://YOUR-APP.vercel.app/api/auth/callback` (add after Vercel deploy)
6. Click Create
7. Copy the **Client ID** and **Client Secret** — you'll need these

### Configure OAuth consent screen
1. Left menu → "OAuth consent screen"
2. User Type: **Internal** (since it's just your team)
3. App name: `STR Cribs Tracker`
4. Support email: your email
5. Scopes → Add → search `gmail.readonly` → add it
6. Save

---

## Step 2 — Deploy to Vercel (5 min)

### Option A: Deploy from GitHub (recommended)
1. Push this folder to a GitHub repo
2. Go to vercel.com → "New Project" → import your repo
3. Framework: Next.js (auto-detected)
4. Click "Deploy" — it will fail on first deploy because env vars aren't set yet, that's fine

### Option B: Deploy from CLI
```bash
npm install -g vercel
cd strcribs-dashboard
vercel
```

### Add environment variables in Vercel
After deploying, go to your project → Settings → Environment Variables.
Add each of these:

| Key | Value |
|-----|-------|
| `GOOGLE_CLIENT_ID` | From Step 1 above |
| `GOOGLE_CLIENT_SECRET` | From Step 1 above |
| `NEXTAUTH_URL` | `https://YOUR-APP.vercel.app` |
| `NEXTAUTH_SECRET` | Run: `node -e "console.log(require('crypto').randomBytes(32).toString('hex'))"` |
| `SLACK_BOT_TOKEN` | Your `xoxb-...` token from Slack |
| `GOOGLE_SHEET_ID` | `1nWBoNCfhB7qMQrvU6ZKinM3OchHYwV_Pvr44lQylkkk` |

After adding all variables → **Redeploy** (Deployments tab → "..." → Redeploy)

### Add Vercel callback URL to Google Cloud
1. Go back to Google Cloud → Credentials → your OAuth client
2. Add `https://YOUR-APP.vercel.app/api/auth/callback` to Authorized redirect URIs
3. Save

---

## Step 3 — Connect Gmail (2 min)

1. Open your deployed app at `https://YOUR-APP.vercel.app`
2. Click **"🔐 Connect Gmail"** button in the top right
3. Sign in with olivia@strcribs.com
4. Click "Allow" to grant Gmail read access
5. You'll be redirected back to the dashboard — you should see "✓ Gmail connected"

---

## Step 4 — Test it

1. Click **"Sync Now"** — the sync log panel will appear in the bottom right
2. You should see it scanning Gmail and Slack
3. Any new presentation invites, KOC confirmations, or Slack signals from the last 90 days will populate the dates automatically

---

## Running locally (optional)

```bash
# 1. Clone/copy this folder
cd strcribs-dashboard

# 2. Copy the example env file
cp .env.local.example .env.local

# 3. Fill in your values in .env.local

# 4. Install and run
npm install
npm run dev

# 5. Open http://localhost:3000
```

---

## How the sync works

**Every 10 minutes automatically**, or on manual "Sync Now":

### Gmail scans for:
- `subject:"Full Design Presentation"` → updates Presentation Date
- `subject:"KOC Follow"` → scans thread for client concept approval reply
- `subject:"Client Proposal Presentation"` → updates BT/Proposal Date
- `subject:"Design & Construction Proposal"` from Drive → updates BT Date
- `subject:"Cribs Kickoff"` → updates KOC Date

### Slack scans for (flexible matching, not rigid phrases):
Each #address-staging-design channel is matched to its project.
Messages in the last 15 minutes are scanned for:

| Signal | What triggers it | Updates |
|--------|-----------------|---------|
| KOC notes sent | Notes/doc shared with designer | Designer tagged date |
| Revision sent | Olivia/Sophia sends notes + Google Doc link | Revision sent date |
| Designer finished | Designer shares completed deck | Submit date + Full design ready |
| Deck approved | Olivia approves ("final approved", "good to send", etc.) | Approved date |
| QC submitted | "ready to pull numbers", Mica mentioned | QC date |

Also searches `#design-qc` broadly for QC submissions.

### Safety: never overwrites existing dates
If a field already has a value, the sync skips it — so manually entered dates are always safe.

---

## Sharing with your team

Once deployed, share the URL with Olivia, Sophia, the PMs — anyone can view.
Only the Gmail OAuth is tied to your account; Slack reads via the bot token (already shared).

To restrict access, you can add Vercel Password Protection (Vercel Pro) or
add a simple passcode check in the `index.js` page.

---

## Troubleshooting

**"Not authenticated with Gmail"** in sync log
→ Click "Connect Gmail" and go through the OAuth flow again

**Slack sync shows 0 channels**
→ Make sure `/invite @STR Cribs Tracker` has been run in each staging-design channel

**Projects not matching**
→ The channel name must contain the street number + street name
→ e.g. `#icy-ln-222-staging-design` matches "222 Icy Ln" via reversed matching

**Vercel build fails**
→ Check that all 6 environment variables are set in Vercel dashboard → Settings → Env Vars
