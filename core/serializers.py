from rest_framework import serializers
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Product, Cart, CartItems, Order, OrderItem, ShippingAddress, Review


class UserSerializer(serializers.ModelSerializer):
    name = serializers.SerializerMethodField(read_only=True)
    isAdmin = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin']

    def get_isAdmin(self, obj):
        return obj.is_staff

    def get_name(self, obj):
        name = obj.first_name
        if name == '':
            name = obj.email

        return name


class ReviewSerializer(serializers.ModelSerializer):
    class Meta:
        model = Review
        fields = '__all__'

class ProductSerializer(serializers.ModelSerializer):
    reviews = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = Product
        fields = '__all__'

    def get_reviews(self, obj):
        reviews = obj.review_set.all()
        serializer = ReviewSerializer(reviews, many=True)
        return serializer.data


class UserSerializerWithToken(UserSerializer):
    token = serializers.SerializerMethodField(read_only=True)

    class Meta:
        model = User
        fields = ['id', 'username', 'email', 'name', 'isAdmin', 'token']

    def get_token(self, obj):
        token = RefreshToken.for_user(obj)
        return str(token.access_token)

class CartItemSerializer(serializers.ModelSerializer):
    product = ProductSerializer(many=False)
    sub_total = serializers.SerializerMethodField(method_name='item_quantity')
    class Meta:
        model = CartItems
        fields = ['id', 'cart', 'quantity', 'product', 'sub_total']

    def item_quantity(self, cartitem:CartItems):
        return cartitem.quantity * cartitem.product.price


class UpdateCartItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = CartItems
        fields = ['cart', 'quantity', 'product']

class CartSerializer(serializers.ModelSerializer):
    customer = serializers.StringRelatedField(many=False)
    items = CartItemSerializer(many=True)
    total = serializers.SerializerMethodField()

    class Meta:
        model = Cart
        fields = ['id', 'customer', 'items', 'total']
    
    def get_total(self, cart:Cart):
        items = cart.items.all()
        return sum([item.quantity * item.product.price for item in items])



class AddCartItemSerializer(serializers.ModelSerializer):
    product_id = serializers.IntegerField()
    cart_id = serializers.IntegerField()

    def validate_product_id(self, value):
        if not Product.objects.filter(pk=value).exists():
            raise serializers.ValidationError('Incorrect id')
        return value

        
    def create(self, validated_data):
        try:
            cartitems = CartItems.objects.get(cart_id=validated_data['cart_id'], product_id=validated_data['product_id'])
            cartitems.quantity = validated_data['quantity']
            cartitems.save()
        except:
            cartitems = CartItems.objects.create(**validated_data)
        return cartitems


    class Meta:
        model = CartItems
        fields = ['cart_id', 'product_id', 'quantity']



class ShippingAddressSerializer(serializers.ModelSerializer):
    class Meta:
        model = ShippingAddress
        fields = '__all__'


class OrderItemSerializer(serializers.ModelSerializer):
    class Meta:
        model = OrderItem
        fields = '__all__'


class OrderSerializer(serializers.ModelSerializer):
    order_items = serializers.SerializerMethodField(read_only=True)
    user = serializers.SerializerMethodField(read_only=True)
    shipping_address = serializers.SerializerMethodField(read_only=True)
    class Meta:
        model = Order
        fields = '__all__'
    
    def get_order_items(self, obj):
        items = obj.orderitem_set.all()
        serializer = OrderItemSerializer(items, many=True)
        return serializer.data

    def get_user(self, obj):
        
        user = obj.user
        serializer = UserSerializer(user, many=False)
        return serializer.data
    
    def get_shipping_address(self, obj):
        try:
            serializer = ShippingAddressSerializer(obj.shippingaddress, many=False).data
        except:
            serializer = False
        return serializer
