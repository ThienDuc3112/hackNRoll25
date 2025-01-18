from rest_framework import serializers
from django.contrib.auth import authenticate
from django.core.exceptions import ValidationError
from .models import Resume, Section, SubSection, BulletPoint

class ResumeCreateSerializer(serializers.Serializer):
    name = serializers.CharField(required=True) 


class SectionCreateSerializer(serializers.Serializer):
    title = serializers.CharField(required=True)
    resume_id = serializers.IntegerField(required=True)


class SubSectionCreateSerializer(serializers.Serializer):
    title = serializers.CharField(required=True)
    description = serializers.CharField(required=True)
    resume_id = serializers.IntegerField(required=True)
    section_id = serializers.IntegerField(required=True)


class BulletPointCreateSerializer(serializers.Serializer):
    data= serializers.CharField(required=True)
    resume_id = serializers.IntegerField(required=True)
    section_id = serializers.IntegerField(required=True)
