export const services = [
  {
    id: "carpet",
    name: "Carpet Cleaning",
    description:
      "Deep cleaning that removes dirt, stains, and allergens using eco-friendly products.",
    price: 89,
    duration: 90,
    mediaType: "image",
    mediaSrc: "/WhatsApp%20Image%202026-04-22%20at%207.23.35%20PM.jpeg",
    features: ["Stain removal", "Odor elimination", "Quick drying", "Eco-friendly products"],
  },
  {
    id: "upholstery",
    name: "Upholstery Cleaning",
    description:
      "Restore furniture to like-new condition with fabric-safe, professional cleaning.",
    price: 79,
    duration: 60,
    mediaType: "image",
    mediaSrc: "/WhatsApp%20Image%202026-04-22%20at%207.23.35%20PM%20(2).jpeg",
    features: ["Fabric-safe cleaning", "Stain protection", "Allergen removal", "Fresh scent"],
  },
  {
    id: "airduct",
    name: "Air Duct Cleaning",
    description:
      "Improve indoor air quality by removing dust and contaminants from HVAC systems.",
    price: 199,
    duration: 120,
    mediaType: "image",
    mediaSrc: "/portrait-modern-man-cleaning-doing-household-chores.jpg",
    features: ["Air quality boost", "Energy efficiency", "Allergen reduction", "Inspection"],
  },
  {
    id: "tile",
    name: "Tile & Grout Cleaning",
    description: "Deep tile and grout cleaning to restore shine and help prevent mold buildup.",
    price: 129,
    duration: 90,
    mediaType: "image",
    mediaSrc: "/man-doing-professional-home-cleaning-service.jpg",
    features: ["Deep grout cleaning", "Sealant option", "Color restoration", "Mold prevention"],
  },
  {
    id: "dryervent",
    name: "Dryer Vent Cleaning",
    description: "Reduce fire risk and improve dryer efficiency with full vent line cleaning.",
    price: 149,
    duration: 60,
    mediaType: "image",
    mediaSrc: "/man-holding-dirty-cloth-hand-view-inside-washing-machine.jpg",
    features: ["Fire prevention", "Energy savings", "Faster drying", "Safety inspection"],
  },
  {
    id: "mattress",
    name: "Mattress Cleaning",
    description:
      "Sanitize and deep-clean mattresses for better sleep quality and allergen control.",
    price: 99,
    duration: 45,
    mediaType: "image",
    mediaSrc: "/WhatsApp%20Image%202026-04-22%20at%207.23.36%20PM.jpeg",
    features: ["Dust mite removal", "Stain treatment", "Sanitization", "Allergen reduction"],
  },
  {
    id: "wood",
    name: "Wood Floor Cleaning",
    description: "Gentle hardwood-safe cleaning to preserve finish and natural floor beauty.",
    price: 119,
    duration: 90,
    mediaType: "image",
    mediaSrc: "/WhatsApp%20Image%202026-04-22%20at%207.23.33%20PM%20(1).jpeg",
    features: ["Hardwood safe", "Polish option", "Scratch prevention", "Natural shine"],
  },
  {
    id: "postconstruction",
    name: "Post-Construction Cleaning",
    description:
      "Detailed top-to-bottom cleanup after renovations and construction projects.",
    price: 299,
    duration: 240,
    mediaType: "image",
    mediaSrc: "/images/hero-cleaning.png",
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

