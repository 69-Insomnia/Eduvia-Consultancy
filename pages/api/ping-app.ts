import type { NextApiRequest, NextApiResponse } from 'next';
import app from '../../server/app';

export default function handler(req: NextApiRequest, res: NextApiResponse) {
  if ((req.query.probe as string) === 'express') {
    app(req as any, res as any);
    return;
  }
  res.status(200).json({ ok: true, probe: 'app-import' });
}
