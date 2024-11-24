from django.db import models
from django.contrib.auth.base_user import BaseUserManager
from django.contrib.auth.models import AbstractBaseUser, PermissionsMixin


class AppUserManager(BaseUserManager):
    # def create_user(self, email, password=None):
    #     if not email:
    #         raise ValueError('An email is required.')
    #     if not password:
    #         raise ValueError('A password is required.')
    #     email = self.normalize_email(email)
    #     user = self.model(email=email)
    #     user.set_password(password)
    #     user.save()
    #     return user
    def create_user(self, email, password=None):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        email = self.normalize_email(email)
        user = self.model(email=email, is_active=True, is_staff=False)
        user.set_password(password)
        user.save()
        return user

    # def create_superuser(self, email, password=None):
    #     if not email:
    #         raise ValueError('An email is required.')
    #     if not password:
    #         raise ValueError('A password is required.')
    #     user = self.create_user(email, password)
    #     user.is_superuser = True
    #     user.save()
    #     return user

    def create_superuser(self, email, password=None):
        if not email:
            raise ValueError('An email is required.')
        if not password:
            raise ValueError('A password is required.')
        user = self.create_user(email, password)
        user.is_superuser = True
        user.is_staff = True  # Make sure this field is set to True
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


class Zedelgema(models.Model):
    nr = models.CharField(max_length=50, primary_key=True)
    dienesta_pakape = models.CharField(max_length=50)
    uzvards = models.CharField(max_length=50)
    vards = models.CharField(max_length=50)
    # dzimsanas_datums = models.DateField(null=True, blank=True)
    dzimsanas_datums = models.CharField(max_length=20, null=True, blank=True)
    dienesta_vieniba = models.TextField()
    nometnes_nodalijums = models.IntegerField()
    aizbraucis_uz_psrs = models.CharField(max_length=50, null=True, blank=True)
    miris = models.CharField(max_length=50, null=True, blank=True)
    piezimes = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.dienesta_pakape} {self.uzvards} {self.vards}"


class Kritusie(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    dienesta_pakape = models.CharField(max_length=50, blank=True,
                                       null=True)  # Dienesta pakāpe
    # Uzvārds, vārds un tēva vārds
    vards_uzvards = models.CharField(max_length=255, blank=True,
                                     null=True)
    vieniba = models.CharField(max_length=255, blank=True,
                               null=True)  # Kādā vienībā
    # Kritis vai miris no ievainojuma un kad
    kritis_un_miris_no_ievainojuma_un_kad = models.CharField(max_length=100, blank=True,
                                                             null=True)
    apbedisanas_vieta = models.CharField(max_length=255, blank=True,
                                         null=True)  # Kur apbedīts
    piezimes = models.TextField(blank=True, null=True)  # Piezīmes

    def __str__(self):
        return f"{self.dienesta_pakape} {self.vards_uzvards}"


class Mobilizetie(models.Model):
    id = models.CharField(max_length=50, primary_key=True)
    uzvards = models.CharField(
        max_length=500, null=True, blank=True)  # Last name
    vards = models.CharField(max_length=100, null=True,
                             blank=True)  # First name
    pirmā_dienesta_pakāpe = models.CharField(
        max_length=100, null=True, blank=True)  # Initial rank
    dzimsanas_datums = models.DateField(null=True, blank=True)  # Birth date
    dzimsanas_vieta = models.CharField(
        max_length=255, null=True, blank=True)  # Birthplace
    kritis_datums = models.CharField(
        max_length=50, null=True, blank=True)  # Date of death (killed)
    info_par_krisanu = models.TextField(
        null=True, blank=True)  # Information about death
    pazudis_datums = models.CharField(
        max_length=50, null=True, blank=True)  # Date of disappearance
    info_par_pazusanu = models.TextField(
        null=True, blank=True)  # Information about disappearance
    # Date of death (died naturally)
    miris_datums = models.CharField(
        max_length=50, null=True, blank=True)
    # Information about natural death
    info_par_mirsanu = models.TextField(null=True, blank=True)
    kritis_gusta_datums = models.CharField(
        max_length=50, null=True, blank=True)  # Date captured
    cits_naves_iemesls_datums = models.CharField(
        max_length=50, null=True, blank=True)  # Date of other death reason
    # Cause of death or reason
    iemesls = models.TextField(null=True, blank=True)
    mobilizesanas_datums_labots = models.CharField(
        max_length=255, null=True, blank=True)  # Mobilization date (modified)
    pedeja_dzives_vieta = models.CharField(
        max_length=255, null=True, blank=True)  # Last residence
    pirmā_dienesta_vieniba_labots = models.CharField(
        # Initial service unit (modified)
        max_length=255, null=True, blank=True)
    nosutits_uz_citu_vienibu_kursiem = models.CharField(
        max_length=255, null=True, blank=True)  # Sent to another unit or training
    aizbraucis_uz_lpsr = models.CharField(
        max_length=50, null=True, blank=True)  # Left for LPSR (Boolean)
    paaugstinats_degradets = models.CharField(
        max_length=255, null=True, blank=True)  # Promoted or degraded
    dezertējis_datums = models.CharField(
        max_length=50, null=True, blank=True)  # Date of desertion
    atbrīvots_no_dienesta_datums = models.CharField(
        max_length=50, null=True, blank=True)  # Date released from service
    atbrivosanas_iemesls = models.CharField(
        max_length=255, null=True, blank=True)  # Reason for release
    ievainots = models.TextField(null=True, blank=True)  # Injuries
    navessods_arests = models.CharField(
        max_length=255, null=True, blank=True)  # Death penalty or arrest
    apbalvots = models.TextField(null=True, blank=True)  # Awards
    cita_informacija = models.TextField(
        null=True, blank=True)  # Other information

    def __str__(self):
        return f"{self.uzvards}, {self.vards} ({self.pirmā_dienesta_pakāpe})"
