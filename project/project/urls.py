"""
URL configuration for project project.

The `urlpatterns` list routes URLs to views. For more information please see:
    https://docs.djangoproject.com/en/5.1/topics/http/urls/
Examples:
Function views
    1. Add an import:  from my_app import views
    2. Add a URL to urlpatterns:  path('', views.home, name='home')
Class-based views
    1. Add an import:  from other_app.views import Home
    2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
Including another URLconf
    1. Import the include() function: from django.urls import include, path
    2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
"""
from django.contrib import admin
from django.urls import path, include
from app.views import *

urlpatterns = [
    path('api/admin/', admin.site.urls),
    path('api/search', SearchView.as_view(), name="anything"),
    path('api/update', UpdateView.as_view(), name="update"),
    path('api/register', UserRegister.as_view(), name='register'),
    path('api/login', UserLogin.as_view(), name='login'),
    path('api/logout', UserLogout.as_view(), name='logout'),
    path('api/user', UserView.as_view(), name='user'),
    path('api/user/activate', UserActivateView.as_view(), name='activate'),
    path('api/user/change-password', ChangePasswordView.as_view(),
         name='change-password'),
    path('api/delete/', UserDelete.as_view(), name='user-delete'),
]
