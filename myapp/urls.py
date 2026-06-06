from django.urls import path
from . import views

urlpatterns = [
    path('', views.home, name='home'),
    path('about/', views.about, name='about'),
    path('members/', views.members_page, name='members'),
    path('join/', views.join_page, name='join'),
    path('contact/', views.contact, name='contact'),

    path('api/announcement/', views.api_announcement, name='api_announcement'),
    path('api/members/', views.api_members, name='api_members'),
    path('api/members/<int:pk>/', views.api_member_detail, name='api_member_detail'),
    path('api/gallery/', views.api_gallery, name='api_gallery'),
    path('api/gallery/<int:pk>/', views.api_gallery_detail, name='api_gallery_detail'),
    path('api/feedback/', views.submit_feedback, name='submit_feedback'),
    path('api/register/', views.submit_registration, name='submit_registration'),

     path('donations/', views.donation_dashboard, name='donation_dashboard'),
    path('api/donations/', views.donation_api, name='donation_api'),
]
