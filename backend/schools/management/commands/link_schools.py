from django.core.management.base import BaseCommand
from django.contrib.gis.geos import Point
from schools.models import School, District

class Command(BaseCommand):
    help = 'Links all schools to their containing districts based on spatial location'

    def handle(self, *args, **kwargs):
        schools = School.objects.all()
        count = 0
        
        self.stdout.write(f"checking {schools.count()} schools...")

        for school in schools:
            # Check if school is already linked
            if school.district:
                continue
                
            # Find containing district
            # Note: contains/within query - Using within is typical for points in polygons
            containing_district = District.objects.filter(geom__contains=school.geom).first()
            
            if containing_district:
                school.district = containing_district
                school.save()
                count += 1
                self.stdout.write(self.style.SUCCESS(f'Linked "{school.name}" to district "{containing_district.name_2}"'))
            else:
                self.stdout.write(self.style.WARNING(f'Could not find containing district for "{school.name}"'))

        self.stdout.write(self.style.SUCCESS(f'Successfully linked {count} schools to districts'))
