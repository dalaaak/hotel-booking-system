from rest_framework import serializers
from .models import Hotel, Room, HotelGallery
from .models import Booking, User, Review

class RReviewSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username', read_only=True)
    hotel_name = serializers.CharField(source='hotel.name', read_only=True)

    class Meta:
        model = Review
        fields = ['id', 'user', 'hotel', 'comment', 'rating', 'created_at', 'hotel_name']
        read_only_fields = ['user', 'created_at', 'hotel_name']



class ReviewSerializer(serializers.ModelSerializer):
    user = serializers.CharField(source='user.username') 
    hotel_name = serializers.CharField(source='hotel.name') 
    class Meta:
        model = Review
        fields = ['id', 'user', 'hotel', 'comment', 'rating', 'created_at', 'hotel_name']



class BookingSerializer(serializers.ModelSerializer):
    hotel_name = serializers.CharField(source='hotel.name') 
    room_numbers = serializers.SerializerMethodField() 
    check_in_date = serializers.DateTimeField(format="%Y-%m-%d")  
    check_out_date = serializers.DateTimeField(format="%Y-%m-%d")
    room_types = serializers.SerializerMethodField()
    room_price = serializers.SerializerMethodField() 

    class Meta:
        model = Booking
        fields = '__all__'

    def get_room_price(self, obj):
        return [room.p for room in obj.room.all()]

    def get_room_numbers(self, obj):
        return [room.room_number for room in obj.room.all()]

    def get_room_types(self, obj):
        return [room.room_type for room in obj.room.all()]




class RoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room
        fields = ["rid","room_number", "is_available","room_status", "room_type", "image", "p", "n", "room_c", "description"]



class HotelGallerySerializer(serializers.ModelSerializer):
    class Meta:
        model = HotelGallery
        fields = ['image', 'hgid']

class HotelSerializer(serializers.ModelSerializer):
    manager = serializers.StringRelatedField(source='user')
    manager_email = serializers.EmailField(source='user.email')
    gallery = HotelGallerySerializer(many=True, source='hotel_gallery')
    rooms = RoomSerializer(many=True, source='room_set')  # لعرض قائمة الغرف المرتبطة بالفندق

    class Meta:
        model = Hotel
        fields = ['hid','name', 'description', 'slug', 'address', 'mobile', 'email', 'image', 'manager', 'manager_email', 'gallery','rooms']

 

class AddRoomSerializer(serializers.ModelSerializer):
    class Meta:
        model = Room 
        fields = ["room_number", "room_status", "room_type", "image", "p", "n", "room_c", "description"]
        extra_kwargs = {
            'image': {'required': False},  # يسمح بترك الصورة فارغة
            'p': {'required': True},  # السعر مطلوب
        }

def create(self, validated_data):
    request = self.context.get('request')
    if request and hasattr(request, 'user') and request.user.is_authenticated:
        try:
            hotel = request.user.hotel  
            validated_data['hotel'] = hotel
        except AttributeError:
            raise serializers.ValidationError({"error": "User does not have an associated hotel."})
    else:
        raise serializers.ValidationError({"error": "Authentication required."})
    
    return super().create(validated_data)


