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
            "sections": [section.details() for section in self.sections.all()],
            "id": self.id,
        }
    
    def __str__(self):
        return f"Resume {self.name} (created: {self.created_at}, updated: {self.updated_at})"
    
    def update_details(self, name: str | None):
        if name:
            self.name = name
        self.save()


class Section(models.Model):
    title = models.CharField(max_length=500)
    resume = models.ForeignKey(Resume, on_delete=models.CASCADE, related_name='sections')

    def details(self) -> dict:
        return {
            "title": self.title,
            "id": self.id,
            "sub_sections": [sub_section.details() for sub_section in self.sub_sections.all()],
            "bullet_points": [bullet_point.details() for bullet_point in self.bullet_points.all()],
        }

    def update_details(self, title: str | None):
        if title:
            self.title = title
        self.save()


class SubSection(models.Model):
    title = models.CharField(max_length=500)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='sub_sections')
    section = models.ManyToManyField(Section, related_name='sub_sections')
    description = models.CharField(max_length=1000, null=True, blank=True)
    time_range = models.CharField(max_length=250, null=True, blank=True)

    def details(self) -> dict:
        return {
            "title": self.title,
            "description": self.description,
            "time_range": self.time_range,
            "id": self.id,
            "bullet_points": [bullet_point.details() for bullet_point in self.bullet_points.all()],
        }

    def update_details(self, title: str | None, description: str | None, time_range: str | None):
        if title:
            self.title = title
        if description:
            self.description = description
        if time_range:
            self.time_range = time_range
        self.save()


class BulletPoint(models.Model):
    data = models.CharField(max_length=5000)
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='bullet_points')
    section = models.ManyToManyField(
        Section,
        related_name='bullet_points',
        blank=True
    )
    sub_section = models.ManyToManyField(
        SubSection,
        related_name='bullet_points',
        blank=True
    )

    def details(self) -> dict:
        return {
            "data": self.data,
            "id": self.id,
        }

    def update_details(self, data: str | None):
        if data:
            self.data = data
        self.save()
