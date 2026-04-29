export type ServiceDetail = {
  id:
    | "carpet"
    | "upholstery"
    | "airduct"
    | "tile"
    | "dryervent"
    | "mattress"
    | "wood"
    | "postconstruction";
  name: string;
  heroImage: string;
  shortDescription: string;
  longDescription: string;
  includes: string;
  startingPrice: string;
  pricingItems: string[];
};

export const serviceDetails: ServiceDetail[] = [
  {
    id: "carpet",
    name: "Carpet Cleaning",
    heroImage: "/Capet Cleaning1.png",
    shortDescription:
      "All-natural, low-moisture carpet cleaning for healthier homes and businesses.",
    longDescription:
      "At YXE Pristine Property Services, we believe a truly clean space should be healthy, safe, and welcoming. Our all-natural, eco-friendly carpet cleaning solution delivers a deep, thorough clean without harsh chemicals or excessive moisture. Our low-moisture cleaning process uses biodegradable, plant-based products that are tough on dirt and stains but gentle on your carpets, your family, your pets, and the environment.",
    includes: "Includes Cleaning, Deodorizing, Disinfecting, & Protecting",
    startingPrice: "$119",
    pricingItems: [
      "$119 - First 2 Rooms",
      "Whole House: $269 (includes 5 rooms + hall)",
      "Additional Rooms: $60 each",
      "Single Room: $75 (only with other services)",
      "High Rise Fee: +$30 (no charge for first floor unless required)",
      "Stairs: $7 each",
      "Stair Landings: $14 each",
      "Walk-In Closets: Starting at $20",
      "Hallways: Starting at $20",
      "Area / Oriental Rugs: $0.99 per sq. ft. (cleaned on-site)",
    ],
  },
  {
    id: "upholstery",
    name: "Upholstery Cleaning",
    heroImage: "/Upholstery Cleaning 1.png",
    shortDescription:
      "Fabric-safe upholstery cleaning that refreshes furniture and extends lifespan.",
    longDescription:
      "Our upholstery cleaning service is designed to lift embedded dirt, remove odor, and restore the look and feel of your furniture. We use eco-friendly products and careful techniques that are tough on buildup but safe for your family, pets, and indoor air quality.",
    includes: "Includes Cleaning, Deodorizing, Disinfecting, & Protecting",
    startingPrice: "$119",
    pricingItems: [
      "Sofa: $139",
      "Loveseat: $99",
      "Chair: $70 (Recliner $80)",
      "All 3 Pieces: $269",
      "L-Shaped Sectional: $189 - $350 (based on size/seats)",
      "U-Shaped Sectional: $229 - $400 (based on size/seats)",
      "Ottoman: $35",
      "Recliner: $80",
      "Extra Pillows: $10 each (sofa pillows included)",
      "Dining Chairs: $20 - $30 each",
    ],
  },
  {
    id: "airduct",
    name: "Air Duct Cleaning",
    heroImage: "/Air Duct Cleaning 1.png",
    shortDescription:
      "Professional duct system cleaning to improve indoor air quality and airflow.",
    longDescription:
      "Our air duct cleaning process removes dust, debris, and contaminants from your HVAC system to support cleaner breathing and better efficiency. We clean registers and key system components for a complete service that helps your space feel fresher.",
    includes: "Includes Cleaning, Deodorizing, & Disinfecting",
    startingPrice: "$249",
    pricingItems: [
      "$249 - Up to 10 Vents (register wash + full system cleaning)",
      "Additional Vents: $35 each (over 10)",
      "Permanent Electrostatic Air Filter: $125",
      "Dryer Vent (Side Wall): $50 with duct cleaning | $99 standalone",
      "Dryer Vent (Roof): $99 with duct cleaning | $149 standalone",
    ],
  },
  {
    id: "tile",
    name: "Tile & Grout Cleaning",
    heroImage: "/Tile and Grout Cleaning 1.png",
    shortDescription:
      "Deep tile and grout restoration for kitchens, bathrooms, and high-traffic areas.",
    longDescription:
      "We provide deep tile and grout cleaning that lifts buildup and restores a cleaner, brighter finish. Our process is ideal for hard-surface areas where regular mopping is not enough, and optional sealing helps protect long term.",
    includes: "Includes Cleaning, Deodorizing, & Disinfecting",
    startingPrice: "$119",
    pricingItems: [
      "$99 - First 2 Areas (or up to 200 sq. ft.)",
      "Additional Areas: $0.60 per sq. ft.",
      "Grout Color Sealing: $1.25 per sq. ft.",
      "Shower Walls & Floors: $1.50 per sq. ft.",
    ],
  },
  {
    id: "dryervent",
    name: "Dryer Vent Cleaning",
    heroImage: "/Dryer Vent Cleaning 2.png",
    shortDescription:
      "Thorough dryer vent cleaning to reduce fire risk and improve dryer performance.",
    longDescription:
      "Our dryer vent cleaning removes lint, dust, and debris throughout the vent line to improve airflow, shorten drying times, and reduce safety risks. This service is recommended for both homes and multi-unit properties.",
    includes: "Includes Cleaning, Deodorizing, & Disinfecting",
    startingPrice: "$119",
    pricingItems: [
      "Side Wall Vent: $119",
      "Roof Vent: $149",
      "Includes full removal of lint, dust, and debris",
      "Save $50 when combined with Air Duct Cleaning",
    ],
  },
  {
    id: "mattress",
    name: "Mattress Cleaning",
    heroImage: "/Mattress cleaning 1.png",
    shortDescription:
      "Targeted mattress cleaning for healthier sleep and reduced allergen buildup.",
    longDescription:
      "Our mattress cleaning service removes dirt, odor, and common allergens from your sleep surface using fabric-safe, low-moisture methods. It is a great option for improving hygiene and comfort without harsh chemical residue.",
    includes: "Includes Cleaning, Deodorizing, Disinfecting, & Protecting",
    startingPrice: "$119",
    pricingItems: [
      "Twin: $89 (one side)",
      "Queen: $109 (one side)",
      "King: $139 (one side)",
      "2nd Side: 50% OFF",
    ],
  },
  {
    id: "wood",
    name: "Wood Floor Cleaning",
    heroImage: "/Hard Wood Floor Cleaning1.png",
    shortDescription:
      "Hardwood-safe cleaning and sealing for long-lasting floor beauty and protection.",
    longDescription:
      "Our wood floor cleaning and sealing service removes embedded grime while preserving finish quality. Using gentle but effective products, we clean thoroughly and apply sealant to protect the floor and maintain natural appearance.",
    includes: "Includes Cleaning, Deodorizing, & Disinfecting",
    startingPrice: "$149",
    pricingItems: [
      "$0.99 per sq. ft. (includes cleaning + 2 sealant coats)",
      "Additional Sealant Coat: +$0.25 per sq. ft.",
    ],
  },
  {
    id: "postconstruction",
    name: "Post-Construction Cleaning",
    heroImage: "/post constuction cleaning 1.png",
    shortDescription:
      "Detailed post-construction cleanup for homes and commercial spaces.",
    longDescription:
      "Our post-construction cleaning service is built for spaces that need detailed dust and debris removal after renovation or building work. We handle top-to-bottom finishing cleanup so your property is move-in ready.",
    includes: "Detailed top-to-bottom construction cleanup",
    startingPrice: "Custom Quote",
    pricingItems: [
      "Pricing is based on project size, scope, and level of dust/debris",
      "Residential and commercial projects supported",
      "Request a free on-site estimate for accurate pricing",
    ],
  },
];

export const serviceDetailMap = Object.fromEntries(
  serviceDetails.map((service) => [service.id, service])
) as Record<ServiceDetail["id"], ServiceDetail>;
