# Ticket Booking System

A modern, full-featured ticket booking system built with HTML, CSS, and JavaScript. Data is stored locally using JSON (localStorage).

## Features

- **Dashboard**: Overview with statistics and recent ticket sales
- **Event Management**: Add, edit, and delete events with venue and organizer information
- **Ticket Management**: Manage ticket sales, bookings, and customer tickets
- **Customer Management**: Store and manage customer information
- **Organizer Management**: Track event organizers and their specialties
- **Venue Management**: Manage event venues and their capacity
- **Local Data Storage**: All data persists using browser localStorage
- **Data Import/Export**: Backup and restore system data
- **Responsive Design**: Works on desktop and mobile devices

## Color Scheme

- **Primary**: #3B82F6 (Blue)
- **Secondary**: #1E293B (Dark Slate)
- **Accent**: #8B5CF6 (Purple)
- **Background**: #F8FAFC (Light Gray)
- **Text**: #1E293B (Dark Slate)
- **Success**: #10B981 (Green)
- **Danger**: #EF4444 (Red)
- **White**: #FFFFFF
- **Border**: #E2E8F0 (Light Border)

## How to Use

1. Open `index.html` in a modern web browser
2. Login with demo credentials: `admin@tickets.com` / `admin123`
3. Navigate between sections using the sidebar menu
4. Use the "Add" buttons to create new entries
5. Click "Edit" to modify existing entries
6. Click "Delete" to remove entries (with confirmation)

## System Architecture

### Core Entities
- **Events**: Event details, date, time, category, venue, organizer
- **Tickets**: Individual ticket sales with seat numbers and status
- **Customers**: Customer information and contact details
- **Organizers**: Event organizers and their specialties
- **Venues**: Event locations with capacity and type

### Features
- **Event Categories**: Music, Sports, Conference, Theater, Comedy, Other
- **Venue Types**: Arena, Stadium, Convention Center, Theater, Club, Outdoor
- **Ticket Status**: Pending, Confirmed, Cancelled
- **Event Status**: Available, Sold Out, Cancelled

## Data Storage

All data is stored in the browser's localStorage as JSON. The system includes sample data on first load. Data persists between sessions.

## Browser Compatibility

Works in all modern browsers that support:
- HTML5
- CSS3
- ES6 JavaScript
- localStorage API
- Chart.js for visualizations

## Project Structure

- `index.html` - Main HTML structure with all sections
- `styles.css` - All styling and responsive design
- `app.js` - JavaScript application logic and data management
- `README.md` - Documentation

## Demo Data

The system comes with sample data including:
- 2 sample events (Rock Concert, Tech Conference)
- 1 sample ticket
- 2 customers
- 2 organizers
- 2 venues

## Key Improvements Over Hotel System

1. **Event-focused Design**: Replaced room management with comprehensive event management
2. **Venue Integration**: Added venue management for event locations
3. **Organizer System**: Added event organizer tracking
4. **Ticket Status Management**: Implemented proper ticket lifecycle management
5. **Enhanced Analytics**: Updated charts for ticket sales and event performance
6. **Modern UI Design**: Updated color scheme and styling with gradients and animations
7. **Accessibility**: Added proper focus management and keyboard navigation
8. **Responsive Design**: Improved mobile experience with collapsible sidebar

## Authentication

- User registration and login system
- Demo admin account: `admin@tickets.com` / `admin123`
- Role-based access (admin/user)
- Session management with localStorage

## Data Management

- **Export**: Download all data or users-only as JSON
- **Import**: Restore data from JSON backup files
- **Reset**: Clear all data and restore defaults
- **Statistics**: Real-time data counts and analytics
