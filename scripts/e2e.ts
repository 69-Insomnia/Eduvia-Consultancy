/**
 * End-to-end API + page checks against a running Eduvia server.
 *
 *   npm run e2e            # tests http://localhost:3001
 *   BASE_URL=... npm run e2e
 *
 * Covers: SSR pages (incl. legacy wildcard redirect), every public read
 * endpoint, dynamic slug reads, sitemap, admin auth, admin reads, a full
 * CRUD lifecycle, public writes (with cleanup), and response shape basics.
 * Exits non-zero when any check fails.
 */

const BASE = process.env.BASE_URL || 'http://localhost:3001';
const ADMIN_EMAIL = process.env.E2E_ADMIN_EMAIL || 'admin@eduvia.com';
const ADMIN_PASSWORD = process.env.E2E_ADMIN_PASSWORD || 'admin123';

let pass = 0;
let fail = 0;
const failures: string[] = [];

const ok = (cond: any, msg = 'assertion failed') => {
  if (!cond) throw new Error(msg);
};

async function check(name: string, fn: () => Promise<void>) {
  try {
    await fn();
    pass++;
    console.log(`  ok   ${name}`);
  } catch (e: any) {
    fail++;
    failures.push(`${name} -> ${e.message}`);
    console.log(`  FAIL ${name} -> ${e.message}`);
  }
}

const get = (path: string, token?: string, init: any = {}) =>
  fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(init.headers || {}),
    },
  });

const body = (method: string, path: string, payload: any, token?: string) =>
  get(path, token, { method, body: JSON.stringify(payload) });

const parse = async (r: Response) => {
  const text = await r.text();
  try {
    return JSON.parse(text);
  } catch {
    return text;
  }
};

const extractArray = (j: any): any[] => {
  if (Array.isArray(j)) return j;
  if (j && Array.isArray(j.data)) return j.data;
  if (j && j.data && typeof j.data === 'object') {
    for (const v of Object.values(j.data)) if (Array.isArray(v)) return v;
  }
  if (j && typeof j === 'object') {
    for (const v of Object.values(j)) if (Array.isArray(v)) return v;
  }
  return [];
};

const extractOne = (j: any): any => {
  if (j && typeof j === 'object') {
    if (j._id || j.id) return j;
    if (j.data && (j.data._id || j.data.id || Array.isArray(j.data) === false && typeof j.data === 'object')) return j.data;
    for (const v of Object.values(j)) {
      if (v && typeof v === 'object' && !Array.isArray(v) && (v as any)._id) return v;
    }
  }
  return null;
};

