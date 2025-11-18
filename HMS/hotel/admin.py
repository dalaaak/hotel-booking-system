from django.contrib import admin
from hotel.models import Hotel, Booking, HotelGallery,  Activitylog, StaffOnDuty, Room, RoomType, Review, Service,OfferManage

class HotelGalleryInLine(admin.TabularInline):
    model = HotelGallery

class HotelAdmin(admin.ModelAdmin) :
    inlines = [HotelGalleryInLine]
    list_display = ['thumbnail', 'name', 'user', 'status']
    perpopulated_fields = {"slug": ("name", )}


class RoomAdmin(admin.ModelAdmin):
    list_display = ("room_number", "hotel", "is_available", "thumbnail")

admin.site.register(Room, RoomAdmin)
admin.site.register(Hotel, HotelAdmin)
admin.site.register(Booking)
admin.site.register(Activitylog)
admin.site.register(StaffOnDuty)
#admin.site.register(Room)
admin.site.register(RoomType)
admin.site.register(Review)
admin.site.register(Service)
admin.site.register(OfferManage)

# Register your models here. 
