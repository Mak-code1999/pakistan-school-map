from rest_framework import viewsets, status
from rest_framework.decorators import action
from rest_framework.response import Response
from django.db.models import Q, Count
from .models import District, School
from .serializers import (
    DistrictSerializer,
    SchoolSerializer,
    SchoolCreateSerializer,
    DistrictStatsSerializer
)


class DistrictViewSet(viewsets.ReadOnlyModelViewSet):
    """
    API endpoint for districts of Pakistan.
    
    list: Get all districts with boundaries
    retrieve: Get single district
    search: Search districts by name or province
    stats: Get school statistics for a district
    """
    # Order by province (name_1) then district (name_2)
    queryset = District.objects.all().order_by('name_1', 'name_2')
    serializer_class = DistrictSerializer

    @action(detail=False, methods=['get'])
    def search(self, request):
        """
        Search districts by name (name_2) or province (name_1).
        Query parameter: q (search query)
        """
        query = request.query_params.get('q', '').strip()
        
        if not query:
            return Response(
                {'error': 'Search query parameter "q" is required'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Case-insensitive search on district name OR province name
        districts = District.objects.filter(
            Q(name_2__icontains=query) | Q(name_1__icontains=query)
        )
        
        serializer = self.get_serializer(districts, many=True)
        return Response(serializer.data)

    @action(detail=True, methods=['get'])
    def stats(self, request, pk=None):
        """
        Get school statistics for a district.
        Returns: district info, total schools, breakdown by category, school list
        """
        district = self.get_object()
        
        # Get all schools within this district (spatial query)
        schools = School.objects.filter(
            geom__within=district.geom
        ).select_related('district')
        
        # Count schools by category
        category_counts = schools.values('category').annotate(
            count=Count('id')
        )
        
        schools_by_category = {
            item['category']: item['count']
            for item in category_counts
        }
        
        # Prepare response data
        data = {
            'district_id': district.id,
            'district_name': district.name_2,
            'province_name': district.name_1,
            'total_schools': schools.count(),
            'schools_by_category': schools_by_category,
            'schools': SchoolSerializer(schools, many=True).data
        }
        
        serializer = DistrictStatsSerializer(data)
        return Response(serializer.data)


class SchoolViewSet(viewsets.ModelViewSet):
    """
    API endpoint for schools.
    
    list: Get all schools
    create: Add new school
    retrieve: Get single school
    update: Update school
    destroy: Delete school
    """
    queryset = School.objects.select_related('district').all()
    
    def get_serializer_class(self):
        """Use different serializer for create action."""
        if self.action == 'create':
            return SchoolCreateSerializer
        return SchoolSerializer
    
    def create(self, request, *args, **kwargs):
        """
        Create a new school.
        Request body: {name, category, longitude, latitude}
        """
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        school = serializer.save()
        
        # Return GeoJSON response
        response_serializer = SchoolSerializer(school)
        return Response(
            response_serializer.data,
            status=status.HTTP_201_CREATED
        )
