# Makhdoum (General Servant) Role Implementation Tasks

This document outlines the implementation tasks for the Makhdoum (General Servant) role authentication flow and core features in the Church Management System.

## Authentication Flow Implementation

### 1. Login Page Implementation
**Path**: `/auth/makhdoum/login`
**Components Required**:
- `MakhdoumLoginForm` component in `src/components/auth/makhdoum-login-form.tsx`
- Email/username and password input fields
- Remember me functionality
- Forgot password link
- Form validation with Arabic error messages
- Loading states during authentication
- Redirect to `/makhdoum-panel` on successful login

### 2. Authentication Middleware
**Implementation Details**:
- Role-based route protection for makhdoum routes
- Session validation for SERVANT role (general type)
- Redirect unauthorized users to makhdoum login page
- Ensure only authenticated servants can access their panels

### 3. Dashboard Layout
**Path**: `/makhdoum-panel/layout.tsx`
**Components Required**:
- `MakhdoumSidebar` navigation component
- `MakhdoumHeader` with user profile
- Role-specific navigation menu
- Task notification indicator in header
- Points display in header

## Core Features Implementation

### 1. Task Management
**Components**:
- `TaskDashboard` in `src/components/makhdoum/task-dashboard.tsx`
- `TaskCard` in `src/components/makhdoum/task-card.tsx`
- `TaskDetailsModal` in `src/components/makhdoum/task-details-modal.tsx`
- `TaskCompletionForm` in `src/components/makhdoum/task-completion-form.tsx`
- `TaskFilters` in `src/components/makhdoum/task-filters.tsx`

**API Endpoints**:
- GET `/api/makhdoum/tasks` - Get assigned service tasks
- GET `/api/makhdoum/tasks/[id]` - Get specific task details
- PUT `/api/makhdoum/tasks/[id]/complete` - Mark task as completed
- GET `/api/makhdoum/tasks/calendar` - Get tasks in calendar format
- POST `/api/makhdoum/tasks/request` - Request task assignments

**Features**:
- Task filtering by priority, status, or category
- Task sorting by due date or importance
- Search functionality by keywords
- Task details with instructions
- Task completion with notes and photos
- Request additional tasks in preferred areas

### 2. Points & Recognition System
**Components**:
- `PointsTracker` in `src/components/makhdoum/points-tracker.tsx`
- `ServiceHistoryDisplay` in `src/components/makhdoum/service-history-display.tsx`
- `AchievementShowcase` in `src/components/makhdoum/achievement-showcase.tsx`
- `PerformanceMetrics` in `src/components/makhdoum/performance-metrics.tsx`
- `Leaderboard` in `src/components/makhdoum/leaderboard.tsx`

**API Endpoints**:
- GET `/api/makhdoum/points/balance` - Get current points balance
- GET `/api/makhdoum/points/history` - Get points transaction history
- GET `/api/makhdoum/achievements` - Get earned achievements
- GET `/api/makhdoum/service/history` - Get service history
- GET `/api/makhdoum/leaderboard` - Get servant rankings

**Features**:
- Points earned for completed tasks
- Point accumulation visualization
- Service milestones tracking
- Achievement badges and certificates
- Ranking among fellow servants
- Point redemption options

### 3. Schedule & Calendar
**Components**:
- `ServiceCalendar` in `src/components/makhdoum/service-calendar.tsx`
- `PersonalSchedule` in `src/components/makhdoum/personal-schedule.tsx`
- `EventRegistration` in `src/components/makhdoum/event-registration.tsx`
- `AvailabilityManager` in `src/components/makhdoum/availability-manager.tsx`

**API Endpoints**:
- GET `/api/makhdoum/schedule` - Get personal schedule
- GET `/api/makhdoum/events/upcoming` - Get upcoming church events
- POST `/api/makhdoum/events/register` - Register for events
- PUT `/api/makhdoum/availability` - Update availability preferences

**Features**:
- Personal service commitment calendar
- Church event registration
- Availability management
- Event reminders and updates
- Calendar integration with personal devices

