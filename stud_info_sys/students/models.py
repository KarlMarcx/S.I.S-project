from django.db import models

# Create your models here.

class Student(models.Model):
    full_name = models.CharField(max_length=100)
    email = models.EmailField(unique=True)
    date_of_birth = models.DateField()
    phone = models.CharField(max_length=11)
    address = models.CharField(max_length=255)
    year = models.IntegerField()
    
    