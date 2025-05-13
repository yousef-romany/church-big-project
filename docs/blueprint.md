# **App Name**: Church Manager Dashboard

## Core Features:

- Priest Overview: Display a list of priests associated with the church, showing their name, status (active, stressed, sanctioned), number of assigned families, and number of missing visits. Displayed in interactive cards with hover effects.
- Family Management: Enable filtering of families by name, phone number, or region. Display family details like parents' names, number of children, and family status (widowed, poor, divorced) in expandable cards.
- Announcement System: Allow church admins to create and publish announcements. Display the latest announcements in a table or card format, with animations on addition.
- Church Information: Display church details like name, address, and contact number, with options to edit this information. Embed a Google Map showing the church location.
- Enhanced UX: Full support for Arabic language and right-to-left (RTL) layout, clear icons (lucide or heroicons), a user-friendly interface, and a dark mode toggle switch.

## Style Guidelines:

- Primary color: Neutral greys (#F9FAFB) for backgrounds and surfaces to ensure legibility.
- Secondary color: Deep blue (#1E3A8A) for primary actions and important information.
- Accent: Green (#4ade80) to show a priest is active or available
- Arabic-friendly font that is clean and legible (e.g., 'Almarai', 'Tajawal') for the main text, ensuring comfortable reading in RTL layout.
- Use simple, outlined icons from Lucide Icons or Heroicons for a modern and clean look, ensuring icons are mirrored for RTL layout where appropriate.
- RTL-first layout using Tailwind CSS to ensure proper text alignment and interface mirroring for Arabic content.
- Smooth transitions and animations using Framer Motion throughout the dashboard, including hover effects on cards, fade-in effects for section loading, expand/collapse animations for detailed views, and slide or pulse effects for new announcements.