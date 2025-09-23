# Blog Application 📝

A full-featured blog application built with React, featuring user authentication, rich text editing, image uploads, and a modern responsive design. Built with Appwrite as the backend service.

## ✨ Features
-   **User Authentication** - Secure login and registration system
-   **Rich Text Editor** - TinyMCE integration for creating beautiful blog posts
-   **Image Upload** - Featured image support with Appwrite Storage
-   **Real-time Validation** - Form validation with React Hook Form
-   **State Management** - Redux for global state management
-   **Post Management** - Create, read, update, and delete blog posts
-   **Slug Generation** - Automatic URL-friendly slug creation
-   **Status Management** - Draft and published post states

## 🛠️ Tech Stack

### Frontend
-   **React** - Modern JavaScript library for building user interfaces
-   **Redux Toolkit** - State management
-   **React Router Dom** - Client-side routing
-   **React Hook Form** - Form handling and validation
-   **TinyMCE** - Rich text editor for content creation
-   **Tailwind CSS** - Utility-first CSS framework
-   **HTML React Parser** - Parse HTML content safely

### Backend & Services
-   **Appwrite** - Open-source backend as a service
    -   Authentication
    -   Storage (File uploads)

## 🔧 Key Features Implementation

### Authentication System
-   Protected routes using `AuthLayout` component
-   Redux state management for user sessions
-   Appwrite authentication integration
-   Automatic login state persistence

### Image Handling
-   Appwrite Storage integration for file uploads
-   Fallback to `getFileView` for free tier compatibility
-   Image preview functionality
-   Automatic cleanup of old images when updating posts

### Form Management
-   React Hook Form for efficient form handling
-   Real-time validation with user-friendly error messages
-   Automatic slug generation from post titles
-   Loading states and progress indicators

### Rich Text Editing
-   TinyMCE integration for content creation
-   HTML content parsing for safe rendering
-   Responsive editor configuration
