from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from core.serializers import OrderSerializer, CartItemSerializer, AddCartItemSerializer, UpdateCartItemSerializer, OrderItemSerializer
from django.contrib.auth.models import User


from rest_framework_simplejwt.serializers import TokenObtainPairSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.contrib.auth.hashers import make_password
from rest_framework import status
from core.models import Cart, CartItems, OrderItem, Order, Review, Product, ShippingAddress
from django.shortcuts import get_object_or_404
from datetime import datetime
from django.utils import timezone


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def addOrderItem(request):
    print(request.data)
    user = request.user
    data = request.data

    orderItem = data['orderItems']
    print(orderItem)

    if orderItem and len(orderItem) == 0:
        return Response({'detail': 'No Order Item'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        order = Order.objects.create(
            user = user,
            paymentMethod = data['paymentMethod'],
            taxPrice = data['taxPrice'],
            shippingPrice = data['shippingPrice'],
            totalPrice = data['totalPrice']
        )

        shipping = ShippingAddress.objects.create(
            order = order,
            address = data['shippingAddress']['address'],
            city = data['shippingAddress']['city'],
            postalCode = data['shippingAddress']['postalCode'],
            country = data['shippingAddress']['country']
        )

        for i in orderItem:
            product = Product.objects.get(id=i['product']['id'])

            item = OrderItem.objects.create(
                product = product,
                order = order,
                name = product.name,
                qty = i['quantity'],
                price = i['product']['price'],
                image = product.image.url
            )
            product.countInStock -= item.qty
            product.save()
        Cart.objects.get(customer=request.user).delete()
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)

@api_view(['GET'])
@permission_classes([IsAuthenticated])
def orderList(request):
    user = request.user
    orders = Order.objects.filter(user=user).order_by('-id')
    serializer = OrderSerializer(orders, many=True)
    return Response(serializer.data)



@api_view(['GET'])
@permission_classes([IsAuthenticated])
def getOrder(request, id):
    user = request.user

    order = Order.objects.get(id=id)
    if user.is_staff or order.user == user:
        serializer = OrderSerializer(order, many=False)
        return Response(serializer.data)
    else:
        return Response({'message': 'Not authorized'}, status=status.HTTP_400_BAD_REQUEST)


@api_view(['PUT'])
@permission_classes([IsAuthenticated])
def updateOrderToPaid(request, pk):
    order = Order.objects.get(id=pk)
    if order.isPaid == True:
        return Response({'message':'The order has already been paid'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        order.isPaid = True
        order.paidAt = datetime.now(tz=timezone.utc)
        order.save()
        return Response({'message':'Order was paid'}, status=status.HTTP_200_OK)



