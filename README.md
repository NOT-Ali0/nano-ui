# NANO

A modern, polished Svelte frontend for the NANO Platform - an AI-powered OCR service that extracts text from images.

## Features

- 🎨 **Modern UI** - Built with Svelte 5, Tailwind CSS, and custom components with beautiful animations
- 🌓 **Dark Mode** - Full light/dark theme support with smooth transitions
- 📱 **Responsive** - Works seamlessly on mobile, tablet, and desktop
- 🔐 **Authentication** - Secure user authentication with JWT tokens
- 📊 **Dashboard** - Comprehensive usage analytics, metrics, and upload history
- 💳 **Subscriptions** - Stripe integration for Pro plans (Monthly & Yearly)
- 🔑 **API Keys** - API access management for Pro users
- 📤 **OCR Upload** - Drag-and-drop file upload with real-time processing
- ✨ **Animations** - Smooth typing effects and UI transitions
- ⚡ **Fast** - Optimized performance with SvelteKit

## Tech Stack

- **Framework**: SvelteKit 2.x with Svelte 5 (using runes)
- **Styling**: Tailwind CSS 3.x with custom design system
- **UI Components**: Custom components with ShineBorder, ShimmerButton, and AnimatedLabel effects
- **HTTP Client**: Axios with interceptors for auth
- **Animations**: @motionone/svelte for smooth animations
- **Icons**: lucide-svelte
- **TypeScript**: Full type safety throughout
- **State Management**: Svelte stores (auth, usage, theme)

## Project Structure

```
src/
├── lib/
│   ├── api/
│   │   ├── client.ts          # API client with Axios interceptors
│   │   ├── index.ts           # API exports
│   │   └── mockClient.ts      # Mock API client (optional)
│   ├── components/
│   │   ├── dashboard/         # Dashboard components
│   │   │   ├── ApiKeyManager.svelte
│   │   │   ├── HistoryTable.svelte
│   │   │   └── MetricCard.svelte
│   │   ├── layout/            # Layout components
│   │   │   ├── Navbar.svelte
│   │   │   └── Footer.svelte
│   │   ├── ui/                # Reusable UI components
│   │   │   ├── Button.svelte
│   │   │   ├── Card.svelte
│   │   │   ├── Input.svelte
│   │   │   ├── Modal.svelte
│   │   │   └── ShineBorder.svelte
│   │   ├── UploadArea.svelte  # File upload component
│   │   └── OcrResultPanel.svelte
│   ├── stores/                # Svelte stores
│   │   ├── authStore.ts       # Authentication state
│   │   ├── usageStore.ts      # Usage metrics state
│   │   └── themeStore.ts      # Theme preferences
│   └── utils.ts               # Utility functions
├── routes/
│   ├── +layout.svelte         # Root layout
│   ├── +page.svelte           # Landing page
│   ├── auth/                  # Authentication
│   │   ├── +page.svelte
│   │   ├── AnimatedLabel.svelte
│   │   ├── ShimmerButton.svelte
│   │   └── ShineBorder.svelte
│   ├── upload/                # OCR upload page
│   │   └── +page.svelte
│   ├── dashboard/             # User dashboard
│   │   └── +page.svelte
│   ├── pricing/               # Pricing plans
│   │   └── +page.svelte
│   └── docs/                  # API documentation
│       └── +page.svelte
└── app.css                    # Global styles and Tailwind
```

## Getting Started

### Prerequisites

- Node.js 18+ and npm (or yarn/pnpm)
- Backend API running (Laravel or compatible API)

### Installation

1. Clone the repository:
```bash
git clone <repository-url>
cd NANO
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the root directory:
```env
VITE_API_BASE_URL=http://localhost:8000/api
VITE_USE_MOCK_API=false
```

4. Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

```bash
npm run build
npm run preview
```

The build output will be in the `build/` directory.

## Configuration

### Environment Variables

Create a `.env` file in the root directory with the following variables:

```env
# API Configuration
VITE_API_BASE_URL=http://localhost:8000/api

