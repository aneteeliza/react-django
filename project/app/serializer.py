from django.core.exceptions import ValidationError
import re
from .models import AppUser
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from . models import *
from django.contrib.auth import get_user_model, authenticate
from rest_framework.validators import UniqueValidator

AppUser = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    confirm_password = serializers.CharField(write_only=True)

    class Meta:
        model = AppUser
        fields = ['email', 'password',
                  'confirm_password', 'first_name', 'last_name']

    def validate(self, data):
        # Logging the data to check what is being passed
        print("Received data:", data)

        # Check if passwords match
        if data['password'] != data['confirm_password']:
            raise serializers.ValidationError(
                {"password": "Paroles nesakrīt!"}  # "Passwords do not match!"
            )

        return data

    def create(self, validated_data):
        # Remove confirm_password before creating the user
        validated_data.pop('confirm_password')

        user_obj = AppUser.objects.create_user(
            email=validated_data['email'],
            password=validated_data['password']
        )
        user_obj.first_name = validated_data['first_name']
        user_obj.last_name = validated_data['last_name']
        user_obj.save()
        return user_obj


class UserLoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField()
    ##

    def check_user(self, clean_data):
        user = authenticate(
            username=clean_data['email'], password=clean_data['password'])
        if not user:
            raise ValidationError('user not found')
        return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = AppUser
        fields = ('email', 'first_name', 'last_name', 'is_staff')


class BrigadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brigade
        fields = ['uzvards_un_vards', 'pakape',
                  'dienesta_vieniba', 'ordenis', 'ordeņa_pakape', 'piezimes', 'arhīva_lieta']


class MobilizetieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mobilizetie
        fields = ['uzvards', 'vards', 'dzimsanas_datums', 'dzimsanas_vieta', 'pedeja_dzives_vieta', 'mobilizesanas_datums_labots',
                  'pirmā_dienesta_vieniba_labots', 'pirmā_dienesta_pakāpe', 'kritis_datums', 'info_par_krisanu', 'pazudis_datums',
                  'info_par_pazusanu', 'miris_datums', 'info_par_mirsanu',  'dezertējis_datums', 'apbalvots', 'paaugstinats_degradets',
                  'atbrīvots_no_dienesta_datums', 'atbrivosanas_iemesls', 'ievainots', 'navessods_arests', 'cita_informacija']


class ZedelgemaSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zedelgema
        fields = ['uzvards', 'vards', 'dzimsanas_datums',
                  'dienesta_pakape', 'dienesta_vieniba', 'nometnes_nodalijums',
                  'aizbraucis_uz_psrs', 'miris', 'piezimes']


class KritusieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Kritusie
        fields = ['vards_uzvards', 'dienesta_pakape',
                  'vieniba', 'kritis_un_miris_no_ievainojuma_un_kad', 'apbedisanas_vieta', 'piezimes']


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value

    def validate_new_password(self, value):
        if len(value) < 8:
            raise serializers.ValidationError(
                'The password must be at least 8 characters long.')
        if not re.search(r'[A-Z]', value):
            raise serializers.ValidationError(
                'The password must contain at least one uppercase letter.')
        if not re.search(r'\d', value):
            raise serializers.ValidationError(
                'The password must contain at least one number.')
        return value