### 4. Resource & Information Access
**Components**:
- `ResourceLibrary` in `src/components/makhdoum/resource-library.tsx`
- `TrainingMaterials` in `src/components/makhdoum/training-materials.tsx`
- `GuidelinesViewer` in `src/components/makhdoum/guidelines-viewer.tsx`
- `AnnouncementReader` in `src/components/makhdoum/announcement-reader.tsx`

**API Endpoints**:
- GET `/api/makhdoum/resources` - Get service resources
- GET `/api/makhdoum/training` - Get training materials
- GET `/api/makhdoum/guidelines` - Get service guidelines
- GET `/api/makhdoum/announcements` - Get relevant announcements

**Features**:
- Service guidelines and instructions
- Training materials and documentation
- Downloadable forms and documents
- Church announcements and communications
- Educational content access

### 5. Role Management
**Components**:
- `RoleDisplay` in `src/components/makhdoum/role-display.tsx`
- `SkillTracker` in `src/components/makhdoum/skill-tracker.tsx`
- `RoleRequestForm` in `src/components/makhdoum/role-request-form.tsx`
- `MentorshipConnections` in `src/components/makhdoum/mentorship-connections.tsx`

**API Endpoints**:
- GET `/api/makhdoum/roles/current` - Get current role assignments
- GET `/api/makhdoum/skills/assessment` - Get skill assessment
- POST `/api/makhdoum/roles/request` - Request additional responsibilities
- GET `/api/makhdoum/mentorship` - Get mentorship opportunities

**Features**:
- Current role assignments display
- Skill gap identification
- Training opportunity access
- Mentorship connections
- Service area exploration

## Dashboard Implementation

### Main Dashboard
**Path**: `/makhdoum-panel/page.tsx`
**Components**:
- `MakhdoumDashboard` in `src/components/makhdoum/makhdoum-dashboard.tsx`
- `TodaysTasks` in `src/components/makhdoum/todays-tasks.tsx`
- `PointsSummary` in `src/components/makhdoum/points-summary.tsx`
- `UpcomingSchedule` in `src/components/makhdoum/upcoming-schedule.tsx`

**Features**:
- Today's service tasks overview
- Current points balance and recent earnings
- Upcoming service commitments
- Quick action buttons for common tasks
- Recent completed tasks and activities
- Service announcements

## Specialization Options

### Service Areas
- Worship service assistance
- Event setup and coordination
- Administrative support
- Community outreach
- Technical support
- Music ministry
- Youth ministry support

### Flexibility Features
- Role switching capabilities
- Multi-area service tracking
- Skill-based task assignment
- Service preference settings
- Availability-based scheduling

## Implementation Order

1. **Authentication Infrastructure**
   - Makhdoum login form
   - Middleware setup for servant routes
   - Session management for servant role

2. **Dashboard Layout**
   - Makhdoum layout components
   - Navigation structure
   - Basic dashboard with task overview

3. **Task Management**
   - Task dashboard and filtering
   - Task details and completion forms
   - Request system for new tasks

4. **Points & Recognition**
   - Points tracking system
   - Achievement display
   - Service history
   - Leaderboard integration

5. **Schedule & Calendar**
   - Personal schedule management
   - Event registration
   - Availability settings

6. **Resource Access**
   - Resource library implementation
   - Training materials access
   - Guidelines viewer

7. **Role Management**
   - Role display and management
   - Skill tracking
   - Mentorship connections

8. **Specialization Features**
   - Service area options
   - Flexibility features
   - Role switching

## Security Considerations

- Servant-specific authentication with role verification
- Access control only for assigned tasks
- Secure handling of service documentation
- Encrypted communication with church leadership
- Activity logging for audit purposes

## Integration Requirements

- Integration with task assignment system
- Connection to points and rewards system
- Link to church events management
- Integration with resource library
- Connection to communication system

## Special Features

- Arabic language interface with RTL support
- Multi-role service flexibility
- Skill development tracking
- Mentorship connections
- Service specialization options

## Performance Metrics

- Task completion rates
- Point earning efficiency
- Service consistency measures
- Event participation frequency
- Skill development progress

This implementation will provide general servants with flexible tools to manage their service commitments while tracking their spiritual growth and contribution to the church community. The system provides flexibility for servants to serve in various capacities based on their skills, availability, and calling.