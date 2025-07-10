import { storage } from "./storage";

async function initializeDatabase() {
  try {
    console.log("Initializing database with dummy data...");
    await (storage as any).initializeDefaultData();
    console.log("Database initialized successfully!");
  } catch (error) {
    console.error("Error initializing database:", error);
  }
}

// Only run initialization in development mode
if (process.env.NODE_ENV === 'development') {
  initializeDatabase();
}

export { initializeDatabase };