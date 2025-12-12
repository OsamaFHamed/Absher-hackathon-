# Wathiq App

## Overview

Wathiq is a document verification and registry application built with React. The application enables users to register official documents, verify their authenticity, and browse a public registry of registered documents. It features a bilingual interface with RTL (Right-to-Left) support for Arabic, styled with Tailwind CSS and Saudi-themed design elements.

The application acts as a frontend client that communicates with a backend API service for document registration, verification, revocation, and registry management.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Framework**: React (v19.2.0) with Create React App  
The application uses a standard React setup bootstrapped with Create React App, providing a modern single-page application (SPA) experience.

**Routing**: React Router DOM (v7.9.6)  
Client-side routing is implemented using React Router, supporting multiple pages:
- Landing page (/)
- Document registration (/register)
- Document verification (/verify, /analyze)
- Registry/ledger view (/registry, /ledger)

The routing structure uses aliased paths for similar functionality (e.g., /verify and /analyze both route to VerifyDocument component).

**Styling**: Tailwind CSS (v3.4.18)  
The application uses utility-first CSS with Tailwind, configured with:
- Custom color scheme (Saudi green: #006C35)
- Arabic font family (Tajawal)
- RTL (Right-to-Left) direction support
- Custom animations (fade-in effects)

**UI Components**: Lucide React for icons  
Icon library for consistent, modern iconography throughout the application.

**State Management**: Local component state  
No global state management library is currently implemented. State is managed at the component level using React hooks.

### Backend Integration

**HTTP Client**: Axios (v1.13.2)  
All API communication is centralized in `src/services/api.js`, which provides a clean abstraction layer for backend interactions.

**API Endpoints**:
- POST /register - Register new documents
- POST /revoke - Revoke existing documents
- POST /verify-document - Verify document authenticity
- POST /analyze - Analyze document content
- GET /registry - Retrieve all registered documents
- GET /ledger - Retrieve document ledger/history

**File Handling**: FormData API  
Document uploads are handled using the FormData interface, allowing multipart form submissions with file attachments.

### Design Patterns

**Component Organization**:
- Pages directory for route components
- Components directory for reusable UI elements (Navbar, etc.)
- Services directory for API abstractions

**Separation of Concerns**:
The API service layer (`api.js`) separates HTTP logic from UI components, making it easier to modify backend integration without touching component code.

**RTL Support**:
The application is designed with Arabic language support in mind, using RTL direction and appropriate font choices (Tajawal).

## External Dependencies

### Backend API Service
- **Base URL**: `https://check-docs-absher-mvp--TryServify.replit.app`
- **Purpose**: Handles all document operations including registration, verification, revocation, and registry management
- **Communication**: REST API with JSON responses and FormData for file uploads

### Third-Party Libraries
- **React & React DOM** (v19.2.0): Core framework for building the UI
- **React Router DOM** (v7.9.6): Client-side routing
- **Axios** (v1.13.2): HTTP client for API requests
- **Tailwind CSS** (v3.4.18): Utility-first CSS framework
- **Lucide React** (v0.555.0): Icon components
- **PostCSS** (v8.5.6) with Autoprefixer (v10.4.22): CSS processing pipeline

### Testing Dependencies
- @testing-library/react (v16.3.0)
- @testing-library/jest-dom (v6.9.1)
- @testing-library/dom (v10.4.1)
- @testing-library/user-event (v13.5.0)

### Development Tools
- React Scripts (v5.0.1): Build toolchain from Create React App
- Web Vitals (v2.1.4): Performance monitoring

### Font Resources
The application references the Tajawal font family for Arabic text support, likely loaded from external CDN or font service (not explicitly configured in provided files).