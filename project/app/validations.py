from app.models import AppUser
from rest_framework.exceptions import ValidationError
import re
from django.core.exceptions import ValidationError
from django.contrib.auth import get_user_model
AppUser = get_user_model()


# def custom_validation(data):
#     email = data['email'].strip()
#     # username = data['username'].strip()
#     password = data['password'].strip()
#     ##
#     if not email or AppUser.objects.filter(email=email).exists():
#         raise ValidationError('choose another email')
#     ##
#     if not password or len(password) < 8:
#         raise ValidationError('choose another password, min 8 characters')
#     ##
#     # if not username:
#     #     raise ValidationError('choose another username')
#     return data


# def custom_validation(data):
#     email = data['email'].strip()
#     password = data['password'].strip()

#     # Email validation
#     if not email or AppUser.objects.filter(email=email).exists():
#         raise ValidationError(
#             'Izvēlies citu e-pastu. Lietotājs ar šādu e-pastu jau ir reģistrēts.')

#     # Password validation: Check for length, uppercase, and number
#     if not password or len(password) < 8 or not re.search(r'[A-Z]', password) or not re.search(r'[0-9]', password):
#         raise ValidationError(
#             'Parolei jābūt vismaz 8 simbolus garai, jāsatur vismaz 1 lielais burts un vismaz 1 cipars.')

#     return data


def custom_validation(data):
    email = data['email'].strip()
    password = data['password'].strip()

    # Validate email uniqueness
    if not email or AppUser.objects.filter(email=email).exists():
        raise ValidationError(
            'Izvēlies citu e-pastu. Lietotājs ar šādu e-pastu jau ir reģistrēts.')

    # Validate password length
    if not password or len(password) < 8:
        raise ValidationError(
            'Izvēlies citu paroli, tai jābūt vismaz 8 simbolus garai.')

    # Validate password contains at least one uppercase letter
    if not re.search(r'[A-Z]', password):
        raise ValidationError(
            'Parolei jāsatur vismaz 1 lielais burts.')

    # Validate password contains at least one number
    if not re.search(r'[0-9]', password):
        raise ValidationError('Parolei jāsatur vismaz 1 cipars.')

    return data


def validate_email(data):
    email = data['email'].strip()
    if not email:
        raise ValidationError('an email is needed')
    return True

# def validate_username(data):
#     username = data['username'].strip()
#     if not username:
#         raise ValidationError('choose another username')
#     return True


def validate_password(data):
    password = data['password'].strip()
    if not password:
        raise ValidationError('a password is needed')
    return True
