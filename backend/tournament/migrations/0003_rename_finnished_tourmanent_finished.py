# Generated by Django 5.0.2 on 2024-05-22 17:07

from django.db import migrations


class Migration(migrations.Migration):

    dependencies = [
        ('tournament', '0002_tourmanent_winner'),
    ]

    operations = [
        migrations.RenameField(
            model_name='tourmanent',
            old_name='finnished',
            new_name='finished',
        ),
    ]
