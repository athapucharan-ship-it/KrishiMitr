/* ============================================
   KrishMithr — Main Application Script
   Smart Farming. Better Decisions. Healthier Crops.
   ============================================ */

// ---------- Image helpers (real Pexels URLs) ----------
const IMG = {
  hero: "https://images.pexels.com/photos/6474843/pexels-photo-6474843.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=900&w=1600",
  soils: {
    "Alluvial Soil": "https://images.pexels.com/photos/1000057/pexels-photo-1000057.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "Black Soil": "https://images.pexels.com/photos/15270377/pexels-photo-15270377.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "Red Soil": "https://images.pexels.com/photos/3859201/pexels-photo-3859201.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "Sandy Soil": "https://images.pexels.com/photos/12103291/pexels-photo-12103291.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "Laterite Soil": "https://images.pexels.com/photos/14408952/pexels-photo-14408952.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "Loamy Soil": "https://images.pexels.com/photos/13094658/pexels-photo-13094658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "Clay Soil": "https://images.pexels.com/photos/5739224/pexels-photo-5739224.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600"
  },
  crops: {
    Rice: "https://images.pexels.com/photos/29733497/pexels-photo-29733497.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Wheat: "https://images.pexels.com/photos/6129025/pexels-photo-6129025.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Sugarcane: "https://images.pexels.com/photos/35778481/pexels-photo-35778481.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Maize: "https://images.pexels.com/photos/20234940/pexels-photo-20234940.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Pulses: "https://images.pexels.com/photos/20356790/pexels-photo-20356790.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Cotton: "https://images.pexels.com/photos/13924875/pexels-photo-13924875.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Soybean: "https://images.pexels.com/photos/13094651/pexels-photo-13094651.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Sorghum: "https://images.pexels.com/photos/16977456/pexels-photo-16977456.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Sunflower: "https://images.pexels.com/photos/18979035/pexels-photo-18979035.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Groundnut: "https://images.pexels.com/photos/33303306/pexels-photo-33303306.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Millets: "https://images.pexels.com/photos/16977456/pexels-photo-16977456.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Potato: "https://images.pexels.com/photos/15830046/pexels-photo-15830046.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Tomato: "https://images.pexels.com/photos/13094658/pexels-photo-13094658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Chickpea: "https://images.pexels.com/photos/10111851/pexels-photo-10111851.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Barley: "https://images.pexels.com/photos/6129025/pexels-photo-6129025.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Mustard: "https://images.pexels.com/photos/35383652/pexels-photo-35383652.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Jute: "https://images.pexels.com/photos/37446468/pexels-photo-37446468.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Tea: "https://images.pexels.com/photos/30557521/pexels-photo-30557521.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Cashew: "https://images.pexels.com/photos/33303280/pexels-photo-33303280.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Coconut: "https://images.pexels.com/photos/27624218/pexels-photo-27624218.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Bajra: "https://images.pexels.com/photos/16977456/pexels-photo-16977456.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Watermelon: "https://images.pexels.com/photos/11678439/pexels-photo-11678439.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Onion: "https://images.pexels.com/photos/15830046/pexels-photo-15830046.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Gram: "https://images.pexels.com/photos/20356790/pexels-photo-20356790.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Paddy: "https://images.pexels.com/photos/13594137/pexels-photo-13594137.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Banana: "https://images.pexels.com/photos/35383652/pexels-photo-35383652.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    Vegetables: "https://images.pexels.com/photos/13094658/pexels-photo-13094658.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600"
  },
  diseases: [
    "https://images.pexels.com/photos/28166522/pexels-photo-28166522.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "https://images.pexels.com/photos/19200236/pexels-photo-19200236.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "https://images.pexels.com/photos/2974409/pexels-photo-2974409.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "https://images.pexels.com/photos/5978603/pexels-photo-5978603.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "https://images.pexels.com/photos/30557521/pexels-photo-30557521.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600",
    "https://images.pexels.com/photos/19248484/pexels-photo-19248484.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=400&w=600"
  ]
};

function diseaseImg(name) {
  let hash = 0;
  for (let i = 0; i < name.length; i++) hash = (hash + name.charCodeAt(i) * (i + 1)) % IMG.diseases.length;
  return IMG.diseases[hash];
}

function cropImg(name) {
  return IMG.crops[name] || IMG.crops.Vegetables;
}

// ---------- Disease factory helper ----------
function d(description, symptoms, cause, conditions, prevention, management) {
  return { description, symptoms, cause, conditions, prevention, management };
}

const NOTE_PESTICIDE =
  "Consult a qualified agricultural expert or follow the pesticide label and local agricultural recommendations before applying any crop-protection product.";

// ---------- Telugu YouTube cure / management videos ----------
// Curated public YouTube videos (Telugu agriculture channels) explaining disease control.
// Keys are matched against disease name (and optionally crop) in priority order.
const TELUGU_VIDEOS = {
  // Exact / strong disease matches → YouTube video ID
  "tikka leaf spot": { id: "mKCu65DM5_A", title: "వేరుశనగ తిక్కా ఆకుమచ్చ నివారణ (Groundnut Tikka control)" },
  "tikka": { id: "mKCu65DM5_A", title: "వేరుశనగ తిక్కా ఆకుమచ్చ నివారణ" },
  "boll rot": { id: "CBioFJAQjvs", title: "పత్తి తెగుళ్ల నివారణ (Cotton disease control)" },
  "bacterial blight": { id: "CBioFJAQjvs", title: "పత్తి తెగుళ్ల నివారణ" },
  "leaf curl": { id: "VIfxcDVqsOc", title: "ఆకు ముడత తెగులు నివారణ (Leaf curl control)" },
  "yellow mosaic": { id: "VIfxcDVqsOc", title: "ఆకు ముడత / వైరస్ నివారణ" },
  "mosaic": { id: "VIfxcDVqsOc", title: "వైరస్ / మొజాయిక్ నివారణ సూచనలు" },
  "powdery mildew": { id: "XwQDLLVyiIc", title: "బూడిద తెగులు నివారణ (Powdery mildew)" },
  "downy mildew": { id: "XwQDLLVyiIc", title: "బూడిద / మిల్డ్యూ తెగులు నివారణ" },
  "rust": { id: "39czUi58uuM", title: "గోధుమ తుప్పు తెగులు నివారణ (Wheat rust)" },
  "stem rust": { id: "39czUi58uuM", title: "గోధుమ కాండం తుప్పు నివారణ" },
  "blast": { id: "xRDbLS0tM2k", title: "వరి బ్లాస్ట్ తెగులు నివారణ (Rice blast)" },
  "sheath blight": { id: "xRDbLS0tM2k", title: "వరి తెగుళ్ల నివారణ (Rice diseases)" },
  "bacterial leaf blight": { id: "xRDbLS0tM2k", title: "వరి ఆకు కాలిపోయే తెగులు" },
  "brown spot": { id: "xRDbLS0tM2k", title: "వరి ఆకు మచ్చ తెగులు" },
  "early blight": { id: "XwQDLLVyiIc", title: "ఆకు మచ్చ / బ్లైట్ నివారణ సూచనలు" },
  "late blight": { id: "XwQDLLVyiIc", title: "లేట్ బ్లైట్ నివారణ సూచనలు" },
  "wilt": { id: "CBioFJAQjvs", title: "మాడు / విల్ట్ తెగులు నివారణ" },
  "fusarium wilt": { id: "CBioFJAQjvs", title: "ఫ్యూజేరియం విల్ట్ నివారణ" },
  "bacterial wilt": { id: "CBioFJAQjvs", title: "బాక్టీరియల్ విల్ట్ నివారణ" },
  "root rot": { id: "CBioFJAQjvs", title: "వేరు కుళ్ళు తెగులు నివారణ" },
  "collar rot": { id: "mKCu65DM5_A", title: "కాలర్ రాట్ / వేరుశనగ తెగుళ్లు" },
  "stem rot": { id: "mKCu65DM5_A", title: "కాండం కుళ్ళు నివారణ" },
  "anthracnose": { id: "XwQDLLVyiIc", title: "ఆంత్రక్నోస్ / ఆకు మచ్చ నివారణ" },
  "leaf spot": { id: "XwQDLLVyiIc", title: "ఆకు మచ్చ తెగులు నివారణ" },
  "alternaria": { id: "XwQDLLVyiIc", title: "ఆల్టర్నేరియా ఆకు మచ్చ నివారణ" },
  "smut": { id: "39czUi58uuM", title: "ధాన్యపు తెగుళ్ల నివారణ" },
  "karnal bunt": { id: "39czUi58uuM", title: "గోధుమ తెగుళ్ల నివారణ" },
  "loose smut": { id: "39czUi58uuM", title: "గోధుమ స్మట్ నివారణ" },
  "red rot": { id: "CBioFJAQjvs", title: "చెరకు / పంట తెగుళ్ల నివారణ" },
  "stem borer": { id: "CBioFJAQjvs", title: "కాండం తొలుచు పురుగు నివారణ" },
  "aphids": { id: "CBioFJAQjvs", title: "పేనుబంక నివారణ" },
  "white rust": { id: "XwQDLLVyiIc", title: "తెల్ల తుప్పు / మిల్డ్యూ నివారణ" },
  "blister blight": { id: "XwQDLLVyiIc", title: "టీ / ఆకు తెగుళ్ల నివారణ" },
  "bud rot": { id: "CBioFJAQjvs", title: "కొబ్బరి / పంట కుళ్ళు తెగుళ్లు" },
  "ergot": { id: "39czUi58uuM", title: "ధాన్యపు పూత తెగుళ్ల నివారణ" },
  "grain mold": { id: "xRDbLS0tM2k", title: "ధాన్యం బూజు తెగులు నివారణ" },
  "damping off": { id: "XwQDLLVyiIc", title: "నారు కుళ్ళు తెగులు నివారణ" }
};

// Default Telugu crop-disease education video when no specific match exists
const DEFAULT_TELUGU_VIDEO = {
  id: "CBioFJAQjvs",
  title: "పంట తెగుళ్లు & నివారణ — తెలుగు వ్యవసాయ సూచనలు"
};

/**
 * Resolve the best Telugu YouTube video for a disease (+ optional crop).
 * Returns { id, title, watchUrl, searchUrl, embedUrl }
 */
