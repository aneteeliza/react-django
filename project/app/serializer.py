from .models import AppUser
from rest_framework import serializers
from rest_framework.exceptions import ValidationError
from . models import *
from django.contrib.auth import get_user_model, authenticate

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
        model = UserModel
        fields = ('email', 'username')


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
