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
        user = self.model(email=email, is_active=False, is_staff=False)
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
        user.is_staff = True
        user.save()
        return user


class AppUser(AbstractBaseUser, PermissionsMixin):
    user_id = models.AutoField(primary_key=True)
    email = models.EmailField(max_length=50, unique=True)
    first_name = models.CharField(max_length=50, null=True)
    last_name = models.CharField(max_length=50, null=True)
    is_staff = models.BooleanField(default=False)
    is_active = models.BooleanField(default=True)

    USERNAME_FIELD = 'email'

    objects = AppUserManager()

    def __str__(self):
        return self.last_name


class Person(models.Model):
    name = models.CharField(max_length=100)
    surname = models.CharField(max_length=100)
    birthdate = models.DateField()

    def __str__(self):
        return f"{self.name} {self.surname}"


class Brigade(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    rank = models.CharField(max_length=100)
    name_surname = models.CharField(max_length=200)
    unit = models.CharField(max_length=200)
    order = models.CharField(max_length=200, default="Default Value")
    order_level = models.CharField(max_length=255, null=True, blank=True)
    notes = models.CharField(max_length=255, null=True, blank=True)
    archive = models.CharField(max_length=50)

    def __str__(self):
        return f"{self.id} - {self.rank} {self.name_surname}"


class Zedelgem(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    rank = models.CharField(max_length=50)
    surname = models.CharField(max_length=50)
    name = models.CharField(max_length=50)
    birthdate = models.CharField(max_length=20, null=True, blank=True)
    unit = models.TextField()
    camp_section = models.IntegerField()
    left_to_psrs = models.CharField(max_length=50, null=True, blank=True)
    dieddate = models.CharField(max_length=50, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.rank} {self.surname} {self.name}"


class Fallen(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    rank = models.CharField(max_length=50, blank=True,
                                       null=True) 
    name_surname = models.CharField(max_length=255, blank=True,
                                     null=True)
    unit = models.CharField(max_length=255, blank=True,
                               null=True)
    fallen_died_when = models.CharField(max_length=100, blank=True,
                                                             null=True)
    burrial_place = models.CharField(max_length=255, blank=True,
                                         null=True)
    notes = models.TextField(blank=True, null=True)

    def __str__(self):
        return f"{self.unit} {self.name_surname}"


class Mobilised(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    surname = models.CharField(
        max_length=500, null=True, blank=True)
    name = models.CharField(max_length=100, null=True,
                             blank=True)
    first_rank = models.CharField(
        max_length=100, null=True, blank=True)
    birthdate = models.CharField(max_length=20, null=True, blank=True)
    birthplace = models.CharField(
        max_length=255, null=True, blank=True)
    fallen_date = models.CharField(
        max_length=50, null=True, blank=True)
    fallen_info = models.TextField(
        null=True, blank=True)
    missing_date = models.CharField(
        max_length=50, null=True, blank=True)
    missing_info = models.TextField(
        null=True, blank=True)
    death_date = models.CharField(
        max_length=50, null=True, blank=True)
    death_info = models.TextField(null=True, blank=True)
    captured_date = models.CharField(
        max_length=50, null=True, blank=True)
    other_death_date = models.CharField(
        max_length=50, null=True, blank=True)
    other_death_reason = models.TextField(null=True, blank=True)
    mobilised_date = models.CharField(
        max_length=255, null=True, blank=True)
    last_location = models.CharField(
        max_length=255, null=True, blank=True)
    first_unit = models.CharField(
        max_length=255, null=True, blank=True)
    sent_to_rank = models.CharField(
        max_length=255, null=True, blank=True)
    went_to_psrs = models.CharField(
        max_length=50, null=True, blank=True)
    promoted_degraded = models.CharField(
        max_length=255, null=True, blank=True)
    deserted_date = models.CharField(
        max_length=50, null=True, blank=True)
    released_date = models.CharField(
        max_length=50, null=True, blank=True)
    released_reason = models.CharField(
        max_length=255, null=True, blank=True)
    wounded = models.TextField(null=True, blank=True)
    death_sentence_arrest = models.CharField(
        max_length=255, null=True, blank=True)
    awarded = models.TextField(null=True, blank=True)
    other_info = models.TextField(
        null=True, blank=True)

    def __str__(self):
        return f"{self.surname}, {self.name} ({self.first_rank})"
