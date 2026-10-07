import type { NextApiRequest, NextApiResponse } from 'next';
import app from '../../server/app';
import { connectDB } from '../../server/config/db';

// The Express app parses its own bodies (express.json / multer) — Next must
// not consume the request stream first.
export const config = {
  api: {
    bodyParser: false,
  },
};

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    await connectDB();
  } catch (error: any) {
    res.status(503).json({
      success: false,
      message: `Database unavailable: ${error?.message || 'connection failed'}`,
    });
    return;
  }
  try {
    app(req as any, res as any);
  } catch (error: any) {
    if (!res.headersSent) {
      res.status(500).json({
        success: false,
        message: error?.message || 'Request failed',
      });
    }
  }
}