async function main() {
  console.log(`E2E against ${BASE}\n`);

  // ---------- auth ----------
  let token = '';
  let loginJson: any = null;

  await check('auth: admin login returns token', async () => {
    const r = await body('POST', '/api/admin/login', { email: ADMIN_EMAIL, password: ADMIN_PASSWORD });
    ok(r.status === 200, `status ${r.status}`);
    loginJson = await parse(r);
    token = loginJson.token || loginJson.data?.token || '';
    ok(token, `no token in ${JSON.stringify(loginJson).slice(0, 200)}`);
  });

  await check('auth: wrong password rejected', async () => {
    const r = await body('POST', '/api/admin/login', { email: ADMIN_EMAIL, password: 'wrong-password' });
    ok(r.status >= 400 && r.status < 500, `status ${r.status}`);
  });

  await check('auth: /api/admin/me with token', async () => {
    const r = await get('/api/admin/me', token);
    ok(r.status === 200, `status ${r.status}`);
    const j = await parse(r);
    const email = j?.email || j?.data?.email || j?.admin?.email;
    ok((email || JSON.stringify(j)).includes(ADMIN_EMAIL), `unexpected body: ${JSON.stringify(j).slice(0, 200)}`);
  });

  await check('auth: /api/admin/me without token is 401', async () => {
    const r = await get('/api/admin/me');
    ok(r.status === 401, `status ${r.status}`);
  });

  // ---------- public list endpoints ----------
  const listEndpoints = [
    '/api/blogs',
    '/api/universities',
    '/api/courses',
    '/api/destinations',
    '/api/scholarships',
    '/api/services',
    '/api/services/all',
    '/api/team',
    '/api/team/all',
    '/api/testimonials',
    '/api/testimonials/featured',
    '/api/success-stories',
    '/api/success-stories/featured',
    '/api/faqs',
    '/api/settings',
    '/api/destinations/featured',
    '/api/universities/featured',
    '/api/search?q=nepal',
    '/api/page-seo',
  ];

  const lists: Record<string, any[]> = {};
  for (const ep of listEndpoints) {
    await check(`GET ${ep}`, async () => {
      // `/all` variants are admin dropdown endpoints (auth middleware).
      const needsAuth = ep === '/api/services/all' || ep === '/api/team/all';
      const r = await get(ep, needsAuth ? token : undefined);
      ok(r.status === 200, `status ${r.status}`);
      const j = await parse(r);
      lists[ep] = extractArray(j);
      ok(typeof j === 'object', 'expected JSON');
    });
  }

  await check('blogs list has rows', async () => ok(lists['/api/blogs'].length > 0, 'empty'));
  await check('universities list has rows', async () => ok(lists['/api/universities'].length > 0, 'empty'));

  // ---------- dynamic slug reads ----------
  const blogSlug = lists['/api/blogs']?.[0]?._id && lists['/api/blogs'][0].slug;
  const uniSlug = lists['/api/universities']?.[0]?.slug;
  const courseSlug = lists['/api/courses']?.[0]?.slug;
  const destSlug = lists['/api/destinations']?.[0]?.slug;
  const scholSlug = lists['/api/scholarships']?.[0]?.slug;

  await check('GET /api/blogs/:slug', async () => {
    ok(blogSlug, 'no blog slug available');
    const r = await get(`/api/blogs/${blogSlug}`);
    ok(r.status === 200, `status ${r.status}`);
  });

  await check('GET /api/universities/:slug', async () => {
    ok(uniSlug, 'no university slug available');
    const r = await get(`/api/universities/${uniSlug}`);
    ok(r.status === 200, `status ${r.status}`);
  });

  await check('GET /api/courses/:slug', async () => {
    ok(courseSlug, 'no course slug available');
    const r = await get(`/api/courses/${courseSlug}`);
    ok(r.status === 200, `status ${r.status}`);
  });

  await check('GET /api/destinations/:slug', async () => {
    ok(destSlug, 'no destination slug available');
    const r = await get(`/api/destinations/${destSlug}`);
    ok(r.status === 200, `status ${r.status}`);
  });

  if (scholSlug) {
    await check('GET /api/scholarships/:slug', async () => {
      const r = await get(`/api/scholarships/${scholSlug}`);
      ok(r.status === 200, `status ${r.status}`);
    });
  }

  await check('blog view counter increments', async () => {
    ok(blogSlug, 'no blog slug available');
    const r = await body('PUT', `/api/blogs/${blogSlug}/views`, {});
    ok(r.status === 200, `status ${r.status}`);
  });

  // ---------- sitemap + robots ----------
  await check('GET /sitemap.xml serves XML', async () => {
    const r = await get('/sitemap.xml');
    ok(r.status === 200, `status ${r.status}`);
    const text = await r.text();
    ok(text.includes('<url>') || text.includes('<urlset'), 'not sitemap XML');
    ok(text.includes('/blogs') || text.includes('eduviaconsultancy.com'), 'no expected URLs');
  });

  await check('sitemap content-type is XML', async () => {
    const r = await get('/sitemap.xml');
    const ct = r.headers.get('content-type') || '';
    ok(ct.includes('xml'), `content-type ${ct}`);
  });

  // ---------- SSR pages ----------
  const htmlPages = ['/', '/blogs', '/about', '/study-abroad', '/universities', '/contact', '/admin/login'];
  for (const p of htmlPages) {
    await check(`page ${p}`, async () => {
      const r = await get(p);
      ok(r.status === 200, `status ${r.status}`);
      const text = await r.text();
      ok(text.includes('Eduvia'), 'no Eduvia in HTML');
      ok(text.includes('<title'), 'no title tag');
    });
  }

  if (blogSlug) {
    await check(`page /blogs/${blogSlug}`, async () => {
      const r = await get(`/blogs/${blogSlug}`);
      ok(r.status === 200, `status ${r.status}`);
    });
  }

  if (uniSlug) {
    await check(`page /universities/${uniSlug}`, async () => {
      const r = await get(`/universities/${uniSlug}`);
      ok(r.status === 200, `status ${r.status}`);
    });
  }

  await check('unknown path redirects to home (legacy wildcard)', async () => {
    const r = await get('/definitely-not-a-real-page-xyz');
    ok(r.status === 200, `status ${r.status}`);
    const text = await r.text();
    ok(text.includes('Eduvia'), 'did not land on home');
  });

  await check('unknown API path is 404', async () => {
    const r = await get('/api/definitely-not-a-route');
    ok(r.status === 404, `status ${r.status}`);
  });

  await check('rate-limit headers present on API responses', async () => {
    const r = await get('/api/blogs');
    const h = r.headers.get('ratelimit-limit') || r.headers.get('x-ratelimit-limit');
    ok(h, 'no rate-limit headers');
  });

  // ---------- admin reads ----------
  await check('GET /api/dashboard/stats', async () => {
    const r = await get('/api/dashboard/stats', token);
    ok(r.status === 200, `status ${r.status}`);
  });

  await check('GET /api/dashboard/seo', async () => {
    const r = await get('/api/dashboard/seo', token);
    ok(r.status === 200, `status ${r.status}`);
  });

  await check('GET /api/page-seo/admin', async () => {
    const r = await get('/api/page-seo/admin', token);
    ok(r.status === 200, `status ${r.status}`);
  });

  // ---------- CRUD lifecycle (FAQ) ----------
  const marker = `E2E-${Date.now()}`;
  let faqId = '';

  await check('POST /api/faqs creates row', async () => {
    const r = await body(
      'POST',
      '/api/faqs',
      { question: marker, answer: 'E2E test answer', category: 'e2e', order: 9999, isActive: true },
      token
    );
    ok(r.status === 200 || r.status === 201, `status ${r.status}`);
    const j = await parse(r);
    const one = extractOne(j);
    faqId = one?._id || '';
    ok(faqId, `no _id in ${JSON.stringify(j).slice(0, 200)}`);
  });

  await check('GET /api/faqs includes created row', async () => {
    const r = await get('/api/faqs');
    const rows = extractArray(await parse(r));
    ok(rows.some((x: any) => x._id === faqId || x.question === marker), 'not found in list');
  });

  await check('GET /api/faqs/:id reads row', async () => {
    const r = await get(`/api/faqs/${faqId}`, token);
    ok(r.status === 200, `status ${r.status}`);
    const j = await parse(r);
    ok(JSON.stringify(j).includes(marker), 'marker missing');
  });

  await check('PUT /api/faqs/:id updates row', async () => {
    const r = await body('PUT', `/api/faqs/${faqId}`, { answer: `${marker}-updated` }, token);
    ok(r.status === 200, `status ${r.status}`);
    const j = await parse(r);
    ok(JSON.stringify(j).includes('updated'), 'update not reflected');
  });

  await check('DELETE /api/faqs/:id removes row', async () => {
    const r = await get(`/api/faqs/${faqId}`, token, { method: 'DELETE' });
    ok(r.status === 200 || r.status === 204, `status ${r.status}`);
    const again = await get('/api/faqs');
    const rows = extractArray(await parse(again));
    ok(!rows.some((x: any) => x._id === faqId), 'still present after delete');
  });

  // ---------- public writes (with cleanup) ----------
  let contactId = '';
  await check('POST /api/contacts creates message', async () => {
    const r = await body('POST', '/api/contacts', {
      name: 'E2E Tester',
      email: 'e2e@example.com',
      subject: marker,
      message: 'E2E contact message',
    });
    ok(r.status === 200 || r.status === 201, `status ${r.status}`);
    const j = await parse(r);
    contactId = extractOne(j)?._id || '';
    ok(contactId, 'no _id in response');
  });

  await check('contact visible to admin', async () => {
    const r = await get('/api/contacts', token);
    const rows = extractArray(await parse(r));
    ok(rows.some((x: any) => x._id === contactId), 'not found');
  });

  await check('DELETE /api/contacts/:id (cleanup)', async () => {
    const r = await get(`/api/contacts/${contactId}`, token, { method: 'DELETE' });
    ok(r.status === 200 || r.status === 204, `status ${r.status}`);
  });

  let inquiryId = '';
  await check('POST /api/inquiries creates inquiry', async () => {
    const r = await body('POST', '/api/inquiries', {
      fullName: 'E2E Inquiry',
      phone: '9800000000',
      email: 'e2e-inquiry@example.com',
      message: 'E2E inquiry message',
    });
    ok(r.status === 200 || r.status === 201, `status ${r.status}`);
    const j = await parse(r);
    inquiryId = extractOne(j)?._id || '';
    ok(inquiryId, 'no _id in response');
  });

  await check('inquiry visible to admin', async () => {
    const r = await get('/api/inquiries', token);
    const rows = extractArray(await parse(r));
    ok(rows.some((x: any) => x._id === inquiryId), 'not found');
  });

  await check('DELETE /api/inquiries/:id (cleanup)', async () => {
    const r = await get(`/api/inquiries/${inquiryId}`, token, { method: 'DELETE' });
    ok(r.status === 200 || r.status === 204, `status ${r.status}`);
  });

  // ---------- logout ----------
  let logoutSetCookie = '';
  await check('POST /api/admin/logout', async () => {
    const r = await body('POST', '/api/admin/logout', {}, token);
    ok(r.status === 200, `status ${r.status}`);
    logoutSetCookie = r.headers.get('set-cookie') || '';
    ok(logoutSetCookie.includes('token='), `no token cookie in Set-Cookie: ${logoutSetCookie}`);
  });

  await check('logout expires the token cookie', async () => {
    ok(/token=;|expires=thu, 01 jan 1970|expires=01-jan-1970/i.test(logoutSetCookie), `not expired: ${logoutSetCookie}`);
  });

  console.log(`\n${pass} passed, ${fail} failed`);
  if (failures.length) {
    console.log('\nFailures:');
    for (const f of failures) console.log(`  - ${f}`);
  }
  process.exit(fail ? 1 : 0);
}

main().catch((e) => {
  console.error('E2E crashed:', e);
  process.exit(1);
});
