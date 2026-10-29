    (() => {
      'use strict';

      const $ = (selector, root = document) => root.querySelector(selector);
      const $$ = (selector, root = document) => Array.from(root.querySelectorAll(selector));
      const has = (object, key) => Object.prototype.hasOwnProperty.call(object, key);
      const slug = value => String(value).toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
      const icon = name => `<svg class="icon" aria-hidden="true"><use href="#i-${name}"/></svg>`;
      const esc = value => {
        const element = document.createElement('span');
        element.textContent = String(value ?? '');
        return element.innerHTML.replace(/"/g, '&quot;').replace(/'/g, '&#39;');
      };
      const TELUGU = '\u0c24\u0c46\u0c32\u0c41\u0c17\u0c41';
      const SAFETY_NOTE = 'Consult a qualified agricultural expert or follow the pesticide label and local agricultural recommendations before applying any crop-protection product.';
      const photo = (id, width = 1200) => `https://images.pexels.com/photos/${id}/pexels-photo-${id}.jpeg?auto=compress&cs=tinysrgb&fit=crop&h=${Math.round(width * .5225)}&w=${width}`;

      // Crop-specific records deliberately keep similar-looking diseases separate.
      const disease = (name, type, details) => ({ id: slug(name), name, type, ...details });
      const crop = (name, details, diseases) => ({
        id: slug(name), name, ...details,
        diseases: Object.fromEntries(diseases.map(item => [item.id, item]))
      });

      let crops = {};
      let soilRecords = [];

      let agricultureData = {};

      let teluguVideos = {};
      let symptomPhotos = [];

      const state = { view: 'soils', soilId: null, cropId: null, diseaseId: null, cropQuery: '', season: 'All', favorites: [], searchResults: [], searchIndex: -1, user: null, settings: {}, adminResource:'soils', adminItems:[], adminOverview:null, adminEditing:null, adminError:'' };
      function setAuthPasswordVisibility(visible) {
        const password = $('#auth-form [name="password"]');
        const toggle = $('[data-password-toggle]', $('#auth-form'));
        password.type = visible ? 'text' : 'password';
        toggle.setAttribute('aria-pressed',String(visible));
        toggle.setAttribute('aria-label',visible ? 'Hide password' : 'Show password');
        toggle.innerHTML = icon(visible ? 'eye' : 'eye-off');
      }
      function renderAuthRoute() {
        const signup = location.hash === '#signup';
        document.body.classList.add('auth-required');
        $('#auth-screen').hidden = false;
        if(state.settings.authImage)$('#auth-image').src=state.settings.authImage;
        if(state.settings.authTitle)$('#auth-story-title').textContent=state.settings.authTitle;
        if(state.settings.authDescription)$('#auth-story-description').textContent=state.settings.authDescription;
        $('#auth-title').textContent = signup ? 'Create your account' : 'Welcome back';
        $('#auth-intro').textContent = signup ? 'Set up your KrishMithr profile to continue.' : 'Sign in to continue to your farming guide.';
        $('#auth-submit').innerHTML = `${signup ? 'Create account' : 'Sign in'} <span aria-hidden="true">→</span>`;
        const name = $('#auth-form [name="name"]');
        name.closest('label').hidden = !signup;
        name.hidden = !signup;
        name.required = signup;
        $('#auth-form [name="password"]').autocomplete = signup ? 'new-password' : 'current-password';
        setAuthPasswordVisibility(false);
        $('#auth-message').textContent = '';
        $('#auth-switch').innerHTML = signup ? 'Already have an account? <a href="#login">Sign in</a>' : 'New to KrishMithr? <a href="#signup">Create an account</a>';
        document.title = `${signup ? 'Create account' : 'Sign in'} | KrishMithr`;
      }
      async function completeAuth(event) {
        event.preventDefault();
        if (!event.currentTarget.reportValidity()) return;
        const signup = location.hash === '#signup';
        const form = event.currentTarget;
        const submit = $('#auth-submit');
        submit.disabled = true;
        submit.textContent = signup ? 'Creating account…' : 'Signing in…';
        $('#auth-message').textContent = '';
        try {
          const payload = Object.fromEntries(new FormData(form).entries());
          if (signup) { payload.fullName=payload.name; delete payload.name; }
          const result = await apiRequest(`/api/auth/${signup ? 'register' : 'login'}`, { method:'POST', body:payload });
          state.user = result.user;
          await initializeSignedInApp();
          const requested = readStored('krishmithr_requested_route');
          try { sessionStorage.removeItem('krishmithr_requested_route'); } catch (_) { /* The requested route is optional. */ }
          document.body.classList.remove('auth-required');
          $('#auth-screen').hidden = true;
          navigate(requested || '#home');
        } catch (error) {
          if (state.user) { try { await apiRequest('/api/auth/logout',{method:'POST'}); } catch (_) { /* The next session check will resolve server state. */ } }
          state.user = null;
          updateAccountControl();
          $('#auth-message').textContent = error.message || 'We could not reach KrishMithr. Please try again.';
        } finally {
          submit.disabled = false;
          submit.innerHTML = `${signup ? 'Create account' : 'Sign in'} <span aria-hidden="true">→</span>`;
        }
      }
      async function apiRequest(url, options = {}) {
        const isFormData = options.body instanceof FormData;
        const headers = { ...(options.headers || {}) };
        if (!isFormData && !headers['Content-Type']) headers['Content-Type'] = 'application/json';
        const body = options.body && typeof options.body !== 'string' && !isFormData ? JSON.stringify(options.body) : options.body;
        let response;
        const localPageIsNotUsingAppServer = location.protocol === 'file:' || (['localhost','127.0.0.1'].includes(location.hostname) && location.port !== '3000');
        const connectionMessage = localPageIsNotUsingAppServer ? 'Open KrishMithr at http://localhost:3000 and try again.' : 'Could not reach KrishMithr. Check your connection and try again.';
        try { response = await fetch(url, { ...options, credentials:'same-origin', headers, body }); }
        catch (_) { throw new Error(connectionMessage); }
        if (response.status === 204) return {};
        const result = await response.json().catch(() => null);
        if (!result || typeof result !== 'object') throw new Error(localPageIsNotUsingAppServer ? connectionMessage : 'The site returned an unexpected server response. Refresh and try again.');
        if (!response.ok) throw Object.assign(new Error(result.message || 'The request could not be completed. Please try again.'), { status:response.status, code:result.code });
        return result;
      }
      async function loadCatalogFromDatabase() {
        const result = await apiRequest('/api/catalog');
        soilRecords = result.soils;
        crops = result.crops;
        teluguVideos = result.teluguVideos;
        symptomPhotos = result.symptomPhotos;
        agricultureData = Object.fromEntries(soilRecords.map(soil => [soil.id, { ...soil, crops:Object.fromEntries(soil.cropIds.map(id => [id,crops[id]])) }]));
        if (!soilRecords.length || !Object.keys(crops).length) throw new Error('The KrishMithr field guide has no database records yet. Run npm run db:seed against the existing KrishMithr database.');
        state.settings = result.settings || {};
        if (state.settings.authImage) $('#auth-image').src=state.settings.authImage;
        if (state.settings.heroImage && $('#hero-image')) $('#hero-image').src = state.settings.heroImage;
        if (state.settings.aboutImage && $('#about-image')) $('#about-image').src = state.settings.aboutImage;
        if (state.settings.heroTitle) $('#hero-title').textContent = state.settings.heroTitle;
        if (state.settings.heroDescription) $('.hero-description').textContent = state.settings.heroDescription;
        if (state.settings.aboutTitle) $('#about-title').textContent = state.settings.aboutTitle;
        if (state.settings.aboutDescription) $('#about-description').textContent = state.settings.aboutDescription;
        if (state.settings.footerDisclaimer) $('#footer-disclaimer').textContent = state.settings.footerDisclaimer;
        if (Array.isArray(state.settings.faq) && state.settings.faq.length) $('.faq-list').innerHTML = state.settings.faq.map(item => `<details><summary>${esc(item.question)}${icon('plus')}</summary><p>${esc(item.answer)}</p></details>`).join('');
      }
      async function initializeSignedInApp() {
        updateAccountControl();
        await loadCatalogFromDatabase();
        await loadFavoritesFromDatabase();
        if (state.user?.theme) document.documentElement.dataset.theme = state.user.theme;
        updateThemeControl();
        renderWorkspace();
      }
      function updateAccountControl() {
        const menu = $('#account-menu');
        menu.hidden = !state.user;
        if (!state.user) return;
        $('#account-avatar').textContent = (state.user.fullName || 'K').trim().charAt(0).toUpperCase();
        $('#account-trigger-name').textContent = state.user.fullName.split(/\s+/)[0];
        $('#account-popover-name').textContent = state.user.fullName;
        $('#account-popover-email').textContent = state.user.email;
        $('#admin-link').hidden = !['admin','editor'].includes(state.user.role);
      }
      let toastTimer;
      let toastHideTimer;
      let lastDialogTrigger = null;

      function readStored(key) { try { return sessionStorage.getItem(key); } catch (_) { return null; } }
      function writeStored(key, value) { try { sessionStorage.setItem(key, value); return true; } catch (_) { return false; } }
      function firstSoilForCrop(cropId) { return soilRecords.find(soil => soil.cropIds.includes(cropId))?.id || null; }
      function hasCrop(soilId, cropId) { return has(agricultureData, soilId) && has(agricultureData[soilId].crops, cropId); }
      function getDisease(cropId, diseaseId) { return has(crops, cropId) && has(crops[cropId].diseases, diseaseId) ? crops[cropId].diseases[diseaseId] : null; }

      async function loadFavoritesFromDatabase() {
        const result = await apiRequest('/api/favorites');
        const seen = new Set();
        state.favorites = (Array.isArray(result.favorites) ? result.favorites : []).filter(item => {
          if (!item || !has(crops,item.cropId) || !hasCrop(item.soilId,item.cropId) || seen.has(item.cropId)) return false;
          seen.add(item.cropId); return true;
        });
      }

      function isFavorite(cropId) { return state.favorites.some(item => item.cropId === cropId); }

      function updateFavoriteControls() {
        const count = $('#favorite-count');
        count.textContent = state.favorites.length;
        count.hidden = state.favorites.length === 0;
        count.parentElement.setAttribute('aria-label', `My favorites, ${state.favorites.length} saved crops`);
        $$('[data-action="favorite"]').forEach(button => {
          const selected = isFavorite(button.dataset.cropId);
          button.setAttribute('aria-pressed', String(selected));
          button.classList.toggle('is-favorite', selected);
          button.setAttribute('aria-label', `${selected ? 'Remove' : 'Save'} ${crops[button.dataset.cropId]?.name || 'crop'} ${selected ? 'from' : 'to'} favorites`);
          button.title = selected ? 'Remove from favorites' : 'Save crop';
        });
      }

      async function toggleFavorite(cropId, soilId) {
        if (!has(crops, cropId)) return showToast('That crop is not in the field guide.');
        const saved = isFavorite(cropId);
        if (saved) state.favorites = state.favorites.filter(item => item.cropId !== cropId);
        else state.favorites.push({ cropId, soilId: hasCrop(soilId, cropId) ? soilId : firstSoilForCrop(cropId) });
        updateFavoriteControls();
        try { const result = await apiRequest('/api/favorites',{method:'PUT',body:{favorites:state.favorites}}); state.favorites = result.favorites; }
        catch (error) {
          if (saved) state.favorites.push({cropId,soilId}); else state.favorites = state.favorites.filter(item => item.cropId !== cropId);
          updateFavoriteControls();
          showToast(error.message || 'Your favorites could not be saved.');
          return;
        }
        if (state.view === 'favorites') {
          renderWorkspace();
          const next = $('[data-action="favorite"]', $('#workspace')) || $('#workspace-title');
          next?.focus({ preventScroll: true });
        }
        updateFavoriteControls();
        showToast(`${crops[cropId].name} ${saved ? 'removed from' : 'saved to'} your favorites.`);
      }

      function updateThemeControl() {
        const dark = document.documentElement.dataset.theme === 'dark';
        $('#theme-toggle').innerHTML = icon(dark ? 'sun' : 'moon');
        $('#theme-toggle').setAttribute('aria-pressed', String(dark));
        $('#theme-toggle').setAttribute('aria-label', `Switch to ${dark ? 'light' : 'dark'} mode`);
        $('#theme-toggle').title = dark ? 'Light mode' : 'Dark mode';
        $('meta[name="theme-color"]').content = dark ? '#1c282e' : '#faf9f5';
      }

      async function toggleDarkMode() {
        const theme = document.documentElement.dataset.theme === 'dark' ? 'light' : 'dark';
        document.documentElement.dataset.theme = theme;
        state.user.theme = theme;
        updateThemeControl();
        try { await apiRequest('/api/preferences',{method:'PATCH',body:{theme}}); }
        catch (_) { showToast('Theme changed for this visit, but could not be saved to your profile.'); }
      }

      function showToast(message) {
        const element = $('#toast');
        clearTimeout(toastTimer); clearTimeout(toastHideTimer);
        element.innerHTML = `${icon('check')}<span>${esc(message)}</span>`;
        element.hidden = false;
        requestAnimationFrame(() => element.classList.add('show'));
        toastTimer = setTimeout(() => {
          element.classList.remove('show');
          toastHideTimer = setTimeout(() => { element.hidden = true; }, 260);
        }, 3400);
      }

      function picture(id, alt, sizes = '(max-width: 640px) 92vw, (max-width: 900px) 44vw, (max-width: 1190px) 29vw, 290px') {
        const source = typeof id === 'string' ? id : photo(id);
        const srcset = typeof id === 'string' ? '' : `srcset="${photo(id,480)} 480w, ${photo(id,800)} 800w, ${photo(id)} 1200w"`;
        return `<img src="${esc(source)}" ${srcset} sizes="${sizes}" width="1200" height="627" alt="${esc(alt)}" loading="lazy" decoding="async">`;
      }

      function imageButton(id, alt, action, label, hint, attributes = '', selected = false) {
        return `<button type="button" class="image-button${selected ? ' selected' : ''}" data-action="${action}" ${attributes} aria-label="${esc(label)}">${picture(id, alt)}<span class="image-hint">${esc(hint)}</span><span class="image-arrow">${icon('arrow')}</span></button>`;
      }

      function heading(eyebrow, title, subtitle, hint = true) {
        return `<div class="workspace-heading"><div><p class="eyebrow">${esc(eyebrow)}</p><h2 class="section-title" id="workspace-title" tabindex="-1">${esc(title)}</h2><p class="section-subtitle">${esc(subtitle)}</p></div>${hint ? `<p class="picture-hint">${icon('image')}Click a picture to explore</p>` : ''}</div>`;
      }

      function note(text) { return `<p class="context-note">${icon('info')}<span>${text}</span></p>`; }

      function breadcrumb(items) {
        return `<nav class="breadcrumbs" aria-label="Breadcrumb">${items.map((item, index) => `${index ? icon('chevron') : ''}${item.href ? `<a href="${item.href}">${esc(item.label)}</a>` : `<span aria-current="page">${esc(item.label)}</span>`}`).join('')}</nav>`;
      }

      function renderSoils() {
        return `${heading('Step 01 / Start with the ground', 'Select your soil.', 'Choose the soil in your field. Discover what can grow from here.')}
          <div class="explorer-grid" id="soil-grid">${soilRecords.map(soil => `<article class="explorer-card soil-card">${imageButton(soil.image, soil.alt, 'soil', `Select ${soil.name} and explore suitable crops`, 'Explore this soil', `data-soil-id="${soil.id}"`, state.soilId === soil.id)}<div class="card-body"><p class="card-kicker">${esc(soil.tag)}</p><h3 class="card-title">${esc(soil.name)}</h3><p class="card-description">${esc(soil.description)}</p><p class="suitable"><strong>Good for:</strong> ${soil.cropIds.map(id => esc(crops[id].name)).join(', ')}</p></div></article>`).join('')}</div>
          ${note('Soil photos are illustrative. Local climate, drainage, and a soil test matter too. <button type="button" data-info="soil">Not sure about your soil?</button>')}`;
      }

      function cropCard(cropId, soilId, savedView = false) {
        const item = crops[cropId];
        const saved = isFavorite(cropId);
        return `<article class="explorer-card crop-card"><div class="photo-area">${imageButton(item.image, item.alt, 'crop', `Explore diseases affecting ${item.name}`, 'Explore crop health', `data-crop-id="${cropId}" data-soil-id="${soilId}"`)}<button type="button" class="favorite-button" data-action="favorite" data-crop-id="${cropId}" data-soil-id="${soilId}" aria-pressed="${saved}" aria-label="${saved ? 'Remove' : 'Save'} ${esc(item.name)} ${saved ? 'from' : 'to'} favorites">${icon('star')}</button></div><div class="card-body"><p class="card-kicker">${esc(savedView ? agricultureData[soilId].name : item.category)}</p><h3 class="card-title">${esc(item.name)}</h3><p class="card-description">${esc(item.description)}</p><dl class="crop-meta"><div><dt>Growing season</dt><dd>${esc(item.seasons.join(' / '))}</dd></div><div><dt>Water needs</dt><dd>${esc(item.water)}</dd></div><div><dt>Approx. duration</dt><dd>${esc(item.duration)}</dd></div></dl></div></article>`;
      }

      function getFilteredCrops(soilId = state.soilId, query = state.cropQuery, season = state.season) {
        if (!has(agricultureData, soilId)) return [];
        const normalized = String(query).trim().toLowerCase();
        return agricultureData[soilId].cropIds.filter(id => {
          const item = crops[id];
          return (season === 'All' || item.seasons.includes(season)) && (!normalized || `${item.name} ${item.category}`.toLowerCase().includes(normalized));
        });
      }

      function emptyState(title, text, actionText = '', action = 'soils') {
        return `<div class="empty-state">${icon('sprout')}<h3>${esc(title)}</h3><p>${esc(text)}</p>${actionText ? `<button type="button" class="button button-outline" data-action="${action}">${esc(actionText)}${icon('arrow')}</button>` : ''}</div>`;
      }

      function updateCropGrid() {
        const grid = $('#crop-grid');
        if (!grid) return;
        const filtered = getFilteredCrops();
        grid.innerHTML = filtered.length ? filtered.map(id => cropCard(id, state.soilId)).join('') : emptyState('No crops match just yet.', 'Try another season or clear your search to see every suitable crop.', 'Clear filters', 'clear-filters');
        $('#crop-count').textContent = `${filtered.length} of ${agricultureData[state.soilId].cropIds.length} crops`;
      }

      function renderCrops() {
        const soil = agricultureData[state.soilId];
        return `${breadcrumb([{ label: 'All soils', href: '#soils' }, { label: soil.name }])}${heading('Step 02 / Find the right fit', 'Select your crop.', `Crops suitable for ${soil.name.toLowerCase()}. Choose a picture to explore plant health.`)}<div class="filter-bar"><div class="filter-search">${icon('search')}<label class="sr-only" for="crop-search">Search suitable crops</label><input class="filter-input" type="search" id="crop-search" placeholder="Find a crop..." value="${esc(state.cropQuery)}" maxlength="100"></div><div class="select-field"><label for="season-filter">Season</label><select id="season-filter">${['All','Kharif','Rabi','Zaid','Year-round'].map(season => `<option value="${season}"${state.season === season ? ' selected' : ''}>${season === 'All' ? 'All seasons' : season}</option>`).join('')}</select></div><p class="results-count" id="crop-count" aria-live="polite"></p></div><div class="explorer-grid" id="crop-grid"></div>${note('Growing seasons and durations are approximate and vary by variety, location, and sowing date. Confirm suitability with your local agricultural adviser.')}<div class="stage-actions"><a class="text-link" href="#soils">${icon('back')}Back to soils</a></div>`;
      }

      function getTeluguVideo(cropId, diseaseId) {
        const key = `${cropId}:${diseaseId}`;
        if (!has(teluguVideos, key)) return null;
        const entry = teluguVideos[key];
        return /^[A-Za-z0-9_-]{11}$/.test(entry.id) ? entry : null;
      }

      function youtubeSearchUrl(cropId, diseaseId) {
        const item = crops[cropId];
        const currentDisease = getDisease(cropId, diseaseId);
        const query = `${item.name === 'Pulses' ? 'green gram' : item.name === 'Millets' ? 'pearl millet' : item.name} ${currentDisease.name} disease management in Telugu ${TELUGU} \u0c28\u0c3f\u0c35\u0c3e\u0c30\u0c23`;
        return `https://www.youtube.com/results?search_query=${encodeURIComponent(query)}`;
      }

      function renderDiseases() {
        const item = crops[state.cropId];
        const soil = agricultureData[state.soilId];
        return `${breadcrumb([{ label: 'All soils', href: '#soils' }, { label: soil.name, href: `#crops/${soil.id}` }, { label: item.name }])}${heading('Step 03 / Grow with awareness', `Keep your ${item.name.toLowerCase()} healthy.`, 'Explore common diseases, visible symptoms, and practical prevention advice.')}<div class="explorer-grid" id="disease-grid">${Object.values(item.diseases).map((entry, index) => `<article class="explorer-card disease-card">${imageButton(symptomPhotos[index % symptomPhotos.length], 'Illustrative plant leaf with discoloration; not a diagnostic photograph', 'disease', `Open ${entry.name} guide and Telugu video resources for ${item.name}`, 'Open guide & Telugu resources', `data-disease-id="${entry.id}"`)}<div class="card-body"><p class="card-kicker disease-type">${esc(entry.type)}</p><h3 class="card-title">${esc(entry.name)}</h3><p class="card-description">${esc(entry.description)}</p><p class="disease-resource">${icon('youtube')}<span>${getTeluguVideo(item.id, entry.id) ? 'Telugu video guide' : 'Telugu video search'}</span></p></div></article>`).join('')}</div>${note('These photos show general leaf symptoms, not a confirmed diagnosis. Different diseases, pests, and nutrient problems can look similar.')}<div class="stage-actions"><a class="text-link" href="#crops/${soil.id}">${icon('back')}Back to crops</a></div>`;
      }

      function detailSection(title, content, symbol) {
        const body = Array.isArray(content) ? `<ul>${content.map(line => `<li>${esc(line)}</li>`).join('')}</ul>` : `<p>${esc(content)}</p>`;
        return `<section class="detail-section"><h3>${icon(symbol)}${esc(title)}</h3>${body}</section>`;
      }

      function renderVideoGuide(item, currentDisease) {
        const video = getTeluguVideo(item.id, currentDisease.id);
        const searchUrl = youtubeSearchUrl(item.id, currentDisease.id);
        const watchUrl = video ? `https://www.youtube.com/watch?v=${video.id}` : searchUrl;
        const local = location.protocol === 'file:';
        return `<div class="video-column"><div class="video-player" id="video-player"><a class="video-facade" href="${watchUrl}" target="_blank" rel="noopener noreferrer"${video ? ' data-action="play-video"' : ''} aria-label="${video ? 'Watch' : 'Search for'} ${esc(currentDisease.name)} ${esc(item.name)} videos in Telugu${!video || local ? ', opens YouTube in a new tab' : ''}">${picture(item.image, item.alt, '(max-width: 900px) 90vw, 620px')}<span class="play-circle">${icon(video ? 'play' : 'search')}</span><strong>${video ? 'Watch the Telugu guide' : 'Find a Telugu explanation'}</strong><small lang="te">${TELUGU}</small></a></div><div class="video-description"><h3 class="video-heading"><span class="youtube-mark">${icon('youtube')}</span>${video ? 'Learn in your language.' : 'Explore Telugu video resources.'}</h3><p>${video ? `<strong>${esc(video.title)}</strong><br>${esc(video.channel)} / Telugu. ${local ? 'Opening this local file? The video opens directly on YouTube.' : 'Select the picture to load the YouTube player.'}` : `A specific video has not been linked for ${esc(currentDisease.name)} in ${esc(item.name.toLowerCase())}. Search YouTube for this exact crop and disease in Telugu instead.`}</p><div class="video-links">${video ? `<a class="text-link" href="${watchUrl}" target="_blank" rel="noopener noreferrer">Open on YouTube ${icon('arrow-up')}</a>` : ''}<a class="text-link" href="${searchUrl}" target="_blank" rel="noopener noreferrer">${video ? 'More Telugu videos' : 'Search on YouTube'} ${icon('arrow-up')}</a></div><p>${video ? 'If playback is unavailable, use Open on YouTube. ' : ''}Videos and search results are third-party content, not an endorsement or guaranteed cure. Opening the player connects to YouTube.</p></div><aside class="safety-note"><strong>A little care before you act.</strong>${esc(SAFETY_NOTE)}</aside></div>`;
      }

      function renderDiseaseDetails() {
        const item = crops[state.cropId];
        const currentDisease = getDisease(state.cropId, state.diseaseId);
        const soil = agricultureData[state.soilId];
        return `${breadcrumb([{ label: 'All soils', href: '#soils' }, { label: soil.name, href: `#crops/${soil.id}` }, { label: item.name, href: `#diseases/${soil.id}/${item.id}` }, { label: currentDisease.name }])}${heading(`${item.name} / ${currentDisease.type} disease guide`, currentDisease.name, currentDisease.description, false)}<article class="detail-layout">${renderVideoGuide(item, currentDisease)}<div class="disease-information">${detailSection('Symptoms', currentDisease.symptoms, 'eye')}${detailSection('Cause', currentDisease.cause, 'leaf')}${detailSection('Favorable conditions', currentDisease.conditions, 'cloud')}${detailSection('Prevention', currentDisease.prevention, 'shield')}${detailSection('General management', currentDisease.management, 'book')}</div></article><div class="stage-actions"><a class="text-link" href="#diseases/${soil.id}/${item.id}">${icon('back')}Back to diseases</a></div>`;
      }

      function renderFavorites() {
        return `${heading('Your personal field guide', 'My favorite crops.', 'A few good ideas to come back to. Saved to your KrishMithr account.', state.favorites.length > 0)}${state.favorites.length ? `<div class="explorer-grid" id="favorites-grid">${state.favorites.map(entry => cropCard(entry.cropId, entry.soilId, true)).join('')}</div>` : emptyState('Let your collection grow.', 'Tap the star on any crop picture to save it to your account.', 'Explore soils')}<div class="stage-actions"><a class="text-link" href="#soils">${icon('back')}Back to the soil explorer</a></div>`;
      }

      function renderContact() {
        return `${heading('We are here to help', 'Send us a message.', 'Share a question about KrishMithr. Please do not include sensitive or financial information.')}
          <form class="contact-form" id="contact-form"><div class="contact-fields"><label>Full name<input name="fullName" type="text" minlength="2" maxlength="80" value="${esc(state.user.fullName)}" required autocomplete="name"></label><label>Email address<input name="email" type="email" maxlength="254" value="${esc(state.user.email)}" required autocomplete="email"></label><label class="contact-subject">Subject <span>(optional)</span><input name="subject" type="text" maxlength="120"></label><label class="contact-message">Message<textarea name="message" minlength="10" maxlength="2000" rows="7" required></textarea></label><label class="contact-consent"><input name="consent" type="checkbox" required><span>I agree that KrishMithr may store this message to respond to my enquiry.</span></label><p id="contact-error" class="auth-message" aria-live="polite"></p><button class="button" type="submit">Send message ${icon('arrow')}</button></div></form>`;
      }

      function renderThankYou() {
        return emptyState('Thank you for getting in touch.', 'Your message has been received. We appreciate you taking the time to write.', 'Return home','home');
      }

      function renderLegal() {
        const info = infoContent[state.legalType] || infoContent.privacy;
        return `${heading('KrishMithr / Your information',info.title,'Clear, practical details about the service.',false)}<article class="legal-copy">${info.content}</article><div class="stage-actions"><a class="text-link" href="#home">${icon('back')}Back to the field guide</a></div>`;
      }

      async function submitContact(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        const button = form.querySelector('[type="submit"]');
        const payload = Object.fromEntries(new FormData(form).entries());
        payload.consent = form.elements.consent.checked;
        button.disabled = true;
        button.textContent = 'Sending…';
        try { await apiRequest('/api/contact',{method:'POST',body:payload}); navigate('#thank-you'); }
        catch (error) { $('#contact-error').textContent = error.message; button.disabled = false; button.innerHTML = `Send message ${icon('arrow')}`; }
      }

      async function loadAdminOverview() {
        const [overview,items] = await Promise.all([apiRequest('/api/admin/overview'),apiRequest(`/api/admin/${state.adminResource}`)]);
        state.adminOverview=overview;
        state.adminItems=items.items || [];
        state.adminError='';
        if (state.view==='admin') renderWorkspace();
      }

      function adminField(name,label,value='',type='text',attrs='') {
        return `<label class="admin-field">${esc(label)}<input name="${esc(name)}" type="${type}" value="${esc(value)}" ${attrs}></label>`;
      }
      function adminItemKey(item){return state.adminResource==='diseases'?`${item.cropId}|${item.id}`:item.id;}
      function adminMulti(name,label,records,selected=[]) {
        const selectedIds=new Set(selected||[]);
        return `<label class="admin-field admin-field-wide">${esc(label)}<select name="${esc(name)}" multiple size="${Math.min(6, Math.max(3, records.length))}" aria-label="${esc(label)}">${records.map(record=>`<option value="${esc(record.id)}" ${selectedIds.has(record.id)?'selected':''}>${esc(record.name)}</option>`).join('')}</select><small>Use Ctrl/Command to select more than one.</small></label>`;
      }

      function adminEditor() {
        const resource=state.adminResource;
        const item=state.adminEditing || {};
        const lineField=(name,label,value=[])=>`<label class="admin-field admin-field-wide">${esc(label)}<textarea name="${name}" rows="4">${esc(Array.isArray(value)?value.join('\n'):value)}</textarea><small>Enter one item per line.</small></label>`;
        let fields='';
        if (resource==='soils') fields=adminField('name','Soil name',item.name||'','text','required maxlength="120"')+adminField('tag','Short descriptor',item.tag||'')+`<label class="admin-field admin-field-wide">Description<textarea name="description" rows="3" required>${esc(item.description||'')}</textarea></label>`+adminField('image','Image URL (HTTPS or uploaded path)',item.image||'','text','required')+adminField('alt','Image description',item.alt||'')+adminMulti('cropIds','Suitable crops',Object.values(crops),item.cropIds||[]);
        if (resource==='crops') fields=adminField('name','Crop name',item.name||'','text','required maxlength="120"')+adminField('category','Category',item.category||'')+`<label class="admin-field admin-field-wide">Description<textarea name="description" rows="3" required>${esc(item.description||'')}</textarea></label>`+adminField('water','Water needs',item.water||'')+adminField('duration','Growing duration',item.duration||'')+adminField('image','Image URL (HTTPS or uploaded path)',item.image||'','text','required')+adminField('alt','Image description',item.alt||'')+adminMulti('seasons','Growing seasons',['Kharif','Rabi','Zaid','Year-round'].map(id=>({id,name:id})),item.seasons||[])+adminMulti('soilIds','Suitable soils',soilRecords,item.soilIds||[]);
        if (resource==='diseases') {
          const options=Object.values(crops).map(crop=>`<option value="${esc(crop.id)}" ${crop.id===item.cropId?'selected':''}>${esc(crop.name)}</option>`).join('');
          fields=adminField('name','Disease name',item.name||'','text','required maxlength="120"')+`<label class="admin-field">Crop<select name="cropId" required>${options}</select></label>`+adminField('type','Disease type',item.type||'')+adminField('image','Image URL (HTTPS or uploaded path)',item.image||'','text')+adminField('alt','Image description',item.alt||'')+`<label class="admin-field admin-field-wide">Description<textarea name="description" rows="3" required>${esc(item.description||'')}</textarea></label>`+adminField('cause','Cause',item.cause||'')+adminField('conditions','Favorable conditions',item.conditions||'')+lineField('symptoms','Symptoms',item.symptoms||[])+lineField('prevention','Prevention',item.prevention||[])+lineField('management','General management',item.management||[]);
        }
        if (resource==='site_settings') fields=adminField('name','Settings name',item.name||'Public site','text','required')+adminField('authImage','Sign-in image URL',item.authImage||'','text')+adminField('heroImage','Hero image URL',item.heroImage||'','text')+adminField('aboutImage','About image URL',item.aboutImage||'','text')+adminField('authTitle','Sign-in heading',item.authTitle||'')+adminField('heroTitle','Home heading',item.heroTitle||'')+adminField('aboutTitle','About heading',item.aboutTitle||'')+`<label class="admin-field admin-field-wide">Sign-in introduction<textarea name="authDescription" rows="3">${esc(item.authDescription||'')}</textarea></label><label class="admin-field admin-field-wide">Home introduction<textarea name="heroDescription" rows="3">${esc(item.heroDescription||'')}</textarea></label><label class="admin-field admin-field-wide">About copy<textarea name="aboutDescription" rows="3">${esc(item.aboutDescription||'')}</textarea></label><label class="admin-field admin-field-wide">Footer disclaimer<textarea name="footerDisclaimer" rows="3">${esc(item.footerDisclaimer||'')}</textarea></label><label class="admin-field admin-field-wide">FAQs (JSON array of question/answer objects)<textarea name="faq" rows="7">${esc(JSON.stringify(item.faq||[],null,2))}</textarea></label>`;
        return `<form class="admin-editor" id="admin-editor"><div class="admin-editor-heading"><div><p class="eyebrow">${state.adminEditing?'Edit record':'New record'}</p><h3>${esc(resource.replace('_',' '))}</h3></div><button type="button" class="text-link" data-admin-cancel>Cancel</button></div><div class="admin-fields">${fields}</div><p class="auth-message" id="admin-editor-error" aria-live="polite"></p><div class="stage-actions"><button class="button" type="submit">Save changes</button></div></form>`;
      }

      function renderAdmin() {
        const resources=['soils','crops','diseases','media','enquiries'];
        if (state.user.role==='admin') resources.splice(4,0,'site_settings');
        if (state.user.role==='admin') resources.push('users');
        const stats=state.adminOverview?Object.entries(state.adminOverview).map(([key,value])=>`<article class="admin-stat"><span>${esc(key)}</span><strong>${value}</strong></article>`).join(''):'<p class="admin-muted">Loading overview…</p>';
        const tabs=resources.map(key=>`<button type="button" class="admin-tab${state.adminResource===key?' active':''}" data-admin-resource="${key}" aria-pressed="${state.adminResource===key}">${esc(key.replace('_',' '))}</button>`).join('');
        let list='';
        if (state.adminResource==='enquiries') list=state.adminItems.length?state.adminItems.map(item=>`<article class="admin-row"><div><strong>${esc(item.subject||'Enquiry')}</strong><p>${esc(item.fullName)} · ${esc(item.email)}</p><p>${esc(item.message)}</p><small>${esc(item.createdAt?new Date(item.createdAt).toLocaleString(): '')}</small></div><label>Status<select data-enquiry-status="${esc(item.id)}"><option ${item.status==='new'?'selected':''}>new</option><option ${item.status==='read'?'selected':''}>read</option><option ${item.status==='resolved'?'selected':''}>resolved</option></select></label></article>`).join(''):'<p class="admin-muted">No enquiries yet.</p>';
        else if (state.adminResource==='users') list=state.adminItems.map(item=>`<article class="admin-row"><div><strong>${esc(item.name)}</strong><p>${esc(item.email)}</p></div><label>Role<select data-user-role="${esc(item.id)}"><option value="user" ${item.role==='user'?'selected':''}>User</option><option value="editor" ${item.role==='editor'?'selected':''}>Editor</option><option value="admin" ${item.role==='admin'?'selected':''}>Admin</option></select></label></article>`).join('')||'<p class="admin-muted">No accounts yet.</p>';
        else list=state.adminItems.map(item=>`<article class="admin-row"><div><strong>${esc(item.name||item.title||item.id)}</strong><p>${esc(item.cropId?`${crops[item.cropId]?.name||item.cropId} · `:'')}${esc(item.description||item.url||item.kind||item.tag||item.id)}</p></div><div class="admin-row-actions"><button type="button" class="button button-outline" data-admin-edit="${esc(adminItemKey(item))}">Edit</button>${state.user.role==='admin'?`<button type="button" class="button button-outline" data-admin-delete="${esc(adminItemKey(item))}">Delete</button>`:''}</div></article>`).join('')||'<p class="admin-muted">No items yet. Create the first record.</p>';
        const upload=state.adminResource==='media'?`<form class="admin-upload" id="media-upload"><label>Upload image (JPG, PNG, WebP, up to 5 MB)<input type="file" name="image" accept="image/jpeg,image/png,image/webp" required></label><label>Image name<input name="name" maxlength="120"></label><button class="button button-outline" type="submit">Upload to media library</button></form>`:'';
        const canCreate=!['enquiries','users','media'].includes(state.adminResource);
        return `${heading('KrishMithr / Administration','Content and enquiries','Manage the published field guide. Access is checked on every server request.',false)}<section class="admin-dashboard"><div class="admin-stats">${stats}</div><div class="admin-tabs" role="tablist" aria-label="Admin sections">${tabs}</div><div class="admin-toolbar"><h3>${esc(state.adminResource.replace('_',' '))}</h3>${canCreate?'<button type="button" class="button" data-admin-new>Add record</button>':''}</div>${state.adminError?`<p class="auth-message">${esc(state.adminError)}</p>`:''}${state.adminEditing?adminEditor():upload}<div class="admin-list">${list}</div></section>`;
      }

      function defaultAdminItem(resource) {
        if(resource==='soils') return {cropIds:[],image:'',published:true};
        if(resource==='crops') return {seasons:[],soilIds:[],image:'',published:true};
        if(resource==='diseases') return {symptoms:[],prevention:[],management:[],published:true};
        if(resource==='site_settings') return state.adminItems.find(item=>item.id==='public-site')||{id:'public-site',name:'Public site',faq:[]};
        if(resource==='media') return {kind:'image',published:true};
        return {};
      }

      async function saveAdminItem(event) {
        event.preventDefault();
        const form=event.currentTarget;
        if(!form.reportValidity()) return;
        const formData=new FormData(form);
        const raw=Object.fromEntries(formData.entries());
        const resource=state.adminResource;
        const payload={...raw};
        if(resource==='soils') payload.cropIds=formData.getAll('cropIds');
        if(resource==='crops') {payload.soilIds=formData.getAll('soilIds');payload.seasons=formData.getAll('seasons');}
        if(resource==='diseases') {for(const key of ['symptoms','prevention','management']) payload[key]=raw[key].split('\n').map(item=>item.trim()).filter(Boolean);}
        if(resource==='site_settings') {try {payload.faq=JSON.parse(raw.faq||'[]');}catch(_){$('#admin-editor-error').textContent='FAQs must be valid JSON.';return;} payload.id='public-site';}
        const existing=state.adminEditing;
        const route=resource==='diseases'&&existing?`/api/admin/diseases/${encodeURIComponent(existing.cropId)}/${encodeURIComponent(existing.id)}`:`/api/admin/${resource}${existing?`/${encodeURIComponent(existing.id)}`:''}`;
        try {
          await apiRequest(route,{method:existing?'PUT':'POST',body:payload});
          state.adminEditing=null; await loadCatalogFromDatabase(); await loadAdminOverview(); showToast('Content saved successfully.');
        } catch(error) { $('#admin-editor-error').textContent=error.message; }
      }

      async function uploadAdminMedia(event) {
        event.preventDefault();
        const form=event.currentTarget;
        const file=form.elements.image.files[0];
        if(!file) return;
        const data=new FormData();data.append('image',file);data.append('name',form.elements.name.value);
        const button=form.querySelector('[type="submit"]');button.disabled=true;
        try { await apiRequest('/api/admin/media/upload',{method:'POST',body:data});await loadAdminOverview();showToast('Image uploaded to the KrishMithr media library.'); }
        catch(error) {state.adminError=error.message;renderWorkspace();}
        finally {button.disabled=false;}
      }

      function renderWorkspace() {
        const workspace = $('#workspace');
        const renderers = { soils: renderSoils, crops: renderCrops, diseases: renderDiseases, detail: renderDiseaseDetails, favorites: renderFavorites, contact: renderContact, 'thank-you': renderThankYou, legal:renderLegal, admin:renderAdmin, 'not-found': () => emptyState('This field path does not exist.', 'The page may have moved, or this link may be incomplete.', 'Return home','home') };
        workspace.innerHTML = (renderers[state.view] || renderSoils)();
        if (state.view === 'crops') updateCropGrid();
        if (state.view === 'contact') $('#contact-form')?.addEventListener('submit',submitContact);
        if (state.view === 'admin') { $('#admin-editor')?.addEventListener('submit',saveAdminItem); $('#media-upload')?.addEventListener('submit',uploadAdminMedia); }
        workspace.classList.remove('workspace-enter');
        void workspace.offsetWidth;
        workspace.classList.add('workspace-enter');
        updateProgress();
        updateFavoriteControls();
        const title = $('#workspace-title')?.textContent || 'Soil explorer';
        document.title = state.view === 'soils' ? 'KrishMithr | Good farming starts with your soil' : `${title.replace(/\.$/, '')} | KrishMithr`;
        $('#journey-announcement').textContent = title;
      }

      function updateProgress() {
        const stage = state.view === 'crops' ? 1 : ['diseases','detail'].includes(state.view) ? 2 : 0;
        $$('.step-button').forEach((button, index) => {
          button.disabled = index === 1 ? !state.soilId : index === 2 ? !state.cropId : false;
          button.classList.toggle('completed', index < stage && state.view !== 'favorites');
          if (index === stage && state.view !== 'favorites') button.setAttribute('aria-current', 'step');
          else button.removeAttribute('aria-current');
          $('.step-number', button).innerHTML = index < stage && state.view !== 'favorites' ? icon('check') : `0${index + 1}`;
        });
      }

      function setActiveNav(section) {
        $$('.nav-link').forEach(link => {
          const active = link.dataset.nav === section;
          link.classList.toggle('active', active);
          if (active) link.setAttribute('aria-current', 'page'); else link.removeAttribute('aria-current');
        });
      }

      function scrollToSection(id, focus = false) {
        const element = document.getElementById(id);
        if (!element) return;
        requestAnimationFrame(() => {
          if (focus) {
            const title = element.querySelector('h1, h2');
            title?.setAttribute('tabindex', '-1');
            title?.focus({ preventScroll: true });
          }
          element.scrollIntoView({ behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth', block: 'start' });
        });
      }

      function navigate(hash) {
        closeSearch(); closeMenu();
        if (location.hash === hash) handleRoute(true);
        else location.hash = hash;
      }

      function selectSoil(soilId) {
        if (!has(agricultureData, soilId)) return showToast('That soil is not available. Please choose a soil picture.');
        navigate(`#crops/${soilId}`);
      }

      function selectCrop(cropId, soilId = state.soilId) {
        if (!hasCrop(soilId, cropId)) return showToast('Choose a suitable crop from your selected soil first.');
        navigate(`#diseases/${soilId}/${cropId}`);
      }

      function showDiseaseDetails(diseaseId) {
        if (!getDisease(state.cropId, diseaseId)) return showToast('That disease is not available for this crop.');
        navigate(`#disease/${state.soilId}/${state.cropId}/${diseaseId}`);
      }

      function resetSelection() {
        Object.assign(state, { view: 'soils', soilId: null, cropId: null, diseaseId: null, cropQuery: '', season: 'All' });
        $('#global-search').value = '';
        navigate('#soils');
        showToast('A fresh start. Choose your soil to begin.');
      }

      function routeToAvailableStep(section) {
        if (section === 'crops' && state.soilId) return navigate(`#crops/${state.soilId}`);
        if (section === 'diseases' && state.soilId && state.cropId) return navigate(`#diseases/${state.soilId}/${state.cropId}`);
        if (section === 'diseases' && state.soilId) {
          showToast('Choose a crop picture to explore its diseases.');
          return navigate(`#crops/${state.soilId}`);
        }
        showToast('Start with a soil picture to see suitable crops.');
        navigate('#soils');
      }

      function handleRoute(scroll = true) {
        closeSearch(); closeMenu();
        if (!state.user) {
          if (!['#login', '#signup'].includes(location.hash)) {
            writeStored('krishmithr_requested_route', location.hash || '#home');
            if (location.hash !== '#login') history.replaceState(null, '', `${location.pathname}${location.search}#login`);
          }
          renderAuthRoute();
          return;
        }
        document.body.classList.remove('auth-required');
        $('#auth-screen').hidden = true;
        if (['#login', '#signup'].includes(location.hash)) { navigate('#home'); return; }
        const hash = location.hash || '#home';
        let parts;
        try { parts = hash.slice(1).split('/').map(decodeURIComponent); } catch (_) { parts = ['unknown']; }
        const section = parts[0];
        if ((section === 'about' || section === 'questions') && parts.length === 1) {
          setActiveNav('about');
          if (scroll) scrollToSection(section, true);
          return;
        }
        if (['contact','thank-you'].includes(section) && parts.length === 1) {
          state.view = section === 'contact' ? 'contact' : 'thank-you'; renderWorkspace(); setActiveNav('');
          if (scroll) scrollToSection('explorer',true);
          return;
        }
        if (['privacy','terms','cookies'].includes(section) && parts.length === 1) {
          state.view = 'legal'; state.legalType = section; renderWorkspace(); setActiveNav('');
          if (scroll) scrollToSection('explorer',true);
          return;
        }
        if (section==='admin' && parts.length===1) {
          if(!['admin','editor'].includes(state.user.role)) {state.view='not-found';renderWorkspace();return;}
          state.view='admin';state.adminEditing=null;renderWorkspace();
          loadAdminOverview().catch(error=>{state.adminError=error.message;renderWorkspace();});
          if(scroll)scrollToSection('explorer',true);
          return;
        }
        if (parts.length === 1 && (section === 'crops' || section === 'diseases')) return routeToAvailableStep(section);
        if (section === 'favorites' && parts.length === 1) {
          state.view = 'favorites'; renderWorkspace(); setActiveNav('');
          if (scroll) scrollToSection('explorer', true);
          return;
        }
        if (['home','soils','explorer',''].includes(section) && parts.length === 1) {
          state.view = 'soils'; renderWorkspace(); setActiveNav(section === 'home' || !section ? 'home' : 'soils');
          if (scroll) scrollToSection(section === 'home' || !section ? 'home' : 'explorer', section !== 'home');
          return;
        }
        const [_, soilId, cropId, diseaseId] = parts;
        const validSoil = has(agricultureData, soilId);
        const validCrop = validSoil && hasCrop(soilId, cropId);
        const validDisease = validCrop && getDisease(cropId, diseaseId);
        const validRoute = (section === 'crops' && parts.length === 2 && validSoil) || (section === 'diseases' && parts.length === 3 && validCrop) || (section === 'disease' && parts.length === 4 && validDisease);
        if (!validRoute) {
          state.view = 'not-found';
          renderWorkspace(); setActiveNav('');
          if (scroll) scrollToSection('explorer', true);
          return;
        }
        if (state.soilId !== soilId) { state.cropQuery = ''; state.season = 'All'; }
        state.soilId = soilId;
        state.cropId = validCrop ? cropId : null;
        state.diseaseId = validDisease ? diseaseId : null;
        state.view = section === 'disease' ? 'detail' : section;
        renderWorkspace();
        setActiveNav(['soils','crops','diseases','disease','favorites'].includes(section) ? 'soils' : section);
        if (scroll) scrollToSection('explorer', true);
      }

      function searchAgriculture(query) {
        const normalized = String(query || '').trim().toLowerCase().slice(0, 120);
        if (!normalized) return [];
        const matches = [];
        const add = (title, meta, type, route) => {
          const text = `${title} ${meta}`.toLowerCase();
          if (text.includes(normalized)) matches.push({ title, meta, type, route, score: title.toLowerCase() === normalized ? 0 : title.toLowerCase().startsWith(normalized) ? 1 : title.toLowerCase().includes(normalized) ? 2 : 3 });
        };
        soilRecords.forEach(soil => add(soil.name, 'Soil / Explore suitable crops', 'soil', `#crops/${soil.id}`));
        Object.values(crops).forEach(item => {
          const soilId = hasCrop(state.soilId, item.id) ? state.soilId : firstSoilForCrop(item.id);
          add(item.name, `Crop / ${item.category}`, 'wheat', `#diseases/${soilId}/${item.id}`);
          Object.values(item.diseases).forEach(entry => add(entry.name, `${item.name} / ${entry.type} disease`, 'leaf', `#disease/${soilId}/${item.id}/${entry.id}`));
        });
        return matches.sort((a,b) => a.score - b.score || a.title.localeCompare(b.title)).slice(0, 18);
      }

      function renderSearch() {
        const input = $('#global-search');
        const panel = $('#search-results');
        const query = input.value.trim();
        state.searchIndex = -1;
        input.removeAttribute('aria-activedescendant');
        if (!query) return closeSearch();
        state.searchResults = searchAgriculture(query);
        panel.innerHTML = state.searchResults.length ? state.searchResults.map((result, index) => `<a class="search-result" id="search-result-${index}" role="option" aria-selected="false" tabindex="-1" href="${result.route}" data-search-result="${index}">${icon(result.type)}<span><span class="result-name">${esc(result.title)}</span><span class="result-meta">${esc(result.meta)}</span></span></a>`).join('') : `<p class="search-message">No matches for "${esc(query)}". Try a soil, crop, or disease name.</p>`;
        panel.hidden = false;
        input.setAttribute('aria-expanded', 'true');
      }

      function closeSearch() {
        $('#search-results').hidden = true;
        $('#global-search').setAttribute('aria-expanded', 'false');
        $('#global-search').removeAttribute('aria-activedescendant');
        state.searchIndex = -1;
      }

      function highlightSearch(index) {
        state.searchIndex = index;
        $$('.search-result').forEach((result, i) => result.setAttribute('aria-selected', String(i === index)));
        const selected = $(`#search-result-${index}`);
        if (selected) { $('#global-search').setAttribute('aria-activedescendant', selected.id); selected.scrollIntoView({ block: 'nearest' }); }
      }

      function openSearchResult(index) {
        const result = state.searchResults[index];
        if (!result) return;
        $('#global-search').value = '';
        navigate(result.route);
      }

      function closeMenu() {
        $('#mobile-nav').hidden = true;
        $('#menu-toggle').setAttribute('aria-expanded', 'false');
        $('#menu-toggle').setAttribute('aria-label', 'Open navigation');
        $('#menu-toggle').innerHTML = icon('menu');
      }

      const infoContent = {
        soil: { title: 'Get to know your soil.', content: '<p>Soil type is a useful starting point, but a photograph cannot tell you everything about your field.</p><h3>Start with texture and drainage</h3><p>Sandy soil feels gritty and usually drains quickly. Clay feels sticky when wet and can form a ribbon. Loam combines different particle sizes. Color alone is not a reliable test.</p><h3>Use a soil test</h3><p>A local soil laboratory or agricultural extension service can test texture, pH, salinity, organic matter, and nutrients. Sample several places in the field using their instructions.</p><h3>Check your local conditions</h3><p>The crop lists are educational examples. Rainfall, irrigation, drainage, climate, and variety can change suitability. Ask a local adviser before investing in a planting plan.</p>' },
        privacy: { title: 'Your privacy, simply.', content: '<p>KrishMithr stores your name, email address, password hash, account preferences, saved crops, and contact messages in the existing KrishMithr database. Passwords are never stored in plain text. Your session is held in an HTTP-only cookie and expires automatically.</p><h3>Why we use this data</h3><p>Account details let us sign you in and show your profile. Favorites and theme are saved to your profile. Contact details and message content are used to respond to your enquiry.</p><h3>Database and access</h3><p>Account and enquiry data is available only to the application and authorized content administrators. Never send passwords or private database credentials in a message. Contact the KrishMithr administrator to request account deletion or correction.</p><h3>External services</h3><p>Illustrative photography loads from Pexels, fonts from Google Fonts, and selected disease videos from YouTube. Those providers receive the network information needed to deliver their resources. YouTube is contacted only when you choose to open or play a video.</p><h3>Agricultural content</h3><p>Crop and disease information is educational and does not replace a local soil test, diagnosis, or advice from a qualified agricultural professional.</p>' },
        terms: { title: 'A thoughtful way to grow.', content: `<p>KrishMithr provides general educational information about soil, crops, and plant diseases. It does not provide a soil test, a disease diagnosis, or guaranteed crop outcomes.</p><h3>Use local expertise</h3><p>Suitability, seasons, water requirements, and crop duration vary by location and variety. Images are illustrative. Confirm planting and disease-management decisions with qualified agricultural professionals.</p><h3>Crop protection</h3><p>${SAFETY_NOTE}</p><h3>Accounts</h3><p>Keep your account credentials private. You are responsible for activity through your authenticated session. Administrators may suspend accounts that misuse the service.</p><h3>Third-party resources</h3><p>Linked videos belong to their publishers. They may change or become unavailable, and search results are not reviewed by KrishMithr. No video is a guarantee of a cure. Plant viral diseases in particular often have no curative treatment.</p><h3>Media rights</h3><p>Photography and videos remain the property of their creators and are subject to their respective licenses and platform terms.</p>` },
        cookies: { title:'Cookie policy', content:'<p>KrishMithr uses one essential HTTP-only session cookie to keep you signed in and protect authenticated requests. The cookie is marked SameSite=Strict and Secure in production. It expires after the configured session period or when you sign out.</p><p>KrishMithr does not use advertising or analytics cookies. Your theme and favorites are stored in your account in the database.</p>' },
        credits: { title: 'Real fields. Real creators.', content: '<p>KrishMithr uses real photography sourced through <a href="https://www.pexels.com" target="_blank" rel="noopener noreferrer">Pexels</a>. Photos are illustrative and should not be used to diagnose soil or plant disease.</p><h3>Featured photography</h3><ul><li>Terraced-field hero: Thanh Peter, Pexels photo 15826906.</li><li>Seedling in hands: Atlantic Ambience, photo 12969371.</li><li>Soil and crop photography includes work by Jan Kroon, Mark Stebnicki, Mathias Reding, Engin Akyurt, Quang Nguyen Vinh, and other Pexels contributors.</li></ul><h3>Telugu video resources</h3><p>Topic-specific links include publishers RF Information Services, Agri Mentor, TeluguStop, and Rythubadi. Language and topic are based on the publishers\' titles and descriptions; content is not independently certified by KrishMithr.</p><p>Only exact crop/disease pairs receive an embedded-video option. Other entries offer a clearly labeled YouTube search.</p>' }
      };

      function showInfo(type, trigger) {
        if (!has(infoContent, type)) return;
        const dialog = $('#info-dialog');
        lastDialogTrigger = trigger;
        $('#dialog-title').textContent = infoContent[type].title;
        $('#dialog-body').innerHTML = infoContent[type].content;
        if (typeof dialog.showModal === 'function') dialog.showModal();
        else dialog.setAttribute('open', '');
        $('#close-dialog').focus();
      }

      function closeInfo() {
        const dialog = $('#info-dialog');
        if (typeof dialog.close === 'function') dialog.close(); else dialog.removeAttribute('open');
        if (lastDialogTrigger?.isConnected) lastDialogTrigger.focus({ preventScroll: true });
      }

      function loadVideo() {
        const video = getTeluguVideo(state.cropId, state.diseaseId);
        if (!video || !$('#video-player')) return;
        const frame = document.createElement('iframe');
        frame.src = `https://www.youtube-nocookie.com/embed/${video.id}?autoplay=1&rel=0&hl=te&playsinline=1`;
        frame.title = `${video.title} - Telugu video by ${video.channel}`;
        frame.allow = 'accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen';
        frame.allowFullscreen = true;
        frame.referrerPolicy = 'strict-origin-when-cross-origin';
        $('#video-player').replaceChildren(frame);
        frame.focus();
      }

      function showProfile() {
        const dialog = $('#profile-dialog');
        const form = $('#profile-form');
        form.elements.fullName.value = state.user.fullName;
        form.elements.email.value = state.user.email;
        form.elements.currentPassword.value = '';
        form.elements.newPassword.value = '';
        $('#profile-message').textContent = '';
        $('#account-popover').hidden = true;
        $('#account-trigger').setAttribute('aria-expanded','false');
        dialog.showModal();
        form.elements.fullName.focus();
      }

      async function saveProfile(event) {
        event.preventDefault();
        const form = event.currentTarget;
        if (!form.reportValidity()) return;
        const submit = form.querySelector('[type="submit"]');
        submit.disabled = true;
        try {
          const payload = { fullName:form.elements.fullName.value, email:form.elements.email.value };
          if (form.elements.newPassword.value) { payload.currentPassword=form.elements.currentPassword.value; payload.newPassword=form.elements.newPassword.value; }
          const result = await apiRequest('/api/auth/profile',{method:'PATCH',body:payload});
          state.user = result.user;
          updateAccountControl();
          $('#profile-dialog').close();
          showToast('Your profile has been updated.');
        } catch (error) { $('#profile-message').textContent = error.message; }
        finally { submit.disabled = false; }
      }

      async function signOut() {
        $('#account-popover').hidden = true;
        try {
          await apiRequest('/api/auth/logout',{method:'POST'});
          state.user = null;
          state.favorites = [];
          document.documentElement.dataset.theme = 'light';
          updateThemeControl();
          const authForm = $('#auth-form');
          authForm.reset();
          authForm.elements.name.value = '';
          authForm.elements.email.value = '';
          authForm.elements.password.value = '';
          setAuthPasswordVisibility(false);
          try { sessionStorage.removeItem('krishmithr_requested_route'); } catch (_) { /* Continue signing out. */ }
          history.replaceState(null,'',`${location.pathname}${location.search}#login`);
          renderAuthRoute();
          document.body.classList.add('auth-required');
        } catch (error) { showToast(error.message || 'Unable to sign out right now.'); }
      }

      function handleImageError(image) {
        if (image.closest('.image-button')) {
          const fallback = document.createElement('span');
          fallback.className = 'photo-fallback';
          fallback.setAttribute('aria-hidden', 'true');
          fallback.innerHTML = icon('sprout');
          image.replaceWith(fallback);
        } else image.style.opacity = '0';
      }

      function validateData() {
        const errors = [];
        if (soilRecords.length < 7) errors.push('At least seven soil types are required.');
        if (new Set(soilRecords.map(soil => soil.id)).size !== soilRecords.length) errors.push('Soil identifiers must be unique.');
        soilRecords.forEach(soil => {
          if (soil.cropIds.length < 5) errors.push(`${soil.name} needs five crops.`);
          if (new Set(soil.cropIds).size !== soil.cropIds.length) errors.push(`${soil.name} has a repeated crop.`);
          soil.cropIds.forEach(id => { if (!has(crops, id)) errors.push(`Unknown crop: ${id}`); });
        });
        Object.values(crops).forEach(item => {
          if (!item.seasons.length || !item.seasons.every(season => ['Kharif','Rabi','Zaid','Year-round'].includes(season))) errors.push(`${item.name} has an invalid season.`);
          if (!item.description || !item.water || !item.duration || !item.image || !item.alt) errors.push(`${item.name} has missing crop information.`);
          if (Object.keys(item.diseases).length < 3) errors.push(`${item.name} needs three diseases.`);
          Object.values(item.diseases).forEach(entry => {
            ['description','symptoms','cause','conditions','prevention','management'].forEach(field => {
              if (!entry[field] || (Array.isArray(entry[field]) && !entry[field].length)) errors.push(`${item.name}/${entry.name}: ${field} missing.`);
            });
          });
        });
        Object.entries(teluguVideos).forEach(([key, entry]) => {
          const [cropId, diseaseId] = key.split(':');
          if (!getDisease(cropId, diseaseId) || !/^[A-Za-z0-9_-]{11}$/.test(entry.id)) errors.push(`Invalid video mapping: ${key}`);
        });
        return { valid: errors.length === 0, soils: soilRecords.length, crops: Object.keys(crops).length, diseases: Object.values(crops).reduce((total,item) => total + Object.keys(item.diseases).length, 0), errors };
      }

      function bindEvents() {
        document.addEventListener('click', event => {
          const target = event.target instanceof Element ? event.target : event.target.parentElement;
          const passwordToggle = target.closest('[data-password-toggle]');
          if (passwordToggle) {
            const password = $('#auth-form [name="password"]');
            setAuthPasswordVisibility(password.type === 'password');
            return;
          }
          const adminResource=target.closest('[data-admin-resource]');
          if(adminResource){state.adminResource=adminResource.dataset.adminResource;state.adminEditing=null;state.adminError='';loadAdminOverview().catch(error=>{state.adminError=error.message;renderWorkspace();});return;}
          if(target.closest('[data-admin-new]')){state.adminEditing=defaultAdminItem(state.adminResource);renderWorkspace();$('#admin-editor')?.querySelector('input,textarea,select')?.focus();return;}
          if(target.closest('[data-admin-cancel]')){state.adminEditing=null;renderWorkspace();return;}
          const editItem=target.closest('[data-admin-edit]');
          if(editItem){state.adminEditing=state.adminItems.find(item=>adminItemKey(item)===editItem.dataset.adminEdit)||null;renderWorkspace();$('#admin-editor')?.querySelector('input,textarea,select')?.focus();return;}
          const deleteItem=target.closest('[data-admin-delete]');
          if(deleteItem){if(!window.confirm('Delete this content and its linked records?'))return;const key=deleteItem.dataset.adminDelete.split('|');const route=state.adminResource==='diseases'?`/api/admin/diseases/${encodeURIComponent(key[0])}/${encodeURIComponent(key[1])}`:`/api/admin/${state.adminResource}/${encodeURIComponent(key[0])}`;apiRequest(route,{method:'DELETE'}).then(async()=>{showToast('Content deleted.');await loadCatalogFromDatabase();return loadAdminOverview();}).catch(error=>{state.adminError=error.message;renderWorkspace();});return;}
          const accountAction = target.closest('[data-account]');
          if (accountAction?.dataset.account === 'profile') { showProfile(); return; }
          if (target.closest('#logout-button')) { signOut(); return; }
          if (target.closest('#account-trigger')) {
            const open = $('#account-popover').hidden;
            $('#account-popover').hidden = !open;
            $('#account-trigger').setAttribute('aria-expanded',String(open));
            return;
          }
          const info = target.closest('[data-info]');
          if (info) { showInfo(info.dataset.info, info); return; }
          const result = target.closest('[data-search-result]');
          if (result) { event.preventDefault(); openSearchResult(Number(result.dataset.searchResult)); return; }
          const action = target.closest('[data-action]');
          if (action) {
            const { action: name, soilId, cropId, diseaseId } = action.dataset;
            if (name === 'play-video') {
              // Local files have no HTTP Referer; opening YouTube avoids player error 153.
              if (location.protocol !== 'file:') { event.preventDefault(); loadVideo(); }
              return;
            }
            event.preventDefault();
            if (name === 'soil') selectSoil(soilId);
            else if (name === 'crop') selectCrop(cropId, soilId);
            else if (name === 'disease') showDiseaseDetails(diseaseId);
            else if (name === 'favorite') toggleFavorite(cropId, soilId);
          else if (name === 'soils') navigate('#soils');
          else if (name === 'home') navigate('#home');
            else if (name === 'clear-filters') {
              state.cropQuery = ''; state.season = 'All';
              $('#crop-search').value = ''; $('#season-filter').value = 'All';
              updateCropGrid(); $('#crop-search').focus();
            }
            return;
          }
          const anchor = target.closest('a[href^="#"]');
          if (anchor && !event.metaKey && !event.ctrlKey && !event.shiftKey && !event.altKey) { event.preventDefault(); navigate(anchor.getAttribute('href')); return; }
          const step = target.closest('[data-step]');
          if (step && !step.disabled) {
            if (step.dataset.step === 'soil') navigate('#soils');
            else routeToAvailableStep(step.dataset.step === 'crop' ? 'crops' : 'diseases');
          }
        });
        $('#workspace').addEventListener('input', event => {
          if (event.target.id === 'crop-search') { state.cropQuery = event.target.value; updateCropGrid(); }
        });
        $('#workspace').addEventListener('change', event => {
          if (event.target.id === 'season-filter') { state.season = event.target.value; updateCropGrid(); }
          if(event.target.matches('[data-user-role]')) apiRequest(`/api/admin/users/${encodeURIComponent(event.target.dataset.userRole)}/role`,{method:'PATCH',body:{role:event.target.value}}).then(()=>showToast('Account role updated.')).catch(error=>{showToast(error.message);loadAdminOverview();});
          if(event.target.matches('[data-enquiry-status]')) apiRequest(`/api/admin/enquiries/${encodeURIComponent(event.target.dataset.enquiryStatus)}`,{method:'PATCH',body:{status:event.target.value}}).then(()=>showToast('Enquiry status updated.')).catch(error=>showToast(error.message));
        });
        $('#global-search').addEventListener('input', renderSearch);
        $('#auth-form').addEventListener('submit', completeAuth);
        $('#profile-form').addEventListener('submit', saveProfile);
        $('#contact-form')?.addEventListener('submit',submitContact);
        $('#close-profile').addEventListener('click', () => $('#profile-dialog').close());
        $('#global-search').addEventListener('focus', () => { if ($('#global-search').value.trim()) renderSearch(); });
        $('#global-search').addEventListener('keydown', event => {
          if (event.key === 'Escape') { closeSearch(); return; }
          if ($('#search-results').hidden) return;
          const length = state.searchResults.length;
          if (event.key === 'ArrowDown' && length) { event.preventDefault(); highlightSearch((state.searchIndex + 1) % length); }
          else if (event.key === 'ArrowUp' && length) { event.preventDefault(); highlightSearch(state.searchIndex <= 0 ? length - 1 : state.searchIndex - 1); }
          else if (event.key === 'Enter' && length) { event.preventDefault(); openSearchResult(Math.max(state.searchIndex, 0)); }
          else if (event.key === 'Tab') closeSearch();
        });
        document.addEventListener('pointerdown', event => {
          if (!event.target.closest('.header-search')) closeSearch();
          if (!event.target.closest('.site-header')) closeMenu();
          if (!event.target.closest('#account-menu')) { $('#account-popover').hidden=true;$('#account-trigger').setAttribute('aria-expanded','false'); }
        });
        document.addEventListener('keydown', event => {
          if (event.key === 'Escape') {
            closeSearch();
            if (!$('#mobile-nav').hidden) { closeMenu(); $('#menu-toggle').focus(); }
          }
          if ((event.ctrlKey || event.metaKey) && event.key.toLowerCase() === 'k' && !$('#info-dialog').open) { event.preventDefault(); $('#global-search').focus(); }
        });
        $('#theme-toggle').addEventListener('click', toggleDarkMode);
        $('#start-again').addEventListener('click', resetSelection);
        $('#menu-toggle').addEventListener('click', () => {
          const open = $('#mobile-nav').hidden;
          $('#mobile-nav').hidden = !open;
          $('#menu-toggle').setAttribute('aria-expanded', String(open));
          $('#menu-toggle').setAttribute('aria-label', open ? 'Close navigation' : 'Open navigation');
          $('#menu-toggle').innerHTML = icon(open ? 'close' : 'menu');
          closeSearch();
        });
        $('#close-dialog').addEventListener('click', closeInfo);
        $('#info-dialog').addEventListener('click', event => {
          if (event.target === $('#info-dialog')) {
            const box = event.target.getBoundingClientRect();
            if (event.clientX < box.left || event.clientX > box.right || event.clientY < box.top || event.clientY > box.bottom) closeInfo();
          }
        });
        document.addEventListener('error', event => {
          if (!(event.target instanceof HTMLImageElement)) return;
          handleImageError(event.target);
        }, true);
        window.addEventListener('hashchange', () => handleRoute(true));
        window.addEventListener('resize', () => { if (innerWidth > 1050) closeMenu(); });
        window.addEventListener('offline', () => showToast('You are offline. The field guide still works; photos and YouTube need internet.'));
        window.addEventListener('online', () => showToast('Back online. Photos and YouTube resources are available again.'));
        window.addEventListener('storage', event => {
          if (event.key === null) updateThemeControl();
        });
      }

      async function init() {
        updateThemeControl(); bindEvents();
        try {
          const result = await apiRequest('/api/auth/me');
          state.user = result.user;
          await initializeSignedInApp();
          handleRoute(Boolean(location.hash && location.hash !== '#home'));
          $$('img').filter(image => image.complete && image.naturalWidth === 0).forEach(handleImageError);
        } catch (error) {
          const hadSession=Boolean(state.user);
          if(hadSession){try{await apiRequest('/api/auth/logout',{method:'POST'});}catch(__){/* Continue to the sign-in screen. */}}
          state.user = null;
          try { const brand=await apiRequest('/api/brand');state.settings={...state.settings,...brand.brand}; } catch(__) { /* Keep the built-in sign-in copy and illustration if the database is unavailable. */ }
          renderAuthRoute();
          if(hadSession)$('#auth-message').textContent=error.message||'Your field guide could not be loaded. Please try again.';
        }
        window.KrishMithr = Object.freeze({ get agricultureData(){ return agricultureData; }, validateData, searchAgriculture, getFilteredCrops, getTeluguVideo, selectSoil, selectCrop, showDiseaseDetails, resetSelection });
      }
      init().catch(error => {
        console.error('KrishMithr could not initialize.', error);
        $('#auth-message').textContent = 'KrishMithr could not load. Check your connection and try again.';
      });
    })();
