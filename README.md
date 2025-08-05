# Start both frontend and backend containers
docker-compose up --build -d

# Check if running
docker-compose ps

# View logs
docker-compose logs

# Stop everything
docker-compose down


Access:

Frontend: http://localhost:3000
Backend API: http://localhost:8000