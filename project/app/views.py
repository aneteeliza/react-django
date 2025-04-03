from .models import Brigade, Mobilised
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


class SearchView(APIView):
    permission_classes = [AllowAny]

    def get(self, request):
        name = request.GET.get('name', '')
        surname = request.GET.get('surname', '')
        birthdate = request.GET.get('birthdate', '')
        unit = request.GET.get('unit', '')
        table = int(request.GET.get('table', 0))

        dash_birthdate = birthdate.replace('-', '.') if birthdate else ''

        match table:
            case 2:
                queryset = Fallen.objects.all()
                if name:
                    queryset = queryset.filter(name_surname__icontains=name)

                if surname:
                    queryset = queryset.filter(name_surname__icontains=surname)

                if unit:
                    queryset = queryset.filter(unit__icontains=unit)
                serializer = FallenSerialiser(queryset, many=True)
            case 1:
                queryset = Mobilised.objects.all()
                if name:
                    queryset = queryset.filter(name__icontains=name)

                if surname:
                    queryset = queryset.filter(surname__icontains=surname)

                if birthdate:
                    queryset = queryset.filter(
                        Q(birthdate__icontains=birthdate) | 
                        Q(birthdate__icontains=dash_birthdate)
                    )

                if unit:
                    queryset = queryset.filter(first_unit__icontains=unit)
                serializer = MobilisedSerializer(queryset, many=True)
            case 3:
                queryset = Zedelgem.objects.all()
                
                if name:
                    queryset = queryset.filter(name__icontains=name)

                if surname:
                    queryset = queryset.filter(surname__icontains=surname)

                if birthdate:
                    queryset = queryset.filter(
                        Q(birthdate__icontains=birthdate) |
                        Q(birthdate__icontains=dash_birthdate)
                    )

                if unit:
                    queryset = queryset.filter(unit__icontains=unit)
                serializer = ZedelgemSerializer(queryset, many=True)
            case _:
                queryset = Brigade.objects.all()
                if name:
                    queryset = queryset.filter(name_surname__icontains=name)

                if surname:
                    queryset = queryset.filter(name_surname__icontains=surname)

                if unit:
                    queryset = queryset.filter(unit__icontains=unit)
                serializer = BrigadeSerializer(queryset, many=True)

        return Response(serializer.data)


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

        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

    def delete(self, request):
        user = request.user
        user.delete()
        return Response({"message": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)


class UserProfileView(APIView):
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

        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)


def profile_view(request):
    user = request.user
    return JsonResponse({
        "email": user.email,
    })


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
        user.delete()
        return Response({"message": "Account deleted successfully"}, status=status.HTTP_204_NO_CONTENT)
