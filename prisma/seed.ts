import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';
import { DEFAULT_PLANS } from '../src/lib/plans';

const prisma = new PrismaClient();

const services = [
  {
    id: 'carpet',
    name: 'Carpet Cleaning',
    description:
      'Includes cleaning, deodorizing, disinfecting, and protecting for carpets and rugs.',
    price: 119,
    duration: 90,
    image: '/Capet Cleaning1.png',
    features: '["$119 - First 2 Rooms", "Whole House: $269 (5 rooms + hall)", "Additional Rooms: $60 each", "Single Room: $75 (only with other services)"]',
    addOns: [
      { name: 'Pet stain treatment', price: 35 },
      { name: 'Carpet protector (Scotchgard-style)', price: 45 },
    ],
  },
  {
    id: 'upholstery',
    name: 'Upholstery Cleaning',
    description:
      'Includes cleaning, deodorizing, disinfecting, and protecting for upholstered furniture.',
    price: 119,
    duration: 60,
    image: '/Upholstery Cleaning 1.png',
    features: '["Sofa: $139 | Loveseat: $99 | Chair: $70", "All 3 Pieces: $269", "L-Shaped Sectional: $189 - $350", "U-Shaped Sectional: $229 - $400"]',
    addOns: [
      { name: 'Extra sectional cushion', price: 25 },
      { name: 'Fabric deodorizer', price: 15 },
    ],
  },
  {
    id: 'airduct',
    name: 'Air Duct Cleaning',
    description:
      'Includes cleaning, deodorizing, and disinfecting for full HVAC duct systems.',
    price: 249,
    duration: 120,
    image: '/Air Duct Cleaning 1.png',
    features: '["$249 - Up to 10 vents (full system cleaning)", "Additional vents: $35 each", "Permanent electrostatic air filter: $125", "Dryer vent add-on: from $50 with duct cleaning"]',
    addOns: [
      { name: 'Dryer vent add-on (same visit)', price: 89 },
      { name: 'Sanitizing fog treatment', price: 49 },
    ],
  },
  {
    id: 'tile',
    name: 'Tile & Grout Cleaning',
    description:
      'Includes cleaning, deodorizing, and disinfecting for tile, grout, and shower areas.',
    price: 119,
    duration: 90,
    image: '/Tile and Grout Cleaning 1.png',
    features: '["$99 - First 2 areas (up to 200 sq. ft.)", "Additional areas: $0.60 per sq. ft.", "Grout color sealing: $1.25 per sq. ft.", "Shower walls & floors: $1.50 per sq. ft."]',
    addOns: [
      { name: 'Grout sealing', price: 55 },
      { name: 'Shower glass polish', price: 35 },
    ],
  },
  {
    id: 'dryervent',
    name: 'Dryer Vent Cleaning',
    description:
      'Includes cleaning, deodorizing, and disinfecting to improve airflow and reduce fire risk.',
    price: 119,
    duration: 60,
    image: '/Dryer Vent Cleaning 2.png',
    features: '["Side wall vent: $119", "Roof vent: $149", "Save $50 when combined with Air Duct Cleaning", "Full lint, dust, and debris removal included"]',
    addOns: [{ name: 'Bird guard install', price: 45 }],
  },
  {
    id: 'mattress',
    name: 'Mattress Cleaning',
    description:
      'Includes cleaning, deodorizing, disinfecting, and protecting for cleaner, healthier sleep surfaces.',
    price: 119,
    duration: 45,
    image: '/Mattress cleaning 1.png',
    features: '["Twin: $89 (one side)", "Queen: $109 (one side)", "King: $139 (one side)", "2nd side: 50% OFF"]',
    addOns: [
      { name: 'Mattress encasement (supply)', price: 39 },
      { name: 'UV sanitization upgrade', price: 25 },
    ],
  },
  {
    id: 'wood',
    name: 'Wood Floor Cleaning',
    description:
      'Includes cleaning, deodorizing, disinfecting, and sealing for wood floor protection.',
    price: 149,
    duration: 90,
    image: '/Hard Wood Floor Cleaning1.png',
    features: '["$0.99 per sq. ft. (cleaning + 2 sealant coats)", "Additional sealant coat: +$0.25 per sq. ft.", "Hardwood-safe process", "Helps maintain natural shine and finish"]',
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
    image: '/post constuction cleaning 1.png',
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

  for (const plan of DEFAULT_PLANS) {
    await prisma.plan.upsert({
      where: { id: plan.id },
      create: {
        id: plan.id,
        name: plan.name,
        type: plan.type,
        price: plan.price,
        discount: plan.discount,
        features: JSON.stringify(plan.features),
        isActive: true,
      },
      update: {
        name: plan.name,
        type: plan.type,
        price: plan.price,
        discount: plan.discount,
        features: JSON.stringify(plan.features),
        isActive: true,
      },
    });
  }
  console.log(`Seed: ${DEFAULT_PLANS.length} subscription plans`);
}

main()
  .then(() => prisma.$disconnect())
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
