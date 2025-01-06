from django.contrib.auth import get_user_model
from rest_framework.test import APIClient
from rest_framework import status
from django.urls import reverse
from django.test import TestCase
from app.models import Zedelgema
from app.views import ZedelgemaView
from app.views import *


# class SearchPeopleTestCase(TestCase):
#     # def setUp(self):
#     #     # Izveidojam testēšanas datus
#     #     Zedelgema.objects.create(
#     #         nr=1, vards="Bērziņš", uzvards="Bērziņš", dienesta_vieniba="15. divīzija", nometnes_nodalijums="1")
#     #     Zedelgema.objects.create(
#     #         nr=2, vards="Anna", uzvards="Liepa", dienesta_vieniba="106. grenadieru pulks", nometnes_nodalijums="1")
#     #     Zedelgema.objects.create(
#     #         nr=3, vards="Pēteris", uzvards="Ozols", dienesta_vieniba="15. divīzija", nometnes_nodalijums="2")
#     #     Zedelgema.objects.create(
#     #         nr=4, vards="Juris", uzvards="Lapiņš", dienesta_vieniba="Latviešu lauka papildinājumu depo", nometnes_nodalijums="1")

#     def setUp(self):
#         # Izveidojam testēšanas datus
#         Zedelgema.objects.create(
#             nr=1, vards="Jānis Bērziņš", dienesta_vieniba="15. divīzija", nometnes_nodalijums="1")
#         Zedelgema.objects.create(
#             nr=2, vards="Anna Liepa", dienesta_vieniba="106. grenadieru pulks", nometnes_nodalijums="1")
#         Zedelgema.objects.create(
#             nr=3, vards="Pēteris Ozols", dienesta_vieniba="15. divīzija", nometnes_nodalijums="2")
#         Zedelgema.objects.create(
#             nr=4, vards="Juris Lapiņš", dienesta_vieniba="Latviešu lauka papildinājumu depo", nometnes_nodalijums="1")

#     def test_search_people_by_name(self):
#         response = self.client.get('/zedelgema/', {'vards': 'Jānis'})
#         self.assertEqual(response.status_code, 200)
#         self.assertContains(response, "Jānis Bērziņš")

#     def test_search_by_rank(self):
#         response = self.client.get(
#             '/zedelgema/', {'dienesta_vieniba': '15. divīzija'})
#         self.assertEqual(response.status_code, 200)
#         self.assertContains(response, "Jānis Bērziņš")
#         self.assertContains(response, "Pēteris Ozols")
#         self.assertNotContains(response, "Anna Liepa")

#     def test_search_by_multiple_parameters(self):
#         # Search by name and rank
#         response = self.client.get(
#             '/zedelgema/', {'vards': 'Jānis', 'dienesta_vieniba': '15. divīzija'})
#         self.assertEqual(response.status_code, 200)
#         self.assertContains(response, "Jānis Bērziņš")
#         self.assertNotContains(response, "Pēteris Ozols")

#     def test_search_with_no_query_params(self):
#         # Test that returns all people if no query parameter is provided
#         response = self.client.get('/zedelgema/')
#         self.assertEqual(response.status_code, 200)
#         self.assertContains(response, "Jānis Bērziņš")
#         self.assertContains(response, "Anna Liepa")
#         self.assertContains(response, "Pēteris Ozols")
#         self.assertContains(response, "Juris Lapiņš")

#     def test_search_with_case_insensitivity(self):
#         # Test case-insensitive search by name
#         response = self.client.get('/zedelgema/', {'vards': 'jānis'})
#         self.assertEqual(response.status_code, 200)
#         self.assertContains(response, "Jānis Bērziņš")

#     def test_search_sorting_by_rank(self):
#         # Test sorting by rank, assuming the rank can be sorted alphabetically
#         response = self.client.get('/zedelgema/', {'sort': 'dienesta_vieniba'})
#         self.assertEqual(response.status_code, 200)
#         # Should appear before other ranks alphabetically
#         self.assertContains(response, "Latviešu lauka papildinājumu depo")
#         self.assertContains(response, "15. divīzija")
#         self.assertContains(response, "106. grenadieru pulks")