function getTeluguVideo(diseaseName, cropName) {
  const disease = String(diseaseName || "").toLowerCase().trim();
  const crop = String(cropName || "").toLowerCase().trim();
  let match = null;

  // 1) Prefer longest key contained in disease name
  const keys = Object.keys(TELUGU_VIDEOS).sort((a, b) => b.length - a.length);
  for (const key of keys) {
    if (disease.includes(key)) {
      match = TELUGU_VIDEOS[key];
      break;
    }
  }

  // 2) Crop-specific soft hints
  if (!match) {
    if (crop.includes("rice") || crop.includes("paddy")) match = TELUGU_VIDEOS.blast;
    else if (crop.includes("wheat")) match = TELUGU_VIDEOS.rust;
    else if (crop.includes("cotton")) match = TELUGU_VIDEOS["boll rot"];
    else if (crop.includes("groundnut") || crop.includes("peanut")) match = TELUGU_VIDEOS.tikka;
    else if (crop.includes("tomato")) match = TELUGU_VIDEOS["leaf curl"];
  }

  if (!match) match = DEFAULT_TELUGU_VIDEO;

  const id = match.id;
  const q = `${diseaseName || ""} ${cropName || ""} తెగులు నివారణ తెలుగు`.trim();
  return {
    id,
    title: match.title || "తెలుగులో తెగులు నివారణ వీడియో",
    watchUrl: `https://www.youtube.com/watch?v=${id}`,
    embedUrl: `https://www.youtube-nocookie.com/embed/${id}?rel=0&modestbranding=1`,
    searchUrl: `https://www.youtube.com/results?search_query=${encodeURIComponent(q)}`
  };
}

/** Build HTML block for Telugu cure video embed + actions */
function renderTeluguVideoBlock(diseaseName, cropName) {
  const video = getTeluguVideo(diseaseName, cropName);
  const title = escapeHtml(video.title);
  const diseaseLabel = escapeHtml(diseaseName || "Disease");
  const cropLabel = escapeHtml(cropName || "Crop");

  return `
    <div class="detail-block video-block" id="telugu-video-block">
      <h3><i class="fa-brands fa-youtube" aria-hidden="true"></i> తెలుగు వీడియో — Disease Cure &amp; Management</h3>
      <p class="video-intro">
        Watch a <strong>Telugu</strong> agriculture video about managing
        <strong>${diseaseLabel}</strong>${cropName ? ` on <strong>${cropLabel}</strong>` : ""}.
        Practical field tips for prevention and control.
      </p>
      <div class="video-frame-wrap">
        <iframe
          class="disease-video-frame"
          src="${escapeHtml(video.embedUrl)}"
          title="${title}"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowfullscreen
          loading="lazy"
          referrerpolicy="strict-origin-when-cross-origin"
        ></iframe>
      </div>
      <p class="video-caption">${title}</p>
      <div class="video-actions">
        <a class="btn btn-primary btn-sm" href="${escapeHtml(video.watchUrl)}" target="_blank" rel="noopener noreferrer">
          <i class="fa-brands fa-youtube" aria-hidden="true"></i> Open on YouTube
        </a>
        <a class="btn btn-outline btn-sm" href="${escapeHtml(video.searchUrl)}" target="_blank" rel="noopener noreferrer">
          <i class="fa-solid fa-magnifying-glass" aria-hidden="true"></i> More Telugu videos
        </a>
      </div>
      <p class="video-disclaimer">
        Videos are third-party educational content. Always confirm advice with local agricultural officers before applying any product.
      </p>
    </div>`;
}

// Shared disease templates reused across crops where scientifically appropriate
const D = {
  earlyBlight: d(
    "A common fungal leaf disease that causes target-like spots and can defoliate plants if unmanaged.",
    "Dark brown concentric rings on older leaves, yellowing around spots, leaf drop, and stem lesions in severe cases.",
    "Fungal — typically Alternaria species.",
    "Warm temperatures (24–30°C), high humidity, prolonged leaf wetness, and crowded plantings.",
    "Use certified seed, rotate crops, remove infected debris, ensure good airflow, and avoid overhead irrigation late in the day.",
    "Remove severely infected leaves, maintain balanced nutrition, and monitor fields weekly. " + NOTE_PESTICIDE
  ),
  lateBlight: d(
    "A destructive disease that spreads rapidly in cool, wet weather and can ruin foliage and fruit/tubers.",
    "Water-soaked lesions that turn brown/black, white fuzzy growth under leaves in moist conditions, rapid plant collapse.",
    "Oomycete pathogen (Phytophthora-like organisms).",
    "Cool nights, wet foliage, high humidity, and dense canopies.",
    "Plant resistant varieties where available, improve drainage, avoid working in wet fields, and destroy volunteer plants.",
    "Scout frequently during wet spells and isolate affected patches early. " + NOTE_PESTICIDE
  ),
  powderyMildew: d(
    "A surface fungal infection that looks like white powder on leaves and reduces photosynthetic area.",
    "White to gray powdery patches on leaves, stems, or buds; leaves may yellow, curl, or dry prematurely.",
    "Fungal — Erysiphales group.",
    "Moderate temperatures, high humidity at night with dry days, shaded dense growth, and poor air circulation.",
    "Space plants properly, prune for airflow, avoid excess nitrogen, and remove heavily infected tissue.",
    "Keep canopy open and maintain plant vigor with balanced irrigation. " + NOTE_PESTICIDE
  ),
  bacterialWilt: d(
    "A bacterial vascular disease that causes sudden wilting even when soil moisture appears adequate.",
    "Rapid wilting of leaves during the day, recovery at night initially, then permanent wilt; cut stems may ooze bacterial slime.",
    "Bacterial — often Ralstonia or related soil-borne bacteria.",
    "Warm soil, high moisture, wounded roots, continuous cropping of susceptible hosts.",
    "Rotate with non-host crops, use clean seedlings, avoid waterlogging, and sanitize tools.",
    "Remove and destroy infected plants; improve drainage and avoid moving soil from infected areas. " + NOTE_PESTICIDE
  ),
  leafCurl: d(
    "A viral syndrome causing distorted, curled leaves and stunted growth, often spread by insect vectors.",
    "Upward or downward leaf curling, thickening, yellowing veins, reduced fruit set, and plant stunting.",
    "Viral — commonly transmitted by whiteflies or other sucking pests.",
    "Warm weather, high vector populations, continuous host crops nearby, and unprotected nurseries.",
    "Use virus-free seedlings, manage whiteflies with nets/traps, remove infected plants, and control weeds that host vectors.",
    "Focus on vector management and sanitation rather than curing infected plants. " + NOTE_PESTICIDE
  ),
  rootRot: d(
    "Soil-borne disease complex that decays roots, leading to poor uptake of water and nutrients.",
    "Yellowing, wilting, stunted growth, brown/black soft roots, and easy plant pull-out from soil.",
    "Fungal or oomycete pathogens in poorly drained soils; sometimes aggravated by nematodes.",
    "Waterlogged fields, heavy soils, cool wet spells, and repeated planting of the same crop.",
    "Improve drainage, avoid over-irrigation, use raised beds where suitable, and rotate crops.",
    "Do not replant immediately in the same spot; solarize or rest the bed if feasible. " + NOTE_PESTICIDE
  ),
  rust: d(
    "Fungal disease producing rusty pustules on leaves that reduce grain or forage quality.",
    "Orange, brown, or black pustules on leaves and stems; severe cases cause leaf drying and yield loss.",
    "Fungal — Puccinia and related rust fungi.",
    "Moderate temperatures, dew, rain splash, and presence of alternate hosts for some rusts.",
    "Grow resistant cultivars, avoid dense lodging-prone stands, and remove volunteer cereals.",
    "Monitor from early vegetative stages and act at first pustule appearance in high-risk seasons. " + NOTE_PESTICIDE
  ),
  blast: d(
    "A major cereal disease causing diamond-shaped lesions and neck infection that can cut grain filling.",
    "Spindle or diamond lesions with gray centers on leaves; neck rot near panicle; blank or partially filled grains.",
    "Fungal — Magnaporthe / Pyricularia species.",
    "High humidity, long leaf wetness, excess nitrogen, and dense planting.",
    "Balanced fertilizer, resistant varieties, proper spacing, and field sanitation after harvest.",
    "Avoid excessive nitrogen top-dressing in humid weather. " + NOTE_PESTICIDE
  ),
  smut: d(
    "Floral or grain infection that replaces kernels with black powdery spore masses.",
    "Sooty black powder instead of healthy grains; swollen or distorted ears/panicles in some smuts.",
    "Fungal — Ustilago and related smut fungi, often seed-borne.",
    "Cool moist weather at flowering, contaminated seed, and continuous cereal cropping.",
    "Use certified treated seed as advised locally, rotate cereals, and remove infected heads before spore release.",
    "Do not save seed from heavily infected fields. " + NOTE_PESTICIDE
  ),
  wiltFusarium: d(
    "A soil-borne fungal wilt that blocks water-conducting tissues inside the stem.",
    "Yellowing starting from lower leaves, one-sided wilt, brown vascular streaks in stem, plant death in patches.",
    "Fungal — Fusarium oxysporum and related formae speciales.",
    "Warm soil, stress from drought after wet periods, root wounds, and monoculture.",
    "Resistant varieties, long rotations, healthy seedlings, and avoid moving infested soil.",
    "Uproot infected plants carefully and maintain steady, moderate irrigation. " + NOTE_PESTICIDE
  ),
  anthracnose: d(
    "Fungal disease causing sunken dark lesions on leaves, stems, pods, or fruit.",
    "Dark, sunken spots with pinkish spore masses in wet weather; twig dieback or pod rotting.",
    "Fungal — Colletotrichum species.",
    "Warm rainy weather, overhead irrigation, and dense wet canopies.",
    "Use clean seed, improve airflow, avoid working plants when wet, and rotate hosts.",
    "Remove infected plant parts and keep harvest intervals timely. " + NOTE_PESTICIDE
  ),
  downyMildew: d(
    "Pathogen that thrives in cool wet conditions, producing yellow patches and downy growth beneath leaves.",
    "Angular yellow lesions on upper leaf surface with gray-purple fuzz underneath; distorted young growth.",
    "Oomycete — Peronospora / Pseudoperonospora group.",
    "Cool temperatures, high humidity, free moisture on leaves, and crowded plantings.",
    "Resistant cultivars, morning irrigation, wide spacing, and removal of infected debris.",
    "Reduce leaf wetness duration and monitor during monsoon or cool seasons. " + NOTE_PESTICIDE
  ),
  mosaic: d(
    "Viral disease causing mottled leaf patterns and uneven growth.",
    "Light and dark green mosaic patterns, leaf puckering, stunting, and reduced fruit or grain quality.",
    "Viral — often aphid or mechanical transmission depending on virus.",
    "High vector pressure, overlapping crop seasons, and use of infected cuttings/seed where applicable.",
    "Virus-free planting material, vector management, and removal of infected plants early.",
    "Control weeds that host viruses and avoid tobacco-stained hands when handling solanaceous crops. " + NOTE_PESTICIDE
  ),
  stemBorer: d(
    "Insect pest damage that tunnels stems, causing dead hearts or white ears in cereals.",
    "Dead central shoots in young plants, bore holes with frass, easy stem breakage, empty panicles.",
    "Pest-related — stem boring caterpillars (e.g., yellow stem borer complex).",
    "Staggered planting of hosts, excess nitrogen, and leftover stubbles harboring larvae.",
    "Synchronized planting, remove stubbles, use light traps as locally recommended, and encourage natural enemies.",
    "Avoid unnecessary broad-spectrum sprays that kill beneficial insects. " + NOTE_PESTICIDE
  ),
  aphids: d(
    "Sap-sucking insects that weaken plants and transmit viruses.",
    "Clusters of small soft-bodied insects on tender shoots, sticky honeydew, sooty mold, curled leaves.",
    "Pest-related — aphids; secondary viral transmission common.",
    "Cool to mild weather, lush over-fertilized growth, and absence of natural predators.",
    "Encourage ladybird beetles, avoid excess nitrogen, use yellow sticky traps, and protect seedlings with nets where practical.",
    "Wash mild infestations with water jets on sturdy plants; escalate only if thresholds are crossed. " + NOTE_PESTICIDE
  ),
  leafSpot: d(
    "General fungal or bacterial spotting that reduces leaf area and crop quality.",
    "Circular to irregular spots with dark borders, yellow halos, coalescing lesions, and premature defoliation.",
    "Fungal or bacterial depending on crop and region.",
    "Rain splash, high humidity, injured tissue, and continuous cropping.",
    "Crop rotation, resistant varieties, field sanitation, and balanced nutrition (especially potassium).",
    "Avoid overhead irrigation during peak disease periods. " + NOTE_PESTICIDE
  ),
  bollRot: d(
    "Complex of fungi and bacteria that rot cotton bolls, especially after rains.",
    "Discolored, soft, or mummified bolls; internal lint staining; premature boll opening failure.",
    "Fungal/bacterial complex often following insect injury or wet weather.",
    "Prolonged rains during boll formation, high humidity, and dense rank growth.",
    "Manage canopy density, control boll-feeding insects, and improve field air flow.",
    "Pick open bolls promptly after rains when possible. " + NOTE_PESTICIDE
  ),
  redLeaf: d(
    "Physiological or disease-associated reddening of leaves reducing sugarcane vigor.",
    "Reddening of midribs or leaf blades, stunting, and poor tillering in affected clumps.",
    "Often fungal (e.g., red rot complex) or stress-related depending on symptoms pattern.",
    "Water stress alternating with waterlogging, injured setts, and poor drainage.",
    "Use healthy setts, treat planting material as locally advised, and ensure drainage.",
    "Rogue severely affected clumps and avoid ratoon of heavily diseased fields. " + NOTE_PESTICIDE
  ),
  karnalBunt: d(
    "Grain disease of wheat producing fishy-smelling partially bunted kernels.",
    "Partial conversion of grains to black powder with foul odor; mostly noticed at harvest/threshing.",
    "Fungal — Tilletia indica (where present regionally).",
    "Cool humid weather at flowering, irrigation during heading in susceptible areas.",
    "Resistant varieties where available, avoid excess irrigation at flowering, and certified seed.",
    "Do not mix heavily contaminated grain with clean lots for seed. " + NOTE_PESTICIDE
  ),
  sheathBlight: d(
    "Important rice disease attacking leaf sheaths near water line and spreading upward.",
    "Oval gray-green lesions on sheaths that enlarge and dry; lodging in severe cases.",
    "Fungal — Rhizoctonia solani.",
    "High humidity, dense planting, excess nitrogen, and warm temperatures.",
    "Moderate plant population, balanced NPK, and field drainage between irrigations when feasible.",
    "Avoid very high nitrogen rates in humid monsoon conditions. " + NOTE_PESTICIDE
  )
};

