/** Housecall Pro online booking — from their Online Booking settings */
export const HOUSECALL_PRO_TOKEN = "b339cc8769c04de08ce0b8be43a1fdc2";
export const HOUSECALL_PRO_ORG = "YXE-Pristine-Property-Services";

export const HOUSECALL_PRO_BOOKING_URL =
  `https://book.housecallpro.com/book/${HOUSECALL_PRO_ORG}/${HOUSECALL_PRO_TOKEN}?v2=true`;

export const HOUSECALL_PRO_SCRIPT_SRC =
  `https://online-booking.housecallpro.com/script.js?token=${HOUSECALL_PRO_TOKEN}&orgName=${HOUSECALL_PRO_ORG}`;

declare global {
  interface Window {
    HCPWidget?: {
      openModal: () => void;
    };
  }
}

/** Opens Housecall Pro booking modal when the script is ready; otherwise goes to the booking page. */
export function openHousecallBooking() {
  if (typeof window === "undefined") return;
  if (window.HCPWidget?.openModal) {
    window.HCPWidget.openModal();
    return;
  }
  window.location.href = HOUSECALL_PRO_BOOKING_URL;
}
