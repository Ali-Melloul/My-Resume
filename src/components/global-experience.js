(() => {
  const DATA_URL = 'data/travel.json';
  const WORLD_URL = 'https://raw.githubusercontent.com/holtzy/D3-graph-gallery/master/DATA/world.geojson';
  const EARTH_IMAGE = 'https://unpkg.com/three-globe/example/img/earth-night.jpg';
  const BUMP_IMAGE = 'https://unpkg.com/three-globe/example/img/earth-topology.png';
  const globeElement = document.getElementById('globe');
  const status = document.getElementById('status');
  const dialog = document.getElementById('country-dialog');
  const dialogContent = document.getElementById('dialog-content');
  const closeDialog = document.getElementById('close-dialog');
  const visitButtons = document.getElementById('visit-buttons');
  let globe;
  let countryGroups = [];

  const key = value => String(value || '').trim().toLowerCase();
  const escapeHtml = value => String(value || '').replace(/[&<>"']/g, character => ({ '&':'&', '<':'<', '>':'>', '"':'"', "'":'&#39;' })[character]);
  const countryName = feature => feature.properties?.name || feature.properties?.NAME || feature.properties?.ADMIN || '';
  const flagImage = code => {
    const c = String(code || '').trim().toLowerCase();
    return c && /^[a-z]{2}$/.test(c)
      ? `<img class="country-flag" src="https://flagcdn.com/w40/${c}.png" srcset="https://flagcdn.com/w80/${c}.png 2x" alt="${escapeHtml(c)} flag" loading="lazy">`
      : '';
  };

  function normalizeCountryGroups(rawVisits) {
    const groups = new Map();

    rawVisits.forEach(item => {
      const groupItems = Array.isArray(item.events) ? item.events.map(event => ({ ...event, country: item.country, flag: event.flag || item.flag || '●', coordinates: event.coordinates || item.coordinates || [0, 0], organization: event.organization || item.organization || '', images: event.images || item.images || [] })) : [{ ...item, flag: item.flag || '●', coordinates: item.coordinates || [0, 0], organization: item.organization || '', images: item.images || [] }];

      groupItems.forEach(event => {
        const countryKey = key(event.country);
        if (!groups.has(countryKey)) {
          groups.set(countryKey, {
            country: event.country,
            flag: event.flag || '●',
            coordinates: event.coordinates || [0, 0],
            events: []
          });
        }

        const countryGroup = groups.get(countryKey);
        countryGroup.events.push({
          ...event,
          country: event.country,
          flag: event.flag || countryGroup.flag,
          coordinates: event.coordinates || countryGroup.coordinates,
          city: event.city || '',
          date: event.date || '',
          event: event.event || '',
          organization: event.organization || '',
          description: event.description || 'No description available.',
          images: event.images || []
        });
      });
    });

    return Array.from(groups.values());
  }

  function resizeGlobe() {
    if (globe) globe.width(globeElement.clientWidth).height(globeElement.clientHeight);
  }

  
  function openCountry(countryGroup) {
  const events = countryGroup.events || [];
  if (!events.length) return;

  const renderEvent = (visit, index) => {
    const images = visit.images || [];
    const image = images.length ? images[index % images.length] : null;

    const eventLine = visit.event
      ? `<p class="country-meta country-meta-line"><strong>Event:</strong> ${escapeHtml(visit.event)}</p>`
      : '';

    const organizationLine = visit.organization
      ? `<p class="country-meta country-meta-line"><strong>Organization:</strong> ${escapeHtml(visit.organization)}</p>`
      : '';

    const headerLine = `
      <p class="country-meta">
        ${escapeHtml(visit.city || '')}
        ${visit.city && visit.date ? ' · ' : ''}
        ${escapeHtml(visit.date || '')}
      </p>
    `;

    return `
      <div class="country-event-card">
        ${headerLine}
        ${eventLine}
        ${organizationLine}
        <p class="country-description">
          ${escapeHtml(visit.description)}
        </p>
        ${
          image
            ? `<img class="country-image"
                    loading="lazy"
                    src="${escapeHtml(image)}"
                    alt="${escapeHtml(visit.country)} travel memory">`
            : ''
        }
      </div>
    `;
  };

  const eventMarkup = `
    <div class="country-carousel">

      <button class="carousel-arrow carousel-prev" type="button" aria-label="Previous event">
        &#10094;
      </button>

      <div class="country-events-track">
        ${events.map((visit, index) => renderEvent(visit, index)).join('')}
      </div>

      <button class="carousel-arrow carousel-next" type="button" aria-label="Next event">
        &#10095;
      </button>

    </div>
  `;

  dialogContent.innerHTML = `
    <article class="country-card is-visible">
      <p class="eyebrow">Global experience</p>

      <h2 id="dialog-country">
        ${flagImage(countryGroup.flag)}
        ${escapeHtml(countryGroup.country)}
      </h2>

      ${eventMarkup}
    </article>
  `;

  if (!dialog.open) dialog.showModal();

  // Carousel controls
  const track = dialogContent.querySelector('.country-events-track');
  const prevButton = dialogContent.querySelector('.carousel-prev');
  const nextButton = dialogContent.querySelector('.carousel-next');

  const updateArrows = () => {
    const maxScroll = track.scrollWidth - track.clientWidth;

    prevButton.disabled = track.scrollLeft <= 5;
    nextButton.disabled = track.scrollLeft >= maxScroll - 5;
  };

  prevButton.addEventListener('click', () => {
    track.scrollBy({
      left: -track.clientWidth,
      behavior: 'smooth'
    });
  });

  nextButton.addEventListener('click', () => {
    track.scrollBy({
      left: track.clientWidth,
      behavior: 'smooth'
    });
  });

  track.addEventListener('scroll', updateArrows);

  updateArrows();
}
  function addVisitButtons() {
    visitButtons.innerHTML = '';
    countryGroups.forEach(countryGroup => {
      const button = document.createElement('button');
      button.type = 'button';
      button.className = 'visit-button is-visible';
      button.innerHTML = `${flagImage(countryGroup.flag)} <span>${escapeHtml(countryGroup.country)}</span>`;
      button.addEventListener('click', () => {
        const coords = countryGroup.coordinates || [0, 0];
        globe.pointOfView({ lat: coords[0], lng: coords[1], altitude: 1.7 }, 900);
        window.setTimeout(() => openCountry(countryGroup), 520);
      });
      visitButtons.appendChild(button);
    });
  }

  async function initialise() {
    try {
      const [travelResponse, worldResponse] = await Promise.all([fetch(DATA_URL), fetch(WORLD_URL)]);
      if (!travelResponse.ok) throw new Error('Travel data could not be loaded.');

      countryGroups = normalizeCountryGroups(await travelResponse.json());

      const visitedByCountry = new Map(countryGroups.map(group => [key(group.country), group]));
      let countries = [];
      if (worldResponse.ok) {
        const world = await worldResponse.json();
        countries = world.features.map(feature => ({ ...feature, visit: visitedByCountry.get(key(countryName(feature))) }));
      }

      globe = new Globe(globeElement)
        .width(globeElement.clientWidth)
        .height(globeElement.clientHeight)
        .backgroundColor('rgba(0,0,0,0)')
        .globeImageUrl(EARTH_IMAGE)
        .bumpImageUrl(BUMP_IMAGE)
        .showAtmosphere(true)
        .atmosphereColor('#70d7df')
        .atmosphereAltitude(0.16)
        .polygonsData(countries)
        .polygonCapColor(country => country.visit ? 'rgba(220, 163, 90, 0.78)' : 'rgba(89, 126, 127, 0.12)')
        .polygonSideColor(country => country.visit ? 'rgba(220, 163, 90, 0.28)' : 'rgba(0,0,0,0)')
        .polygonStrokeColor(country => country.visit ? 'rgba(255, 221, 164, 0.95)' : 'rgba(170, 209, 203, 0.16)')
        .polygonAltitude(country => country.visit ? 0.035 : 0.006)
        .polygonLabel(country => country.visit ? `<b>${escapeHtml(country.visit.country)}</b><br>${country.visit.events.length} ${country.visit.events.length === 1 ? 'journey' : 'journeys'}` : '')
        .onPolygonHover(country => { globeElement.style.cursor = country?.visit ? 'pointer' : 'grab'; })
        .onPolygonClick(country => { if (country.visit) selectVisit(country.visit); });

      globe.controls().autoRotate = true;
      globe.controls().autoRotateSpeed = 0.35;
      globe.controls().enablePan = false;
      globe.pointOfView({ lat: 20, lng: 15, altitude: 2.25 });
      addVisitButtons();
      status.textContent = `${countryGroups.length} highlighted ${countryGroups.length === 1 ? 'country' : 'countries'} · Select a highlighted country`;
      new ResizeObserver(resizeGlobe).observe(globeElement);
    } catch (error) {
      console.error(error);
      status.textContent = 'The globe could not load. Please check your connection and open this site with Live Server.';
    }
  }

  function selectVisit(countryGroup) {
    const coords = countryGroup.coordinates || [0, 0];
    globe.pointOfView({ lat: coords[0], lng: coords[1], altitude: 1.7 }, 900);
    window.setTimeout(() => openCountry(countryGroup), 520);
  }

  closeDialog.addEventListener('click', () => dialog.close());
  dialog.addEventListener('click', event => { if (event.target === dialog) dialog.close(); });
  initialise();
})();
