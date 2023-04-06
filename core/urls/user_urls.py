from django.urls import path
from core.views import user_views as views

urlpatterns = [
    path('login/', views.MyTokenObtainPairView.as_view(), name='login'),
    path('register/', views.registerUser, name='register'),
    path('profile/', views.getUserProfile, name='users-profile'),
    path('profile/update/', views.updateUserProfile, name='users-profile-update'),
    path('cart/', views.cart, name='cart'),
    path('cart/add/', views.addCartItem, name='add-item'),
    path('cart/cartitems/<int:id>', views.cartItem, name='cart-items'),
    path('', views.getUsers, name="users")
    
]