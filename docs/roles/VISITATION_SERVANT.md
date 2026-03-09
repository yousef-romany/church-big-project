# Visitation Servant Features

This document outlines all features available to the **Visitation Servant** role in the Church Management System.

## Role Overview
The Visitation Servant is responsible for conducting family visits, maintaining relationships with church families, and reporting on the spiritual well-being of assigned households.

## Authentication & Access
- **Login Path**: `/auth/servant/login`
- **Dashboard**: `/visitation-servant-panel`
- **Role Identifier**: `SERVANT` with type `VISITATION`

## Core Features

### 1. Visitation Task Management
- **Task Dashboard**:
  - View all assigned visitation tasks
  - Filter tasks by status (pending, completed, upcoming)
  - Sort tasks by priority, date, or family name
  - Search tasks by family name or location

- **Task Details**:
  - Access complete family information
  - Review special instructions from priest
  - View family contact details and address
  - Check previous visitation history

- **Task Execution**:
  - Mark tasks as completed
  - Add detailed visitation notes
  - Record spiritual needs identified
  - Document follow-up requirements

### 2. Family Information Access
- **Family Profiles**:
  - View family member details
  - Access family contact information
  - Review family's church involvement history
  - See special needs or circumstances

- **Location Services**:
  - View family addresses on map using OpenFreeMap
  - Get directions to family homes
  - Calculate travel distances
  - Optimize visitation routes

- **Communication History**:
  - Review previous visitation notes
  - Track prayer requests
  - Monitor spiritual progress
  - Access family prayer needs

### 3. Service Tracking & Points
- **Service History**:
  - View personal visitation history
  - Track number of completed visits
  - Monitor service statistics
  - View monthly service reports

- **Points System**:
  - Earn points for completed visitations
  - Track point accumulation
  - View point history and transactions
  - See point redemption options

- **Performance Metrics**:
  - View visitation completion rates
  - Track response times to assignments
  - Monitor follow-up completion
  - Access personal service statistics

### 4. Schedule & Planning
- **Visit Planning**:
  - View upcoming visitation schedule
  - Plan optimal visitation routes
  - Set personal visitation preferences
  - Manage visitation calendar

- **Time Management**:
  - Track time spent on visits
  - Log travel time between visits
  - Schedule follow-up activities
  - Plan visitation calendar weeks

### 5. Reporting & Communication
- **Visitation Reports**:
  - Submit detailed visitation reports
  - Document spiritual observations
  - Report family needs to priests
  - Provide feedback on family conditions

- **Communication Tools**:
  - Message priests about urgent needs
  - Request assistance for families
  - Share updates with other servants
  - Access church announcements

## User Interface Features

### Dashboard Overview
- **Today's Tasks**: Display of current day visitations
- **Upcoming Schedule**: Next 7 days of assigned visits
- **Points Summary**: Current point balance and recent earnings
- **Quick Actions**: Quick access to common tasks
- **Recent Activity**: Latest completed visitations

### Task Management Interface
- **Task Cards**: Visual representation of each visitation task
- **Status Indicators**: Clear visual cues for task status
- **Priority Marking**: Visual priority indicators
- **Family Quick View**: Expandable family information
- **Map Integration**: Visual location display

### Reporting Features
- **Rich Text Editor**: Detailed note-taking capabilities
- **Photo Upload**: Add images to visitation reports
- **Form Templates**: Standardized reporting formats
- **Quick Categories**: Pre-defined common observations
- **Prayer Requests**: Specific prayer need documentation

## Workflow Examples

### Completing a Visitation
1. Navigate to Dashboard → Today's Tasks
2. Select assigned family from task list
3. Review family information and special notes
4. Use map integration to get directions
5. Conduct visitation per instructions
6. Return to system to complete task
7. Add detailed visitation notes
8. Submit report to priest

### Managing Weekly Schedule
1. Navigate to Schedule → Week View
2. Review all assigned visitations
3. Plan optimal route for multiple visits
4. Set personal time preferences
5. Contact families to confirm appointments
6. Document scheduling conflicts
7. Request assistance for special needs

### Tracking Service Impact
1. Navigate to Service History
2. Review completed visitations
3. Analyze patterns and outcomes
4. Identify families needing extra support
5. Request priest intervention when needed
6. Plan long-term follow-up strategies

## Permissions & Restrictions

### Visitation Servant Can:
- View and manage assigned visitation tasks
- Access family information for assigned families
- Submit visitation reports and notes
- Track personal service points
- View personal schedule and history

### Visitation Servant Cannot:
- Access information about families not assigned to them
- Assign tasks to other servants
- Modify family core information
- View other servants' assignments
- Access priest administrative functions

## Integration Points
- Family database for accessing household information
- Maps integration for location services
- Points system for service recognition
- Priest notification system for urgent needs
- Calendar system for scheduling

## Security Features
- Role-based access to family information
- Encrypted visitation notes
- Secure communication channels
- Activity logging for audit purposes
- Restricted data access

## Mobile Optimization
- Responsive design for field work
- Touch-optimized interface
- Offline capability for remote areas
- GPS integration for location tracking
- Mobile-friendly reporting forms

This interface enables visitation servants to effectively manage their pastoral care responsibilities while maintaining proper documentation and communication with the church leadership.