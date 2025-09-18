# CryptoTracker Application

## Overview

CryptoTracker is a modern cryptocurrency tracking web application built with React, TypeScript, and Express.js. The application provides real-time cryptocurrency price monitoring, market statistics, and a clean dashboard interface for viewing cryptocurrency data. It features a responsive design with a dark theme, real-time data updates, and comprehensive market analytics.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **State Management**: TanStack Query (React Query) for server state management and caching
- **UI Components**: Custom component library built on Radix UI primitives with shadcn/ui styling
- **Styling**: Tailwind CSS with CSS variables for theming and responsive design
- **Build Tool**: Vite for fast development and optimized production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **API Design**: RESTful API with JSON responses
- **Data Storage**: In-memory storage with mock cryptocurrency data (MemStorage class)
- **Database ORM**: Drizzle ORM configured for PostgreSQL (schema defined but using mock data)
- **Development**: Hot module replacement and development server integration with Vite

### Data Layer
- **Schema**: Well-defined TypeScript schemas using Drizzle ORM and Zod validation
- **Models**: Cryptocurrency and MarketStats entities with proper typing
- **Storage Interface**: IStorage interface for abstraction between data sources
- **Mock Data**: Comprehensive mock cryptocurrency data for development and testing

### Component Architecture
- **Design System**: Consistent component library with variants and themes
- **Reusable Components**: Header, CryptoCard, MarketStats components with proper data binding
- **UI Library**: Extensive collection of UI primitives (buttons, cards, dialogs, forms, etc.)
- **Responsive Design**: Mobile-first approach with responsive breakpoints

### Development Features
- **Type Safety**: Full TypeScript coverage across frontend, backend, and shared schemas
- **Hot Reload**: Development server with automatic reloading
- **Code Organization**: Monorepo structure with shared types and clear separation of concerns
- **Error Handling**: Comprehensive error boundaries and API error handling

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: PostgreSQL database driver for Neon serverless database
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management and caching
- **express**: Web framework for Node.js backend

### UI and Styling
- **@radix-ui/***: Headless UI primitives for accessible components
- **tailwindcss**: Utility-first CSS framework
- **class-variance-authority**: Utility for creating component variants
- **lucide-react**: Icon library for consistent iconography

### Development Tools
- **vite**: Build tool and development server
- **typescript**: Type checking and compilation
- **esbuild**: Fast JavaScript bundler for production builds
- **tsx**: TypeScript execution for Node.js development

### Form and Validation
- **react-hook-form**: Form state management
- **@hookform/resolvers**: Form validation resolvers
- **drizzle-zod**: Schema validation integration

### Utilities
- **date-fns**: Date manipulation and formatting
- **clsx**: Conditional className utility
- **nanoid**: Unique ID generation
- **wouter**: Lightweight routing library