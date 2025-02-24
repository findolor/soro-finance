import { Role } from '@prisma/client';
import prisma from './db';

async function seed() {
  try {
    // Create 5 users with different roles
    const users = [
      {
        role: Role.ADMIN,
      },
      {
        role: Role.MANAGER,
      },
      {
        role: Role.USER,
      },
      {
        role: Role.USER,
      },
      {
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