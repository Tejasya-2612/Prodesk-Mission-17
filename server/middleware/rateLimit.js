const hits = new Map();

export function sensitiveLimiter(req, res, next) {
  const windowMs = 15 * 60 * 1000;
  const limit = 100;
  const key = `${req.ip}:${req.originalUrl}`;
  const now = Date.now();
  const current = hits.get(key) || { count: 0, resetAt: now + windowMs };

  if (current.resetAt <= now) {
    current.count = 0;
    current.resetAt = now + windowMs;
  }

  current.count += 1;
  hits.set(key, current);

  if (current.count > limit) {
    return res.status(429).json({ message: 'Too many requests. Please try again later.' });
  }

  next();
}
