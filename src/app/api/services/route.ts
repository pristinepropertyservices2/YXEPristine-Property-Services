import { NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Seed services if they don't exist
const defaultServices = [
  {
    id: 'carpet',
    name: 'Carpet Cleaning',
    description: 'Deep cleaning that removes dirt, stains, and allergens from your carpets using eco-friendly products.',
    price: 89,
    duration: 90,
    image: '/Capet Cleaning1.png',
    features: '["Stain removal", "Odor elimination", "Quick drying", "Eco-friendly products"]',
  },
  {
    id: 'upholstery',
    name: 'Upholstery Cleaning',
    description: 'Restore your furniture to like-new condition with our professional upholstery cleaning service.',
    price: 79,
    duration: 60,
    image: '/Upholstery Cleaning 1.png',
    features: '["Fabric-safe cleaning", "Stain protection", "Allergen removal", "Fresh scent"]',
  },
  {
    id: 'airduct',
    name: 'Air Duct Cleaning',
    description: 'Improve your indoor air quality by removing dust, debris, and contaminants from your HVAC system.',
    price: 199,
    duration: 120,
    image: '/Air Duct Cleaning 1.png',
    features: '["Improved air quality", "Energy efficiency", "Allergen reduction", "System inspection"]',
  },
  {
    id: 'tile',
    name: 'Tile & Grout Cleaning',
    description: 'Deep cleaning and sealing of tile surfaces to restore their original beauty and shine.',
    price: 129,
    duration: 90,
    image: '/Tile and Grout Cleaning 1.png',
    features: '["Deep grout cleaning", "Sealant application", "Color restoration", "Mold prevention"]',
  },
  {
    id: 'dryervent',
    name: 'Dryer Vent Cleaning',
    description: 'Prevent fire hazards and improve dryer efficiency with professional vent cleaning.',
    price: 149,
    duration: 60,
    image: '/Dryer Vent Cleaning 2.png',
    features: '["Fire prevention", "Energy savings", "Faster drying", "Safety inspection"]',
  },
  {
    id: 'mattress',
    name: 'Mattress Cleaning',
    description: 'Deep clean and sanitize your mattress for a healthier, more restful sleep.',
    price: 99,
    duration: 45,
    image: '/Mattress cleaning 1.png',
    features: '["Dust mite removal", "Stain treatment", "Sanitization", "Allergen reduction"]',
  },
  {
    id: 'wood',
    name: 'Wood Floor Cleaning',
    description: 'Gentle yet effective cleaning for your hardwood floors to maintain their natural beauty.',
    price: 119,
    duration: 90,
    image: '/Hard Wood Floor Cleaning1.png',
    features: '["Safe for hardwood", "Polish application", "Scratch prevention", "Natural shine"]',
  },
  {
    id: 'postconstruction',
    name: 'Post-Construction Cleaning',
    description: 'Thorough cleaning after renovation or construction to make your space move-in ready.',
    price: 299,
    duration: 240,
    image: '/post constuction cleaning 1.png',
    features: '["Dust removal", "Debris cleanup", "Window cleaning", "Final detailing"]',
  },
];

export async function GET() {
  try {
    let services = await db.service.findMany({
      orderBy: {
        order: 'asc',
      },
    });

    // Seed services if none exist
    if (services.length === 0) {
      await db.service.createMany({
        data: defaultServices.map((s, i) => ({ ...s, order: i })),
      });
      services = await db.service.findMany({
        orderBy: {
          order: 'asc',
        },
      });
    }
    
    // Parse features from JSON string
    const servicesWithFeatures = services.map(s => ({
      ...s,
      features: JSON.parse(s.features || '[]'),
    }));
    
    return NextResponse.json({ services: servicesWithFeatures });
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json(
      { error: 'Failed to fetch services' },
      { status: 500 }
    );
  }
}
