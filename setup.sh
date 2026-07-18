#!/bin/bash
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║     LuxEstate — Setup Script             ║"
echo "╚══════════════════════════════════════════╝"
echo ""

# Check if password was provided
if [ -z "$1" ]; then
  echo "Usage: bash setup.sh YOUR_MONGODB_PASSWORD"
  echo ""
  echo "Example: bash setup.sh MyPassword123"
  exit 1
fi

DB_PASSWORD=$1
MONGODB_URI="mongodb+srv://khizar:${DB_PASSWORD}@cluster0.bvopf8y.mongodb.net/LuxEstate?retryWrites=true&w=majority&appName=Cluster0"

echo "1. Writing backend .env..."
cat > backend/.env << EOF
PORT=5000
MONGODB_URI=${MONGODB_URI}
JWT_SECRET=luxestate_super_secret_jwt_key_2024
JWT_EXPIRE=30d
NODE_ENV=development
CLIENT_URL=http://localhost:5173
EOF
echo "   ✅ backend/.env created"

echo "2. Writing frontend .env..."
cat > frontend/.env << EOF
VITE_API_URL=http://localhost:5000/api
EOF
echo "   ✅ frontend/.env created"

echo "3. Installing backend dependencies..."
cd backend && npm install 2>&1 | tail -2
echo "   ✅ Backend dependencies installed"

echo "4. Installing frontend dependencies..."
cd ../frontend && npm install 2>&1 | tail -2
echo "   ✅ Frontend dependencies installed"

echo "5. Seeding MongoDB Atlas database..."
cd ../backend && npm run seed
echo ""
echo "╔══════════════════════════════════════════╗"
echo "║  Setup complete! Start the app:          ║"
echo "║  Terminal 1: cd backend && npm start     ║"
echo "║  Terminal 2: cd frontend && npm run dev  ║"
echo "╚══════════════════════════════════════════╝"
echo ""
echo "🌐 Frontend: http://localhost:5173"
echo "🔌 Backend:  http://localhost:5000"
echo ""
echo "Demo logins:"
echo "  Admin:  admin@luxestate.com / admin123"
echo "  Agent:  agent@luxestate.com / agent123"
echo "  Client: client@luxestate.com / client123"
