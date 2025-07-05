# OmPathy Application

## Overview

OmPathy is a modern full-stack web application built with React frontend and Express.js backend, focusing on HR business management through sentiment analysis and AI-driven solutions. The application serves as a corporate website showcasing the company's vision, products, and services while providing contact functionality.

## System Architecture

### Frontend Architecture
- **Framework**: React with TypeScript
- **Build Tool**: Vite for fast development and optimized builds
- **Routing**: Wouter for client-side routing
- **State Management**: React Query (TanStack Query) for server state management
- **UI Framework**: shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom design system and CSS variables

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **API Pattern**: RESTful API design
- **Development**: Hot reload with Vite integration in development mode
- **Session Management**: Express sessions with PostgreSQL store

### Database Architecture
- **ORM**: Drizzle ORM for type-safe database operations
- **Database**: PostgreSQL (configured for Neon Database)
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Connection**: Serverless database connection using @neondatabase/serverless

## Key Components

### Frontend Components
- **Layout System**: Header and Footer components with responsive navigation
- **UI Components**: Comprehensive shadcn/ui component library including forms, dialogs, cards, and navigation elements
- **Pages**: Home, Vision, Product, About, and 404 Not Found pages
- **State Management**: React Query for API calls and caching

### Backend Components
- **Route Handlers**: Centralized route registration system
- **Storage Layer**: Abstracted storage interface with in-memory implementation for development
- **Error Handling**: Global error middleware with proper HTTP status codes
- **Logging**: Request/response logging with performance metrics

### Shared Components
- **Schema Definitions**: Drizzle schema with Zod validation
- **Type Safety**: Shared TypeScript types between frontend and backend
- **Validation**: Input validation using Zod schemas

## Data Flow

1. **Client Requests**: React frontend makes API calls using React Query
2. **API Processing**: Express server processes requests through route handlers
3. **Data Validation**: Zod schemas validate incoming data
4. **Storage Operations**: Storage layer handles data persistence (currently in-memory, configured for PostgreSQL)
5. **Response Handling**: Structured JSON responses with error handling
6. **Client Updates**: React Query manages caching and UI updates

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL connection
- **drizzle-orm & drizzle-zod**: Type-safe ORM and validation
- **@tanstack/react-query**: Server state management
- **@radix-ui/***: Accessible UI primitives
- **tailwindcss**: Utility-first CSS framework
- **wouter**: Lightweight React router

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the stack
- **PostCSS**: CSS processing
- **ESBuild**: Fast bundling for production

## Deployment Strategy

### Development Environment
- **Development Server**: Vite dev server with HMR
- **API Integration**: Express server with Vite middleware
- **Database**: PostgreSQL connection via environment variables
- **Asset Handling**: Vite handles static assets and hot reloading

### Production Build
- **Frontend**: Vite builds optimized static assets
- **Backend**: ESBuild bundles Express server for production
- **Database**: PostgreSQL with Drizzle migrations
- **Environment**: Production configuration with NODE_ENV=production

### Configuration Management
- **Environment Variables**: DATABASE_URL for database connection
- **TypeScript Paths**: Absolute imports configured for better developer experience
- **Build Optimization**: Separate client and server builds with appropriate bundling

## Changelog
- July 05, 2025. Initial setup

## User Preferences

Preferred communication style: Simple, everyday language.