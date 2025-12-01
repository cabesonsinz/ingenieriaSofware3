import os
import django

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from api.models import Event

print("Checking Events...")
events = Event.objects.all()
print(f"Total Events: {events.count()}")

for event in events:
    print(f"ID: {event.id}")
    print(f"  Title: {event.title}")
    print(f"  Date: {event.date} Time: {event.time}")
    print(f"  Location: {event.location}")
    print(f"  Category: {event.category}")
    print(f"  Price: ${event.price}")
    print(f"  Capacity: {event.registeredCount}/{event.capacity}")
    print("-" * 30)
