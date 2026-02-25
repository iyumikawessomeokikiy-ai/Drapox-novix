const express = require('express');
const path = require('path');
const fs = require('fs');

const app = express();
const PORT = process.env.PORT || 3000;
const SETTINGS_PATH = path.join(__dirname, 'data', 'settings.json');

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

app.get('/', (req, res) => {
  const settings = loadSettings();
  res.render('invitation', { settings });
});

app.get('/admin', (req, res) => {
  const settings = loadSettings();
  const success = req.query.success === '1';
  res.render('admin', { settings, success });
});

app.post('/admin/save', (req, res) => {
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
      primaryColor: req.body.primaryColor || previous.theme.primaryColor,
      secondaryColor: req.body.secondaryColor || previous.theme.secondaryColor,
      fontFamily: req.body.fontFamily || previous.theme.fontFamily
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
