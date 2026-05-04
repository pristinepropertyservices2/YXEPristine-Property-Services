-- Delete these 5 users and all related rows (bookings, payments, subscriptions, NextAuth).
-- IDs: pristinepropertyservices2, kamrankamrankhan825, candikk825, noorulmobin0011, tosifsheraz5474
--
-- On VPS (adjust container name + database name from your DATABASE_URL):
--   docker exec -i YOUR_POSTGRES_CONTAINER psql -U postgres -d cleaning_services -f deploy/delete-users-batch.sql
-- From repo root on server after git pull, or paste into psql.

BEGIN;

DELETE FROM "Payment"
WHERE "bookingId" IN (
  SELECT id FROM "Booking" WHERE "userId" IN (
    'cmod5tyqt0000ks50h13nhbxo',
    'cmordzcns0000ksi1exweqlor',
    'cmore008i0001ksi19i8luenb',
    'cmore43q60002ksi1eea0gjhu',
    'cmorgjlzm0000ksor95n5zkk2'
  )
);

DELETE FROM "Payment"
WHERE "subscriptionId" IN (
  SELECT id FROM "Subscription" WHERE "userId" IN (
    'cmod5tyqt0000ks50h13nhbxo',
    'cmordzcns0000ksi1exweqlor',
    'cmore008i0001ksi19i8luenb',
    'cmore43q60002ksi1eea0gjhu',
    'cmorgjlzm0000ksor95n5zkk2'
  )
);

DELETE FROM "Payment" WHERE "userId" IN (
  'cmod5tyqt0000ks50h13nhbxo',
  'cmordzcns0000ksi1exweqlor',
  'cmore008i0001ksi19i8luenb',
  'cmore43q60002ksi1eea0gjhu',
  'cmorgjlzm0000ksor95n5zkk2'
);

DELETE FROM "Booking" WHERE "userId" IN (
  'cmod5tyqt0000ks50h13nhbxo',
  'cmordzcns0000ksi1exweqlor',
  'cmore008i0001ksi19i8luenb',
  'cmore43q60002ksi1eea0gjhu',
  'cmorgjlzm0000ksor95n5zkk2'
);

DELETE FROM "Subscription" WHERE "userId" IN (
  'cmod5tyqt0000ks50h13nhbxo',
  'cmordzcns0000ksi1exweqlor',
  'cmore008i0001ksi19i8luenb',
  'cmore43q60002ksi1eea0gjhu',
  'cmorgjlzm0000ksor95n5zkk2'
);

DELETE FROM "Account" WHERE "userId" IN (
  'cmod5tyqt0000ks50h13nhbxo',
  'cmordzcns0000ksi1exweqlor',
  'cmore008i0001ksi19i8luenb',
  'cmore43q60002ksi1eea0gjhu',
  'cmorgjlzm0000ksor95n5zkk2'
);

DELETE FROM "Session" WHERE "userId" IN (
  'cmod5tyqt0000ks50h13nhbxo',
  'cmordzcns0000ksi1exweqlor',
  'cmore008i0001ksi19i8luenb',
  'cmore43q60002ksi1eea0gjhu',
  'cmorgjlzm0000ksor95n5zkk2'
);

DELETE FROM "VerificationToken" WHERE "userId" IN (
  'cmod5tyqt0000ks50h13nhbxo',
  'cmordzcns0000ksi1exweqlor',
  'cmore008i0001ksi19i8luenb',
  'cmore43q60002ksi1eea0gjhu',
  'cmorgjlzm0000ksor95n5zkk2'
);

DELETE FROM "User" WHERE id IN (
  'cmod5tyqt0000ks50h13nhbxo',
  'cmordzcns0000ksi1exweqlor',
  'cmore008i0001ksi19i8luenb',
  'cmore43q60002ksi1eea0gjhu',
  'cmorgjlzm0000ksor95n5zkk2'
);

COMMIT;
