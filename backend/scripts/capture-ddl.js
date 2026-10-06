/**
 * Child of scripts/migrate.js: syncs the models into the scratch database named
 * by SUPABASE_DB_URL (passed in the spawned environment) and prints the
 * captured DDL as a JSON string array on stdout. Runs as its own process so
 * the models attach to the scratch connection rather than the live one.
 */
import { sequelize } from '../src/config/db.js';

// Import order = FK dependency order (each model also pulls its targets).
import '../src/models/Admin.js';
import '../src/models/University.js';
import '../src/models/Blog.js';
import '../src/models/Student.js';
import '../src/models/Course.js';
import '../src/models/Destination.js';
import '../src/models/Scholarship.js';
import '../src/models/Application.js';
import '../src/models/Inquiry.js';
import '../src/models/Media.js';
import '../src/models/ContactMessage.js';
import '../src/models/FAQ.js';
import '../src/models/PageSeo.js';
import '../src/models/Service.js';
import '../src/models/SiteSettings.js';
import '../src/models/SuccessStory.js';
import '../src/models/TeamMember.js';
import '../src/models/Testimonial.js';

const statements = [];
try {
  await sequelize.sync({
    force: true,
    logging: (sql) => statements.push(sql.replace(/^Executing \(default\): /, '')),
  });
  process.stdout.write(JSON.stringify(statements));
  await sequelize.close();
  process.exit(0);
} catch (err) {
  console.error(err);
  process.exit(1);
}
