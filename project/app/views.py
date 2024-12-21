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


class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    def post(self, request):
        clean_data = custom_validation(request.data)
        serializer = UserRegisterSerializer(data=clean_data)
        if serializer.is_valid(raise_exception=True):
            user = serializer.create(clean_data)
            if user:
                return Response(serializer.data, status=status.HTTP_201_CREATED)
        return Response(status=status.HTTP_400_BAD_REQUEST)


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
        # If the request body contains new values for fields, we update the user
        user.email = request.data.get("email", user.email)
        user.username = request.data.get("username", user.username)
        user.save()

        # Returning success response
        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)
    # permission_classes = (permissions.IsAuthenticated,)
    # authentication_classes = (SessionAuthentication,)
    # ##

    # def get(self, request):
    #     serializer = UserSerializer(request.user)
    #     return Response({'user': serializer.data}, status=status.HTTP_200_OK)


# class UserProfileView(APIView):
#     permission_classes = [IsAuthenticated]
#     authentication_classes = [SessionAuthentication]

#     def get(self, request):
#         user = request.user
#         serializer = UserSerializer(user)
#         return Response({"user": serializer.data})


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
        user.username = request.data.get("username", user.username)
        user.save()

        # Returning success response
        return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)


# class UserProfileView(APIView):
#     permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         return Response({"user": {"email": user.email, "username": user.username}})

#     def put(self, request):
#         user = request.user
#         user.email = request.data.get("email", user.email)
#         user.username = request.data.get("username", user.username)
#         user.save()
#         return Response({"message": "Profile updated successfully"})


def profile_view(request):
    user = request.user
    return JsonResponse({
        "email": user.email,
        "username": user.username
    })


# myapp/views.py


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


# @login_required
# def change_password(request):
#     if request.method == 'POST':
#         # Initialize the PasswordChangeForm with the current user and request data
#         form = PasswordChangeForm(user=request.user, data=request.POST)

#         if form.is_valid():
#             # Save the new password
#             form.save()
#             # Keep the user logged in after password change
#             update_session_auth_hash(request, form.user)
#             return JsonResponse({'message': 'Password changed successfully!'}, status=200)

#         # If the form is not valid, return error messages
#         return JsonResponse({'error': form.errors}, status=400)

#     return JsonResponse({'error': 'Invalid method'}, status=405)


