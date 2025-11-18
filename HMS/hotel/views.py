from django.db import models
from hotel.models import Hotel, Booking, Activitylog, StaffOnDuty, Room, RoomType, Review, Service
from userODS.models import HotelManager, User
from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth.decorators import login_required 
from django.urls import reverse
from rest_framework.decorators import api_view, permission_classes
from rest_framework.response import Response
from .serializers import HotelSerializer,AddRoomSerializer, RoomSerializer
from rest_framework.permissions import IsAuthenticated
from .serializers import BookingSerializer
from django.utils.timezone import make_aware
from datetime import datetime, timedelta
from django.db.models import Count, Q, F, Sum
from django.db.models import Subquery, OuterRef
from django.http import JsonResponse
from rest_framework import status
from .serializers import ReviewSerializer  
from .serializers import RReviewSerializer  
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, FormParser


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_room(request, rid):
    try:
        room = Room.objects.get(rid=rid)
    except Room.DoesNotExist:
        return Response({'error': 'Room not found'}, status=404)

    serializer = RoomSerializer(room, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Room updated successfully', 'data': serializer.data})
    
    return Response(serializer.errors, status=400)

@api_view(['GET', 'POST'])
@permission_classes([IsAuthenticated])
def hotel_reviews(request):
    if request.method == 'GET':
        hotel_id = request.query_params.get('hotel_id')
        reviews = Review.objects.filter(hotel__hid=hotel_id)
        serializer = ReviewSerializer(reviews, many=True)
        return Response(serializer.data)
    
    elif request.method == 'POST':
        hid = request.data.get('hotel')
        try:
            hotel_instance = Hotel.objects.get(hid=hid)

        except Hotel.DoesNotExist:
            return Response({'error': 'Invalid hotel HID'}, status=404)

        data = request.data.copy()
        data['hotel'] = hotel_instance.id  
        serializer = RReviewSerializer(data=data)


        if serializer.is_valid():
            serializer.save(user=request.user)
            return Response(serializer.data, status=201)
        return Response(serializer.errors, status=400)

@api_view(["POST"])
@permission_classes([IsAuthenticated])
def create_booking(request):
    data = request.data
    room_id = request.headers.get("Room-ID")
    hotels = Hotel.objects.all().values("name", "hid")
    try:
        hotel = Hotel.objects.get(hid=data["hotelId"])  
    except Hotel.DoesNotExist:
        return Response({"error": f"Invalid hotel ID: {data['hotelId']}"}, status=status.HTTP_400_BAD_REQUEST)
    if not room_id:
        return Response({"error": "Missing Room ID"}, status=status.HTTP_400_BAD_REQUEST)

    try:
        room = Room.objects.get(rid=room_id)  
    except Room.DoesNotExist:
        return Response({"error": f"Invalid Room ID: {room_id}"}, status=status.HTTP_400_BAD_REQUEST)

    user = request.user

    try:

        booking = Booking.objects.create(
            user=user,
            full_name=user.username, 
            email=user.email,  
            phone=user.phone,
            hotel=hotel,
            total=data["totalPrice"],
            check_in_date=data["checkIn"],
            check_out_date=data["checkOut"],
            total_days=data.get("nights", 1),
            num_adults=data.get("numAdults", 1),
            num_children=data.get("numChildren", 0),
            is_active=True,
        )

        booking.room.add(room)  
        booking.save()

            # Update room status
        room.is_available = False
        room.room_status = "reserved"
        room.save()

        return Response({"bookingId": booking.booking_id, "message": "Booking confirmed!"}, status=status.HTTP_201_CREATED)

    except Hotel.DoesNotExist:
        return Response({"error": "Invalid hotel ID"}, status=status.HTTP_400_BAD_REQUEST)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])  
def delete_review(request, review_id):
    try:
        review = Review.objects.get(id=review_id, user=request.user)  
        review.delete() 
        return Response({"message": "Review deleted successfully"}, status=200)
    except Review.DoesNotExist:
        return Response({"error": "Review not found or unauthorized"}, status=404)

@api_view(['PUT'])
@permission_classes([IsAuthenticated]) 
def update_review(request, review_id):
    try:
        review = Review.objects.get(id=review_id, user=request.user) 
    except Review.DoesNotExist:
        return Response({"error": "Review not found or unauthorized"}, status=404)

    serializer = ReviewSerializer(review, data=request.data, partial=True)  
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=200)

    return Response(serializer.errors, status=400)

