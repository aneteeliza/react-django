import re
from .models import AppUser
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from . models import *
from django.contrib.auth import get_user_model, authenticate
from rest_framework.validators import UniqueValidator

UserModel = get_user_model()


class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = '__all__'

    def create(self, clean_data):
        user_obj = UserModel.objects.create_user(
            email=clean_data['email'], password=clean_data['password'])
        user_obj.username = clean_data['username']
        user_obj.save()
        return user_obj


# class UserRegisterSerializer(serializers.ModelSerializer):
#     password = serializers.CharField(
#         write_only=True, required=True, min_length=8)

#     class Meta:
#         model = UserModel
#         fields = ['email', 'username', 'password']

#     def create(self, clean_data):
#         user_obj = UserModel.objects.create_user(
#             email=clean_data['email'],
#             password=clean_data['password']
#         )
#         user_obj.username = clean_data.get('username', '')
#         user_obj.save()
#         return user_obj


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

# class UserLoginSerializer(serializers.Serializer):
#     email = serializers.EmailField()
#     password = serializers.CharField(write_only=True)

#     def validate(self, clean_data):
#         user = authenticate(
#             username=clean_data['email'],
#             password=clean_data['password']
#         )
#         if not user:
#             raise ValidationError('Invalid email or password.')
#         return user


class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = UserModel
        fields = ('email', 'username', 'is_staff')


class BrigadeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Brigade
        fields = ['uzvards_un_vards', 'pakape',
                  'dienesta_vieniba', 'ordenis', 'ordeņa_pakape', 'piezimes', 'arhīva_lieta']


class MobilizetieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mobilizetie
        fields = ['uzvards', 'vards', 'dzimsanas_datums']


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


# class ChangePasswordSerializer(serializers.Serializer):
#     current_password = serializers.CharField(required=True)
#     new_password = serializers.CharField(required=True, min_length=8)

#     def validate_current_password(self, value):
#         user = self.context['request'].user
#         if not user.check_password(value):
#             raise serializers.ValidationError('Current password is incorrect.')
#         return value


class ChangePasswordSerializer(serializers.Serializer):
    current_password = serializers.CharField(required=True)
    new_password = serializers.CharField(required=True, min_length=8)

    def validate_current_password(self, value):
        user = self.context['request'].user
        if not user.check_password(value):
            raise serializers.ValidationError('Current password is incorrect.')
        return value

    def validate_new_password(self, value):
        # Custom validation for the new password
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


# class ChangePasswordSerializer(serializers.Serializer):
#     current_password = serializers.CharField(required=True)
#     new_password = serializers.CharField(required=True, min_length=8)

#     def validate_current_password(self, value):
#         user = self.context['request'].user
#         if not user.check_password(value):
#             raise serializers.ValidationError('Current password is incorrect.')
#         return value

#     def validate_new_password(self, value):
#         # Custom validation for the new password
#         errors = []
#         if len(value) < 8:
#             errors.append('The password must be at least 8 characters long.')
#         if not re.search(r'[A-Z]', value):
#             errors.append(
#                 'The password must contain at least one uppercase letter.')
#         if not re.search(r'\d', value):
#             errors.append('The password must contain at least one number.')

#         if errors:
#             raise serializers.ValidationError(errors)
#         return value

#     def save(self, **kwargs):
#         user = self.context['request'].user
#         user.set_password(self.validated_data['new_password'])
#         user.save()
#         return user
