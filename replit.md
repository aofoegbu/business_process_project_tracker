# Ogelo ProcessFlow - Project Management & Process Design Platform

## Overview

Ogelo ProcessFlow is a full-stack web application designed for comprehensive project management with specialized features for process design, requirements management, UAT testing, and cost analysis. The application provides an integrated platform for teams to manage complex business processes from conception to completion.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript
- **Routing**: Wouter for client-side navigation
- **State Management**: TanStack Query (React Query) for server state management
- **UI Framework**: Shadcn/ui components built on Radix UI primitives
- **Styling**: Tailwind CSS with custom CSS variables for theming
- **Build Tool**: Vite for development and production builds

### Backend Architecture
- **Runtime**: Node.js with Express.js framework
- **Language**: TypeScript with ES modules
- **Database**: PostgreSQL with Drizzle ORM
- **Database Provider**: Neon Database (serverless PostgreSQL)
- **API Style**: RESTful API endpoints

### Data Storage Solutions
- **Primary Database**: PostgreSQL via Neon Database serverless platform
- **ORM**: Drizzle ORM for type-safe database operations
- **Schema Management**: Drizzle Kit for migrations and schema management
- **Session Storage**: PostgreSQL-based sessions using connect-pg-simple

## Key Components

### Database Schema
The application manages six core entities:
- **Projects**: Main project containers with status, completion, and due dates
- **Team Members**: Project participants with roles and visual identifiers
- **Processes**: Business process definitions with Mermaid diagram support
- **Requirements**: Functional and non-functional requirements with priority tracking
- **Test Cases**: UAT test cases with execution tracking and results
- **Cost Items**: Budget tracking with planned vs actual cost analysis
- **Activities**: Project activity logging and timeline tracking

### Frontend Components
- **Dashboard**: Main application interface with tabbed navigation
- **Process Designer**: Visual process creation using Mermaid diagrams
- **Requirements Manager**: Comprehensive requirements tracking and management
- **UAT Manager**: Test case creation, execution, and reporting
- **Cost Analysis**: Budget planning and financial tracking

### API Layer
RESTful endpoints organized by resource:
- Project CRUD operations
- Team member management
- Process design and storage
- Requirements lifecycle management
- Test case execution tracking
- Cost item budgeting and analysis

## Data Flow

1. **Client Requests**: React components use TanStack Query for data fetching
2. **API Processing**: Express.js routes handle business logic and validation
3. **Database Operations**: Drizzle ORM manages PostgreSQL interactions
4. **Response Handling**: Type-safe data transfer using shared schemas
5. **State Management**: Client-side caching and optimistic updates via React Query

## External Dependencies

### Core Dependencies
- **@neondatabase/serverless**: Serverless PostgreSQL database connection
- **drizzle-orm**: Type-safe ORM for database operations
- **@tanstack/react-query**: Server state management
- **wouter**: Lightweight React router
- **zod**: Runtime type validation via drizzle-zod

### UI Dependencies
- **@radix-ui/***: Headless UI component primitives
- **tailwindcss**: Utility-first CSS framework
- **lucide-react**: Icon library
- **class-variance-authority**: Component variant management
- **cmdk**: Command palette functionality

### Development Tools
- **Vite**: Build tool and development server
- **TypeScript**: Type safety across the application
- **ESBuild**: Production bundling for server code

## Deployment Strategy

### Development Environment
- **Server**: Node.js with tsx for TypeScript execution
- **Client**: Vite development server with HMR
- **Database**: Neon Database with environment-based connection

### Production Build Process
1. **Client Build**: Vite bundles React application to `dist/public`
2. **Server Build**: ESBuild bundles Express server to `dist/index.js`
3. **Database**: Drizzle migrations applied via `drizzle-kit push`

### Configuration Management
- Environment variables for database connections
- Separate development and production configurations
- Path aliases for clean import statements

### Special Features
- **Replit Integration**: Custom plugins for development environment
- **Error Handling**: Runtime error overlay in development
- **Logging**: Request/response logging with performance metrics
- **CORS**: Configured for cross-origin requests in development

## Recent Changes (July 2025)

### Navigation & UI Fixes Completed
- **Header Navigation**: Fixed all navigation links with proper routing
- **New Project Button**: Implemented complete dialog functionality with form validation
- **Sidebar Navigation**: Added dynamic project list with real-time updates
- **Template System**: Created comprehensive process template library
- **Responsive Design**: Optimized for both mobile and desktop interfaces

### Business Process Mapper Enhancement
- **BPMN-Lite Support**: Full implementation with swimlanes, actions, and approvals
- **Mermaid.js Integration**: Advanced diagram rendering with real-time preview
- **Template Library**: Pre-built processes for onboarding, invoice approval, and system access
- **Export Capabilities**: Download and save functionality for process diagrams
- **Stakeholder Roles**: Defined swimlanes for department-specific workflows

### Project Tracker Features
- **Requirements Documentation**: Complete CRUD operations with auto-generated codes
- **Cost Analysis**: Budget vs actual tracking with visual indicators
- **Test Case Management**: Structured UAT scenarios with step-by-step instructions
- **Status Tracking**: Full lifecycle monitoring from draft to completion
- **PMP/IIBA Alignment**: Professional project management artifact support

### Process Designer Core Fixes (July 10, 2025)
- **Database Schema**: Fixed swimlanes data type issue preventing process creation
- **Process CRUD**: All create, read, update operations fully functional
- **Mermaid Editor**: Real-time diagram editing and saving operational
- **Scrollable Diagrams**: Added overflow containers to all diagram previews
- **Template Integration**: Use template workflow copies to clipboard and navigates properly
- **API Validation**: Process creation and updates tested and working

### Current Status
- **Application State**: Fully functional with all core features operational
- **Database**: 4 projects with comprehensive sample data, 4 processes created
- **Process Designer**: Complete CRUD operations, mermaid editing, template integration
- **UI Navigation**: All buttons, links, and interactive elements working correctly
- **API Endpoints**: Complete CRUD operations tested and validated
- **Performance**: Sub-100ms response times for most operations