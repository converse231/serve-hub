# ServeHub

A modern, mobile-first web application for church ministry scheduling and management. ServeHub helps church managers organize volunteers, create schedules, and manage song lyrics for worship services.

## Features

- 👥 **People Management** - Add and manage ministry members with multiple ministry assignments
- 📅 **Smart Scheduling** - Automated schedule generation with customizable rules
- 🎵 **Song Lyrics Database** - Manage worship songs with lyrics, chords, and metadata
- 📊 **Analytics Dashboard** - Track performance, detect conflicts, and balance workload
- 🎨 **Dark/Light Mode** - Beautiful theme switching
- 📱 **Mobile-First Design** - Optimized for mobile devices

## Tech Stack

- **Framework**: Next.js 16 with App Router
- **Language**: TypeScript (strict mode)
- **UI Components**: shadcn/ui (new-york style)
- **Styling**: Tailwind CSS 4
- **Icons**: Lucide React
- **Database**: Supabase (PostgreSQL) - *to be integrated later*
- **Authentication**: Supabase Auth - *to be integrated later*

## Development

Currently in **Frontend-Only Phase** using mock/dummy data. Backend integration will come later.

### Getting Started

```bash
# Install dependencies
npm install

# Run development server
npm run dev

# Build for production
npm run build

# Start production server
npm start
```

Open [http://localhost:3000](http://localhost:3000) to view the app.

## Project Structure

```
app/
├── (auth)/           # Auth routes (login, signup)
├── (dashboard)/      # Protected dashboard routes
├── layout.tsx
├── page.tsx
└── globals.css

components/
├── ui/               # shadcn components
├── layout/           # Layout components (nav, sidebar, header)
├── forms/            # Form components
├── schedule/         # Schedule-related components
├── people/           # People management components
├── calendar/         # Calendar components
├── lyrics/           # Song lyrics components
├── settings/         # Settings components
└── analytics/        # Analytics components

lib/
├── utils.ts          # Utility functions
├── types.ts          # TypeScript type definitions
├── data/             # Mock data for development
├── hooks/            # Custom React hooks
├── scheduler.ts      # Schedule generation algorithm
├── lineupGenerator.ts # Song lineup generation algorithm
├── analytics.ts      # Analytics utilities
└── conflictDetection.ts # Conflict detection utilities
```

## License

MIT
