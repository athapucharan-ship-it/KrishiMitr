'use strict';

const { createHash, randomBytes, scrypt: scryptCallback, timingSafeEqual } = require('node:crypto');
const { promisify } = require('node:util');
const { getDatabase } = require('./db');

const scrypt = promisify(scryptCallback);
const COOKIE_NAME = 'krishmithr_session';
const SESSION_DAYS = Math.min(30, Math.max(1, Number(process.env.SESSION_TTL_DAYS) || 7));
const SESSION_MS = SESSION_DAYS * 24 * 60 * 60 * 1000;
const COOKIE_OPTIONS = {
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: 'strict',
  path: '/',
  maxAge: SESSION_MS
};

const genericHash = createHash('sha256').update('krishmithr-invalid-session').digest();
function hashToken(token) { return createHash('sha256').update(token).digest('hex'); }
function safeUser(user) {
  return { id: user._id.toString(), fullName: user.fullName, email: user.email, role: user.role, theme: user.preferences?.theme === 'dark' ? 'dark' : 'light', createdAt: user.createdAt };
}
function normalizeEmail(value) { return String(value || '').trim().toLowerCase(); }
function validEmail(value) { return value.length <= 254 && /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value); }

async function makePasswordHash(password) {
  const salt = randomBytes(16);
  const derived = await scrypt(password, salt, 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
  return `scrypt$16384$8$1$${salt.toString('hex')}$${derived.toString('hex')}`;
}

async function verifyPassword(password, stored) {
  const parts = String(stored || '').split('$');
  if (parts.length !== 6 || parts[0] !== 'scrypt') {
    await scrypt(password, Buffer.alloc(16), 64, { N: 16384, r: 8, p: 1, maxmem: 64 * 1024 * 1024 });
    return false;
  }
  const [, n, r, p, saltHex, expectedHex] = parts;
  try {
    const salt = Buffer.from(saltHex, 'hex');
    const expected = Buffer.from(expectedHex, 'hex');
    const actual = await scrypt(password, salt, expected.length, { N: Number(n), r: Number(r), p: Number(p), maxmem: 64 * 1024 * 1024 });
    return actual.length === expected.length && timingSafeEqual(actual, expected);
  } catch (_) { return false; }
}

function issueCookie(res, token) { res.cookie(COOKIE_NAME, token, COOKIE_OPTIONS); }
function clearCookie(res) {
  const { maxAge, ...options } = COOKIE_OPTIONS;
  res.clearCookie(COOKIE_NAME, options);
}

async function register(req, res) {
  const fullName = String(req.body?.fullName || '').trim().replace(/\s+/g, ' ');
  const email = normalizeEmail(req.body?.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (fullName.length < 2 || fullName.length > 80) return res.status(400).json({ code: 'VALIDATION', message: 'Enter your full name (2–80 characters).' });
  if (!validEmail(email)) return res.status(400).json({ code: 'VALIDATION', message: 'Enter a valid email address.' });
  if (password.length < 8 || password.length > 128) return res.status(400).json({ code: 'VALIDATION', message: 'Password must contain 8–128 characters.' });

  const db = getDatabase();
  const existing = await db.collection('users').findOne({ email }, { projection: { _id: 1 } });
  if (existing) return res.status(409).json({ code: 'EMAIL_EXISTS', message: 'An account with this email already exists. Sign in instead.' });
  const now = new Date();
  const result = await db.collection('users').insertOne({ fullName, email, passwordHash: await makePasswordHash(password), role: 'user', createdAt: now, updatedAt: now });
  const user = await db.collection('users').findOne({ _id: result.insertedId });
  await startSession(user, res);
  res.status(201).json({ user: safeUser(user) });
}

async function login(req, res) {
  const email = normalizeEmail(req.body?.email);
  const password = typeof req.body?.password === 'string' ? req.body.password : '';
  if (!validEmail(email) || !password || password.length > 128) return res.status(400).json({ code: 'VALIDATION', message: 'Enter a valid email and password.' });
  const user = await getDatabase().collection('users').findOne({ email });
  const matches = await verifyPassword(password, user?.passwordHash);
  if (!user || !matches) return res.status(401).json({ code: 'INVALID_CREDENTIALS', message: 'Email or password is incorrect.' });
  await startSession(user, res);
  res.json({ user: safeUser(user) });
}

async function startSession(user, res) {
  const db = getDatabase();
  const token = randomBytes(32).toString('base64url');
  const now = new Date();
  const expiresAt = new Date(now.getTime() + SESSION_MS);
  await db.collection('sessions').insertOne({ userId: user._id, tokenHash: hashToken(token), createdAt: now, expiresAt });
  issueCookie(res, token);
}

async function requireAuth(req, res, next) {
  try {
    const token = req.cookies?.[COOKIE_NAME];
    if (!token || token.length > 100) return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sign in to continue.' });
    const db = getDatabase();
    const suppliedHash = hashToken(token);
    const session = await db.collection('sessions').findOne({ tokenHash: suppliedHash, expiresAt: { $gt: new Date() } });
    const actual = session ? Buffer.from(session.tokenHash, 'hex') : genericHash;
    const expected = session ? Buffer.from(suppliedHash, 'hex') : genericHash;
    if (!timingSafeEqual(actual, expected)) return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sign in to continue.' });
    const user = await db.collection('users').findOne({ _id: session.userId }, { projection: { passwordHash: 0 } });
    if (!user) return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sign in to continue.' });
    req.auth = { user, session };
    next();
  } catch (error) { next(error); }
}

function requireRole(...roles) {
  return (req, res, next) => {
    if (!req.auth || !roles.includes(req.auth.user.role)) return res.status(403).json({ code: 'FORBIDDEN', message: 'You do not have permission to perform this action.' });
    next();
  };
}

async function me(req, res) { res.json({ user: safeUser(req.auth.user) }); }

async function logout(req, res) {
  const token = req.cookies?.[COOKIE_NAME];
  if (token) await getDatabase().collection('sessions').deleteOne({ tokenHash: hashToken(token) });
  clearCookie(res);
  res.status(204).end();
}

async function updateProfile(req, res) {
  const fullName = String(req.body?.fullName || '').trim().replace(/\s+/g, ' ');
  const email = normalizeEmail(req.body?.email);
  if (fullName.length < 2 || fullName.length > 80 || !validEmail(email)) return res.status(400).json({ code: 'VALIDATION', message: 'Enter a valid name and email address.' });
  const db = getDatabase();
  const conflict = await db.collection('users').findOne({ email, _id: { $ne: req.auth.user._id } }, { projection: { _id: 1 } });
  if (conflict) return res.status(409).json({ code: 'EMAIL_EXISTS', message: 'An account with this email already exists.' });
  const update = { fullName, email, updatedAt: new Date() };
  if (req.body?.newPassword) {
    const currentPassword = typeof req.body.currentPassword === 'string' ? req.body.currentPassword : '';
    if (!await verifyPassword(currentPassword, req.auth.user.passwordHash)) return res.status(400).json({ code: 'CURRENT_PASSWORD', message: 'Current password is incorrect.' });
    if (typeof req.body.newPassword !== 'string' || req.body.newPassword.length < 8 || req.body.newPassword.length > 128) return res.status(400).json({ code: 'VALIDATION', message: 'New password must contain 8–128 characters.' });
    update.passwordHash = await makePasswordHash(req.body.newPassword);
    await db.collection('sessions').deleteMany({ userId: req.auth.user._id });
    await startSession({ ...req.auth.user, ...update }, res);
  }
  await db.collection('users').updateOne({ _id: req.auth.user._id }, { $set: update });
  const updatedUser = await db.collection('users').findOne({ _id: req.auth.user._id }, { projection: { passwordHash: 0 } });
  res.json({ user: safeUser(updatedUser) });
}

async function sessionView(req, res, next) {
  const token = req.cookies?.[COOKIE_NAME];
  if (!token) return res.status(401).json({ code: 'UNAUTHENTICATED', message: 'Sign in to continue.' });
  return requireAuth(req, res, next);
}

module.exports = { COOKIE_NAME, register, login, requireAuth, requireRole, me, logout, updateProfile, sessionView, normalizeEmail, makePasswordHash, safeUser };
