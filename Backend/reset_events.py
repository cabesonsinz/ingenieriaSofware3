import os
import django
from datetime import date, time

os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'backend_project.settings')
django.setup()

from api.models import Event

print("Deleting all existing events...")
Event.objects.all().delete()
print("All events deleted.")

print("Creating default events...")

events_data = [
    {
        "title": "Conferencia de Tecnología 2025",
        "description": "Únete a los líderes de la industria para explorar las últimas tendencias en IA, blockchain y desarrollo de software.",
        "date": date(2025, 3, 15),
        "time": time(9, 0),
        "location": "Centro de Convenciones, San Francisco, CA",
        "category": "Tecnología",
        "price": 299.00,
        "capacity": 500,
        "image": "/tech-conference-hall.png",
        "organizer": "TechWorld Inc."
    },
    {
        "title": "Taller de Diseño Creativo",
        "description": "Aprende los fundamentos del diseño UI/UX con expertos de la industria en este taller práctico intensivo.",
        "date": date(2025, 1, 20),
        "time": time(14, 0),
        "location": "Centro de Diseño, Nueva York, NY",
        "category": "Diseño",
        "price": 89.00,
        "capacity": 50,
        "image": "/design-workshop-creative-space.jpg",
        "organizer": "Design Matters"
    },
    {
        "title": "Networking para Startups",
        "description": "Conecta con fundadores, inversores y mentores en este evento exclusivo de networking para el ecosistema emprendedor.",
        "date": date(2025, 1, 25),
        "time": time(18, 0),
        "location": "El Pabellón, Austin, TX",
        "category": "Networking",
        "price": 49.00,
        "capacity": 100,
        "image": "/startup-networking-event.png",
        "organizer": "StartupGrind"
    },
    {
        "title": "Bootcamp de Desarrollo Web",
        "description": "Un curso intensivo de fin de semana para aprender React, Node.js y bases de datos modernas.",
        "date": date(2025, 2, 1),
        "time": time(10, 0),
        "location": "Academia Tecnológica, Seattle, WA",
        "category": "Educación",
        "price": 199.00,
        "capacity": 30,
        "image": "/coding-bootcamp-classroom.jpg",
        "organizer": "CodeAcademy"
    },
    {
        "title": "Festival de Música Indie",
        "description": "Disfruta de las mejores bandas emergentes en un ambiente relajado al aire libre.",
        "date": date(2025, 4, 10),
        "time": time(16, 0),
        "location": "Parque Central, Santiago",
        "category": "Entretenimiento",
        "price": 25.00,
        "capacity": 1000,
        "image": "/community-event.png",
        "organizer": "IndieFest"
    }
]

for event_data in events_data:
    event = Event.objects.create(**event_data)
    print(f"Created event: {event.title}")

print(f"\nSuccessfully created {len(events_data)} events.")
