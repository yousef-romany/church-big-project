# FEATURES.md

This document provides a comprehensive overview of all features in the Church Management System, organized by user roles and functionality areas.

## System Architecture & Technical Stack

- **Framework**: Next.js 15 with App Router
- **Database**: PostgreSQL with Prisma ORM
- **UI**: Tailwind CSS with ShadCN UI components
- **Authentication**: NextAuth.js with role-based access
- **Language**: Arabic (RTL) interface
- **Progressive Web App**: PWA capabilities with installable interface
- **AI Integration**: Genkit with Google AI for devotional messages
- **Animations**: Framer Motion for enhanced UX
- **Real-time Features**: Firebase messaging and real-time capabilities

## User Roles & Access Control

### 1. Admin User
**Dashboard Location**: `/auth/admin/login` → `/admin`

**Features**:
- Church information management (address, contact details)
- Priest management and oversight
- Family database management
- Announcement system
- Administrative controls
- System-wide settings

### 2. Priest
**Dashboard Location**: `/auth/priest/login` → `/priest-panel`

**Features**:
- **Confession Management**:
  - Schedule confession appointments
  - Manage priest availability (daily/weekly time slots)
  - Track appointment status (coming, completed, cancelled)
  - Bulk rescheduling capabilities
  - Manual appointment creation

- **Family & Visitation Services**:
  - Add and manage families in the system
  - Assign servants to visit families
  - Create and track visitation tasks
  - Family location tracking with OpenFreeMap integration

- **Sunday School Management**:
  - Manage Sunday School servants
  - Record and view servant attendance
  - Generate attendance reports
  - Track children's attendance via QR codes
  - Points system management for children

- **Events & Activities**:
  - Create and manage church events
  - Coordinate and manage church trips
  - Track event participation and bookings
  - Points system integration

- **Daily Devotional Messages**:
  - AI-generated daily devotional messages (via Genkit + Google AI)
  - Personalized spiritual guidance

### 3. Visitation Servant
**Dashboard Location**: `/auth/servant/login` → `/visitation-servant-panel`

**Features**:
- View assigned visitation tasks
- Record visitation history and notes
- View family information and contact details
- Track points earned for completed tasks
- Schedule management for visits

### 4. Sunday School Servant
**Dashboard Location**: `/auth/sunday-school-servant/login` → `/sunday-school-servant-panel`

**Features**:
- Self-attendance recording
- View personal service history
- Points tracking system
- Content management for educational materials
- Class attendance management

### 5. Parent
**Dashboard Location**: `/auth/parent/login` → `/makhdoum-parent-panel`

**Features**:
- Link accounts to their children's profiles
- View children's attendance records
- Monitor points earned by children
- View upcoming events and schedules
- Access church information and announcements

### 6. Child (Makhdoum)
**Dashboard Location**: `/auth/child/login` → `/makhdoum-child-panel`

**Features**:
- View personal dashboard with points earned
- Check attendance records
- View scheduled activities
- Interactive points system
- Child-friendly interface with gamification

### 7. Regular Makhdoum (General Servant)
**Dashboard Location**: `/auth/makhdoum/login` → `/makhdoum-panel`

**Features**:
- View assigned tasks
- Track points earned
- View personal schedule
- Role-switching capabilities
- Service history tracking

## Core System Features

### 1. Attendance & Points System
- **Sunday School Attendance**: QR code-based check-in for children
- **Servant Attendance**: Self-service recording for servants
- **Points Management**: Gamified reward system for participation
- **Reporting**: Comprehensive attendance analytics

### 2. Scheduling & Events
- **Event Management**: Creation, promotion, and tracking
- **Trip Management**: Booking system with capacity management
- **Appointment Scheduling**: Time-slot based with conflict detection
- **Calendar Integration**: Arabic calendar support with date-fns

### 3. Communication & Messaging
- **Announcement System**: Church-wide announcements
- **Firebase Messaging**: Real-time notifications
- **Email Service**: Automated communication
- **Content Management**: Educational and spiritual content

### 4. Data Management
- **Family Database**: Centralized family records with location tracking
- **Profile Management**: Role-based profiles for all users
- **Service History**: Comprehensive tracking of spiritual activities
- **Analytics & Reporting**: Data insights for administrators

### 5. Authentication & Security
- **Role-Based Access Control**: Granular permissions by role
- **Email Verification**: Account verification system
- **Secure Password Management**: bcrypt password hashing
- **Session Management**: JWT-based authentication

### 6. Special Features
- **AI Integration**: Automated devotional message generation
- **PWA Capabilities**: Installable offline-first experience
- **Responsive Design**: Mobile-first approach with RTL support
- **Dark Mode**: Theme toggle for accessibility
- **OpenFreeMap Integration**: Location tracking for visitation services
- **QR Code System**: Children check-in and identification

## Database Schema Overview
The system uses PostgreSQL with a comprehensive schema including:
- User profiles with role-specific extensions
- Family records with location data
- Attendance tracking systems
- Events and trips management
- Booking and reservation systems
- Parent-child linking functionality
- Points and rewards tracking

## User Experience Features
- **Arabic Interface**: Full RTL support
- **Progressive Web App**: Native app-like experience
- **Responsive Design**: Works on all device sizes
- **Smooth Animations**: Framer Motion for enhanced UX
- **Interactive Dashboards**: Role-specific personalized experiences
- **Real-time Updates**: Live data synchronization

## Feature Highlights

### Gamification Elements
- Points system for attendance and participation
- Achievement tracking for children
- Service recognition for volunteers
- Progress visualization

### Automation Features
- AI-generated devotional messages for priests
- Automated attendance tracking
- Notification systems for upcoming events
- Email reminders for appointments

### Accessibility Features
- Full Arabic RTL support
- Dark mode toggle
- Mobile-responsive design
- Screen reader compatibility
- Keyboard navigation support

This comprehensive system provides a digital transformation solution for church management, bringing together spiritual activities, administrative tasks, and community engagement in a unified platform.