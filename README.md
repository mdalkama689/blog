# Blog Application

## Overview

The Blog Application is a platform that allows users to:
- Create, read, update, and delete blog posts
- Register and log in
- Reset their password
- Update user details and profile image
- Search for blog posts by title and content

## Project Structure

The project is organized into two main directories:
- `client`: Contains the React application for the user interface.
- `server`: Contains the Node.js application for server-side logic and API endpoints.

## Setup Instructions

### 1. Clone the Repository

```bash
git clone https://github.com/mdalkama689/blog.git


## Set up the backend
cd backend
npm install

# Create .env file for the backend
echo "MONGO_URI=mongouri
PORT=3001
JWT_SECRET_TOKEN=jwtsecret
CLIENT_URL=http://localhost:3000

# Start the backend server
npm start

# Set up the frontend
cd ../frontend
npm install

# Start the frontend development server
npm run dev
