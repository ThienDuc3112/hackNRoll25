from django.db import models
from authentication.models import User

class Resume(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='resumes')
    name = models.CharField(max_length=500)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True) 

    def details(self) -> dict:
        return {
            "name": self.name,
            "created_at": self.created_at,
            "updated_at": self.updated_at,
            "id": self.id,
        }
    
    def __str__(self):
        return f"Resume {self.name} (created: {self.created_at}, updated: {self.updated_at})"


class Section(models.Model):
    title = models.CharField(max_length=500)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='sections')

    def details(self) -> dict:
        return {
            "name": self.title,
            "id": self.id,
        }


class SubSection(models.Model):
    title = models.CharField(max_length=500)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sub_sections')
    section = models.ManyToManyField(Section, related_name='sub_sections')
    description = models.CharField(max_length=1000)

    def details(self) -> dict:
        return {
            "title": self.title,
            "description": self.description,
            "id": self.id,
        }


class BulletPoint(models.Model):
    data = models.CharField(max_length=5000)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bullet_points')
    section = models.ManyToManyField(
        Section,
        related_name='bullet_points',
    )
    sub_section = models.ManyToManyField(
        SubSection,
        related_name='bullet_points',
    )

    def details(self) -> dict:
        return {
            "data": self.data,
            "id": self.id,
        }

