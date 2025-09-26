from django.db import models

# Create your models here.
class Courses(models.Model):
    code = models.CharField(max_length=4)
    name = models.CharField(max_length=20)
    description = models.CharField(max_length=255)
    year_level = models.IntegerField()
    time_slot = models.CharField(max_length=50)
    units = models.PositiveIntegerField()
    price_per_unit = models.DecimalField(max_digits=10, decimal_places=2)
    is_deleted = models.BooleanField(default=False)
    deleted_at = models.DateTimeField(null=True, blank=True)
    date_added = models.DateTimeField(auto_now_add=True)
