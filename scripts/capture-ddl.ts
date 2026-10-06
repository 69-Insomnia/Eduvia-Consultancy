/**
 * Child of scripts/migrate.js: syncs the models into the scratch database named
 * by SUPABASE_DB_URL (passed in the spawned environment) and prints the
 * captured DDL as a JSON string array on stdout. Runs as its own process so
 * the models attach to the scratch connection rather than the live one.
 */
import { sequelize } from '../server/config/db.js';

// Import order = FK dependency order (each model also pulls its targets).
import '../server/models/Admin.js';
import '../server/models/University.js';
import '../server/models/Blog.js';
import '../server/models/Student.js';
import '../server/models/Course.js';
import '../server/models/Destination.js';
import '../server/models/Scholarship.js';
import '../server/models/Application.js';
import '../server/models/Inquiry.js';
import '../server/models/Media.js';
import '../server/models/ContactMessage.js';
import '../server/models/FAQ.js';
import '../server/models/PageSeo.js';
import '../server/models/Service.js';
import '../server/models/SiteSettings.js';
import '../server/models/SuccessStory.js';
import '../server/models/TeamMember.js';
import '../server/models/Testimonial.js';

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
