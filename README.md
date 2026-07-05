# LinkDon

LinkDon is a LinkedIn-inspired networking platform where users can create profiles, connect with other users, share posts, and generate resumes from their profile information.

This project was built to understand how modern social networking platforms work and to gain hands-on experience with full-stack web development.

## Features

- User registration and login
- JWT-based authentication
- Create and update user profiles
- Send and manage connection requests
- Create posts with images
- Like and comment on posts
- View other user profiles
- Generate and download resumes from profile data
- Responsive user interface

## Tech Stack

### Frontend
- React.js
- Redux Toolkit
- Material UI
- Axios

### Backend
- Node.js
- Express.js

### Database
- MongoDB
- Mongoose

### Authentication
- JWT
- bcrypt.js

### Image Storage
- Cloudinary
- Multer

## Project Structure

```text
client/
server/
controllers/
models/
routes/
middleware/
utils/
```

## Installation

### Clone the repository

```bash
git clone <your-repository-link>
```

### Move into the project folder

```bash
cd LinkDon
```

### Install dependencies

Frontend:

```bash
cd client
npm install
```

Backend:

```bash
cd server
npm install
```

### Create a .env file

```env
MONGO_URI=
JWT_SECRET=
CLOUDINARY_CLOUD_NAME=
CLOUDINARY_API_KEY=
CLOUDINARY_API_SECRET=
```

### Start the application

Backend:

```bash
npm run dev
```

Frontend:

```bash
npm run dev
```

## Screenshots

Add screenshots of:

- Login page
- Home feed
- User profile
- Connection requests
- Resume generation feature

## What I Learned

While building this project, I learned:

- State management using Redux Toolkit
- JWT authentication and authorization
- REST API development using Express.js
- MongoDB schema design
- Image upload and storage using Cloudinary
- Frontend and backend integration

## Future Improvements

- Real-time messaging
- Notifications
- Better search and user discovery
- Job posting functionality
- Dark mode

## Author

Dharmil Parmar
