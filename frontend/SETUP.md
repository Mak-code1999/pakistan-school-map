# Maktab Frontend Setup Guide

## Prerequisites

- Node.js 18+ and npm
- Backend server running (see backend/SETUP.md)
- Mapbox account (free)

## Step 1: Install Node.js

1. Download Node.js from: https://nodejs.org/
2. Choose the **LTS version** (recommended)
3. Run the installer and follow the setup wizard
4. Verify installation:
```bash
node --version
npm --version
```

## Step 2: Create Mapbox Account

1. Go to: https://www.mapbox.com/
2. Click "Sign up" (it's free!)
3. After signing in, go to: https://account.mapbox.com/
4. Under "Access tokens", you'll see your **Default public token**
5. Copy this token (starts with `pk.`)

## Step 3: Install Dependencies

```bash
# Navigate to frontend folder
cd C:\Users\Lenovo\Desktop\Maktab\frontend

# Install all dependencies
npm install
```

This will install:
- React 18
- Mapbox GL JS
- Mapbox Draw
- Axios
- React Scripts

Installation may take 2-3 minutes.

## Step 4: Configure Environment Variables

1. Copy the example environment file:
```bash
copy .env.example .env
```

2. Open `.env` in a text editor and update:
```
REACT_APP_MAPBOX_TOKEN=pk.your_mapbox_token_here
REACT_APP_API_URL=http://localhost:8000/api
```

Replace `pk.your_mapbox_token_here` with your actual Mapbox token from Step 2.

**IMPORTANT**: The token must start with `pk.` (public key).

## Step 5: Start Development Server

```bash
npm start
```

The app will automatically open in your browser at: http://localhost:3000

You should see:
- Dark-themed map centered on Pakistan
- Province boundaries with cyan borders
- School markers (colored by category)
- Search bar at the top
- Legend in bottom-right corner

## Step 6: Test Features

### Test 1: View Map
- You should see Pakistan's provinces outlined
- Zoom in/out using mouse wheel or controls
- Pan by clicking and dragging

### Test 2: Search Province
- Type "Punjab" in the search bar
- Click the search button
- Map should zoom to Punjab
- Stats panel should appear on the left showing school count

### Test 3: Add School
- Click the point tool (top-right controls)
- Click anywhere on the map
- A form should appear
- Enter school name (e.g., "Test School")
- Select category
- Click "Add School"
- New marker should appear on the map

### Test 4: Click Province
- Click directly on any province boundary
- Stats panel should show school count for that province

## Troubleshooting

### Error: "Invalid Mapbox token"

**Solution**: 
1. Check your `.env` file
2. Make sure token starts with `pk.`
3. Copy the token again from Mapbox account page
4. Restart the dev server: `Ctrl+C` then `npm start`

### Error: "Network Error" or "Failed to fetch"

**Solution**: 
1. Make sure backend is running: http://localhost:8000/api/provinces/
2. Check CORS settings in backend `settings.py`
3. Verify `.env` has correct `REACT_APP_API_URL`

### Map doesn't load / blank screen

**Solution**:
1. Open browser console (F12)
2. Check for errors
3. Verify Mapbox token is valid
4. Try refreshing the page

### Schools don't appear

**Solution**:
1. Check backend is running
2. Visit: http://localhost:8000/api/schools/
3. You should see GeoJSON with 100 schools
4. If empty, re-run database initialization script

## Building for Production

```bash
npm run build
```

This creates an optimized production build in the `build/` folder.

## Next Steps

- Customize the map style in `Map.jsx`
- Add more school categories
- Implement user authentication
- Deploy to a hosting platform

## Tips

- Keep both backend and frontend servers running simultaneously
- Backend: http://localhost:8000
- Frontend: http://localhost:3000
- Use two separate terminal windows
