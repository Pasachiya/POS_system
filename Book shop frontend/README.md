# Pahana Edu Online Billing System

A modern, responsive web application for managing customer billing and inventory for Pahana Edu bookshop.

## Features

- 🔐 **Secure Authentication** - JWT-based login system  
- 👥 **Customer Management** - Add, edit, delete, and view customer accounts  
- 📦 **Item Management** - Complete inventory management system  
- 🧾 **Billing System** - Create bills, track payments, and manage transactions  
- 📊 **Dashboard** - Overview of business metrics and statistics  
- 🎨 **Modern UI** - Glassmorphism design with responsive layout  

## Tech Stack

- **Frontend**: React 18, Tailwind CSS, Lucide React Icons  
- **Backend**: Java Spring Boot (API)  
- **Authentication**: JWT  
- **Styling**: Tailwind CSS with custom glassmorphism effects  

## Getting Started

### Prerequisites

- Node.js 16+ and npm  
- Java Spring Boot backend running on port 8080  

### Installation

1. Clone the repository:

```bash
git clone <repository-url>
cd pahana-edu-billing
```

2. Install dependencies:

```bash
npm install
```

3. Create environment file:

```bash
cp .env.example .env
```

4. Update the API URL in `.env`:

```env
REACT_APP_API_BASE_URL=http://localhost:8080/api
```

5. Start the development server:

```bash
npm start
```

The application will open at [http://localhost:3000](http://localhost:3000).

6. Build for production:

```bash
npm run build
```

## Project Structure

```
pahana-edu-billing/
├── public/
│   ├── index.html
│   ├── favicon.ico
│   └── manifest.json
├── src/
│   ├── components/       # React components organized by feature
│   ├── services/         # API service layer
│   ├── hooks/            # Custom React hooks
│   ├── utils/            # Utility functions and constants
│   ├── styles/           # CSS and styling files
│   └── App.jsx           # Main App component
├── .env.example          # Example environment file
├── package.json
└── tailwind.config.js
```

## API Integration

The application integrates with the Pahana Edu backend API:

- Authentication: `/api/auth/login`  
- Customers: `/api/customers`  
- Items: `/api/items`  
- Bills: `/api/bills`  

## Contributing

1. Fork the repository  
2. Create a feature branch  
3. Make your changes  
4. Test thoroughly  
5. Submit a pull request  

## License

This project is licensed under the MIT License.  

## 🚀 Setup Instructions

1. **Create the project structure** using the file tree above.  
2. **Copy the main app code** into `src/App.jsx`.  
3. **Split components** into individual files as shown in the structure.  
4. **Install dependencies**:

```bash
npm install react react-dom lucide-react
npm install -D tailwindcss postcss autoprefixer
```

5. Initialize Tailwind CSS:

```bash
npx tailwindcss init -p
```

This modular structure makes the codebase maintainable, scalable, and easier to work with in a team environment. Each component has a single responsibility, and services are separated from the UI logic.

