import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🗺️ Starting Developer 3 (GIS + Route Optimization + Logistics) Test Suite...\n');

  // 1. POST /api/routes/optimize for Flagship Route (Ahmedabad APMC -> Sanand Biochar Plant A)
  console.log('1. Testing POST /api/routes/optimize for Flagship Ahmedabad -> Sanand Corridor');
  const resOptimize = await fetch(`${BASE_URL}/routes/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      batchId: 'WL-1024',
      origin: {
        lat: 23.0225,
        lng: 72.5714,
        address: 'APMC Market Yard, Vasna Road',
        city: 'Ahmedabad',
        state: 'Gujarat'
      },
      destination: {
        lat: 22.9858,
        lng: 72.3812,
        address: 'Plot 42-B, GIDC Sanand Phase II',
        city: 'Sanand',
        state: 'Gujarat'
      },
      vehicleType: 'CNG Medium Carrier',
      weightTonnes: 10
    })
  });

  assert.strictEqual(resOptimize.status, 200, 'Optimize route should return 200');
  const routeData = await resOptimize.json();

  assert(routeData.id, 'Response must have an id');
  assert.strictEqual(routeData.distanceKm, 26.4, 'Flagship route distance should be 26.4 km');
  assert.strictEqual(routeData.estimatedCost, 2140, 'Flagship route cost should be ₹2,140');
  assert.strictEqual(routeData.transportEmissionsKgCO2e, 6.2, 'Flagship emissions should be 6.2 kgCO2e');
  assert(routeData.recommendedRoute, 'Response must have recommendedRoute');
  assert(routeData.alternativeRoute, 'Response must have alternativeRoute');
  assert(routeData.comparison, 'Response must have comparison');
  assert(Array.isArray(routeData.polylineCoordinates), 'Response must have polylineCoordinates array');
  assert(routeData.polylineCoordinates.length > 5, 'Polyline should have multiple coordinates for curvature');

  console.log(`   ✅ Optimized Route ID: ${routeData.id}`);
  console.log(`   ✅ Recommended Corridor: ${routeData.recommendedRoute.name} (${routeData.recommendedRoute.distanceKm} km, ₹${routeData.recommendedRoute.estimatedCost}, ${routeData.recommendedRoute.transportEmissionsKgCO2e} kgCO₂e, Eco-Score: ${routeData.recommendedRoute.routeScore})`);
  console.log(`   ✅ Alternative Corridor:   ${routeData.alternativeRoute.name} (${routeData.alternativeRoute.distanceKm} km, ₹${routeData.alternativeRoute.estimatedCost}, ${routeData.alternativeRoute.transportEmissionsKgCO2e} kgCO₂e, Eco-Score: ${routeData.alternativeRoute.routeScore})`);
  console.log(`   ✅ Delta Savings: -${routeData.comparison.distanceDeltaKm} km | -₹${routeData.comparison.costDeltaINR} | -${routeData.comparison.emissionsDeltaKgCO2e} kgCO₂e`);

  // 2. GET /api/routes/:id
  console.log('\n2. Testing GET /api/routes/:id');
  const resGetRoute = await fetch(`${BASE_URL}/routes/${routeData.id}`);
  assert.strictEqual(resGetRoute.status, 200, 'GET route by id should return 200');
  const fetchedRoute = await resGetRoute.json();
  assert.strictEqual(fetchedRoute.id, routeData.id, 'Fetched route ID should match');
  console.log(`   ✅ Route retrieved from memory/cache successfully.`);

  // 3. Vehicle emission factor check: Electric Truck vs Diesel 10T Lorry
  console.log('\n3. Testing Vehicle Emission Factors: Electric vs Diesel');
  const resEV = await fetch(`${BASE_URL}/routes/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      origin: { lat: 23.0225, lng: 72.5714, address: 'Ahmedabad', city: 'Ahmedabad', state: 'Gujarat' },
      destination: { lat: 22.9858, lng: 72.3812, address: 'Sanand', city: 'Sanand', state: 'Gujarat' },
      vehicleType: 'Electric Heavy Truck'
    })
  });
  const dataEV = await resEV.json();
  assert(dataEV.transportEmissionsKgCO2e < 2.0, `EV emissions should be very low (${dataEV.transportEmissionsKgCO2e} kgCO2e)`);
  console.log(`   ✅ Electric Heavy Truck emissions over 26.4 km: ${dataEV.transportEmissionsKgCO2e} kgCO₂e (vs 6.2 kg CNG)`);

  // 4. Geocoding Service: GET /api/geocode/search
  console.log('\n4. Testing GET /api/geocode/search for Gujarat hubs');
  const resGeo = await fetch(`${BASE_URL}/geocode/search?q=Vadodara`);
  assert.strictEqual(resGeo.status, 200, 'Geocode search should return 200');
  const geo = await resGeo.json();
  assert(geo.lat && geo.lng, 'Geocoded location must have lat and lng');
  assert.strictEqual(geo.city, 'Vadodara', 'City should be Vadodara');
  console.log(`   ✅ Geocoded '${geo.query}' -> ${geo.displayName} (Lat: ${geo.lat}, Lng: ${geo.lng})`);

  // 5. Failure / Edge cases
  console.log('\n5. Testing Edge Cases: Missing Origin / Destination');
  const resMissing = await fetch(`${BASE_URL}/routes/optimize`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ batchId: 'WL-1024' })
  });
  assert.strictEqual(resMissing.status, 400, 'Missing coordinates should return 400');
  console.log(`   ✅ Gracefully rejected missing origin/destination with 400 status.`);

  console.log('\n🎉 ALL DEVELOPER 3 GIS & LOGISTICS TEST CHECKS PASSED PERFECTLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
