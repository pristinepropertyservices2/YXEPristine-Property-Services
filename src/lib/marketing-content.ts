export const services = [
  {
    id: "carpet",
    name: "Carpet Cleaning",
    description:
      "Includes cleaning, deodorizing, disinfecting, and protecting for carpets and rugs.",
    price: 119,
    duration: 90,
    mediaType: "image",
    mediaSrc: "/Capet Cleaning1.png",
    features: [
      "$119 - First 2 Rooms",
      "Whole House: $269 (5 rooms + hall)",
      "Additional Rooms: $60 each",
      "Single Room: $75 (only with other services)",
    ],
  },
  {
    id: "upholstery",
    name: "Upholstery Cleaning",
    description:
      "Includes cleaning, deodorizing, disinfecting, and protecting for upholstered furniture.",
    price: 119,
    duration: 60,
    mediaType: "image",
    mediaSrc: "/Upholstery Cleaning 1.png",
    features: [
      "Sofa: $139 | Loveseat: $99 | Chair: $70",
      "All 3 Pieces: $269",
      "L-Shaped Sectional: $189 - $350",
      "U-Shaped Sectional: $229 - $400",
    ],
  },
  {
    id: "airduct",
    name: "Air Duct Cleaning",
    description:
      "Includes cleaning, deodorizing, and disinfecting for full HVAC duct systems.",
    price: 249,
    duration: 120,
    mediaType: "image",
    mediaSrc: "/Air Duct Cleaning 1.png",
    features: [
      "$249 - Up to 10 vents (full system cleaning)",
      "Additional vents: $35 each",
      "Permanent electrostatic air filter: $125",
      "Dryer vent add-on: from $50 with duct cleaning",
    ],
  },
  {
    id: "tile",
    name: "Tile & Grout Cleaning",
    description: "Includes cleaning, deodorizing, and disinfecting for tile, grout, and shower areas.",
    price: 119,
    duration: 90,
    mediaType: "image",
    mediaSrc: "/Tile and Grout Cleaning 1.png",
    features: [
      "$99 - First 2 areas (up to 200 sq. ft.)",
      "Additional areas: $0.60 per sq. ft.",
      "Grout color sealing: $1.25 per sq. ft.",
      "Shower walls & floors: $1.50 per sq. ft.",
    ],
  },
  {
    id: "dryervent",
    name: "Dryer Vent Cleaning",
    description: "Includes cleaning, deodorizing, and disinfecting to improve airflow and reduce fire risk.",
    price: 119,
    duration: 60,
    mediaType: "image",
    mediaSrc: "/Dryer Vent Cleaning 2.png",
    features: [
      "Side wall vent: $119",
      "Roof vent: $149",
      "Save $50 when combined with Air Duct Cleaning",
      "Full lint, dust, and debris removal included",
    ],
  },
  {
    id: "mattress",
    name: "Mattress Cleaning",
    description:
      "Includes cleaning, deodorizing, disinfecting, and protecting for cleaner, healthier sleep surfaces.",
    price: 119,
    duration: 45,
    mediaType: "image",
    mediaSrc: "/Mattress cleaning 1.png",
    features: [
      "Twin: $89 (one side)",
      "Queen: $109 (one side)",
      "King: $139 (one side)",
      "2nd side: 50% OFF",
    ],
  },
  {
    id: "wood",
    name: "Wood Floor Cleaning",
    description: "Includes cleaning, deodorizing, disinfecting, and sealing for wood floor protection.",
    price: 149,
    duration: 90,
    mediaType: "image",
    mediaSrc: "/Hard Wood Floor Cleaning1.png",
    features: [
      "$0.99 per sq. ft. (cleaning + 2 sealant coats)",
      "Additional sealant coat: +$0.25 per sq. ft.",
      "Hardwood-safe process",
      "Helps maintain natural shine and finish",
    ],
  },
  {
    id: "postconstruction",
    name: "Post-Construction Cleaning",
    description:
      "Detailed top-to-bottom cleanup after renovations and construction projects.",
    price: 299,
    duration: 240,
    mediaType: "image",
    mediaSrc: "/post constuction cleaning 1.png",
    features: ["Dust removal", "Debris cleanup", "Window cleaning", "Final detailing"],
  },
] as const;

export const pricingPlans = [
  {
    id: "one-time",
    name: "One-Time Service",
    description: "Best for occasional deep cleaning with no recurring commitment.",
    discount: 0,
    features: ["Flexible scheduling", "No commitment", "All services available", "Single payment"],
  },
  {
    id: "weekly",
    name: "Weekly Plan",
    description: "Save 15% on recurring weekly services.",
    discount: 15,
    popular: true,
    features: ["15% discount", "Priority scheduling", "Consistent cleaner", "Easy rescheduling"],
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    description: "Save 10% with monthly recurring service.",
    discount: 10,
    features: ["10% discount", "Flexible scheduling", "Same cleaner option", "Cancel anytime"],
  },
] as const;

