# Messenger (React Frontend)

A modern, real-time messaging interface built with React.  
Designed for performance, clean state management, and scalable UI architecture.

This frontend integrates with a Node.js backend and delivers a responsive, real-time chat experience with authentication, pagination, live presence tracking, and profile management.

---

## Application Preview

<img width="2238" height="1346" alt="Messenger Dashboard" src="https://github.com/user-attachments/assets/b3a85198-5f6f-4b61-9a81-a916894fd01e" />

---

## Core Features

### Authentication & Route Protection
- JWT-based authentication
- Persistent sessions using local storage
- Protected routes with guarded navigation
- Secure logout handling

---

## Landing Page

Clean and minimal authentication interface with responsive layout.

<img width="2758" height="1346" alt="Landing Page 1" src="https://github.com/user-attachments/assets/9920d979-cfea-41ff-baed-bcb23996abde" />

<img width="2758" height="1602" alt="Landing Page 2" src="https://github.com/user-attachments/assets/be697d9d-8b46-4cae-a995-b8f9505d52d3" />

---

## Application Window

### Elastic User Search
- Real-time username search
- Regex-powered backend queries
- Debounced API requests
- Dynamic contact list updates

<img width="2758" height="1346" alt="App Window" src="https://github.com/user-attachments/assets/39f2eac8-5d9c-46d5-85be-7528307f8bc1" />

---

## Chat Window

### Real-Time Messaging
- Instant message delivery via Socket.io
- Typing indicator
- Online / Offline presence status
- Last seen formatting
- Optimistic message rendering

### Performance Optimization
- Cursor-based pagination
- Infinite scroll for message history
- Scroll position preservation
- Auto-scroll to latest message

<img width="2758" height="1346" alt="Chat Window" src="https://github.com/user-attachments/assets/67340dd4-156e-4cb9-b3cd-006e6c2b8c23" />

---

## Profile Management

- Update full name and bio
- Profile picture upload
- Blob preview before saving
- Cloudinary-based image storage
- Profile picture removal
- Derived state validation for update button

<img width="2758" height="1346" alt="Profile Window" src="https://github.com/user-attachments/assets/cb3447f1-2a8e-4fb6-85fb-8a2d6493bbd6" />

---

## Frontend Architecture

### Tech Stack
- React (Vite)
- Context API for global state management
- Socket.io Client
- Axios for API communication
- GSAP for UI animations
- Tailwind CSS for styling

---

## State Management Highlights

- Global chat context for centralized message handling
- Derived UI state instead of redundant effects
- Optimistic UI updates for instant feedback
- Memory-safe Blob URL handling for image previews
- Scroll-aware message container logic

---

## Performance Considerations

- Cursor-based pagination (avoids offset performance issues)
- Debounced search requests
- Conditional auto-scroll logic
- Efficient WebSocket event handling
- Skeleton loaders for image rendering

---

## Project Structure

```
src/
├── components/
├── context/
├── pages/
├── assets/
├── App.jsx
└── main.jsx
```
## What This Frontend Demonstrates

- Real-time UI architecture
- Advanced React state design
- WebSocket integration
- Infinite scroll implementation
- Profile image preview logic
- Clean component modularization
- Scalable UI structure


## Author

Developed with a focus on real-time performance, clean architecture, and production-ready frontend patterns.

