from django.db import models
from django.contrib.auth.models import AbstractUser

class User(AbstractUser):
    ROLE_CHOICES = (
        ('visitor', 'Visitor'),
        ('user', 'User'),
        ('admin', 'Admin'),
    )
    email = models.EmailField(unique=True)
    name = models.CharField(max_length=255)
    role = models.CharField(max_length=10, choices=ROLE_CHOICES, default='user')
    createdAt = models.DateTimeField(auto_now_add=True)

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'name']

    def __str__(self):
        return self.email

class Event(models.Model):
    title = models.CharField(max_length=255)
    description = models.TextField()
    date = models.DateField()
    time = models.TimeField()
    location = models.CharField(max_length=255)
    category = models.CharField(max_length=100)
    price = models.DecimalField(max_digits=10, decimal_places=2)
    capacity = models.IntegerField()
    registeredCount = models.IntegerField(default=0)
    image = models.CharField(max_length=255, blank=True, null=True) # URL or path
    organizer = models.CharField(max_length=255)
    createdAt = models.DateTimeField(auto_now_add=True)

    def __str__(self):
        return self.title

class Reservation(models.Model):
    STATUS_CHOICES = (
        ('confirmed', 'Confirmed'),
        ('cancelled', 'Cancelled'),
    )
    user = models.ForeignKey(User, on_delete=models.CASCADE, related_name='reservations')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='reservations')
    ticketCount = models.IntegerField()
    totalPrice = models.DecimalField(max_digits=10, decimal_places=2)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='confirmed')
    createdAt = models.DateTimeField(auto_now_add=True)
    cancelledAt = models.DateTimeField(null=True, blank=True)

    def __str__(self):
        return f"{self.user.email} - {self.event.title}"
