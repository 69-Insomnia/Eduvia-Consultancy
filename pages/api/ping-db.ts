import type { NextApiRequest, NextApiResponse } from 'next';
import { connectDB, dbUrl } from '../../server/config/db';

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const db = await connectDB()
    .then(() => 'connected')
    .catch((e) => `error: ${e.message}`);
  res.status(200).json({ ok: true, probe: 'db', hasUrl: Boolean(dbUrl), db });
}
