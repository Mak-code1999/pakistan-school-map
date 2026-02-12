from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import DistrictViewSet, SchoolViewSet

router = DefaultRouter()
router.register(r'districts', DistrictViewSet, basename='district')
router.register(r'schools', SchoolViewSet, basename='school')

urlpatterns = [
    path('', include(router.urls)),
]

