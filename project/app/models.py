from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class AppUserManager(BaseUserManager):
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email)
        user.set_password(password)
        user.save()
        return user

    def create_superuser(self, email, password=None):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        user = self.create_user(email, password)
        user.is_superuser = True
        user.save()
        return user


class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    username = models.CharField(max_length=50)
    country = models.CharField(max_length=100, blank=True)
    is_staff = models.BooleanField(default=False)  # Add this field
    is_active = models.BooleanField(default=True)  # Add this field

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    objects = AppUserManager()

    def __str__(self):
        return self.username


class Person(models.Model):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    birthdate = models.DateField()

    def __str__(self):
        return f"{self.name} {self.surname}"


class React(models.Model):
    nr = models.CharField(max_length=50, primary_key=True,
                          default="Default Value")
    pakape = models.CharField(max_length=100, default="Default Value")
    uzvards_un_vards = models.CharField(
        max_length=200, default="Default Value")
    dienesta_vieniba = models.CharField(
        max_length=200, default="Default Value")
    ordenis = models.CharField(max_length=200, default="Default Value")
    ordeņa_pakape = models.CharField(
        null=True, blank=True, default="Default Value")
    piezimes = models.CharField(
        max_length=255, null=True, blank=True, default="Default Value")
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
