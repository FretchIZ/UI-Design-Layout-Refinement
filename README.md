# AI EDUCATION & ENGINEERING PLATFORM — UI Layout

An interactive AI-assisted learning and engineering interface built with React, Vite, and Tailwind CSS v4. Features a conversational AI tutor (Elice), neural network visualizations, voice interaction controls, and session memory management — all running inside Figma Make.

## Project Structure

```
UI Design Layout Refinement/
├── .figma/
│   └── make/
│       └── site.json                 # Figma Make site configuration
├── src/
│   ├── App.tsx                       # Main application component
│   ├── index.css                     # Global styles & Tailwind CSS v4 import
│   ├── main.tsx                      # React entry point
│   └── vite-env.d.ts                 # Vite type declarations
├── .gitignore
├── AGENTS.md                         # Agent instructions for AI coding assistants
├── CLAUDE.md
├── index.html                        # Vite HTML shell
├── package.json                      # Dependencies and scripts
├── pnpm-lock.yaml
├── tsconfig.json                     # TypeScript configuration
└── vite.config.ts                    # Vite build configuration
```

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | React 19 |
| Build Tool | Vite 8 |
| Styling | Tailwind CSS v4 (via `@tailwindcss/vite`) |
| Language | TypeScript 5.7 |
| Formatting | oxfmt |
| Deployment | Figma Make |

## Features

### AI Learning Companion (Elice)
- Conversational chat interface with agent/user message threading
- Auto-scroll and message timestamp tracking
- Real-time agent response simulation
- Microphone input and text-based chat

### Interactive Visualizations
- **Neural Network Graph**: SVG-based network diagram showing input, hidden, and output layers with connection lines and glow effects
- **Frequency Bars**: Real-time animated audio frequency visualization with 26-bar spectrum display
- **Lip Shape Visualizer**: SVG-based animated mouth shape that responds to speaking state

### Content Panels
- **Lesson Tab** (`visual` | `math` | `code`): Interactive lesson content including neural net visualization, mathematical equations, and code panel with syntax-highlighted Python backpropagation implementation
- **Memory**: Persistent session storage with categorized learning topics
- **Settings**: Voice model, language, response style, and theme configuration

### Voice Controls
- Tap-to-speak / listening toggle with pulse animation
- Frequency slider (10%–100%)
- Mute/unmute agent voice
- Real-time lip synchronization animation during speech

## Design System

### Color Palette

```css
--bg:        #07070f   /* Main background */
--sidebar:   #0b0b18   /* Sidebar background */
--panel:     #0e0e1c   /* Panel background */
--card:      #111120   /* Card background */
--border:    rgba(99, 102, 241, 0.12)
--primary:   #6366f1   /* Indigo primary */
--violet:    #8b5cf6   /* Violet accent */
--text:      #e2e0ff   /* Primary text */
--muted:     #7c7a9e   /* Muted text */
--dim:       #3a3a5a   /* Dim text / subtle elements */
```

### Typography
- **Headings & UI**: Outfit (sans-serif)
- **Code & Data**: JetBrains Mono (monospace)

## Getting Started

```bash
# Install dependencies
pnpm install

# Start development server (port 8443)
pnpm dev

# Build for production
pnpm build

# Preview production build
pnpm preview

# Format code
pnpm format
```

## Build Configuration

- `vite.config.ts`: Vite configured with React, Tailwind CSS v4, and Figma Make plugins. Includes `@` path alias to `src/` and custom Figma-specific plugins for site configuration, error overlay replay, and React refresh boundary fallback.
- `tsconfig.json`: TypeScript 5.7 with strict mode, ESNext modules, and bundler resolution.

## Environment

This project runs inside Figma Make, which provides the preview environment. The development server auto-starts on port 8443 with hot reload support.

## License

MIT
