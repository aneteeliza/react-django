from django.shortcuts import render
from rest_framework.views import APIView
from . models import *
from rest_framework.response import Response
from . serializer import *
from django.db.models import Q
from .models import Person
# Create your views here.

class ReactView(APIView):
    serializer_class = ReactSerializer

    def get(self, request):
        # Get search parameters from the request query
        name = request.GET.get('name', '')
        pakape = request.GET.get('pakape', '')

        # Start with all entries in the Brigade model
        queryset = Brigade.objects.all()

        # Filter based on name if provided
        if name:
            queryset = queryset.filter(uzvards_un_vards__icontains=name)

        # Filter based on pakape if provided
        if pakape:
            queryset = queryset.filter(pakape__icontains=pakape)

        # Prepare the output by serializing the queryset
        output = [{"uzvards_un_vards": output.uzvards_un_vards, "pakape": output.pakape}
                  for output in queryset]

        # Return the filtered results
        return Response(output)

    def post(self, request):
        serializer = ReactSerializer(data=request.data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)

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
