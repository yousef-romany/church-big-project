# Role-Based Features Documentation

This directory contains detailed feature documentation for each user role in the Church Management System.

## Available Role Documentation

| Role | Description | Documentation File |
|------|-------------|-------------------|
| **Admin** | System administrator with complete oversight of all church operations | [ADMIN.md](./ADMIN.md) |
| **Priest** | Spiritual leader managing confessions, visitation, and Sunday School oversight | [PRIEST.md](./PRIEST.md) |
| **Visitation Servant** | Servant focused on family visits and pastoral care coordination | [VISITATION_SERVANT.md](./VISITATION_SERVANT.md) |
| **Sunday School Servant** | Teacher responsible for children's spiritual education | [SUNDAY_SCHOOL_SERVANT.md](./SUNDAY_SCHOOL_SERVANT.md) |
| **Parent** | Guardian monitoring children's church activities and participation | [PARENT.md](./PARENT.md) |
| **Child** | Young church member participating in Sunday School and activities | [CHILD.md](./CHILD.md) |
| **Makhdoum** (General Servant) | Church member serving in various general capacities | [MAKHDOUM.md](./MAKHDOUM.md) |

## Role Hierarchy and Access Control

```
┌─────────────────────────────────────┐
│              ADMIN                  │
│     (Complete System Access)        │
└─────────────┬───────────────────────┘
              │
┌─────────────▼───────────────────────┐
│              PRIEST                 │
│   (Spiritual Leadership Access)     │
└─────┬───────────────┬───────────────┘
      │               │
┌─────▼─────┐    ┌─────▼─────┐
│ VISITATION│    │ SUNDAY    │
│ SERVANT   │    │ SCHOOL    │
│           │    │ SERVANT   │
└─────┬─────┘    └─────┬─────┘
      │                  │
      └───────┬──────────┘
              │
    ┌─────────▼──────────┐
    │    MAKHDOUM        │
    │  (General Servant) │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │    PARENT          │
    │ (Family Oversight) │
    └─────────┬──────────┘
              │
    ┌─────────▼──────────┐
    │      CHILD         │
    │  (Student Member)  │
    └────────────────────┘
```

## Cross-Role Features

### Points & Rewards System
All servant roles (Priest, Visitation Servant, Sunday School Servant, Makhdoum) participate in a unified points system:
- Points earned for service activities
- Achievement tracking and recognition
- Redemption options for service rewards
- Performance metrics and reporting

### Attendance Tracking
Multiple roles interact with attendance systems:
- Children track attendance and earn points
- Sunday School Servants record class attendance
- Visitation Servants log family visits
- Priests oversee overall attendance patterns

### Communication System
Role-based communication channels connect all users:
- Parents receive updates about children
- Servants coordinate with church leadership
- Children interact with teachers and peers
- Admin manages system-wide announcements

## Authentication Paths

| Role | Login URL | Dashboard URL |
|------|-----------|----------------|
| Admin | `/auth/admin/login` | `/admin` |
| Priest | `/auth/priest/login` | `/priest-panel` |
| Visitation Servant | `/auth/servant/login` | `/visitation-servant-panel` |
| Sunday School Servant | `/auth/sunday-school-servant/login` | `/sunday-school-servant-panel` |
| Parent | `/auth/parent/login` | `/makhdoum-parent-panel` |
| Child | `/auth/child/login` | `/makhdoum-child-panel` |
| Makhdoum | `/auth/makhdoum/login` | `/makhdoum-panel` |

## Shared Features Across Roles

### Mobile Responsiveness
All interfaces are optimized for mobile devices with:
- Touch-friendly navigation
- Responsive layouts
- Mobile-specific features
- Progressive Web App capabilities

### Arabic Language Support
The entire system provides comprehensive Arabic support:
- Right-to-left (RTL) interface
- Arabic text input and display
- Culturally appropriate content
- Arabic calendar integration

### Security & Privacy
Each role includes appropriate security measures:
- Role-based access control
- Data encryption
- Activity logging
- Privacy protection settings

## Integration Points

### Database Relationships
All roles connect through shared database models:
- User profiles with role-specific extensions
- Family relationships and linking
- Attendance and points tracking
- Communication and notification systems

### Cross-Functional Workflows
Many church activities require coordination between roles:
- Event planning involves Admin, Priests, and Servants
- Child engagement requires Parents, Teachers, and Children
- Family visitation connects Priests, Servants, and Families

For detailed information about specific features and capabilities for each role, please refer to the individual role documentation files listed above.