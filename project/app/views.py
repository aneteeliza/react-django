# Make sure you have a serializer for user
from .models import Brigade, Kritusie
from rest_framework.decorators import api_view, permission_classes
from django.contrib.auth import authenticate
from django.contrib.auth import update_session_auth_hash
from django.contrib.auth.forms import PasswordChangeForm
from django.contrib.auth.models import User
from rest_framework import status
import requests
from .utils import (
    map_kritusie_data,
    map_brigade_data,
    map_mobilizetie_data,
    map_zedelgema_data
)
from rest_framework.permissions import IsAuthenticated
from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *
from django.db.models import Q

from django.http import JsonResponse
from django.contrib.auth.decorators import login_required

from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from . serializer import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from . validations import custom_validation, validate_email, validate_password
# Create your views here.
from rest_framework.permissions import AllowAny

from django.views.decorators.csrf import csrf_exempt
from django.middleware.csrf import get_token


class BrigadeView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def get(self, request):
        name = request.GET.get('name', '')
        pakape = request.GET.get('pakape', '')
        queryset = Brigade.objects.all()

        if name:
            queryset = queryset.filter(uzvards_un_vards__icontains=name)

        if pakape:
            queryset = queryset.filter(pakape__icontains=pakape)

        serializer = BrigadeSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = BrigadeSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class MobilizetieView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def get(self, request):
        vards = request.GET.get('vards', '')
        uzvards = request.GET.get('uzvards', '')
        dzimsanas_datums = request.GET.get('dzimsanas_datums', '')
        queryset = Mobilizetie.objects.all()

        if vards:
            queryset = queryset.filter(vards__icontains=vards)

        if uzvards:
            queryset = queryset.filter(uzvards__icontains=uzvards)

        if dzimsanas_datums:
            queryset = queryset.filter(
                dzimsanas_datums__icontains=dzimsanas_datums)

        serializer = MobilizetieSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = MobilizetieSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class ZedelgemaView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def get(self, request):
        vards = request.GET.get('vards', '')
        uzvards = request.GET.get('uzvards', '')
        dzimsanas_datums = request.GET.get('dzimsanas_datums', '')
        queryset = Zedelgema.objects.all()

        if vards:
            queryset = queryset.filter(vards__icontains=vards)

        if uzvards:
            queryset = queryset.filter(uzvards__icontains=uzvards)

        if dzimsanas_datums:
            queryset = queryset.filter(
                dzimsanas_datums__icontains=dzimsanas_datums)

        serializer = ZedelgemaSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ZedelgemaSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


class KritusieView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def get(self, request):
        vards_uzvards = request.GET.get('vards_uzvards', '')
        queryset = Kritusie.objects.all()

        if vards_uzvards:
            queryset = queryset.filter(vards_uzvards__icontains=vards_uzvards)

        serializer = KritusieSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = KritusieSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)


# class UserRegister(APIView):
#     permission_classes = (permissions.AllowAny,)

#     def get(self, request):
#         return Response({"detail": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

#     def post(self, request):
#         # try:
#         clean_data = custom_validation(request.data)
#         serializer = UserRegisterSerializer(data=clean_data)
#         if serializer.is_valid(raise_exception=True):
#             user = serializer.create(clean_data)
#             if user:
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(status=status.HTTP_400_BAD_REQUEST)

class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def get(self, request):
        return Response({"detail": "Method not allowed"}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

    def post(self, request):
        try:
            # Custom validation
            clean_data = custom_validation(request.data)
        except Exception as e:
            return Response({"detail": str(e)}, status=status.HTTP_400_BAD_REQUEST)

        # Check if the email already exists
        email = clean_data.get("email")
        if AppUser.objects.filter(email=email).exists():
            return Response({"detail": "Lietotājs ar šo e-pastu jau eksistē."}, status=status.HTTP_400_BAD_REQUEST)

        # Proceed with the user creation
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response({"detail": "Invalid data."}, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = (SessionAuthentication,)
    ##

    def post(self, request):
        data = request.data
        assert validate_email(data)
        assert validate_password(data)
        serializer = UserLoginSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.check_user(data)
            login(request, user)
            return Response(serializer.data, status=status.HTTP_200_OK)


class UserLogout(APIView):
    permission_classes = (permissions.AllowAny,)
    authentication_classes = ()

    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)


# class UserView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         serializer = UserSerializer(user)
#         return Response({"user": serializer.data})

#     def put(self, request):
#         user = request.user
#         user.email = request.data.get("email", user.email)
#         user.first_name = request.data.get("first_name", user.first_name)
#         user.last_name = request.data.get("last_name", user.last_name)
#         user.save()

#         # Returning success response
#         return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

class UserView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({"user": serializer.data})

    def put(self, request):
        user = request.user
        user.email = request.data.get("email", user.email)
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.save()

        # Returning success response
        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

    def delete(self, request):
        user = request.user
        user.delete()  # Delete the user
        return Response({"message": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class UserProfileView(APIView):
    permission_classes = [IsAuthenticated]

    def get(self, request):
        user = request.user
        serializer = UserSerializer(user)
        return Response({"user": serializer.data})

    def put(self, request):
        user = request.user
        # If the request body contains new values for fields, we update the user
        user.email = request.data.get("email", user.email)
        user.first_name = request.data.get("first_name", user.first_name)
        user.last_name = request.data.get("last_name", user.last_name)
        user.save()

        # Returning success response
        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)


def profile_view(request):
    user = request.user
    return JsonResponse({
        "email": user.email,
    })


def unified_search_view(request):
    # Example fetching data from different endpoints
    kritusie_data = requests.get('http://127.0.0.1:8000/kritusie/').json()
    brigade_data = requests.get('http://127.0.0.1:8000/brigade/').json()
    mobilizetie_data = requests.get(
        'http://127.0.0.1:8000/mobilizetie/').json()
    zedelgema_data = requests.get('http://127.0.0.1:8000/zedelgema/').json()

    # Map data using utility functions
    all_data = (
        [map_kritusie_data(item) for item in kritusie_data] +
        [map_brigade_data(item) for item in brigade_data] +
        [map_mobilizetie_data(item) for item in mobilizetie_data] +
        [map_zedelgema_data(item) for item in zedelgema_data]
    )

    # Return unified JSON response
    return JsonResponse(all_data, safe=False)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'success': 'Parole veiksmīgi nomainīta'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserDelete(APIView):
    permission_classes = [IsAuthenticated]

    def delete(self, request):
        user = request.user
        # Optionally, perform any additional checks before deleting (e.g., logging, notifications, etc.)
        user.delete()  # This will delete the user account
        return Response({"message": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
