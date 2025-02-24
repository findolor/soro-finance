import prisma from './db';

async function clear() {
  try {
    // Add all models here in the correct order to handle foreign key constraints
    await prisma.user.deleteMany();
    
    console.log('🧹 Database cleared successfully');
  } catch (e) {
    console.error('❌ Error clearing database:', e);
    throw e;
  } finally {
    await prisma.$disconnect();
  }
}

// Allow running directly or importing
if (require.main === module) {
  clear()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export default clear; 