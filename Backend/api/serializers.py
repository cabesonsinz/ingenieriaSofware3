from rest_framework import serializers
from .models import User, Event, Reservation

class UserSerializer(serializers.ModelSerializer):
    class Meta:
        model = User
        fields = ['id', 'email', 'name', 'role', 'createdAt', 'password']
        extra_kwargs = {'password': {'write_only': True}}

    def create(self, validated_data):
        validated_data['username'] = validated_data['email']
        user = User.objects.create_user(**validated_data)
        return user

class EventSerializer(serializers.ModelSerializer):
    class Meta:
        model = Event
        fields = '__all__'

class ReservationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Reservation
        fields = '__all__'
