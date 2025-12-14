#!/usr/bin/env node

const fs = require("fs");
const path = require("path");

console.log("🎮 Weekend Warrior - Next.js Setup");
console.log("==================================");

// Check if .env.local exists
const envPath = path.join(__dirname, "..", ".env.local");
if (!fs.existsSync(envPath)) {
  console.log("⚠️  .env.local not found");
  console.log(
    "📝 Please copy .env.example to .env.local and add your credentials:"
  );
  console.log("   - GITHUB_TOKEN (from https://github.com/settings/tokens)");
  console.log("   - MONGODB_URI (from MongoDB Atlas)");
  console.log("");
} else {
  console.log("✅ .env.local found");
}

// Check Node.js version
const nodeVersion = process.version;
const majorVersion = parseInt(nodeVersion.slice(1).split(".")[0]);

if (majorVersion < 18) {
  console.log("⚠️  Node.js version is", nodeVersion);
  console.log("📝 Please upgrade to Node.js 18+ for best compatibility");
  console.log("");
} else {
  console.log("✅ Node.js version:", nodeVersion);
}

console.log("🚀 Ready to start development!");
console.log("   Run: npm run dev");
console.log("");
