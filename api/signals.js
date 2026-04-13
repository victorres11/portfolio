const DEFAULT_SIGNALS_ENDPOINT = 'https://victors-mac-mini.tailbdaf55.ts.net/signals/events';
const MAX_BODY_BYTES = 64 * 1024;

const ALLOWED_EVENTS = new Set([
  'page_viewed',
  'project_section_viewed',
  'about_section_viewed',
  'project_card_viewed',
  'project_card_clicked',
  'project_detail_viewed',
  'project_link_clicked',
  'github_link_clicked',
  'demo_link_clicked',
  'contact_clicked',
  'email_clicked',
  'email_copied',
  'linkedin_clicked',
  'calendar_clicked',
  'resume_downloaded',
]);

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    res.setHeader('Allow', 'POST');
    res.status(405).json({ ok: false, error: 'method_not_allowed' });
    return;
  }

  const secret = process.env.SIGNALS_SHARED_SECRET;
  if (!secret) {
    res.status(503).json({ ok: false, error: 'signals_not_configured' });
    return;
  }

  let body;
  try {
    body = await readJsonBody(req);
  } catch {
    res.status(400).json({ ok: false, error: 'invalid_json' });
    return;
  }

  const event = normalizeEvent(body);
  if (!event) {
    res.status(400).json({ ok: false, error: 'invalid_signal' });
    return;
  }

  try {
    const endpoint = process.env.SIGNALS_ENDPOINT || DEFAULT_SIGNALS_ENDPOINT;
    const upstream = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${secret}`,
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(event),
    });

    const text = await upstream.text();
    let payload;
    try {
      payload = text ? JSON.parse(text) : {};
    } catch {
      payload = { raw: text };
    }

    res.status(upstream.status).json(payload);
  } catch {
    res.status(502).json({ ok: false, error: 'signals_forward_failed' });
  }
};

async function readJsonBody(req) {
  if (req.body && typeof req.body === 'object') {
    return req.body;
  }
  if (typeof req.body === 'string') {
    return req.body ? JSON.parse(req.body) : {};
  }
  if (Buffer.isBuffer(req.body)) {
    const rawBody = req.body.toString('utf8');
    return rawBody ? JSON.parse(rawBody) : {};
  }

  let size = 0;
  const chunks = [];
  for await (const chunk of req) {
    size += chunk.length;
    if (size > MAX_BODY_BYTES) {
      throw new Error('body_too_large');
    }
    chunks.push(chunk);
  }

  const raw = Buffer.concat(chunks).toString('utf8');
  return raw ? JSON.parse(raw) : {};
}

function normalizeEvent(body) {
  if (!body || typeof body !== 'object') return null;
  const eventName = cleanString(body.event, 80);
  if (!ALLOWED_EVENTS.has(eventName)) return null;

  const normalized = {
    project: 'portfolio',
    env: process.env.SIGNALS_ENV || 'prod',
    event: eventName,
    occurred_at: cleanString(body.occurred_at, 40) || new Date().toISOString(),
    properties: sanitizeProperties(body.properties),
  };

  for (const field of [
    'anonymous_id',
    'path',
    'referrer',
    'utm_source',
    'utm_medium',
    'utm_campaign',
    'portfolio_click_id',
  ]) {
    const value = cleanString(body[field], 500);
    if (value) normalized[field] = value;
  }

  return normalized;
}

function sanitizeProperties(properties) {
  if (!properties || typeof properties !== 'object' || Array.isArray(properties)) return {};

  const sanitized = {};
  for (const [key, value] of Object.entries(properties).slice(0, 20)) {
    if (!/^[a-zA-Z0-9_:-]{1,60}$/.test(key)) continue;
    if (value === null || typeof value === 'boolean' || typeof value === 'number') {
      sanitized[key] = value;
    } else if (typeof value === 'string') {
      sanitized[key] = value.slice(0, 500);
    }
  }
  return sanitized;
}

function cleanString(value, limit) {
  if (value === undefined || value === null) return '';
  return String(value).trim().slice(0, limit);
}