// ---------- Agriculture database ----------
const agricultureData = {
  "Alluvial Soil": {
    description:
      "Fertile soil deposited by rivers, rich in potash and lime. Excellent water-holding capacity and ideal for intensive agriculture across Indo-Gangetic plains.",
    suitableNote: "Rice, Wheat, Sugarcane, Maize, Pulses",
    image: IMG.soils["Alluvial Soil"],
    crops: {
      Rice: {
        description: "Staple cereal grown in puddled fields; thrives in fertile alluvial belts with assured water.",
        season: "Kharif",
        water: "High",
        duration: "120–150 days",
        image: cropImg("Rice"),
        diseases: {
          Blast: D.blast,
          "Sheath Blight": D.sheathBlight,
          "Bacterial Leaf Blight": d(
            "Bacterial disease causing wavy yellow lesions on leaf margins and yield loss.",
            "Water-soaked stripes from leaf tips/margins turning yellow then white; kresek wilt in seedlings.",
            "Bacterial — Xanthomonas oryzae.",
            "Warm humid weather, strong winds/rain splash, excess nitrogen.",
            "Resistant varieties, balanced fertilizer, clean irrigation water practices, and field sanitation.",
            "Avoid clipping seedlings with contaminated tools. " + NOTE_PESTICIDE
          ),
          "Brown Spot": D.leafSpot,
          "Stem Borer": D.stemBorer
        }
      },
      Wheat: {
        description: "Major Rabi cereal requiring cool weather during growth and bright sun at maturity.",
        season: "Rabi",
        water: "Moderate",
        duration: "120–150 days",
        image: cropImg("Wheat"),
        diseases: {
          Rust: D.rust,
          "Karnal Bunt": D.karnalBunt,
          "Powdery Mildew": D.powderyMildew,
          Smut: D.smut,
          Aphids: D.aphids
        }
      },
      Sugarcane: {
        description: "Long-duration cash crop needing fertile soil, warm climate, and regular irrigation.",
        season: "Year-round",
        water: "High",
        duration: "10–18 months",
        image: cropImg("Sugarcane"),
        diseases: {
          "Red Rot": D.redLeaf,
          Wilt: D.wiltFusarium,
          Smut: D.smut,
          "Leaf Scald": D.leafSpot,
          "Stem Borer": D.stemBorer
        }
      },
      Maize: {
        description: "Versatile cereal for food, feed, and industry; responds well to fertile alluvial soils.",
        season: "Kharif",
        water: "Moderate",
        duration: "90–120 days",
        image: cropImg("Maize"),
        diseases: {
          "Turcicum Leaf Blight": D.earlyBlight,
          "Downy Mildew": D.downyMildew,
          Rust: D.rust,
          "Stalk Rot": D.rootRot,
          Aphids: D.aphids
        }
      },
      Pulses: {
        description: "Protein-rich legumes that also improve soil nitrogen when managed well.",
        season: "Rabi",
        water: "Low–Moderate",
        duration: "90–120 days",
        image: cropImg("Pulses"),
        diseases: {
          Wilt: D.wiltFusarium,
          "Root Rot": D.rootRot,
          "Powdery Mildew": D.powderyMildew,
          "Leaf Spot": D.leafSpot,
          Mosaic: D.mosaic
        }
      }
    }
  },

  "Black Soil": {
    description:
      "Dark, clay-rich soil (Regur) famous for moisture retention. Ideal for cotton and many oilseeds in the Deccan plateau.",
    suitableNote: "Cotton, Soybean, Wheat, Sorghum, Sunflower",
    image: IMG.soils["Black Soil"],
    crops: {
      Cotton: {
        description: "Premier fiber crop of black soils; needs a warm growing season and clear weather at boll opening.",
        season: "Kharif",
        water: "Moderate",
        duration: "150–180 days",
        image: cropImg("Cotton"),
        diseases: {
          "Boll Rot": D.bollRot,
          Wilt: D.wiltFusarium,
          "Leaf Curl": D.leafCurl,
          "Bacterial Blight": d(
            "Angular leaf spots and black arm symptoms that reduce photosynthetic area.",
            "Water-soaked angular spots, black veins on stems, boll lesions with internal rot.",
            "Bacterial — Xanthomonas citri pv. malvacearum.",
            "Warm wet weather and infected seed or debris.",
            "Acid-delinted certified seed, resistant hybrids, and field sanitation.",
            "Avoid overhead irrigation during outbreaks. " + NOTE_PESTICIDE
          ),
          "Root Rot": D.rootRot
        }
      },
      Soybean: {
        description: "Oilseed-legume suited to black soils; improves nitrogen status when nodulation is effective.",
        season: "Kharif",
        water: "Moderate",
        duration: "90–120 days",
        image: cropImg("Soybean"),
        diseases: {
          "Charcoal Rot": D.rootRot,
          "Rust": D.rust,
          "Bacterial Pustule": D.leafSpot,
          "Yellow Mosaic": D.mosaic,
          Anthracnose: D.anthracnose
        }
      },
      Wheat: {
        description: "Grown on residual moisture or with irrigation in black soil belts during cooler months.",
        season: "Rabi",
        water: "Moderate",
        duration: "110–140 days",
        image: cropImg("Wheat"),
        diseases: {
          Rust: D.rust,
          "Powdery Mildew": D.powderyMildew,
          "Loose Smut": D.smut,
          Aphids: D.aphids,
          "Leaf Blight": D.earlyBlight
        }
      },
      Sorghum: {
        description: "Hardy millets/cereal (jowar) that tolerates heat and intermittent moisture stress.",
        season: "Kharif",
        water: "Low–Moderate",
        duration: "100–120 days",
        image: cropImg("Sorghum"),
        diseases: {
          Anthracnose: D.anthracnose,
          "Grain Mold": d(
            "Fungal infection of panicles in humid weather that discolors and spoils grain.",
            "Pink, black, or gray mold on grains; shriveled seeds; poor germination.",
            "Fungal complex — Fusarium, Curvularia and others.",
            "Rain during grain filling and delayed harvest.",
            "Timely harvest, resistant hybrids, and good drying of grain.",
            "Do not store damp grain. " + NOTE_PESTICIDE
          ),
          Smut: D.smut,
          "Downy Mildew": D.downyMildew,
          "Stem Borer": D.stemBorer
        }
      },
      Sunflower: {
        description: "Oilseed crop with deep roots; performs well on moisture-retentive black soils.",
        season: "Rabi",
        water: "Moderate",
        duration: "90–110 days",
        image: cropImg("Sunflower"),
        diseases: {
          "Downy Mildew": D.downyMildew,
          Rust: D.rust,
          "Alternaria Leaf Spot": D.earlyBlight,
          Wilt: D.wiltFusarium,
          "Head Rot": D.anthracnose
        }
      }
    }
  },

  "Red Soil": {
    description:
      "Iron-rich soils ranging from sandy to clayey loam. Often porous and well-drained; fertility improves with organic matter and irrigation.",
    suitableNote: "Groundnut, Millets, Cotton, Pulses, Potato",
    image: IMG.soils["Red Soil"],
    crops: {
      Groundnut: {
        description: "Important oilseed and food legume; prefers well-drained light to medium red soils.",
        season: "Kharif",
        water: "Moderate",
        duration: "100–130 days",
        image: cropImg("Groundnut"),
        diseases: {
          "Tikka Leaf Spot": D.leafSpot,
          "Stem Rot": D.rootRot,
          Rust: D.rust,
          "Collar Rot": D.rootRot,
          "Bud Necrosis": D.mosaic
        }
      },
      Millets: {
        description: "Climate-resilient small grains ideal for rainfed red soil regions.",
        season: "Kharif",
        water: "Low",
        duration: "70–100 days",
        image: cropImg("Millets"),
        diseases: {
          Blast: D.blast,
          "Downy Mildew": D.downyMildew,
          Smut: D.smut,
          Rust: D.rust,
          "Grain Mold": d(
            "Discoloration and spoilage of millet grains under humid harvest conditions.",
            "Moldy, dull, or blackened grains; musty odor; reduced market value.",
            "Fungal complex favored by late rains.",
            "High humidity at maturity and delayed harvest.",
            "Harvest at proper maturity and dry grain thoroughly.",
            "Store only well-dried grain in clean containers. " + NOTE_PESTICIDE
          )
        }
      },
      Cotton: {
        description: "Grown in red soil zones with supplemental irrigation and good nutrient management.",
        season: "Kharif",
        water: "Moderate",
        duration: "150–180 days",
        image: cropImg("Cotton"),
        diseases: {
          Wilt: D.wiltFusarium,
          "Leaf Curl": D.leafCurl,
          "Boll Rot": D.bollRot,
          "Alternaria Leaf Spot": D.earlyBlight,
          Aphids: D.aphids
        }
      },
      Pulses: {
        description: "Short-duration legumes suited to red soils when drainage is adequate.",
        season: "Rabi",
        water: "Low–Moderate",
        duration: "80–110 days",
        image: cropImg("Pulses"),
        diseases: {
          Wilt: D.wiltFusarium,
          "Powdery Mildew": D.powderyMildew,
          "Root Rot": D.rootRot,
          Mosaic: D.mosaic,
          Anthracnose: D.anthracnose
        }
      },
      Potato: {
        description: "Cool-season tuber crop needing loose, well-drained red or loamy soils.",
        season: "Rabi",
        water: "Moderate–High",
        duration: "90–120 days",
        image: cropImg("Potato"),
        diseases: {
          "Late Blight": D.lateBlight,
          "Early Blight": D.earlyBlight,
          "Black Scurf": D.rootRot,
          "Bacterial Wilt": D.bacterialWilt,
          "Leaf Roll": D.leafCurl
        }
      }
    }
  },

  "Sandy Soil": {
    description:
      "Light-textured soil with large particles, rapid drainage, and low nutrient retention. Best for deep-rooted or drought-tolerant crops with frequent light irrigation and organic amendments.",
    suitableNote: "Groundnut, Bajra, Watermelon, Potato, Coconut",
    image: IMG.soils["Sandy Soil"],
    crops: {
      Groundnut: {
        description: "Excellent on sandy loams that allow peg penetration and easy harvesting.",
        season: "Kharif",
        water: "Moderate",
        duration: "100–120 days",
        image: cropImg("Groundnut"),
        diseases: {
          "Tikka Leaf Spot": D.leafSpot,
          Rust: D.rust,
          "Collar Rot": D.rootRot,
          "Aflatoxin Risk Mold": d(
            "Aspergillus infection linked to drought stress and poor post-harvest drying.",
            "Moldy pods/kernels; risk increases with delayed drying after harvest.",
            "Fungal — Aspergillus flavus complex (food safety concern).",
            "End-season drought, high soil temperature, and moist storage.",
            "Avoid harvest delays, dry pods quickly, and store below safe moisture.",
            "Sort damaged pods; follow food-safety guidance for market lots. " + NOTE_PESTICIDE
          ),
          Aphids: D.aphids
        }
      },
      Bajra: {
        description: "Pearl millet — highly drought hardy cereal for arid and sandy tracts.",
        season: "Kharif",
        water: "Low",
        duration: "75–100 days",
        image: cropImg("Bajra"),
        diseases: {
          "Downy Mildew": D.downyMildew,
          Ergot: d(
            "Floral disease producing sticky honeydew and toxic sclerotia in panicles.",
            "Pinkish sticky droplets on florets, later hard dark sclerotia replacing grains.",
            "Fungal — Claviceps species.",
            "Cool humid nights at flowering and delayed flowering hybrids in some cases.",
            "Resistant hybrids, timely sowing, and removal of sclerotia from seed lots.",
            "Do not consume heavily contaminated grain. " + NOTE_PESTICIDE
          ),
          Rust: D.rust,
          Smut: D.smut,
          "Stem Borer": D.stemBorer
        }
      },
      Watermelon: {
        description: "Warm-season cucurbit that likes sandy soils with good drainage and full sun.",
        season: "Zaid",
        water: "Moderate",
        duration: "80–110 days",
        image: cropImg("Watermelon"),
        diseases: {
          "Fusarium Wilt": D.wiltFusarium,
          "Powdery Mildew": D.powderyMildew,
          Anthracnose: D.anthracnose,
          "Downy Mildew": D.downyMildew,
          Mosaic: D.mosaic
        }
      },
      Potato: {
        description: "Needs loose sandy loam for proper tuber expansion and easy digging.",
        season: "Rabi",
        water: "Moderate–High",
        duration: "90–120 days",
        image: cropImg("Potato"),
        diseases: {
          "Late Blight": D.lateBlight,
          "Early Blight": D.earlyBlight,
          "Common Scab": d(
            "Tuber skin disease causing corky lesions that reduce market grade.",
            "Shallow to deep corky scabs on tuber surface; usually cosmetic but can be severe.",
            "Bacterial — Streptomyces species.",
            "Dry alkaline soils and soil moisture stress at tuber initiation.",
            "Maintain even moisture at tuber set, use less susceptible varieties, and avoid fresh manure high in scab risk.",
            "Grade out heavily scabbed tubers for seed. " + NOTE_PESTICIDE
          ),
          "Bacterial Wilt": D.bacterialWilt
        }
      },
      Coconut: {
        description: "Perennial palm adapted to coastal sandy soils with humid tropical climate.",
        season: "Year-round",
        water: "Moderate–High",
        duration: "Perennial (bearing in 5–7 years)",
        image: cropImg("Coconut"),
        diseases: {
          "Bud Rot": D.rootRot,
          "Leaf Blight": D.leafSpot,
          "Root Wilt Complex": d(
            "Debilitating syndrome with flaccidity of leaflets and reduced yield.",
            "Ribbing/flaccidity of leaves, yellowing, button shedding, and poor nut set.",
            "Often phytoplasma-associated with environmental stress factors.",
            "Poor drainage or drought stress, imbalanced nutrition, and neglected palms.",
            "Balanced nutrition (especially potassium and micronutrients as advised), basin management, and remove severely affected palms if recommended locally.",
            "Maintain hygienic crown cleaning practices. " + NOTE_PESTICIDE
          ),
          "Stem Bleeding": d(
            "Trunk disorder with reddish-brown exudation and internal rotting.",
            "Bleeding patches on trunk, tapering stem, reduced canopy vigor.",
            "Fungal — often Thielaviopsis-associated injury infections.",
            "Mechanical injuries, water stress, and poor nutrition.",
            "Avoid trunk injuries, improve irrigation regularity, and maintain basin hygiene.",
            "Chisel out rotten tissue only as guided by local experts. " + NOTE_PESTICIDE
          ),
          Aphids: D.aphids
        }
      }
    }
  },

  "Laterite Soil": {
    description:
      "Highly weathered, iron- and aluminum-rich soils found in high-rainfall zones. Often acidic and low in fertility unless amended with organics and lime as needed.",
    suitableNote: "Cashew, Tea, Coffee alternatives, Millets, Pulses",
    image: IMG.soils["Laterite Soil"],
    crops: {
      Cashew: {
        description: "Hardy tree crop widely grown on lateritic uplands along the west coast and similar zones.",
        season: "Year-round",
        water: "Low–Moderate",
        duration: "Perennial (economic yield from year 3–5)",
        image: cropImg("Cashew"),
        diseases: {
          Anthracnose: D.anthracnose,
          "Powdery Mildew": D.powderyMildew,
          "Dieback": d(
            "Twig drying from tips backward, reducing flowering wood.",
            "Drying of shoots, gummosis sometimes, sparse canopy.",
            "Fungal complex often following stress or injury.",
            "Dry spells after rains, poor nutrition, and pruning wounds.",
            "Balanced nutrition, hygienic pruning, and remove dried twigs.",
            "Protect fresh pruning cuts as locally recommended. " + NOTE_PESTICIDE
          ),
          "Leaf Spot": D.leafSpot,
          "Root Rot": D.rootRot
        }
      },
      Tea: {
        description: "Plantation crop preferring acidic lateritic/hilly soils with high rainfall and mist.",
        season: "Year-round",
        water: "High (rainfall)",
        duration: "Perennial",
        image: cropImg("Tea"),
        diseases: {
          "Blister Blight": d(
            "Major leaf disease of tea in humid hill regions.",
            "Pale translucent spots that become blister-like on young leaves; distorted flush.",
            "Fungal — Exobasidium vexans.",
            "Cool misty weather, continuous leaf wetness, dense shade.",
            "Manage shade, improve air flow, and pluck regularly to remove susceptible flush if advised.",
            "Follow plantation plant-protection schedules from local boards. " + NOTE_PESTICIDE
          ),
          "Grey Blight": D.leafSpot,
          "Root Rot": D.rootRot,
          "Red Rust Algae": d(
            "Algal leaf/stem discoloration common in humid tea gardens.",
            "Rusty red velvety patches on leaves and young stems.",
            "Algal — Cephaleuros species.",
            "High humidity, poor shade management, and weak bushes.",
            "Improve bush vigor and shade regulation; remove heavily affected shoots.",
            "Maintain sanitary pruning practices. " + NOTE_PESTICIDE
          ),
          Aphids: D.aphids
        }
      },
      Millets: {
        description: "Suited to poorer lateritic patches under rainfed conditions with organic enrichment.",
        season: "Kharif",
        water: "Low",
        duration: "70–100 days",
        image: cropImg("Millets"),
        diseases: {
          Blast: D.blast,
          "Downy Mildew": D.downyMildew,
          Smut: D.smut,
          Rust: D.rust,
          "Leaf Spot": D.leafSpot
        }
      },
      Pulses: {
        description: "Short legumes that can utilize lateritic soils when acidity and phosphorus are managed.",
        season: "Rabi",
        water: "Low–Moderate",
        duration: "85–110 days",
        image: cropImg("Pulses"),
        diseases: {
          Wilt: D.wiltFusarium,
          "Root Rot": D.rootRot,
          "Powdery Mildew": D.powderyMildew,
          Mosaic: D.mosaic,
          "Leaf Spot": D.leafSpot
        }
      },
      Coconut: {
        description: "Grown in coastal laterite-derived soils with adequate organic matter and moisture.",
        season: "Year-round",
        water: "Moderate–High",
        duration: "Perennial",
        image: cropImg("Coconut"),
        diseases: {
          "Bud Rot": D.rootRot,
          "Leaf Blight": D.leafSpot,
          "Stem Bleeding": d(
            "Trunk bleeding and internal decay reducing palm strength.",
            "Reddish ooze on trunk, canopy thinning, reduced nut yield.",
            "Fungal infection often after injury.",
            "Wounds, water stress, and nutrient imbalance.",
            "Prevent injuries, keep basins clean, and correct nutrient deficiencies.",
            "Seek local expert guidance for surgical cleaning of lesions. " + NOTE_PESTICIDE
          ),
          "Root Wilt Complex": d(
            "Decline disorder affecting productivity of palms.",
            "Leaf flaccidity, yellowing, and button shedding.",
            "Phytoplasma-related complex with abiotic stress.",
            "Erratic moisture and poor nutrition.",
            "Integrated nutrient and moisture management.",
            "Remove only palms as recommended by extension services. " + NOTE_PESTICIDE
          )
        }
      }
    }
  },

  "Loamy Soil": {
    description:
      "Balanced mixture of sand, silt, and clay — often considered ideal garden and farm soil with good structure, drainage, and fertility.",
    suitableNote: "Tomato, Wheat, Maize, Vegetables, Sugarcane",
    image: IMG.soils["Loamy Soil"],
    crops: {
      Tomato: {
        description: "High-value vegetable needing fertile loam, staking/support, and careful water management.",
        season: "Rabi",
        water: "Moderate",
        duration: "90–120 days",
        image: cropImg("Tomato"),
        diseases: {
          "Early Blight": D.earlyBlight,
          "Late Blight": D.lateBlight,
          "Bacterial Wilt": D.bacterialWilt,
          "Powdery Mildew": D.powderyMildew,
          "Leaf Curl": D.leafCurl
        }
      },
      Wheat: {
        description: "Performs excellently on well-drained fertile loams with timely irrigation.",
        season: "Rabi",
        water: "Moderate",
        duration: "120–150 days",
        image: cropImg("Wheat"),
        diseases: {
          Rust: D.rust,
          "Powdery Mildew": D.powderyMildew,
          "Karnal Bunt": D.karnalBunt,
          Aphids: D.aphids,
          Smut: D.smut
        }
      },
      Maize: {
        description: "Responds strongly to fertile loamy soils and balanced fertilization.",
        season: "Kharif",
        water: "Moderate",
        duration: "90–120 days",
        image: cropImg("Maize"),
        diseases: {
          "Leaf Blight": D.earlyBlight,
          "Downy Mildew": D.downyMildew,
          "Stalk Rot": D.rootRot,
          Rust: D.rust,
          "Stem Borer": D.stemBorer
        }
      },
      Vegetables: {
        description: "Mixed vegetables (leafy, fruiting, root) thrive in friable loamy beds with organics.",
        season: "Year-round",
        water: "Moderate",
        duration: "40–120 days (crop dependent)",
        image: cropImg("Vegetables"),
        diseases: {
          "Damping Off": D.rootRot,
          "Powdery Mildew": D.powderyMildew,
          "Leaf Spot": D.leafSpot,
          Mosaic: D.mosaic,
          Aphids: D.aphids
        }
      },
      Sugarcane: {
        description: "High biomass crop that benefits from deep fertile loams and full irrigation schedules.",
        season: "Year-round",
        water: "High",
        duration: "10–16 months",
        image: cropImg("Sugarcane"),
        diseases: {
          "Red Rot": D.redLeaf,
          Smut: D.smut,
          Wilt: D.wiltFusarium,
          "Leaf Spot": D.leafSpot,
          "Stem Borer": D.stemBorer
        }
      }
    }
  },

  "Clay Soil": {
    description:
      "Fine-textured soil with high water-holding capacity but risk of waterlogging and compaction. Best for crops that tolerate heavy soils when drainage is managed.",
    suitableNote: "Rice, Wheat, Chickpea, Mustard, Sugarcane",
    image: IMG.soils["Clay Soil"],
    crops: {
      Rice: {
        description: "Ideal for clayey paddies that hold standing water during the crop season.",
        season: "Kharif",
        water: "High",
        duration: "120–150 days",
        image: cropImg("Paddy"),
        diseases: {
          Blast: D.blast,
          "Sheath Blight": D.sheathBlight,
          "Bacterial Leaf Blight": d(
            "Leaf margin blight reducing grain filling under humid winds.",
            "Yellow-white leaf lesions from tips and margins; seedling kresek in severe cases.",
            "Bacterial — Xanthomonas oryzae.",
            "Stormy wet weather and high nitrogen.",
            "Resistant varieties and balanced nutrition.",
            "Sanitize tools used in nurseries. " + NOTE_PESTICIDE
          ),
          "Brown Spot": D.leafSpot,
          "Stem Borer": D.stemBorer
        }
      },
      Wheat: {
        description: "Grown on clay loams with careful irrigation to avoid crusting and waterlogging.",
        season: "Rabi",
        water: "Moderate",
        duration: "120–150 days",
        image: cropImg("Wheat"),
        diseases: {
          Rust: D.rust,
          "Powdery Mildew": D.powderyMildew,
          "Foot Rot": D.rootRot,
          Aphids: D.aphids,
          Smut: D.smut
        }
      },
      Chickpea: {
        description: "Important Rabi pulse (gram) often grown on receding moisture in clayey fields.",
        season: "Rabi",
        water: "Low–Moderate",
        duration: "100–120 days",
        image: cropImg("Chickpea"),
        diseases: {
          Wilt: D.wiltFusarium,
          "Ascochyta Blight": D.leafSpot,
          "Root Rot": D.rootRot,
          "Botrytis Grey Mold": d(
            "Flower and pod mold in cool humid weather reducing pod set.",
            "Gray fuzzy mold on flowers, pods, and leaves; blossom drop.",
            "Fungal — Botrytis cinerea.",
            "Cool wet spells during flowering and dense canopies.",
            "Wider spacing, avoid excess vegetative growth, and timely sowing.",
            "Improve airflow; avoid irrigation during flowering rains if possible. " + NOTE_PESTICIDE
          ),
          Aphids: D.aphids
        }
      },
      Mustard: {
        description: "Oilseed brassica suited to cooler season on heavier soils with moderate fertility.",
        season: "Rabi",
        water: "Low–Moderate",
        duration: "110–140 days",
        image: cropImg("Mustard"),
        diseases: {
          "White Rust": d(
            "Common mustard disease with white blister pustules on leaves and floral parts.",
            "White raised pustules on leaf undersides; staghead malformed inflorescences.",
            "Oomycete — Albugo candida.",
            "Cool humid weather and continuous brassica cropping.",
            "Crop rotation, clean seed, and resistant varieties where available.",
            "Remove severely malformed plants. " + NOTE_PESTICIDE
          ),
          "Alternaria Blight": D.earlyBlight,
          "Downy Mildew": D.downyMildew,
          Aphids: D.aphids,
          Sclerotinia: D.rootRot
        }
      },
      Sugarcane: {
        description: "Can succeed on clay soils if drainage channels prevent prolonged stagnation.",
        season: "Year-round",
        water: "High",
        duration: "10–18 months",
        image: cropImg("Sugarcane"),
        diseases: {
          "Red Rot": D.redLeaf,
          Wilt: D.wiltFusarium,
          Smut: D.smut,
          "Root Rot": D.rootRot,
          "Stem Borer": D.stemBorer
        }
      }
    }
  }
};

