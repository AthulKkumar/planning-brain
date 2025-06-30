#  Planning Brain

A simple REST API for maritime voyage planning and optimization.

##  Setup Instructions

### Using Docker (Recommended)
```bash
# Clone the repository
git clone <your-repo-url>
cd planning-brain

# Copy environment file
cp env.example .env

# Start the application with Docker
npm run docker:dev
```

The API will be available at `http://localhost:3000`

### Local Development
```bash
# Install dependencies
npm install

# Copy environment file
cp env.example .env

# Start MongoDB locally (required)
# Then start the server
npm start
```

##  API Documentation

### Base URL
```
http://localhost:3000/api/v1
```

### 1. Plan Voyage
Creates an optimized voyage plan for a ship.

**POST** `/plan-voyage`

```json
{
  "shipId": "ship123",
  "origin": "Port A", 
  "destination": "Port B",
  "departureTime": "2024-01-15T08:00:00Z",
  "cargoLoad": 1500,
  "weatherForecast": {
    "forecast": "calm",
    "windSpeed": 10
  }
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "voyageId": "voyage123",
    "plan": {
      "estimatedArrival": "2024-01-16T14:00:00Z",
      "expectedFuelUse": 120.5,
      "plannedSpeed": 25,
      "route": ["Port A", "Port A-waypoint", "Port B"]
    }
  }
}
```

### 2. Get Plan History
Retrieves previous voyage plans with pagination.

**GET** `/plan-history?page=1&limit=10`

### 3. Submit Feedback
Records actual voyage data for plan optimization.

**POST** `/feedback`
```json
{
  "voyageId": "voyage123",
  "actualData": {
    "actualArrival": "2024-01-16T14:30:00Z",
    "actualFuelUsed": 125,
    "actualSpeed": 24
  }
}
```

### 4. Maintenance Alerts
Gets ship maintenance schedules and alerts.

**GET** `/maintenance-alerts`



### **Data Models**
- **Ships**: Engine types (diesel, gas_turbine, electric, hybrid)
- **Voyages**: Complete planning and actual performance data
- **Maintenance**: Scheduling and alert system
- **Fuel Logs**: Consumption tracking and analysis

##  Environment Variables

Copy `env.example` to `.env`:

```bash
NODE_ENV=development
PORT=3000
MONGODB_URI=mongodb://127.0.0.1:27017/planning-brain
```

## Docker Commands

```bash
# Start development environment
npm run docker:dev

# Stop containers  
npm run docker:down

# Build image
npm run docker:build
```
