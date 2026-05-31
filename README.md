# PCM Study Platform

A professional, production-quality study management platform designed for Physics, Chemistry, and Mathematics (PCM) subjects. Built with modern web technologies, this platform focuses on active recall, spaced repetition, and comprehensive performance analytics.

## Overview

The PCM Study Platform is inspired by Linear, Notion, Anki, and GitHub Insights, providing a distraction-free, information-dense interface optimized for long study sessions. The platform implements industry-standard learning techniques including spaced repetition, active recall, and detailed performance tracking.

## Key Features

### 📊 Dashboard
- Overview of daily study metrics (questions due, flashcards due, study time)
- Weekly study activity charts
- Subject distribution visualization
- Performance trend analysis
- Quick access to start study sessions

### 📚 Study Catalog
- Hierarchical organization of study materials by subject, topic, and difficulty level
- Collapsible tree navigation for easy browsing
- Question count and difficulty distribution display
- Support for Physics, Chemistry, and Mathematics materials
- Search functionality for quick topic location

### 🧠 Theory Practice (Anki-style Flashcards)
- Spaced repetition flashcard review system
- Four-button response system (Again, Hard, Good, Easy)
- Session progress tracking
- Response distribution statistics
- Distraction-free card interface

### ❓ Question Practice
- **Setup Page**: Configure practice sessions with:
  - Customizable session duration and time-per-question targets
  - Subject, source, and difficulty filters
  - Estimated question count calculation
  
- **Active Practice Page**: Focused question-solving interface featuring:
  - Large timer display (pause/resume functionality)
  - Question metadata (source, chapter, concepts, difficulty)
  - Response tracking (Solved Fast, Solved Slow, Failed, Skipped)
  - Post-submission feedback modal with confidence rating, error type, and question type classification

### 📈 Statistics & Analytics
- Daily study time visualization
- Questions attempted tracking
- Accuracy trend analysis
- Average solve time by difficulty
- Weakest chapters identification
- Error analysis with breakdown by error type
- Comprehensive date range filtering

### ⚙️ Settings
- Theme selection (Light/Dark)
- Study preferences (default session time, auto-start timer)
- Notification preferences
- Data import/export functionality
- Account management

## Design System

### Color Palette
- **Background**: Dark charcoal (#1F1F2E)
- **Cards**: Slightly lighter charcoal (#2D2D3D)
- **Primary Accent**: Soft blue (#7A6EE8)
- **Success**: Muted green (#65B741)
- **Warning**: Muted amber (#F59E0B)
- **Failure**: Muted red (#EF5350)
- **Text**: Light off-white (#F2F2F7)

### Typography
- **Font Family**: Geist (modern sans-serif)
- **Headings**: Bold with clear hierarchy
- **Body Text**: Optimized for comfortable reading with 1.4-1.6 line-height

### Components
- Consistent card-based layout with subtle borders
- Rounded corners (0.625rem default radius)
- Smooth transitions and hover states
- Information-dense tables and data displays
- Accessible focus states with ring highlights

## Project Structure

```
src/
├── app/                      # Next.js routes (thin page wrappers)
├── components/
│   ├── layout/               # AppShell, Sidebar, TopNav
│   └── ui/                   # Shared shadcn/ui primitives
├── features/
│   ├── dashboard/
│   ├── catalog/
│   ├── flashcards/           # Theory practice (Anki-style)
│   ├── practice/             # Question practice setup & active session
│   ├── statistics/
│   └── settings/
├── db/
│   ├── prisma/               # Prisma client (when persistence is added)
│   ├── repositories/         # Data access layer
│   └── schema/               # Shared DB entity types
├── lib/
│   ├── analytics/            # Accuracy, study time, weakness detection
│   ├── scheduling/           # SRS, question selection, mastery
│   ├── validation/
│   └── utils.ts
├── hooks/                    # Shared React hooks
├── types/                    # Centralized TypeScript types
├── services/                 # Feature orchestration services
└── constants/                # Navigation, practice filters, chart theme
```

Routes remain at `/`, `/cataloging`, `/theory-practice`, `/question-practice`, `/question-practice/active`, `/statistics`, and `/settings`.

## Technical Stack

- **Framework**: Next.js 16 (App Router)
- **Styling**: Tailwind CSS with custom dark theme
- **Charts**: Recharts for data visualization
- **Icons**: Lucide React
- **UI Components**: shadcn/ui
- **State Management**: React hooks (useState)
- **Font**: Next.js Font Optimization with Geist

## Getting Started

### Prerequisites
- Node.js 18+
- pnpm (package manager)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd pcm-study-platform
```

2. Install dependencies:
```bash
pnpm install
```

3. Run the development server:
```bash
pnpm dev
```

4. Open [http://localhost:3000](http://localhost:3000) in your browser.

## Features in Detail

### Dashboard
The dashboard provides at-a-glance metrics and motivational feedback:
- **Questions Due Today**: Adaptive review queue
- **Flashcards Due Today**: Spaced repetition scheduling
- **Study Time This Week**: Progress tracking with comparisons
- **Accuracy Rate**: Overall performance metric
- **Charts**: Weekly activity, subject distribution, and performance trends

### Cataloging System
The hierarchical catalog supports complex subject structures:
- **Three-level hierarchy**: Subject → Topic → Level
- **Metadata display**: Question counts, difficulty distribution, tags
- **Actions**: Quick access to practice and edit controls
- **Search**: Filter topics by name or content

### Theory Practice Interface
Implements proven Anki spaced repetition methodology:
- **Card Design**: Clean, centered layout with flip animation
- **Response Options**: Graduated difficulty scaling (Again, Hard, Good, Easy)
- **Progress Tracking**: Visual session progress indicator
- **Statistics**: Response distribution for session analysis

### Question Practice System
Two-phase practice workflow for comprehensive learning:
1. **Configuration Phase**: Set session parameters and filters
2. **Execution Phase**: Solve questions with timer and detailed feedback

### Active Practice Interface
The most important screen, designed for focus and efficiency:
- **Metadata Panel**: Source, chapter, concepts, difficulty at a glance
- **Large Timer**: Clear, readable countdown with pause/resume
- **Solution Area**: Dedicated space for problem-solving
- **Response Buttons**: Fast, accurate categorization of outcomes
- **Feedback Modal**: Capture confidence, error type, and question classification

### Analytics Dashboard
Comprehensive performance analysis:
- **Metrics**: Study time, attempts, reviews, accuracy, solve time
- **Visualizations**: Multiple chart types for different data perspectives
- **Weak Areas**: Identification of chapters and concepts needing focus
- **Error Analysis**: Breakdown of mistake types for targeted improvement

## Performance Considerations

- **Information-Dense**: Maximum data visibility without clutter
- **Fast Navigation**: Quick sidebar access to all major sections
- **Responsive Layouts**: Desktop-first design optimized for large monitors
- **Smooth Interactions**: Transitions and animations enhance rather than distract
- **Dark Theme**: Reduces eye strain during long study sessions

## Future Enhancements

Potential additions to the platform:
- User authentication and data persistence
- Real-time sync across devices
- Collaborative study features
- Custom question creation and editing
- Advanced ML-based recommendation system
- Mobile app with offline support
- Integration with popular test prep resources

## Contributing

This is a demonstration of professional UI design and component architecture. The project serves as a template for building production-ready study platforms.

## License

MIT License - feel free to use this design system and component architecture for your projects.

---

**Built with precision for serious learners** - The PCM Study Platform provides a distraction-free environment optimized for active recall, spaced repetition, and measurable academic progress.
