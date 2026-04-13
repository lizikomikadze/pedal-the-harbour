/* global L */

const ROUTE_KM_DEFAULT = 18;

// Approximate car emissions factors (kg CO2 / km)
const DEFAULT_CAR_FACTOR = 0.192;

// A pragmatic calories-per-km default for easy urban cycling
const DEFAULT_KCAL_PER_KM = 30;

// Stops are approximate, for a clean demo route UI.
// Replace coordinates/details with your exact research later.
const STOPS = [
  {
    id: "tai-wai",
    name: "Tai Wai",
    eyebrow: "Start",
    type: "start",
    lat: 22.3729,
    lng: 114.1787,
    mediaUrl: "./assets/images/stop-tai-wai.png",
    overview:
      "Kick off near the rail hub—an easy start point to reach by MTR. Do a quick bike check, grab water, and begin with a gentle warm-up.",
    sustainability:
      "Starting by public transport keeps the whole day low-carbon. Combining MTR + cycling is often the best city-friendly combo.",
    things: [
      "Set seat height and test brakes",
      "Plan a relaxed pace for the first 10 minutes",
      "Top up water before the long waterfront stretch",
    ],
    ecoTips: [
      "Bring a reusable bottle and a small snack container",
      "Avoid single-use wet wipes; carry a small towel instead",
      "Use MTR for the return if tired—still low-impact",
    ],
    distanceFromStartKm: 0,
  },
  {
    id: "shing-mun-river",
    name: "Shing Mun River Cycle Track",
    eyebrow: "Green corridor",
    type: "scenic",
    lat: 22.3836,
    lng: 114.1962,
    mediaUrl: "./assets/images/stop-green-corridor.png",
    overview:
      "A calm, separated-feeling stretch to settle into your rhythm—ideal for a smooth, steady cadence and stress-free navigation.",
    sustainability:
      "Dedicated cycle tracks encourage mode shift away from cars. More riders = stronger case for better cycling infrastructure.",
    things: ["Enjoy the river views", "Practice gentle bell use when passing", "Keep a consistent line"],
    ecoTips: ["Ride quietly and respect shared paths", "Stick to marked tracks to protect greenery", "Pack out any wrappers"],
    distanceFromStartKm: 3.5,
  },
  {
    id: "science-park",
    name: "Hong Kong Science Park",
    eyebrow: "Mid-route",
    type: "waypoint",
    lat: 22.4250,
    lng: 114.2106,
    mediaUrl: "./assets/images/stop-science-park.png",
    overview:
      "A convenient midpoint for a break. Find shade, refuel, and reset before continuing toward Tai Po’s waterfront.",
    sustainability:
      "A perfect place to practice low-waste habits: choose dine‑in, refill water, and avoid disposable cutlery where possible.",
    things: ["Take a hydration break", "Refuel with a balanced lunch", "Stretch calves and shoulders"],
    ecoTips: ["Ask for “no cutlery” if taking away", "Choose reusable containers when possible", "Use bins correctly and keep promenades clean"],
    distanceFromStartKm: 10.8,
  },
  {
    id: "pak-shek-kok-lunch",
    name: "Pak Shek Kok Promenade",
    eyebrow: "Lunch stop",
    type: "lunch",
    lat: 22.4314,
    lng: 114.2069,
    mediaUrl: "./assets/images/stop-pak-shek-kok.png",
    overview:
      "A breezy waterfront stretch near Science Park—ideal for a relaxed lunch break before the final leg.",
    sustainability:
      "Eating local and reducing takeaway waste keeps your footprint low. If you do takeaway, request no cutlery and carry a small reusable container.",
    things: ["Choose a sit-down meal if possible", "Refill water and re-apply sunscreen", "Do a quick bike check before continuing"],
    ecoTips: ["Support local small businesses", "Avoid single-use packaging when you can", "Pack out leftovers and keep the promenade clean"],
    distanceFromStartKm: 12.2,
  },
  {
    id: "cozy-coffee",
    name: "Cozy Coffee",
    eyebrow: "Coffee break",
    type: "coffee",
    lat: 22.4479,
    lng: 114.1686,
    mediaUrl: "./assets/images/stop-cozy-coffee.png",
    overview:
      "A quick caffeine and pastry pause—perfect for recharging before the waterfront finale.",
    sustainability:
      "Bring a reusable cup if you have one, or choose dine-in to avoid disposable lids and cups.",
    things: ["Grab an iced latte or filter coffee", "Top up energy with a small snack", "Rest wrists/shoulders for 5 minutes"],
    ecoTips: ["Skip straws and extra napkins", "If takeaway: ask for no lid unless needed", "Sort recyclables if bins are available"],
    distanceFromStartKm: 15.5,
  },
  {
    id: "tai-po-waterfront",
    name: "Tai Po Waterfront Park",
    eyebrow: "Finish",
    type: "finish",
    lat: 22.4505,
    lng: 114.1696,
    mediaUrl: "./assets/images/stop-tai-po-waterfront.png",
    overview:
      "A scenic finish with open views—ideal for a slow cooldown and sunset photos. Take your time and enjoy the breeze.",
    sustainability:
      "Waterfront parks are shared community spaces—keeping them clean and low-noise helps everyone enjoy nature in the city.",
    things: ["Cool down with an easy 10-minute roll", "Take photos near the promenade", "Reward yourself with a light snack"],
    ecoTips: ["Refill water instead of buying new bottles", "Avoid feeding wildlife", "Leave the spot cleaner than you found it"],
    distanceFromStartKm: 18.0,
  },
];

