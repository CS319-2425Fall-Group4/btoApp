// Set test environment
process.env.NODE_ENV = 'test';
process.env.PORT = 5001;

// Database config for testing
process.env.DB_NAME = 'pern_db';
process.env.DB_USER = 'postgres';
process.env.DB_PASSWORD = 'postgres';
process.env.DB_HOST = 'database';