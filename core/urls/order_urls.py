from django.urls import path
from core.views import order_views as views

urlpatterns = [
    path('add/', views.addOrderItem, name='add-orders'),
    path('<int:id>/', views.getOrder, name='get-order'),
    path('<str:pk>/pay/', views.updateOrderToPaid, name='pay'),
    path('order-list/', views.orderList, name='order-list')
]