from django.db import models
from django.contrib.auth.models import AbstractUser
from django.db.models.signals import post_save
from shortuuid.django_fields import ShortUUIDField
from django.contrib.auth.models import User
from taggit.managers import TaggableManager
from django.utils.text import slugify
from django.dispatch import receiver

#Kyoto@yahoo.com   RWEERfedLx
#Madison @gmail.com  gPZACRGAGH
#william@gmail.com  pnZQwhtcth
#testt@yahoo.com Vrf3fA8Hr3
#orange_juice@yahoo.com M27amHr8tq 
#noura@yahoo.com4551
#1234567890

# Create your models here.
GENDER = (
    ("Female","Female"),
    ("Male","Male"),
)
IDENTITY_TYPE = (
    ("National Identication Number","National Identication Number"),
    ("International Passport","International Passport"),
    ("Driver's License","Driver's License"),
)
def user_directory_path(instance, filename):
    ext = filename.split(".")[-1]
    filename = "%s.%s" % (instance.user.id, filename)
    return "user_{0}/{1}".format(instance.user.id, filename)
class User(AbstractUser):
    USER_TYPES = ( 
        ('admin', 'Admin'), 
        ('customer', 'Customer'), 
        ('employee', 'Employee'), 
        )
    full_name = models.CharField(max_length=200, null=True, blank=True)
    username = models.CharField(max_length=200, unique=True) 
    email = models.EmailField(unique=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER)
    otp = models.CharField(max_length=20, null=True, blank=True)
    user_type = models.CharField(max_length=10, choices=USER_TYPES, null=True, blank=True)
    access_code = models.CharField(max_length=20, null=True, blank=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username']

    def __str__(self):
        return f"{self.username} ({self.user_type})"


class Profile(models.Model):
    pid = ShortUUIDField(length=7, max_length=25, alphabet="abcdefghijklmnopqrstuvwxyz123") 
    image = models.FileField(upload_to=user_directory_path, null=True, blank=True)
    user = models.OneToOneField(User, on_delete=models.CASCADE)
    full_name = models.CharField(max_length=200, null=True, blank=True)
    phone = models.CharField(max_length=50, null=True, blank=True)
    gender = models.CharField(max_length=20, choices=GENDER)

    country = models.CharField(max_length=50, null=True, blank=True)
    city = models.CharField(max_length=50, null=True, blank=True)
    state = models.CharField(max_length=50, null=True, blank=True)
    address = models.CharField(max_length=50, null=True, blank=True)

    identity_type = models.CharField(max_length=40, choices=IDENTITY_TYPE, null=True, blank=True)
    identity_image = models.FileField(upload_to=user_directory_path, null=True, blank=True)

    facebook = models.URLField(null=True, blank=True)
    twitter = models.URLField(null=True, blank=True)

    wallet = models.DecimalField(max_digits=12, decimal_places=2, default=0.00)
    verified = models.BooleanField(default=False)

    date = models.DateTimeField(auto_now_add=True)
    
    class Meta:
        ordering = ['date']
    def __str__(self):
        if self.full_name:
            return f"{self.full_name}"
        else:
            return f"{self.user.username}"

class HotelManager(Profile):
    def get_hotel(self):
        from hotel.models import Hotel
        return Hotel.objects.get(manager=self)
    hotel = models.OneToOneField('hotel.Hotel', on_delete=models.CASCADE, null=True, blank=True)

class Manager(Profile):
    phonee = models.CharField(max_length=50)




@receiver(post_save, sender=User)
def create_user_profile(sender, instance, created, **kwargs):
    if created:
        if instance.user_type != 'employee':  
            Profile.objects.create(
                user=instance,
                full_name=instance.full_name,
                phone=instance.phone,
                gender=instance.gender
            )
            print(f"✅ Profile created for {instance.username}")

@receiver(post_save, sender=User)
def save_user_profile(sender, instance, **kwargs):
    if getattr(instance, 'profile', None):  
        instance.profile.save()
        print(f"✅ Profile updated for {instance.username}")





      

