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
    ResumeGetSerializer,
    SectionGetSerializer,
    ResumeDeleteSerializer,
    SubSectionDeleteSerializer,
    BulletPointDeleteSerializer,
    ResumePutSerializer,
    SectionPutSerializer,
    SubSectionPutSerializer,
    BulletPointPutSerializer,
)
from django.conf import settings
from .models import Resume, Section, SubSection, BulletPoint
from drf_spectacular.utils import extend_schema
from django.core.exceptions import ObjectDoesNotExist

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

    @extend_schema(
        request=ResumeGetSerializer,
        description='Get resume',
    )
    def get(self, request: HttpRequest) -> Response:
        serializer = ResumeGetSerializer(data=request.query_params)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            resume = Resume.objects.get(id=serializer.validated_data.get('resume_id'))
            return Response({"resume": resume}, status=HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response({"error": "Resume id not found"}, status=404)

    @extend_schema(
        request=ResumeDeleteSerializer,
        description='Delete resume',
    )
    def delete(self, request: HttpRequest) -> Response:
        serializer = ResumeDeleteSerializer(data=request.query_params)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            resume = Resume.objects.get(id=serializer.validated_data.get('resume_id'), user=request.user)
            resume.delete()
            return Response({"message": "Resume deleted successfully"}, status=HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response({"error": "Resume id not found or you have no permission to delete this resume"}, status=404)
    
    @extend_schema(
        request=ResumePutSerializer,
        description='Update resume',
    )
    def put(self, request: HttpRequest) -> Response:
        serializer = ResumePutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            resume = Resume.objects.get(id=serializer.validated_data.get('resume_id'), user=request.user)
            name = serializer.validated_data.get('name')
            resume.update_details(name=name)
            return Response({"resume": resume}, status=HTTP_200_OK)
        except Resume.DoesNotExist:
            return Response({"error": "Resume id not found or you have no permission to update this resume"}, status=404)


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
            resume = Resume.objects.get(id=serializer.validated_data.get('resume_id'))
        except Resume.DoesNotExist:
            return Response({"error": "Resume id not found"}, status=404)

        section = Section.objects.create(
            title=serializer.validated_data.get('title'),
            resume=resume,
        )
        response = Response({"section": section.details()}, status=status.HTTP_201_CREATED)
        return response
    
    @extend_schema(
        request=SectionGetSerializer,
        description='Get sections from a resume',
    )
    def get(self, request: HttpRequest) -> Response:
        serializer = SectionGetSerializer(data=request.query_params)
        
        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            sections = Section.objects.filter(resume__id=serializer.validated_data.get('resume_id'))
            return Response({"sections": sections}, status=HTTP_200_OK)
        except Exception as e:
            return Response({"error": str(e)}, status=404)
    
    @extend_schema(
        request=SectionPutSerializer,
        description='Update section',
    )
    def put(self, request: HttpRequest) -> Response:
        serializer = SectionPutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            section = Section.objects.get(id=serializer.validated_data.get('section_id'), user=request.user)
            title = serializer.validated_data.get('title')
            section.update_details(title=title)
            return Response({"section": section}, status=HTTP_200_OK)
        except Section.DoesNotExist:
            return Response({"error": "Section id not found or you have no permission to update this section"}, status=404)


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
            resume = Resume.objects.get(id=serializer.validated_data.get('resume_id'))
        except Resume.DoesNotExist:
            return Response({"error": "Resume id not found"}, status=404)
        
        try:
            section = Section.objects.get(id=serializer.validated_data.get('section_id'))
        except Section.DoesNotExist:
            return Response({"error": "Section id not found"}, status=404)

        sub_section = SubSection.objects.create(
            title=serializer.validated_data.get('title'),
            description=serializer.validated_data.get('description'),
            time_range=serializer.validated_data.get('time_range'),
            section=section,
            user=request.user,
            resume=resume
        )
        response = Response({"sub_section": sub_section.details()}, status=status.HTTP_201_CREATED)
        return response

    @extend_schema(
        request=SubSectionDeleteSerializer,
        description='Delete Sub section',
    )
    def delete(self, request: HttpRequest) -> Response:
        serializer = SubSectionDeleteSerializer(data = request.query_params)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            sub_section = SubSection.objects.get(id=serializer.validated_data.get('sub_section_id'), user=request.user)
            sub_section.delete()
            return Response({"message": "Subsection deleted successfully"}, status=HTTP_200_OK)
        except SubSection.DoesNotExist:
            return Response({"error": "Sub section not found or you have no permission to delete this subsection"}, status=404)
    
    @extend_schema(
        request=SubSectionPutSerializer,
        description='Update section',
    )
    def put(self, request: HttpRequest) -> Response:
        serializer = SubSectionPutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            sub_section = SubSection.objects.get(id=serializer.validated_data.get('sub_section_id'), user=request.user)
            title = serializer.validated_data.get('title')
            time_range = serializer.validated_data.get('time_range')
            description = serializer.validated_data.get('description')
            sub_section.update_details(title=title, time_range=time_range, description=description)
            return Response({"section": section}, status=HTTP_200_OK)
        except SubSection.DoesNotExist:
            return Response({"error": "Sub section id not found or you have no permission to update this sub section"}, status=404)


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
            resume = Resume.objects.get(id=serializer.validated_data.get('resume_id'))
        except Resume.DoesNotExist:
            return Response({"error": "Resume id not found"}, status=404)
        
        try:
            sub_section = SubSection.objects.get(id=serializer.validated_data.get('section_id'))
        except SubSection.DoesNotExist:
            return Response({"error": "Subsection id not found"}, status=404)

        bullet_point = BulletPoint.objects.create(
            data=serializer.validated_data.get('data'),
            sub_section=sub_section,
            user=request.user,
        )
        response = Response({"bullet_point": bullet_point.details()}, status=status.HTTP_201_CREATED)
        return response

    @extend_schema(
        request=BulletPointDeleteSerializer,
        description='Delete sub section',
    )
    def delete(self, request: HttpRequest) -> Response:
        serializer = BulletPointDeleteSerializer(data=request.query_params)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)
        try:
            bullet_point = BulletPoint.objects.get(id=serializer.validated_data.get('bullet_point_id'), user=request.user)
            bullet_point.delete()
            return Response({"message": "Bulletpoint deleted successfully"}, status=HTTP_200_OK)
        except BulletPoint.DoesNotExist:
            return Response({"error": "Bullet point not found or you have no permission to delete this bullet point"}, status=404)
    
    @extend_schema(
        request=BulletPointPutSerializer,
        description='Update bullet point',
    )
    def put(self, request: HttpRequest) -> Response:
        serializer = BulletPointPutSerializer(data=request.data)

        if not serializer.is_valid():
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        try:
            bullet_point = BulletPoint.objects.get(id=serializer.validated_data.get('bullet_point_id'), user=request.user)
            data = serializer.validated_data.get('data')
            bullet_point.update_details(data=data)
            return Response({"bullet_point": bullet_point}, status=HTTP_200_OK)
        except BulletPoint.DoesNotExist:
            return Response({"error": "Bullet point not found or you have no permission to update this bullet point"}, status=404)
