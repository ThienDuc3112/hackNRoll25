from django.urls import path
from . import views

urlpatterns = [
    path("resume/", views.ResumeViews.as_view(), name="resume"),
    path("section/", views.SectionViews.as_view(), name="section"),
    path("subsection/", views.SubSectionViews.as_view(), name="subsection"),
    path("bulletpoint/", views.BulletPointViews.as_view(), name="bulletpoint"),
]
