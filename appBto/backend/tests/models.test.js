const { 
  TourApplication, 
  Schedule, 
  Guide, 
  School, 
  Visitor 
} = require('../src/models');
const { setupTestDb, clearTestDb } = require('./helpers');

describe('Model Relationships', () => {
  beforeEach(async () => {
    await clearTestDb();
  });

  beforeAll(async () => {
    await setupTestDb();
  });

  afterAll(async () => {
    await clearTestDb();
  });

  test('Visitor can create tour application', async () => {
    // Create test data
    const visitor = await Visitor.create({
      email: 'test@example.com',
      phone_number: '1234567890'
    });

    const school = await School.create({
      name: 'Test School',
      city: 'Test City',
      priority: 1
    });

    const application = await TourApplication.create({
      applicant_id: visitor.id,
      institution_id: school.id,
      preferred_dates: [new Date('2024-03-01')],
      status: 'PENDING',
      confirmation_code: 'TEST123'
    });

    // Test relationships
    const foundApplication = await TourApplication.findOne({
      where: { id: application.id },
      include: [
        { model: Visitor, as: 'applicantVisitor-test' },
        { model: School, as: 'institution-test' }
      ]
    });

    expect(foundApplication.applicant.id).toBe(visitor.id);
    expect(foundApplication.institution.id).toBe(school.id);
  });

  test('Schedule can be created for tour application', async () => {
    // Create prerequisites
    const visitor = await Visitor.create({
      email: 'guide@test.com',
      phone_number: '0987654321'
    });

    const school = await School.create({
      name: 'Another School',
      city: 'Another City',
      priority: 2
    });

    const guide = await Guide.create({
      status: 'ACTIVE',
      availability: true
    });

    // Create prerequisite applications first
    const applications = await Promise.all([
      TourApplication.create({
        applicant_id: visitor.id,
        institution_id: school.id,
        preferred_dates: [new Date('2024-03-01')],
        status: 'PENDING',
        confirmation_code: 'TEST124'
      }),
      TourApplication.create({
        applicant_id: visitor.id,
        institution_id: school.id,
        preferred_dates: [new Date('2024-03-02')],
        status: 'PENDING',
        confirmation_code: 'TEST125'
      })
    ]);

    // Then use real application IDs
    const schedules = await Promise.all([
      Schedule.create({
        tour_application_id: applications[0].id,  // Use real ID
        guide_id: guide.id,
        scheduled_date: new Date('2024-03-01'),
        start_time: '09:00:00',
        end_time: '10:30:00',
        status: 'PENDING'
      }),
      Schedule.create({
        tour_application_id: applications[1].id,  // Use real ID
        guide_id: guide.id,
        scheduled_date: new Date('2024-03-02'),
        start_time: '09:00:00',
        end_time: '10:30:00'
      })
    ]);

    // Test relationships
    const foundSchedule = await Schedule.findOne({
      where: { id: schedules[0].id },
      include: [
        { model: TourApplication },
        { model: Guide }
      ]
    });

    expect(foundSchedule.TourApplication.id).toBe(applications[0].id);
    expect(foundSchedule.Guide.id).toBe(guide.id);
  });

  test('Guide can have multiple schedules', async () => {
    // Create prerequisites
    const visitor = await Visitor.create({
      email: 'test@example.com',
      phone_number: '1234567890'
    });

    const school = await School.create({
      name: 'Test School',
      city: 'Test City',
      priority: 1
    });

    const guide = await Guide.create({
      status: 'ACTIVE',
      availability: true
    });

    // Create tour applications first
    const applications = await Promise.all([
      TourApplication.create({
        applicant_id: visitor.id,
        institution_id: school.id,
        preferred_dates: [new Date('2024-03-01')],
        status: 'PENDING',
        confirmation_code: 'TEST126'
      }),
      TourApplication.create({
        applicant_id: visitor.id,
        institution_id: school.id,
        preferred_dates: [new Date('2024-03-02')],
        status: 'PENDING',
        confirmation_code: 'TEST127'
      })
    ]);

    // Create schedules with valid tour_application_ids
    const schedules = await Promise.all([
      Schedule.create({
        tour_application_id: applications[0].id,
        guide_id: guide.id,
        scheduled_date: new Date('2024-03-01'),
        start_time: '09:00:00',
        end_time: '10:30:00',
        status: 'PENDING'
      }),
      Schedule.create({
        tour_application_id: applications[1].id,
        guide_id: guide.id,
        scheduled_date: new Date('2024-03-02'),
        start_time: '09:00:00',
        end_time: '10:30:00',
        status: 'PENDING'
      })
    ]);

    const guideWithSchedules = await Guide.findOne({
      where: { id: guide.id },
      include: [{ model: Schedule }]
    });

    expect(guideWithSchedules.Schedules).toHaveLength(2);
  });

  test('School priority affects tour application order', async () => {
    // Create schools with different priorities
    const highPrioritySchool = await School.create({
      name: 'High Priority School',
      city: 'City A',
      priority: 1
    });

    const lowPrioritySchool = await School.create({
      name: 'Low Priority School',
      city: 'City B',
      priority: 2
    });

    // Get schools ordered by priority
    const schools = await School.findAll({
      order: [['priority', 'ASC']]
    });

    // Debug log
    console.log('Schools:', schools.map(s => ({
      name: s.name,
      priority: s.priority
    })));

    // Test priority order
    expect(schools[0].name).toBe('High Priority School');
    expect(schools[0].priority).toBe(1);
    expect(schools[1].name).toBe('Low Priority School');
    expect(schools[1].priority).toBe(2);
  });
}); 