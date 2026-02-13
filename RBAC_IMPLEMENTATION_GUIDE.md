# 🔐 **ROLE-BASED ACCESS CONTROL (RBAC) IMPLEMENTATION GUIDE**

## **Overview**

This guide explains how to add user authentication and role-based permissions to the Pakistan School Map application.

---

## **1. USER ROLES DEFINITION**

### **Role Hierarchy:**

```
PUBLIC → REGISTERED_USER → MODERATOR → ADMIN
```

| Role | Permissions |
|------|-------------|
| **PUBLIC** | View map, view schools, view stats |
| **REGISTERED_USER** | + Add schools (pending approval), edit own schools |
| **MODERATOR** | + Approve schools, edit any school |
| **ADMIN** | + Delete schools, manage users, full control |

---

## **2. BACKEND IMPLEMENTATION (Django)**

### **Step 1: Update Models**

```python
# backend/schools/models.py
from django.contrib.auth.models import User
from django.db import models

class School(models.Model):
    # Existing fields...
    name = models.CharField(max_length=255)
    category = models.CharField(max_length=50)
    geom = models.PointField(srid=4326)
    
    # NEW FIELDS FOR RBAC
    created_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, related_name='schools')
    is_approved = models.BooleanField(default=False)
    approved_by = models.ForeignKey(User, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_schools')
    approved_at = models.DateTimeField(null=True, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)
```

### **Step 2: Create User Profile for Roles**

```python
# backend/schools/models.py
class UserProfile(models.Model):
    ROLE_CHOICES = [
        ('user', 'Registered User'),
        ('moderator', 'Moderator'),
        ('admin', 'Admin'),
    ]
    
    user = models.OneToOneField(User, on_delete=models.CASCADE, related_name='profile')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='user')
    
    def __str__(self):
        return f"{self.user.username} - {self.role}"
```

### **Step 3: Create Custom Permissions**

```python
# backend/schools/permissions.py
from rest_framework import permissions

class IsAuthenticatedOrReadOnly(permissions.BasePermission):
    """
    Allow read access to anyone, write access only to authenticated users.
    """
    def has_permission(self, request, view):
        if request.method in permissions.SAFE_METHODS:
            return True
        return request.user and request.user.is_authenticated


class IsOwnerOrModeratorOrReadOnly(permissions.BasePermission):
    """
    Allow users to edit their own schools, moderators can edit any.
    """
    def has_object_permission(self, request, view, obj):
        # Read permissions for anyone
        if request.method in permissions.SAFE_METHODS:
            return True
        
        # Write permissions for owner
        if obj.created_by == request.user:
            return True
        
        # Moderators and admins can edit any
        if hasattr(request.user, 'profile'):
            return request.user.profile.role in ['moderator', 'admin']
        
        return False


class IsModeratorOrAdmin(permissions.BasePermission):
    """
    Only moderators and admins can access.
    """
    def has_permission(self, request, view):
        if not request.user or not request.user.is_authenticated:
            return False
        
        if hasattr(request.user, 'profile'):
            return request.user.profile.role in ['moderator', 'admin']
        
        return False
```

### **Step 4: Update Views with Permissions**

```python
# backend/schools/views.py
from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from .permissions import IsAuthenticatedOrReadOnly, IsOwnerOrModeratorOrReadOnly, IsModeratorOrAdmin

class SchoolViewSet(viewsets.ModelViewSet):
    queryset = School.objects.all()
    serializer_class = SchoolSerializer
    permission_classes = [IsAuthenticatedOrReadOnly, IsOwnerOrModeratorOrReadOnly]
    
    def perform_create(self, serializer):
        # Automatically set created_by to current user
        serializer.save(created_by=self.request.user)
    
    def get_queryset(self):
        """
        Filter schools based on user role:
        - Public: Only approved schools
        - Users: Their own schools + approved schools
        - Moderators/Admins: All schools
        """
        user = self.request.user
        
        if not user.is_authenticated:
            # Public users see only approved schools
            return School.objects.filter(is_approved=True)
        
        if hasattr(user, 'profile') and user.profile.role in ['moderator', 'admin']:
            # Moderators and admins see all schools
            return School.objects.all()
        
        # Registered users see approved schools + their own
        return School.objects.filter(
            models.Q(is_approved=True) | models.Q(created_by=user)
        )
    
    @action(detail=True, methods=['post'], permission_classes=[IsModeratorOrAdmin])
    def approve(self, request, pk=None):
        """
        Approve a pending school (moderators/admins only)
        """
        school = self.get_object()
        school.is_approved = True
        school.approved_by = request.user
        school.approved_at = timezone.now()
        school.save()
        
        return Response({'status': 'school approved'})
    
    @action(detail=False, methods=['get'], permission_classes=[IsModeratorOrAdmin])
    def pending(self, request):
        """
        Get all pending schools (moderators/admins only)
        """
        pending_schools = School.objects.filter(is_approved=False)
        serializer = self.get_serializer(pending_schools, many=True)
        return Response(serializer.data)
```

