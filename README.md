# CS422 Software Testing & Debugging Final Project - invento 📦

**Team members: Jiarui Chen, Taiming Shi, Nora Xu**

Testing on a basic inventory management app built with MERN stack.

![Screenshot of website](screenshots/homepage.png)

## App Features
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

### Frontend

To install dependencies for frontend:
```bash
cd client
npm install
```

## How to Run The Tests

### Backend Tests
TODO

### Frontend Tests
Go to server folder 
```bash
cd server
```
Run the server with frontend test database
```bash
npm run dev:test
```

Start a second terminal and go to client folder
```bash
cd client
```

Run the client server
```bash
npm run dev
```

Start a third terminal and go to client folder
```bash
cd client
```

Run the Cypress component and e2e tests on command line
```bash
npm run test
```

Alternatively, run the Cypress component and e2e tests on Cypress UI
```bash
npm run cypress:open
```

## How to Run The Program Without Testing

### Backend
```bash
cd server
npm run dev
```

### Frontend
```bash
cd client
npm run dev
```

Use [http://localhost:3000](http://localhost:3000) to access the app.
