export type HomeService = {
  id: string;
  name: string;
  description: string;
  price: number;
  duration: number;
  image: string;
  features: string[];
};

export type HomePlan = {
  id: string;
  name: string;
  type: string;
  discount: number;
  description: string;
  features: string[];
  popular?: boolean;
};

export type HomeTestimonial = {
  name: string;
  location: string;
  rating: number;
  text: string;
  service: string;
  initials: string;
};

export const HERO_LOCATION = "Saskatoon";

export const HOME_PHONE_DISPLAY = "639-471-3393";
export const HOME_PHONE_TEL = "tel:+16394713393";

export const homeServices: HomeService[] = [
  {
    id: "carpet",
    name: "Carpet Cleaning",
    description:
      "Includes cleaning, deodorizing, disinfecting, and protecting for carpets and rugs.",
    price: 119,
    duration: 90,
    image: "/Capet Cleaning1.png",
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
    image: "/Upholstery Cleaning 1.png",
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
    image: "/Air Duct Cleaning 1.png",
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
    description:
      "Includes cleaning, deodorizing, and disinfecting for tile, grout, and shower areas.",
    price: 119,
    duration: 90,
    image: "/Tile and Grout Cleaning 1.png",
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
    description:
      "Includes cleaning, deodorizing, and disinfecting to improve airflow and reduce fire risk.",
    price: 119,
    duration: 60,
    image: "/Dryer Vent Cleaning 2.png",
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
    image: "/Mattress cleaning 1.png",
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
    description:
      "Includes cleaning, deodorizing, disinfecting, and sealing for wood floor protection.",
    price: 149,
    duration: 90,
    image: "/Hard Wood Floor Cleaning1.png",
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
      "Thorough cleaning after renovation or construction to make your space move-in ready.",
    price: 299,
    duration: 240,
    image: "/post constuction cleaning 1.png",
    features: ["Dust removal", "Debris cleanup", "Window cleaning", "Final detailing"],
  },
];

export const homePlans: HomePlan[] = [
  {
    id: "one-time",
    name: "One-Time Service",
    type: "ONE_TIME",
    discount: 0,
    description: "Perfect for occasional deep cleaning needs",
    features: ["Flexible scheduling", "No commitment", "All services available", "Single payment"],
  },
  {
    id: "weekly",
    name: "Weekly Plan",
    type: "WEEKLY",
    discount: 15,
    description: "Save 15% with weekly recurring services",
    features: [
      "15% discount on all services",
      "Priority scheduling",
      "Consistent cleaner",
      "Easy rescheduling",
    ],
    popular: true,
  },
  {
    id: "monthly",
    name: "Monthly Plan",
    type: "MONTHLY",
    discount: 10,
    description: "Save 10% with monthly recurring services",
    features: ["10% discount on all services", "Flexible scheduling", "Same cleaner option", "Cancel anytime"],
  },
];

export const homeTestimonials: HomeTestimonial[] = [
  {
    name: "Sarah M.",
    initials: "SM",
    location: "Saskatoon",
    rating: 5,
    text: "Exceptional service! My carpets look brand new. The team was professional, on time, and used eco-friendly products which was important for my family.",
    service: "Carpet Cleaning",
  },
  {
    name: "Mike T.",
    initials: "MT",
    location: "Martensville",
    rating: 5,
    text: "Best air duct cleaning service in Saskatoon! Noticed immediate improvement in air quality. Highly recommend YXE Pristine!",
    service: "Air Duct Cleaning",
  },
  {
    name: "Jennifer L.",
    initials: "JL",
    location: "Warman",
    rating: 5,
    text: "The upholstery cleaning saved my favorite sofa! They removed stains I thought were permanent. Amazing work!",
    service: "Upholstery Cleaning",
  },
];

export const homeBookingTimeSlots = [
  "08:00",
  "09:00",
  "10:00",
  "11:00",
  "12:00",
  "13:00",
  "14:00",
  "15:00",
  "16:00",
];
