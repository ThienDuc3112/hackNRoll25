from django.http import HttpRequest
import logging
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from rest_framework import permissions, status
from .serializers import (
    ResumeCreateSerializer,
    SectionCreateSerializer,
    SubSectionCreateSerializer,
    BulletPointCreateSerializer,
)
from django.conf import settings
from .models import Resume, Section, SubSection, BulletPoint
from drf_spectacular.utils import extend_schema

logger = logging.getLogger(__name__)

class ResumeViews(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(
        request=ResumeCreateSerializer,
        description='User create new resume template',
    )

    def post(self, request: HttpRequest) -> Response:
        serializer = ResumeCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        resume = Resume.objects.create(
            name=serializer.validated_data.get("name"),
            user=request.user,
        )
        response = Response({"resume": resume.details()}, status=status.HTTP_201_CREATED)
        return response


class SectionViews(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(
        request=SectionCreateSerializer,
        description='User create new section for resume',
    )

    def post(self, request: HttpRequest) -> Response:
        serializer = SectionCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            resume = Resume.objects.get(id=request.data.get('resume_id'))
        except Resume.DoesNotExist:
            return Response({"error": "Resume id not found"}, status=404)

        section = Section.objects.create(
            title=serializer.validated_data.get('title'),
            resume=resume,
        )
        response = Response({"section": section.details()}, status=status.HTTP_201_CREATED)
        return response


class SubSectionViews(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(
        request=SubSectionCreateSerializer,
        description='User create new sub section for resume',
    )

    def post(self, request: HttpRequest) -> Response:
        serializer = SubSectionCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
            
        try:
            resume = Resume.objects.get(id=request.data.get('resume_id'))
        except Resume.DoesNotExist:
            return Response({"error": "Resume id not found"}, status=404)
        
        try:
            section = Section.objects.get(id=request.data.get('section_id'))
        except Section.DoesNotExist:
            return Response({"error": "Section id not found"}, status=404)

        sub_section = SubSection.objects.create(
            title=serializer.validated_data.get('title'),
            description=serializer.validated_data.get('description'),
            section=section,
            user=request.user,
            resume=resume
        )
        response = Response({"sub_section": sub_section.details()}, status=status.HTTP_201_CREATED)
        return response


class BulletPointViews(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(
        request=BulletPointCreateSerializer,
        description='User create new bullet point',
    )

    def post(self, request: HttpRequest) -> Response:
        serializer = BulletPointCreateSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            resume = Resume.objects.get(id=request.data.get('resume_id'))
        except Resume.DoesNotExist:
            return Response({"error": "Resume id not found"}, status=404)
        
        try:
            sub_section = SubSection.objects.get(id=request.data.get('section_id'))
        except SubSection.DoesNotExist:
            return Response({"error": "Subsection id not found"}, status=404)

        bullet_point = BulletPoint.objects.create(
            data=serializer.validated_data.get('data'),
            sub_section=sub_section,
            user=request.user,
        )
        response = Response({"bullet_point": bullet_point.details()}, status=status.HTTP_201_CREATED)
        return response