// ---------- Application state ----------
const state = {
  selectedSoil: null,
  selectedCrop: null,
  selectedDisease: null,
  seasonFilter: "All",
  cropSearch: "",
  favorites: [],
  currentStep: 1
};

// ---------- DOM refs ----------
const $ = (sel, root = document) => root.querySelector(sel);
const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

// ---------- Utilities ----------
function escapeHtml(str) {
  return String(str)
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function showToast(message) {
  const toast = $("#toast");
  if (!toast) return;
  toast.textContent = message;
  toast.hidden = false;
  requestAnimationFrame(() => toast.classList.add("show"));
  clearTimeout(showToast._t);
  showToast._t = setTimeout(() => {
    toast.classList.remove("show");
    setTimeout(() => {
      toast.hidden = true;
    }, 300);
  }, 2600);
}

function scrollToId(id) {
  const el = document.getElementById(id);
  if (el) el.scrollIntoView({ behavior: "smooth", block: "start" });
}

function imgTag(src, alt, fallbackEmoji = "🌿") {
  const safeAlt = escapeHtml(alt);
  const safeSrc = escapeHtml(src || "");
  return `<img src="${safeSrc}" alt="${safeAlt}" loading="lazy" onerror="this.style.display='none';this.parentElement.classList.add('img-failed');if(!this.parentElement.querySelector('.card-img-fallback')){const f=document.createElement('div');f.className='card-img-fallback';f.textContent='${fallbackEmoji}';f.setAttribute('aria-hidden','true');this.parentElement.appendChild(f);}" />`;
}

// ---------- Favorites (localStorage) ----------
function loadFavorites() {
  try {
    const raw = localStorage.getItem("krishmithr_favorites");
    state.favorites = raw ? JSON.parse(raw) : [];
    if (!Array.isArray(state.favorites)) state.favorites = [];
  } catch {
    state.favorites = [];
  }
}

function saveFavorites() {
  try {
    localStorage.setItem("krishmithr_favorites", JSON.stringify(state.favorites));
  } catch (e) {
    console.warn("Could not save favorites", e);
  }
}

function favKey(soil, crop) {
  return `${soil}||${crop}`;
}

function isFavorite(soil, crop) {
  return state.favorites.some((f) => f.soil === soil && f.crop === crop);
}

function toggleFavorite(soil, crop, btn) {
  if (!soil || !crop) return;
  const idx = state.favorites.findIndex((f) => f.soil === soil && f.crop === crop);
  if (idx >= 0) {
    state.favorites.splice(idx, 1);
    if (btn) {
      btn.classList.remove("active");
      btn.setAttribute("aria-pressed", "false");
      btn.setAttribute("aria-label", `Add ${crop} to favorites`);
    }
    showToast(`${crop} removed from favorites`);
  } else {
    const cropData = agricultureData[soil]?.crops?.[crop];
    state.favorites.push({
      soil,
      crop,
      season: cropData?.season || "",
      water: cropData?.water || "",
      duration: cropData?.duration || "",
      description: cropData?.description || "",
      image: cropData?.image || cropImg(crop)
    });
    if (btn) {
      btn.classList.add("active");
      btn.setAttribute("aria-pressed", "true");
      btn.setAttribute("aria-label", `Remove ${crop} from favorites`);
    }
    showToast(`${crop} added to favorites ⭐`);
  }
  saveFavorites();
  renderFavorites();
}

// ---------- Dark mode ----------
function loadTheme() {
  try {
    const theme = localStorage.getItem("krishmithr_theme");
    if (theme === "dark") {
      document.body.classList.add("dark");
      updateDarkToggleIcon(true);
    }
  } catch {
    /* ignore */
  }
}

function toggleDarkMode() {
  const isDark = document.body.classList.toggle("dark");
  try {
    localStorage.setItem("krishmithr_theme", isDark ? "dark" : "light");
  } catch {
    /* ignore */
  }
  updateDarkToggleIcon(isDark);
  showToast(isDark ? "Dark mode on 🌙" : "Light mode on ☀️");
}

function updateDarkToggleIcon(isDark) {
  const btn = $("#dark-toggle");
  if (!btn) return;
  btn.innerHTML = isDark
    ? '<i class="fa-solid fa-sun" aria-hidden="true"></i>'
    : '<i class="fa-solid fa-moon" aria-hidden="true"></i>';
  btn.setAttribute("aria-label", isDark ? "Switch to light mode" : "Switch to dark mode");
  btn.title = isDark ? "Light Mode" : "Dark Mode";
}

// ---------- Progress indicator ----------
function updateProgress(step) {
  state.currentStep = step;
  const steps = $$(".progress-step");
  steps.forEach((el) => {
    const s = Number(el.dataset.step);
    el.classList.remove("active", "completed");
    if (s < step) el.classList.add("completed");
    if (s === step) el.classList.add("active");
  });

  const summary = $("#selection-summary");
  if (!summary) return;
  const parts = [];
  if (state.selectedSoil) parts.push(`Soil: <strong>${escapeHtml(state.selectedSoil)}</strong>`);
  if (state.selectedCrop) parts.push(`Crop: <strong>${escapeHtml(state.selectedCrop)}</strong>`);
  if (state.selectedDisease) parts.push(`Disease: <strong>${escapeHtml(state.selectedDisease)}</strong>`);
  summary.innerHTML = parts.join(" · ");
}

// ---------- Section visibility ----------
function showSection(id, show = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.classList.toggle("hidden", !show);
}

function resetSelection() {
  state.selectedSoil = null;
  state.selectedCrop = null;
  state.selectedDisease = null;
  state.seasonFilter = "All";
  state.cropSearch = "";

  showSection("crops-section", false);
  showSection("diseases-section", false);
  showSection("disease-details-section", false);
  showSection("soil-section", true);

  const cropSearch = $("#crop-search");
  if (cropSearch) cropSearch.value = "";
  $$(".chip").forEach((c) => c.classList.toggle("active", c.dataset.season === "All"));

  updateProgress(1);
  renderSoils();
  scrollToId("soil-section");
  showToast("Selection reset — choose a soil to begin");
}

// ---------- Soil selection & rendering ----------
function renderSoils() {
  const grid = $("#soil-grid");
  if (!grid) return;

  const soils = Object.keys(agricultureData);
  if (!soils.length) {
    grid.innerHTML = `<div class="no-results"><i class="fa-solid fa-triangle-exclamation"></i><p>No soil data available.</p></div>`;
    return;
  }

  grid.innerHTML = soils
    .map((name) => {
      const soil = agricultureData[name];
      const selected = state.selectedSoil === name ? "selected" : "";
      const cropsList = Object.keys(soil.crops || {}).slice(0, 5).join(", ");
      return `
      <article class="card soil-card ${selected}" role="listitem" data-soil="${escapeHtml(name)}">
        <button type="button" class="card-img-wrap card-img-button" data-soil="${escapeHtml(name)}" data-hint="Select this soil →" aria-label="Select ${escapeHtml(name)} and view suitable crops">
          ${imgTag(soil.image, `${name} texture and field view`, "🌍")}
        </button>
        <div class="card-body">
          <h3>${escapeHtml(name)}</h3>
          <p class="card-desc">${escapeHtml(soil.description)}</p>
          <p class="suitable-crops"><strong>Suitable:</strong> ${escapeHtml(soil.suitableNote || cropsList)}</p>
        </div>
      </article>`;
    })
    .join("");
}

function selectSoil(soilName) {
  if (!agricultureData[soilName]) {
    showToast("Unknown soil type");
    return;
  }
  state.selectedSoil = soilName;
  state.selectedCrop = null;
  state.selectedDisease = null;
  state.seasonFilter = "All";
  state.cropSearch = "";

  const cropSearch = $("#crop-search");
  if (cropSearch) cropSearch.value = "";
  $$(".chip").forEach((c) => c.classList.toggle("active", c.dataset.season === "All"));

  showSection("crops-section", true);
  showSection("diseases-section", false);
  showSection("disease-details-section", false);

  updateProgress(2);
  renderSoils();
  renderCrops();
  scrollToId("crops-section");
  showToast(`${soilName} selected`);
}

// ---------- Crop rendering ----------
function getFilteredCrops() {
  if (!state.selectedSoil || !agricultureData[state.selectedSoil]) return [];
  const crops = agricultureData[state.selectedSoil].crops || {};
  const q = state.cropSearch.trim().toLowerCase();

  return Object.entries(crops).filter(([name, data]) => {
    const seasonOk =
      state.seasonFilter === "All" ||
      (data.season || "").toLowerCase().includes(state.seasonFilter.toLowerCase());
    const searchOk =
      !q ||
      name.toLowerCase().includes(q) ||
      (data.description || "").toLowerCase().includes(q) ||
      (data.season || "").toLowerCase().includes(q);
    return seasonOk && searchOk;
  });
}

function renderCrops() {
  const grid = $("#crop-grid");
  const subtitle = $("#crops-subtitle");
  if (!grid) return;

  if (!state.selectedSoil) {
    grid.innerHTML = `<div class="no-results"><i class="fa-solid fa-seedling"></i><p>Please select a soil type first.</p></div>`;
    if (subtitle) subtitle.textContent = "Select a soil to view suitable crops";
    return;
  }

  if (subtitle) {
    subtitle.innerHTML = `Crops suitable for <strong>${escapeHtml(state.selectedSoil)}</strong>`;
  }

  const list = getFilteredCrops();
  if (!list.length) {
    grid.innerHTML = `<div class="no-results"><i class="fa-solid fa-magnifying-glass"></i><p>No crops match your filters. Try another season or clear search.</p></div>`;
    return;
  }

  grid.innerHTML = list
    .map(([name, data]) => {
      const fav = isFavorite(state.selectedSoil, name);
      return `
      <article class="card crop-card" role="listitem" data-crop="${escapeHtml(name)}">
        <button type="button" class="fav-btn ${fav ? "active" : ""}" data-fav-soil="${escapeHtml(state.selectedSoil)}" data-fav-crop="${escapeHtml(name)}" aria-pressed="${fav}" aria-label="${fav ? "Remove" : "Add"} ${escapeHtml(name)} ${fav ? "from" : "to"} favorites" title="Favorite">
          <i class="fa-solid fa-star" aria-hidden="true"></i>
        </button>
        <button type="button" class="card-img-wrap card-img-button" data-crop="${escapeHtml(name)}" data-hint="View diseases →" aria-label="View diseases of ${escapeHtml(name)}">
          ${imgTag(data.image || cropImg(name), `${name} crop field`, "🌾")}
        </button>
        <div class="card-body">
          <h3>${escapeHtml(name)}</h3>
          <p class="card-desc">${escapeHtml(data.description || "")}</p>
          <div class="card-meta">
            <span class="meta-tag" title="Growing season"><i class="fa-solid fa-calendar" aria-hidden="true"></i> ${escapeHtml(data.season || "—")}</span>
            <span class="meta-tag water" title="Water requirement"><i class="fa-solid fa-droplet" aria-hidden="true"></i> ${escapeHtml(data.water || "—")}</span>
            <span class="meta-tag earth" title="Crop duration"><i class="fa-solid fa-clock" aria-hidden="true"></i> ${escapeHtml(data.duration || "—")}</span>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

function selectCrop(cropName) {
  if (!state.selectedSoil || !agricultureData[state.selectedSoil]?.crops?.[cropName]) {
    showToast("Unknown crop for the selected soil");
    return;
  }
  state.selectedCrop = cropName;
  state.selectedDisease = null;

  showSection("diseases-section", true);
  showSection("disease-details-section", false);

  updateProgress(3);
  renderDiseases();
  scrollToId("diseases-section");
  showToast(`${cropName} selected`);
}

// ---------- Disease rendering ----------
function renderDiseases() {
  const grid = $("#disease-grid");
  const subtitle = $("#diseases-subtitle");
  if (!grid) return;

  if (!state.selectedSoil || !state.selectedCrop) {
    grid.innerHTML = `<div class="no-results"><i class="fa-solid fa-bacteria"></i><p>Please select a crop first.</p></div>`;
    return;
  }

  const cropData = agricultureData[state.selectedSoil]?.crops?.[state.selectedCrop];
  if (!cropData) {
    grid.innerHTML = `<div class="no-results"><p>Crop data missing.</p></div>`;
    return;
  }

  if (subtitle) {
    subtitle.innerHTML = `Diseases affecting <strong>${escapeHtml(state.selectedCrop)}</strong>`;
  }

  const diseases = cropData.diseases || {};
  const entries = Object.entries(diseases);
  if (!entries.length) {
    grid.innerHTML = `<div class="no-results"><p>No disease records found for this crop.</p></div>`;
    return;
  }

  grid.innerHTML = entries
    .map(([name, data]) => {
      const causeShort = (data.cause || "").split("—")[0].trim() || "General";
      return `
      <article class="card disease-card" role="listitem" data-disease="${escapeHtml(name)}">
        <button type="button" class="card-img-wrap card-img-button" data-disease="${escapeHtml(name)}" data-hint="Details &amp; Telugu video ▶" aria-label="View details and Telugu cure video for ${escapeHtml(name)}">
          ${imgTag(diseaseImg(name), `${name} symptoms on plant tissue`, "🦠")}
          <span class="cause-badge">${escapeHtml(causeShort)}</span>
          <span class="video-badge" title="Telugu cure video available"><i class="fa-brands fa-youtube" aria-hidden="true"></i> తెలుగు వీడియో</span>
        </button>
        <div class="card-body">
          <h3>${escapeHtml(name)}</h3>
          <p class="card-desc">${escapeHtml(data.description || "")}</p>
        </div>
      </article>`;
    })
    .join("");
}

function showDiseaseDetails(diseaseName) {
  const content = $("#disease-detail-content");
  if (!content) return;

  const cropData = agricultureData[state.selectedSoil]?.crops?.[state.selectedCrop];
  const data = cropData?.diseases?.[diseaseName];

  if (!data) {
    showToast("Disease details not found");
    content.innerHTML = `<div class="detail-body"><p>Sorry, details for this disease are unavailable.</p></div>`;
    showSection("disease-details-section", true);
    return;
  }

  state.selectedDisease = diseaseName;
  updateProgress(3);

  const causeShort = (data.cause || "").split("—")[0].trim();

  content.innerHTML = `
    <div class="detail-hero">
      ${imgTag(diseaseImg(diseaseName), `${diseaseName} close-up`, "🦠")}
      <div class="detail-hero-overlay">
        <h2 id="disease-detail-title">${escapeHtml(diseaseName)}</h2>
      </div>
    </div>
    <div class="detail-body">
      <div class="detail-meta-row">
        <span class="meta-tag"><i class="fa-solid fa-seedling" aria-hidden="true"></i> ${escapeHtml(state.selectedCrop || "")}</span>
        <span class="meta-tag earth"><i class="fa-solid fa-mountain" aria-hidden="true"></i> ${escapeHtml(state.selectedSoil || "")}</span>
        <span class="meta-tag water"><i class="fa-solid fa-vial" aria-hidden="true"></i> ${escapeHtml(causeShort || "Cause varies")}</span>
      </div>
      <p style="margin-bottom:20px;color:var(--text-muted)">${escapeHtml(data.description || "")}</p>

      <div class="detail-block">
        <h3><i class="fa-solid fa-eye" aria-hidden="true"></i> Symptoms</h3>
        <p>${escapeHtml(data.symptoms || "Not available.")}</p>
      </div>
      <div class="detail-block">
        <h3><i class="fa-solid fa-bacteria" aria-hidden="true"></i> Cause</h3>
        <p>${escapeHtml(data.cause || "Not available.")}</p>
      </div>
      <div class="detail-block">
        <h3><i class="fa-solid fa-cloud-sun-rain" aria-hidden="true"></i> Favorable Conditions</h3>
        <p>${escapeHtml(data.conditions || "Not available.")}</p>
      </div>
      <div class="detail-block">
        <h3><i class="fa-solid fa-shield-halved" aria-hidden="true"></i> Prevention</h3>
        <p>${escapeHtml(data.prevention || "Not available.")}</p>
      </div>
      <div class="detail-block">
        <h3><i class="fa-solid fa-toolbox" aria-hidden="true"></i> General Management</h3>
        <p>${escapeHtml(data.management || "Not available.")}</p>
      </div>

      ${renderTeluguVideoBlock(diseaseName, state.selectedCrop)}

      <div class="detail-note" role="note">
        <i class="fa-solid fa-circle-info" aria-hidden="true"></i>
        <strong>Important Note:</strong>
        Consult a qualified agricultural expert or follow the pesticide label and local agricultural recommendations before applying any crop-protection product.
      </div>
    </div>`;

  showSection("disease-details-section", true);
  scrollToId("disease-details-section");

  // After paint, gently bring the Telugu video into view for easy watching
  setTimeout(() => {
    const videoBlock = $("#telugu-video-block");
    if (videoBlock) {
      videoBlock.scrollIntoView({ behavior: "smooth", block: "center" });
    }
  }, 350);
}

// ---------- Favorites section ----------
function renderFavorites() {
  const grid = $("#favorites-grid");
  const empty = $("#favorites-empty");
  if (!grid) return;

  if (!state.favorites.length) {
    grid.innerHTML = "";
    if (empty) empty.classList.remove("hidden");
    return;
  }
  if (empty) empty.classList.add("hidden");

  grid.innerHTML = state.favorites
    .map((f) => {
      return `
      <article class="card crop-card" role="listitem">
        <button type="button" class="fav-btn active" data-fav-soil="${escapeHtml(f.soil)}" data-fav-crop="${escapeHtml(f.crop)}" aria-pressed="true" aria-label="Remove ${escapeHtml(f.crop)} from favorites">
          <i class="fa-solid fa-star" aria-hidden="true"></i>
        </button>
        <div class="card-img-wrap">
          ${imgTag(f.image || cropImg(f.crop), `${f.crop} crop`, "⭐")}
        </div>
        <div class="card-body">
          <h3>${escapeHtml(f.crop)}</h3>
          <p class="card-desc">${escapeHtml(f.description || "")}</p>
          <div class="card-meta">
            <span class="meta-tag earth">${escapeHtml(f.soil)}</span>
            <span class="meta-tag">${escapeHtml(f.season || "")}</span>
          </div>
          <div class="card-actions">
            <button type="button" class="btn btn-primary btn-block btn-sm open-favorite-btn" data-soil="${escapeHtml(f.soil)}" data-crop="${escapeHtml(f.crop)}">
              Open Crop
            </button>
          </div>
        </div>
      </article>`;
    })
    .join("");
}

function openFavorite(soil, crop) {
  if (!agricultureData[soil]?.crops?.[crop]) {
    showToast("This favorite is no longer in the database");
    return;
  }
  state.selectedSoil = soil;
  state.selectedCrop = crop;
  state.selectedDisease = null;
  showSection("crops-section", true);
  showSection("diseases-section", true);
  showSection("disease-details-section", false);
  updateProgress(3);
  renderSoils();
  renderCrops();
  renderDiseases();
  scrollToId("diseases-section");
}

// ---------- Search ----------
function searchAgriculture(query) {
  const q = (query || "").trim().toLowerCase();
  const results = [];
  if (!q) return results;

  try {
    for (const [soilName, soil] of Object.entries(agricultureData)) {
      if (soilName.toLowerCase().includes(q)) {
        results.push({ type: "Soil", name: soilName, meta: soil.suitableNote || "", soil: soilName });
      }
      for (const [cropName, crop] of Object.entries(soil.crops || {})) {
        if (cropName.toLowerCase().includes(q) || (crop.description || "").toLowerCase().includes(q)) {
          results.push({
            type: "Crop",
            name: cropName,
            meta: `${soilName} · ${crop.season || ""}`,
            soil: soilName,
            crop: cropName
          });
        }
        for (const diseaseName of Object.keys(crop.diseases || {})) {
          if (diseaseName.toLowerCase().includes(q)) {
            results.push({
              type: "Disease",
              name: diseaseName,
              meta: `${cropName} · ${soilName}`,
              soil: soilName,
              crop: cropName,
              disease: diseaseName
            });
          }
        }
      }
    }
  } catch (e) {
    console.error("Search error", e);
  }

  // Dedupe by type+name+meta
  const seen = new Set();
  return results.filter((r) => {
    const key = `${r.type}|${r.name}|${r.meta}`;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  }).slice(0, 20);
}

function renderSearchResults(query) {
  const panel = $("#search-results");
  const input = $("#search-input");
  if (!panel || !input) return;

  const q = query.trim();
  if (!q) {
    panel.hidden = true;
    panel.innerHTML = "";
    input.setAttribute("aria-expanded", "false");
    return;
  }

  const results = searchAgriculture(q);
  input.setAttribute("aria-expanded", "true");
  panel.hidden = false;

  if (!results.length) {
    panel.innerHTML = `<div class="search-empty">No matches for “${escapeHtml(q)}”. Try another soil, crop, or disease name.</div>`;
    return;
  }

  panel.innerHTML = results
    .map(
      (r, i) => `
    <button type="button" class="search-result-item" role="option" data-index="${i}"
      data-type="${escapeHtml(r.type)}"
      data-soil="${escapeHtml(r.soil || "")}"
      data-crop="${escapeHtml(r.crop || "")}"
      data-disease="${escapeHtml(r.disease || "")}">
      <span class="search-result-type">${escapeHtml(r.type)}</span>
      <span class="search-result-name">${escapeHtml(r.name)}</span>
      <span class="search-result-meta">${escapeHtml(r.meta)}</span>
    </button>`
    )
    .join("");
}

function handleSearchSelect(btn) {
  const type = btn.dataset.type;
  const soil = btn.dataset.soil;
  const crop = btn.dataset.crop;
  const disease = btn.dataset.disease;

  const panel = $("#search-results");
  const input = $("#search-input");
  if (panel) {
    panel.hidden = true;
    panel.innerHTML = "";
  }
  if (input) {
    input.value = "";
    input.setAttribute("aria-expanded", "false");
  }

  try {
    if (type === "Soil" && soil) {
      selectSoil(soil);
    } else if (type === "Crop" && soil && crop) {
      state.selectedSoil = soil;
      showSection("crops-section", true);
      updateProgress(2);
      renderSoils();
      renderCrops();
      selectCrop(crop);
    } else if (type === "Disease" && soil && crop && disease) {
      state.selectedSoil = soil;
      state.selectedCrop = crop;
      showSection("crops-section", true);
      showSection("diseases-section", true);
      updateProgress(3);
      renderSoils();
      renderCrops();
      renderDiseases();
      showDiseaseDetails(disease);
    } else {
      showToast("Unable to open that result");
    }
  } catch (e) {
    console.error(e);
    showToast("Something went wrong opening the result");
  }
}

// ---------- Mobile menu ----------
function setupMobileSearchBar() {
  // Inject mobile search under header for small screens
  if ($(".mobile-search-bar")) return;
  const header = $("#header");
  if (!header) return;
  const bar = document.createElement("div");
  bar.className = "mobile-search-bar";
  bar.innerHTML = `
    <div class="search-wrap" style="position:relative;width:100%">
      <i class="fa-solid fa-magnifying-glass search-icon" aria-hidden="true"></i>
      <input type="search" id="search-input-mobile" class="search-input" placeholder="Search soil, crop or disease..." autocomplete="off" aria-label="Search soil, crop or disease" />
      <div id="search-results-mobile" class="search-results" role="listbox" hidden></div>
    </div>`;
  header.appendChild(bar);

  const mobileInput = $("#search-input-mobile");
  const mobilePanel = $("#search-results-mobile");

  mobileInput?.addEventListener("input", () => {
    const q = mobileInput.value.trim();
    if (!q) {
      mobilePanel.hidden = true;
      mobilePanel.innerHTML = "";
      return;
    }
    const results = searchAgriculture(q);
    mobilePanel.hidden = false;
    if (!results.length) {
      mobilePanel.innerHTML = `<div class="search-empty">No matches found.</div>`;
      return;
    }
    mobilePanel.innerHTML = results
      .map(
        (r) => `
      <button type="button" class="search-result-item"
        data-type="${escapeHtml(r.type)}"
        data-soil="${escapeHtml(r.soil || "")}"
        data-crop="${escapeHtml(r.crop || "")}"
        data-disease="${escapeHtml(r.disease || "")}">
        <span class="search-result-type">${escapeHtml(r.type)}</span>
        <span class="search-result-name">${escapeHtml(r.name)}</span>
        <span class="search-result-meta">${escapeHtml(r.meta)}</span>
      </button>`
      )
      .join("");
  });

  mobilePanel?.addEventListener("click", (e) => {
    const btn = e.target.closest(".search-result-item");
    if (!btn) return;
    mobilePanel.hidden = true;
    mobilePanel.innerHTML = "";
    if (mobileInput) mobileInput.value = "";
    handleSearchSelect(btn);
  });
}

// ---------- Event bindings ----------
function bindEvents() {
  // Dark mode
  $("#dark-toggle")?.addEventListener("click", toggleDarkMode);

  // Mobile nav
  const menuBtn = $("#menu-toggle");
  const nav = $("#nav");
  menuBtn?.addEventListener("click", () => {
    const open = nav?.classList.toggle("open");
    menuBtn.setAttribute("aria-expanded", open ? "true" : "false");
    menuBtn.innerHTML = open
      ? '<i class="fa-solid fa-xmark" aria-hidden="true"></i>'
      : '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
    menuBtn.setAttribute("aria-label", open ? "Close menu" : "Open menu");
  });

  // Nav links close menu + active state
  $$(".nav-link").forEach((link) => {
    link.addEventListener("click", () => {
      nav?.classList.remove("open");
      if (menuBtn) {
        menuBtn.setAttribute("aria-expanded", "false");
        menuBtn.innerHTML = '<i class="fa-solid fa-bars" aria-hidden="true"></i>';
      }
      $$(".nav-link").forEach((l) => l.classList.remove("active"));
      link.classList.add("active");
    });
  });

  // Explore soils
  $("#explore-soils-btn")?.addEventListener("click", (e) => {
    e.preventDefault();
    scrollToId("soil-section");
  });

  // Soil grid delegation — clicking the soil picture selects the soil
  $("#soil-grid")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".card-img-button");
    if (btn?.dataset.soil) selectSoil(btn.dataset.soil);
  });

  // Crop grid delegation — clicking the crop picture opens diseases
  $("#crop-grid")?.addEventListener("click", (e) => {
    const fav = e.target.closest(".fav-btn");
    if (fav) {
      toggleFavorite(fav.dataset.favSoil, fav.dataset.favCrop, fav);
      return;
    }
    const btn = e.target.closest(".card-img-button");
    if (btn?.dataset.crop) selectCrop(btn.dataset.crop);
  });

  // Disease grid — clicking the disease picture opens details + Telugu video
  $("#disease-grid")?.addEventListener("click", (e) => {
    const btn = e.target.closest(".card-img-button");
    if (btn?.dataset.disease) showDiseaseDetails(btn.dataset.disease);
  });

  // Favorites grid
  $("#favorites-grid")?.addEventListener("click", (e) => {
    const fav = e.target.closest(".fav-btn");
    if (fav) {
      toggleFavorite(fav.dataset.favSoil, fav.dataset.favCrop, fav);
      return;
    }
    const openBtn = e.target.closest(".open-favorite-btn");
    if (openBtn) openFavorite(openBtn.dataset.soil, openBtn.dataset.crop);
  });

  // Back / Start again
  $("#back-to-soil")?.addEventListener("click", () => {
    showSection("crops-section", false);
    showSection("diseases-section", false);
    showSection("disease-details-section", false);
    state.selectedCrop = null;
    state.selectedDisease = null;
    updateProgress(1);
    scrollToId("soil-section");
  });

  $("#back-to-crops")?.addEventListener("click", () => {
    showSection("diseases-section", false);
    showSection("disease-details-section", false);
    state.selectedDisease = null;
    updateProgress(2);
    scrollToId("crops-section");
  });

  $("#back-to-diseases")?.addEventListener("click", () => {
    showSection("disease-details-section", false);
    state.selectedDisease = null;
    updateProgress(3);
    scrollToId("diseases-section");
  });

  ["start-again-crops", "start-again-diseases", "start-again-details"].forEach((id) => {
    document.getElementById(id)?.addEventListener("click", resetSelection);
  });

  // Crop filters
  $("#crop-search")?.addEventListener("input", (e) => {
    state.cropSearch = e.target.value || "";
    renderCrops();
  });

  $$(".chip").forEach((chip) => {
    chip.addEventListener("click", () => {
      $$(".chip").forEach((c) => c.classList.remove("active"));
      chip.classList.add("active");
      state.seasonFilter = chip.dataset.season || "All";
      renderCrops();
    });
  });

  // Header search
  const searchInput = $("#search-input");
  const searchResults = $("#search-results");

  searchInput?.addEventListener("input", () => renderSearchResults(searchInput.value));
  searchInput?.addEventListener("focus", () => {
    if (searchInput.value.trim()) renderSearchResults(searchInput.value);
  });

  searchResults?.addEventListener("click", (e) => {
    const btn = e.target.closest(".search-result-item");
    if (btn) handleSearchSelect(btn);
  });

  document.addEventListener("click", (e) => {
    if (!e.target.closest(".search-wrap")) {
      if (searchResults) {
        searchResults.hidden = true;
        searchInput?.setAttribute("aria-expanded", "false");
      }
      const mobilePanel = $("#search-results-mobile");
      if (mobilePanel && !e.target.closest(".mobile-search-bar")) {
        mobilePanel.hidden = true;
      }
    }
  });

  searchInput?.addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      searchResults.hidden = true;
      searchInput.setAttribute("aria-expanded", "false");
      searchInput.blur();
    }
  });

  // Sticky header shadow
  window.addEventListener(
    "scroll",
    () => {
      $("#header")?.classList.toggle("scrolled", window.scrollY > 8);
    },
    { passive: true }
  );

  // Keyboard: Enter on cards via buttons already focusable
}

// ---------- Init ----------
function init() {
  try {
    loadTheme();
    loadFavorites();
    bindEvents();
    setupMobileSearchBar();
    renderSoils();
    renderFavorites();
    updateProgress(1);

    // Ensure soil is first visible interactive step
    showSection("soil-section", true);
    showSection("crops-section", false);
    showSection("diseases-section", false);
    showSection("disease-details-section", false);

    console.info("KrishMithr ready — Soil → Crop → Disease");
  } catch (err) {
    console.error("KrishMithr init error:", err);
    const soilGrid = $("#soil-grid");
    if (soilGrid) {
      soilGrid.innerHTML = `<div class="no-results"><p>Something went wrong loading KrishMithr. Please refresh the page.</p></div>`;
    }
  }
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", init);
} else {
  init();
}
