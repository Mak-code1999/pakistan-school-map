from rest_framework_gis.serializers import GeoFeatureModelSerializer
from rest_framework import serializers
from .models import District, School


class DistrictSerializer(GeoFeatureModelSerializer):
    """
    GeoJSON serializer for District model.
    """
    # Exposing the district name (NAME_2) as 'name' for frontend compatibility
    name = serializers.CharField(source='name_2', read_only=True)
    province_name = serializers.CharField(source='name_1', read_only=True)
    
    class Meta:
        model = District
        geo_field = 'geom'
        # Return ID, Name (district), Province Name
        fields = ['id', 'name', 'province_name', 'name_0', 'name_1', 'name_2', 'name_3', 'type_3']


class SchoolSerializer(GeoFeatureModelSerializer):
    """
    GeoJSON serializer for School model.
    """
    district_name = serializers.SerializerMethodField()
    province_name = serializers.SerializerMethodField()

    class Meta:
        model = School
        geo_field = 'geom'
        fields = ['id', 'name', 'category', 'district', 'district_name', 'province_name', 
                  'num_students', 'num_teachers', 'num_classrooms', 'establishment_year',
                  'has_library', 'has_computer_lab', 'has_playground', 'created_at']
        read_only_fields = ['created_at']
    
    def get_district_name(self, obj):
        """Safely get district name"""
        return obj.district.name_2 if obj.district else None
    
    def get_province_name(self, obj):
        """Safely get province name"""
        return obj.district.name_1 if obj.district else None


class SchoolCreateSerializer(serializers.ModelSerializer):
    """
    Serializer for creating schools with longitude/latitude.
    """
    longitude = serializers.FloatField(write_only=True)
    latitude = serializers.FloatField(write_only=True)

    class Meta:
        model = School
        fields = ['name', 'category', 'longitude', 'latitude']

    def create(self, validated_data):
        from django.contrib.gis.geos import Point
        
        longitude = validated_data.pop('longitude')
        latitude = validated_data.pop('latitude')
        
        # Create Point geometry from coordinates
        point = Point(longitude, latitude, srid=4326)
        validated_data['geom'] = point
        
        return super().create(validated_data)


class DistrictStatsSerializer(serializers.Serializer):
    """
    Serializer for district statistics.
    """
    district_id = serializers.IntegerField()
    district_name = serializers.CharField()
    province_name = serializers.CharField()
    total_schools = serializers.IntegerField()
    schools_by_category = serializers.DictField()
    schools = SchoolSerializer(many=True)

