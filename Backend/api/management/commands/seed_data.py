from django.core.management.base import BaseCommand
from api.models import Event
from datetime import datetime

class Command(BaseCommand):
    help = 'Seeds the database with initial data'

    def handle(self, *args, **kwargs):
        self.stdout.write('Seeding data...')

        events = [
            {
                "title": "Conferencia de Tecnología 2025",
                "description": "Únete a líderes de la industria para obtener información sobre el futuro de la tecnología",
                "date": "2025-01-15",
                "time": "09:00:00",
                "location": "Centro de Convenciones, San Francisco, CA",
                "category": "Tecnología",
                "price": 150,
                "capacity": 500,
                "registeredCount": 320,
                "image": "/tech-conference-hall.png",
                "organizer": "Eventos Tecnológicos S.A.",
            },
            {
                "title": "Taller de Diseño",
                "description": "Aprende principios de diseño creativo de diseñadores galardonados",
                "date": "2025-01-20",
                "time": "14:00:00",
                "location": "Centro de Diseño, Nueva York, NY",
                "category": "Diseño",
                "price": 89,
                "capacity": 150,
                "registeredCount": 98,
                "image": "/design-workshop-creative-space.jpg",
                "organizer": "Mentes Creativas S.L.",
            },
            {
                "title": "Evento de Networking para Startups",
                "description": "Conecta con fundadores, inversionistas e innovadores en el ecosistema de startups",
                "date": "2025-01-25",
                "time": "18:00:00",
                "location": "El Pabellón, Austin, TX",
                "category": "Networking",
                "price": 49,
                "capacity": 300,
                "registeredCount": 185,
                "image": "/startup-networking-event.png",
                "organizer": "Colectivo de Startups",
            },
            {
                "title": "Bootcamp de Programación",
                "description": "Bootcamp intensivo de 3 días cubriendo desarrollo full-stack",
                "date": "2025-02-01",
                "time": "10:00:00",
                "location": "Academia Tecnológica, Seattle, WA",
                "category": "Educación",
                "price": 299,
                "capacity": 100,
                "registeredCount": 87,
                "image": "/coding-bootcamp-classroom.jpg",
                "organizer": "Academia de Código",
            },
        ]

        for event_data in events:
            Event.objects.get_or_create(title=event_data['title'], defaults=event_data)
        
        # Create admin user
        from api.models import User
        if not User.objects.filter(email='admin@example.com').exists():
            User.objects.create_superuser(
                username='admin',
                email='admin@example.com',
                password='admin123',
                name='Admin User',
                role='admin'
            )
            self.stdout.write(self.style.SUCCESS('Successfully created admin user: admin@example.com / admin123'))
        else:
            self.stdout.write('Admin user already exists')

        self.stdout.write(self.style.SUCCESS('Successfully seeded data'))
