from django.http import HttpRequest
import logging
from rest_framework.request import Request
from rest_framework.response import Response
from rest_framework.permissions import IsAuthenticated
from rest_framework.views import APIView
from django.contrib.auth import login, logout
from .serializers import (
    UserRegisterSerializer,
    UserLoginSerializer,
    UserDetailSerializer,
)
from django.conf import settings
from .models import User

class UserRegister(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        request=UserRegisterSerializer,
        description='Register a new user with username, email, and password',
    )

    def post(self, request: HttpRequest) -> Response:
        serializer = UserRegisterSerializer(data=request.data)

        if serializer.is_valid():
            user: User = serializer.save()
            login(request, user)
            response = Response({"user": user.private_details()}, status=status.HTTP_201_CREATED)
            return response
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogin(APIView):
    permission_classes = (permissions.AllowAny,)

    @extend_schema(
        request=UserLoginSerializer,
        description='Login using username and password',
    )

    def post(self, request: HttpRequest) -> Response:
        serializer = UserLoginSerializer(data=request.data)

        if serializer.is_valid():
            user: User = serializer.validated_data
            login(request, user)
            return Response({"user": user.private_details()}, status=status.HTTP_200_OK)
        return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)


class UserLogout(APIView):
    permission_classes = (IsAuthenticated,)

    @extend_schema(
        description='Logout the current user',
    )
    def post(self, request):
        logout(request)
        return Response(status=status.HTTP_200_OK)
        