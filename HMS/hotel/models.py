from django.db import models
from django.utils.text import slugify
from django.utils.html import mark_safe
from userODS.models import User 
from shortuuid.django_fields import ShortUUIDField
import shortuuid
from taggit.managers import TaggableManager
from datetime import datetime
from django.core.validators import MinValueValidator, MaxValueValidator
from django.db.models import Sum, F

HOTEL_STATUS = (
    ("Draft", "Draft"),
    ("Disabled", "Disabled"),
    ("Rejected", "Rejected"),
    ("In Review", "In Review"),
    ("Live", "Live"),
)

ROOM_STATUS = (
    ("clean", "Clean"),
    ("maintenance", "Maintenance"),
    ("failure", "Failure"),
    ("reserved", "Reserved"),
    ("available", "Available"),
)
class Hotel(models.Model):
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    description = models.TextField(null=True, blank=True)
    image = models.FileField(upload_to="hotel_gallery", null=True, blank=True)
    address = models.CharField(max_length=200)
    mobile = models.CharField(max_length=200)
    email = models.EmailField(max_length=100)
    status = models.CharField(max_length= 50, choices=HOTEL_STATUS, default="Live")
    revenue = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    bookingcount = models.IntegerField(default=0)

    tags = TaggableManager(blank=True)
    view = models.IntegerField(default=0)
    featured = models.BooleanField(default=False)
    hid = ShortUUIDField(unique=True, length=10, max_length=20, alphabet="abcdefghijklmnopqrstuvwxyz123")
    slug = models.SlugField(unique=True, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)
    stars = models.FloatField(default=0.0, validators=[MinValueValidator(1.0), MaxValueValidator(5.0)])


    def __str__(self):
        return self.name

    def save(self, *args, **kwargs):
        if self.slug == "" or self.slug == None:
            uuid_key = shortuuid.uuid()
            uniqueid = uuid_key[:4]
            self.slug = slugify(self.name) + '-' + str(uniqueid.lower())

        super(Hotel, self).save(*args, **kwargs)

    def thumbnail(self):
        return mark_safe("<img src='%s' width='50' height='50' style='object-fit: cover; border-radius: 6px;' />" %(self.image.url))

    def hotel_gallery(self):
        return HotelGallery.objects.filter(hotel=self)

    def hotel_room_types(self):
        return RoomType.objects.filter(hotel=self)

    def occupancy_rate(self):
        total_rooms = self.room_set.count()  # عدد كل الغرف المتوفرة بالفندق
        occupied_rooms = self.room_set.filter(room_status="reserved").count()  # عدد الغرف المشغولة

        if total_rooms == 0:
            return 0  # إذا لم يكن هناك غرف، فالنسبة 0%

        return round((occupied_rooms / total_rooms) * 100, 2) 
    
    def calculate_revenue(self):
        total_revenue = self.room_set.filter(room_status="reserved").aggregate(
            total_revenue=Sum(F('p')*F('n'))
        )['total_revenue'] or 0

        self.revenue = total_revenue
        self.save()




class HotelGallery(models.Model) : 
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE )
    image = models.FileField(upload_to="hotel_gallery")
    hgid = ShortUUIDField(unique=True, length=10, max_length=20, alphabet="abcdefghijklmnopqrstuvwxyz123")

    def __str__(self):
        return str(self.hotel.name)

    class Meta: 
        verbose_name_plural = "Hotel Gallery"


class HotelFeatures(models.Model) : 
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    icon = models.CharField(max_length=100, null=True, blank=True)
    name = models.CharField(max_length=100, null=True, blank=True)
    
    def __str__(self):
        return str(self.name)

    class Meta: 
        verbose_name_plural = "HotelFeatures"




class HotelFaqs(models.Model) :
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    question = models.CharField(max_length=100)
    answer = models.CharField(max_length=100, null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return str(self.question)

    class Meta: 
        verbose_name_plural = "HotelFaqs"


class Review(models.Model):
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE, related_name='reviews')
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    comment = models.TextField()
    rating = models.IntegerField(choices=[(i, str(i)) for i in range(1, 6)])
    created_at = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return f"{self.user.username} . {self.rating}"

class RoomType(models.Model) :
    typee = models.CharField(max_length=10, default="VIP")




