from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    email = models.EmailField(unique=True)
    username = models.CharField(unique=True, max_length=250)

    def public_details(self) -> dict:
        return {
            "username": self.username,
            "email": self.email,
        }
    
    def private_details(self) -> dict:
        return {
            "username": self.username,
            "email": self.email,
        }
