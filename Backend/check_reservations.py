import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from api.models import Reservation, User, Event

print("Checking Reservations...")
reservations = Reservation.objects.all()
print(f"Total Reservations: {reservations.count()}")

for res in reservations:
    print(f"ID: {res.id}, User: {res.user.email} (ID: {res.user.id}), Event: {res.event.title} (ID: {res.event.id}), Status: {res.status}")

print("\nChecking Users...")
users = User.objects.all()
for u in users:
    print(f"ID: {u.id}, Email: {u.email}")
