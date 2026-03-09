# Priest Features

This document outlines all features available to the **Priest** role in the Church Management System.

## Role Overview
The Priest is a spiritual leader who manages confession schedules, family visitation, Sunday School coordination, and provides spiritual guidance to the congregation.

## Authentication & Access
- **Login Path**: `/auth/priest/login`
- **Dashboard**: `/priest-panel`
- **Role Identifier**: `PRIEST`

## Core Features

### 1. Confession Management
- **Schedule Management**:
  - Create and manage weekly confession schedules
  - Set recurring availability patterns
  - Block unavailable dates and times
  - Configure appointment durations (default 30 minutes)

- **Appointment Handling**:
  - View scheduled confession appointments
  - Update appointment status (coming, completed, cancelled)
  - Add notes for each appointment
  - Create manual appointments as needed

- **Bulk Operations**:
  - Reschedule multiple appointments simultaneously
  - Send automated reminders to parishioners
  - Export appointment calendars
  - View appointment history and patterns

### 2. Family & Visitation Services
- **Family Management**:
  - Add new families to the system
  - Edit family information (name, address, contact details)
  - Record family location with OpenFreeMap integration
  - Add special notes about family circumstances

- **Visitation Coordination**:
  - Create visitation tasks for families
  - Assign visitation tasks to servants
  - Provide specific instructions for each visit
  - Track visitation completion status

- **Servant Oversight**:
  - View assigned visitation servants
  - Monitor visitation task completion
  - Review servant visitation reports
  - Reassign tasks when necessary

### 3. Sunday School Management
- **Servant Management**:
  - Add and manage Sunday School servants
  - Assign servants to specific classes or groups
  - Track servant service history
  - Manage servant schedules

- **Attendance System**:
  - Record servant attendance for services
  - View comprehensive attendance reports
  - Track attendance patterns and trends
  - Generate attendance certificates

- **Child Tracking**:
  - Monitor children's attendance via QR code system
  - View children's points accumulation
  - Track spiritual progress milestones
  - Manage parent-child linking

### 4. Events & Activities
- **Event Creation**:
  - Create and manage church events
  - Set event details (date, time, location, points)
  - Add event descriptions and requirements
  - Manage event registration

- **Trip Management**:
  - Organize church trips and pilgrimages
  - Set trip details (destination, dates, pricing)
  - Manage capacity limits and bookings
  - Track trip participant lists

- **Participation Tracking**:
  - Monitor event attendance
  - Award points for participation
  - Create event calendars
  - Send event notifications

### 5. AI-Powered Devotional Messages
- **Daily Devotionals**:
  - Receive AI-generated daily devotional messages
  - Customize devotional content preferences
  - Save favorite devotionals
  - Share devotionals with congregation

- **Spiritual Guidance**:
  - Access personalized spiritual insights
  - Get sermon preparation assistance
  - Find relevant scripture references
  - Generate teaching materials

### 6. Dashboard & Analytics
- **Priest Dashboard**:
  - View today's schedule at a glance
  - Monitor upcoming appointments
  - Track visitation task completion
  - View attendance statistics

- **Reporting Features**:
  - Generate confession appointment reports
  - View family visitation statistics
  - Track servant performance metrics
  - Create spiritual activity summaries

## User Interface Features

### Calendar Integration
- Interactive calendar with all scheduled activities
- Color-coded events by type (confessions, visits, events)
- Quick event creation from calendar view
- Export calendar to external applications
- Arabic calendar support with date-fns

### Maps & Location
- OpenFreeMap integration for family addresses
- Route planning for visitation tasks
- Location-based family searching
- Distance tracking between visits

### Communication Tools
- In-app messaging system
- Email integration for announcements
- Notification management
- Contact directory

## Workflow Examples

### Scheduling Confessions
1. Navigate to Confession Management → Schedule
2. Select available time slots for the week
3. Set recurring availability patterns
4. Configure appointment duration and buffer times
5. Save and publish the schedule

### Creating Visitation Tasks
1. Navigate to Family Management → Select Family
2. Click "Create Visitation Task"
3. Add task details and special instructions
4. Assign to appropriate servant
5. Set deadline and priority
6. Notify assigned servant

### Managing Sunday School
1. Navigate to Sunday School → Servant Management
2. Add new servants or assign existing ones
3. Navigate to Attendance Tracking
4. Record weekly attendance
5. Generate monthly reports

## Permissions & Restrictions

### Priest Can:
- Manage all confession-related activities
- Create and assign visitation tasks
- Manage Sunday School servants and attendance
- Create church events and trips
- Access AI devotional features
- View comprehensive reports

### Priest Cannot:
- Access other priests' schedules without permission
- Modify system administrative settings
- Delete church records without approval
- Access other user accounts
- Modify database schema

## Integration Points
- Family database for visitation services
- Sunday School attendance system
- Events and trips management
- AI integration for devotionals
- OpenFreeMap for location services

## Security Features
- Role-based access control
- Secure appointment scheduling
- Encrypted family information
- Activity logging for audit purposes
- Multi-factor authentication option

This comprehensive priest interface enables spiritual leaders to efficiently manage their pastoral duties while leveraging modern technology to enhance ministry effectiveness.