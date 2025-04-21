# Satyajit Halder - Portfolio Website

A modern, responsive, and feature-rich portfolio website with an integrated admin dashboard for content management. This full-stack application showcases professional achievements, projects, skills, and blog posts with a clean and engaging user interface.


## 🚀 Features

### Frontend
- Responsive design that works on all devices
- Modern UI with animations and interactive elements
- Dark/light mode toggle
- Sections for:
  - Home with animated hero section
  - Biography/Timeline
  - Projects showcase
  - Blog with full articles
  - Skills display
  - Achievements & certifications
  - Contact information
  - Testimonials carousel
  - Current projects/focus
- Resume/CV download option
- Optimized performance

### Admin Dashboard
- Secure authentication system
- 12 comprehensive sections for content management:
  - User profile settings
  - Hero section customization
  - Projects management
  - Blog post editor
  - Achievements tracking
  - Skills management
  - Social links configuration
  - Contact info management
  - Testimonials administration
  - Current focus/projects updates
  - Biography entries editor
  - Site settings

## 🛠️ Tech Stack

### Frontend
- React.js with TypeScript
- Tailwind CSS for styling
- Framer Motion for animations
- React Hook Form for form handling
- TanStack Query for data fetching
- Shadcn UI components
- Wouter for routing

### Backend
- Node.js with Express
- PostgreSQL database
- Drizzle ORM for database operations
- Passport.js for authentication
- SendGrid for email functionality (optional)

## 📋 Prerequisites

- Node.js v18.0.0 or later
- PostgreSQL database
- npm or yarn package manager

## 💻 Installation

1. Clone the repository:
```bash
git clone https://github.com/your-username/portfolio-website.git
cd portfolio-website
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
Create a `.env` file in the root directory with the following variables:
```
DATABASE_URL=postgresql://username:password@localhost:5432/portfolio_db
SESSION_SECRET=your_session_secret_here
SENDGRID_API_KEY=your_sendgrid_api_key_here (optional)
```

4. Set up the database:
```bash
npm run db:push
```

5. Start the development server:
```bash
npm run dev
```

It's recommended to change the password after first login.

## 📦 Key NPM Packages

### Core Dependencies
- `react` & `react-dom` - UI library
- `typescript` - Static typing
- `tailwindcss` - Utility-first CSS framework
- `express` - Web server framework
- `@tanstack/react-query` - Data fetching and caching
- `drizzle-orm` & `drizzle-zod` - Database ORM
- `@neondatabase/serverless` - PostgreSQL client
- `framer-motion` - Animation library
- `zod` - Schema validation
- `passport` & `passport-local` - Authentication
- `react-hook-form` - Form handling
- `wouter` - Routing
- `@sendgrid/mail` - Email sending (optional)
- `express-session` - Session management

### UI Component Libraries
- Various `@radix-ui` components
- `class-variance-authority` - Component styling
- `lucide-react` - Icon library
- `react-icons` - Additional icons
- `recharts` - Data visualization
- `date-fns` - Date formatting/manipulation

## 🚢 Deployment

This project can be deployed on any hosting service that supports Node.js applications. 

### Deployment Prerequisites
1. A PostgreSQL database (e.g., Neon, Supabase, or any other provider)
2. Node.js hosting environment

### Deployment Steps
1. Build the project:
```bash
npm run build
```

2. Set the required environment variables on your hosting platform
3. Start the production server:
```bash
npm start
```

## 🌐 Project Structure

```
/
├── client/                # Frontend React application
│   ├── public/            # Static assets
│   └── src/
│       ├── assets/        # Images, icons, etc.
│       ├── components/    # UI components
│       ├── hooks/         # Custom React hooks
│       ├── lib/           # Utility functions
│       └── pages/         # Page components
│
├── server/                # Express backend
│   ├── auth.ts            # Authentication logic
│   ├── db.ts              # Database connection
│   ├── index.ts           # Server entry point
│   ├── routes.ts          # API routes
│   ├── storage.ts         # Data access layer
│   └── vite.ts            # Vite integration
│
├── shared/                # Shared code between client and server
│   └── schema.ts          # Database schema and types
│
├── drizzle.config.ts      # Drizzle ORM configuration
├── package.json           # Project dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── README.md              # Project documentation
```

## 🛣️ API Endpoints

### Authentication
- `POST /api/register` - Register a new user
- `POST /api/login` - Log in
- `POST /api/logout` - Log out
- `GET /api/user` - Get current user

### Projects
- `GET /api/projects` - Get all projects
- `GET /api/projects/:id` - Get a specific project
- `POST /api/projects` - Create a project (admin only)
- `PATCH /api/projects/:id` - Update a project (admin only)
- `DELETE /api/projects/:id` - Delete a project (admin only)

### Blog Posts
- `GET /api/blogs` - Get all blog posts
- `GET /api/blogs/:id` - Get a specific blog post
- `POST /api/blogs` - Create a blog post (admin only)
- `PATCH /api/blogs/:id` - Update a blog post (admin only)
- `DELETE /api/blogs/:id` - Delete a blog post (admin only)

### Achievements
- `GET /api/achievements` - Get all achievements
- `GET /api/achievements/:id` - Get a specific achievement
- `POST /api/achievements` - Create an achievement (admin only)
- `PATCH /api/achievements/:id` - Update an achievement (admin only)
- `DELETE /api/achievements/:id` - Delete an achievement (admin only)

### Additional endpoints for skills, testimonials, contact info, etc.

## 🧩 Additional Features

### Email Contact Form
The application includes an optional contact form that uses SendGrid to send emails:

1. Set up a SendGrid account and get an API key
2. Add the key to your environment variables
3. The contact form will automatically work


## 🔍 Important Notes

1. The admin dashboard is protected and requires authentication
2. The database is set up with Drizzle ORM - refer to shared/schema.ts for the data model
3. Make sure to secure your production environment with proper HTTPS configuration
4. Update the admin password after the first login for security
5. The site is fully responsive and works on mobile devices

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 📝 Contact

For any questions or issues, please contact satya@example.com or open an issue on the GitHub repository.
