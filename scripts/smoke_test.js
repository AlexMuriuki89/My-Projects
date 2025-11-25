const http = require('http');

function req(method, path, data) {
  const options = {
    hostname: 'localhost',
    port: 3000,
    path,
    method,
    headers: {
      'Content-Type': 'application/json',
    },
    timeout: 5000,
  };

  return new Promise((resolve, reject) => {
    const r = http.request(options, (res) => {
      let chunks = '';
      res.on('data', (c) => (chunks += c));
      res.on('end', () => {
        const text = chunks.toString();
        try {
          const json = JSON.parse(text || '{}');
          resolve({ statusCode: res.statusCode, body: json });
        } catch (e) {
          resolve({ statusCode: res.statusCode, body: text });
        }
      });
    });
    r.on('error', reject);
    if (data) r.write(JSON.stringify(data));
    r.end();
  });
}

(async () => {
  try {
    console.log('Creating department...');
    const deptPayload = {
      name: 'Engineering',
      icon: '💻',
      description: 'Software Engineering Department',
    };
    const createResp = await req('POST', '/departments', deptPayload);
    console.log('POST /departments ->', createResp.statusCode);
    console.log(JSON.stringify(createResp.body, null, 2));

    const deptId =
      createResp.body && createResp.body.id
        ? createResp.body.id
        : (Array.isArray(createResp.body) &&
            createResp.body[0] &&
            createResp.body[0].id) ||
          null;

    console.log('\nFetching departments...');
    const listResp = await req('GET', '/departments');
    console.log('GET /departments ->', listResp.statusCode);
    console.log(JSON.stringify(listResp.body, null, 2));

    if (!deptId && Array.isArray(listResp.body) && listResp.body.length) {
      // pick first
      console.log('No dept id from POST, picking first from list');
      deptId = listResp.body[0].id;
    }

    if (!deptId) {
      console.error('No department id available; aborting task creation.');
      process.exit(1);
    }

    console.log('\nCreating task...');
    const taskPayload = {
      title: 'Implement API',
      description: 'Implement REST API endpoints',
      status: 'pending',
      category: 'critical',
      priority: 'high',
      deadline: '2025-12-31T23:59:59Z',
      departmentId: deptId,
    };

    const taskResp = await req('POST', '/tasks', taskPayload);
    console.log('POST /tasks ->', taskResp.statusCode);
    console.log(JSON.stringify(taskResp.body, null, 2));

    console.log('\nFetching tasks...');
    const tasksList = await req('GET', '/tasks');
    console.log('GET /tasks ->', tasksList.statusCode);
    console.log(JSON.stringify(tasksList.body, null, 2));

    console.log('\nSmoke test complete.');
  } catch (err) {
    console.error('Smoke test failed:', err && err.message ? err.message : err);
    process.exit(2);
  }
})();
