# pagination.py
from rest_framework.pagination import PageNumberPagination
from rest_framework.response import Response


class StandardResultsSetPagination(PageNumberPagination):
    page_size = 100  # Customize as needed
    page_size_query_param = 'page_size'
    max_page_size = 1000

    def get_paginated_response(self, data):
        return Response(data)


class NoCountPagination(PageNumberPagination):
    page_size = 3000  # Or any size you prefer
    page_size_query_param = 'page_size'
    max_page_size = 100000

    def get_paginated_response(self, data):
        # Only return the results, no pagination metadata
        return Response(data)


class LargeResultsSetPagination(PageNumberPagination):
    page_size = 1000
    page_size_query_param = 'page_size'
    max_page_size = 10000
