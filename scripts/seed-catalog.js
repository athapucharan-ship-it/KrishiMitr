'use strict';

const { connectDatabase, getDatabase, closeDatabase } = require('../server/db');

const source = require('../data/catalog-source.json');
const photo = id => typeof id === 'string' && /^https:\/\//i.test(id) ? id : `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=627&w=1200`;

async function main() {
  await connectDatabase();
  const db = getDatabase();
  const soils = source.soilRecords.map(record => ({ ...record, image: photo(record.image), published: true, createdAt: new Date(), updatedAt: new Date() }));
  const cropSoils = new Map(Object.keys(source.crops).map(id => [id, soils.filter(soil => soil.cropIds.includes(id)).map(soil => soil.id)]));
  const crops = Object.entries(source.crops).map(([id, record]) => {
    const { diseases, ...cropRecord } = record;
    return { ...cropRecord, id, image: photo(record.image), soilIds: cropSoils.get(id) || [], published: true, createdAt: new Date(), updatedAt: new Date() };
  });
  const diseaseRecords = [];
  const media = [];
  for (const [cropId, cropRecord] of Object.entries(source.crops)) {
    Object.values(cropRecord.diseases).forEach((disease, index) => {
      diseaseRecords.push({ ...disease, cropId, image: photo(source.symptomPhotos[index % source.symptomPhotos.length]), alt: `Illustrative crop symptom example for ${disease.name}; not a diagnostic photograph`, published: true, createdAt: new Date(), updatedAt: new Date() });
    });
  }
  for (const [pair, video] of Object.entries(source.teluguVideos)) {
    const [cropId, diseaseId] = pair.split(':');
    media.push({ id: `video-${cropId}-${diseaseId}`, kind: 'video', cropId, diseaseId, videoId: video.id, title: video.title, channel: video.channel, published: true, createdAt: new Date() });
  }
  source.symptomPhotos.forEach((image, index) => media.push({ id: `disease-image-${index + 1}`, kind: 'disease-image', url: photo(image), name: `Disease symptom example ${index + 1}`, published: true, createdAt: new Date() }));

  const settings = { id:'public-site', name:'Public site', authImage:photo(15826906), authTitle:'Grow with a little more confidence.', authDescription:'Explore soil, find crops suited to your field, and learn how to care for them through a practical farming guide.', heroImage:photo(15826906), heroTitle:'Discover the right crop for your soil.', heroDescription:'Explore suitable crops, understand plant diseases, and grow with a little more confidence.', aboutImage:photo(12969371), aboutTitle:'Small steps. Healthier harvests.', aboutDescription:'KrishMithr connects the ground beneath your feet to the crops you grow. Our educational field guide makes soil, crop choices, and common diseases a little easier to understand.', footerDisclaimer:'Information provided by KrishMithr is for general educational purposes. Consult local agricultural experts for crop-specific recommendations.', faq:[{question:'How do I know which soil I have?',answer:'Look at your soil’s texture, drainage, and how it feels when moist. The photos here are illustrative, not a soil-identification test. Ask a local agricultural officer or have a sample tested for texture, pH, and nutrients.'},{question:'Will every listed crop grow in my field?',answer:'The lists are starting points, not guaranteed planting recommendations. Rainfall, irrigation, climate, drainage, soil pH, and local varieties all matter. Check local recommendations and a recent soil test before choosing a crop.'},{question:'Can I watch the guides in Telugu?',answer:'Yes. Disease guides include topic-matched Telugu video resources where available. Third-party videos are educational and are not a substitute for diagnosis or locally approved advice.'},{question:'Where are my favorite crops saved?',answer:'Favorites are stored in your KrishMithr account, so you can access them after signing in on another device.'}], published:true, updatedAt:new Date() };

  const insertMissing=(records)=>records.map(record=>({updateOne:{filter:{id:record.id},update:{$setOnInsert:record},upsert:true}}));
  const results=await Promise.all([
    db.collection('soils').bulkWrite(insertMissing(soils),{ordered:false}),
    db.collection('crops').bulkWrite(insertMissing(crops),{ordered:false}),
    db.collection('diseases').bulkWrite(diseaseRecords.map(record=>({updateOne:{filter:{id:record.id,cropId:record.cropId},update:{$setOnInsert:record},upsert:true}})),{ordered:false}),
    db.collection('media').bulkWrite(insertMissing(media),{ordered:false}),
    db.collection('site_settings').updateOne({id:'public-site'},{$setOnInsert:settings},{upsert:true})
  ]);
  const inserted=results.slice(0,4).reduce((sum,result)=>sum+result.upsertedCount,0);
  console.log(`Imported ${inserted} missing records into KrishMithr. Matching content was left unchanged.`);
}

main().catch(error => {
  console.error(`Catalog seed failed: ${error.message}`);
  process.exitCode = 1;
}).finally(() => closeDatabase().catch(() => {}));
