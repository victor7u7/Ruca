# Generated by Django 4.1.1 on 2023-07-19 04:31

from django.db import migrations, models


class Migration(migrations.Migration):

    dependencies = [
        ('api', '0002_alter_musicians_phone'),
    ]

    operations = [
        migrations.CreateModel(
            name='MyForm',
            fields=[
                ('id', models.BigAutoField(auto_created=True, primary_key=True, serialize=False, verbose_name='ID')),
                ('name', models.CharField(max_length=100, verbose_name='name')),
                ('movie', models.CharField(max_length=100, verbose_name='movie')),
                ('character', models.CharField(max_length=100, verbose_name='character')),
                ('song_link', models.CharField(max_length=100, verbose_name='song link')),
            ],
        ),
        migrations.DeleteModel(
            name='Musicians',
        ),
    ]
