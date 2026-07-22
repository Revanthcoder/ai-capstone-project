import { useState } from 'react';
import './SettingsForm.css';

/**
 * Returns an error message when the name field is empty.
 * Trimming whitespace so spaces-only input is treated as empty.
 */
function validateName(name) {
  if (!name.trim()) {
    return 'Name cannot be empty.';
  }
  return '';
}

/**
 * Returns an error message when the email does not contain "@".
 */
function validateEmail(email) {
  if (!email.includes('@')) {
    return 'Email must contain @.';
  }
  return '';
}

/**
 * SettingsForm — a controlled form for user profile settings.
 * Validates name and email before allowing save.
 */
export default function SettingsForm({ onSave }) {
  // Controlled field values
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [theme, setTheme] = useState('light');
  const [notifications, setNotifications] = useState(false);

  // Track which fields the user has interacted with (for showing errors)
  const [touched, setTouched] = useState({ name: false, email: false });

  const nameError = validateName(name);
  const emailError = validateEmail(email);

  // Form is valid only when both validators return no error
  const isValid = !nameError && !emailError;

  const handleBlur = (field) => {
    setTouched((prev) => ({ ...prev, [field]: true }));
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    // Mark all fields touched so validation messages appear on submit attempt
    setTouched({ name: true, email: true });

    if (!isValid) {
      return;
    }

    if (onSave) {
      onSave({ name: name.trim(), email, theme, notifications });
    }
  };

  return (
    <form className="settings-form" onSubmit={handleSubmit} noValidate>
      <h2 className="settings-form__title">Settings</h2>

      {/* Name — required text input */}
      <div className="settings-form__field">
        <label htmlFor="settings-name">Name</label>
        <input
          id="settings-name"
          type="text"
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={() => handleBlur('name')}
          aria-invalid={touched.name && Boolean(nameError)}
          aria-describedby={touched.name && nameError ? 'name-error' : undefined}
        />
        {touched.name && nameError && (
          <p id="name-error" className="settings-form__error" role="alert">
            {nameError}
          </p>
        )}
      </div>

      {/* Email — must contain "@" */}
      <div className="settings-form__field">
        <label htmlFor="settings-email">Email</label>
        <input
          id="settings-email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          onBlur={() => handleBlur('email')}
          aria-invalid={touched.email && Boolean(emailError)}
          aria-describedby={touched.email && emailError ? 'email-error' : undefined}
        />
        {touched.email && emailError && (
          <p id="email-error" className="settings-form__error" role="alert">
            {emailError}
          </p>
        )}
      </div>

      {/* Theme — dropdown selection */}
      <div className="settings-form__field">
        <label htmlFor="settings-theme">Theme</label>
        <select
          id="settings-theme"
          value={theme}
          onChange={(event) => setTheme(event.target.value)}
        >
          <option value="light">Light</option>
          <option value="dark">Dark</option>
          <option value="system">System</option>
        </select>
      </div>

      {/* Notifications — boolean toggle */}
      <div className="settings-form__field settings-form__field--checkbox">
        <label htmlFor="settings-notifications">
          <input
            id="settings-notifications"
            type="checkbox"
            checked={notifications}
            onChange={(event) => setNotifications(event.target.checked)}
          />
          Notifications
        </label>
      </div>

      {/* Save stays disabled until name and email pass validation */}
      <button type="submit" className="settings-form__submit" disabled={!isValid}>
        Save
      </button>
    </form>
  );
}

// Exported for unit tests
export { validateName, validateEmail };
