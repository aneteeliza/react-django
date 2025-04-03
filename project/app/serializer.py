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
    name = serializers.SerializerMethodField()
    surname = serializers.SerializerMethodField()

    class Meta:
        model = Brigade
        fields = [
            'rank',
            'name',
            'surname',
            'unit',
            'order',
            'order_level',
            'notes',
            'archive',
        ]

    def get_name(self, obj):
        parts = (obj.name_surname or '').strip().split()
        return parts[1] if len(parts) > 1 else ''

    def get_surname(self, obj):
        parts = (obj.name_surname or '').strip().split()
        if len(parts) >= 3:
            # Everything except the second part (name) is part of the surname
            return ' '.join([parts[0]] + parts[2:])
        return parts[0] if parts else ''
    
    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {key: value for key, value in representation.items() if value is not None}



class MobilisedSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mobilised
        fields = [
            'surname',
            'name',
            'birthdate',
            'birthplace',
            'last_location',
            'mobilised_date',
            'first_unit',
            'first_rank',
            'fallen_date',
            'fallen_info',
            'missing_date',
            'missing_info',
            'death_date',
            'death_info',
            'captured_date',
            'other_death_date',
            'other_death_reason',
            'deserted_date',
            'awarded',
            'promoted_degraded',
            'released_date',
            'released_reason',
            'wounded',
            'death_sentence_arrest',
            'other_info',
        ]

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {key: value for key, value in representation.items() if value is not None}


class ZedelgemSerializer(serializers.ModelSerializer):
    class Meta:
        model = Zedelgem
        fields = [
            'rank',
            'surname',
            'name',
            'birthdate',
            'unit',
            'camp_section',
            'left_to_psrs',
            'dieddate',
            'notes'
        ]
    
    def get_name(self, obj):
        parts = (obj.name_surname or '').strip().split()
        return parts[1] if len(parts) > 1 else ''

    def get_surname(self, obj):
        parts = (obj.name_surname or '').strip().split()
        if len(parts) >= 3:
            return ' '.join([parts[0]] + parts[2:])
        return parts[0] if parts else ''

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {k: v for k, v in representation.items() if v is not None}


class FallenSerialiser(serializers.ModelSerializer):
    name = serializers.SerializerMethodField()
    surname = serializers.SerializerMethodField()

    class Meta:
        model = Fallen
        fields = [
            'surname',
            'name',
            'rank',
            'unit',
            'fallen_died_when',
            'burrial_place',
            'notes'
        ]

    def get_name(self, obj):
        parts = (obj.name_surname or '').strip().split()
        return parts[1] if len(parts) > 1 else ''

    def get_surname(self, obj):
        parts = (obj.name_surname or '').strip().split()
        if len(parts) >= 3:
            return ' '.join([parts[0]] + parts[2:])
        return parts[0] if parts else ''

    def to_representation(self, instance):
        representation = super().to_representation(instance)
        return {k: v for k, v in representation.items() if v is not None}


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
