# Visitation Servant Role Implementation Tasks

This document outlines the implementation tasks for the Visitation Servant role authentication flow and core features in the Church Management System.

## Authentication Flow Implementation

### 1. Login Page Implementation
**Path**: `/auth/servant/login`
**Components Required**:
- `VisitationServantLoginForm` component in `src/components/auth/visitation-servant-login-form.tsx`
- Email/username and password input fields
- Remember me functionality
- Forgot password link
- Form validation with Arabic error messages
- Loading states during authentication
- Redirect to `/visitation-servant-panel` on successful login

### 2. Authentication Middleware
**Implementation Details**:
- Role-based route protection for visitation servant routes
- Session validation for SERVANT role with VISITATION type
- Redirect unauthorized users to servant login page
- Ensure only authenticated visitation servants can access their panels

### 3. Dashboard Layout
**Path**: `/visitation-servant-panel/layout.tsx`
**Components Required**:
- `VisitationServantSidebar` navigation component
- `VisitationServantHeader` with user profile
- Role-specific navigation menu
- Task status indicator in header
- Notification center for priest messages

## Core Features Implementation

### 1. Visitation Task Management
**Components**:
- `VisitationTaskDashboard` in `src/components/visitation-servant/visitation-task-dashboard.tsx`
- `VisitationTaskCard` in `src/components/visitation-servant/visitation-task-card.tsx`
- `TaskDetailsModal` in `src/components/visitation-servant/task-details-modal.tsx`
- `TaskCompletionForm` in `src/components/visitation-servant/task-completion-form.tsx`
- `TaskFilters` in `src/components/visitation-servant/task-filters.tsx`

**API Endpoints**:
- GET `/api/visitation-servant/tasks` - Get assigned visitation tasks
- GET `/api/visitation-servant/tasks/[id]` - Get specific task details
- PUT `/api/visitation-servant/tasks/[id]/complete` - Mark task as completed
- GET `/api/visitation-servant/tasks/calendar` - Get tasks in calendar format

**Features**:
- Task filtering by status (pending, completed, upcoming)
- Task sorting by priority, date, or family name
- Search functionality by family name or location
- Task details with priest instructions
- Task completion with notes and observations
- Photo upload for visitation documentation

### 2. Family Information Access
**Components**:
- `FamilyProfileView` in `src/components/visitation-servant/family-profile-view.tsx`
- `FamilyContactInfo` in `src/components/visitation-servant/family-contact-info.tsx`
- `FamilyHistoryView` in `src/components/visitation-servant/family-history-view.tsx`
- `FamilyMapDisplay` in `src/components/visitation-servant/family-map-display.tsx`

**API Endpoints**:
- GET `/api/visitation-servant/families/[id]` - Get family information
- GET `/api/visitation-servant/families/[id]/history` - Get family visitation history
- GET `/api/visitation-servant/families/[id]/location` - Get family location data

**Features**:
- Family member details display
- Contact information access
- Previous visitation history
- Special needs and circumstances notes
- Prayer requests tracking
- Location display with OpenFreeMap integration

### 3. Service Tracking & Points
**Components**:
- `ServiceHistoryTracker` in `src/components/visitation-servant/service-history-tracker.tsx`
- `PointsDashboard` in `src/components/visitation-servant/points-dashboard.tsx`
- `AchievementDisplay` in `src/components/visitation-servant/achievement-display.tsx`
- `PerformanceMetrics` in `src/components/visitation-servant/performance-metrics.tsx`

**API Endpoints**:
- GET `/api/visitation-servant/service/history` - Get service history
- GET `/api/visitation-servant/points/balance` - Get current points balance
- GET `/api/visitation-servant/points/history` - Get points transaction history
- GET `/api/visitation-servant/achievements` - Get earned achievements

**Features**:
- Visitation history tracking
- Points earned for completed tasks
- Point accumulation visualization
- Achievement badges and certificates
- Service statistics and metrics
- Monthly service reports