# Optional: Use mock API for development/testing
VITE_USE_MOCK_API=false
```

**Development:**
```env
VITE_API_BASE_URL=http://localhost:8000/api
```

**Production:**
```env
VITE_API_BASE_URL=https://api.yourdomain.com/api
```

### Mock API

For development and testing, you can enable the mock API by setting `VITE_USE_MOCK_API=true`. This allows you to test the frontend without a running backend.

## Routes

- `/` - Landing page with features, benefits, and call-to-action
- `/auth` - Sign in / Sign up page with animated form elements
- `/upload` - OCR image upload with drag-and-drop (protected route)
- `/dashboard` - User dashboard with metrics, history, and API keys (protected route)
- `/pricing` - Subscription plans comparison
- `/docs` - API documentation for Pro users

## Features Overview

### Authentication
- Sign up / Sign in with email and password
- JWT token storage in localStorage
- Automatic authentication state management
- Protected routes with automatic redirects
- Mock authentication support for development
- Beautiful animated form labels and buttons

### OCR Upload
- Drag-and-drop file upload interface
- File validation (PNG, JPG, PDF, max 10MB)
- Real-time OCR processing with loading states
- Typing animation for extracted text results
- Copy to clipboard functionality
- Edit extracted text before saving
- Usage limit tracking and warnings

### Dashboard
- **Metrics Cards:**
  - Uploads this month (with limit indicator)
  - Remaining uploads
  - Average confidence score
  - Current plan status
- **Upload History Table:**
  - Full history for Pro users
  - Limited history (5 most recent) for Free users
  - Job details and timestamps
- **API Key Management** (Pro users only):
  - Create, view, and delete API keys
  - Label management for keys
- Quick action buttons for common tasks

### Pricing Plans
- **Free Plan:**
  - 5 uploads per month
  - Basic OCR accuracy
  - Limited history (5 most recent)
  - Email support
  
- **Pro Monthly ($9.99/month):**
  - 200 uploads per month
  - Higher accuracy / better model
  - Full upload history
  - API key access
  - Dashboard analytics
  - Priority support
  
- **Pro Yearly ($99.99/year):**
  - 200 uploads per month
  - 50 bonus tokens per year
  - Higher accuracy / better model
  - Full upload history
  - API key access
  - Dashboard analytics
  - Priority support
  - Save 17% vs monthly

- Stripe checkout integration for seamless payments

## API Integration

The frontend communicates with a backend API (Laravel or compatible). Ensure your backend implements these endpoints:

### Authentication Endpoints
- `POST /api/auth/signup` - User registration
- `POST /api/auth/login` - User login
- `POST /api/auth/logout` - User logout
- `GET /api/auth/me` - Get current user info

### OCR Endpoints
- `POST /api/ocr` - Process image/file for OCR (multipart/form-data)
  - Request: `{ file: File }`
  - Response: `{ text: string, confidence: number, job_id: string }`

### Subscription Endpoints
- `POST /api/subscription/checkout` - Create Stripe checkout session
  - Request: `{ plan_type: 'PRO_MONTHLY' | 'PRO_YEARLY' }`
  - Response: `{ checkout_url: string }`
- `GET /api/subscription/status` - Get subscription status

### Dashboard Endpoints
- `GET /api/dashboard/overview` - Get dashboard metrics
  - Response: `{ uploads_this_month, remaining_uploads, monthly_limit, average_confidence, last_upload_at }`
- `GET /api/dashboard/history` - Get upload history
  - Query params: `page`, `per_page`
- `GET /api/dashboard/chart` - Get chart data (optional)

### API Keys Endpoints (Pro users only)
- `POST /api/api-keys` - Create new API key
  - Request: `{ label?: string }`
- `GET /api/api-keys` - List all API keys
- `DELETE /api/api-keys/{id}` - Delete API key

### Authentication
All protected endpoints require a Bearer token in the Authorization header:
```
Authorization: Bearer <jwt_token>
```

The API client automatically includes the token from localStorage for authenticated requests.

## Styling

The project uses Tailwind CSS 3.x with a custom design system:

- **CSS Variables** for theming (colors, spacing, etc.)
- **Dark Mode** support via `class` strategy
- **Responsive Breakpoints**: sm (640px), md (768px), lg (1024px)
- **Color Palette**: 
  - Primary colors (cyan/blue theme)
  - Secondary colors
  - Destructive colors (for errors)
  - Muted foreground colors
- **Custom Components**: ShineBorder, ShimmerButton, AnimatedLabel with CSS animations
- **Tailwind Plugins**: Forms and Typography plugins included

## Development

### Available Scripts

```bash
# Start development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview

# Type checking
npm run check

# Type checking in watch mode
npm run check:watch
```

### Code Structure

- **Components**: Organized by feature/type (dashboard, layout, ui)
- **Stores**: Global state management (auth, usage, theme)
- **API Client**: Centralized backend communication with Axios interceptors
- **Route Guards**: Protected routes with automatic redirects
- **TypeScript**: Full type safety with strict mode

### Development Tips

1. **Mock API**: Enable `VITE_USE_MOCK_API=true` to test without backend
2. **Hot Reload**: SvelteKit provides instant HMR during development
3. **Type Safety**: Run `npm run check` regularly to catch type errors
4. **State Management**: Use Svelte stores for global state, local state for components

## Dependencies

### Production Dependencies
- `@motionone/svelte` - Animation library for smooth UI transitions
- `axios` - HTTP client for API requests
- `clsx` - Utility for constructing className strings
- `lucide-svelte` - Icon library
- `tailwind-merge` - Utility for merging Tailwind classes

### Development Dependencies
- `@sveltejs/adapter-auto` - Auto-detect deployment adapter
- `@sveltejs/kit` - SvelteKit framework
- `@sveltejs/vite-plugin-svelte` - Vite plugin for Svelte
- `@tailwindcss/forms` - Tailwind forms plugin
- `@tailwindcss/typography` - Tailwind typography plugin
- `autoprefixer` - CSS autoprefixer
- `postcss` - CSS post-processor
- `svelte` - Svelte framework (v5)
- `svelte-check` - Type checking for Svelte
- `tailwindcss` - Tailwind CSS framework
- `typescript` - TypeScript compiler
- `vite` - Build tool and dev server

## Deployment

### Static Hosting (Vercel, Netlify, Cloudflare Pages)

1. Connect your repository to the hosting platform
2. Set environment variables:
   - `VITE_API_BASE_URL` - Your production API URL
   - `VITE_USE_MOCK_API` - Set to `false` for production
3. Configure build settings:
   - Build command: `npm run build`
   - Output directory: `build`
4. Deploy

### Build Output

The build creates a static site in the `build/` directory that can be served by any static host. The adapter will automatically detect your deployment platform.

### Environment Variables in Production

Make sure to set all required environment variables in your hosting platform's dashboard before deploying.

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run type checking: `npm run check`
5. Test your changes
6. Submit a pull request

## License

[Your License Here]
