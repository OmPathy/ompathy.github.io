# OmPathy - AI-Driven HR Business Solutions

A professional corporate website for OmPathy/AMC International, showcasing cutting-edge HR business management through sentiment analysis and AI-driven solutions.

## Overview

OmPathy is a modern full-stack web application built with React and Express.js, focusing on revolutionizing HR business management through advanced AI technologies. The platform combines sentiment analysis, data analytics, and intelligent automation to enhance workplace efficiency and employee experience.

## Features

- **Professional Corporate Website** with 4 main pages
- **Responsive Design** optimized for all devices
- **AI-Driven Solutions** showcase
- **Contact Form** with backend processing
- **Modern UI/UX** with shadcn/ui components
- **Real-time Data Processing** capabilities

## Tech Stack

### Frontend
- React 18 with TypeScript
- Vite for fast development and builds
- Tailwind CSS for styling
- shadcn/ui component library
- Wouter for routing
- React Query for state management

### Backend
- Node.js with Express.js
- TypeScript
- Drizzle ORM with PostgreSQL
- Session management
- RESTful API design

## Pages

1. **Home** - Hero section with company overview and background
2. **Vision** - Company goals and focus areas
3. **Product** - OmPathy platform features and AI solutions
4. **About Us** - Company information and contact form

## Getting Started

### Prerequisites
- Node.js 20 or higher
- npm or yarn package manager

### Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/ompathy-website.git
cd ompathy-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
cp .env.example .env
# Edit .env with your database URL and other configurations
```

4. Start the development server:
```bash
npm run dev
```

The application will be available at `http://localhost:5000`

## Project Structure

```
├── client/                 # Frontend React application
│   ├── src/
│   │   ├── components/     # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── hooks/          # Custom React hooks
│   │   └── lib/            # Utility functions
├── server/                 # Backend Express application
│   ├── index.ts           # Main server file
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Database operations
│   └── vite.ts            # Development server setup
├── shared/                 # Shared types and schemas
└── attached_assets/        # Static assets and images
```

## Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run db:generate` - Generate database migrations
- `npm run db:migrate` - Run database migrations

## Environment Variables

```env
DATABASE_URL=your_postgresql_database_url
NODE_ENV=development
```

## Deployment

The application is configured for deployment on Replit but can be deployed to any Node.js hosting platform:

1. Vercel
2. Netlify
3. Railway
4. Heroku
5. DigitalOcean App Platform

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## Contact

**AMC International Co., Ltd**
- Website: [Your Website URL]
- Email: [Your Contact Email]

## Acknowledgments

- Built with modern web technologies
- Designed for enterprise-grade performance
- Focused on user experience and accessibility

---

© 2024 A.M.C International Co., Ltd. All rights reserved.