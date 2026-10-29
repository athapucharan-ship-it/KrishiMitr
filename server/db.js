'use strict';

const { MongoClient, ServerApiVersion } = require('mongodb');

let client;
let database;

function hasPlaceholder(value) {
  return !value || /<[^>]+>|\b(db_password|your_password|changeme)\b/i.test(value);
}

async function connectDatabase() {
  const uri = process.env.MONGODB_URI;
  const databaseName = process.env.MONGODB_DATABASE || 'KrishMithr';
  if (databaseName !== 'KrishMithr') throw new Error('MONGODB_DATABASE must be KrishMithr.');
  if (hasPlaceholder(uri)) throw new Error('Set MONGODB_URI in .env; the provided password is still a placeholder.');

  client = new MongoClient(uri, {
    serverApi: { version: ServerApiVersion.v1, strict: true, deprecationErrors: true },
    serverSelectionTimeoutMS: 10000,
    maxPoolSize: 10,
    retryWrites: true
  });
  await client.connect();
  // Never derive the database name from user or request input. If KrishMithr
  // does not exist yet, creating its app indexes initializes only this DB.
  database = client.db(databaseName);
  await Promise.all([
    database.collection('users').createIndex({ email: 1 }, { unique: true }),
    database.collection('sessions').createIndex({ tokenHash: 1 }, { unique: true }),
    database.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 }),
    database.collection('favorites').createIndex({ userId: 1 }, { unique: true }),
    database.collection('soils').createIndex({ id: 1 }, { unique: true }),
    database.collection('crops').createIndex({ id: 1 }, { unique: true }),
    database.collection('diseases').createIndex({ id: 1, cropId: 1 }, { unique: true }),
    database.collection('diseases').createIndex({ cropId: 1, published: 1 }),
    database.collection('enquiries').createIndex({ createdAt: -1 }),
    database.collection('enquiries').createIndex({ status: 1, createdAt: -1 }),
    database.collection('media').createIndex({ id: 1 }, { unique: true }),
    database.collection('media').createIndex({ kind: 1, published: 1 }),
    database.collection('site_settings').createIndex({ id: 1 }, { unique: true })
  ]);
  return database;
}

function getDatabase() {
  if (!database) throw new Error('Database has not been connected.');
  return database;
}

async function closeDatabase() {
  if (client) await client.close();
  client = undefined;
  database = undefined;
}

module.exports = { connectDatabase, getDatabase, closeDatabase };
