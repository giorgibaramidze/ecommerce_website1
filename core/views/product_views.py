from django.shortcuts import render
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAdminUser, IsAuthenticated
from rest_framework.response import Response
from core.models import Product, Review
from core.serializers import ProductSerializer, ReviewSerializer
from rest_framework import status
from rest_framework import generics
from django_filters.rest_framework import DjangoFilterBackend
from rest_framework import filters


class ProductRetrieve(generics.RetrieveAPIView):
    queryset = Product.objects.all()
    serializer_class = ProductSerializer

@api_view(['GET'])
def productView(request):
        home = request.query_params.get('home')
        search = request.query_params.get('search')
        if home:
            rating = ProductSerializer(Product.objects.order_by('-rating')[:10],  many=True)
            main = ProductSerializer(Product.objects.order_by('-id')[:3], many=True)
            return Response({
                    'newProduct' : main.data,
                    'rating': rating.data
                    })        
        elif search:
            search_result = Product.objects.filter(name__icontains=search).order_by('-id')[:10]
            result = ProductSerializer(search_result, many=True)
            return Response(result.data)
        return Response(ProductSerializer(Product.objects.all().order_by('-id'), many=True).data)
    


@api_view(['POST'])
@permission_classes([IsAuthenticated])
def createProductReview(request, pk):
    user = request.user
    product = Product.objects.get(id=pk)
    data = request.data

    isExists = product.review_set.filter(user=user).exists()
    if isExists:
        return Response({'message': 'Product already reviewed'}, status=status.HTTP_400_BAD_REQUEST)
    elif data['rating'] == 0:
        return Response({'message': 'Please select rating'}, status=status.HTTP_400_BAD_REQUEST)
    else:
        review = Review.objects.create(
            user = user,
            product = product,
            name = user.first_name,
            rating = data['rating'],
            comment = data['comment']
        )

        reviews = product.review_set.all()
        product.numReviews = len(reviews)

        total = 0
        for i in reviews:
            total += i.rating
        
        product.rating = total / len(reviews)
        product.save()
        serializer = ReviewSerializer(reviews, many=True)

        return Response(serializer.data)