class ChangePasswordView(APIView):
    permission_classes = [IsAuthenticated]

    def put(self, request):
        serializer = ChangePasswordSerializer(
            data=request.data, context={'request': request})
        if serializer.is_valid():
            user = request.user
            user.set_password(serializer.validated_data['new_password'])
            user.save()
            return Response({'success': 'Password changed successfully.'}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

    # def put(self, request):
    #     user = request.user
    #     current_password = request.data.get('currentPassword')
    #     new_password = request.data.get('newPassword')

    #     # Check if the current password is correct
    #     if not user.check_password(current_password):
    #         return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

    #     # Validate new password (optional, you can add custom validation)
    #     if len(new_password) < 8:
    #         return Response({'error': 'New password must be at least 8 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

    #     # Set the new password
    #     user.set_password(new_password)
    #     user.save()

    #     return Response({'success': 'Password changed successfully.'}, status=status.HTTP_200_OK)


# def check_username(request):
#     username = request.GET.get('username', None)
#     if username and User.objects.filter(username=username).exists():
#         return JsonResponse({'exists': True})
#     return JsonResponse({'exists': False})


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def search_brigade(request):
#     user = request.user
#     query = request.query_params.get('name', '')

#     # Filter based on user type
#     if user.is_staff:
#         results = Brigade.objects.filter(dienesta_vieniba__icontains=query)
#     else:
#         # Prevent normal users from accessing these fields
#         results = Brigade.objects.none()

#     serializer = BrigadeSerializer(results, many=True)
#     return Response(serializer.data)


# @api_view(['GET'])
# @permission_classes([IsAuthenticated])
# def search_kritusie(request):
#     user = request.user
#     query = request.query_params.get('name', '')

#     # Filter based on user type
#     if user.is_staff:
#         results = Kritusie.objects.filter(vieniba__icontains=query)
#     else:
#         # Prevent normal users from accessing these fields
#         results = Kritusie.objects.none()

#     serializer = KritusieSerializer(results, many=True)
#     return Response(serializer.data)

# # Make sure you have a serializer for user
# import json
# from django.contrib.auth import authenticate, login
# from django.shortcuts import get_object_or_404
# import re
# from django.contrib.auth.models import User
# from rest_framework.decorators import api_view
# from django.contrib.auth import get_user_model
# from .pagination import NoCountPagination  # Import the custom pagination class
# from . pagination import StandardResultsSetPagination
# from . pagination import LargeResultsSetPagination
# from . serializers import MobilizetieSerializer
# from .models import Mobilizetie
# from .models import Brigade, Kritusie
# from rest_framework.decorators import api_view, permission_classes
# from django.contrib.auth import authenticate
# from django.contrib.auth import update_session_auth_hash
# from django.contrib.auth.forms import PasswordChangeForm
# from django.contrib.auth.models import User
# from rest_framework import status
# import requests
# from .utils import (
#     map_kritusie_data,
#     map_brigade_data,
#     map_mobilizetie_data,
#     map_zedelgema_data
# )
# from rest_framework.permissions import IsAuthenticated
# from django.shortcuts import render
# from rest_framework.views import APIView
# from . models import *
# from rest_framework.response import Response
# from . serializer import *
# from django.db.models import Q

# from django.http import JsonResponse
# from django.contrib.auth.decorators import login_required

# from django.contrib.auth import get_user_model, login, logout
# from rest_framework.authentication import SessionAuthentication
# from rest_framework.views import APIView
# from rest_framework.response import Response
# from . serializer import UserRegisterSerializer, UserLoginSerializer, UserSerializer
# from rest_framework import permissions, status
# from . validations import custom_validation, validate_email, validate_password
# # Create your views here.
# from rest_framework.permissions import AllowAny

# from django.views.decorators.csrf import csrf_exempt
# from django.middleware.csrf import get_token

# from django.contrib.auth.models import User


# from rest_framework.pagination import PageNumberPagination

# from django.contrib.auth import authenticate, login
# from django.http import JsonResponse

# from django.views.decorators.csrf import csrf_protect


# import json
# from django.http import JsonResponse
# from django.contrib.auth import authenticate, login
# from django.views.decorators.csrf import csrf_exempt


# # @csrf_exempt
# # def login_view(request):
# #     if request.method == 'POST':
# #         try:
# #             data = json.loads(request.body)
# #             email = data.get('email')
# #             password = data.get('password')
# #             print(f"Received email: {email}, password: {password}")  # Log data

# #             if not email or not password:
# #                 return JsonResponse({"error": "Email and password are required"}, status=400)

# #             user = authenticate(request, username=email, password=password)
# #             if user is not None:
# #                 login(request, user)
# #                 return JsonResponse({"message": "Login successful"})
# #             else:
# #                 return JsonResponse({"error": "Invalid credentials"}, status=400)
# #         except json.JSONDecodeError:
# #             return JsonResponse({"error": "Invalid JSON format"}, status=400)
# #     return JsonResponse({"error": "Only POST method is allowed"}, status=405)


# class StandardResultsSetPagination(PageNumberPagination):
#     page_size = 100  # Number of records per page
#     page_size_query_param = 'page_size'
#     max_page_size = 1000


# class BrigadeView(APIView):
#     permission_classes = [AllowAny]  # Allow unauthenticated access

#     def get(self, request):
#         name = request.GET.get('name', '')
#         pakape = request.GET.get('pakape', '')
#         queryset = Brigade.objects.all()

#         if name:
#             queryset = queryset.filter(uzvards_un_vards__icontains=name)

#         if pakape:
#             queryset = queryset.filter(pakape__icontains=pakape)

#         serializer = BrigadeSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = BrigadeSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data)


# class MobilizetieView(APIView):
#     permission_classes = [AllowAny]

#     def get(self, request):
#         # Existing logic for retrieving records
#         vards = request.GET.get('vards', '')
#         uzvards = request.GET.get('uzvards', '')
#         dzimsanas_datums = request.GET.get('dzimsanas_datums', '')
#         queryset = Mobilizetie.objects.all()

#         if vards:
#             queryset = queryset.filter(vards__icontains=vards)

#         if uzvards:
#             queryset = queryset.filter(uzvards__icontains=uzvards)

#         if dzimsanas_datums:
#             queryset = queryset.filter(
#                 dzimsanas_datums__icontains=dzimsanas_datums)

#         serializer = MobilizetieSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         # Existing logic for creating new records
#         serializer = MobilizetieSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_201_CREATED)

#     def put(self, request, pk=None):
#         # Logic for updating the entire object (PUT)
#         instance = get_object_or_404(Mobilizetie, pk=pk)
#         serializer = MobilizetieSerializer(instance, data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#     def patch(self, request, pk=None):
#         # Logic for partially updating the object (PATCH)
#         instance = get_object_or_404(Mobilizetie, pk=pk)
#         serializer = MobilizetieSerializer(
#             instance, data=request.data, partial=True
#         )
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


# class ZedelgemaView(APIView):
#     permission_classes = [AllowAny]  # Allow unauthenticated access

#     def get(self, request):
#         vards = request.GET.get('vards', '')
#         uzvards = request.GET.get('uzvards', '')
#         dzimsanas_datums = request.GET.get('dzimsanas_datums', '')
#         dienesta_vieniba = request.GET.get('dienesta_vieniba', '')
#         queryset = Zedelgema.objects.all()

#         if vards:
#             queryset = queryset.filter(vards__icontains=vards)

#         if uzvards:
#             queryset = queryset.filter(uzvards__icontains=uzvards)

#         if dzimsanas_datums:
#             queryset = queryset.filter(
#                 dzimsanas_datums__icontains=dzimsanas_datums)

#         if dienesta_vieniba:
#             queryset = queryset.filter(
#                 dienesta_vieniba__icontains=dienesta_vieniba)

#         if not queryset.exists():
#             return JsonResponse({'message': 'Nav atrasti rezultāti'}, status=200)

#         serializer = ZedelgemaSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = ZedelgemaSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data)


# class KritusieView(APIView):
#     permission_classes = [AllowAny]  # Allow unauthenticated access

#     def get(self, request):
#         vards_uzvards = request.GET.get('vards_uzvards', '')
#         queryset = Kritusie.objects.all()

#         if vards_uzvards:
#             queryset = queryset.filter(vards_uzvards__icontains=vards_uzvards)

#         serializer = KritusieSerializer(queryset, many=True)
#         return Response(serializer.data)

#     def post(self, request):
#         serializer = KritusieSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data)


# class UserRegister(APIView):
#     permission_classes = (permissions.AllowAny,)

#     def post(self, request):
#         clean_data = custom_validation(request.data)
#         serializer = UserRegisterSerializer(data=clean_data)
#         if serializer.is_valid(raise_exception=True):
#             user = serializer.create(clean_data)
#             if user:
#                 return Response(serializer.data, status=status.HTTP_201_CREATED)
#         return Response(status=status.HTTP_400_BAD_REQUEST)


# class UserLogin(APIView):
#     permission_classes = (permissions.AllowAny,)
#     authentication_classes = (SessionAuthentication,)
#     ##

#     def post(self, request):
#         data = request.data
#         assert validate_email(data)
#         assert validate_password(data)
#         serializer = UserLoginSerializer(data=data)
#         if serializer.is_valid(raise_exception=True):
#             user = serializer.check_user(data)
#             login(request, user)
#             return Response(serializer.data, status=status.HTTP_200_OK)


# class UserLogout(APIView):
#     permission_classes = (permissions.AllowAny,)
#     authentication_classes = ()

#     def post(self, request):
#         logout(request)
#         return Response(status=status.HTTP_200_OK)


# class UserView(APIView):
#     # permission_classes = [IsAuthenticated]
#     permission_classes = (permissions.AllowAny,)

#     def get(self, request):
#         user = request.user
#         serializer = UserSerializer(user)
#         return Response({"user": serializer.data})

#     def put(self, request):
#         user = request.user
#         # If the request body contains new values for fields, we update the user
#         user.email = request.data.get("email", user.email)
#         user.username = request.data.get("username", user.username)
#         user.save()

#         # Returning success response
#         return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)
#         # permission_classes = (permissions.IsAuthenticated,)
#         # authentication_classes = (SessionAuthentication,)
#         # ##

#         # def get(self, request):
#         #     serializer = UserSerializer(request.user)
#         #     return Response({'user': serializer.data}, status=status.HTTP_200_OK)

#         # class UserProfileView(APIView):
#         #     permission_classes = [IsAuthenticated]
#         #     authentication_classes = [SessionAuthentication]

#         #     def get(self, request):
#         #         user = request.user
#         #         serializer = UserSerializer(user)
#         #         return Response({"user": serializer.data})


# class UserProfileView(APIView):
#     # permission_classes = [IsAuthenticated]

#     def get(self, request):
#         user = request.user
#         serializer = UserSerializer(user)
#         return Response({"user": serializer.data})

#     def put(self, request):
#         user = request.user
#         # If the request body contains new values for fields, we update the user
#         user.email = request.data.get("email", user.email)
#         user.username = request.data.get("username", user.username)
#         user.save()

#         # Returning success response
#         return Response({"message": "Profile updated successfully"}, status=status.HTTP_200_OK)

#         # class UserProfileView(APIView):
#         #     permission_classes = [IsAuthenticated]

#         #     def get(self, request):
#         #         user = request.user
#         #         return Response({"user": {"email": user.email, "username": user.username}})

#         #     def put(self, request):
#         #         user = request.user
#         #         user.email = request.data.get("email", user.email)
#         #         user.username = request.data.get("username", user.username)
#         #         user.save()
#         #         return Response({"message": "Profile updated successfully"})


# def profile_view(request):
#     user = request.user
#     return JsonResponse({
#         "email": user.email,
#         "username": user.username
#     })


# # myapp/views.py


# def unified_search_view(request):
#     # Example fetching data from different endpoints
#     kritusie_data = requests.get('http://127.0.0.1:8000/kritusie/').json()
#     brigade_data = requests.get('http://127.0.0.1:8000/brigade/').json()
#     mobilizetie_data = requests.get(
#         'http://127.0.0.1:8000/mobilizetie/').json()
#     zedelgema_data = requests.get('http://127.0.0.1:8000/zedelgema/').json()

#     # Map data using utility functions
#     all_data = (
#         [map_kritusie_data(item) for item in kritusie_data] +
#         [map_brigade_data(item) for item in brigade_data] +
#         [map_mobilizetie_data(item) for item in mobilizetie_data] +
#         [map_zedelgema_data(item) for item in zedelgema_data]
#     )

#     # Return unified JSON response
#     return JsonResponse(all_data, safe=False)

#     # @login_required
#     # def change_password(request):
#     #     if request.method == 'POST':
#     #         # Initialize the PasswordChangeForm with the current user and request data
#     #         form = PasswordChangeForm(user=request.user, data=request.POST)

#     #         if form.is_valid():
#     #             # Save the new password
#     #             form.save()
#     #             # Keep the user logged in after password change
#     #             update_session_auth_hash(request, form.user)
#     #             return JsonResponse({'message': 'Password changed successfully!'}, status=200)

#     #         # If the form is not valid, return error messages
#     #         return JsonResponse({'error': form.errors}, status=400)

#     #     return JsonResponse({'error': 'Invalid method'}, status=405)


# class ChangePasswordView(APIView):
#     permission_classes = [IsAuthenticated]

#     def put(self, request):
#         serializer = ChangePasswordSerializer(
#             data=request.data, context={'request': request})
#         if serializer.is_valid():
#             user = request.user
#             user.set_password(serializer.validated_data['new_password'])
#             user.save()
#             return Response({'success': 'Parole veiksmīgi nomainīta'}, status=status.HTTP_200_OK)
#         return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

#         # def put(self, request):
#         #     user = request.user
#         #     current_password = request.data.get('currentPassword')
#         #     new_password = request.data.get('newPassword')

#         #     # Check if the current password is correct
#         #     if not user.check_password(current_password):
#         #         return Response({'error': 'Current password is incorrect.'}, status=status.HTTP_400_BAD_REQUEST)

#         #     # Validate new password (optional, you can add custom validation)
#         #     if len(new_password) < 8:
#         #         return Response({'error': 'New password must be at least 8 characters long.'}, status=status.HTTP_400_BAD_REQUEST)

#         #     # Set the new password
#         #     user.set_password(new_password)
#         #     user.save()

#         #     return Response({'success': 'Password changed successfully.'}, status=status.HTTP_200_OK)

#         # def check_username(request):
#         #     username = request.GET.get('username', None)
#         #     if username and User.objects.filter(username=username).exists():
#         #         return JsonResponse({'exists': True})
#         #     return JsonResponse({'exists': False})

#         # @api_view(['GET'])
#         # @permission_classes([IsAuthenticated])
#         # def search_brigade(request):
#         #     user = request.user
#         #     query = request.query_params.get('name', '')

#         #     # Filter based on user type
#         #     if user.is_staff:
#         #         results = Brigade.objects.filter(dienesta_vieniba__icontains=query)
#         #     else:
#         #         # Prevent normal users from accessing these fields
#         #         results = Brigade.objects.none()

#         #     serializer = BrigadeSerializer(results, many=True)
#         #     return Response(serializer.data)

#         # @api_view(['GET'])
#         # @permission_classes([IsAuthenticated])
#         # def search_kritusie(request):
#         #     user = request.user
#         #     query = request.query_params.get('name', '')

#         #     # Filter based on user type
#         #     if user.is_staff:
#         #         results = Kritusie.objects.filter(vieniba__icontains=query)
#         #     else:
#         #         # Prevent normal users from accessing these fields
#         #         results = Kritusie.objects.none()

#         #     serializer = KritusieSerializer(results, many=True)
#         #     return Response(serializer.data)


# # User = get_user_model()


# # @csrf_exempt
# # def login_view(request):
# #     if request.method == 'POST':
# #         try:
# #             data = json.loads(request.body)
# #             email = data.get('email')
# #             password = data.get('password')
# #             user = authenticate(request, username=email, password=password)
# #             if user is not None:
# #                 login(request, user)
# #                 return JsonResponse({'success': True, 'message': 'Login successful'})
# #             else:
# #                 return JsonResponse({'success': False, 'message': 'Invalid credentials'}, status=400)
# #         except json.JSONDecodeError:
# #             return JsonResponse({'success': False, 'message': 'Invalid JSON'}, status=400)
# #     return JsonResponse({'success': False, 'message': 'Invalid method'}, status=405)


# # @csrf_exempt
# # @api_view(['POST'])
# # def login_view(request):
# #     if request.method == 'POST':
# #         email = request.data.get('email')
# #         password = request.data.get('password')

# #         # Manually authenticate with email
# #         try:
# #             user = User.objects.get(email=email)
# #             if user.check_password(password):
# #                 login(request, user)
# #                 return JsonResponse({"message": "Pieteikšanās veiksmīga"})
# #             else:
# #                 return JsonResponse({"message": "Invalid credentials"}, status=400)
# #         except User.DoesNotExist:
# #             return JsonResponse({"message": "Invalid credentials"}, status=400)
# #     return JsonResponse({"message": "Only POST method allowed"}, status=405)


# # @api_view(['POST'])
# # def register_view(request):
# #     username = request.data.get('username')
# #     email = request.data.get('email')
# #     password = request.data.get('password')
# #     if User.objects.filter(email=email).exists():
# #         return Response({"error": "E-pasts jau ir aizņemts"}, status=400)
# #     if User.objects.filter(username=username).exists():
# #         return Response({"error": "Lietotājvārds jau ir aizņemts"}, status=400)
# #     user = User.objects.create_user(
# #         username=username, email=email, password=password)
# #     return Response({"message": "Reģistrācija veiksmīga"})


# # @csrf_exempt
# # def register(request):
# #     if request.method == 'POST':
# #         try:
# #             data = json.loads(request.body)
# #             email = data.get('email')
# #             username = data.get('username')
# #             password = data.get('password')

# #             if not email or not username or not password:
# #                 return JsonResponse({'error': 'Visi lauki ir jāaizpilda!'}, status=400)

# #             if User.objects.filter(username=username).exists():
# #                 return JsonResponse({'error': 'Lietotājvārds jau eksistē!'}, status=400)

# #             if User.objects.filter(email=email).exists():
# #                 return JsonResponse({'error': 'E-pasts jau tiek izmantots!'}, status=400)

# #             user = User.objects.create_user(
# #                 username=username, email=email, password=password)
# #             user.save()

# #             return JsonResponse({'message': 'Reģistrācija veiksmīga!'}, status=201)
# #         except Exception as e:
# #             return JsonResponse({'error': str(e)}, status=500)
# #     return JsonResponse({'error': 'Nepareizs pieprasījums!'}, status=400)


# # @login_required  # This ensures the user must be logged in
# # def user_view(request):
# #     user_data = {
# #         "email": request.user.email,
# #         "username": request.user.username,
# #         # Add other user information as needed
# #     }
# #     return JsonResponse({"user": user_data})
