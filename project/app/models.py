from django.db import models

# Create your models here.
# class React(models.Model):
#   employee = models.CharField(max_length=30)
#   department = models.CharField(max_length=200)

class Person(models.Model):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    birthdate = models.DateField()

    def __str__(self):
        return f"{self.name} {self.surname}"

class React(models.Model):
    nr = models.CharField(max_length=50, primary_key=True, default="Default Value")
    pakape = models.CharField(max_length=100, default="Default Value")
    uzvards_un_vards = models.CharField(max_length=200, default="Default Value")
    dienesta_vieniba = models.CharField(max_length=200, default="Default Value")
    ordenis = models.CharField(max_length=200, default="Default Value")
    ordeņa_pakape = models.CharField(null=True, blank=True, default="Default Value")  
    piezimes = models.CharField(max_length=255, null=True, blank=True, default="Default Value")
    arhīva_lieta = models.CharField(max_length=50, default="Default Value")

    def __str__(self):
        return f"{self.nr} - {self.pakape} {self.uzvards_un_vards}"

class Brigade(models.Model):
    nr = models.CharField(max_length=50, primary_key=True)
    pakape = models.CharField(max_length=100)
    uzvards_un_vards = models.CharField(max_length=200)
    dienesta_vieniba = models.CharField(max_length=200)
    ordenis = models.CharField(max_length=200, default="Default Value")
    ordeņa_pakape = models.CharField(null=True, blank=True)  
    piezimes = models.CharField(max_length=255, null=True, blank=True)
    arhīva_lieta = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.nr} - {self.pakape} {self.uzvards_un_vards}"        

