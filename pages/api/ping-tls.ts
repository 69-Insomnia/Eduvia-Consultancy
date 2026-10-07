import dns from 'dns';
import tls from 'tls';
import type { NextApiRequest, NextApiResponse } from 'next';

const HOST = 'aws-0-ap-northeast-1.pooler.supabase.com';
const PORT = 6543;

function probe(rejectUnauthorized: boolean): Promise<Record<string, unknown>> {
  return new Promise((resolve) => {
    const socket = tls.connect(
      { host: HOST, port: PORT, rejectUnauthorized, servername: HOST, timeout: 8000 },
      () => {
        const cert = socket.getPeerCertificate();
        resolve({
          ok: true,
          rejectUnauthorized,
          authorized: socket.authorized,
          authorizationError: socket.authorizationError || null,
          subject: cert && cert.subject ? cert.subject : null,
          issuer: cert && cert.issuer ? cert.issuer : null,
        });
        socket.destroy();
      }
    );
    socket.on('error', (e: NodeJS.ErrnoException) => {
      resolve({ ok: false, rejectUnauthorized, error: e.message, code: e.code || null });
    });
    socket.on('timeout', () => {
      socket.destroy();
      resolve({ ok: false, rejectUnauthorized, error: 'timeout' });
    });
  });
}

export default async function handler(_req: NextApiRequest, res: NextApiResponse) {
  const dnsResult = await new Promise((resolve) => {
    dns.lookup(HOST, { all: true }, (err, addresses) => {
      resolve(err ? { error: err.message } : { addresses });
    });
  });
  const insecure = await probe(false);
  const secure = await probe(true);
  res.status(200).json({ ok: true, probe: 'tls', node: process.version, dns: dnsResult, insecure, secure });
}
