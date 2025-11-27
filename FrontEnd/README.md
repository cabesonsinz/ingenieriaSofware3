# EventHub - Event Management System with React Router

A modern, fully-featured event and reservation management system built with React Router v6+, Tailwind CSS, and localStorage for data persistence.

## Features

- **Event Discovery**: Browse and filter events by category, search by title or description
- **User Authentication**: Sign up, login, and account management
- **Reservations**: Book tickets to events with real-time availability tracking
- **User Dashboard**: View your reservations, account info, and manage bookings
- **Admin Dashboard**: 
  - Overview with key metrics (revenue, total reservations, attendees)
  - Event management with capacity tracking
  - Reservation monitoring
  - Email history and communications log
- **Email Simulation**: System generates confirmation, cancellation, and reminder emails
- **Notifications**: In-app toast notifications for all actions
- **Responsive Design**: Works seamlessly on desktop, tablet, and mobile devices

## Tech Stack

- **Frontend**: React 19 with TypeScript
- **Routing**: React Router v7
- **Styling**: Tailwind CSS v4 with custom theme
- **Data**: localStorage for persistence
- **Build**: Vite

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

1. Clone the repository
2. Install dependencies:
   \`\`\`bash
   npm install
   \`\`\`

3. Start the development server:
   \`\`\`bash
   npm run dev
   \`\`\`

4. Build for production:
   \`\`\`bash
   npm run build
   \`\`\`

## Project Structure

\`\`\`
src/
├── pages/              # Page components (routes)
│   ├── home.tsx
│   ├── login.tsx
│   ├── signup.tsx
│   ├── event-detail.tsx
│   ├── reservations.tsx
│   ├── admin.tsx
│   ├── admin-emails.tsx
│   ├── confirmation.tsx
│   └── not-found.tsx
├── components/         # Reusable components
│   ├── navigation.tsx
│   ├── protected-route.tsx
│   ├── booking-form.tsx
│   ├── reservation-confirmation.tsx
│   ├── email-history.tsx
│   ├── notifications-center.tsx
│   └── admin-setup.tsx
├── contexts/          # React contexts for state
│   ├── auth-context.tsx
│   ├── data-context.tsx
│   └── notifications-context.tsx
├── services/          # Business logic services
│   └── email-service.ts
├── App.tsx            # Main app component with routing
├── index.tsx          # Entry point
└── globals.css        # Global styles and theme
\`\`\`

## Key Routes

- `/` - Home page with event discovery
- `/login` - User login
- `/signup` - User registration
- `/events/:id` - Event details and booking
- `/reservations` - User's reservations (protected)
- `/confirmation` - Reservation confirmation (protected)
- `/admin` - Admin dashboard (admin only)
- `/admin/emails` - Email history (admin only)

## Demo Account

- Email: `admin@example.com`
- Password: `admin123`

The demo account has admin privileges. You can also create your own user account via the signup page.

## Features Explained

### Authentication
- New users can sign up with email, name, and password
- Existing users can log in
- First user automatically gets admin role
- Credentials stored in localStorage

### Event Management
- Events display with availability percentage
- Real-time ticket count updates
- Price and category filtering
- Search functionality

### Reservation System
- Users can book 1-10 tickets per event
- Automatic email confirmation generation
- Capacity management with overfill prevention
- Cancellation with refund tracking

### Admin Features
- Overview dashboard with key metrics
- Event occupancy tracking
- Reservation monitoring
- Email history viewer with filtering by type

### Email System
- Automatic confirmation emails on booking
- Cancellation emails with refund amounts
- Reminder emails for upcoming events
- Email history stored and viewable in admin panel

## Customization

### Theme Colors
Edit `src/globals.css` to customize the color palette:
- Primary (Blue): Professional blue for main actions
- Secondary (Gray): Soft gray for backgrounds
- Accent (Green): Vibrant green for highlights

### Adding More Events
Edit the `INITIAL_EVENTS` array in `src/contexts/data-context.tsx` to add more demo events.

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+

## License

MIT

## Backend Setup

The project now includes a Django backend to serve the API.

### Prerequisites

- Python 3.8+
- pip

### Installation and Running

1. Navigate to the `Backend` directory:
   ```bash
   cd ../Backend
   ```

2. Install dependencies:
   ```bash
   pip install django djangorestframework django-cors-headers
   ```

3. Run migrations:
   ```bash
   python manage.py migrate
   ```

4. Start the server:
   ```bash
   python manage.py runserver
   ```

The API will be available at `http://localhost:8000/api/`.

### API Endpoints

- **Users**: `/api/users/`
- **Events**: `/api/events/`
- **Reservations**: `/api/reservations/`

### Admin Credentials

To access the Django admin panel at `http://localhost:8000/admin/`, use the following credentials:

- **Email/Username**: `admin@example.com` / `admin`
- **Password**: `admin123`
