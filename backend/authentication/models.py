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
            "bullet_points": self.bullet_points,
            "sub_sections": self.sub_sections,
            "resumes": self.resumes,
        }
