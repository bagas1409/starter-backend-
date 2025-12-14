# Backend Express Starter

Minimal, clean, and scalable Express.js backend starter kit. Designed to be production-ready with security best practices, logging, and error handling.

## Features

- **ES Modules**: Uses modern JavaScript specificiation (`import`/`export`).
- **Security**: Pre-configured with `helmet` and `cors`.
- **Logging**: Request logging with `morgan`.
- **Error Handling**: Global error handler and 404 catcher.
- **Environment**: Configuration via `dotenv`.
- **Structure**: Clean architecture separation (Controllers, Routes, Middlewares).

## Prerequisites

- Node.js (v14+ recommended)
- npm or yarn

## Installation

1. Clone the repository (or extract the project).
2. Install dependencies:

```bash
npm install
```

3. Configure environment variables:
   Copy `.env.example` to `.env`.
   ```bash
   cp .env.example .env
   # or on Windows
   copy .env.example .env
   ```
   
   Adjust the variables in `.env` as needed.

## Running the Project

### Development Mode
Runs with `nodemon` for auto-reloading on file changes.

```bash
npm run dev
```

### Production Mode
Runs the server directly with Node.js.

```bash
npm start
```

## API Endpoints

### Health Check
- **URL**: `/api/health`
- **Method**: `GET`
- **Response**:
  ```json
  {
    "success": true,
    "message": "Success",
    "data": {
      "status": "up",
      "time": "2023-12-14T04:00:00.000Z"
    }
  }
  ```

## Project Structure

```
backend-starter/
├─ src/
│  ├─ config/         # Environment configuration
│  ├─ controllers/    # Request handlers
│  ├─ middlewares/    # Express middlewares (Errors, Auth, etc.)
│  ├─ routes/         # Route definitions
│  ├─ utils/          # Helper functions (Response standardization)
│  ├─ app.js          # App setup (Middlewares, routes mounting)
│  └─ server.js       # Entry point (Server startup)
├─ .env.example       # Example environment variables
└─ package.json       # Dependencies and scripts
```

## Error Handling

Standardized JSON error response format:

```json
{
  "success": false,
  "message": "Error description",
  "stack": "Stack trace (only in development)"
}
```
