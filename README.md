# Svastrino

A modern authentication UI with Sign In and Sign Up pages.

## 🚀 How to Run Locally

After cloning the repo, open a terminal **inside the project folder** and run one of these commands:

### Option 1: Using Python (recommended)
```bash
python -m http.server 3000
```
Then open [http://localhost:3000](http://localhost:3000) in your browser.

### Option 2: Using Node.js (npx)
```bash
npx -y serve .
```
Then open the URL shown in the terminal.

### Option 3: Using PHP
```bash
php -S localhost:3000
```

> **⚠️ IMPORTANT:** Do **NOT** open the HTML files directly by double-clicking them (i.e., do not use `file:///`). Always use one of the commands above to start a local server first, then open the localhost URL in your browser.

> **⚠️ DO NOT** use XAMPP, WAMP, or IIS to serve this project. These servers may show a username/password popup. Use the simple commands above instead.

## 📁 Project Structure

```
svastrino/
├── index.html      ← Landing page (start here)
├── signin.html     ← Sign In page
├── signup.html     ← Sign Up page
├── style.css       ← Shared styles
├── app.js          ← Form logic & validation
└── README.md       ← This file
```

## 🔗 Pages

- **Landing Page** → `http://localhost:3000/`
- **Sign In** → `http://localhost:3000/signin.html`
- **Sign Up** → `http://localhost:3000/signup.html`
