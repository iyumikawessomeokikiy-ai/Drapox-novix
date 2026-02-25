const express = require('express');
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');

const app = express();
const PORT = process.env.PORT || 3000;
const SETTINGS_PATH = path.join(__dirname, 'data', 'settings.json');
const ADMIN_USERNAME = process.env.ADMIN_USERNAME || 'admin';
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD || 'change-me';
const FALLBACK_FONT_FAMILY = "'Segoe UI', sans-serif";
const FALLBACK_PRIMARY_COLOR = '#8e5a4b';
const FALLBACK_SECONDARY_COLOR = '#f7ede6';

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

function loadSettings() {
  const raw = fs.readFileSync(SETTINGS_PATH, 'utf-8');
  return JSON.parse(raw);
}

function saveSettings(settings) {
  fs.writeFileSync(SETTINGS_PATH, JSON.stringify(settings, null, 2), 'utf-8');
}

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

function sanitizeHexColor(color, fallback) {
  if (typeof color !== 'string') {
    return fallback;
  }

  const trimmed = color.trim();

  if (!/^#([A-Fa-f0-9]{3}|[A-Fa-f0-9]{6})$/.test(trimmed)) {
    return fallback;
  }

  return trimmed;
}

function safeCompare(actual, expected) {
  const actualBuffer = Buffer.from(actual || '', 'utf-8');
  const expectedBuffer = Buffer.from(expected || '', 'utf-8');

  if (actualBuffer.length !== expectedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(actualBuffer, expectedBuffer);
}

function rejectUnauthorized(res, message) {
  res.set('WWW-Authenticate', 'Basic realm="Admin Dashboard"');
  return res.status(401).send(message);
}

function requireAdminAuth(req, res, next) {
  const authHeader = req.headers.authorization || '';
  const [scheme, encoded] = authHeader.split(' ');

  if (scheme !== 'Basic' || !encoded) {
    return rejectUnauthorized(res, 'Authentication required.');
  }

  const credentials = Buffer.from(encoded, 'base64').toString('utf-8');
  const separatorIndex = credentials.indexOf(':');

  if (separatorIndex === -1) {
    return rejectUnauthorized(res, 'Invalid authentication credentials.');
  }

  const username = credentials.slice(0, separatorIndex);
  const password = credentials.slice(separatorIndex + 1);

  if (!safeCompare(username, ADMIN_USERNAME) || !safeCompare(password, ADMIN_PASSWORD)) {
    return rejectUnauthorized(res, 'Invalid username or password.');
  }

  next();
}

app.get('/', (req, res) => {
  const settings = loadSettings();
  const safeTheme = {
    primaryColor: sanitizeHexColor(settings.theme.primaryColor, FALLBACK_PRIMARY_COLOR),
    secondaryColor: sanitizeHexColor(settings.theme.secondaryColor, FALLBACK_SECONDARY_COLOR),
    fontFamily: sanitizeFontFamily(settings.theme.fontFamily)
  };

  res.render('invitation', { settings, safeTheme });
});

app.get('/admin', requireAdminAuth, (req, res) => {
  const settings = loadSettings();
  const success = req.query.success === '1';
  res.render('admin', { settings, success });
});

app.post('/admin/save', requireAdminAuth, (req, res) => {
  const previous = loadSettings();

  const story = (req.body.story || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const gallery = (req.body.gallery || '')
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);

  const next = {
    siteTitle: req.body.siteTitle || previous.siteTitle,
    headline: req.body.headline || previous.headline,
    heroMessage: req.body.heroMessage || previous.heroMessage,
    couple: {
      groomName: req.body.groomName || previous.couple.groomName,
      groomParents: req.body.groomParents || previous.couple.groomParents,
      brideName: req.body.brideName || previous.couple.brideName,
      brideParents: req.body.brideParents || previous.couple.brideParents
    },
    event: {
      akadDate: req.body.akadDate || previous.event.akadDate,
      akadTime: req.body.akadTime || previous.event.akadTime,
      resepsiDate: req.body.resepsiDate || previous.event.resepsiDate,
      resepsiTime: req.body.resepsiTime || previous.event.resepsiTime,
      venue: req.body.venue || previous.event.venue
    },
    theme: {
      primaryColor: sanitizeHexColor(req.body.primaryColor, previous.theme.primaryColor),
      secondaryColor: sanitizeHexColor(req.body.secondaryColor, previous.theme.secondaryColor),
      fontFamily: sanitizeFontFamily(req.body.fontFamily || previous.theme.fontFamily)
    },
    story: story.length ? story : previous.story,
    gallery: gallery.length ? gallery : previous.gallery,
    rsvp: {
      whatsappNumber: req.body.whatsappNumber || previous.rsvp.whatsappNumber,
      messageTemplate: req.body.messageTemplate || previous.rsvp.messageTemplate
    }
  };

  saveSettings(next);
  res.redirect('/admin?success=1');
});

app.listen(PORT, () => {
  console.log(`Server berjalan di http://localhost:${PORT}`);
});
