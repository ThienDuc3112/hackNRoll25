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


class ResumeGetSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField(required=True)


class SectionGetSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField(required=True)


class ResumeDeleteSerializer(serializers.Serializer):
    resume_id = serializers.IntegerField(required=True)


class SubSectionDeleteSerializer(serializers.Serializer):
    sub_section_id = serializers.IntegerField(required=True)


class BulletPointDeleteSerializer(serializers.Serializer):
    bullet_point_id = serializers.IntegerField(required=True)
