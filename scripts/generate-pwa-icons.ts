import fs from "fs";
import path from "path";

const newsDir = path.join(process.cwd(), "public/icons/news");
const adminDir = path.join(process.cwd(), "public/icons/admin");

if (!fs.existsSync(newsDir)) fs.mkdirSync(newsDir, { recursive: true });
if (!fs.existsSync(adminDir)) fs.mkdirSync(adminDir, { recursive: true });

// 1. News Icon (SuchnaSetu Blue with Newspaper / Broadcast Badge)
const newsSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="newsGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#0245C4" />
      <stop offset="100%" stop-color="#01246B" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#FCD34D" />
      <stop offset="100%" stop-color="#F59E0B" />
    </linearGradient>
    <filter id="shadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.35"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="112" fill="url(#newsGrad)"/>
  
  <!-- Outer Glow Ring -->
  <rect x="24" y="24" width="464" height="464" rx="88" fill="none" stroke="rgba(255,255,255,0.15)" stroke-width="4"/>

  <!-- News Emblem Card -->
  <g filter="url(#shadow)">
    <!-- Main Newspaper Body -->
    <rect x="100" y="116" width="312" height="280" rx="24" fill="#FFFFFF"/>
    
    <!-- Header Banner in Newspaper -->
    <rect x="124" y="144" width="264" height="44" rx="8" fill="#013089"/>
    <text x="140" y="174" fill="#FFFFFF" font-family="-apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif" font-weight="900" font-size="20" letter-spacing="3">SUCHNA NEWS</text>

    <!-- Top Story Image Placeholder / Graphic -->
    <rect x="124" y="204" width="124" height="96" rx="10" fill="#E2E8F0"/>
    <circle cx="160" cy="236" r="14" fill="#94A3B8"/>
    <path d="M128 290 L164 250 L196 280 L216 260 L244 290 Z" fill="#64748B"/>

    <!-- Story Lines -->
    <rect x="264" y="208" width="124" height="14" rx="4" fill="#0F172A"/>
    <rect x="264" y="232" width="124" height="10" rx="3" fill="#64748B"/>
    <rect x="264" y="250" width="104" height="10" rx="3" fill="#94A3B8"/>
    <rect x="264" y="268" width="116" height="10" rx="3" fill="#94A3B8"/>
    <rect x="264" y="286" width="80" height="10" rx="3" fill="#CBD5E1"/>

    <!-- Lower Newspaper Columns -->
    <rect x="124" y="316" width="124" height="8" rx="3" fill="#64748B"/>
    <rect x="124" y="332" width="124" height="8" rx="3" fill="#94A3B8"/>
    <rect x="124" y="348" width="90" height="8" rx="3" fill="#CBD5E1"/>

    <rect x="264" y="316" width="124" height="8" rx="3" fill="#64748B"/>
    <rect x="264" y="332" width="124" height="8" rx="3" fill="#94A3B8"/>
    <rect x="264" y="348" width="110" height="8" rx="3" fill="#CBD5E1"/>
  </g>

  <!-- Live Pulse Badge -->
  <g transform="translate(356, 92)" filter="url(#shadow)">
    <circle cx="28" cy="28" r="28" fill="url(#goldGrad)"/>
    <circle cx="28" cy="28" r="14" fill="#B45309"/>
    <circle cx="28" cy="28" r="8" fill="#FFFFFF"/>
  </g>
