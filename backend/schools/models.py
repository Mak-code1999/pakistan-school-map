from django.contrib.gis.db import models



class District(models.Model):
    """
    Model representing a District of Pakistan with its boundary geometry.
    Mapped to 'Pak_District_Boundary' table.
    """
    # Primary key
    id = models.AutoField(primary_key=True, db_column='id')
    
    # Using UPPERCASE column names from the database (as shown in screenshot)
    name_0 = models.CharField(max_length=50, null=True, blank=True, db_column='NAME_0')  # Country
    name_1 = models.CharField(max_length=50, null=True, blank=True, db_column='NAME_1')  # Province Name
    name_2 = models.CharField(max_length=50, null=True, blank=True, db_column='NAME_2')  # District Name
    name_3 = models.CharField(max_length=50, null=True, blank=True, db_column='NAME_3')  # City/Tehsil Name
    type_3 = models.CharField(max_length=50, null=True, blank=True, db_column='TYPE_3')  # Type (e.g. District)
    
    # Geometry field
    geom = models.MultiPolygonField(srid=4326, db_column='geom')

    class Meta:
        managed = False  # Don't let Django manage this table (it's from shapefile)
        db_table = 'Pak_District_Boundary'  # The exact table name in DB (case-sensitive!)
        ordering = ['name_2']
        verbose_name = 'District'
        verbose_name_plural = 'Districts'

    def __str__(self):
        return f"{self.name_2}, {self.name_1}"


class School(models.Model):
    """
    Model representing a school with its location point geometry.
    """
    CATEGORY_CHOICES = [
        ('primary', 'Primary'),
        ('secondary', 'Secondary'),
        ('higher_secondary', 'Higher Secondary'),
        ('university', 'University'),
    ]

    name = models.CharField(max_length=200)
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES, default='primary')
    geom = models.PointField(srid=4326)
    
    # Changed from Province to District linkage
    district = models.ForeignKey(
        District,
        on_delete=models.SET_NULL,
        null=True,
        blank=True,
        related_name='schools'
    )
    
    # Additional school information for analytics
    num_students = models.IntegerField(default=0, help_text="Total number of students")
    num_teachers = models.IntegerField(default=0, help_text="Total number of teachers")
    num_classrooms = models.IntegerField(default=0, help_text="Total number of classrooms")
    establishment_year = models.IntegerField(null=True, blank=True, help_text="Year the school was established")
    has_library = models.BooleanField(default=False, help_text="Does the school have a library?")
    has_computer_lab = models.BooleanField(default=False, help_text="Does the school have a computer lab?")
    has_playground = models.BooleanField(default=False, help_text="Does the school have a playground?")
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'School'
        verbose_name_plural = 'Schools'

    def __str__(self):
        return f"{self.name} ({self.get_category_display()})"

    def save(self, *args, **kwargs):
        """
        Auto-assign district based on spatial containment if not set.
        """
        if not self.district:
            # Find which district contains this school's location
            # Note: contains/within query
            district = District.objects.filter(geom__contains=self.geom).first()
            if district:
                self.district = district
        super().save(*args, **kwargs)

