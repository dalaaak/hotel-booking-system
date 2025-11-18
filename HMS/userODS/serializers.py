from rest_framework import serializers
from django.contrib.auth.models import User
from hotel.models import Hotel, OfferManage
from userODS.models import Profile, User


class UserProfileSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'full_name', 'email', 'phone', 'gender', 'user_type']
        read_only_fields = ['email', 'phone', 'gender', 'user_type']



class UserRegisterSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['full_name', 'username', 'email', 'phone', 'password','gender']
    
    def create(self, validated_data):
        validated_data['user_type'] = 'customer'  # تعيين user_type بشكل تلقائي
        return User.objects.create_user(**validated_data)




class LoginSerializer(serializers.Serializer):
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)

class HotelSerializer(serializers.ModelSerializer):
    class Meta:
        model = Hotel
        fields = ['hid', 'name','slug', 'description', 'address', 'mobile', 'email', 'image', 'stars','featured', 'revenue', 'bookingcount','occupancy_rate','calculate_revenue']
        
        
         


class AddHotelSerializer(serializers.ModelSerializer):
    manager_email = serializers.EmailField()
    manager_username = serializers.CharField()
    image = serializers.ImageField(required=False)

    class Meta:
        model = Hotel
        fields = ['name', 'description', 'address', 'mobile', 'email', 'status', 'image', 'manager_email', 'manager_username']




class  OfferManagerSerializer(serializers.ModelSerializer):
    start_date = serializers.SerializerMethodField()
    end_date = serializers.SerializerMethodField()

    class Meta:
        model =  OfferManage
        fields = '__all__'

    def get_start_date(self, obj):
        return obj.start_date.date() if obj.start_date else None

    def get_end_date(self, obj):
        return obj.end_date.date() if obj.end_date else None