### 4. Schedule & Planning
**Components**:
- `VisitationCalendar` in `src/components/visitation-servant/visitation-calendar.tsx`
- `WeekScheduleView` in `src/components/visitation-servant/week-schedule-view.tsx`
- `RouteOptimizer` in `src/components/visitation-servant/route-optimizer.tsx`
- `TimeTracker` in `src/components/visitation-servant/time-tracker.tsx`

**API Endpoints**:
- GET `/api/visitation-servant/schedule/week` - Get weekly schedule
- GET `/api/visitation-servant/schedule/route-optimize` - Get optimized visitation routes
- POST `/api/visitation-servant/schedule/time-log` - Log time spent on visits

**Features**:
- Weekly visitation planning
- Optimal route planning between families
- Travel time tracking
- Visit duration logging
- Schedule preference settings
- Calendar integration with personal devices

### 5. Reporting & Communication
**Components**:
- `VisitationReportForm` in `src/components/visitation-servant/visitation-report-form.tsx`
- `ReportTemplateSelector` in `src/components/visitation-servant/report-template-selector.tsx`
- `PriestMessenger` in `src/components/visitation-servant/priest-messenger.tsx`
- `PrayerRequestForm` in `src/components/visitation-servant/prayer-request-form.tsx`

**API Endpoints**:
- POST `/api/visitation-servant/reports` - Submit visitation report
- POST `/api/visitation-servant/messages/priest` - Send message to priest
- GET `/api/visitation-servant/messages` - Get received messages
- POST `/api/visitation-servant/prayer-requests` - Submit prayer request

**Features**:
- Rich text editor for detailed reports
- Photo upload for visitation documentation
- Form templates for standardized reporting
- Quick categories for common observations
- Urgent needs messaging to priests
- Prayer request submission for families

## Dashboard Implementation

### Main Dashboard
**Path**: `/visitation-servant-panel/page.tsx`
**Components**:
- `VisitationServantDashboard` in `src/components/visitation-servant/visitation-servant-dashboard.tsx`
- `TodaysTasks` in `src/components/visitation-servant/todays-tasks.tsx`
- `UpcomingSchedule` in `src/components/visitation-servant/upcoming-schedule.tsx`
- `PointsSummary` in `src/components/visitation-servant/points-summary.tsx`

**Features**:
- Today's visitation tasks overview
- Upcoming week schedule preview
- Current points balance and recent earnings
- Quick action buttons for common tasks
- Recent completed visitations
- Urgent family needs display

## Mobile Optimization

### Field-Work Features
- Mobile-optimized task cards
- Touch-friendly report forms
- Offline data storage for remote areas
- GPS integration for location tracking
- Camera integration for photo documentation
- Voice-to-text for note-taking

## Implementation Order

1. **Authentication Infrastructure**
   - Visitation servant login form
   - Middleware setup for servant routes
   - Session management for servant role

2. **Dashboard Layout**
   - Visitation servant layout components
   - Navigation structure
   - Basic dashboard with task overview

3. **Task Management**
   - Task dashboard and filtering
   - Task details and completion forms
   - Status tracking and updates

4. **Family Information**
   - Family profile display
   - Contact information access
   - Map integration for locations

5. **Service Tracking**
   - Points system integration
   - Service history tracking
   - Achievement system

6. **Schedule & Planning**
   - Calendar integration
   - Route optimization
   - Time tracking features

7. **Reporting & Communication**
   - Report creation and submission
   - Messaging system with priests
   - Prayer request management

8. **Mobile Optimization**
   - Responsive design for field work
   - Offline capabilities
   - GPS and camera integration

## Security Considerations

- Servant-specific authentication with role verification
- Access control only for assigned families
- Secure handling of visitation reports
- Encrypted communication with priests
- Activity logging for audit purposes

## Integration Requirements

- Integration with OpenFreeMap for location services
- Connection to points and rewards system
- Link to notification system for urgent needs
- Integration with task assignment system
- Connection to family database

This implementation will provide visitation servants with comprehensive tools to effectively manage their pastoral care responsibilities while maintaining proper documentation and communication with church leadership.