class Room(models.Model) :
    hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
    room_number = models.CharField(max_length=1000)
    is_available = models.BooleanField(default=True)
    room_status = models.CharField(max_length=50, choices=ROOM_STATUS, default="available")
    room_type = models.CharField(max_length=1000, null=True, blank=True)
    rid = ShortUUIDField(unique=True, length=10, max_length=20, alphabet="abcdefghijklmnopqrstuvwxyz123")
    image = models.FileField(upload_to="room_gallery", null=True, blank=True)
    p = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    n = models.PositiveIntegerField(default=0)
    room_c = models.PositiveIntegerField(default=0)
    date = models.DateTimeField(auto_now_add=True)
    view = models.CharField(max_length=100, null=True, blank=True) 
    description = models.TextField(null=True, blank=True)
    

    def __str__(self):
        return f"{self.hotel.name}"

    class Meta: 
        verbose_name_plural = "Room"

    def price(self):
        return self.price


    def thumbnail(self):
        if self.image:
            return mark_safe(f"<img src='{self.image.url}' width='50' height='50' style='object-fit: cover; border-radius: 6px;' />")
        return "No Image"
    
    thumbnail.short_description = "Room Image"

    
    def number_of_beds(self):
        return self.number_of_beds

class Service(models.Model):
    room = models.ForeignKey(Room, on_delete=models.CASCADE)
    name = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    description = models.TextField(null=True, blank=True)

    def __str__(self):
        return f"{self.name} . {self.room}"

    class Meta: 
        verbose_name_plural = "Service"

class Booking(models.Model) :
        user = models.ForeignKey(User, on_delete=models.CASCADE)
        full_name = models.CharField(max_length=1000)
        email = models.EmailField(max_length=1000)
        phone = models.CharField(max_length=1000)
        

        hotel = models.ForeignKey(Hotel, on_delete=models.CASCADE)
        room = models.ManyToManyField(Room)
        before_discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
        total = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
        saved = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)

        check_in_date = models.DateTimeField(default=datetime.now)
        check_out_date = models.DateTimeField(default=datetime.now)

        total_days = models.PositiveIntegerField(default=0)
        num_adults = models.PositiveIntegerField(default=1)
        num_children = models.PositiveIntegerField(default=1)

        check_in = models.BooleanField(default=False)
        check_out = models.BooleanField(default=False)

        is_active = models.BooleanField(default=False)

        check_in_tracker = models.BooleanField(default=False)
        check_out_tracker = models.BooleanField(default=False)

        booking_id = ShortUUIDField(unique=True, length=10, max_length=20, alphabet="abcdefghijklmnopqrstuvwxyz123")
        success_id = models.CharField(max_length=1000, null=True, blank=True)
        strip_payment_intent = models.CharField(max_length=1000, null=True, blank=True)
        date = models.DateTimeField(auto_now_add=True)

        def __str__(self):
            return f"{self.booking_id}"
           

        def room_count(self):
            return self.room.all().count()

        def save(self, *args, **kwargs):
            super(Booking, self).save(*args, **kwargs)
            self.hotel.bookingcount += 1
            self.hotel.save()

class Activitylog(models.Model) :
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    guess_out = models.DateTimeField()
    guess_in = models.DateTimeField()
    description = models.TextField(null=True, blank=True)
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
            return f"{self.booking}"


class StaffOnDuty(models.Model) : 
    booking = models.ForeignKey(Booking, on_delete=models.CASCADE)
    staff_id = ShortUUIDField(unique=True, length=10, max_length=20, alphabet="abcdefghijklmnopqrstuvwxyz123")
    date = models.DateTimeField(auto_now_add=True)

    def __str__(self):
            return f"{self.staff_id}"



    # Create your models here.



class OfferManage(models.Model):
    OFFER_TYPES = [
        ('Black Friday', 'Black Friday'),
        ('White Friday', 'White Friday'),
        ('Summer Start Offers', 'Summer Start Offers'),
        ('First-time', 'First-time'),
    ]

    name = models.CharField(max_length=255)
    offer_type = models.CharField(max_length=100, choices=OFFER_TYPES, default='Black Friday')
    discount = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    start_date = models.DateTimeField(default=datetime.now)
    end_date = models.DateTimeField(default=datetime.now)
    conditions = models.TextField()

    def __str__(self):
        return f"{self.name} ({self.offer_type})"

