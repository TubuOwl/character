const { neon } = require('@neondatabase/serverless');

function getSql() {
  const url = process.env.DATABASE_URL || process.env.POSTGRES_URL;
  if (!url) throw new Error('DATABASE_URL / POSTGRES_URL belum di-set di Environment Variables Vercel.');
  return neon(url);
}

function isAuthorized(secret) {
  const real = process.env.ADMIN_SECRET;
  return !!real && typeof secret === 'string' && secret === real;
}

function toArray(v) {
  if (Array.isArray(v)) return v;
  if (typeof v === 'string' && v.trim()) return v.split(',').map((s) => s.trim()).filter(Boolean);
  return [];
}

module.exports = async (req, res) => {
  // Izinkan diakses dari domain manapun (misal HTML-nya di-embed di situs lain).
  // Ditaruh paling atas supaya tetap terkirim walaupun terjadi error di bawah.
  res.setHeader('Access-Control-Allow-Origin', '*');

  let sql;
  try {
    sql = getSql();
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }

  try {
    if (req.method === 'GET') {
      const q = req.query || {};

      // ===== Tambah / update bot lewat link, contoh: =====
      // /api/bots?name=mybot&owner=aku&language=javascript&home=roomku&tag=english,utility&usage=!&secret=RAHASIAMU
      if (q.secret) {
        if (!isAuthorized(q.secret)) {
          return res.status(401).json({ error: 'Secret salah.' });
        }
        const name = q.name;
        if (!name) return res.status(400).json({ error: 'Parameter "name" wajib diisi.' });

        const tags = toArray(q.tag);
        const usage = toArray(q.usage);
        const active = q.active === '1' || q.active === 'true';
        const uptime = Number(q.uptime || 0);

        await sql`
          INSERT INTO bots (name, description, owner, language, home, help, library_name, library_public, active, uptime, tags, usage_prefix)
          VALUES (${name}, ${q.description || null}, ${q.owner || null}, ${q.language || null}, ${q.home || null}, ${q.help || null},
                  ${q.library_name || null}, ${q.library_public || null}, ${active}, ${uptime}, ${tags}, ${usage})
          ON CONFLICT (name) DO UPDATE SET
            description = EXCLUDED.description,
            owner = EXCLUDED.owner,
            language = EXCLUDED.language,
            home = EXCLUDED.home,
            help = EXCLUDED.help,
            library_name = EXCLUDED.library_name,
            library_public = EXCLUDED.library_public,
            active = EXCLUDED.active,
            uptime = EXCLUDED.uptime,
            tags = EXCLUDED.tags,
            usage_prefix = EXCLUDED.usage_prefix
        `;
        return res.status(200).json({ ok: true });
      }

      // ===== Hapus bot lewat link: /api/bots?delete=namabot&secret=RAHASIAMU =====
      if (q.delete) {
        if (!isAuthorized(q.secret)) {
          return res.status(401).json({ error: 'Secret salah.' });
        }
        await sql`DELETE FROM bots WHERE name = ${q.delete}`;
        return res.status(200).json({ ok: true });
      }
      const rows = await sql`
        SELECT name, description, owner, language, home, help, library_name, library_public, active, uptime, tags, usage_prefix
        FROM bots ORDER BY name ASC
      `;
      const bots = rows.map((r) => ({
        name: r.name,
        description: r.description,
        owner: r.owner,
        language: r.language,
        home: r.home,
        help: r.help,
        library: { name: r.library_name, public: r.library_public },
        status: { active: r.active, uptime: r.uptime },
        tag: r.tags || [],
        usage: r.usage_prefix || []
      }));
      res.setHeader('Cache-Control', 'no-store');
      return res.status(200).json(bots);
    }

    res.setHeader('Allow', 'GET');
    return res.status(405).json({ error: 'Method tidak didukung.' });
  } catch (err) {
    return res.status(500).json({ error: err.message });
  }
};
