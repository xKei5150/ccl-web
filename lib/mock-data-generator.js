import { faker } from '@faker-js/faker/locale/es';
import {payload} from '@/lib/payload';
import { headers } from 'next/headers';

export async function generateMockData(count = 50) {
  try {
    // Generate Personal Information first
    const personalInfoIds = await generatePersonalInformation(count);
    
    // Generate Users with relation to Personal Information
    const userIds = await generateUsers(count, personalInfoIds);
    
    // Generate Posts
    await generatePosts(count, userIds);
    
    // Generate Households
    await generateHouseholds(Math.floor(count / 3), personalInfoIds);
    
    // Generate Businesses
    await generateBusinesses(count);
    
    // Generate Reports
    await generateReports(count);
    
    // Generate Requests
    await generateRequests(count, personalInfoIds);
    
    return { success: true, message: 'Mock data generated successfully' };
  } catch (error) {
    console.error('Error generating mock data:', error);
    return { success: false, error: error.message };
  }
}

async function generatePersonalInformation(count) {
  const generatedIds = [];
  
  for (let i = 0; i < count; i++) {
    const sex = faker.person.sex();
    const firstName = faker.person.firstName(sex);
    const lastName = faker.person.lastName();
    const middleName = faker.person.firstName();

    const person = await payload.create({
      collection: 'personal-information',
      data: {
        name: {
          firstName,
          middleName,
          lastName,
        },
        contact: {
          emailAddress: faker.internet.email({ firstName, lastName }),
          localAddress: faker.location.streetAddress(true),
        },
        demographics: {
          sex: sex === 'male' ? 'male' : 'female',
          birthDate: faker.date.birthdate(),
          maritalStatus: faker.helpers.arrayElement(['single', 'married', 'divorced', 'widowed']),
        },
        status: {
          residencyStatus: faker.helpers.arrayElement(['renting', 'own-mortgage', 'own-outright']),
          lifeStatus: 'alive',
        },
      },
    });

    generatedIds.push(person.id);
  }

  return generatedIds;
}

async function generateUsers(count, personalInfoIds) {
  const generatedUserIds = [];
  for (let i = 0; i < count; i++) {
    const user = await payload.create({
      collection: 'users',
      data: {
        email: faker.internet.email(),
        password: 'Password123!',
        role: faker.helpers.arrayElement(['admin', 'staff', 'citizen']),
        personalInfo: faker.helpers.arrayElement(personalInfoIds),
        isActive: 'active',
      },
    });
    generatedUserIds.push(user.id);
  }
  return generatedUserIds;
}

async function generatePosts(count, userIds) {
  for (let i = 0; i < count; i++) {
    const publishedDate = faker.date.recent();
    const title = faker.lorem.sentence();
    
    await payload.create({
      collection: 'posts',
      data: {
        title,
        author: faker.helpers.arrayElement(userIds),
        content: faker.lorem.paragraphs(3),
        publishedDate: publishedDate.toISOString(),
        status: faker.helpers.arrayElement(['draft', 'published']),
      },
    });
  }
}

async function generateHouseholds(count, personalInfoIds) {
  for (let i = 0; i < count; i++) {
    const memberCount = faker.number.int({ min: 1, max: 6 });
    const members = Array.from({ length: memberCount }, () => ({
      member: faker.helpers.arrayElement(personalInfoIds),
    }));

    await payload.create({
      collection: 'households',
      data: {
        familyName: faker.person.lastName(),
        members,
        localAddress: faker.location.streetAddress(true),
        status: 'active',
        residencyDate: faker.date.past(),
      },
    });
  }
}

async function generateBusinesses(count) {
  for (let i = 0; i < count; i++) {
    const business = await payload.create({
      collection: 'business',
      data: {
        businessName: faker.company.name(),
        address: faker.location.streetAddress(true),
        registrationDate: faker.date.past(),
        typeOfOwnership: faker.helpers.arrayElement([
          'sole proprietorship',
          'partnership',
          'corporation',
          'llc',
        ]),
        owners: [{ ownerName: faker.person.fullName() }],
        businessContactNo: faker.phone.number(),
        businessEmailAddress: faker.internet.email(),
        status: faker.helpers.arrayElement(['active', 'inactive', 'pending']),
      },
    });

    // Generate a business permit for each active business
    if (business.status === 'active') {
      await payload.create({
        collection: 'business-permits',
        data: {
          business: business.id,
          validity: faker.date.future(),
          officialReceiptNo: faker.string.alphanumeric(8).toUpperCase(),
          issuedTo: business.owners[0].ownerName,
          amount: faker.number.float({ min: 1000, max: 10000, precision: 2 }),
          paymentDate: faker.date.recent(),
          status: 'approved',
        },
      });
    }
  }
}

async function generateReports(count) {
    const headerList = await headers();
    const { user } = await payload.auth({ headers: headerList });
  for (let i = 0; i < count; i++) {
    await payload.create({
      collection: 'reports',
      data: {
        title: faker.lorem.sentence(),
        date: faker.date.recent(),
        description: faker.lorem.paragraphs(2),
        location: faker.location.streetAddress(),
        involvedPersons: [
          {
            name: faker.person.fullName(),
            role: faker.helpers.arrayElement(['complainant', 'respondent', 'witness']),
            statement: faker.lorem.paragraph(),
          },
        ],
        reportStatus: faker.helpers.arrayElement(['open', 'inProgress', 'closed']),
        submittedBy: user.id,
      },
    });
  }
}

async function generateRequests(count, personalInfoIds) {
  for (let i = 0; i < count; i++) {
    await payload.create({
      collection: 'requests',
      data: {
        type: faker.helpers.arrayElement([
          'indigencyCertificate',
          'barangayClearance',
          'barangayResidency',
        ]),
        person: faker.helpers.arrayElement(personalInfoIds),
        purpose: faker.lorem.sentence(),
        status: faker.helpers.arrayElement([
          'pending',
          'processing',
          'approved',
          'rejected',
          'completed',
        ]),
        additionalInformation: {
          forWhom: faker.person.fullName(),
          remarks: faker.lorem.sentence(),
          duration: '6 months',
        },
      },
    });
  }
}