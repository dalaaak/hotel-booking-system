from django.urls import path 
from hotel import views 
from django.urls import path, include
from .views import hotel_detailAd, add_room_view, display_rooms, delete_room, display_rooms_user
from .views import hotel_bookings_report,hotel_performance_report, get_top_bookers, hotel_bookings_managerreport
from .views import get_revenue_report, get_reviews, get_user_bookings, get_user_reviews
from .views import update_review, delete_review, create_booking, hotel_reviews, update_room

app_name = "hotel"

urlpatterns = [
    path('api/rooms/<str:rid>/', update_room),
    path('api/reviews/', hotel_reviews),
    path('api/bookings/', create_booking),
    path('api/reviews/<int:review_id>/delete/', delete_review),
    path('api/reviews/<int:review_id>/update/', update_review),
    path('api/get_user_reviews/', get_user_reviews),
    path('api/user-bookings/', get_user_bookings),
    path('api/get_reviews/', get_reviews),
    path('api/get_revenue_report', get_revenue_report),
    path('api/hotel_bookings_managerreport/', hotel_bookings_managerreport),
    path('api/top-bookers/', get_top_bookers),
    path('api/hotel_performance_report/', hotel_performance_report),
    path('api/hotel-bookings-report/', hotel_bookings_report),
    path('api/hotel/<slug>/', hotel_detailAd),
    path('api/display_rooms/', display_rooms),
    path('api/display_rooms_user/', views.display_rooms_user),
    path('api/search/', views.index),
    path("api/add-room/", add_room_view),
    path('api/delete/', delete_room),
]






