'use strict';

const { connectDatabase, getDatabase, closeDatabase } = require('../server/db');
const { normalizeEmail, makePasswordHash } = require('../server/auth');

async function main() {
  const fullName = String(process.env.ADMIN_NAME || '').trim().replace(/\s+/g, ' ');
  const email = normalizeEmail(process.env.ADMIN_EMAIL);
  const password = process.env.ADMIN_PASSWORD || '';
  if (fullName.length < 2 || fullName.length > 80 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || password.length < 12 || password.length > 128) {
    throw new Error('Set ADMIN_NAME, ADMIN_EMAIL, and a unique ADMIN_PASSWORD of at least 12 characters temporarily in .env. Remove ADMIN_PASSWORD after creation.');
  }
  await connectDatabase();
  const users = getDatabase().collection('users');
  if (await users.findOne({ email })) throw new Error('That email already belongs to an account; no role was changed. Use the approved admin provisioning process.');
  await users.insertOne({ fullName, email, passwordHash: await makePasswordHash(password), role: 'admin', createdAt: new Date(), updatedAt: new Date() });
  console.log(`Admin account created for ${email}. Remove ADMIN_PASSWORD from .env now.`);
}

main().catch(error => {
  console.error(`Admin provisioning failed: ${error.message}`);
  process.exitCode = 1;
}).finally(() => closeDatabase().catch(() => {}));
