import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

const prisma = new PrismaClient();

const services = [
  {
    id: 'carpet',
    name: 'Carpet Cleaning',
    description:
      'Deep cleaning that removes dirt, stains, and allergens from your carpets using eco-friendly products.',
    price: 89,
    duration: 90,
    image: '/images/service-carpet.png',
    features: '["Stain removal", "Odor elimination", "Quick drying", "Eco-friendly products"]',
    addOns: [
      { name: 'Pet stain treatment', price: 35 },
      { name: 'Carpet protector (Scotchgard-style)', price: 45 },
    ],
  },
  {
    id: 'upholstery',
    name: 'Upholstery Cleaning',
    description:
      'Restore your furniture to like-new condition with our professional upholstery cleaning service.',
    price: 79,
    duration: 60,
    image: '/images/service-upholstery.png',
    features: '["Fabric-safe cleaning", "Stain protection", "Allergen removal", "Fresh scent"]',
    addOns: [
      { name: 'Extra sectional cushion', price: 25 },
      { name: 'Fabric deodorizer', price: 15 },
    ],
  },
  {
    id: 'airduct',
    name: 'Air Duct Cleaning',
    description:
      'Improve your indoor air quality by removing dust, debris, and contaminants from your HVAC system.',
    price: 199,
    duration: 120,
    image: '/images/service-airduct.png',
    features: '["Improved air quality", "Energy efficiency", "Allergen reduction", "System inspection"]',
    addOns: [
      { name: 'Dryer vent add-on (same visit)', price: 89 },
      { name: 'Sanitizing fog treatment', price: 49 },
    ],
  },
  {
    id: 'tile',
    name: 'Tile & Grout Cleaning',
    description:
      'Deep cleaning and sealing of tile surfaces to restore their original beauty and shine.',
    price: 129,
    duration: 90,
    image: '/images/service-tile.png',
    features: '["Deep grout cleaning", "Sealant application", "Color restoration", "Mold prevention"]',
    addOns: [
      { name: 'Grout sealing', price: 55 },
      { name: 'Shower glass polish', price: 35 },
    ],
  },
  {
    id: 'dryervent',
    name: 'Dryer Vent Cleaning',
    description:
      'Prevent fire hazards and improve dryer efficiency with professional vent cleaning.',
    price: 149,
    duration: 60,
    image: '/images/service-airduct.png',
    features: '["Fire prevention", "Energy savings", "Faster drying", "Safety inspection"]',
    addOns: [{ name: 'Bird guard install', price: 45 }],
  },
  {
    id: 'mattress',
    name: 'Mattress Cleaning',
    description:
      'Deep clean and sanitize your mattress for a healthier, more restful sleep.',
    price: 99,
    duration: 45,
    image: '/images/service-upholstery.png',
    features: '["Dust mite removal", "Stain treatment", "Sanitization", "Allergen reduction"]',
    addOns: [
      { name: 'Mattress encasement (supply)', price: 39 },
      { name: 'UV sanitization upgrade', price: 25 },
    ],
  },
  {
    id: 'wood',
    name: 'Wood Floor Cleaning',
    description:
      'Gentle yet effective cleaning for your hardwood floors to maintain their natural beauty.',
    price: 119,
    duration: 90,
    image: '/images/service-wood.png',
    features: '["Safe for hardwood", "Polish application", "Scratch prevention", "Natural shine"]',
    addOns: [
      { name: 'Buff & polish refresh', price: 40 },
      { name: 'Scratch touch-up kit', price: 30 },
    ],
  },
  {
    id: 'postconstruction',
    name: 'Post-Construction Cleaning',
    description:
      'Thorough cleaning after renovation or construction to make your space move-in ready.',
    price: 299,
    duration: 240,
    image: '/images/hero-cleaning.png',
    features: '["Dust removal", "Debris cleanup", "Window cleaning", "Final detailing"]',
    addOns: [
      { name: 'Garage sweep & wash', price: 75 },
      { name: 'Interior window deep clean', price: 95 },
    ],
  },
];

async function main() {
  const adminHash = await bcrypt.hash('Admin12345', 12);
  await prisma.user.upsert({
    where: { email: 'admin@yxepristine.local' },
    create: {
      email: 'admin@yxepristine.local',
      name: 'Site Admin',
      password: adminHash,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
    update: {
      password: adminHash,
      role: 'ADMIN',
      emailVerified: new Date(),
    },
  });

  let order = 0;
  for (const s of services) {
    const { addOns, ...serviceData } = s;
    await prisma.service.upsert({
      where: { id: s.id },
      create: {
        ...serviceData,
        order: order++,
      },
      update: {
        name: serviceData.name,
        description: serviceData.description,
        price: serviceData.price,
        duration: serviceData.duration,
        image: serviceData.image,
        features: serviceData.features,
        order: order - 1,
      },
    });

    await prisma.addOn.deleteMany({ where: { serviceId: s.id } });
    for (const a of addOns) {
      await prisma.addOn.create({
        data: {
          name: a.name,
          price: a.price,
          serviceId: s.id,
        },
      });
    }
  }

  console.log('Seed: admin user admin@yxepristine.local (password: Admin12345)');
  console.log(`Seed: ${services.length} services with add-ons`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
