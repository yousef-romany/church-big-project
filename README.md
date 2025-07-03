# Comprehensive Church Management System

This is a modern, full-stack web application designed to be a centralized digital hub for church management. Built with Next.js and a suite of powerful, modern tools, it provides distinct, role-based portals for every member of the church community, from administrative staff to priests, servants, and the congregation.

## Key Features

The application is structured around a series of dedicated user portals, each with functionalities tailored to their specific needs:

-   **Admin Dashboard:** Centralized control over church-wide announcements and information.
-   **Priest Portal:** Tools for managing confession schedules, visitation tasks, creating church events, and managing trips. Features an AI-powered devotional message to inspire daily service.
-   **Servant Portals (Visitation & Sunday School):** Task management, attendance tracking, and content creation tools to empower service members.
-   **Parent & Child Portals:** A system for parents to monitor their children's activities, and for children to track their points, schedule, and engage with the church.
-   **Public Services:** Open-access pages for requesting confession appointments and viewing/booking church trips.
-   **Progressive Web App (PWA):** The application is fully installable on any device and offers offline support, ensuring access even without a stable internet connection.
-   **Robust Data Management:** A complete database schema managed with Prisma ORM to handle all application data reliably.

---

## Tech Stack & Architecture

This project is built on a carefully selected, modern tech stack designed for performance, scalability, and an excellent developer experience.

| Category      | Technology/Tool                                                              | Benefit for You (The Developer)                                                                                                    |
| :------------ | :--------------------------------------------------------------------------- | :--------------------------------------------------------------------------------------------------------------------------------- |
| **Framework** | **Next.js (App Router)**                                                     | Provides a powerful, scalable foundation with server-side rendering, Server Components, and simplified routing for fast performance. |
| **Language**  | **TypeScript**                                                               | Ensures type safety, reducing runtime errors and making the code easier to refactor and maintain as it grows.                     |
| **UI Library**| **React & ShadCN UI**                                                        | Create beautiful, accessible, and consistent user interfaces with a library of reusable components you can easily customize. |
| **Styling**   | **Tailwind CSS**                                                             | A utility-first CSS framework that allows for rapid styling directly in your markup without writing custom CSS.                |
| **AI**        | **Google Genkit (Gemini)**                                                   | Seamlessly integrate powerful generative AI features, like the dynamic devotional messages, with a simple and clear API.        |
| **Database**  | **Prisma ORM & SQLite**                                                      | Interact with your database using a type-safe and intuitive API. The schema-first approach ensures your data model is robust.    |
| **PWA**       | **next-pwa**                                                                 | Easily configure your application to be installable and work offline, providing a native-app-like experience.                  |
| **Forms**     | **React Hook Form & Zod**                                                    | Build performant and flexible forms with powerful, type-safe validation, reducing boilerplate code significantly.             |
| **Animation** | **Framer Motion**                                                            | Add smooth, professional animations and transitions to create a delightful and engaging user experience.                       |

---

## Getting Started

To get the project up and running on your local machine, follow these simple steps.

### 1. Install Dependencies

First, ensure all the necessary packages are installed.

```bash
npm install
```

### 2. Set Up the Database

This project uses Prisma with a local SQLite database. To create the database file and generate the Prisma Client, run the following command. You only need to do this once initially, and then again anytime you change the `schema.prisma` file.

```bash
npx prisma db push
```

This command reads your `prisma/schema.prisma` file, creates the database (`prisma/dev.db`), and prepares the type-safe Prisma Client for you to use.

### 3. Run the Development Server

Now, you can start the Next.js development server.

```bash
npm run dev
```

The application will be available at [http://localhost:3000](http://localhost:3000).

---

## Available Scripts

-   `npm run dev`: Starts the development server with Turbopack.
-   `npm run build`: Builds the application for production.
-   `npm run start`: Starts the production server.
-   `npm run lint`: Lints the code for potential errors.
-   `npm run prisma:generate`: Manually generates the Prisma Client.
-   `npm run genkit:dev`: Starts the Genkit development server (for AI flows).
