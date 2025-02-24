import clear from './clear';
import seed from './seed';

async function reset() {
  try {
    await clear();
    await seed();
    console.log('🔄 Database reset completed successfully');
  } catch (e) {
    console.error('❌ Error resetting database:', e);
    throw e;
  }
}

// Allow running directly or importing
if (require.main === module) {
  reset()
    .catch((e) => {
      console.error(e);
      process.exit(1);
    });
}

export default reset; 