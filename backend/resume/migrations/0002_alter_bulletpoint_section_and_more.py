# Generated by Django 5.1.5 on 2025-01-18 10:19

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('resume', '0001_initial'),
    ]

    operations = [
        migrations.AlterField(
            model_name='bulletpoint',
            name='section',
            field=models.ManyToManyField(related_name='bullet_points', to='resume.section'),
        ),
        migrations.AlterField(
            model_name='bulletpoint',
            name='sub_section',
            field=models.ManyToManyField(related_name='bullet_points', to='resume.subsection'),
        ),
    ]