import { app } from './app';

const BROWSE_DIR = process.env.BROWSE_DIR || process.argv[2];
const DEFAULT_PORT = 3000;
const PORT = process.env.PORT || process.argv[3] || DEFAULT_PORT;

if (!BROWSE_DIR) {
  console.log('BROWSE_DIR is required');
  process.exit();
}

app.listen(PORT, () => {
  console.log(`express is running on port ${PORT}`);
  console.log(`BROWSE_DIR is set to ${BROWSE_DIR}`);
});
