import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SettingsForm, { validateName, validateEmail } from './SettingsForm.jsx';

describe('validateName', () => {
  it('returns an error when name is empty', () => {
    expect(validateName('')).toBe('Name cannot be empty.');
    expect(validateName('   ')).toBe('Name cannot be empty.');
  });

  it('returns no error when name has content', () => {
    expect(validateName('Jane')).toBe('');
  });
});

describe('validateEmail', () => {
  it('returns an error when email does not contain @', () => {
    expect(validateEmail('invalid-email')).toBe('Email must contain @.');
  });

  it('returns no error when email contains @', () => {
    expect(validateEmail('user@example.com')).toBe('');
  });
});

describe('SettingsForm', () => {
  it('renders all fields and a disabled Save button initially', () => {
    render(<SettingsForm />);

    expect(screen.getByLabelText(/name/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/email/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/theme/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/notifications/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /save/i })).toBeDisabled();
  });

  it('shows validation messages after fields are touched', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.click(screen.getByLabelText(/name/i));
    await user.tab();

    expect(screen.getByText('Name cannot be empty.')).toBeInTheDocument();

    await user.click(screen.getByLabelText(/email/i));
    await user.tab();

    expect(screen.getByText('Email must contain @.')).toBeInTheDocument();
  });

  it('enables Save when name and email are valid', async () => {
    const user = userEvent.setup();
    render(<SettingsForm />);

    await user.type(screen.getByLabelText(/name/i), 'Alex');
    await user.type(screen.getByLabelText(/email/i), 'alex@example.com');

    expect(screen.getByRole('button', { name: /save/i })).toBeEnabled();
  });

  it('calls onSave with form values when submitted', async () => {
    const user = userEvent.setup();
    const onSave = vi.fn();
    render(<SettingsForm onSave={onSave} />);

    await user.type(screen.getByLabelText(/name/i), 'Alex');
    await user.type(screen.getByLabelText(/email/i), 'alex@example.com');
    await user.selectOptions(screen.getByLabelText(/theme/i), 'dark');
    await user.click(screen.getByLabelText(/notifications/i));
    await user.click(screen.getByRole('button', { name: /save/i }));

    expect(onSave).toHaveBeenCalledWith({
      name: 'Alex',
      email: 'alex@example.com',
      theme: 'dark',
      notifications: true,
    });
  });
});
