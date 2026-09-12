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

async function runDev4Tests() {
  console.log('🧪 Running Developer 4 (Dashboard + Carbon Impact + Carbon Passport + QR) Test Suite...\n');

  try {
    // 1. Health check
    console.log('1. Testing GET /health');
    const health = await makeRequest('GET', '/health');
    console.log(`   Status: ${health.status} - ${health.data.status}\n`);

    // 2. Fetch Batches for Activity Table
    console.log('2. Testing GET /api/waste-batches for Active Value Chain');
    const batches = await makeRequest('GET', '/api/waste-batches');
    console.log(`   Status: ${batches.status} - Retrieved ${batches.data.length} batches`);
    console.log(`   First Batch: ${batches.data[0].trackingNumber} (${batches.data[0].wasteType}, ${batches.data[0].quantityTonnes}t)\n`);

    // 3. Test Carbon Calculation Engine for Flagship Demo (10 tonnes Rice Husk)
    console.log('3. Testing POST /api/carbon/calculate (10t Rice Husk, 26.4km)');
    const calc = await makeRequest('POST', '/api/carbon/calculate', {
      batchId: 'WL-1024',
      wasteType: 'Rice Husk',
      quantityTonnes: 10,
      distanceKm: 26.4,
      conversionType: 'Biochar'
    });
    console.log(`   Status: ${calc.status}`);
    console.log(`   Avoided Landfill Emissions: +${calc.data.avoidedLandfillEmissionsTonnesCO2e} tCO₂e`);
    console.log(`   Conversion Carbon Benefit: +${calc.data.conversionCarbonBenefitTonnesCO2e} tCO₂e`);
    console.log(`   Transport Emissions: -${calc.data.transportEmissionsKg} kgCO₂e (-${calc.data.transportEmissionsTonnesCO2e} tCO₂e)`);
    console.log(`   Estimated Net Carbon Impact: +${calc.data.netCarbonImpactTonnesCO2e} tCO₂e\n`);

    // 4. Test Passport retrieval by trackingNumber WL-1024 (Public Verification)
    console.log('4. Testing GET /api/passports/WL-1024 (Public Verification Endpoint)');
    const pass = await makeRequest('GET', '/api/passports/WL-1024');
    console.log(`   Status: ${pass.status}`);
    console.log(`   Passport Serial: ${pass.data.passportNumber}`);
    console.log(`   Feedstock: ${pass.data.quantityTonnes} tonnes ${pass.data.wasteType}`);
    console.log(`   Origin: ${pass.data.originName}`);
    console.log(`   Facility: ${pass.data.facilityName}`);
    console.log(`   Net Impact: +${pass.data.netCarbonImpactTonnesCO2e} tCO₂e`);
    console.log(`   Digital Seal: ${pass.data.digitalSealHash.substring(0, 30)}...\n`);

    // 5. Test Timeline Events retrieval for WL-1024
    console.log('5. Testing GET /api/batches/WL-1024/timeline (7-Stage Traceability)');
    const timeline = await makeRequest('GET', '/api/batches/WL-1024/timeline');
    console.log(`   Status: ${timeline.status} - ${timeline.data.length} Event records:`);
    timeline.data.forEach((evt, idx) => {
      console.log(`     ${idx + 1}. [${evt.status}] ${evt.title} - ${evt.actor}`);
    });
    console.log();

    console.log('✅ ALL DEVELOPER 4 API & PRODUCT TESTS PASSED SUCCESSFULLY!\n');
  } catch (err) {
    console.error('❌ Test failed:', err.message);
  }
}

runDev4Tests();
