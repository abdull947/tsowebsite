from django.contrib import admin
from .models import Announcement, Director, GalleryImage, Alumni, Member, Feedback, Registration


@admin.register(Announcement)
class AnnouncementAdmin(admin.ModelAdmin):
    list_display = ['title', 'is_active', 'created_at']
    list_editable = ['is_active']


@admin.register(Director)
class DirectorAdmin(admin.ModelAdmin):
    list_display = ['name']


@admin.register(GalleryImage)
class GalleryImageAdmin(admin.ModelAdmin):
    list_display = ['caption', 'order', 'is_active']
    list_editable = ['order', 'is_active']


@admin.register(Alumni)
class AlumniAdmin(admin.ModelAdmin):
    list_display = ['name', 'designation', 'order', 'is_active']
    list_editable = ['order', 'is_active']


@admin.register(Member)
class MemberAdmin(admin.ModelAdmin):
    list_display = ['name', 'role', 'member_type', 'order', 'is_active']
    list_editable = ['order', 'is_active']
    list_filter = ['member_type']


@admin.register(Feedback)
class FeedbackAdmin(admin.ModelAdmin):
    list_display = ['name', 'rating', 'created_at']
    readonly_fields = ['name', 'message', 'rating', 'created_at']


@admin.register(Registration)
class RegistrationAdmin(admin.ModelAdmin):
    list_display = ['full_name', 'reg_type', 'email', 'phone', 'registered_at']
    list_filter = ['reg_type']
    readonly_fields = ['full_name', 'father_name', 'email', 'phone', 'area', 'reg_type',
                       'institution', 'program', 'education', 'job_designation', 'registered_at']