const $ = (sel) => document.querySelector(sel);

function iconSvg(icon, { size = 16 } = {}) {
  const common = `width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"`;

  switch (icon) {
    case "play":
      return `<svg ${common}><path d="M10 8.5v7l6-3.5-6-3.5Z" fill="currentColor"/><path d="M12 22a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z" stroke="currentColor" stroke-width="1.6" opacity=".9"/></svg>`;
    case "leaf":
      return `<svg ${common}><path d="M6.2 13.1c5.4.2 9.4-1.7 12.8-6.2.3 7.3-4 12.3-10.8 12.8-1.6.1-2.9-.2-4.1-1.1-1.4-1.1-2-2.6-1.9-4.2.2-2.4 1.7-4.6 4-5.7 2.3-1.1 4.9-.8 7.1-.1-3.8 1-6.5 3.1-7.1 4.5Z" fill="currentColor"/></svg>`;
    case "cup":
      return `<svg ${common}><path d="M7 8.5h10v5.2a4.5 4.5 0 0 1-4.5 4.5H11.5A4.5 4.5 0 0 1 7 13.7V8.5Z" fill="currentColor"/><path d="M17 9.5h1.1a2.4 2.4 0 0 1 0 4.8H17" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M8 20h8" stroke="currentColor" stroke-width="1.8" stroke-linecap="round" opacity=".9"/></svg>`;
    case "fork":
      return `<svg ${common}><path d="M8 3v7M10 3v7M8 10c0 3-2 4-2 4v7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M14 3v9c0 1.7 2 2 2 2v7" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M14 8h4" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/></svg>`;
    case "flag":
      return `<svg ${common}><path d="M6 3v18" stroke="currentColor" stroke-width="1.8" stroke-linecap="round"/><path d="M7 4h9l-1.2 3.2L16 10H7V4Z" fill="currentColor"/><path d="M7 10h9l-1.2 3.2L16 16H7v-6Z" fill="currentColor" opacity=".6"/></svg>`;
    default:
      return `<svg ${common}><path d="M12 22s7-4.6 7-11a7 7 0 1 0-14 0c0 6.4 7 11 7 11Z" fill="currentColor"/><circle cx="12" cy="11" r="2.4" fill="white" opacity=".9"/></svg>`;
  }
}

function getStopTypeMeta(stop) {
  switch (stop.type) {
    case "start":
      return { label: "Start", icon: "play", a: "#2f7cff", b: "#69b6ff" };
    case "scenic":
      return { label: "Scenic", icon: "leaf", a: "#20c997", b: "#7ee0c6" };
    case "coffee":
      return { label: "Coffee", icon: "cup", a: "#7c5cff", b: "#b2a2ff" };
    case "lunch":
      return { label: "Lunch", icon: "fork", a: "#ff7a45", b: "#ffb199" };
    case "finish":
      return { label: "Finish", icon: "flag", a: "#2f7cff", b: "#20c997" };
    default:
      return { label: "Stop", icon: "pin", a: "#2f7cff", b: "#20c997" };
  }
}

