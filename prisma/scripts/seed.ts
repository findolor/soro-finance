import { Role } from '@prisma/client';
import prisma from './db';

async function seed() {
  try {
    // Create 5 users with different roles
    const users = [
      {
        name: 'Admin User',
        email: 'admin@sorofinance.com',
        walletAddress: '0x1234567890123456789012345678901234567890',
        role: Role.ADMIN,
      },
      {
        name: 'Finance Manager',
        email: 'manager@sorofinance.com',
        walletAddress: '0x2345678901234567890123456789012345678901',
        role: Role.MANAGER,
      },
      {
        name: 'John Developer',
        email: 'john@sorofinance.com',
        walletAddress: '0x3456789012345678901234567890123456789012',
        role: Role.USER,
      },
      {
        name: 'Sarah Designer',
        email: 'sarah@sorofinance.com',
        walletAddress: '0x4567890123456789012345678901234567890123',
        role: Role.USER,
      },
      {
        name: 'Mike Tester',
        email: 'mike@sorofinance.com',
        walletAddress: '0x5678901234567890123456789012345678901234',
        role: Role.USER,
      },
    ];

    for (const user of users) {
      await prisma.user.create({
        data: user,
      });
    }

    console.log('🌱 Seed data created successfully');
  } catch (e) {
    console.error('❌ Error seeding data:', e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
}

// Allow running directly or importing
if (require.main === module) {
  seed()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export default seed; 