### **Step 5: Add Authentication Endpoints**

```python
# backend/schools/urls.py
from django.urls import path, include
from rest_framework.routers import DefaultRouter
from rest_framework.authtoken.views import obtain_auth_token
from .views import SchoolViewSet, DistrictViewSet, RegisterView

router = DefaultRouter()
router.register(r'schools', SchoolViewSet)
router.register(r'districts', DistrictViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('auth/login/', obtain_auth_token, name='api_token_auth'),
    path('auth/register/', RegisterView.as_view(), name='api_register'),
]
```

### **Step 6: Create Registration View**

```python
# backend/schools/views.py
from rest_framework.views import APIView
from rest_framework.response import Response
from rest_framework import status
from django.contrib.auth.models import User
from .models import UserProfile

class RegisterView(APIView):
    def post(self, request):
        username = request.data.get('username')
        password = request.data.get('password')
        email = request.data.get('email')
        
        if not username or not password:
            return Response({'error': 'Username and password required'}, status=status.HTTP_400_BAD_REQUEST)
        
        if User.objects.filter(username=username).exists():
            return Response({'error': 'Username already exists'}, status=status.HTTP_400_BAD_REQUEST)
        
        # Create user
        user = User.objects.create_user(username=username, password=password, email=email)
        
        # Create user profile with default role
        UserProfile.objects.create(user=user, role='user')
        
        return Response({'message': 'User created successfully'}, status=status.HTTP_201_CREATED)
```

---

## **3. FRONTEND IMPLEMENTATION (React)**

### **Step 1: Create Auth Context**

```javascript
// frontend/src/contexts/AuthContext.js
import React, { createContext, useState, useContext, useEffect } from 'react';
import axios from 'axios';

const AuthContext = createContext();

export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [token, setToken] = useState(localStorage.getItem('token'));
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (token) {
            // Verify token and get user info
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            fetchUserProfile();
        } else {
            setLoading(false);
        }
    }, [token]);

    const fetchUserProfile = async () => {
        try {
            const response = await axios.get('/api/auth/profile/');
            setUser(response.data);
        } catch (error) {
            console.error('Failed to fetch user profile', error);
            logout();
        } finally {
            setLoading(false);
        }
    };

    const login = async (username, password) => {
        try {
            const response = await axios.post('/api/auth/login/', { username, password });
            const { token } = response.data;
            
            localStorage.setItem('token', token);
            setToken(token);
            axios.defaults.headers.common['Authorization'] = `Token ${token}`;
            
            await fetchUserProfile();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Login failed' };
        }
    };

    const register = async (username, password, email) => {
        try {
            await axios.post('/api/auth/register/', { username, password, email });
            return { success: true };
        } catch (error) {
            return { success: false, error: error.response?.data?.error || 'Registration failed' };
        }
    };

    const logout = () => {
        localStorage.removeItem('token');
        setToken(null);
        setUser(null);
        delete axios.defaults.headers.common['Authorization'];
    };

    const hasRole = (role) => {
        return user?.profile?.role === role;
    };

    const isModeratorOrAdmin = () => {
        return user?.profile?.role === 'moderator' || user?.profile?.role === 'admin';
    };

    return (
        <AuthContext.Provider value={{
            user,
            token,
            loading,
            login,
            register,
            logout,
            hasRole,
            isModeratorOrAdmin,
            isAuthenticated: !!token
        }}>
            {children}
        </AuthContext.Provider>
    );
};
```

