from django.urls import path
from core.views import product_views as views

urlpatterns = [
    path('', views.productView, name='products'),
    path('<str:pk>/',views.ProductRetrieve.as_view(), name='product'), 
    path('<str:pk>/reviews/',views.createProductReview, name='create-review'), 
]