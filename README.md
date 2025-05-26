# SOP-management

A modern web application for managing Standard Operating Procedures (SOPs) and policies with a React frontend and Node.js backend.

## Features

-  Document management (Upload/View SOPs and Policies)  
-  Advanced search and filtering  
-  Real-time statistics dashboard  
-  Review date tracking with overdue alerts  
-  Department-based categorization  
-  File upload and management  
-  Responsive user interface  

## Technologies Used

### Frontend

- React.js  
- Vite  
- CSS Modules  

### Backend

- Node.js  
- Express.js  
- Multer (File upload handling)  

## Project Structure

```
.
├── frontend/             # React frontend
│   ├── public/           # Static assets
│   ├── src/              # Application source
│   │   ├── assets/       # Images, icons, etc.
│   │   ├── Screens/      # Main application views
│   │   │   └── NewUIScreens.jsx  # Main UI component
│   │   ├── App.jsx       # Root component
│   │   └── main.jsx      # Entry point
│   ├── package.json      # Frontend dependencies
│   └── vite.config.js    # Vite configuration
│
├── server.js             # Backend entry point
├── documents.json        # Database stub
├── package.json          # Backend dependencies
└── uploads/              # File storage directory
```

## Getting Started

### Prerequisites

- Node.js (v18+)  
- npm (v9+)

### Installation

#### 1. Clone the repository

```bash
git clone https://github.com/Rijish13ahuja/SOP-management.git
cd SOP-management
```

#### 2. Install backend dependencies

```bash
npm install
```

#### 3. Create uploads directory

```bash
mkdir uploads
```

#### 4. Install frontend dependencies

```bash
cd frontend
npm install
cd ..
```

## Running the Application

### Start backend server

```bash
npm start
```

### Start frontend development server

```bash
cd frontend
npm run dev
```

### The application will be available at:

- **Backend:** http://localhost:3000  
- **Frontend:** http://localhost:5173

## API Endpoints

| Method | Endpoint         | Description                    |
|--------|------------------|--------------------------------|
| GET    | /documents       | Get all documents with filters |
| POST   | /upload          | Upload new document            |
| GET    | /files/:filename | Download a specific file       |

## Key Dependencies

### Backend

- `express: ^4.18.2`  
- `cors: ^2.8.5`  
- `multer: ^1.4.5-lts.1`

### Frontend

- `react: ^18.2.0`  
- `react-dom: ^18.2.0`  
- `react-icons: ^4.10.1`

## Troubleshooting

- **File upload issues:** Ensure `uploads` directory exists and has write permissions  
- **CORS errors:** Verify backend is running on port 3000 and CORS middleware is enabled  
- **Missing dependencies:** Run `npm install` in both root and frontend directories

