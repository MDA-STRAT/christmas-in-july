# Christmas in July — RSVP setup (Netlify + Neon)

Your site is plain HTML/CSS/JS plus two Netlify serverless functions that talk to
a Neon PostgreSQL database. Follow these steps once; after that, RSVPs flow in
automatically and you can download them as a CSV any time.

--------------------------------------------------------------------------------
## 1. Create the Neon database
1. Go to https://neon.tech and create a free project (region: pick Sydney/AU if offered).
2. In the project, copy the **connection string** — it looks like:
   `postgresql://USER:PASSWORD@ep-xxxx.ap-southeast-2.aws.neon.tech/neondb?sslmode=require`
3. (Optional) Open the **SQL Editor** and paste the contents of `schema.sql` to create
   the table now. You don't have to — the function auto-creates it on the first RSVP.

--------------------------------------------------------------------------------
## 2. Set the environment variables in Netlify
In your Netlify project: **Site configuration → Environment variables → Add a variable**

| Key            | Value                                                        |
|----------------|--------------------------------------------------------------|
| `DATABASE_URL` | the Neon connection string from step 1                       |
| `ADMIN_SECRET` | any long secret you invent, e.g. `tinsel-greg-2026-9f3k`     |

Save. (If the site is already deployed, trigger a redeploy so the vars take effect.)

--------------------------------------------------------------------------------
## 3. Deploy
Everything is already wired:
- `netlify.toml` sets the publish dir to `.` and functions dir to `netlify/functions`,
  and maps `/api/rsvp` and `/api/rsvp-download` to the functions.
- `package.json` declares the one dependency (`pg`); Netlify installs it automatically.

Push to GitHub (or drag-and-drop the folder). On a Git deploy Netlify runs `npm install`
and bundles the functions for you. **Leave the build command blank.**

--------------------------------------------------------------------------------
## 4. Test it
1. Visit your live site, scroll to **Will you be there?**, submit a test RSVP.
   You should see the "You're on the list" confirmation.
2. Check it landed: in Neon's SQL editor run `SELECT * FROM rsvp;`

--------------------------------------------------------------------------------
## 5. Download the guest list (CSV)
Visit, in your browser:

    https://robinadalesgroves-christmasinjuly.netlify.app/api/rsvp-download?key=YOUR_ADMIN_SECRET

Replace `YOUR_ADMIN_SECRET` with the value you set in step 2. A CSV downloads with
columns: id, first_name, last_name, address, bringing, notes, submitted_at.
Keep that URL private — anyone with the key can download the list.

--------------------------------------------------------------------------------
## Files involved
- `index.html`, `styles.css`, `rsvp.js`  — the RSVP section + front-end handling
- `netlify/functions/rsvp.js`            — receives submissions, writes to Neon
- `netlify/functions/rsvp-download.js`   — key-protected CSV export
- `netlify.toml`                         — routing + function config
- `package.json`                         — declares the `pg` dependency
- `schema.sql`                           — table definition (optional manual setup)

## Local testing (optional)
    npm install
    npm install -g netlify-cli
    netlify dev        # serves the site + functions at localhost:8888
Set DATABASE_URL and ADMIN_SECRET in a local `.env` for this to reach the DB.
