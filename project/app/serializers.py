# serializers.py
from rest_framework import serializers
from .models import Mobilizetie


class MobilizetieSerializer(serializers.ModelSerializer):
    class Meta:
        model = Mobilizetie
        fields = '__all__'  # Adjust fields as necessary
