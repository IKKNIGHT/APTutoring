# AP Tutoring Hub

A modern, full-stack tutoring calendar application built with React, TypeScript, Supabase, and Netlify.

## 🚀 Features

- **40 AP Classes** - Complete coverage of all Advanced Placement subjects
- **Real-time RSVP System** - Students can book tutoring sessions instantly
- **Email Confirmations** - Automated confirmations with Google Meet links
- **Responsive Design** - Works perfectly on desktop and mobile
- **UTC Time Support** - Consistent scheduling across time zones

## 🛠️ Tech Stack

- **Frontend**: React 18, TypeScript, Vite, TailwindCSS
- **Backend**: Supabase (PostgreSQL, Authentication, Real-time)
- **UI Components**: Radix UI + shadcn/ui
- **Deployment**: Netlify
- **State Management**: TanStack Query

## 📊 Database Schema

### Classes Table

```sql
- id: integer (primary key)
- name: text (unique)
- meet_link: text
- category: text
- created_at: timestamp
```

### Events Table

```sql
- id: integer (primary key)
- class_id: integer (foreign key)
- datetime: timestamp (UTC)
- description: text
- created_at: timestamp
```

### RSVPs Table

```sql
- id: integer (primary key)
- event_id: integer (foreign key)
- name: text
- email: text
- created_at: timestamp
- UNIQUE(event_id, email) -- Prevents duplicate RSVPs
```

## 🌐 Live Demo

Visit the live application at: [Your Netlify URL]

## 📱 Usage

1. **Browse Classes** - View all 40 AP subjects on the dashboard
2. **Select a Class** - Click any class to see upcoming tutoring sessions
3. **RSVP for Sessions** - Book your spot with name and email
4. **Get Confirmation** - Receive email with session details and Google Meet link

## 🔧 Environment Variables

For deployment, set these environment variables in your `.env` file or Netlify dashboard:

```bash
# Supabase Configuration
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key

# Email Service (Resend)
VITE_RESEND_API_KEY=re_your-resend-api-key
VITE_FROM_EMAIL=noreply@your-domain.com
```

### Email Setup Instructions

1. **Sign up for Resend**: Go to [resend.com](https://resend.com) and create an account
2. **Get API Key**: Generate an API key in your Resend dashboard
3. **Verify Domain**: Add and verify your sending domain (or use resend.dev for testing)
4. **Set Environment Variables**: Add the Resend API key and from email to your environment

## 🚀 Deployment

The app is configured for automatic deployment on Netlify:

1. **Build Command**: `npm run build:client`
2. **Publish Directory**: `dist/spa`
3. **Environment Variables**: Set in Netlify dashboard
4. **Redirects**: Configured in `netlify.toml` for SPA routing

## 🎯 Key Features

- **Duplicate Prevention**: Users can't RSVP twice for the same event
- **Real-time Updates**: Live data from Supabase
- **Error Handling**: Graceful fallbacks and loading states
- **Responsive**: Mobile-first design
- **Accessible**: Built with Radix UI primitives

## 📧 Email Integration

RSVPs trigger automated email confirmations containing:

- Class name and description
- Session date and time (UTC)
- Google Meet link for the session
- Student's booking confirmation

Built with ❤️ for AP students everywhere.
