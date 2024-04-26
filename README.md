# invento 📦

A basic inventory management app built with MERN stack.

![Screenshot of website](screenshots/homepage.png)

## Features
- Jamstack architecture
- Sorting and filtering capabilities for categories
- CRUD operations on items and categories
- Dynamic dashboard with charts
- Form validation on client-side and server-side
- User authentication on server-side when deleting item or category
- Mobile-responsive UI
- SEO optimized

## Installation

Clone repository using Git (or otherwise):
```bash
git clone https://github.com/jchen324/invento.git
```

Navigate to project:
```bash
cd invento
```

### Backend

To install backend dependencies:
```bash
cd server
npm install
```

In the `server` folder create a `.env` file  with the following contents:
```bash
MONGO_STRING="mongodb+srv://terry2017530749:AN7a3TZrQEaLlZqr@invento.xnyzlyn.mongodb.net/invento?retryWrites=true&w=majority"
ADMIN_KEY="1234"
```

Also in the same folder, create a `.env.test` file with the following contents:
```bash
MONGO_STRING="mongodb+srv://admin:admin@invento.xcddxcm.mongodb.net/?retryWrites=true&w=majority&appName=invento"
ADMIN_KEY="1234"
```

To start local server:

```bash
npm run dev
```

Backend is deployed at [http://localhost:3001](http://localhost:3001).

### Frontend

To install dependencies for frontend:
```bash
cd client
npm install
```

To run the development server locally:
```bash
npm run dev
```

Frontend is deployed at [http://localhost:3000](http://localhost:3000).
