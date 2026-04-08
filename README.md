# 🐾 PetPal — FBLA 2025-2026 Competitive Project
### Topic: Virtual Pet (Financial Literacy / Intro to Programming)



PetPal is a virtual pet simulator built around **financial literacy**. Players earn, budget, and save in-game currency to keep their digital companion happy and healthy — turning abstract money concepts into an emotionally engaging, hands-on experience designed for middle and high school students.

---

## ✨ Features

| Feature | Description |
|---|---|
| **Reactive 3D Model** | Interactive Dog (Three.js/R3F) that reflects current **happiness, energy, and growth (age)** |
| **Financial Responsibility** | Integrated cost-of-care system with **budget limits, emergency expenses, and monthly reports** |
| **Trait Evolution** | Pets learn new tricks (Evolution History) as you interact and train them |
| **Categorized Ledger** | Detailed transaction history with **Food, Health, and Activity** expense categorization |
| **Educational Quizzes** | Built-in financial literacy test to earn bonus currency |
| **User Guidance** | Interactive "How to Play" system for a smooth educational experience |
| **Robust Validation** | Syntactic and semantic input validation to ensure high software quality standards |
| **Cloud Persistence** | Real-time Supabase sync for all pet stats, ledger items, and learned traits |

---

## 🛠️ Tech Stack

| Layer | Technology |
|---|---|
| **Framework** | [Next.js 16](https://nextjs.org/) (App Router) |
| **Language** | TypeScript 5 |
| **Styling** | Tailwind CSS v4 + shadcn/ui components |
| **3D Engine** | [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://drei.pmnd.rs/) + [Three.js](https://threejs.org/) |
| **Animations** | [Framer Motion](https://www.framer.com/motion/) + `@react-spring/three` |
| **Database / Auth** | [Supabase](https://supabase.com/) (PostgreSQL + Row-Level Security) |
| **AI Image Gen** | [Hugging Face Inference API](https://huggingface.co/inference-api) |
| **Icons** | [Lucide React](https://lucide.dev/) |

---

## 📁 Project Structure

```
state-26/
├── app/                      # Next.js App Router pages
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout & theme provider
│   ├── globals.css           # Global styles
│   ├── auth/                 # Authentication callback route
│   ├── login/                # Login page
│   ├── onboarding/           # Pet creation / onboarding flow
│   ├── dashboard/            # Main game dashboard
│   └── api/                  # API route handlers
├── components/
│   ├── DogModel.tsx          # 3D dog model (Three.js meshes + animations)
│   ├── HeroCanvas.tsx        # React Three Fiber canvas for the landing hero
│   ├── ThemeProvider.tsx     # next-themes provider wrapper
│   ├── ThemeToggle.tsx       # Dark/light mode toggle button
│   ├── dashboard/            # Dashboard-specific components
│   │   ├── ActionGrid.tsx    # Care action buttons (feed, play, etc.)
│   │   ├── ControlPanel.tsx  # Top-level game controls
│   │   ├── DashboardTopbar.tsx
│   │   ├── DashboardUserMenu.tsx
│   │   ├── PetDisplay.tsx    # AI-generated pet image display
│   │   ├── PetsModal.tsx     # Pet management modal
│   │   └── StatSidebar.tsx   # Health / happiness / coin stats
│   ├── game/                 # In-game overlay components
│   │   ├── OptionsOverlay.tsx
│   │   ├── QuizOverlay.tsx   # Financial literacy quizzes
│   │   ├── ShopOverlay.tsx   # In-game shop
│   │   └── StatsOverlay.tsx
│   ├── onboarding/           # Onboarding step components
│   └── ui/                   # shadcn/ui primitives (Button, Card, etc.)
├── lib/                      # Shared utilities and Supabase client
├── utils/                    # Helper functions
├── supabase/                 # Supabase migrations & types
├── public/                   # Static assets
└── .env.local                # Environment variables (not committed)
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js** ≥ 18
- A [Supabase](https://supabase.com/) project
- A [Hugging Face](https://huggingface.co/) account with API access

### 1. Clone the repository

```bash
git clone <repo-url>
cd state-26
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure environment variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
HUGGING_FACE_API_KEY=your_huggingface_api_key
```

### 4. Run the development server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

---

## 📜 Available Scripts

| Script | Description |
|---|---|
| `npm run dev` | Start the development server |
| `npm run build` | Build for production |
| `npm start` | Start the production server |
| `npm run lint` | Run ESLint |

---

## 🗄️ Database (Supabase)

The app uses Supabase for:
- **Authentication** — email/password sign-up and login
- **Pet data persistence** — pet name, stats (health, happiness, hunger, level, coins), and AI-generated image URL stored per user
- **Row-Level Security (RLS)** — users can only read/write their own pet data

Migrations and schema definitions live in the `supabase/` directory.

---

## 🎮 How to Play

1. **Sign up** and go through the onboarding flow to create and name your pet.
2. An **AI-generated image** of your pet is created via the Hugging Face API.
3. On the **Dashboard**, care for your pet by feeding, playing, and exercising it — each action costs in-game coins.
4. Complete **Financial Literacy Quizzes** to earn coins and XP, leveling up your pet.
5. Visit the **Shop** to buy items that boost your pet's stats.
6. Keep your pet's health, happiness, and hunger bars full to advance!

---

## 📄 License

© 2026 PetPal. All rights reserved.
