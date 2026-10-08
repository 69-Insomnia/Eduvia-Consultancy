import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, dbUrl } from '../../server/config/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const { host, params } = (() => {
    try {
      const u = new URL(dbUrl);
      return { host: u.host, params: [...u.searchParams.keys()].join(',') };
    } catch {
      return { host: 'invalid-url', params: '' };
    }
  })();
  const db = await connectDB()
    .then(() => 'connected')
    .catch((e) => `error: ${e.message} | code: ${e.parent?.code || e.original?.code || e.code || '?'} | ${String(e.stack || '').slice(0, 400)}`);
  res.status(200).json({ ok: true, probe: 'db', hasUrl: Boolean(dbUrl), host, params, node: process.version, db });
}
