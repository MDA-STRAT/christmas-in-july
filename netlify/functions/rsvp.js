// netlify/functions/rsvp.js
// Handles RSVP form submissions: validates, ensures the table exists,
// and inserts a row into the Neon PostgreSQL database.
//
// Required env var: DATABASE_URL  (Neon connection string)

const { Pool } = require('pg');

// Module-scope pool is reused across warm invocations.
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: { rejectUnauthorized: false }, // Neon requires SSL
  max: 1
});

let schemaReady = false;
async function ensureSchema(client) {
  if (schemaReady) return;
  await client.query(`
    CREATE TABLE IF NOT EXISTS rsvp (
      id           SERIAL PRIMARY KEY,
      first_name   TEXT NOT NULL,
      last_name    TEXT NOT NULL,
      address      TEXT NOT NULL,
      bringing     TEXT NOT NULL,
      notes        TEXT,
      submitted_at TIMESTAMPTZ NOT NULL DEFAULT now()
    );
  `);
  schemaReady = true;
}

const json = (statusCode, obj) => ({
  statusCode,
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify(obj)
});

exports.handler = async (event) => {
  if (event.httpMethod !== 'POST') {
    return json(405, { error: 'Method not allowed' });
  }

  if (!process.env.DATABASE_URL) {
    return json(500, { error: 'Server is not configured (missing DATABASE_URL).' });
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (e) {
    return json(400, { error: 'Invalid request body.' });
  }

  const clean = (v) => (typeof v === 'string' ? v.trim() : '');
  const first_name = clean(data.first_name);
  const last_name = clean(data.last_name);
  const address = clean(data.address);
  const bringing = clean(data.bringing);
  const notes = clean(data.notes);

  // Required-field validation
  const missing = [];
  if (!first_name) missing.push('first_name');
  if (!last_name) missing.push('last_name');
  if (!address) missing.push('address');
  if (!bringing) missing.push('bringing');
  if (missing.length) {
    return json(400, { error: 'Missing required fields: ' + missing.join(', ') });
  }

  // Light length guards
  const tooLong =
    first_name.length > 120 || last_name.length > 120 ||
    address.length > 300 || bringing.length > 300 || notes.length > 1000;
  if (tooLong) {
    return json(400, { error: 'One of your answers is a little too long.' });
  }

  const client = await pool.connect();
  try {
    await ensureSchema(client);
    const result = await client.query(
      `INSERT INTO rsvp (first_name, last_name, address, bringing, notes)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING id, submitted_at`,
      [first_name, last_name, address, bringing, notes || null]
    );
    return json(200, { ok: true, id: result.rows[0].id });
  } catch (err) {
    console.error('[rsvp] DB error:', err);
    return json(500, { error: 'Could not save your RSVP. Please try again.' });
  } finally {
    client.release();
  }
};