</svg>`;

// 2. Admin Icon (Deep Slate & Cobalt Shield with Control Gear)
const adminSvg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512" width="512" height="512">
  <defs>
    <linearGradient id="adminGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#1E293B" />
      <stop offset="100%" stop-color="#0A0E17" />
    </linearGradient>
    <linearGradient id="accentGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#38BDF8" />
      <stop offset="100%" stop-color="#2563EB" />
    </linearGradient>
    <filter id="adminShadow" x="-10%" y="-10%" width="130%" height="130%">
      <feDropShadow dx="0" dy="12" stdDeviation="16" flood-color="#000000" flood-opacity="0.6"/>
    </filter>
  </defs>

  <!-- Background -->
  <rect width="512" height="512" rx="112" fill="url(#adminGrad)"/>
  
  <!-- Outer Tech Border -->
  <rect x="24" y="24" width="464" height="464" rx="88" fill="none" stroke="rgba(56,189,248,0.25)" stroke-width="4"/>

  <!-- Admin Shield Body -->
  <g filter="url(#adminShadow)" transform="translate(256, 256)">
    <!-- Security Shield Outline -->
    <path d="M 0 -130 L 110 -80 C 110 50, 60 120, 0 150 C -60 120, -110 50, -110 -80 Z" fill="#0F172A" stroke="url(#accentGrad)" stroke-width="12" stroke-linejoin="round"/>
    
    <!-- Inner Core Pattern -->
    <path d="M 0 -105 L 85 -65 C 85 35, 45 95, 0 120 C -45 95, -85 35, -85 -65 Z" fill="rgba(37,99,235,0.15)"/>

    <!-- Operational Gear Symbol -->
    <g transform="scale(0.85)">
      <!-- Gear Center and Teeth -->
      <circle cx="0" cy="-5" r="48" fill="#1E293B" stroke="#38BDF8" stroke-width="8"/>
      
      <!-- Keyhole / Terminal Icon -->
      <circle cx="0" cy="-14" r="14" fill="#FFFFFF"/>
      <path d="M -8 -8 L 8 -8 L 12 16 L -12 16 Z" fill="#FFFFFF"/>
      
      <!-- Cross Bar Indicators -->
      <line x1="-70" y1="-5" x2="-48" y2="-5" stroke="#38BDF8" stroke-width="10" stroke-linecap="round"/>
      <line x1="48" y1="-5" x2="70" y2="-5" stroke="#38BDF8" stroke-width="10" stroke-linecap="round"/>
      <line x1="0" y1="-75" x2="0" y2="-53" stroke="#38BDF8" stroke-width="10" stroke-linecap="round"/>
      <line x1="0" y1="43" x2="0" y2="65" stroke="#38BDF8" stroke-width="10" stroke-linecap="round"/>
    </g>
  </g>

  <!-- Status Indicator Badge -->
  <g transform="translate(366, 92)" filter="url(#adminShadow)">
    <circle cx="24" cy="24" r="24" fill="#10B981"/>
    <circle cx="24" cy="24" r="10" fill="#FFFFFF"/>
  </g>
</svg>`;

// Write SVGs
fs.writeFileSync(path.join(newsDir, "icon.svg"), newsSvg);
fs.writeFileSync(path.join(newsDir, "icon-512x512.svg"), newsSvg);
fs.writeFileSync(path.join(newsDir, "icon-192x192.svg"), newsSvg);

fs.writeFileSync(path.join(adminDir, "icon.svg"), adminSvg);
fs.writeFileSync(path.join(adminDir, "icon-512x512.svg"), adminSvg);
fs.writeFileSync(path.join(adminDir, "icon-192x192.svg"), adminSvg);

// Copy base PNG fallback icons if available
const baseIcon = path.join(process.cwd(), "public/android-chrome-512x512.png");
const base192 = path.join(process.cwd(), "public/android-chrome-192x192.png");
const baseApple = path.join(process.cwd(), "public/apple-touch-icon.png");

if (fs.existsSync(baseIcon)) {
  fs.copyFileSync(baseIcon, path.join(newsDir, "icon-512x512.png"));
  fs.copyFileSync(baseIcon, path.join(newsDir, "icon-maskable-512x512.png"));
  fs.copyFileSync(baseIcon, path.join(adminDir, "icon-512x512.png"));
  fs.copyFileSync(baseIcon, path.join(adminDir, "icon-maskable-512x512.png"));
}
if (fs.existsSync(base192)) {
  fs.copyFileSync(base192, path.join(newsDir, "icon-192x192.png"));
  fs.copyFileSync(base192, path.join(newsDir, "icon-maskable-192x192.png"));
  fs.copyFileSync(base192, path.join(adminDir, "icon-192x192.png"));
  fs.copyFileSync(base192, path.join(adminDir, "icon-maskable-192x192.png"));
}
if (fs.existsSync(baseApple)) {
  fs.copyFileSync(baseApple, path.join(newsDir, "apple-touch-icon.png"));
  fs.copyFileSync(baseApple, path.join(adminDir, "apple-touch-icon.png"));
}

console.log("✓ PWA Icons Generated successfully for News and Admin portals.");
