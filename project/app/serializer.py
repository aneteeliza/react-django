from rest_framework import serializers
from . models import *


# class ReactSerializer(serializers.ModelSerializer):
#     class Meta:
#         model = React
#         fields = ['employee', 'department']

class ReactSerializer(serializers.ModelSerializer):
    class Meta:
        model = React
        fields = ['uzvards_un_vards', 'pakape']        