### **Step 2: Create Login Component**

```javascript
// frontend/src/components/Login.jsx
import React, { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import './Login.css';

const Login = ({ onClose }) => {
    const [isLogin, setIsLogin] = useState(true);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [email, setEmail] = useState('');
    const [error, setError] = useState('');
    const { login, register } = useAuth();

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError('');

        if (isLogin) {
            const result = await login(username, password);
            if (result.success) {
                onClose();
            } else {
                setError(result.error);
            }
        } else {
            const result = await register(username, password, email);
            if (result.success) {
                setIsLogin(true);
                setError('');
                alert('Registration successful! Please login.');
            } else {
                setError(result.error);
            }
        }
    };

    return (
        <div className="login-modal">
            <div className="login-content">
                <h2>{isLogin ? 'Login' : 'Register'}</h2>
                
                <form onSubmit={handleSubmit}>
                    <input
                        type="text"
                        placeholder="Username"
                        value={username}
                        onChange={(e) => setUsername(e.target.value)}
                        required
                    />
                    
                    {!isLogin && (
                        <input
                            type="email"
                            placeholder="Email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                        />
                    )}
                    
                    <input
                        type="password"
                        placeholder="Password"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        required
                    />
                    
                    {error && <div className="error">{error}</div>}
                    
                    <button type="submit">{isLogin ? 'Login' : 'Register'}</button>
                </form>
                
                <p>
                    {isLogin ? "Don't have an account?" : "Already have an account?"}
                    <button onClick={() => setIsLogin(!isLogin)}>
                        {isLogin ? 'Register' : 'Login'}
                    </button>
                </p>
                
                <button onClick={onClose}>Close</button>
            </div>
        </div>
    );
};

export default Login;
```

### **Step 3: Update App.jsx**

```javascript
// frontend/src/App.jsx
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';

function AppContent() {
    const { user, logout, isAuthenticated } = useAuth();
    const [showLogin, setShowLogin] = useState(false);

    return (
        <div className="app">
            <header>
                <h1>Pakistan School Map</h1>
                <div className="auth-controls">
                    {isAuthenticated ? (
                        <>
                            <span>Welcome, {user?.username}!</span>
                            <span className="role-badge">{user?.profile?.role}</span>
                            <button onClick={logout}>Logout</button>
                        </>
                    ) : (
                        <button onClick={() => setShowLogin(true)}>Login</button>
                    )}
                </div>
            </header>

            {/* Rest of your app */}
            <Map />
            <Sidebar />

            {showLogin && <Login onClose={() => setShowLogin(false)} />}
        </div>
    );
}

function App() {
    return (
        <AuthProvider>
            <AppContent />
        </AuthProvider>
    );
}

export default App;
```

---

## **4. MIGRATION STEPS**

```bash
# Backend
cd backend
python manage.py makemigrations
python manage.py migrate

# Create superuser (admin)
python manage.py createsuperuser

# Install additional packages
pip install djangorestframework-authtoken
pip freeze > requirements.txt
```

---

## **5. TESTING THE RBAC SYSTEM**

### **Test Scenarios:**

1. **Public User:**
   - Can view map ✅
   - Cannot add schools ❌

2. **Registered User:**
   - Can add schools (pending approval) ✅
   - Can see own schools ✅
   - Cannot approve schools ❌

3. **Moderator:**
   - Can approve pending schools ✅
   - Can edit any school ✅
   - Cannot delete schools ❌

4. **Admin:**
   - Full control ✅
   - Can delete schools ✅
   - Can manage users ✅

---

## **6. DEPLOYMENT CONSIDERATIONS**

- Use HTTPS in production
- Implement JWT tokens instead of basic token auth (more secure)
- Add rate limiting to prevent abuse
- Implement email verification for new users
- Add password reset functionality

---

**This is a complete RBAC implementation guide. Would you like me to implement any specific part?**
