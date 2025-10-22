// Production Database Setup Script
const { MongoClient } = require('mongodb');

async function setupProductionDatabase() {
  console.log('🔧 Setting up production database...');
  
  // You'll replace this with your MongoDB Atlas connection string
  const PRODUCTION_MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://username:password@cluster.mongodb.net/stocks_app';
  
  try {
    console.log('📡 Connecting to MongoDB Atlas...');
    const client = new MongoClient(PRODUCTION_MONGODB_URI);
    await client.connect();
    
    console.log('✅ Connected to MongoDB Atlas successfully!');
    
    // Test database operations
    const db = client.db('stocks_app');
    
    // Create collections if they don't exist
    const collections = ['users', 'preferences', 'sessions'];
    
    for (const collectionName of collections) {
      try {
        await db.createCollection(collectionName);
        console.log(`✅ Created collection: ${collectionName}`);
      } catch (error) {
        if (error.code === 48) {
          console.log(`ℹ️  Collection ${collectionName} already exists`);
        } else {
          console.error(`❌ Error creating collection ${collectionName}:`, error.message);
        }
      }
    }
    
    // Create indexes for better performance
    await db.collection('users').createIndex({ email: 1 }, { unique: true });
    await db.collection('sessions').createIndex({ expiresAt: 1 }, { expireAfterSeconds: 0 });
    
    console.log('✅ Database indexes created successfully!');
    
    await client.close();
    console.log('🎉 Production database setup completed!');
    
  } catch (error) {
    console.error('❌ Database setup failed:', error.message);
    console.log('\n📋 Troubleshooting steps:');
    console.log('1. Verify your MongoDB Atlas connection string');
    console.log('2. Check if your IP is whitelisted (0.0.0.0/0 for all IPs)');
    console.log('3. Ensure database user has read/write permissions');
    console.log('4. Verify the database name in your connection string');
  }
}

// Run the setup
setupProductionDatabase();