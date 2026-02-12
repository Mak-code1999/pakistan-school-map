from django.contrib.gis import admin
from .models import District, School


@admin.register(District)
class DistrictAdmin(admin.GISModelAdmin):
    """
    Admin interface for District model with map display.
    """
    list_display = ['name_2', 'name_1', 'name_0']
    search_fields = ['name_2', 'name_1']


@admin.register(School)
class SchoolAdmin(admin.GISModelAdmin):
    """
    Admin interface for School model with map display.
    """
    list_display = ['name', 'category', 'district', 'created_at']
    list_filter = ['category', 'district']
    search_fields = ['name']
    readonly_fields = ['created_at', 'updated_at']
    autocomplete_fields = ['district']

