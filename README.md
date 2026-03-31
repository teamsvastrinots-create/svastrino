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

## 🗄️ Backend & Database Architecture

The project now includes a backend infrastructure connected to **Supabase** (PostgreSQL) managed via SQLAlchemy.

### Connection
Database configuration is managed in `database.py` via an environment variable `DATABASE_URL` that connects the app via SQLAlchemy Engine.

### Existing Tables/Models
The following database tables have been defined in `models.py`:

- **`users`**: Manages user accounts (name, email, phone, free/paid status).
- **`psychometric_results`**: Stores the results from the psychometric tests (trait scores, matching careers, strengths, overall score).
- **`courses`**: Stores the core learning pathways and programs.
- **`course_enrollments`**: Associates users to courses and tracks their percentage progress.
- **`weeks`**: Sub-sections for courses to structure the progression path.
- **`tasks`**: Individual tasks (videos, worksheets, PDFs) belonging to a specific week.
- **`task_completions`**: Associates a user with completed tasks to track daily and weekly progress.
- **`webinars`**: Schedules upcoming live mentoring/webinar sessions.
- **`webinar_registrations`**: Connects users to webinars they have opted into.

