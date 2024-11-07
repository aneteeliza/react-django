from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *
from django.db.models import Q

from django.contrib.auth import get_user_model, login, logout
from rest_framework.authentication import SessionAuthentication
from rest_framework.views import APIView
from rest_framework.response import Response
from . serializer import UserRegisterSerializer, UserLoginSerializer, UserSerializer
from rest_framework import permissions, status
from . validations import custom_validation, validate_email, validate_password
# Create your views here.
from rest_framework.permissions import AllowAny

# class ReactView(APIView):
#     serializer_class = ReactSerializer

#     def get(self, request):
#         # Get search parameters from the request query
#         name = request.GET.get('name', '')
#         pakape = request.GET.get('pakape', '')

#         # Start with all entries in the Brigade model
#         queryset = Brigade.objects.all()

#         # Filter based on name if provided
#         if name:
#             queryset = queryset.filter(uzvards_un_vards__icontains=name)

#         # Filter based on pakape if provided
#         if pakape:
#             queryset = queryset.filter(pakape__icontains=pakape)

#         # Prepare the output by serializing the queryset
#         output = [{"uzvards_un_vards": output.uzvards_un_vards, "pakape": output.pakape}
#                   for output in queryset]

#         # Return the filtered results
#         return Response(output)

#     def post(self, request):
#         serializer = ReactSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data)

from rest_framework.permissions import AllowAny

class ReactView(APIView):
    permission_classes = [AllowAny]  # Allow unauthenticated access

    def get(self, request):
        name = request.GET.get('name', '')
        pakape = request.GET.get('pakape', '')
        queryset = Brigade.objects.all()

        if name:
            queryset = queryset.filter(uzvards_un_vards__icontains=name)

        if pakape:
            queryset = queryset.filter(pakape__icontains=pakape)

        serializer = ReactSerializer(queryset, many=True)
        return Response(serializer.data)

    def post(self, request):
        serializer = ReactSerializer(data=request.data)
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
	permission_classes = (permissions.IsAuthenticated,)
	authentication_classes = (SessionAuthentication,)
	##
	def get(self, request):
		serializer = UserSerializer(request.user)
		return Response({'user': serializer.data}, status=status.HTTP_200_OK)


# class ReactView(APIView):

#     serializer_class = ReactSerializer

#     def get(self, request):
#         output = [{"employee": output.employee, "department": output.department}
#                   for output in React.objects.all()]
#         return Response(output)

#     def post(self, request):

#         serializer = ReactSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data)


# class ReactView(APIView):

#     serializer_class = ReactSerializer

#     def get(self, request):
#         output = [{"uzvards_un_vards": output.uzvards_un_vards, "pakape": output.pakape}
#                   for output in Brigade.objects.all()]
#         return Response(output)

#     def post(self, request):

#         serializer = ReactSerializer(data=request.data)
#         if serializer.is_valid(raise_exception=True):
#             serializer.save()
#             return Response(serializer.data)


# def search_people(request):
#     name_search = request.GET.get('name', '')
#     birthdate_search = request.GET.get('birthdate', '')

#     # Create the base query to filter people
#     people = Person.objects.all()

#     if name_search:
#         people = people.filter(
#             Q(name__icontains=name_search) | Q(surname__icontains=name_search)
#         )

#     if birthdate_search:
#         # Convert the input to a date and filter by birthdate
#         try:
#             birthdate = datetime.strptime(birthdate_search, '%Y-%m-%d').date()
#             people = people.filter(birthdate=birthdate)
#         except ValueError:
#             pass  # Handle invalid date input

#     people = people.order_by('name', 'surname', 'birthdate')  # Order by name, surname, and birthdate

#     return render(request, 'search_results.html', {'people': people})
