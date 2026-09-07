import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcryptjs';

// Resolve database URL for PostgreSQL seeding
const databaseUrl =
  process.env.POSTGRES_PRISMA_URL ||
  process.env.POSTGRES_URL ||
  process.env.DATABASE_URL;

if (!databaseUrl || databaseUrl.startsWith('file:')) {
  console.warn(
    '⚠️ Warning: DATABASE_URL points to a SQLite file or is missing. For Neon DB PostgreSQL, please provide a valid postgresql:// connection string.'
  );
}

const prisma = new PrismaClient({
  datasources: databaseUrl && !databaseUrl.startsWith('file:') ? { db: { url: databaseUrl } } : undefined,
});

async function main() {
  console.log('🌱 Starting database seeding for Wessam Learning System (WLS)...');

  const adminEmail = (process.env.ADMIN_EMAIL || 'wessamaftab@gmail.com').toLowerCase().trim();
  const adminPassword = process.env.ADMIN_PASSWORD || 'Sami@n78600';
  const adminName = process.env.ADMIN_NAME || 'Wessam Aftab (Master Admin)';

  // Password hashing helper
  const salt = await bcrypt.genSalt(10);
  const adminPasswordHash = await bcrypt.hash(adminPassword, salt);
  const teacherPasswordHash = await bcrypt.hash('TeacherPass123!', salt);

  // 1. Create Master Admin from Environment Variables
  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {
      name: adminName,
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
    create: {
      email: adminEmail,
      name: adminName,
      passwordHash: adminPasswordHash,
      role: 'ADMIN',
    },
  });
  console.log('✅ Master Admin initialized:', adminUser.email);

  // 2. Create Sample Teachers
  const teacher1User = await prisma.user.upsert({
    where: { email: 'wessam.educator@wls.edu' },
    update: {},
    create: {
      email: 'wessam.educator@wls.edu',
      name: 'Wessam Aftab',
      passwordHash: teacherPasswordHash,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          department: 'AI & Full-Stack Engineering',
          designation: 'Lead AI Engineer & Technical Educator',
        },
      },
    },
    include: { teacherProfile: true },
  });

  const teacher2User = await prisma.user.upsert({
    where: { email: 'sarah.jenkins@wls.edu' },
    update: {},
    create: {
      email: 'sarah.jenkins@wls.edu',
      name: 'Dr. Sarah Jenkins',
      passwordHash: teacherPasswordHash,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          department: 'Data Science & Machine Learning',
          designation: 'Senior Assistant Professor',
        },
      },
    },
    include: { teacherProfile: true },
  });

  const teacher3User = await prisma.user.upsert({
    where: { email: 'alex.rivera@wls.edu' },
    update: {},
    create: {
      email: 'alex.rivera@wls.edu',
      name: 'Eng. Alex Rivera',
      passwordHash: teacherPasswordHash,
      role: 'TEACHER',
      teacherProfile: {
        create: {
          department: 'Web Architecture & Cloud Systems',
          designation: 'Cloud Solutions Architect',
        },
      },
    },
    include: { teacherProfile: true },
  });

  console.log('✅ Sample Teachers created with profiles.');

  // Fetch teacher profiles
  const t1Profile = await prisma.teacherProfile.findUnique({ where: { userId: teacher1User.id } });
  const t2Profile = await prisma.teacherProfile.findUnique({ where: { userId: teacher2User.id } });

  if (t1Profile && t2Profile) {
    // 3. Create Sample Submissions & Evaluations
    await prisma.projectSubmission.create({
      data: {
        studentIdCode: 'WLS-2026-101',
        studentName: 'Muhammad Hamza',
        course: 'AI & Full-Stack Next.js Engineering',
        schedule: 'Mon-Tue',
        gender: 'Male',
        projectName: 'Smart Autonomous Agent Orchestrator',
        projectUrl: 'https://github.com/m-hamza/agent-orchestrator',
        portfolioUrl: 'https://hamza-portfolio.dev',
        teacherId: t1Profile.id,
        status: 'EVALUATED',
        academicRecord: {
          create: {
            participation: 9.5,
            attendance: 10,
            quizzes: 18.5,
            assignments: 19.0,
          },
        },
        evaluation: {
          create: {
            synopsisScore: 10,
            uiUxScore: 19,
            innovationScore: 28,
            reportingScore: 9,
            outcomesScore: 10,
            groupScore: 9,
            presentationScore: 9.5,
            totalScore: 94.5,
            feedback: 'Outstanding project architecture with seamless multi-agent orchestration and clean TypeScript implementation.',
            evaluatorId: teacher1User.id,
          },
        },
      },
    });

    await prisma.projectSubmission.create({
      data: {
        studentIdCode: 'WLS-2026-102',
        studentName: 'Ayesha Khan',
        course: 'Advanced AI & Machine Learning Specialization',
        schedule: 'Wed-Thu',
        gender: 'Female',
        projectName: 'Healthcare Predictive Diagnostics API',
        projectUrl: 'https://github.com/ayesha-k/health-ai-api',
        portfolioUrl: 'https://ayeshakhan.design',
        teacherId: t2Profile.id,
        status: 'EVALUATED',
        academicRecord: {
          create: {
            participation: 9.0,
            attendance: 9.5,
            quizzes: 17.0,
            assignments: 18.5,
          },
        },
        evaluation: {
          create: {
            synopsisScore: 9,
            uiUxScore: 18,
            innovationScore: 27,
            reportingScore: 9,
            outcomesScore: 9,
            groupScore: 10,
            presentationScore: 9.0,
            totalScore: 91.0,
            feedback: 'Very thorough model evaluations and well-documented API endpoints.',
            evaluatorId: teacher2User.id,
          },
        },
      },
    });

    await prisma.projectSubmission.create({
      data: {
        studentIdCode: 'WLS-2026-103',
        studentName: 'Bilal Ahmed',
        course: 'AI & Full-Stack Next.js Engineering',
        schedule: 'Sat-Sun',
        gender: 'Male',
        projectName: 'Decentralized LMS Verification Ledger',
        projectUrl: 'https://github.com/bilalahmed/lms-ledger',
        portfolioUrl: 'https://bilal.dev',
        teacherId: t1Profile.id,
        status: 'PENDING',
        academicRecord: {
          create: {
            participation: 8.5,
            attendance: 9.0,
            quizzes: 16.0,
            assignments: 17.5,
          },
        },
      },
    });

    console.log('✅ Sample project submissions and evaluations created.');
  }

  console.log('🎉 Seeding complete!');
}

main()
  .catch((e) => {
    console.error('❌ Seeding error:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
