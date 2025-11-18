from django.shortcuts import render, get_object_or_404, redirect
from django.contrib.auth import authenticate, login
from django.contrib import messages
from .models import User, Profile, HotelManager
from django.contrib.auth.views import LoginView
from django.shortcuts import render, redirect
from django.contrib.auth.decorators import login_required
from hotel.models import Room, Hotel, OfferManage
from django.core.mail import send_mail
from django.contrib.auth.decorators import login_required
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework import status
from django.core.files.storage import default_storage
from .serializers import AddHotelSerializer, HotelSerializer
from rest_framework.decorators import permission_classes
from rest_framework.permissions import IsAuthenticated
from .serializers import LoginSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from django.db import transaction
from .serializers import OfferManagerSerializer
from .serializers import UserRegisterSerializer
from django.contrib.auth import update_session_auth_hash
from .serializers import UserProfileSerializer
from rest_framework_simplejwt.tokens import RefreshToken
from rest_framework.decorators import parser_classes
from rest_framework.parsers import MultiPartParser, FormParser


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def logout_view(request):
    try:
        refresh_token = request.data.get("refresh")
        if not refresh_token:
            return Response({"error": "Missing refresh token"}, status=400)

        token = RefreshToken(refresh_token)
        token.blacklist()
        

        return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)

    except Exception as e:
        return Response({"error": str(e)}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_profile(request):
    serializer = UserProfileSerializer(request.user)
    return Response(serializer.data)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def update_user_profile(request):
    user = request.user
    name = request.data.get('full_name')
    old_password = request.data.get('oldPassword')
    new_password = request.data.get('newPassword')

    if name:
        user.full_name = name

    if old_password and new_password:
        if not user.check_password(old_password):
            return Response({'message': 'كلمة المرور الحالية غير صحيحة'}, status=status.HTTP_400_BAD_REQUEST)
        user.set_password(new_password)
        update_session_auth_hash(request, user)  # لتجنب تسجيل الخروج

    user.save()
    serializer = UserProfileSerializer(user)
    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_user_role(request):
    return Response({"user_type": request.user.user_type})

@api_view(['POST'])
def register_user(request):

    serializer = UserRegisterSerializer(data=request.data)

    if serializer.is_valid():
        user = serializer.save()  
        return Response({'message': 'User registered successfully!', 'user_type': user.user_type}, status=201)

    print("Serializer is NOT valid!")  
    return Response({'error': serializer.errors}, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def hotel_list(request):
    hotels = Hotel.objects.all()
    serializer = HotelSerializer(hotels, many=True)
    return Response(serializer.data)

def determine_redirect_url(user_type):
    print(user_type )
    
    if user_type == 'admin':
        return "/AdminDashboard"  
    elif user_type == 'customer':
        return "/Homepageclient"
    elif user_type == 'employee':
        return "/Manager"
    else:
        return "/hotel/index"

@api_view(['POST'])
def LoginViewTempp(request):
    serializer = LoginSerializer(data=request.data)

    if serializer.is_valid():
        email = serializer.validated_data['email']
        password = serializer.validated_data['password']

        user_auth = authenticate(email=email, password=password)
        if user_auth is not None:
            login(request, user_auth)
            refresh = RefreshToken.for_user(user_auth)  
            
            
            print(f"🔹 Generated Token: {refresh.access_token}")

            return Response({
                "message": f"Welcome {user_auth.username}",
                "token": str(refresh.access_token), 
                "refresh": str(refresh),
                "redirect_url": determine_redirect_url(user_auth.user_type)
            }, status=200)
        else:
            return Response({"error": "Invalid username or password"}, status=401)
    else:
        return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_hotel(request):
    data = request.data
    hid = data.get('hid')

    if not hid:
        return Response({"error": "Hotel ID is missing"}, status=400)

    try:
        with transaction.atomic():
            hotel = Hotel.objects.get(hid=hid)
            hotel.delete()
        return Response({"message": f"✅ Hotel {hid} deleted successfully"}, status=200)
    except Hotel.DoesNotExist:
        return Response({"error": "Hotel not found"}, status=404)

@api_view(['POST'])
def add_hotel_view(request):
    serializer = AddHotelSerializer(data=request.data)

    if serializer.is_valid():
        # الحصول على بيانات المدير
        manager_email = serializer.validated_data.get('manager_email')
        manager_username = serializer.validated_data.get('manager_username')

        # التحقق مما إذا كان البريد الإلكتروني موجودًا بالفعل
        if User.objects.filter(email=manager_email).exists():
            return Response({'error': "Email already exists. Please use a different email."}, status=status.HTTP_400_BAD_REQUEST)

        # إنشاء حساب لمدير الفندق
        manager_password = User.objects.make_random_password()
        manager_user = User.objects.create_user(
            username=manager_username,
            email=manager_email,
            password=manager_password,
            user_type='employee'
        )

        
        image = request.FILES.get('image')  
    
        image_path = None
        if image:
            image_path = default_storage.save(f'hotel_gallery/{image.name}', image)

        
        hotel = Hotel.objects.create(
            user=manager_user,
            name=serializer.validated_data.get('name'),
            description=serializer.validated_data.get('description'),
            address=serializer.validated_data.get('address'),
            mobile=serializer.validated_data.get('mobile'),
            email=serializer.validated_data.get('email'),
            status=serializer.validated_data.get('status'),
            image=image_path  
        )

        HotelManager.objects.create(user=manager_user, hotel=hotel)
            
        print(f"Manager's password: {manager_password}")

        return Response({'message': 'Hotel added successfully!', 'image_url': image_path}, status=status.HTTP_201_CREATED)
    else:
        print(serializer.errors)

    return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

@api_view(['PUT'])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def update_hotel(request, hid):

    try:
        hotel = Hotel.objects.get(hid=hid)
    except Hotel.DoesNotExist:
        return Response({'error': 'Hotel not found'}, status=404)

    serializer = HotelSerializer(hotel, data=request.data, partial=True)
    if serializer.is_valid():
        serializer.save()
        return Response({'message': 'Hotel updated successfully', 'data': serializer.data})
    
    return Response(serializer.errors, status=400)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def get_offers(request):
    offers = OfferManage.objects.all()
    serializer = OfferManagerSerializer(offers, many=True)
    offer_ids = [offer.id for offer in offers]
    return Response(serializer.data)

@api_view(['POST'])
def create_offer(request):
    serializer = OfferManagerSerializer(data=request.data)
    if serializer.is_valid():
        serializer.save()
        return Response(serializer.data, status=201)
    return Response(serializer.errors, status=400)

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def delete_offer(request):
    print("Received data:", request.data)
    id = request.data.get('id')
    if not id:
        return Response({"error": "missing"}, status=400)
    try:
        with transaction.atomic():
            offer = OfferManage.objects.get(id=id)
            offer.delete()
        return Response({"message": "Offer deleted successfully"})
    except Offer.DoesNotExist:
        return Response({"error": "Hotel not found"}, status=404)


   
 #M27amHr8tq orange 
   


    

