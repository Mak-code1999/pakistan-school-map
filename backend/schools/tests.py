from django.test import TestCase
from django.contrib.gis.geos import Point, MultiPolygon, Polygon
from rest_framework.test import APITestCase
from rest_framework import status
from .models import Province, School


class ProvinceModelTest(TestCase):
    """Test Province model."""
    
    def setUp(self):
        # Create a simple polygon for testing
        coords = ((
            (69.0, 30.0), (70.0, 30.0),
            (70.0, 31.0), (69.0, 31.0), (69.0, 30.0)
        ),)
        polygon = Polygon(*coords)
        multipolygon = MultiPolygon(polygon)
        
        self.province = Province.objects.create(
            name='Test Province',
            geom=multipolygon
        )
    
    def test_province_creation(self):
        """Test province is created correctly."""
        self.assertEqual(self.province.name, 'Test Province')
        self.assertIsNotNone(self.province.geom)
    
    def test_province_str(self):
        """Test province string representation."""
        self.assertEqual(str(self.province), 'Test Province')


class SchoolModelTest(TestCase):
    """Test School model."""
    
    def setUp(self):
        # Create province
        coords = ((
            (69.0, 30.0), (70.0, 30.0),
            (70.0, 31.0), (69.0, 31.0), (69.0, 30.0)
        ),)
        polygon = Polygon(*coords)
        multipolygon = MultiPolygon(polygon)
        
        self.province = Province.objects.create(
            name='Test Province',
            geom=multipolygon
        )
        
        # Create school inside province
        point = Point(69.5, 30.5, srid=4326)
        self.school = School.objects.create(
            name='Test School',
            category='primary',
            geom=point
        )
    
    def test_school_creation(self):
        """Test school is created correctly."""
        self.assertEqual(self.school.name, 'Test School')
        self.assertEqual(self.school.category, 'primary')
    
    def test_school_auto_province_assignment(self):
        """Test school is automatically assigned to province."""
        self.assertEqual(self.school.province, self.province)


class ProvinceAPITest(APITestCase):
    """Test Province API endpoints."""
    
    def setUp(self):
        coords = ((
            (69.0, 30.0), (70.0, 30.0),
            (70.0, 31.0), (69.0, 31.0), (69.0, 30.0)
        ),)
        polygon = Polygon(*coords)
        multipolygon = MultiPolygon(polygon)
        
        self.province = Province.objects.create(
            name='Punjab',
            geom=multipolygon
        )
    
    def test_get_provinces(self):
        """Test GET /api/provinces/ returns all provinces."""
        response = self.client.get('/api/provinces/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['features']), 1)
    
    def test_search_province(self):
        """Test province search functionality."""
        response = self.client.get('/api/provinces/search/?q=Punjab')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['features']), 1)


class SchoolAPITest(APITestCase):
    """Test School API endpoints."""
    
    def test_create_school(self):
        """Test POST /api/schools/ creates a new school."""
        data = {
            'name': 'New School',
            'category': 'primary',
            'longitude': 69.5,
            'latitude': 30.5
        }
        response = self.client.post('/api/schools/', data, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        self.assertEqual(School.objects.count(), 1)
    
    def test_get_schools(self):
        """Test GET /api/schools/ returns all schools."""
        point = Point(69.5, 30.5, srid=4326)
        School.objects.create(
            name='Test School',
            category='primary',
            geom=point
        )
        
        response = self.client.get('/api/schools/')
        self.assertEqual(response.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response.data['features']), 1)
