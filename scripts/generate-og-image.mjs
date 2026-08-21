import { execSync } from "child_process";
import fs from "fs";
import path from "path";

const htmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <style>
    * {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
    }
    body {
      width: 1200px;
      height: 630px;
      background: linear-gradient(135deg, #011C54 0%, #013089 50%, #0B192C 100%);
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", sans-serif;
      color: #FFFFFF;
      display: flex;
      flex-direction: column;
      justify-content: space-between;
      padding: 56px 64px;
      position: relative;
      overflow: hidden;
    }
    /* Subtle background watermark / grid pattern */
    .bg-pattern {
      position: absolute;
      top: 0;
      left: 0;
      right: 0;
      bottom: 0;
      background-image: 
        radial-gradient(circle at 100% 0%, rgba(254, 141, 1, 0.15) 0%, transparent 50%),
        radial-gradient(circle at 0% 100%, rgba(1, 48, 137, 0.3) 0%, transparent 60%),
        linear-gradient(rgba(255, 255, 255, 0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(255, 255, 255, 0.03) 1px, transparent 1px);
      background-size: 100% 100%, 100% 100%, 40px 40px, 40px 40px;
      pointer-events: none;
    }
    .top-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      z-index: 10;
    }
    .brand {
      display: flex;
      align-items: center;
      gap: 16px;
    }
    .brand-icon {
      width: 52px;
      height: 52px;
      background: linear-gradient(135deg, #FE8D01 0%, #E65100 100%);
      border-radius: 14px;
      display: flex;
      align-items: center;
      justify-content: center;
      box-shadow: 0 8px 24px rgba(254, 141, 1, 0.35);
      border: 2px solid rgba(255, 255, 255, 0.2);
    }
    .brand-icon svg {
      width: 32px;
      height: 32px;
      color: #FFFFFF;
    }
    .brand-text {
      display: flex;
      flex-direction: column;
    }
    .brand-name {
      font-size: 38px;
      font-weight: 900;
      letter-spacing: -0.5px;
      background: linear-gradient(180deg, #FFFFFF 0%, #E2E8F0 100%);
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      line-height: 1.1;
    }
    .brand-sub {
      font-size: 16px;
      font-weight: 700;
      color: #FE8D01;
      letter-spacing: 0.5px;
    }
    .verified-pill {
      display: flex;
      align-items: center;
      gap: 8px;
      background: rgba(16, 185, 129, 0.15);
      border: 1.5px solid rgba(16, 185, 129, 0.4);
      padding: 8px 18px;
      border-radius: 9999px;
      color: #34D399;
      font-size: 15px;
      font-weight: 700;
      letter-spacing: 0.3px;
    }
    .main-content {
      z-index: 10;
      margin-top: 10px;
    }
    .headline {
      font-size: 50px;
      font-weight: 800;
      line-height: 1.15;
      letter-spacing: -0.8px;
      max-width: 1020px;
      color: #FFFFFF;
    }
    .headline span {
      color: #FE8D01;
    }
    .description {
      font-size: 21px;
      color: #94A3B8;
      margin-top: 16px;
      max-width: 960px;
      line-height: 1.45;
      font-weight: 500;
    }
    .badges-row {
      display: flex;
      flex-wrap: wrap;
      gap: 12px;
      margin-top: 24px;
      z-index: 10;
    }
    .badge {
      background: rgba(255, 255, 255, 0.08);
      border: 1px solid rgba(255, 255, 255, 0.15);
      backdrop-filter: blur(8px);
      padding: 8px 16px;
      border-radius: 8px;
      font-size: 15px;
      font-weight: 600;
      color: #E2E8F0;
      display: flex;
      align-items: center;
      gap: 6px;
    }
    .badge.saffron {
      background: rgba(254, 141, 1, 0.15);
      border-color: rgba(254, 141, 1, 0.35);
      color: #FED7AA;
    }
    .footer-bar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-top: 1px solid rgba(255, 255, 255, 0.12);
      padding-top: 20px;
      z-index: 10;
    }
    .footer-sources {
      font-size: 15px;
      font-weight: 600;
      color: #64748B;
    }
    .footer-sources strong {
      color: #94A3B8;
    }
    .footer-url {
      font-size: 17px;
      font-weight: 800;
      color: #FE8D01;
      letter-spacing: 0.5px;
    }
  </style>
</head>
<body>
  <div class="bg-pattern"></div>
  
  <div class="top-bar">
    <div class="brand">
      <div class="brand-icon">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
          <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
        </svg>
      </div>
      <div class="brand-text">
        <div class="brand-name">SuchnaSetu</div>
        <div class="brand-sub">सूचनासेतु • Official Aggregator</div>
      </div>
    </div>
    <div class="verified-pill">
      <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
        <path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/>
        <path d="m9 12 2 2 4-4"/>
      </svg>
      100% Authentic Official Gazettes
    </div>
  </div>

  <div class="main-content">
    <h1 class="headline">
      Government Jobs, Exams, <span>Admit Cards</span> &amp; Answer Keys 2026
    </h1>
    <p class="description">
      Direct verified recruitment notifications, exam schedules, official syllabi &amp; merit results across 33 States, UPSC, SSC, Railways, PSCs &amp; Central PSUs.
    </p>
    <div class="badges-row">
      <div class="badge saffron">🏛️ Central &amp; State Jobs</div>
      <div class="badge">📅 Exam Calendars</div>
      <div class="badge">🎫 Admit Cards &amp; Hall Tickets</div>
      <div class="badge">🏆 Results &amp; Merit Lists</div>
      <div class="badge">🔑 Answer Keys</div>
      <div class="badge">📚 Official Syllabus</div>
    </div>
  </div>

  <div class="footer-bar">
    <div class="footer-sources">
      Verified Gateways: <strong>UPSC • SSC • State PSCs • High Courts • Railways • Banking</strong>
    </div>
    <div class="footer-url">
      suchnasetu.in
    </div>
  </div>
</body>
</html>`;

const tempHtmlPath = path.resolve("/tmp/og-template.html");
const outputDir = path.resolve("public/og");
const outputPath = path.resolve("public/og/suchnasetu-og.png");
const legacyOutputPath = path.resolve("public/og-image.png");

if (!fs.existsSync(outputDir)) {
  fs.mkdirSync(outputDir, { recursive: true });
}

fs.writeFileSync(tempHtmlPath, htmlContent);

console.log("Generating 1200x630 OG image with Headless Chrome...");

const chromePath = "/Applications/Google Chrome.app/Contents/MacOS/Google Chrome";
const command = `"${chromePath}" --headless --disable-gpu --screenshot="${outputPath}" --window-size=1200,630 --hide-scrollbars --default-background-color=00000000 "file://${tempHtmlPath}"`;

execSync(command, { stdio: "inherit" });

// Also copy to legacy path /public/og-image.png
fs.copyFileSync(outputPath, legacyOutputPath);

fs.unlinkSync(tempHtmlPath);

const stats = fs.statSync(outputPath);
console.log(`✅ OG Image generated successfully at ${outputPath} (${stats.size} bytes)`);
console.log(`✅ Legacy fallback created at ${legacyOutputPath}`);