function formatKg(kg) {
  if (!Number.isFinite(kg)) return "—";
  if (kg < 1) return `${Math.round(kg * 1000)} g`;
  return `${kg.toFixed(2)} kg`;
}

function formatKcal(kcal) {
  if (!Number.isFinite(kcal)) return "—";
  return `${Math.round(kcal)} kcal`;
}

function calculateImpact(distanceKm, carFactorKgPerKm, kcalPerKm) {
  const drivingKg = distanceKm * carFactorKgPerKm;
  const cyclingKg = 0;
  const savedKg = Math.max(0, drivingKg - cyclingKg);
  const calories = distanceKm * kcalPerKm;
  return { drivingKg, cyclingKg, savedKg, calories };
}

function safeParseNumber(value, fallback) {
  const n = typeof value === "number" ? value : Number.parseFloat(String(value));
  return Number.isFinite(n) ? n : fallback;
}

// --- Stop sheet (slide panel)
let currentStopIndex = 0;

function openSheet(index, { focus = false } = {}) {
  currentStopIndex = Math.max(0, Math.min(STOPS.length - 1, index));
  const stop = STOPS[currentStopIndex];
  const meta = getStopTypeMeta(stop);

  $("#sheetEyebrow").textContent = `${meta.label} • ${stop.eyebrow} • Stop ${currentStopIndex + 1} of ${STOPS.length}`;
  $("#sheetTitle").textContent = stop.name;
  $("#sheetOverview").textContent = stop.overview;
  $("#sheetSustainability").textContent = stop.sustainability;

  const media = $("#sheetMedia");
  media.style.backgroundImage = `linear-gradient(180deg, rgba(11,18,32,.18), rgba(11,18,32,.02) 60%), url("${stop.mediaUrl}")`;

  const things = $("#sheetThings");
  things.innerHTML = "";
  stop.things.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    things.appendChild(li);
  });

  const eco = $("#sheetEcoTips");
  eco.innerHTML = "";
  stop.ecoTips.forEach((t) => {
    const li = document.createElement("li");
    li.textContent = t;
    eco.appendChild(li);
  });

  const distanceKm = safeParseNumber(stop.distanceFromStartKm, 0);
  const carFactor = safeParseNumber($("#carFactor")?.value, DEFAULT_CAR_FACTOR);
  const kcalPerKm = safeParseNumber($("#kcalPerKm")?.value, DEFAULT_KCAL_PER_KM);
  const { savedKg, calories } = calculateImpact(distanceKm, carFactor, kcalPerKm);

  $("#sheetCo2Saved").textContent = formatKg(savedKg);
  $("#sheetCalories").textContent = formatKcal(calories);

  $("#stopSheet").classList.add("isOpen");
  $("#stopSheet").setAttribute("aria-hidden", "false");
  $("#scrim").hidden = false;

  updateNavButtons();
  highlightCard(stop.id);

  if (focus) $("#sheetCloseBtn").focus();
}

function closeSheet({ restoreFocusEl = null } = {}) {
  $("#stopSheet").classList.remove("isOpen");
  $("#stopSheet").setAttribute("aria-hidden", "true");
  $("#scrim").hidden = true;
  clearHighlights();
  if (restoreFocusEl && typeof restoreFocusEl.focus === "function") restoreFocusEl.focus();
}

function updateNavButtons() {
  const prevBtn = $("#prevStopBtn");
  const nextBtn = $("#nextStopBtn");
  prevBtn.disabled = currentStopIndex === 0;
  nextBtn.disabled = currentStopIndex === STOPS.length - 1;
}

function highlightCard(stopId) {
  const cards = document.querySelectorAll("[data-stop-id]");
  cards.forEach((c) => {
    c.style.outline = c.dataset.stopId === stopId ? "3px solid rgba(47,124,255,.35)" : "none";
    c.style.boxShadow = c.dataset.stopId === stopId ? "0 18px 40px rgba(47,124,255,.15)" : "";
  });
}