#     def test_search_people_no_results(self):
#         response = self.client.get('/zedelgema/', {'vards': 'Pēteris'})
#         self.assertEqual(response.status_code, 200)
#         self.assertNotContains(response, "Pēteris")

#     def test_search_with_empty_results(self):
#         # Test empty search, should return a message like "No results found"
#         response = self.client.get('/zedelgema/', {'vards': ''})
#         self.assertEqual(response.status_code, 200)
#         self.assertContains(response, "Nav atrasti rezultāti")

#     def test_search_with_nonexistent_rank(self):
#         # Test searching with a rank that doesn't exist
#         response = self.client.get(
#             '/zedelgema/', {'dienesta_vieniba': '19. divīzija'})
#         self.assertEqual(response.status_code, 200)
#         self.assertContains(response, "Nav atrasti rezultāti")


# class UserProfileTestCase(TestCase):
#     def setUp(self):
#         # Create a test user
#         self.user = get_user_model().objects.create_user(
#             email='test@example.com',
#             password='Testpassword12'
#         )
#         self.client = APIClient()
#         # Authenticate the client with the test user
#         self.client.force_authenticate(user=self.user)

#     # def test_get_user_profile(self):
#     #     url = reverse('login')  # Ensure 'login' matches the name in path()
#     #     data = {
#     #         'email': 'test@example.com',
#     #         'password': 'Testpassword12'
#     #     }
#     #     response = self.client.post(url, data)  # Use POST instead of GET

#     #     # Check that the response status is OK
#     #     self.assertEqual(response.status_code, status.HTTP_200_OK)

#     #     # Validate the response data
#     #     self.assertEqual(response.data['user']['email'], 'test@example.com')
#     def test_get_user_profile(self):
#         url = reverse('login')
#         data = {
#             'email': 'test@example.com',
#             'password': 'Testpassword12'
#         }
#         response = self.client.post(url, data)

#         # Check that the response status is OK
#         self.assertEqual(response.status_code, status.HTTP_200_OK)

#         # Print the response for debugging
#         print(response.data)

#         # Validate the response data
#         self.assertIn('user', response.data)
#         self.assertEqual(response.data['user']['email'], 'test@example.com')

#     # def test_invalid_user(self):
#     #     url = reverse('login')
#     #     data = {
#     #         'email': 'invalid@example.com',  # Invalid email
#     #         'password': 'wrongpassword'  # Invalid password
#     #     }
#     #     response = self.client.post(url, data)

#     #     # Check that the response status is UNAUTHORIZED
#     #     self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)

#     def test_invalid_user(self):
#         url = reverse('login')
#         data = {
#             'email': 'invalid@example.com',
#             'password': 'wrongpassword'
#         }
#         response = self.client.post(url, data)

#         # Check for 400 or 401, depending on the expected behavior
#         self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)


class UserProfileTestCase(TestCase):
    def setUp(self):
        # Create a test user
        self.user = get_user_model().objects.create_user(
            email='test@example.com',
            password='Testpassword12'
        )
        self.client = APIClient()

    def test_get_user_profile(self):
        url = reverse('login')
        data = {
            'email': 'test@example.com',
            'password': 'Testpassword12'
        }
        response = self.client.post(url, data)

        # Check that the response status is OK
        self.assertEqual(response.status_code, status.HTTP_200_OK)

        # Validate the response data - replace 'user' with actual response keys
        self.assertEqual(response.data['email'], 'test@example.com')

    def test_invalid_user(self):
        url = reverse('login')
        data = {
            'email': 'invalid@example.com',  # Invalid email
            'password': 'wrongpassword'  # Invalid password
        }
        response = self.client.post(url, data)

        # Check for BAD REQUEST instead of UNAUTHORIZED
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
