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
    path('admin/', admin.site.urls),
    path('', BrigadeView.as_view(), name="anything"),
    path('brigade/', BrigadeView.as_view(), name='brigade'),
    path('mobilizetie/', MobilizetieView.as_view(), name='mobilizetie'),
    path('zedelgema/', ZedelgemaView.as_view(), name='zedelgema'),
    path('kritusie/', KritusieView.as_view(), name='kritusie'),
    # path('', BrigadeView.as_view(), name="anything"),
    path('register', UserRegister.as_view(), name='register'),
    path('login', UserLogin.as_view(), name='login'),
    path('logout', UserLogout.as_view(), name='logout'),
    path('user', UserView.as_view(), name='user'),
    path('user/', UserProfileView.as_view(), name='user-profile'),
    path('user', UserProfileView.as_view(), name='user-profile'),
    path('user/change-password', ChangePasswordView.as_view(),
         name='change-password'),
    # path('check-username', views.check_username, name='check_username'),
    # path('change-password/', ChangePassword.as_view(), name='change_password'),
    # path('change-password/', change_password.as_view, name='change_password'),
]
