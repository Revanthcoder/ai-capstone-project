const form = document.getElementById('settings-form');
const statusEl = document.getElementById('status');
const resetBtn = document.getElementById('reset-btn');
const saveBtn = document.getElementById('save-btn');

function setStatus(message, type = '') {
  statusEl.textContent = message;
  statusEl.className = `status${type ? ` ${type}` : ''}`;
}

function populateForm(settings) {
  form.displayName.value = settings.displayName ?? '';
  form.email.value = settings.email ?? '';
  form.theme.value = settings.theme ?? 'system';
  form.language.value = settings.language ?? 'en';
  form.emailNotifications.checked = Boolean(settings.emailNotifications);
  form.aiAssistEnabled.checked = Boolean(settings.aiAssistEnabled);
}

async function loadSettings() {
  try {
    const response = await fetch('/api/settings');
    if (!response.ok) {
      throw new Error('Failed to load settings');
    }

    populateForm(await response.json());
  } catch {
    setStatus('Could not load settings.', 'error');
  }
}

form.addEventListener('submit', async (event) => {
  event.preventDefault();
  saveBtn.disabled = true;
  setStatus('Saving...');

  const payload = {
    displayName: form.displayName.value.trim(),
    email: form.email.value.trim(),
    theme: form.theme.value,
    language: form.language.value,
    emailNotifications: form.emailNotifications.checked,
    aiAssistEnabled: form.aiAssistEnabled.checked,
  };

  try {
    const response = await fetch('/api/settings', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      throw new Error('Failed to save settings');
    }

    populateForm(await response.json());
    setStatus('Settings saved.', 'success');
  } catch {
    setStatus('Could not save settings.', 'error');
  } finally {
    saveBtn.disabled = false;
  }
});

resetBtn.addEventListener('click', () => {
  loadSettings();
  setStatus('Changes discarded.');
});

loadSettings();
