const { neon } = require('@neondatabase/serverless');

function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL / POSTGRES_URL belum di-set di Environment Variables Vercel.');
  return neon(url);
}

// Secret HANYA kamu yang tahu, kamu isi sendiri di Vercel > Settings > Environment Variables
function isAuthorized(secret) {
  const real = process.env.ADMIN_SECRET;
  return !!real && typeof secret === 'string' && secret === real;
}

function todayLabel() {
  var d = new Date();
  var pad = function (n) { return String(n).padStart(2, '0'); };
  return d.getFullYear() + '.' + pad(d.getMonth() + 1) + '.' + pad(d.getDate());
}

module.exports = async (req, res) => {
  let sql;
  try {
    sql = getSql();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  try {
    if (req.method === 'GET') {
      const q = req.query || {};

      // ===== Tambah news lewat link biasa, contoh: =====
      // /api/news?text=hallo&time=2026.09.29&secret=RAHASIAMU
      if (q.secret) {
        if (!isAuthorized(q.secret)) {
          return res.status(401).json({ error: 'Secret salah.' });
        }
        const text = q.text || q.body;
        if (!text) return res.status(400).json({ error: 'Parameter "text" wajib diisi.' });

        const date = q.time || q.date || todayLabel();
        const title = q.title || String(text).slice(0, 60);
        const tag = q.tag || null;
        const link = q.link || null;

        const rows = await sql`
          INSERT INTO news (date, tag, title, body, link)
          VALUES (${date}, ${tag}, ${title}, ${text}, ${link})
          RETURNING id
        `;
        return res.status(200).json({ ok: true, id: rows[0].id });
      }

      // ===== Hapus news lewat link: /api/news?delete=ID&secret=RAHASIAMU =====
      if (q.delete) {
        if (!isAuthorized(q.secret)) {
          return res.status(401).json({ error: 'Secret salah.' });
        }
        await sql`DELETE FROM news WHERE id = ${q.delete}`;
        return res.status(200).json({ ok: true });
      }

      // ===== Default: list publik, dipakai assets/js/news.js =====
      const rows = await sql`SELECT id, date, tag, title, body, link FROM news ORDER BY id DESC`;
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(rows);
    }

    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method tidak didukung.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
