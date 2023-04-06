from django.contrib import admin
from .models import Product, Order, OrderItem, Review, ShippingAddress, Cart, CartItems

admin.site.register(Product)
admin.site.register(Cart)
admin.site.register(Review)
admin.site.register(Order)
admin.site.register(OrderItem)
admin.site.register(ShippingAddress)
admin.site.register(CartItems)