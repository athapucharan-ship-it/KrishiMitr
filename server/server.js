'use strict';

const path = require('node:path');
const fs = require('node:fs');
const { randomUUID } = require('node:crypto');
const express = require('express');
const helmet = require('helmet');
const multer = require('multer');
const { connectDatabase, getDatabase, closeDatabase } = require('./db');
const auth = require('./auth');

const app = express();
const port = Number(process.env.PORT) || 3000;
const root = path.resolve(__dirname, '..');
const uploadDir = path.join(root, 'data', 'uploads');
fs.mkdirSync(uploadDir, { recursive: true });

app.disable('x-powered-by');
app.set('trust proxy', process.env.TRUST_PROXY === '1' ? 1 : false);
app.use(helmet({
  contentSecurityPolicy: { directives: {
    defaultSrc:["'self'"], baseUri:["'self'"], objectSrc:["'none'"], frameAncestors:["'none'"], formAction:["'self'"],
    scriptSrc:["'self'"], scriptSrcAttr:["'none'"], styleSrc:["'self'","'unsafe-inline'",'https://fonts.googleapis.com'],
    imgSrc:["'self'",'data:','https:'], fontSrc:["'self'",'data:','https://fonts.gstatic.com'],
    connectSrc:["'self'"], frameSrc:['https://www.youtube-nocookie.com'], upgradeInsecureRequests:process.env.NODE_ENV === 'production' ? [] : null
  } }, crossOriginEmbedderPolicy:false
}));
app.use(express.json({ limit: '32kb', strict: true }));
app.use((req, res, next) => {
  res.setHeader('Cache-Control', 'no-store');
  if (!req.path.startsWith('/api/')) return next();
  const origin = req.get('origin');
  if (origin && origin !== `${req.protocol}://${req.get('host')}`) return res.status(403).json({ code: 'BAD_ORIGIN', message: 'Request origin is not allowed.' });
  next();
});

function parseCookies(req, _res, next) {
  const header = req.headers.cookie || '';
  req.cookies = Object.create(null);
  for (const part of header.split(';')) {
    const separator = part.indexOf('=');
    if (separator < 0) continue;
    const key = part.slice(0, separator).trim();
    try { req.cookies[key] = decodeURIComponent(part.slice(separator + 1).trim()); } catch (_) { /* Ignore malformed cookie values. */ }
  }
  next();
}
app.use(parseCookies);

const attempts = new Map();
function rateLimit({ windowMs = 15 * 60 * 1000, max = 10 } = {}) {
  return (req, res, next) => {
    const now = Date.now();
    const key = `${req.ip}:${req.path}`;
    let entry = attempts.get(key);
    if (!entry || entry.until <= now) entry = { count: 0, until: now + windowMs };
    entry.count += 1;
    attempts.set(key, entry);
    if (attempts.size > 5000) for (const [storedKey, stored] of attempts) if (stored.until <= now) attempts.delete(storedKey);
    res.setHeader('RateLimit-Limit', String(max));
    res.setHeader('RateLimit-Remaining', String(Math.max(0, max - entry.count)));
    if (entry.count > max) return res.status(429).json({ code: 'RATE_LIMITED', message: 'Too many attempts. Please try again shortly.' });
    next();
  };
}

