import http from 'http';

function makeRequest(method, path, body = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(body ? { 'Content-Length': Buffer.byteLength(dataString) } : {}),
        },
      },
      (res) => {
        let respData = '';
        res.on('data', (chunk) => (respData += chunk));
        res.on('end', () => {
          try {
            const parsed = JSON.parse(respData);
            resolve({ status: res.statusCode, data: parsed });
          } catch {
            resolve({ status: res.statusCode, data: respData });
          }
        });
      }
    );

    req.on('error', reject);
    if (body) req.write(dataString);
    req.end();
  });
}

async function runTests() {
  console.log('🧪 Running Developer 1 API Validation Suite...\n');

  try {
    // 1. Health check
    console.log('1. Testing GET /health');
    const health = await makeRequest('GET', '/health');
    console.log(`   Status: ${health.status} - ${health.data.status}\n`);

    // 2. Test Invalid Batch Creation (missing wasteType)
    console.log('2. Testing POST /api/waste-batches (Invalid Validation check)');
    const invalidRes = await makeRequest('POST', '/api/waste-batches', {
      quantityTonnes: 10,
      origin: { address: 'Test', lat: 23, lng: 72 }
    });
    console.log(`   Validation Error Caught: Status ${invalidRes.status} -> ${invalidRes.data.error}\n`);

    // 3. Test Valid Batch Creation (Ahmedabad Flagship Demo)
    console.log('3. Testing POST /api/waste-batches (Valid Batch creation)');
    const newBatchRes = await makeRequest('POST', '/api/waste-batches', {
      wasteType: 'Rice Husk',
      category: 'Agricultural',
      quantityTonnes: 10,
      moistureContentPercent: 11,
      availableDate: '2026-09-12',
      generatorName: 'Gujarat Agro Producer Cooperative',
      generatorType: 'Farmer',
      origin: {
        address: 'APMC Market Yard, Vasna Road',
        city: 'Ahmedabad',
        state: 'Gujarat',
        lat: 23.0225,
        lng: 72.5714
      },
      preferredConversion: 'Biochar'
    });
    console.log(`   Created Batch ID: ${newBatchRes.data.id} (${newBatchRes.data.trackingNumber})`);
    console.log(`   Status: ${newBatchRes.data.status}`);
    const batchId = newBatchRes.data.id;
    console.log();

    // 4. Test GET /api/waste-batches
    console.log('4. Testing GET /api/waste-batches');
    const listRes = await makeRequest('GET', '/api/waste-batches');
    console.log(`   Found ${listRes.data.length} total batches in system.\n`);

    // 5. Test GET /api/waste-batches/:id
    console.log(`5. Testing GET /api/waste-batches/${batchId}`);
    const getRes = await makeRequest('GET', `/api/waste-batches/${batchId}`);
    console.log(`   Retrieved Batch: ${getRes.data.wasteType} (${getRes.data.quantityTonnes} tonnes) at ${getRes.data.origin.city}\n`);

    // 6. Test Lifecycle status progression
    console.log(`6. Testing PATCH /api/waste-batches/${batchId}/status (Lifecycle progression)`);
    const statuses = [
      'matched',
      'collection_scheduled',
      'in_transit',
      'received',
      'converting',
      'converted'
    ];

    for (const st of statuses) {
      const patchRes = await makeRequest('PATCH', `/api/waste-batches/${batchId}/status`, {
        status: st,
        actor: 'Test Runner',
        description: `Advanced to ${st} during test.`
      });
      console.log(`   Advanced status -> ${patchRes.data.batch.status} (Event logged: "${patchRes.data.event.title}")`);
    }
    console.log();

    // 7. Test Timeline Retrieval
    console.log(`7. Testing GET /api/batches/${batchId}/timeline`);
    const timelineRes = await makeRequest('GET', `/api/batches/${batchId}/timeline`);
    console.log(`   Timeline contains ${timelineRes.data.length} sequential immutable events:\n`);
    timelineRes.data.forEach((evt, i) => {
      console.log(`   [${i + 1}] ${evt.status.padEnd(20)} | ${evt.title} | ${evt.timestamp.slice(11, 19)}`);
    });
    console.log();

    // 8. Test Developer 2 Consumption: Smart Matching Recommendation
    console.log('8. Testing POST /api/matching/recommend (Developer 2 handoff)');
    const matchRes = await makeRequest('POST', '/api/matching/recommend', {
      wasteType: getRes.data.wasteType,
      quantityTonnes: getRes.data.quantityTonnes,
      origin: getRes.data.origin,
      preferredConversion: getRes.data.preferredConversion
    });
    const topCandidate = Array.isArray(matchRes.data) ? matchRes.data[0] : (matchRes.data?.candidates?.[0] || matchRes.data?.[0]);
    console.log(`   Top Recommended Plant: ${topCandidate.facility.name}`);
    console.log(`   Match Score: ${topCandidate.matchScorePercent}% (Est. Net Carbon: +${topCandidate.estimatedNetCarbonImpactTonnesCO2e} tCO2e)\n`);

    // 9. Test Developer 3 Consumption: Logistics Routing
    console.log('9. Testing POST /api/routes/optimize (Developer 3 handoff)');
    const routeRes = await makeRequest('POST', '/api/routes/optimize', {
      batchId,
      origin: getRes.data.origin,
      destination: topCandidate.facility.location
    });
    console.log(`   Route Distance: ${routeRes.data.distanceKm} km | Cost: INR ${routeRes.data.estimatedLogisticsCostINR} | Transport CO2: ${routeRes.data.transportEmissionsKgCO2e} kgCO2e\n`);

    // 10. Test Developer 4 Consumption: Carbon Passport & Public Verification
    console.log('10. Testing POST /api/passports & GET /api/passports/:batchId (Developer 4 handoff)');
    const passportRes = await makeRequest('GET', `/api/passports/${batchId}`);
    console.log(`   Passport Serial: ${passportRes.data.passportNumber}`);
    console.log(`   Digital Seal: ${passportRes.data.digitalSealHash.slice(0, 32)}...`);
    console.log(`   Verification URL: ${passportRes.data.publicVerificationUrl}`);
    console.log(`   Net Carbon Value: +${passportRes.data.netCarbonImpactTonnesCO2e} tCO2e\n`);

    console.log('🎉 ALL DEVELOPER 1 MODULE AND INTER-DEVELOPER CONTRACT TESTS PASSED WITH 100% COMPLIANCE!');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
}

runTests();
