/**
 * Svastrino Auth – Client-side Logic
 * Handles form validation, password visibility toggle, password strength meter, and toast notifications.
 */

// ──────────────────────────────────────────
// Toast Notification
// ──────────────────────────────────────────
function showToast(message, type = 'success') {
  const toast = document.getElementById('toast');
  if (!toast) return;
  toast.textContent = message;
  toast.className = 'toast ' + type;
  // trigger reflow
  void toast.offsetWidth;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3200);
}

// ──────────────────────────────────────────
// Password Visibility Toggle
// ──────────────────────────────────────────
function setupPasswordToggle(toggleId, inputId) {
  const toggle = document.getElementById(toggleId);
  const input = document.getElementById(inputId);
  if (!toggle || !input) return;

  toggle.addEventListener('click', () => {
    const isPassword = input.type === 'password';
    input.type = isPassword ? 'text' : 'password';
    toggle.textContent = isPassword ? '🙈' : '👁️';
  });
}

// ──────────────────────────────────────────
// Password Strength Meter (Sign Up only)
// ──────────────────────────────────────────
function evaluatePasswordStrength(password) {
  let score = 0;
  if (password.length >= 8) score++;
  if (/[A-Z]/.test(password)) score++;
  if (/[0-9]/.test(password)) score++;
  if (/[^A-Za-z0-9]/.test(password)) score++;
  return score; // 0-4
}

function setupPasswordStrength() {
  const passwordInput = document.getElementById('password');
  const strengthBars = document.querySelectorAll('#passwordStrength .bar');
  const strengthText = document.getElementById('strengthText');

  if (!passwordInput || !strengthBars.length || !strengthText) return;

  const labels = ['', 'Weak', 'Fair', 'Good', 'Strong'];
  const classes = ['', 'weak', 'medium', 'medium', 'strong'];

  passwordInput.addEventListener('input', () => {
    const value = passwordInput.value;
    const score = evaluatePasswordStrength(value);

    strengthBars.forEach((bar, i) => {
      bar.className = 'bar';
      if (i < score) {
        bar.classList.add('active', classes[score]);
      }
    });

    strengthText.textContent = value.length > 0 ? labels[score] || 'Too short' : '';
    strengthText.style.color =
      score <= 1 ? 'var(--error)' :
      score <= 2 ? '#f59e0b' :
      'var(--success)';
  });
}

// ──────────────────────────────────────────
// Email Validation Helper
// ──────────────────────────────────────────
function isValidEmail(email) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
}

// ──────────────────────────────────────────
// Sign In Form Handler
// ──────────────────────────────────────────
function setupSignInForm() {
  const form = document.getElementById('signinForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    // Validate
    if (!email || !password) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }

    // Simulate sign in
    const btn = document.getElementById('btnSignIn');
    btn.textContent = 'Signing in…';
    btn.disabled = true;

    setTimeout(() => {
      showToast('Signed in successfully! 🎉', 'success');
      btn.textContent = 'Sign In';
      btn.disabled = false;
    }, 1500);
  });
}

// ──────────────────────────────────────────
// Sign Up Form Handler
// ──────────────────────────────────────────
function setupSignUpForm() {
  const form = document.getElementById('signupForm');
  if (!form) return;

  form.addEventListener('submit', (e) => {
    e.preventDefault();

    const firstName = document.getElementById('firstName').value.trim();
    const lastName = document.getElementById('lastName').value.trim();
    const email = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;
    const confirmPassword = document.getElementById('confirmPassword').value;

    // Validate
    if (!firstName || !lastName || !email || !password || !confirmPassword) {
      showToast('Please fill in all fields.', 'error');
      return;
    }
    if (!isValidEmail(email)) {
      showToast('Please enter a valid email address.', 'error');
      return;
    }
    if (password.length < 8) {
      showToast('Password must be at least 8 characters.', 'error');
      return;
    }
    if (password !== confirmPassword) {
      showToast('Passwords do not match.', 'error');
      return;
    }

    // Simulate sign up
    const btn = document.getElementById('btnSignUp');
    btn.textContent = 'Creating account…';
    btn.disabled = true;

    setTimeout(() => {
      showToast('Account created successfully! 🎉', 'success');
      btn.textContent = 'Create Account';
      btn.disabled = false;
    }, 1500);
  });
}

// ──────────────────────────────────────────
// Social Button Handlers (placeholder)
// ──────────────────────────────────────────
function setupSocialButtons() {
  const googleBtn = document.getElementById('btnGoogle');
  const githubBtn = document.getElementById('btnGitHub');

  if (googleBtn) {
    googleBtn.addEventListener('click', () => {
      showToast('Google sign-in coming soon!', 'success');
    });
  }
  if (githubBtn) {
    githubBtn.addEventListener('click', () => {
      showToast('GitHub sign-in coming soon!', 'success');
    });
  }
}

// ──────────────────────────────────────────
// Input Focus Animations
// ──────────────────────────────────────────
function setupInputAnimations() {
  document.querySelectorAll('.form-group input').forEach((input) => {
    input.addEventListener('focus', () => {
      input.closest('.form-group').classList.add('focused');
    });
    input.addEventListener('blur', () => {
      input.closest('.form-group').classList.remove('focused');
    });
  });
}

// ──────────────────────────────────────────
// Init
// ──────────────────────────────────────────
document.addEventListener('DOMContentLoaded', () => {
  setupPasswordToggle('togglePassword', 'password');
  setupPasswordToggle('toggleConfirmPassword', 'confirmPassword');
  setupPasswordStrength();
  setupSignInForm();
  setupSignUpForm();
  setupSocialButtons();
  setupInputAnimations();
});
