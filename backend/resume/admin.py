from django.contrib import admin
from .models import Resume, Section, SubSection, BulletPoint

# Register models
admin.site.register(Resume)
admin.site.register(Section)
admin.site.register(SubSection)
admin.site.register(BulletPoint)
