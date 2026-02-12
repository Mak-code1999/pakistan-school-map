# MaKtab GIS App - Manual Setup Guide

Since you have already created the `maktab_db` database, follow these steps to complete the setup manually.

## Phase 1: Database Setup (Using pgAdmin 4)

1. **Open pgAdmin 4** and connect to your database server.
2. expand your server -> Databases -> right-click **maktab_db** -> **Query Tool**.
3. Open the file `C:\Users\Lenovo\Desktop\Maktab\database\init_database.sql` (or copy-paste its content).
4. Click the **Execute/Play** button (F5) to run the script.
   - *Success Check:* You should see `CREATE TABLE`, `INSERT 0 1`, etc. in the messages.
   - *Verify:* Right-click `Tables` under `Schemas > public` and Refresh. You should see `schools_province` and `schools_school`.

## Phase 2: Backend Configuration

1. **Edit Environment Variables**
   - Open `C:\Users\Lenovo\Desktop\Maktab\backend\.env` in Notepad/VS Code.
   - Update `DB_PASSWORD` with your actual PostgreSQL password (if it's not "postgres").
   ```ini
   DB_NAME=maktab_db
   DB_USER=postgres
   DB_PASSWORD=your_password_here
   DB_HOST=localhost
   DB_PORT=5432
   ```

2. **Initialize Backend**
   - Open a **Terminal/PowerShell** inside `C:\Users\Lenovo\Desktop\Maktab`.
   - Run the following commands:

   ```powershell
   # 1. Activate Virtual Environment
   .\backend\venv\Scripts\activate

   # 2. Apply Database Migrations (Connects Django to your new tables)
   cd backend
   python manage.py migrate

   # 3. Create Administrator Account (Follow prompts)
   python manage.py createsuperuser

   # 4. Start Backend Server
   python manage.py runserver
   ```

   - *Success Check:* Go to [http://127.0.0.1:8000/api/provinces/](http://127.0.0.1:8000/api/provinces/) in your browser. You should see JSON data for provinces.

## Phase 3: Frontend Setup

1. **Install Dependencies**
   - Open a **New Terminal** (keep the backend running in the first one).
   - Navigate to the frontend folder:
   ```powershell
   cd C:\Users\Lenovo\Desktop\Maktab\frontend
   ```
   - Install libraries:
   ```powershell
   npm install
   ```

2. **Configure Frontend**
   - Create a file named `.env` in the `frontend` folder.
   - Add your Mapbox Token (required for the map to show):
   ```ini
   REACT_APP_MAPBOX_TOKEN=your_mapbox_token_here
   REACT_APP_API_URL=http://127.0.0.1:8000/api
   ```
   *(If you don't have a token yet, sign up at mapbox.com - it's free).*

3. **Start Frontend**
   ```powershell
   npm start
   ```
   - *Success Check:* Your browser should open [http://localhost:3000](http://localhost:3000) showing the Maktab Dashboard.

## Troubleshooting

- **"Connection refused"**: Make sure PostgreSQL is running.
- **"Password authentication failed"**: Check `DB_PASSWORD` in `backend\.env`.
- **"Map not loading"**: Check your internet connection and Mapbox token.