function slug(value) { return String(value || '').trim().toLowerCase().normalize('NFKD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 80); }
function cleanText(value, max = 2000) { return typeof value === 'string' ? value.trim().slice(0, max) : ''; }
function validateObjectIdString(value) { return typeof value === 'string' && /^[a-z0-9][a-z0-9-]{0,79}$/.test(value); }
function safeImage(value, fallback='') {
  const image=cleanText(value,1000);
  return /^https:\/\//i.test(image) || /^\/uploads\/[A-Za-z0-9_-]+\.(?:jpe?g|png|webp)$/i.test(image) ? image : fallback;
}
function requireValidEntity(req, res, next) {
  if (!validateObjectIdString(req.params.id)) return res.status(400).json({ code: 'INVALID_ID', message: 'Invalid content identifier.' });
  next();
}

app.get('/api/health', (_req, res) => res.json({ status: 'ok', service: 'KrishMithr' }));
app.get('/api/brand', async (_req,res) => {
  const brand=await getDatabase().collection('site_settings').findOne({id:'public-site',published:true},{projection:{_id:0,authImage:1,authTitle:1,authDescription:1}});
  res.json({brand:brand||{}});
});
app.post('/api/auth/register', rateLimit({ max: 6 }), auth.register);
app.post('/api/auth/login', rateLimit({ max: 8 }), auth.login);
app.get('/api/auth/me', auth.sessionView, auth.me);
app.post('/api/auth/logout', auth.requireAuth, auth.logout);
app.patch('/api/auth/profile', auth.requireAuth, rateLimit({ max: 8 }), auth.updateProfile);

app.get('/api/catalog', auth.requireAuth, async (_req, res) => {
  const db = getDatabase();
  const [soils, crops, diseases, videos, settings] = await Promise.all([
    db.collection('soils').find({ published: true }, { projection: { _id: 0 } }).sort({ name: 1 }).toArray(),
    db.collection('crops').find({ published: true }, { projection: { _id: 0 } }).sort({ name: 1 }).toArray(),
    db.collection('diseases').find({ published: true }, { projection: { _id: 0 } }).sort({ name: 1 }).toArray(),
    db.collection('media').find({ kind: 'video', published: true }, { projection: { _id: 0, cropId: 1, diseaseId: 1, videoId: 1, title: 1, channel: 1 } }).toArray(),
    db.collection('site_settings').findOne({ id: 'public-site' }, { projection: { _id: 0, authImage:1,authTitle:1,authDescription:1,heroImage: 1, heroTitle: 1, heroDescription: 1, aboutImage: 1, aboutTitle: 1, aboutDescription: 1, footerDisclaimer: 1, faq: 1 } })
  ]);
  const diseaseMap = new Map();
  for (const disease of diseases) {
    if (!diseaseMap.has(disease.cropId)) diseaseMap.set(disease.cropId, {});
    diseaseMap.get(disease.cropId)[disease.id] = Object.fromEntries(Object.entries(disease).filter(([key]) => !['_id','cropId','published','createdAt','updatedAt'].includes(key)));
  }
  const cropMap = Object.fromEntries(crops.map(crop => [crop.id, {
    ...Object.fromEntries(Object.entries(crop).filter(([key]) => !['_id','soilIds','published','createdAt','updatedAt'].includes(key))),
    diseases: diseaseMap.get(crop.id) || {}
  }]));
  const normalizedSoils = soils.map(soil => ({ ...soil, cropIds: (soil.cropIds || []).filter(id => cropMap[id]) }));
  const teluguVideos = Object.fromEntries(videos.map(video => [`${video.cropId}:${video.diseaseId}`, { id: video.videoId, title: video.title, channel: video.channel }]));
  const symptomPhotos = await db.collection('media').find({ kind: 'disease-image', published: true }, { projection: { _id: 0, url: 1 } }).limit(3).toArray();
  res.json({ soils: normalizedSoils, crops: cropMap, teluguVideos, symptomPhotos: symptomPhotos.map(item => item.url), settings: settings || {} });
});

app.patch('/api/preferences', auth.requireAuth, async (req, res) => {
  if (!['light','dark'].includes(req.body?.theme)) return res.status(400).json({ code:'VALIDATION',message:'Theme must be light or dark.' });
  await getDatabase().collection('users').updateOne({ _id:req.auth.user._id }, { $set:{ 'preferences.theme':req.body.theme, updatedAt:new Date() } });
  res.json({ theme:req.body.theme });
});

app.get('/api/favorites', auth.requireAuth, async (req, res) => {
  const record = await getDatabase().collection('favorites').findOne({ userId: req.auth.user._id }, { projection: { _id: 0, items: 1 } });
  res.json({ favorites: record?.items || [] });
});
app.put('/api/favorites', auth.requireAuth, async (req, res) => {
  const rawItems = Array.isArray(req.body?.favorites) ? req.body.favorites.slice(0, 200) : null;
  if (!rawItems || rawItems.some(item => !validateObjectIdString(item?.cropId) || !validateObjectIdString(item?.soilId))) return res.status(400).json({ code: 'VALIDATION', message: 'Favorites contain an invalid crop or soil.' });
  const db = getDatabase();
  const ids = [...new Set(rawItems.map(item => item.cropId))];
  const known = await db.collection('crops').find({ id: { $in: ids }, published: true }, { projection: { _id: 0, id: 1, soilIds: 1 } }).toArray();
  const allowed = new Map(known.map(crop => [crop.id, new Set(crop.soilIds)]));
  if (rawItems.some(item => !allowed.get(item.cropId)?.has(item.soilId))) return res.status(400).json({ code: 'VALIDATION', message: 'A saved crop is not associated with that soil.' });
  const favorites = [...new Map(rawItems.map(item => [item.cropId, { cropId: item.cropId, soilId: item.soilId }])).values()];
  await db.collection('favorites').updateOne({ userId: req.auth.user._id }, { $set: { userId: req.auth.user._id, items: favorites, updatedAt: new Date() } }, { upsert: true });
  res.json({ favorites });
});

app.post('/api/contact', auth.requireAuth, rateLimit({ max: 4 }), async (req, res) => {
  const fullName = cleanText(req.body?.fullName, 80).replace(/\s+/g, ' ');
  const email = auth.normalizeEmail(req.body?.email);
  const subject = cleanText(req.body?.subject, 120);
  const message = cleanText(req.body?.message, 2000);
  if (fullName.length < 2 || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email) || message.length < 10 || !req.body?.consent) return res.status(400).json({ code: 'VALIDATION', message: 'Check your name, email, message (10–2000 characters), and consent.' });
  const result = await getDatabase().collection('enquiries').insertOne({ userId: req.auth.user._id, fullName, email, subject, message, consentAt: new Date(), status: 'new', createdAt: new Date() });
  res.status(201).json({ id: result.insertedId.toString(), message: 'Your message has been received.' });
});

const allowedCollections = new Set(['soils', 'crops', 'diseases', 'media', 'site_settings']);
function buildEntity(collectionName, body, existing = {}) {
  const now = new Date();
  const id = slug(body.id || body.name || existing.id);
  if (!id) return null;
  const base = { ...existing, id, name: cleanText(body.name || existing.name, 120), published: body.published !== false, updatedAt: now };
  if (collectionName === 'soils') return { ...base, tag: cleanText(body.tag ?? existing.tag, 120), description: cleanText(body.description ?? existing.description, 1000), image: safeImage(body.image,existing.image), alt: cleanText(body.alt ?? existing.alt, 300), cropIds: Array.isArray(body.cropIds) ? [...new Set(body.cropIds.filter(validateObjectIdString))].slice(0, 100) : existing.cropIds || [], createdAt: existing.createdAt || now };
  if (collectionName === 'crops') return { ...base, category: cleanText(body.category ?? existing.category, 120), description: cleanText(body.description ?? existing.description, 1000), seasons: Array.isArray(body.seasons) ? body.seasons.filter(x => ['Kharif','Rabi','Zaid','Year-round'].includes(x)) : existing.seasons || [], water: cleanText(body.water ?? existing.water, 80), duration: cleanText(body.duration ?? existing.duration, 100), image: safeImage(body.image,existing.image), alt: cleanText(body.alt ?? existing.alt, 300), soilIds: Array.isArray(body.soilIds) ? [...new Set(body.soilIds.filter(validateObjectIdString))].slice(0, 100) : existing.soilIds || [], createdAt: existing.createdAt || now };
  if (collectionName === 'diseases') return { ...base, cropId: slug(body.cropId ?? existing.cropId), type: cleanText(body.type ?? existing.type, 80), description: cleanText(body.description ?? existing.description, 1000), symptoms: Array.isArray(body.symptoms) ? body.symptoms.map(x => cleanText(x, 500)).filter(Boolean).slice(0, 20) : existing.symptoms || [], cause: cleanText(body.cause ?? existing.cause, 1000), conditions: cleanText(body.conditions ?? existing.conditions, 1000), prevention: Array.isArray(body.prevention) ? body.prevention.map(x => cleanText(x, 500)).filter(Boolean).slice(0, 20) : existing.prevention || [], management: Array.isArray(body.management) ? body.management.map(x => cleanText(x, 500)).filter(Boolean).slice(0, 20) : existing.management || [], image: safeImage(body.image,existing.image), alt: cleanText(body.alt ?? existing.alt, 300), createdAt: existing.createdAt || now };
  const settingsKeys=['authImage','authTitle','authDescription','heroImage','heroTitle','heroDescription','aboutImage','aboutTitle','aboutDescription','footerDisclaimer','faq','tagline'];
  const settings={};
  for(const key of settingsKeys){
    if(body[key]===undefined)continue;
    if(key.endsWith('Image'))settings[key]=safeImage(body[key],existing[key]);
    else if(key==='faq')settings[key]=Array.isArray(body[key])?body[key].filter(item=>item&&typeof item.question==='string'&&typeof item.answer==='string').slice(0,30).map(item=>({question:cleanText(item.question,240),answer:cleanText(item.answer,1200)})):existing.faq||[];
    else settings[key]=cleanText(body[key],key==='heroDescription'||key==='aboutDescription'||key==='footerDisclaimer'?2000:240);
  }
  return { ...base, ...settings, createdAt: existing.createdAt || now };
}

function contentIsValid(collectionName,doc){
  if(collectionName==='soils')return Boolean(doc.name&&doc.tag&&doc.description&&doc.image&&doc.alt&&doc.cropIds.length>=5);
  if(collectionName==='crops')return Boolean(doc.name&&doc.category&&doc.description&&doc.image&&doc.alt&&doc.seasons.length&&doc.water&&doc.duration&&doc.soilIds.length);
  if(collectionName==='diseases')return Boolean(doc.name&&doc.cropId&&doc.type&&doc.description&&doc.cause&&doc.conditions&&doc.symptoms.length&&doc.prevention.length&&doc.management.length);
  if(collectionName==='site_settings')return Boolean(doc.name&&doc.id==='public-site'&&doc.faq.length<=30);
  return true;
}

async function relationsAreValid(collectionName, doc) {
  const db=getDatabase();
  if(collectionName==='soils' && doc.cropIds.length) return await db.collection('crops').countDocuments({id:{$in:doc.cropIds}})===doc.cropIds.length;
  if(collectionName==='crops' && doc.soilIds.length) return await db.collection('soils').countDocuments({id:{$in:doc.soilIds}})===doc.soilIds.length;
  if(collectionName==='diseases') return Boolean(await db.collection('crops').findOne({id:doc.cropId}));
  return true;
}

app.get('/api/admin/overview', auth.requireAuth, auth.requireRole('admin','editor'), async (_req, res) => {
  const db = getDatabase();
  const [soils,crops,diseases,enquiries,users] = await Promise.all(['soils','crops','diseases','enquiries','users'].map(name => db.collection(name).countDocuments()));
  res.json({ soils,crops,diseases,enquiries,users });
});
app.get('/api/admin/:collection', auth.requireAuth, auth.requireRole('admin','editor'), async (req, res) => {
  if (req.params.collection === 'site_settings' && req.auth.user.role !== 'admin') return res.status(403).json({code:'FORBIDDEN',message:'Only admins can view site settings.'});
  if (req.params.collection === 'enquiries') {
    const items = await getDatabase().collection('enquiries').find({}, { projection: { fullName:1,email:1,subject:1,message:1,status:1,createdAt:1 } }).sort({ createdAt: -1 }).limit(500).toArray();
    return res.json({ items: items.map(({_id,...item}) => ({id:_id.toString(),...item})) });
  }
  if (req.params.collection === 'users') {
    if (req.auth.user.role !== 'admin') return res.status(403).json({code:'FORBIDDEN',message:'Only admins can view account roles.'});
    const users=await getDatabase().collection('users').find({}, {projection:{passwordHash:0}}).sort({createdAt:-1}).limit(500).toArray();
    return res.json({items:users.map(user=>({id:user._id.toString(),name:user.fullName,email:user.email,role:user.role,createdAt:user.createdAt}))});
  }
  if (!allowedCollections.has(req.params.collection)) return res.status(404).json({ code: 'NOT_FOUND', message: 'Admin resource not found.' });
  const docs = await getDatabase().collection(req.params.collection).find({}, { projection: { passwordHash: 0 } }).sort({ name: 1, createdAt: -1 }).limit(500).toArray();
  res.json({ items: docs.map(({ _id, ...item }) => item) });
});
app.post('/api/admin/:collection', auth.requireAuth, auth.requireRole('admin','editor'), async (req, res) => {
  const name = req.params.collection;
  if (name === 'site_settings' && req.auth.user.role !== 'admin') return res.status(403).json({code:'FORBIDDEN',message:'Only admins can change site settings.'});
  if (!allowedCollections.has(name)) return res.status(404).json({ code: 'NOT_FOUND', message: 'Admin resource not found.' });
  const doc = buildEntity(name, req.body);
  if (!doc || !contentIsValid(name,doc)) return res.status(400).json({ code: 'VALIDATION', message: 'Complete the required fields and content associations before saving.' });
  if (!await relationsAreValid(name,doc)) return res.status(400).json({code:'INVALID_RELATION',message:'Choose valid linked records before saving.'});
  doc.createdBy=req.auth.user._id;doc.updatedBy=req.auth.user._id;
  const existing = await getDatabase().collection(name).findOne(name==='diseases'?{id:doc.id,cropId:doc.cropId}:{ id: doc.id });
  if (existing) return res.status(409).json({ code: 'ALREADY_EXISTS', message: 'That content identifier already exists.' });
  await getDatabase().collection(name).insertOne(doc);
  if (name === 'soils') for (const cropId of doc.cropIds) await getDatabase().collection('crops').updateOne({id:cropId},{$addToSet:{soilIds:doc.id}});
  if (name === 'crops') for (const soilId of doc.soilIds) await getDatabase().collection('soils').updateOne({id:soilId},{$addToSet:{cropIds:doc.id}});
  res.status(201).json({ item: doc });
});
app.put('/api/admin/diseases/:cropId/:id', auth.requireAuth, auth.requireRole('admin','editor'), async (req,res) => {
  if(!validateObjectIdString(req.params.cropId)||!validateObjectIdString(req.params.id))return res.status(400).json({code:'INVALID_ID',message:'Invalid disease identifier.'});
  const collection=getDatabase().collection('diseases');
  const existing=await collection.findOne({cropId:req.params.cropId,id:req.params.id});
  if(!existing)return res.status(404).json({code:'NOT_FOUND',message:'Disease was not found.'});
  const doc=buildEntity('diseases',{...req.body,id:req.params.id,cropId:req.params.cropId},existing);
  if(!contentIsValid('diseases',doc)||!await relationsAreValid('diseases',doc))return res.status(400).json({code:'VALIDATION',message:'Complete the required disease details and choose a valid crop.'});
  doc.updatedBy=req.auth.user._id;
  await collection.replaceOne({_id:existing._id},doc);
  res.json({item:doc});
});
app.put('/api/admin/:collection/:id', auth.requireAuth, auth.requireRole('admin','editor'), requireValidEntity, async (req, res) => {
  const name = req.params.collection;
  if (name === 'site_settings' && req.auth.user.role !== 'admin') return res.status(403).json({code:'FORBIDDEN',message:'Only admins can change site settings.'});
  if (!allowedCollections.has(name)) return res.status(404).json({ code: 'NOT_FOUND', message: 'Admin resource not found.' });
  if(name==='diseases')return res.status(400).json({code:'CROP_REQUIRED',message:'Edit a disease through its linked crop.'});
  const collection = getDatabase().collection(name);
  const existing = await collection.findOne({ id: req.params.id });
  if (!existing) return res.status(404).json({ code: 'NOT_FOUND', message: 'Content was not found.' });
  const doc = buildEntity(name, { ...req.body, id: req.params.id }, existing);
  if (!doc || !contentIsValid(name,doc)) return res.status(400).json({ code: 'VALIDATION', message: 'Complete the required fields and content associations before saving.' });
  if (!await relationsAreValid(name,doc)) return res.status(400).json({code:'INVALID_RELATION',message:'Choose valid linked records before saving.'});
  doc.updatedBy=req.auth.user._id;
  await collection.replaceOne({ _id: existing._id }, doc);
  if (name === 'soils') {
    await getDatabase().collection('crops').updateMany({id:{$in:existing.cropIds||[]}},{ $pull:{soilIds:doc.id} });
    for (const cropId of doc.cropIds) await getDatabase().collection('crops').updateOne({id:cropId},{$addToSet:{soilIds:doc.id}});
  }
  if (name === 'crops') {
    await getDatabase().collection('soils').updateMany({id:{$in:existing.soilIds||[]}},{ $pull:{cropIds:doc.id} });
    for (const soilId of doc.soilIds) await getDatabase().collection('soils').updateOne({id:soilId},{$addToSet:{cropIds:doc.id}});
  }
  res.json({ item: doc });
});
app.delete('/api/admin/:collection/:id', auth.requireAuth, auth.requireRole('admin'), requireValidEntity, async (req, res) => {
  const name = req.params.collection;
  if (!['soils','crops','diseases','media'].includes(name)) return res.status(404).json({ code: 'NOT_FOUND', message: 'Admin resource not found.' });
  if(name==='diseases')return res.status(400).json({code:'CROP_REQUIRED',message:'Delete a disease through its linked crop.'});
  const deletedDoc=await getDatabase().collection(name).findOne({id:req.params.id});
  const result = await getDatabase().collection(name).deleteOne({ id: req.params.id });
  if (!result.deletedCount) return res.status(404).json({ code: 'NOT_FOUND', message: 'Content was not found.' });
  if (name === 'crops') await getDatabase().collection('diseases').deleteMany({ cropId: req.params.id });
  if (name === 'diseases') await getDatabase().collection('media').deleteMany({ diseaseId: req.params.id });
  if (name === 'crops') {
    await getDatabase().collection('soils').updateMany({cropIds:req.params.id},{$pull:{cropIds:req.params.id}});
    await getDatabase().collection('favorites').updateMany({},{$pull:{items:{cropId:req.params.id}}});
  }
  if (name === 'soils') {
    await getDatabase().collection('crops').updateMany({soilIds:req.params.id},{$pull:{soilIds:req.params.id}});
    await getDatabase().collection('favorites').updateMany({},{$pull:{items:{soilId:req.params.id}}});
  }
  if(name==='media' && deletedDoc?.url?.startsWith('/uploads/')) {
    const fileName=path.basename(deletedDoc.url);
    const filePath=path.join(uploadDir,fileName);
    if(filePath.startsWith(`${uploadDir}${path.sep}`) && fs.existsSync(filePath)) fs.unlinkSync(filePath);
  }
  res.status(204).end();
});
app.delete('/api/admin/diseases/:cropId/:id', auth.requireAuth, auth.requireRole('admin'), async (req,res) => {
  if(!validateObjectIdString(req.params.cropId)||!validateObjectIdString(req.params.id))return res.status(400).json({code:'INVALID_ID',message:'Invalid disease identifier.'});
  const result=await getDatabase().collection('diseases').deleteOne({cropId:req.params.cropId,id:req.params.id});
  if(!result.deletedCount)return res.status(404).json({code:'NOT_FOUND',message:'Disease was not found.'});
  await getDatabase().collection('media').deleteMany({cropId:req.params.cropId,diseaseId:req.params.id});
  res.status(204).end();
});
app.get('/api/admin/enquiries', auth.requireAuth, auth.requireRole('admin','editor'), async (_req, res) => {
  const items = await getDatabase().collection('enquiries').find({}, { projection: { fullName:1,email:1,subject:1,message:1,status:1,createdAt:1 } }).sort({ createdAt: -1 }).limit(500).toArray();
  res.json({ items: items.map(({_id,...item}) => ({id:_id.toString(),...item})) });
});
app.get('/api/admin/users', auth.requireAuth, auth.requireRole('admin'), async (_req,res) => {
  const items = await getDatabase().collection('users').find({}, {projection:{passwordHash:0}}).sort({createdAt:-1}).limit(500).toArray();
  res.json({items:items.map(user=>({id:user._id.toString(),fullName:user.fullName,email:user.email,role:user.role,createdAt:user.createdAt}))});
});
app.patch('/api/admin/users/:id/role', auth.requireAuth, auth.requireRole('admin'), async (req,res) => {
  const {ObjectId}=require('mongodb');
  if (!ObjectId.isValid(req.params.id) || !['user','editor','admin'].includes(req.body?.role)) return res.status(400).json({code:'VALIDATION',message:'Invalid user role.'});
  const targetId=new ObjectId(req.params.id);
  if (targetId.equals(req.auth.user._id)) return res.status(400).json({code:'SELF_ROLE_CHANGE',message:'You cannot change your own role.'});
  const target=await getDatabase().collection('users').findOne({_id:targetId},{projection:{role:1}});
  if(!target)return res.status(404).json({code:'NOT_FOUND',message:'Account not found.'});
  if(target.role==='admin' && req.body.role!=='admin' && await getDatabase().collection('users').countDocuments({role:'admin'})<=1) return res.status(409).json({code:'LAST_ADMIN',message:'At least one administrator must remain.'});
  await getDatabase().collection('users').updateOne({_id:targetId},{$set:{role:req.body.role,updatedAt:new Date()}});
  res.json({success:true});
});
app.patch('/api/admin/enquiries/:id', auth.requireAuth, auth.requireRole('admin','editor'), async (req, res) => {
  const { ObjectId } = require('mongodb');
  if (!ObjectId.isValid(req.params.id) || !['new','read','resolved'].includes(req.body?.status)) return res.status(400).json({ code:'VALIDATION',message:'Invalid enquiry update.' });
  await getDatabase().collection('enquiries').updateOne({_id:new ObjectId(req.params.id)},{$set:{status:req.body.status,updatedAt:new Date()}});
  res.json({success:true});
});

const storage = multer.diskStorage({
  destination: (_req, _file, callback) => callback(null, uploadDir),
  filename: (_req, file, callback) => callback(null, `${randomUUID()}${path.extname(file.originalname).toLowerCase()}`)
});
const upload = multer({ storage, limits: { fileSize: 5 * 1024 * 1024, files: 1 }, fileFilter: (_req, file, callback) => {
  const valid = new Set(['image/jpeg','image/png','image/webp']);
  callback(valid.has(file.mimetype) ? null : new Error('Only JPG, PNG, and WebP images are allowed.'), valid.has(file.mimetype));
} });
app.post('/api/admin/media/upload', auth.requireAuth, auth.requireRole('admin','editor'), upload.single('image'), async (req, res) => {
  if (!req.file) return res.status(400).json({ code:'VALIDATION',message:'Choose an image to upload.' });
  const bytes = fs.readFileSync(req.file.path);
  const type = req.file.mimetype;
  const validSignature = type === 'image/jpeg' ? bytes[0] === 0xff && bytes[1] === 0xd8 && bytes[2] === 0xff : type === 'image/png' ? bytes.subarray(0,8).equals(Buffer.from([137,80,78,71,13,10,26,10])) : bytes.subarray(0,4).toString() === 'RIFF' && bytes.subarray(8,12).toString() === 'WEBP';
  if (!validSignature) { fs.unlinkSync(req.file.path); return res.status(400).json({ code:'INVALID_IMAGE',message:'The uploaded file is not a valid supported image.' }); }
  const doc = { id: path.parse(req.file.filename).name, kind:'image', name:cleanText(req.body?.name,120)||req.file.originalname.slice(0,120), url:`/uploads/${req.file.filename}`, mimeType:type, size:bytes.length, createdBy:req.auth.user._id, createdAt:new Date(), published:true };
  await getDatabase().collection('media').insertOne(doc);
  res.status(201).json({ item:{ id:doc.id,name:doc.name,url:doc.url,mimeType:doc.mimeType,size:doc.size } });
});

app.use('/uploads', express.static(uploadDir, { fallthrough: false, maxAge: '7d', immutable: true, setHeaders(res) { res.setHeader('X-Content-Type-Options','nosniff'); } }));
app.get('/robots.txt', (_req,res) => res.type('text/plain').send('User-agent: *\nAllow: /\nDisallow: /api/\nDisallow: /#admin\n'));
app.get('/sitemap.xml', (_req,res) => res.type('application/xml').send(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"><url><loc>${reqBase(res.req)}/</loc></url></urlset>`));
function reqBase(req) { return `${req.protocol}://${req.get('host')}`; }

app.get('/', (_req, res) => res.sendFile(path.join(root, 'index.html')));
app.get('/index.html', (_req, res) => res.sendFile(path.join(root, 'index.html')));
app.get('/app.js', (_req,res) => {res.setHeader('Content-Type','text/javascript; charset=utf-8');res.setHeader('Cache-Control','no-cache');res.sendFile(path.join(root,'app.js'));});
app.use('/api', (_req,res) => res.status(404).json({ code:'NOT_FOUND',message:'API route not found.' }));
app.use((_req,res) => res.status(404).type('html').send('<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>Not found · KrishMithr</title><body style="font:16px system-ui;max-width:42rem;margin:15vh auto;padding:2rem;color:#263c35"><h1>That field path doesn’t exist.</h1><p>The page may have moved or the address may be incomplete.</p><a href="/">Return to KrishMithr</a></body></html>'));
app.use((error, req, res, _next) => {
  if (error?.status === 400 && error?.type === 'entity.parse.failed') return res.status(400).json({code:'INVALID_JSON',message:'Request body contains invalid JSON.'});
  if (error?.code === 11000) {
    if (req.path === '/api/auth/register' || req.path === '/api/auth/profile') return res.status(409).json({ code:'EMAIL_EXISTS',message:'An account with this email already exists. Sign in instead.' });
    return res.status(409).json({ code:'DUPLICATE_RECORD',message:'A record with this identifier already exists.' });
  }
  if (error instanceof multer.MulterError) return res.status(400).json({ code:'UPLOAD_ERROR',message:error.code === 'LIMIT_FILE_SIZE' ? 'Image must be 5 MB or smaller.' : 'The image upload could not be processed.' });
  if (error?.message?.startsWith('Only JPG')) return res.status(400).json({ code:'INVALID_IMAGE',message:error.message });
  if (error?.status === 404 && error?.name === 'NotFoundError') return res.status(404).json({ code:'NOT_FOUND',message:'File not found.' });
  console.error('Request failed:', error?.message || 'unknown error');
  res.status(500).json({ code:'INTERNAL_ERROR',message:'Something went wrong. Please try again.' });
});

async function start() {
  await connectDatabase();
  const server = app.listen(port, () => console.log(`KrishMithr listening on port ${port} using database KrishMithr.`));
  const shutdown = async () => { server.close(async () => { await closeDatabase(); process.exit(0); }); };
  process.once('SIGINT', shutdown);
  process.once('SIGTERM', shutdown);
}

if (require.main === module) start().catch(error => {
  console.error(`KrishMithr could not start: ${error.message}`);
  process.exitCode = 1;
});

module.exports = { app, start };
