# Generated by Django 5.1.5 on 2025-01-18 21:36

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resume', '0003_subsection_time_range'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bulletpoint',
            name='section',
            field=models.ManyToManyField(blank=True, related_name='bullet_points', to='resume.section'),
        ),
        migrations.AlterField(
            model_name='bulletpoint',
            name='sub_section',
            field=models.ManyToManyField(blank=True, related_name='bullet_points', to='resume.subsection'),
        ),
        migrations.AlterField(
            model_name='subsection',
            name='description',
            field=models.CharField(blank=True, max_length=1000, null=True),
        ),
    ]
