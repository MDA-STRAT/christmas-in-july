// netlify/functions/rsvp-download.js
// Returns ALL rsvp records as a downloadable CSV.
// Protected by a query-string secret: /api/rsvp-download?key=YOUR_SECRET
//
// Required env vars: DATABASE_URL, ADMIN_SECRET

const { Pool } = require('pg');

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false },
  max: 1
});

// RFC-4180-ish CSV escaping
function csvCell(value) {
  if (value === null || value === undefined) return '';
  const s = String(value);
  if (/[",\n\r]/.test(s)) {
    return '"' + s.replace(/"/g, '""') + '"';
  }
  return s;
}

exports.handler = async (event) => {
  const key = (event.queryStringParameters && event.queryStringParameters.key) || '';

  if (!process.env.ADMIN_SECRET) {
    return { statusCode: 500, body: 'Server is not configured (missing ADMIN_SECRET).' };
  }
  if (key !== process.env.ADMIN_SECRET) {
    return { statusCode: 401, body: 'Unauthorized. Add ?key=YOUR_SECRET to the URL.' };
  }
  if (!process.env.DATABASE_URL) {
    return { statusCode: 500, body: 'Server is not configured (missing DATABASE_URL).' };
  }

  const client = await pool.connect();
  try {
    const { rows } = await client.query(
      `SELECT id, first_name, last_name, address, bringing, notes, submitted_at
         FROM rsvp
        ORDER BY submitted_at ASC`
    );

    const header = ['id', 'first_name', 'last_name', 'address', 'bringing', 'notes', 'submitted_at'];
    const lines = [header.join(',')];
    for (const r of rows) {
      lines.push(header.map((h) => csvCell(r[h])).join(','));
    }
    // Prepend BOM so Excel reads UTF-8 correctly
    const csv = '\uFEFF' + lines.join('\r\n');

    const stamp = new Date().toISOString().slice(0, 10);
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="christmas-in-july-rsvps-${stamp}.csv"`,
        'Cache-Control': 'no-store'
      },
      body: csv
    };
  } catch (err) {
    console.error('[rsvp-download] DB error:', err);
    return { statusCode: 500, body: 'Could not generate the CSV. Check the function logs.' };
  } finally {
    client.release();
  }
};
