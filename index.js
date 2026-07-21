const express = require('express');
const path = require('path');
const { readSettings, writeSettings } = require('./lib/settings');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

app.get('/', (_req, res) => {
  res.redirect('/settings.html');
});

app.get('/api/settings', (_req, res) => {
  res.json(readSettings());
});

app.post('/api/settings', (req, res) => {
  const { displayName, email, theme, language, emailNotifications, aiAssistEnabled } =
    req.body ?? {};

  const settings = writeSettings({
    displayName: typeof displayName === 'string' ? displayName : '',
    email: typeof email === 'string' ? email : '',
    theme: ['system', 'light', 'dark'].includes(theme) ? theme : 'system',
    language: ['en', 'es', 'fr'].includes(language) ? language : 'en',
    emailNotifications: Boolean(emailNotifications),
    aiAssistEnabled: Boolean(aiAssistEnabled),
  });

  res.json(settings);
});

app.listen(PORT, () => {
  console.log(`Server running at http://localhost:${PORT}`);
  console.log(`Open settings at http://localhost:${PORT}/settings.html`);
});
