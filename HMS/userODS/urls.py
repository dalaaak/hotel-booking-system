from django.urls import path 
from userODS import views 
from django.urls import path, include
from .views import LoginViewTempp, hotel_list, delete_hotel, add_hotel_view
from .views import get_offers, create_offer, delete_offer
from .views import register_user, get_user_role, logout_view
from .views import get_user_profile, update_user_profile, update_hotel

app_name = "userODS"

urlpatterns = [
    path('api/users/profile', get_user_profile),
    path('api/users/update-profile', update_user_profile),
    path('api/logout/', logout_view),
    path('api/user-role/', get_user_role),
    path('register/', register_user),
    path('api/login/', LoginViewTempp),
    path('api/hotels/', hotel_list), 
    path('api/addhotel/', add_hotel_view),
    path('api/hotels/update/<str:hid>/', update_hotel),
    path('api/delete/', delete_hotel),
    path('api/create_offer/', create_offer),
    path('api/delete_offer/', delete_offer),
    path('api/get_offers/', get_offers),
]