function clearHighlights() {
  const cards = document.querySelectorAll("[data-stop-id]");
  cards.forEach((c) => {
    c.style.outline = "none";
    c.style.boxShadow = "";
  });
}

// --- Stop cards (sidebar)
function renderStopCards() {
  const root = $("#stopCards");
  root.innerHTML = "";

  STOPS.forEach((stop, idx) => {
    const typeMeta = getStopTypeMeta(stop);
    const card = document.createElement("article");
    card.className = "stopCard";
    card.tabIndex = 0;
    card.dataset.stopId = stop.id;
    card.setAttribute("role", "button");
    card.setAttribute("aria-label", `Open stop: ${stop.name}`);

    const media = document.createElement("div");
    media.className = "stopCard__media";
    media.style.backgroundImage = `linear-gradient(180deg, rgba(11,18,32,.18), rgba(11,18,32,.02) 60%), url("${stop.mediaUrl}")`;

    const body = document.createElement("div");
    body.className = "stopCard__body";

    const title = document.createElement("h4");
    title.className = "stopCard__title";
    title.textContent = stop.name;

    const desc = document.createElement("p");
    desc.className = "stopCard__desc";
    desc.textContent = stop.overview;

    const metaEl = document.createElement("div");
    metaEl.className = "stopCard__meta";
    metaEl.innerHTML = `<span>${stop.eyebrow}</span><span class="stopMetaIcon" aria-hidden="true" style="color: rgba(11,18,32,.78)">${iconSvg(typeMeta.icon, { size: 16 })}</span>`;

    body.appendChild(title);
    body.appendChild(desc);
    body.appendChild(metaEl);

    card.appendChild(media);
    card.appendChild(body);

    const open = () => {
      openSheet(idx, { focus: false });
      focusStopOnMap(stop.id);
    };

    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        open();
      }
    });

    root.appendChild(card);
  });
}

// --- Map
let map;
let markersById = new Map();
let routeLine;

function initMap() {
  map = L.map("map", {
    zoomControl: true,
    scrollWheelZoom: true,
  });

  // Clean OSM tiles; keep it simple.
  L.tileLayer("https://tile.openstreetmap.org/{z}/{x}/{y}.png", {
    maxZoom: 19,
    attribution: "&copy; OpenStreetMap contributors",
  }).addTo(map);

  const routeLatLngs = STOPS.map((s) => [s.lat, s.lng]);

  routeLine = L.polyline(routeLatLngs, {
    color: "#2f7cff",
    weight: 6,
    opacity: 0.85,
    lineJoin: "round",
    lineCap: "round",
  }).addTo(map);

  // Soft glow underneath
  L.polyline(routeLatLngs, {
    color: "#9ad2ff",
    weight: 12,
    opacity: 0.28,
    lineJoin: "round",
    lineCap: "round",
  }).addTo(map);

  STOPS.forEach((stop, idx) => {
    const meta = getStopTypeMeta(stop);
    const icon = L.divIcon({
      className: "",
      html: `
        <div style="
          width: 26px; height: 26px; border-radius: 999px;
          display: grid; place-items: center;
          background: linear-gradient(135deg, ${meta.a}, ${meta.b});
          box-shadow: 0 18px 34px rgba(2,6,23,.18);
          border: 2px solid rgba(255,255,255,.92);
          color: rgba(255,255,255,.96);
        ">
          <div style="transform: translateY(-.5px); width: 16px; height: 16px; display:grid; place-items:center;">
            ${iconSvg(meta.icon, { size: 16 })}
          </div>
        </div>`,
      iconSize: [26, 26],
      iconAnchor: [13, 13],
    });

    const marker = L.marker([stop.lat, stop.lng], { icon }).addTo(map);
    marker.on("click", () => {
      openSheet(idx, { focus: true });
    });
    markersById.set(stop.id, marker);
  });

  fitRoute();
}

function fitRoute() {
  if (!map || !routeLine) return;
  map.fitBounds(routeLine.getBounds().pad(0.22));
}

function focusStopOnMap(stopId) {
  const marker = markersById.get(stopId);
  if (!marker || !map) return;
  map.setView(marker.getLatLng(), Math.max(map.getZoom(), 14), { animate: true });
}

