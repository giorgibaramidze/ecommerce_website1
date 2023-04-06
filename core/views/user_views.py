from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from core.serializers import UserSerializer, UserSerializerWithToken, CartSerializer, CartItemSerializer, AddCartItemSerializer, UpdateCartItemSerializer
from django.contrib.auth.models import User


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status
from core.models import Cart, CartItems

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def cart(request):
    if request.method == 'GET':
        try:
            cart = Cart.objects.get(customer=request.user)
            serializer = CartSerializer(cart, many=False)
            return Response(serializer.data, status=200)
        except Cart.DoesNotExist:
            cart = Cart.objects.create(customer=request.user)
            cart.save()
            serializer = CartSerializer(cart, many=False)
            return Response(serializer.data, status=200)


@api_view(['POST', 'PUT'])
@permission_classes([IsAuthenticated])
def addCartItem(request):
    if request.method =='POST':
        data = request.data
        serializer = AddCartItemSerializer(data=data)
        if serializer.is_valid(raise_exception=True):
            serializer.save()
            return Response(serializer.data)
        return Response({'message':'arvarga'})

@api_view(['DELETE'])
@permission_classes([IsAuthenticated])
def cartItem(request, id):
    if request.method == 'DELETE':
        try:
            obj = CartItems.objects.get(id=id)
            obj.delete()
            return Response({'message':'delete'}, status=200)
        except CartItems.DoesNotExist:
            return Response({'message':'something wrong'}, status=400)
        



class MyTokenObtainPairSerializer(TokenObtainPairSerializer):
    def validate(self, attrs):
        data = super().validate(attrs)
        serializer = UserSerializerWithToken(self.user).data
        for k, v in serializer.items():
            data[k] = v
        return data


class MyTokenObtainPairView(TokenObtainPairView):
    serializer_class = MyTokenObtainPairSerializer


@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getUserProfile(request):
    user = request.user
    serializer = UserSerializer(user, many=True)
    return Response(serializer.data)





@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateUserProfile(request):
    user = request.user
    serializer = UserSerializerWithToken(user, many=False)
    data = request.data
    user.first_name = data['name']
    user.username = data['email']
    user.email = data['email']

    if data['password'] != '':
        user.password = make_password(data['password'])

    user.save()

    return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAdminUser])
def getUsers(request):
    users = User.objects.all()
    serializer = UserSerializer(users, many=True)
    return Response(serializer.data)

@api_view(['POST'])
def registerUser(request):
    data = request.data
    try:
        user = User.objects.create(
            first_name=data['name'],
            username=data['email'],
            email=data['email'],
            password=make_password(data['password'])
        )

        serializer = UserSerializerWithToken(user, many=False)
        return Response(serializer.data)
    except:
        message = {'detail': 'User with this email already exists'}
        return Response(message, status=status.HTTP_400_BAD_REQUEST)