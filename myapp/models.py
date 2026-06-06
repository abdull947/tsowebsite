from django.db import models


class Announcement(models.Model):
    title = models.CharField(max_length=200)
    message = models.TextField()
    is_active = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

    class Meta:
        ordering = ['-created_at']
        verbose_name = 'Announcement'


class Director(models.Model):
    name = models.CharField(max_length=100)
    message = models.TextField()
    photo = models.ImageField(upload_to='director/', blank=True, null=True)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name = 'Director'


class GalleryImage(models.Model):
    image = models.ImageField(upload_to='gallery/')
    caption = models.CharField(max_length=200, blank=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return self.caption or f'Image {self.id}'

    class Meta:
        ordering = ['order']


class Alumni(models.Model):
    name = models.CharField(max_length=100)
    designation = models.CharField(max_length=200)
    photo = models.ImageField(upload_to='alumni/', blank=True, null=True)
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.name} — {self.designation}'

    class Meta:
        ordering = ['order']
        verbose_name_plural = 'Alumni'


class Member(models.Model):
    MEMBER_TYPE_CHOICES = [
        ('TSO', 'TSO Member'),
        ('CABINET', 'Cabinet Member'),
        ('DONATOR', 'Donator'),
    ]

    name = models.CharField(max_length=100)
    role = models.CharField(max_length=150)
    member_type = models.CharField(max_length=10, choices=MEMBER_TYPE_CHOICES, default='TSO')
    photo = models.ImageField(upload_to='members/', blank=True, null=True)
    education = models.CharField(max_length=300, blank=True, null=True, help_text='Required for TSO & Cabinet members')
    job_designation = models.CharField(max_length=200, blank=True, null=True, help_text='Required for Donators')
    order = models.PositiveIntegerField(default=0)
    is_active = models.BooleanField(default=True)

    def __str__(self):
        return f'{self.name} — {self.role} ({self.get_member_type_display()})'

    class Meta:
        ordering = ['order']


class Feedback(models.Model):
    name = models.CharField(max_length=100)
    message = models.TextField()
    rating = models.PositiveSmallIntegerField(default=5)
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.name} ({self.rating}★)'

    class Meta:
        ordering = ['-created_at']


class Registration(models.Model):
    REG_TYPE_CHOICES = [
        ('TSO', 'TSO Member'),
        ('CABINET', 'Cabinet Member'),
        ('DONATOR', 'Donator'),
    ]

    full_name = models.CharField(max_length=100)
    father_name = models.CharField(max_length=100)
    email = models.EmailField()
    phone = models.CharField(max_length=20)
    area = models.CharField(max_length=100)
    reg_type = models.CharField(max_length=10, choices=REG_TYPE_CHOICES, default='TSO')
    institution = models.CharField(max_length=200, blank=True, null=True)
    program = models.CharField(max_length=200, blank=True, null=True)
    education = models.CharField(max_length=300, blank=True, null=True)
    job_designation = models.CharField(max_length=200, blank=True, null=True)
    registered_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f'{self.full_name} — {self.get_reg_type_display()}'

    class Meta:
        ordering = ['-registered_at']
