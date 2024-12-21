# """
# URL configuration for project project.

# The `urlpatterns` list routes URLs to views. For more information please see:
#     https://docs.djangoproject.com/en/5.1/topics/http/urls/
# Examples:
# Function views
#     1. Add an import:  from my_app import views
#     2. Add a URL to urlpatterns:  path('', views.home, name='home')
# Class-based views
#     1. Add an import:  from other_app.views import Home
#     2. Add a URL to urlpatterns:  path('', Home.as_view(), name='home')
# Including another URLconf
#     1. Import the include() function: from django.urls import include, path
#     2. Add a URL to urlpatterns:  path('blog/', include('blog.urls'))
# """
# from django.contrib import admin
# from django.urls import path, include
# from app.views import *
# from django.contrib.auth import views as auth_views
# from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
# from django.contrib.auth.models import User
# from django.contrib.auth import views as auth_views


# urlpatterns = [
#     path('admin/', admin.site.urls),

#     # Login URL - Django provides a login view that handles the authentication
#     path('login/', auth_views.LoginView.as_view(), name='login'),

#     # Logout URL - Django provides a logout view to log the user out
#     path('logout/', auth_views.LogoutView.as_view(), name='logout'),

#     # Optional: Password change views, reset views, etc.
#     path('password_change/', auth_views.PasswordChangeView.as_view(),
#          name='password_change'),
#     path('password_reset/', auth_views.PasswordResetView.as_view(),
#          name='password_reset'),
#     path('password_reset/done/', auth_views.PasswordResetDoneView.as_view(),
#          name='password_reset_done'),

#     # Regular app URLs
#     path('', BrigadeView.as_view(), name="home"),
#     path('brigade/', BrigadeView.as_view(), name='brigade'),
#     path('mobilizetie/', MobilizetieView.as_view(), name='mobilizetie'),
#     path('zedelgema/', ZedelgemaView.as_view(), name='zedelgema'),
#     path('kritusie/', KritusieView.as_view(), name='kritusie'),

#     # User authentication URLs
#     # path('register/', UserRegister.as_view(), name='register'),
#     # path('login/', UserLogin.as_view(), name='login'),
#     # path('logout/', UserLogout.as_view(), name='logout'),

#     # User profile URLs
#     path('user/', UserProfileView.as_view(), name='user-profile'),
#     path('user/change-password', ChangePasswordView.as_view(),
#          name='change-password'),


#     # Detailed mobilizetie URL
#     path('mobilizetie/<int:pk>/', MobilizetieView.as_view(),
#          name='mobilizetie-detail'),

#     # API URLs
#     # path('api/register/', register, name='api-register'),
#     # path('login/', login_view, name='api-login'),
#     # path('api/logout/', auth_views.LogoutView.as_view(), name='api-logout'),
#     # path('api/user/', user_view, name='api-user'),
#     # path('api/token/', TokenObtainPairView.as_view(),
#     #      name='api-token_obtain_pair'),
#     # path('api/token/refresh/', TokenRefreshView.as_view(),
#     #      name='api-token_refresh'),
# ]


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
