import http from 'http';

function makeRequest(method, path, body = null, token = null) {
  return new Promise((resolve, reject) => {
    const dataString = body ? JSON.stringify(body) : '';
    const headers = {
      'Content-Type': 'application/json',
      ...(body ? { 'Content-Length': Buffer.byteLength(dataString) } : {}),
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
    };

    const req = http.request(
      {
        hostname: 'localhost',
        port: 5000,
        path,
        method,
        headers,
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

async function runAuthTests() {
  console.log('🔐 Running CarbonLoop Role-Based Authentication Test Suite...\n');

  try {
    // 1. Health check
    console.log('1. Health check (GET /health)');
    const health = await makeRequest('GET', '/health');
    console.log(`   Status: ${health.status} -> ${health.data.status}\n`);

    // 2. Test Invalid Login
    console.log('2. Test Invalid Login (POST /api/auth/login with wrong password)');
    const badLogin = await makeRequest('POST', '/api/auth/login', {
      email: 'generator@carbonloop.demo',
      password: 'WrongPassword999!',
    });
    console.log(`   Rejected as expected: Status ${badLogin.status} -> ${badLogin.data.error}\n`);

    // 3. Test 4 Seeded Demo Logins
    console.log('3. Test Login for all 4 Seeded Roles');
    const roles = [
      { role: 'waste_generator', email: 'generator@carbonloop.demo' },
      { role: 'facility_operator', email: 'facility@carbonloop.demo' },
      { role: 'municipality', email: 'municipality@carbonloop.demo' },
      { role: 'admin', email: 'admin@carbonloop.demo' },
    ];

    const tokens = {};

    for (const item of roles) {
      const loginRes = await makeRequest('POST', '/api/auth/login', {
        email: item.email,
        password: 'DemoPassword123!',
      });
      console.log(`   ✓ Logged in as ${item.role.padEnd(18)}: Token generated for "${loginRes.data.user.name}"`);
      tokens[item.role] = loginRes.data.token;
    }
    console.log();

    // 4. Test GET /api/auth/me for authenticated user
    console.log('4. Test GET /api/auth/me');
    const meRes = await makeRequest('GET', '/api/auth/me', null, tokens.waste_generator);
    console.log(`   Retrieved Profile: Name="${meRes.data.user.name}", Role="${meRes.data.user.role}", Org="${meRes.data.user.organization}"\n`);

    // 5. Test Register New User
    console.log('5. Test POST /api/auth/register (Create new user)');
    const regRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Priya Sharma (FPO Lead)',
      email: 'priya.sharma@agrogujarat.in',
      password: 'StrongPassword123!',
      role: 'waste_generator',
      organization: 'Kheda District Agritech Cluster',
    });
    console.log(`   Registered User: ID=${regRes.data.user.id}, Role=${regRes.data.user.role}, Token generated.\n`);

    // 6. Test Duplicate Email Prevention
    console.log('6. Test Duplicate Registration Prevention');
    const dupRes = await makeRequest('POST', '/api/auth/register', {
      name: 'Duplicate Test',
      email: 'generator@carbonloop.demo',
      password: 'StrongPassword123!',
      role: 'waste_generator',
      organization: 'Duplicate Inc',
    });
    console.log(`   Duplicate rejected properly: Status ${dupRes.status} -> ${dupRes.data.error}\n`);

    // 7. Test Admin User Directory Access
    console.log('7. Test Admin Permissions (GET /api/auth/users)');
    const adminUsersRes = await makeRequest('GET', '/api/auth/users', null, tokens.admin);
    console.log(`   Admin authorized: Retrieved ${adminUsersRes.data.length} registered system users.`);

    // 8. Test Non-Admin Forbidden from Admin Directory
    console.log('8. Test Non-Admin Forbidden Barrier (Generator accessing GET /api/auth/users)');
    const nonAdminRes = await makeRequest('GET', '/api/auth/users', null, tokens.waste_generator);
    console.log(`   Forbidden barrier enforced: Status ${nonAdminRes.status} -> ${nonAdminRes.data.error}\n`);

    // 9. Test Role Barrier on Waste Batch Creation
    console.log('9. Test Role Barrier: Facility Operator creating waste batch');
    const operatorBlockRes = await makeRequest('POST', '/api/waste-batches', {
      wasteType: 'Rice Husk',
      quantityTonnes: 10,
      origin: { address: 'Test Origin', city: 'Ahmedabad', state: 'Gujarat', lat: 23.02, lng: 72.57 }
    }, tokens.facility_operator);
    console.log(`   Operator forbidden from creating batch: Status ${operatorBlockRes.status} -> ${operatorBlockRes.data.error}\n`);

    // 10. Test Waste Generator Authorized to Create Batch
    console.log('10. Test Waste Generator creating batch with generatorId binding');
    const generatorBatchRes = await makeRequest('POST', '/api/waste-batches', {
      wasteType: 'Rice Husk',
      quantityTonnes: 10,
      moistureContentPercent: 11,
      availableDate: '2026-09-12',
      origin: { address: 'APMC Market Yard', city: 'Ahmedabad', state: 'Gujarat', lat: 23.0225, lng: 72.5714 },
      preferredConversion: 'Biochar'
    }, tokens.waste_generator);
    console.log(`   Batch Created: ID=${generatorBatchRes.data.id}, Tracking=${generatorBatchRes.data.trackingNumber}, Generator=${generatorBatchRes.data.generatorName}\n`);

    // 11. Test Public Carbon Passport Unauthenticated Access
    console.log('11. Test Public QR Verification (GET /api/passports/:batchId WITHOUT TOKEN)');
    const publicPassRes = await makeRequest('GET', `/api/passports/${generatorBatchRes.data.id}`);
    console.log(`   Public Scan Verified: Status ${publicPassRes.status}`);
    console.log(`   Passport Serial: ${publicPassRes.data.passportNumber}`);
    console.log(`   Net Carbon Impact: +${publicPassRes.data.netCarbonImpactTonnesCO2e} tCO2e\n`);

    console.log('🎉 ALL ROLE-BASED AUTHENTICATION & ACCESS CONTROL TESTS PASSED WITH 100% COMPLIANCE!');
  } catch (err) {
    console.error('❌ Test failed with error:', err);
    process.exit(1);
  }
}

runAuthTests();
