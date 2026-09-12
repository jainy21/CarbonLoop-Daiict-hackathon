import assert from 'assert';

const BASE_URL = 'http://localhost:5000/api';

async function runTests() {
  console.log('🧪 Starting Developer 2 Automated Test Suite...\n');

  // 1. GET /api/facilities
  console.log('1. Testing GET /api/facilities');
  const resFacilities = await fetch(`${BASE_URL}/facilities`);
  assert.strictEqual(resFacilities.status, 200, 'Facilities endpoint should return 200');
  const facilities = await resFacilities.json();
  assert(Array.isArray(facilities), 'Facilities should be an array');
  assert(facilities.length >= 10, `Expected at least 10 facilities, found ${facilities.length}`);
  console.log(`   ✅ Retrieved ${facilities.length} Gujarat facilities successfully.`);

  // 2. GET /api/facilities/:id
  console.log('\n2. Testing GET /api/facilities/:id');
  const sampleFac = facilities[0];
  const resSingleFac = await fetch(`${BASE_URL}/facilities/${sampleFac.id}`);
  assert.strictEqual(resSingleFac.status, 200, 'Single facility endpoint should return 200');
  const facData = await resSingleFac.json();
  assert.strictEqual(facData.id, sampleFac.id, 'Facility ID should match');
  assert(facData.name, 'Facility should have a name');
  assert(facData.location, 'Facility should have a location');
  assert(facData.conversionType, 'Facility should have conversionType');
  assert(Array.isArray(facData.acceptedWasteTypes), 'Facility should have acceptedWasteTypes');
  assert(facData.monthlyCapacity !== undefined, 'Facility should have monthlyCapacity');
  assert(facData.currentUtilization !== undefined, 'Facility should have currentUtilization');
  assert(facData.conversionEfficiency !== undefined, 'Facility should have conversionEfficiency');
  assert(facData.carbonRetentionFactor !== undefined, 'Facility should have carbonRetentionFactor');
  console.log(`   ✅ Facility model verified for '${facData.name}'.`);

  // 3. POST /api/matching/recommend with batchId
  console.log('\n3. Testing POST /api/matching/recommend with batchId (WL-1024)');
  const resMatchBatch = await fetch(`${BASE_URL}/matching/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ batchId: 'WL-1024' })
  });
  assert.strictEqual(resMatchBatch.status, 200, 'Recommend with batchId should return 200');
  const matchResult = await resMatchBatch.json();
  assert(matchResult.recommendedFacility, 'Response must contain recommendedFacility');
  assert(typeof matchResult.matchScore === 'number', 'Response must contain numerical matchScore');
  assert(Array.isArray(matchResult.reasons), 'Response must contain reasons array');
  assert(matchResult.componentScores, 'Response must contain componentScores');
  assert(Array.isArray(matchResult.candidates), 'Response must contain candidates');
  console.log(`   ✅ Recommended Facility: ${matchResult.recommendedFacility.name}`);
  console.log(`   ✅ Generated Match Score: ${matchResult.matchScore}%`);
  console.log(`   ✅ Component Scores:`, matchResult.componentScores);
  console.log(`   ✅ Reasons:`, matchResult.reasons);

  // 4. POST /api/matching/recommend with raw payload
  console.log('\n4. Testing POST /api/matching/recommend with raw payload');
  const resMatchRaw = await fetch(`${BASE_URL}/matching/recommend`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wasteType: 'Sugarcane Bagasse',
      quantityTonnes: 25,
      origin: {
        lat: 22.3072,
        lng: 73.1812,
        address: 'GIDC Industrial Estate, Manjusar',
        city: 'Vadodara',
        state: 'Gujarat'
      },
      preferredConversion: 'Biogas'
    })
  });
  assert.strictEqual(resMatchRaw.status, 200, 'Raw recommend should return 200');
  const rawMatch = await resMatchRaw.json();
  assert(rawMatch.recommendedFacility, 'Raw recommend should find top facility');
  console.log(`   ✅ Raw Match Top Facility: ${rawMatch.recommendedFacility.name} (${rawMatch.matchScore}%)`);

  // 5. POST /api/carbon/calculate
  console.log('\n5. Testing POST /api/carbon/calculate (Mathematical Model)');
  const resCarbon = await fetch(`${BASE_URL}/carbon/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      batchId: 'WL-1024',
      wasteType: 'Rice Husk',
      quantityTonnes: 10,
      distanceKm: 26.4,
      conversionType: 'Biochar'
    })
  });
  assert.strictEqual(resCarbon.status, 200, 'Carbon calculate should return 200');
  const carbon = await resCarbon.json();
  assert(carbon.wasteQuantityTonnes === 10, 'wasteQuantityTonnes should be 10');
  assert(typeof carbon.avoidedLandfillEmissions === 'number', 'avoidedLandfillEmissions must be number');
  assert(typeof carbon.conversionCarbonBenefit === 'number', 'conversionCarbonBenefit must be number');
  assert(typeof carbon.transportEmissions === 'number', 'transportEmissions must be number');
  assert(typeof carbon.netCarbonImpact === 'number', 'netCarbonImpact must be number');
  assert.strictEqual(carbon.methodologyVersion, 'CarbonLoop-v2.0-Prototype', 'methodologyVersion must match');

  // Verify formula: Net Carbon = Avoided + Conversion - Transport
  const expectedNet = Math.round((carbon.avoidedLandfillEmissions + carbon.conversionCarbonBenefit - carbon.transportEmissions) * 10) / 10;
  assert.strictEqual(carbon.netCarbonImpact, expectedNet, `Net Carbon Impact should equal avoided + conversion - transport (${expectedNet})`);
  console.log(`   ✅ Avoided Landfill Emissions: +${carbon.avoidedLandfillEmissions} tCO₂e`);
  console.log(`   ✅ Conversion Carbon Benefit:  +${carbon.conversionCarbonBenefit} tCO₂e`);
  console.log(`   ✅ Transport Emissions:        -${carbon.transportEmissions} tCO₂e`);
  console.log(`   ✅ Net Carbon Impact:          +${carbon.netCarbonImpact} tCO₂e`);

  // 6. GET /api/carbon/:batchId
  console.log('\n6. Testing GET /api/carbon/:batchId');
  const resGetCarbon = await fetch(`${BASE_URL}/carbon/WL-1024`);
  assert.strictEqual(resGetCarbon.status, 200, 'GET /api/carbon/:batchId should return 200');
  const savedCarbon = await resGetCarbon.json();
  assert(['WL-1024', 'batch-wl-1024'].includes(savedCarbon.batchId), 'Batch ID in carbon ledger should match');
  console.log(`   ✅ Carbon ledger retrieved successfully for batch.`);

  // 7. Edge Case: Invalid quantity <= 0
  console.log('\n7. Testing Edge Cases: Invalid quantity');
  const resInvalidQty = await fetch(`${BASE_URL}/carbon/calculate`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      wasteType: 'Rice Husk',
      quantityTonnes: -5
    })
  });
  assert.strictEqual(resInvalidQty.status, 400, 'Invalid quantity should return 400 Bad Request');
  console.log(`   ✅ Handled negative quantity gracefully with 400 status.`);

  // 8. Edge Case: Non-existent facility ID
  console.log('\n8. Testing Edge Cases: Non-existent facility ID');
  const resNotFoundFac = await fetch(`${BASE_URL}/facilities/non-existent-id-999`);
  assert.strictEqual(resNotFoundFac.status, 404, 'Non-existent facility should return 404');
  console.log(`   ✅ Handled non-existent facility gracefully with 404 status.`);

  console.log('\n🎉 ALL DEVELOPER 2 TEST SUITE CHECKS PASSED PERFECTLY!\n');
}

runTests().catch((err) => {
  console.error('❌ Test failed:', err);
  process.exit(1);
});