@api_view(['GET'])
def get_user_reviews(request):
    user = request.user
    reviews = Review.objects.filter(user=user).order_by('-created_at')  
    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_bookings(request):
    user = request.user
    bookings = Booking.objects.filter(user=user)  
    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_reviews(request):
    user = request.user
    try:
        hotel = Hotel.objects.get(user=user)  
        reviews = Review.objects.filter(hotel=hotel)  
    except Hotel.DoesNotExist:
        return Response({"error": "المستخدم ليس مدير فندق أو الفندق غير موجود"}, status=404)

    serializer = ReviewSerializer(reviews, many=True)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_revenue_report(request):
    user = request.user  
    try:
        hotel = Hotel.objects.get(user=user)  
    except Hotel.DoesNotExist:
        return JsonResponse({"error": "المستخدم ليس مدير فندق أو الفندق غير موجود"}, status=404)

    period = request.GET.get("period", "month")
    today = datetime.today()
    revenue_data = []

    if period == "week":
        days_order = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday", "Sunday"]
        revenue_data_temp = []

        for i in range(7):
            day_date = today - timedelta(days=i)
            bookings = Booking.objects.filter(hotel=hotel, check_in_date__date=make_aware(day_date)).aggregate(total_revenue=Sum("total"))
            revenue_data_temp.append({"name": day_date.strftime("%A"), "revenue": bookings["total_revenue"] or 0})

        revenue_data = sorted(revenue_data_temp, key=lambda x: days_order.index(x["name"]))

    elif period == "month":
        start_of_month = today.replace(day=1)
        for i in range(4):
            start_date = start_of_month + timedelta(weeks=i)
            end_date = start_date + timedelta(days=7)
            bookings = Booking.objects.filter(hotel=hotel, check_in_date__gte=make_aware(start_date), check_out_date__lt=make_aware(end_date)).aggregate(total_revenue=Sum("total"))
            revenue_data.append({"name": f"Week {i+1}", "revenue": bookings["total_revenue"] or 0})

    elif period == "year":
        for i in range(12):
            month_date = today.replace(month=i+1, day=1)
            next_month = month_date.replace(month=(month_date.month % 12) + 1, day=1)
            bookings = Booking.objects.filter(hotel=hotel, check_in_date__gte=make_aware(month_date), check_out_date__lt=make_aware(next_month)).aggregate(total_revenue=Sum("total"))
            revenue_data.append({"name": month_date.strftime("%B"), "revenue": bookings["total_revenue"] or 0})

    else:
        return JsonResponse({"error": "فترة غير صحيحة، استخدم 'week', 'month', أو 'year'"}, status=400)

    return JsonResponse({"data": revenue_data}, safe=False)  

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hotel_bookings_managerreport(request):
    user = request.user
    try:
        hotel = Hotel.objects.get(user=user)
    except Hotel.DoesNotExist:
        return Response({"error"}, status=404)

    check_in_date_str = request.GET.get('checkInDate', None)
    check_out_date_str = request.GET.get('checkOutDate', None)

    check_in_date = None
    check_out_date = None

    try:
        if check_in_date_str and check_in_date_str.strip():
            check_in_date = make_aware(datetime.strptime(check_in_date_str, "%Y-%m-%d"))
        if check_out_date_str and check_out_date_str.strip():
            check_out_date = make_aware(datetime.strptime(check_out_date_str, "%Y-%m-%d"))
    except ValueError:
        return Response({"error": "تنسيق التاريخ غير صحيح، استخدم YYYY-MM-DD"}, status=400)

    bookings = Booking.objects.filter(hotel=hotel)
    if check_in_date or check_out_date:
        filters = Q()
        if check_in_date:
            filters &= Q(check_in_date__gte=check_in_date)  
        if check_out_date:
            filters &= Q(check_out_date__lte=check_out_date)  

        bookings = bookings.filter(filters)

    serializer = BookingSerializer(bookings, many=True)
    return Response(serializer.data)

@api_view(['GET'])
def get_top_bookers(request):
    top_bookers = Booking.objects.values('user__id', 'user__full_name').annotate(bookings_count=Count('id')).order_by('-bookings_count')

    active_users = User.objects.filter(is_active=True, user_type="customer").count()
    new_users = User.objects.filter(user_type="employee").count()

    data = {
        "topBookers": [{"user_name": booker["user__full_name"], "bookings": booker["bookings_count"]} for booker in top_bookers],
        "activeUsers": active_users,
        "newUsers": new_users
    }

    return Response(data)

@api_view(['GET'])
def hotel_performance_report(request):
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')

    if not start_date_str or not end_date_str:
        return Response({"error": "يرجى تحديد تاريخ البداية والنهاية"}, status=400)

    
    start_date = make_aware(datetime.strptime(start_date_str, "%Y-%m-%d"))
    end_date = make_aware(datetime.strptime(end_date_str, "%Y-%m-%d"))

   
    total_rooms_subquery = Room.objects.filter(hotel=OuterRef('pk')).order_by().values('hotel').annotate(
        total_rooms=Count('id')
    ).values('total_rooms')

    hotels = Hotel.objects.annotate(
        total_rooms=Subquery(total_rooms_subquery)  # ربط عدد الغرف بكل فندق
    )

    # حساب عدد مرات الحجز لكل فندق بناءً على الفترة المحددة
    booking_data = Booking.objects.filter(
        check_in_date__gte=start_date, check_out_date__lte=end_date
    ).values(
        name=F('hotel__name')
    ).annotate(
        bookingcount=Count('id'),  # عدد الحجوزات
        total_rooms=Subquery(Room.objects.filter(hotel=OuterRef('hotel')).values('hotel')
                             .annotate(total_rooms=Count('id'))
                             .values('total_rooms')),  # عدد الغرف لكل فندق
        occupancy_rate=(F('bookingcount') * 100.0) / F('total_rooms'),  # حساب نسبة الإشغال
        revenue=Sum(F('room__p') * F('total_days'))
        
    )

    return Response(booking_data)

