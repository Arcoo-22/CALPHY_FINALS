<div align="center">

# Ignius

**An interactive physics learning platform for Temperature and Heat.**

</div>

---

## Introduction

Ignius is a web app that teaches the Temperature and Heat unit of physics through short lessons, hands-on simulations, and practice quizzes. Students can go through the topics at their own pace. Cinder, the built-in study assistant, answers questions about the course content, and the app keeps track of each student's progress along the way.

The course has nine lessons in four modules:

| Module | Lessons |
| --- | --- |
| Temperature & Heat | Temperature Scales · Heat and Temperature |
| How Heat Moves | Conduction · Convection and Radiation |
| Heat Calculations | Specific Heat Capacity · Calorimetry · Changes of State · Specific Latent Heat |
| Gases & Temperature | Gas Laws and Temperature |

## Features

- **Lessons**: Each lesson has an overview, learning objectives, key terms, worked examples, formulas, and a short video.
- **Interactive simulations**: Experiments such as a thermometer, a conduction rod, a heating curve of water, calorimetry, and a gas-law piston, each viewable in 2D or 3D.
- **Quizzes**: Five topic quizzes with instant feedback, plus quick check-in questions inside the lessons.
- **Formula sheet**: Every formula and physical constant from the course, collected on one page.
- **Cinder assistant**: A chat helper that answers questions using the course material, links to the relevant page, and works through supported calculations.
- **Progress dashboard**: Shows which lessons are finished, which are in progress, and how you did on quizzes.
- **Accounts or guest mode**: Students can sign up so their progress is saved to their account, or use the app as a guest and keep progress in the browser.
- **Site search**: Find any lesson, simulation, quiz, or formula from the navigation bar.
- **Mobile friendly**: Works on phones and tablets, and can be installed on the home screen like an app.

---

## Project Structure

```
CALPHY_FINALS/
├── README.md
└── temperature-and-heat/          # The web application
    ├── app/                       # Pages and API routes
    │   ├── api/                   # Server endpoints
    │   │   ├── assistant/         #   Cinder chat assistant
    │   │   ├── auth/              #   Login, logout, register, session
    │   │   ├── progress/          #   Save and load student progress
    │   │   ├── search/            #   Site-wide search
    │   │   └── users/             #   Account details
    │   ├── dashboard/             # Progress dashboard
    │   ├── formulas/              # Formula sheet
    │   ├── learn/                 # Learning home
    │   ├── lessons/[slug]/        # Individual lesson pages
    │   ├── quizzes/[slug]/        # Individual quiz pages
    │   ├── simulations/           # Simulation gallery
    │   ├── login/  register/      # Account pages
    │   └── layout.jsx  page.jsx   # App shell and landing page
    ├── components/                # Reusable interface pieces
    │   ├── simulations/           #   2D simulations
    │   └── sims/three/            #   3D simulations (Three.js)
    ├── lib/                       # Course content and helpers
    │   ├── lessons.js             #   Lesson text, formulas, examples
    │   ├── quizzes.js             #   Quiz questions
    │   ├── simulations.js         #   Simulation list
    │   ├── db.js                  #   Database connection
    │   └── auth.js                #   Login sessions
    ├── documentation/PostgreSQL/  # Database schema and setup notes
    ├── public/                    # Images and app icons
    ├── .env.example               # Template for environment settings
    └── package.json
```

## Installation

### Requirements

- [Node.js](https://nodejs.org) 20 or newer
- [PostgreSQL](https://www.postgresql.org) (optional; only needed for user accounts)

### Steps

1. **Clone the repository**

   ```bash
   git clone https://github.com/Arcoo-22/CALPHY_FINALS.git
   cd CALPHY_FINALS/temperature-and-heat
   ```

2. **Install dependencies**

   ```bash
   npm install
   ```

3. **Set up environment settings**

   Copy the template and fill in your own values:

   ```bash
   cp .env.example .env.local
   ```

   | Setting | Purpose | Required |
   | --- | --- | --- |
   | `DATABASE_URL` or `PGHOST`, `PGPORT`, `PGDATABASE`, `PGUSER`, `PGPASSWORD` | Connects to PostgreSQL for user accounts | No |
   | `SESSION_SECRET` | Secures login sessions; set a long random value | Recommended |
   | `GROQ_API_KEY` | Powers the Cinder assistant's written answers | No |
   | `GROQ_MODEL` | Picks the assistant's model (default: `openai/gpt-oss-20b`) | No |

   The app runs without any of these settings. Without a database, progress is saved in the browser. Without a Groq key, Cinder can still help with navigation, lesson previews, and supported calculations.

4. **Set up the database (optional)**

   Create a database named `db_users` with a `tbl_users` table. The table layout and setup steps are in [`temperature-and-heat/documentation/PostgreSQL/`](temperature-and-heat/documentation/PostgreSQL/).

5. **Start the app**

   ```bash
   npm run dev
   ```

   Then open [http://localhost:3000](http://localhost:3000) in your browser. After changing `.env.local`, restart the server.

## Commands

Run these from the `temperature-and-heat/` folder.

| Command | Description |
| --- | --- |
| `npm install` | Install all dependencies |
| `npm run dev` | Start the development server at `localhost:3000` |
| `npm run build` | Create an optimized production build |
| `npm start` | Run the production build |
| `npm run lint` | Check the code for common mistakes |

## Contributing

Do not push directly to `main`. Create a branch for your work instead.

- **Branch name format:** `[Username]-[Month/Day/Year]-[Version]`, for example `SetsuDesu17-10/5/2026-v1`
- **Stage only what you changed:** If you edited a single file, add only that file. Use `git add .` only when your changes span several folders.

```bash
git pull                              # when switching to an existing branch
git checkout -b [branchName]
git add [file or folder]
git commit -m "Describe your change"
git push -u origin [branchName]       # first push on a new branch
git push                              # later pushes to the same branch
```

---

## Tech Stack

| Area | Tools |
| --- | --- |
| Framework | [Next.js 16](https://nextjs.org) with [React 19](https://react.dev) |
| Styling | [Bootstrap 5](https://getbootstrap.com), [React Bootstrap](https://react-bootstrap.github.io), [Tailwind CSS 4](https://tailwindcss.com), Bootstrap Icons |
| 3D graphics | [Three.js](https://threejs.org) |
| Math display | [KaTeX](https://katex.org) with React Markdown |
| Database | [PostgreSQL](https://www.postgresql.org) via `node-postgres` |
| AI assistant | [Groq](https://groq.com) API |
| Code quality | ESLint, React Compiler |

---

<div align="center">

**Ignius**: Temperature and Heat, made interactive.

Built as a final project for Calculus-Based Physics.

</div>
