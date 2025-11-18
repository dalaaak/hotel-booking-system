from django.contrib import admin
from userODS.models import User, Profile, HotelManager, Manager

class UserAdmin(admin.ModelAdmin):
    search_fields = ['full_name' , 'username']
    list_display = ['full_name' , 'username','email' , 'phone','gender']

class ProfileAdmin(admin.ModelAdmin):
    search_fields = ['full_name']
    list_display = ['full_name' , 'user', 'verified']

admin.site.register(User, UserAdmin)
admin.site.register(Profile, ProfileAdmin)
admin.site.register(HotelManager)
admin.site.register(Manager)
# Register your models here.
