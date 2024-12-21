# from django.contrib import admin
# from .models import AppUser


# class AppUserAdmin(admin.ModelAdmin):
#     list_display = ('email', 'username', 'is_staff', 'is_superuser')
#     # Enables selection of groups and permissions
#     filter_horizontal = ('groups', 'user_permissions',)


# admin.site.register(AppUser, AppUserAdmin)

from django.contrib import admin
from .models import AppUser


class AppUserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'is_staff', 'is_superuser')
    # Enables selection of groups and permissions
    filter_horizontal = ('groups', 'user_permissions',)


admin.site.register(AppUser, AppUserAdmin)
