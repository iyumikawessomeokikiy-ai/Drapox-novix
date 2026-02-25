const fs = require('fs');
const path = require('path');
const ejs = require('ejs');

const ROOT = path.join(__dirname, '..');
const SETTINGS_PATH = path.join(ROOT, 'data', 'settings.json');
const INVITATION_TEMPLATE_PATH = path.join(ROOT, 'views', 'invitation.ejs');
const DIST_DIR = path.join(ROOT, 'dist');
const DIST_CSS_DIR = path.join(DIST_DIR, 'css');
const SOURCE_CSS_DIR = path.join(ROOT, 'public', 'css');
const FALLBACK_FONT_FAMILY = "'Segoe UI', sans-serif";

function sanitizeFontFamily(fontFamily) {
  if (typeof fontFamily !== 'string') {
    return FALLBACK_FONT_FAMILY;
  }

  const trimmed = fontFamily.trim();

  if (!trimmed) {
    return FALLBACK_FONT_FAMILY;
  }

  const safeFontFamily = trimmed
    .replace(/[^a-zA-Z0-9\s,'"-]/g, '')
    .slice(0, 100);

  return safeFontFamily || FALLBACK_FONT_FAMILY;
}

function ensureCleanDir(dirPath) {
  fs.rmSync(dirPath, { recursive: true, force: true });
  fs.mkdirSync(dirPath, { recursive: true });
}

async function buildStaticSite() {
  const settings = JSON.parse(fs.readFileSync(SETTINGS_PATH, 'utf-8'));
  const safeFontFamily = sanitizeFontFamily(settings.theme.fontFamily);

  const invitationHtml = await ejs.renderFile(
    INVITATION_TEMPLATE_PATH,
    {
      settings,
      safeFontFamily,
      encodeURIComponent
    },
    {
      rmWhitespace: false
    }
  );

  const staticHtml = invitationHtml
    .replace(/href="\/css\//g, 'href="css/')
    .replace(
      /<a href="\/admin">Masuk ke Dashboard Admin<\/a>/,
      '<!-- Admin dashboard tersedia hanya untuk deployment Node.js runtime -->'
    );

  ensureCleanDir(DIST_DIR);
  fs.mkdirSync(DIST_CSS_DIR, { recursive: true });
  fs.cpSync(SOURCE_CSS_DIR, DIST_CSS_DIR, { recursive: true });
  fs.writeFileSync(path.join(DIST_DIR, 'index.html'), staticHtml, 'utf-8');
}

buildStaticSite()
  .then(() => {
    console.log('Static site generated in dist/.');
  })
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