@api_view(['GET'])
def hotel_bookings_report(request):
    start_date_str = request.query_params.get('start_date')
    end_date_str = request.query_params.get('end_date')
    city = request.query_params.get('address', None)
    sort_type = request.query_params.get('hotel_type', None)  # استرجاع نوع الترتيب

    filters = Q()

    if start_date_str and end_date_str:
        start_date = make_aware(datetime.strptime(start_date_str, "%Y-%m-%d"))
        end_date = make_aware(datetime.strptime(end_date_str, "%Y-%m-%d"))
        filters &= Q(check_in_date__gte=start_date, check_out_date__lte=end_date)

    if city:
        filters &= Q(hotel__address__icontains=city)

    bookings = list(Booking.objects.filter(filters).values(
        name=F('hotel__name'),
        stars=F('hotel__stars')
    ).annotate(
        bookingcount=Count('id'),
        revenue=Sum(F('room__p') * F('total_days'))
    ))

    # تطبيق الترتيب حسب المدخلات
    if sort_type == "highest":
        bookings = sorted(bookings, key=lambda x: x['revenue'], reverse=True)
    elif sort_type == "lowest":
        bookings = sorted(bookings, key=lambda x: x['revenue'])
    elif sort_type == "random":
        import random
        random.shuffle(bookings)

    return Response(bookings)

@api_view(['GET'])
def index(request):
    query = request.GET.get('q', '')
    if query:
        hotels = Hotel.objects.filter(status="Live").filter(address__icontains=query)
        serializer = HotelSerializer(hotels, many=True)  # تحويل الفنادق إلى JSON
        return Response({"hotels": serializer.data})  # إرسال البيانات للواجهة الأمامية
    
    print("لم يتم إدخال استعلام بحث")  
    return Response({"message": "لم يتم إدخال استعلام بحث", "hotels": []})  # إرجاع قائمة فارغة

@api_view(['GET'])
def hotel_detailAd(request, slug):
    hotel = get_object_or_404(Hotel, slug=slug)
    serializer = HotelSerializer(hotel)
    return Response(serializer.data)
    
@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_room(request):
    room_id = request.data.get("room_id")  
    if not room_id:
        return Response({"error": "Room ID is required"}, status=400)

    room = get_object_or_404(Room, rid=room_id)  
    room.delete()
    return Response({"message": "Room deleted successfully"}, status=200)

@api_view(["POST"])
@permission_classes([IsAuthenticated])  
def add_room_view(request):
    try:
        hotel_manager = HotelManager.objects.get(user=request.user)
        hotel = hotel_manager.hotel
    except HotelManager.DoesNotExist:
        return Response({"error": "User is not a hotel manager"}, status=403)

    serializer = AddRoomSerializer(data=request.data)
    if serializer.is_valid():
        room = serializer.save(hotel=hotel)  # تعيين الفندق بناءً على المدير الذي سجل الدخول
        
        # تحقق من حالة الغرفة وتحديث `is_available`
        if room.room_status == "available":
            room.is_available = True
        else:
            room.is_available = False
        
        room.save()  # حفظ التعديلات
        
        return Response({"message": "Room added successfully", "room": AddRoomSerializer(room).data}, status=201)
    
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def display_rooms(request):
    hotel = Hotel.objects.filter(user=request.user).first()
    if not hotel:
        return Response({"error": "User does not have an associated hotel."})
    rooms = Room.objects.filter(hotel=hotel).select_related('hotel')  
    
    hotel_serializer = HotelSerializer(hotel)
    room_serializer = RoomSerializer(rooms, many=True)
   

    return Response({
        'hotel': hotel_serializer.data,
        'rooms': room_serializer.data
    })

@api_view(['GET'])
@permission_classes([IsAuthenticated])  
def display_rooms_user(request):
    print("Request received!")
    hotel_id = request.query_params.get("hotel_id")  
    print(hotel_id )
    if not hotel_id:
        print("Not found")

    hotel = get_object_or_404(Hotel, slug=hotel_id)
    rooms = Room.objects.filter(hotel=hotel, is_available=True, room_status="available").select_related('hotel')
    print("Filtered Rooms:", rooms)

    hotel_serializer = HotelSerializer(hotel)
    room_serializer = RoomSerializer(rooms, many=True)

    return Response({
        'hotel': hotel_serializer.data,
        'rooms': room_serializer.data
    })






