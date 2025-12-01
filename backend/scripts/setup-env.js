#!/usr/bin/env node

/**
 * Setup script to help users create .env file from env.example
 * Usage: node scripts/setup-env.js
 */

const fs = require('fs');
const path = require('path');
const crypto = require('crypto');

const envExamplePath = path.resolve(__dirname, '../env.example');
const envPath = path.resolve(__dirname, '../.env');

function generateJWTSecret() {
  return crypto.randomBytes(32).toString('base64');
}

function main() {
  console.log('\n🚀 Environment Setup Script\n');
  console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');

  // Check if .env already exists
  if (fs.existsSync(envPath)) {
    console.log('⚠️  .env file already exists!');
    console.log(`   Location: ${envPath}\n`);
    console.log('If you want to recreate it, delete the existing file first.');
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    process.exit(0);
  }

  // Check if env.example exists
  if (!fs.existsSync(envExamplePath)) {
    console.log('❌ env.example file not found!');
    console.log(`   Expected location: ${envExamplePath}\n`);
    console.log('Please ensure env.example exists in the backend/ directory.');
    process.exit(1);
  }

  // Read env.example
  let envContent = fs.readFileSync(envExamplePath, 'utf8');

  // Generate JWT_SECRET if it's empty
  const jwtSecret = generateJWTSecret();
  envContent = envContent.replace(/^JWT_SECRET=.*$/m, `JWT_SECRET=${jwtSecret}`);

  // Write .env file
  try {
    fs.writeFileSync(envPath, envContent, 'utf8');
    console.log('✅ Created .env file successfully!');
    console.log(`   Location: ${envPath}\n`);
    console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
    console.log('📝 NEXT STEPS:\n');
    console.log('1. Edit the .env file and fill in the required values:');
    console.log('   - MONGODB_URI: Your MongoDB connection string');
    console.log('   - FRONTEND_URL: Your frontend URL (default: http://localhost:3000)');
    console.log('   - JWT_SECRET: Already generated ✓');
    console.log('\n2. Optional configuration:');
    console.log('   - Google OAuth credentials (GOOGLE_CLIENT_ID, GOOGLE_CLIENT_SECRET)');
    console.log('   - Email service credentials (EMAIL_USER, EMAIL_PASS)');
    console.log('\n3. See SETUP_GUIDE.md for detailed instructions.');
    console.log('\n━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━\n');
  } catch (error) {
    console.error('❌ Error creating .env file:', error.message);
    process.exit(1);
  }
}

main();

