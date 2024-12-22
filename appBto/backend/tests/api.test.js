const request = require('supertest');
const app = require('../src/server');
const { testData } = require('./testData');
const { setupTestDb, clearTestDb } = require('./helpers');
const { Guide } = require('../src/models');

describe('Tour Management API', () => {
  let server;
  let visitorId, schoolId;

  beforeAll(async () => {
    await setupTestDb();
    // Create a test guide
    await Guide.create({
      status: 'ACTIVE',
      availability: true
    });
    server = app.listen(5001);
  });

  afterAll(async () => {
    await clearTestDb();
    if (server) {
      await new Promise((resolve) => server.close(resolve));
    }
  });

  test('Create visitor', async () => {
    const res = await request(server)
      .post('/api/visitors')
      .send(testData.visitor);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    visitorId = res.body.id;
  });

  test('Create school', async () => {
    const res = await request(server)
      .post('/api/school')
      .send(testData.school);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('id');
    schoolId = res.body.id;
  });

  test('Create tour application', async () => {
    const applicationData = {
      ...testData.tourApplication,
      applicant_id: visitorId,
      institution_id: schoolId
    };

    const res = await request(server)
      .post('/api/tour-applications')
      .send(applicationData);
    
    expect(res.status).toBe(201);
    expect(res.body).toHaveProperty('confirmation_code');
  });

  test('Schedule tour', async () => {
    const res = await request(server)
      .post('/api/schedules/auto-schedule');
    
    expect(res.status).toBe(200);
    expect(res.body).toHaveProperty('scheduledTours');
  });
}); 