// --- Calculator UI
function updateCalculator(distanceKm) {
  const carFactor = safeParseNumber($("#carFactor").value, DEFAULT_CAR_FACTOR);
  const kcalPerKm = safeParseNumber($("#kcalPerKm").value, DEFAULT_KCAL_PER_KM);

  const { drivingKg, savedKg, calories } = calculateImpact(distanceKm, carFactor, kcalPerKm);
  $("#drivingEmissions").textContent = formatKg(drivingKg);
  $("#co2Saved").textContent = formatKg(savedKg);
  $("#caloriesBurned").textContent = formatKcal(calories);

  // Mini stats on map card
  $("#co2SavedMini").textContent = formatKg(savedKg);
  $("#caloriesMini").textContent = formatKcal(calories);
}

function initCalculator() {
  const form = $("#calcForm");
  const distanceInput = $("#distanceKm");

  const initialDistance = safeParseNumber(distanceInput.value, ROUTE_KM_DEFAULT);
  updateCalculator(initialDistance);

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const km = safeParseNumber(distanceInput.value, ROUTE_KM_DEFAULT);
    updateCalculator(km);
  });

  ["change", "input"].forEach((evt) => {
    $("#carFactor").addEventListener(evt, () => updateCalculator(safeParseNumber(distanceInput.value, ROUTE_KM_DEFAULT)));
    $("#kcalPerKm").addEventListener(evt, () => updateCalculator(safeParseNumber(distanceInput.value, ROUTE_KM_DEFAULT)));
  });

  $("#useRouteDistanceBtn").addEventListener("click", () => {
    distanceInput.value = String(ROUTE_KM_DEFAULT);
    updateCalculator(ROUTE_KM_DEFAULT);
  });
}

// --- Page wiring
function initButtons() {
  $("#fitRouteBtn").addEventListener("click", () => fitRoute());
  $("#openFirstStopBtn").addEventListener("click", () => openSheet(0, { focus: true }));
  $("#heroStartBtn").addEventListener("click", () => {
    document.querySelector("#route")?.scrollIntoView({ behavior: "smooth", block: "start" });
    setTimeout(() => openSheet(0, { focus: false }), 400);
  });

  const openCalc = () => document.querySelector("#calculator")?.scrollIntoView({ behavior: "smooth", block: "start" });
  $("#heroCalcBtn").addEventListener("click", () => setTimeout(() => updateCalculator(safeParseNumber($("#distanceKm").value, ROUTE_KM_DEFAULT)), 0));
  $("#openCalculatorBtn").addEventListener("click", openCalc);

  $("#backToTopBtn").addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));

  // Sheet nav/close
  $("#sheetCloseBtn").addEventListener("click", () => closeSheet({ restoreFocusEl: $("#openFirstStopBtn") }));
  $("#scrim").addEventListener("click", () => closeSheet({ restoreFocusEl: $("#openFirstStopBtn") }));
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape" && $("#stopSheet").classList.contains("isOpen")) closeSheet({ restoreFocusEl: $("#openFirstStopBtn") });
  });

  $("#prevStopBtn").addEventListener("click", () => {
    if (currentStopIndex <= 0) return;
    openSheet(currentStopIndex - 1, { focus: false });
    focusStopOnMap(STOPS[currentStopIndex].id);
  });

  $("#nextStopBtn").addEventListener("click", () => {
    if (currentStopIndex >= STOPS.length - 1) return;
    openSheet(currentStopIndex + 1, { focus: false });
    focusStopOnMap(STOPS[currentStopIndex].id);
  });
}

function initRouteDistancePill() {
  $("#routeDistancePill").textContent = `~${ROUTE_KM_DEFAULT} km`;
  updateCalculator(ROUTE_KM_DEFAULT);
}

function hydrateMapMiniStats() {
  const { savedKg, calories } = calculateImpact(ROUTE_KM_DEFAULT, DEFAULT_CAR_FACTOR, DEFAULT_KCAL_PER_KM);
  $("#co2SavedMini").textContent = formatKg(savedKg);
  $("#caloriesMini").textContent = formatKcal(calories);
}

function boot() {
  renderStopCards();
  initMap();
  initCalculator();
  initButtons();
  initRouteDistancePill();
  hydrateMapMiniStats();
}

if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", boot);
} else {
  boot();
}

