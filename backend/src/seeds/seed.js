import dotenv from 'dotenv';
dotenv.config();

import mongoose from 'mongoose';
import Admin from '../models/Admin.js';
import Destination from '../models/Destination.js';
import University from '../models/University.js';
import Course from '../models/Course.js';
import Scholarship from '../models/Scholarship.js';
import TeamMember from '../models/TeamMember.js';
import FAQ from '../models/FAQ.js';
import Service from '../models/Service.js';
import SiteSettings from '../models/SiteSettings.js';
import Testimonial from '../models/Testimonial.js';
import SuccessStory from '../models/SuccessStory.js';
import Blog from '../models/Blog.js';
import PageSeo from '../models/PageSeo.js';
import { PAGES } from '../config/pages.js';
import { makeSeoFromEntity } from '../utils/seoDefaults.js';

const seed = async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);
    console.log('MongoDB connected for seeding...');

    await Admin.deleteMany();
    await Destination.deleteMany();
    await University.deleteMany();
    await Course.deleteMany();
    await Scholarship.deleteMany();
    await TeamMember.deleteMany();
    await FAQ.deleteMany();
    await Service.deleteMany();
    await SiteSettings.deleteMany();
    await PageSeo.deleteMany();
    await Testimonial.deleteMany();
    await SuccessStory.deleteMany();
    await Blog.deleteMany();

    console.log('Cleared existing data');

    const admin = await Admin.create({
      name: 'Admin',
      email: 'admin@eduvia.com',
      password: 'admin123',
      role: 'superadmin',
    });
    console.log('Default admin created');

    const destinationData = [
      {
        name: 'Australia',
        code: 'AU',
        flag: '🇦🇺',
        shortDescription: 'World-class education with post-study work opportunities in a vibrant multicultural society.',
        description: 'Australia is one of the most popular study abroad destinations for Nepali students. With world-ranked universities, a safe and welcoming environment, and generous post-study work visa options, Australia offers an excellent pathway to a global career. The country is known for its high quality of life, beautiful landscapes, and diverse culture.',
        image: '/destinations/australia.jpg',
        coverImage: '/destinations/australia.jpg',
        whyStudyHere: [
          'Globally ranked universities with high academic standards',
          'Post-Study Work Visa (Subclass 485) up to 4 years',
          'Safe and multicultural society with large Nepali community',
          'High quality of life and excellent weather',
          'Part-time work allowed up to 48 hours per fortnight',
          'Pathway to permanent residency',
        ],
        popularUniversities: [
          { name: 'University of Melbourne', ranking: '#1 in Australia', programs: ['Business', 'Engineering', 'Medicine', 'IT'] },
          { name: 'University of Sydney', ranking: '#2 in Australia', programs: ['Law', 'Arts', 'Science', 'Business'] },
          { name: 'Monash University', ranking: '#5 in Australia', programs: ['Pharmacy', 'Engineering', 'Business', 'IT'] },
        ],
        popularCourses: ['Business Administration', 'Information Technology', 'Engineering', 'Nursing', 'Accounting', 'Data Science'],
        tuitionInfo: 'AUD 20,000 - 45,000 per year depending on course and university',
        costOfLiving: 'AUD 21,041 per year (standard requirement for visa)',
        scholarships: 'Australia Awards, Destination Australia, university-specific scholarships up to 50% tuition waiver',
        englishRequirements: 'IELTS 6.0-7.0 overall (no band below 5.5-6.0), TOEFL 60-100, PTE 50-65',
        visaInfo: 'Student Visa (Subclass 500) with processing time of 4-8 weeks',
        workOpportunities: '48 hours per fortnight during term, unlimited during scheduled breaks',
        intakes: 'February, July (main intakes), some universities offer September intake',
        applicationProcess: 'Apply directly or through agent, receive offer letter, pay tuition deposit, get CoE, apply for visa',
        faqs: [
          { question: 'Can I work while studying in Australia?', answer: 'Yes, you can work up to 48 hours per fortnight during term and unlimited hours during scheduled breaks.' },
          { question: 'What is the post-study work visa?', answer: 'The Subclass 485 visa allows you to stay and work in Australia for 2-4 years after graduation depending on your qualification.' },
          { question: 'How much money do I need for a student visa?', answer: 'You need to show AUD 21,041 per year for living costs plus tuition fees and travel costs.' },
        ],
        isFeatured: true,
      },
      {
        name: 'Canada',
        code: 'CA',
        flag: '🇨🇦',
        shortDescription: 'Affordable education with direct pathway to permanent residency and world-class universities.',
        description: 'Canada has become the top choice for Nepali students seeking quality education abroad. With affordable tuition fees, a safe environment, and a clear pathway to permanent residency through programs like PGWP and Express Entry, Canada offers unmatched opportunities for international students.',
        image: '/destinations/canada.jpg',
        coverImage: '/destinations/canada.jpg',
        whyStudyHere: [
          'Direct pathway to Permanent Residency through PGWP and Express Entry',
          'Affordable tuition compared to USA, UK, and Australia',
          'Safe and welcoming multicultural environment',
          'High quality of life and excellent healthcare',
          'Work while studying up to 20 hours per week',
          'Post-graduation work permit up to 3 years',
        ],
        popularUniversities: [
          { name: 'University of Toronto', ranking: '#1 in Canada', programs: ['Computer Science', 'Business', 'Engineering', 'Medicine'] },
          { name: 'University of British Columbia', ranking: '#3 in Canada', programs: ['Business', 'Science', 'Arts', 'Engineering'] },
          { name: 'McGill University', ranking: '#2 in Canada', programs: ['Medicine', 'Law', 'Engineering', 'Music'] },
        ],
        popularCourses: ['Computer Science', 'Business Administration', 'Engineering', 'Data Analytics', 'Healthcare Management', 'Project Management'],
        tuitionInfo: 'CAD 15,000 - 35,000 per year depending on program and institution',
        costOfLiving: 'CAD 10,000 - 15,000 per year depending on city',
        scholarships: 'Vanier Canada Graduate Scholarships, university entrance scholarships, provincial nominee programs',
        englishRequirements: 'IELTS 6.0-6.5 overall, TOEFL 80-100, PTE 55-65',
        visaInfo: 'Study Permit with processing time of 4-16 weeks depending on country',
        workOpportunities: '20 hours per week during term, full-time during breaks',
        intakes: 'September (main), January, May (some programs)',
        applicationProcess: 'Apply to DL institution, get acceptance letter, apply for study permit with financial proof',
        faqs: [
          { question: 'Can I get PR after studying in Canada?', answer: 'Yes, through the Post-Graduation Work Permit Program (PGWP) and then applying through Express Entry or Provincial Nominee Programs.' },
          { question: 'How much bank balance is required?', answer: 'You need CAD 10,000-20,000 per year for living expenses plus first-year tuition fees.' },
          { question: 'Is IELTS mandatory for Canada?', answer: 'Yes, most institutions require IELTS 6.0-6.5 overall for undergraduate programs and 6.5-7.0 for graduate programs.' },
        ],
        isFeatured: true,
      },
      {
        name: 'United Kingdom',
        code: 'GB',
        flag: '🇬🇧',
        shortDescription: 'Home to world-renowned universities with a new Graduate Route visa for international students.',
        description: 'The United Kingdom is one of the most prestigious study destinations in the world, home to Oxford, Cambridge, and many other world-ranked universities. With the new Graduate Route visa allowing 2 years of post-study work, the UK has become increasingly attractive for Nepali students.',
        image: '/destinations/united-kingdom.jpg',
        coverImage: '/destinations/united-kingdom.jpg',
        whyStudyHere: [
          'Home to some of the world\'s oldest and most prestigious universities',
          'New Graduate Route visa allows 2 years post-study work',
          'Shorter degree programs (1 year Masters)',
          'World-renowned research facilities',
          'Multicultural society with large Nepali community',
          'Access to European job market',
        ],
        popularUniversities: [
          { name: 'University of Oxford', ranking: '#1 in UK', programs: ['PPE', 'Medicine', 'Law', 'English Literature'] },
          { name: 'University of Cambridge', ranking: '#2 in UK', programs: ['Mathematics', 'Natural Sciences', 'Engineering', 'Law'] },
          { name: 'University College London', ranking: '#5 in UK', programs: ['Medicine', 'Law', 'Architecture', 'Economics'] },
        ],
        popularCourses: ['Business Management', 'Computer Science', 'Engineering', 'Law', 'Medicine', 'Data Science'],
        tuitionInfo: 'GBP 10,000 - 38,000 per year depending on university and course',
        costOfLiving: 'GBP 9,207 - 12,000 per year (London is higher)',
        scholarships: 'Chevening Scholarships, Commonwealth Scholarships, GREAT Scholarships, university scholarships',
        englishRequirements: 'IELTS 6.0-7.0 overall, TOEFL 79-100, PTE 51-67',
        visaInfo: 'Student Route visa with processing time of 3-6 weeks',
        workOpportunities: '20 hours per week during term, full-time during holidays',
        intakes: 'September (main), January (some courses)',
        applicationProcess: 'Apply through UCAS for undergrad, direct for postgrad, get CAS, apply for visa',
        faqs: [
          { question: 'What is the Graduate Route visa?', answer: 'It allows international students to stay and work in the UK for 2 years (3 years for PhD) after completing their studies.' },
          { question: 'Can I work in the UK after graduation?', answer: 'Yes, through the Graduate Route visa which gives you 2 years to find a skilled worker job and switch to a work visa.' },
          { question: 'How much does it cost to study in the UK?', answer: 'Tuition ranges from GBP 10,000-38,000 per year, with living costs of GBP 9,207-12,000 per year.' },
        ],
        isFeatured: true,
      },
      {
        name: 'United States',
        code: 'US',
        flag: '🇺🇸',
        shortDescription: 'Home to Ivy League universities with unparalleled research opportunities and OPT work authorization.',
        description: 'The United States remains the dream destination for many Nepali students, offering world-class education at prestigious Ivy League and top-ranked universities. With extensive research opportunities, OPT work authorization, and a culture of innovation, the US provides unmatched academic and career prospects.',
        image: '/destinations/united-states.jpg',
        coverImage: '/destinations/united-states.jpg',
        whyStudyHere: [
          'Home to Ivy League and top-ranked universities worldwide',
          'Optional Practical Training (OPT) up to 3 years for STEM',
          'Unparalleled research facilities and funding opportunities',
          'Diverse and inclusive campus environments',
          'Silicon Valley and Wall Street connections',
          'World-leading technology and innovation ecosystem',
        ],
        popularUniversities: [
          { name: 'Harvard University', ranking: '#1 in USA', programs: ['Business', 'Law', 'Medicine', 'Public Policy'] },
          { name: 'MIT', ranking: '#2 in USA', programs: ['Engineering', 'Computer Science', 'Physics', 'Mathematics'] },
          { name: 'Stanford University', ranking: '#3 in USA', programs: ['Computer Science', 'Business', 'Engineering', 'Law'] },
        ],
        popularCourses: ['Computer Science', 'Business Administration', 'Engineering', 'Data Science', 'Artificial Intelligence', 'Finance'],
        tuitionInfo: 'USD 20,000 - 60,000+ per year depending on institution',
        costOfLiving: 'USD 10,000 - 18,000 per year depending on location',
        scholarships: 'Fulbright, Hubert Humphrey, university-specific merit scholarships, need-based aid',
        englishRequirements: 'TOEFL 70-100+, IELTS 6.0-7.0, Duolingo 95-120+',
        visaInfo: 'F-1 Student Visa with interview at US Embassy',
        workOpportunities: 'On-campus 20 hrs/week, CPT during studies, OPT 12 months (36 months for STEM)',
        intakes: 'Fall (August-September), Spring (January), Summer (limited)',
        applicationProcess: 'Apply through Common App or university portal, standardized tests (SAT/GRE/GMAT), financial documentation',
        faqs: [
          { question: 'What is OPT?', answer: 'Optional Practical Training allows F-1 students to work in their field of study for 12 months after graduation (36 months for STEM fields).' },
          { question: 'Do I need SAT for US universities?', answer: 'Many universities are now test-optional, but top universities still recommend or require SAT/ACT scores.' },
          { question: 'How much bank balance is required for US student visa?', answer: 'You need to show sufficient funds to cover at least one year of tuition and living expenses, typically USD 30,000-70,000.' },
        ],
        isFeatured: true,
      },
      {
        name: 'New Zealand',
        code: 'NZ',
        flag: '🇳🇿',
        shortDescription: 'Quality education with excellent post-study work rights and a safe, beautiful environment.',
        description: 'New Zealand offers a unique study experience with its world-class education system, stunning natural beauty, and welcoming Kiwi culture. For Nepali students, NZ provides excellent post-study work opportunities and a pathway to residency.',
        image: '/destinations/new-zealand.jpg',
        coverImage: '/destinations/new-zealand.jpg',
        whyStudyHere: [
          'All 8 universities ranked in top 3% globally',
          'Post-study work visa up to 3 years',
          'Safe and welcoming environment',
          'Affordable compared to Australia',
          'Beautiful natural landscapes',
          'Innovative teaching methods',
        ],
        popularUniversities: [
          { name: 'University of Auckland', ranking: '#1 in NZ', programs: ['Business', 'Engineering', 'Medicine', 'Arts'] },
          { name: 'University of Otago', ranking: '#2 in NZ', programs: ['Medicine', 'Science', 'Law', 'Business'] },
          { name: 'Victoria University of Wellington', ranking: '#3 in NZ', programs: ['Law', 'Humanities', 'Science', 'Design'] },
        ],
        popularCourses: ['Business Management', 'IT', 'Engineering', 'Nursing', 'Agriculture', 'Hospitality'],
        tuitionInfo: 'NZD 22,000 - 35,000 per year',
        costOfLiving: 'NZD 15,000 per year (student visa requirement)',
        scholarships: 'New Zealand Scholarships, university scholarships, NZ Aid Programme',
        englishRequirements: 'IELTS 5.5-6.5 overall',
        visaInfo: 'Student Visa with processing time of 4-6 weeks',
        workOpportunities: '20 hours per week during term, full-time during holidays',
        intakes: 'February, July',
        applicationProcess: 'Apply directly to institution, get offer, pay tuition, get receipt, apply for visa',
        faqs: [
          { question: 'Can I work while studying in NZ?', answer: 'Yes, you can work up to 20 hours per week during term and full-time during scheduled breaks.' },
          { question: 'What is the post-study work visa?', answer: 'The Post-Study Work Visa allows you to work in NZ for 1-3 years after graduation depending on your qualification and study location.' },
        ],
        isFeatured: true,
      },
      {
        name: 'Japan',
        code: 'JP',
        flag: '🇯🇵',
        shortDescription: 'Cutting-edge technology with generous scholarships and a unique cultural experience.',
        description: 'Japan is an increasingly popular destination for Nepali students, offering cutting-edge technology, generous scholarships like MEXT, and a safe environment. With its blend of tradition and innovation, Japan provides a unique educational and cultural experience.',
        image: '/destinations/japan.jpg',
        coverImage: '/destinations/japan.jpg',
        whyStudyHere: [
          'MEXT Scholarship covers full tuition, living allowance, and airfare',
          'World leader in technology, robotics, and engineering',
          'Safe country with low crime rate',
          'Unique cultural experience blending tradition and modernity',
          'Part-time work opportunities',
          'Pathway to work visa after graduation',
        ],
        popularUniversities: [
          { name: 'University of Tokyo', ranking: '#1 in Japan', programs: ['Engineering', 'Science', 'Medicine', 'Law'] },
          { name: 'Kyoto University', ranking: '#2 in Japan', programs: ['Science', 'Engineering', 'Arts', 'Medicine'] },
          { name: 'Osaka University', ranking: '#3 in Japan', programs: ['Medicine', 'Engineering', 'Science', 'Law'] },
        ],
        popularCourses: ['Engineering', 'Computer Science', 'Business', 'Japanese Language', 'Robotics', 'Information Technology'],
        tuitionInfo: 'JPY 500,000 - 1,500,000 per year (national/public universities)',
        costOfLiving: 'JPY 80,000 - 120,000 per month',
        scholarships: 'MEXT (Monbukagakusho), JASSO, university scholarships',
        englishRequirements: 'JLPT N2-N1 for Japanese programs, IELTS/TOEFL for English programs',
        visaInfo: 'Student Visa (College Student) with Certificate of Eligibility',
        workOpportunities: '28 hours per week with permission',
        intakes: 'April (main), October',
        applicationProcess: 'Apply for MEXT through embassy or university, or apply directly to university',
        faqs: [
          { question: 'What is MEXT scholarship?', answer: 'MEXT is a full scholarship from the Japanese government covering tuition, living expenses (¥117,000-¥145,000/month), and round-trip airfare.' },
          { question: 'Do I need to know Japanese?', answer: 'For Japanese-taught programs, JLPT N2 or higher is typically required. English-taught programs are also available at many universities.' },
        ],
        isFeatured: false,
      },
      {
        name: 'South Korea',
        code: 'KR',
        flag: '🇰🇷',
        shortDescription: 'Affordable education with Korean Government Scholarship Program and K-culture appeal.',
        description: 'South Korea offers affordable, high-quality education with the famous Korean Government Scholarship Program (KGSP). With its booming economy, K-culture influence, and technological advancement, South Korea attracts many Nepali students.',
        image: '/destinations/south-korea.jpg',
        coverImage: '/destinations/south-korea.jpg',
        whyStudyHere: [
          'Korean Government Scholarship Program (KGSP) fully funded',
          'Affordable tuition and living costs',
          'World-class technology and innovation',
          'Rich cultural experience (K-pop, K-drama, food)',
          'Growing job market for international graduates',
          'Safe and modern infrastructure',
        ],
        popularUniversities: [
          { name: 'Seoul National University', ranking: '#1 in Korea', programs: ['Engineering', 'Business', 'Medicine', 'Arts'] },
          { name: 'KAIST', ranking: '#2 in Korea', programs: ['Engineering', 'Science', 'Technology', 'Business'] },
          { name: 'Yonsei University', ranking: '#3 in Korea', programs: ['Business', 'Medicine', 'Engineering', 'Liberal Arts'] },
        ],
        popularCourses: ['Engineering', 'Computer Science', 'Business', 'Korean Studies', 'Media Studies', 'International Trade'],
        tuitionInfo: 'KRW 4,000,000 - 10,000,000 per year',
        costOfLiving: 'KRW 800,000 - 1,200,000 per month',
        scholarships: 'KGSP (full scholarship), university scholarships, KOICA',
        englishRequirements: 'TOPIK 3+ for Korean programs, IELTS/TOEFL for English programs',
        visaInfo: 'D-2 Student Visa',
        workOpportunities: '20 hours per week during term, full-time during breaks',
        intakes: 'March (spring), September (fall)',
        applicationProcess: 'Apply for KGSP through embassy or directly to university',
        faqs: [
          { question: 'What is KGSP?', answer: 'Korean Government Scholarship Program provides full tuition, living allowance (₩900,000/month), round-trip airfare, and language training.' },
          { question: 'Can I work part-time in Korea?', answer: 'Yes, with permission you can work up to 20 hours per week during term and unlimited during breaks.' },
        ],
        isFeatured: false,
      },
      {
        name: 'Germany',
        code: 'DE',
        flag: '🇩🇪',
        shortDescription: 'No tuition fees at public universities with a strong economy and post-study work opportunities.',
        description: 'Germany is a top destination for Nepali students seeking quality education without hefty tuition fees. Most public universities charge zero or minimal tuition, and the country offers excellent post-study work opportunities with its strong economy.',
        image: '/destinations/germany.jpg',
        coverImage: '/destinations/germany.jpg',
        whyStudyHere: [
          'No tuition fees at most public universities',
          'World-class engineering and technical education',
          'Strong economy with job opportunities',
          '18-month post-study job seeker visa',
          'Central location in Europe',
          'Growing number of English-taught programs',
        ],
        popularUniversities: [
          { name: 'Technical University of Munich', ranking: '#1 in Germany', programs: ['Engineering', 'Computer Science', 'Physics', 'Architecture'] },
          { name: 'Ludwig Maximilian University', ranking: '#2 in Germany', programs: ['Medicine', 'Law', 'Philosophy', 'Economics'] },
          { name: 'Heidelberg University', ranking: '#3 in Germany', programs: ['Medicine', 'Natural Sciences', 'Law', 'Philosophy'] },
        ],
        popularCourses: ['Engineering', 'Computer Science', 'Business', 'Medicine', 'Architecture', 'Data Science'],
        tuitionInfo: '€0 - €1,500 per semester (most public universities)',
        costOfLiving: '€850 - €1,000 per month (blocked account requirement)',
        scholarships: 'DAAD, Erasmus+, Deutschlandstipendium, university scholarships',
        englishRequirements: 'IELTS 6.0-6.5, TOEFL 79-90 for English programs',
        visaInfo: 'National Visa (Type D) for studies, blocked account of €11,208 required',
        workOpportunities: '120 full days or 240 half days per year',
        intakes: 'Winter semester (October), Summer semester (April)',
        applicationProcess: 'Apply via uni-assist or directly, blocked account, health insurance, visa application',
        faqs: [
          { question: 'Is education really free in Germany?', answer: 'Most public universities charge no tuition, only a small semester contribution of €100-400. Private universities charge tuition.' },
          { question: 'Do I need to know German?', answer: 'Many programs are now offered in English, but knowing German helps with daily life and job prospects. Some programs require German proficiency.' },
          { question: 'How much money do I need in blocked account?', answer: 'You need €11,208 per year in a blocked account for the student visa.' },
        ],
        isFeatured: true,
      },
      {
        name: 'Ireland',
        code: 'IE',
        flag: '🇮🇪',
        shortDescription: 'English-speaking country with post-study work stamp and tech industry presence.',
        description: 'Ireland offers quality education in an English-speaking environment with excellent post-study work opportunities through the Third Level Graduate Programme. Home to many tech giants, Ireland provides great career prospects for international graduates.',
        image: '/destinations/ireland.jpg',
        coverImage: '/destinations/ireland.jpg',
        whyStudyHere: [
          'English-speaking country with rich culture',
          'Post-Study Work Stamp 1G for 12-24 months',
          'Home to European HQs of Google, Facebook, Apple',
          'High-quality education system',
          'Welcoming and safe environment',
          'Gateway to European job market',
        ],
        popularUniversities: [
          { name: 'Trinity College Dublin', ranking: '#1 in Ireland', programs: ['Business', 'Engineering', 'Medicine', 'Arts'] },
          { name: 'University College Dublin', ranking: '#2 in Ireland', programs: ['Business', 'Science', 'Medicine', 'Law'] },
          { name: 'University of Galway', ranking: '#4 in Ireland', programs: ['Engineering', 'Science', 'Business', 'Arts'] },
        ],
        popularCourses: ['Computer Science', 'Business', 'Engineering', 'Pharmaceutical Sciences', 'Data Analytics', 'Digital Marketing'],
        tuitionInfo: '€10,000 - €25,000 per year',
        costOfLiving: '€7,000 - €12,000 per year',
        scholarships: 'Government of Ireland Scholarships, university scholarships',
        englishRequirements: 'IELTS 6.0-6.5 overall',
        visaInfo: 'Student Visa (Stamp 2) with work permission',
        workOpportunities: '20 hours per week during term, 40 hours during holidays',
        intakes: 'September (main), January',
        applicationProcess: 'Apply directly to university, proof of funds, student visa application',
        faqs: [
          { question: 'Can I work in Ireland after graduation?', answer: 'Yes, the Third Level Graduate Programme (Stamp 1G) allows you to stay and work for 12-24 months depending on your qualification level.' },
        ],
        isFeatured: false,
      },
      {
        name: 'Finland',
        code: 'FI',
        flag: '🇫🇮',
        shortDescription: 'Innovation hub with high quality of life and growing English-taught programs.',
        description: 'Finland is known for its world-class education system, innovation, and high quality of life. While tuition fees apply for non-EU students, generous scholarships are available, and Finland offers a unique study experience.',
        image: '/destinations/finland.jpg',
        coverImage: '/destinations/finland.jpg',
        whyStudyHere: [
          'World-class education system',
          'High quality of life and safety',
          'Innovation and startup ecosystem',
          'Scholarships covering 50-100% tuition',
          'Post-study work opportunities',
          'English-taught programs available',
        ],
        popularUniversities: [
          { name: 'University of Helsinki', ranking: '#1 in Finland', programs: ['Science', 'Arts', 'Medicine', 'Law'] },
          { name: 'Aalto University', ranking: '#2 in Finland', programs: ['Business', 'Engineering', 'Art & Design'] },
          { name: 'University of Turku', ranking: '#4 in Finland', programs: ['Medicine', 'Science', 'Education', 'Business'] },
        ],
        popularCourses: ['Computer Science', 'Engineering', 'Business', 'Education', 'Design', 'Environmental Science'],
        tuitionInfo: '€4,000 - €18,000 per year (non-EU)',
        costOfLiving: '€700 - €1,000 per month',
        scholarships: 'Finland Scholarship, university-specific scholarships (50-100% tuition waiver)',
        englishRequirements: 'IELTS 6.0-6.5, TOEFL 79-92',
        visaInfo: 'Residence Permit for Studies',
        workOpportunities: '30 hours per week during studies',
        intakes: 'August/September, January',
        applicationProcess: 'Apply via Studyinfo.fi or directly, financial proof, residence permit',
        faqs: [
          { question: 'Are there scholarships for non-EU students?', answer: 'Yes, many Finnish universities offer scholarships covering 50-100% of tuition fees based on academic merit.' },
        ],
        isFeatured: false,
      },
      {
        name: 'Netherlands',
        code: 'NL',
        flag: '🇳🇱',
        shortDescription: 'Innovative education system with English-taught programs and post-study orientation year.',
        description: 'The Netherlands offers innovative education with a wide range of English-taught programs. Known for its progressive culture and international environment, the Netherlands provides excellent opportunities for Nepali students.',
        image: '/destinations/netherlands.jpg',
        coverImage: '/destinations/netherlands.jpg',
        whyStudyHere: [
          'Wide range of English-taught programs',
          'Post-study orientation year visa (zoekjaar)',
          'Innovative teaching methods',
          'International and multicultural environment',
          'Central location in Europe',
          'Strong economy and job market',
        ],
        popularUniversities: [
          { name: 'University of Amsterdam', ranking: '#1 in NL', programs: ['Business', 'Social Sciences', 'Law', 'Medicine'] },
          { name: 'Delft University of Technology', ranking: '#2 in NL', programs: ['Engineering', 'Architecture', 'Computer Science'] },
          { name: 'Utrecht University', ranking: '#3 in NL', programs: ['Science', 'Medicine', 'Law', 'Humanities'] },
        ],
        popularCourses: ['Business', 'Engineering', 'Computer Science', 'International Relations', 'Design', 'Environmental Science'],
        tuitionInfo: '€8,000 - €20,000 per year (non-EU)',
        costOfLiving: '€800 - €1,100 per month',
        scholarships: 'Holland Scholarship, Orange Tulip Scholarship, university scholarships',
        englishRequirements: 'IELTS 6.0-6.5, TOEFL 80-100',
        visaInfo: 'MVV and Residence Permit',
        workOpportunities: '16 hours per week during term, full-time during holidays',
        intakes: 'September (main), February (some programs)',
        applicationProcess: 'Apply via Studielink or directly, financial proof, MVV application',
        faqs: [
          { question: 'What is the orientation year visa?', answer: 'The zoekjaar (orientation year) allows graduates to stay in the Netherlands for 1 year to find employment.' },
        ],
        isFeatured: false,
      },
      {
        name: 'United Arab Emirates',
        code: 'AE',
        flag: '🇦🇪',
        shortDescription: 'Global business hub with international university campuses and tax-free earnings.',
        description: 'The United Arab Emirates has emerged as a popular study destination, with branches of top international universities concentrated in Dubai, a global business hub, and tax-free earnings. Its strategic location between East and West makes it an attractive option for Nepali students.',
        image: '/destinations/dubai.jpg',
        coverImage: '/destinations/dubai.jpg',
        whyStudyHere: [
          'Branch campuses of top international universities',
          'Tax-free income and earnings',
          'Global business hub with networking opportunities',
          'Safe and modern city',
          'Strategic location connecting East and West',
          'Post-study work opportunities',
        ],
        popularUniversities: [
          { name: 'Khalifa University', ranking: '#1 in UAE', programs: ['Engineering', 'Science', 'Technology'] },
          { name: 'University of Dubai', ranking: 'Top in Dubai', programs: ['Business', 'Engineering', 'IT'] },
          { name: 'American University in Dubai', ranking: 'Top in Dubai', programs: ['Business', 'Engineering', 'Architecture', 'Communication'] },
        ],
        popularCourses: ['Business Administration', 'Engineering', 'IT', 'Hospitality Management', 'Finance', 'Marketing'],
        tuitionInfo: 'AED 40,000 - 100,000 per year',
        costOfLiving: 'AED 3,000 - 5,000 per month',
        scholarships: 'University scholarships, government scholarships, corporate sponsorships',
        englishRequirements: 'IELTS 5.5-6.5 overall',
        visaInfo: 'Student Visa sponsored by university',
        workOpportunities: 'On-campus work, internship opportunities with companies',
        intakes: 'September (fall), January (spring), June (summer)',
        applicationProcess: 'Apply directly to university, student visa through university sponsorship',
        faqs: [
          { question: 'Can I work while studying in Dubai?', answer: 'Yes, with a student visa you can do internships and on-campus work. Part-time work rules vary by emirate.' },
        ],
        isFeatured: false,
      },
    ];

    const destinations = await Destination.create(
      destinationData.map((d) => ({ ...d, seo: d.seo || makeSeoFromEntity({ type: 'destination', name: d.name }) })),
    );

    console.log(`${destinations.length} destinations created`);

    const uniData = [
      {
        name: 'University of Melbourne',
        country: 'Australia',
        city: 'Melbourne',
        logo: '/images/unis/melbourne-logo.png',
        coverImage: '/images/unis/melbourne-cover.jpg',
        shortDescription: 'One of Australia\'s leading research universities, consistently ranked among the top universities globally.',
        description: 'The University of Melbourne is a public research university located in Melbourne, Australia. Founded in 1853, it is the second oldest university in Australia and the oldest in Victoria. The university is consistently ranked among the top universities in Australia and the world.',
        website: 'https://www.unimelb.edu.au',
        ranking: '#1 in Australia, #33 globally',
        founded: '1853',
        type: 'public',
        programs: [
          { name: 'Master of Business Administration', degree: 'MBA', duration: '2 years', tuition: 'AUD 45,000/year', intake: 'February, July' },
          { name: 'Master of IT', degree: 'Master', duration: '2 years', tuition: 'AUD 42,000/year', intake: 'February, July' },
          { name: 'Bachelor of Engineering', degree: 'Bachelor', duration: '4 years', tuition: 'AUD 40,000/year', intake: 'February' },
        ],
        tuitionRange: 'AUD 30,000 - 45,000 per year',
        features: ['World Top 50', 'Research Excellence', 'Strong Industry Links', 'High Employability'],
        isFeatured: true,
      },
      {
        name: 'University of Toronto',
        country: 'Canada',
        city: 'Toronto',
        logo: '/images/unis/toronto-logo.png',
        coverImage: '/images/unis/toronto-cover.jpg',
        shortDescription: 'Canada\'s top university and a global leader in research and innovation.',
        description: 'The University of Toronto is a public research university in Toronto, Ontario, Canada. Founded by royal charter in 1827, it is the oldest university in the province and one of the most prestigious in Canada.',
        website: 'https://www.utoronto.ca',
        ranking: '#1 in Canada, #18 globally',
        founded: '1827',
        type: 'public',
        programs: [
          { name: 'Master of Computer Science', degree: 'Master', duration: '2 years', tuition: 'CAD 55,000/year', intake: 'September' },
          { name: 'MBA (Rotman)', degree: 'MBA', duration: '2 years', tuition: 'CAD 60,000/year', intake: 'September' },
          { name: 'Bachelor of Science', degree: 'Bachelor', duration: '4 years', tuition: 'CAD 50,000/year', intake: 'September' },
        ],
        tuitionRange: 'CAD 40,000 - 60,000 per year',
        features: ['Global Top 20', 'Research Powerhouse', 'Innovation Hub', 'Diverse Community'],
        isFeatured: true,
      },
      {
        name: 'University of Sydney',
        country: 'Australia',
        city: 'Sydney',
        logo: '/images/unis/sydney-logo.png',
        coverImage: '/images/unis/sydney-cover.jpg',
        shortDescription: 'Australia\'s first university with a reputation for academic excellence and graduate employability.',
        description: 'The University of Sydney is a public research university in Sydney, Australia. Founded in 1850, it is Australia\'s oldest university and is consistently ranked among the top universities in the world.',
        website: 'https://www.sydney.edu.au',
        ranking: '#2 in Australia, #40 globally',
        founded: '1850',
        type: 'public',
        programs: [
          { name: 'Master of Commerce', degree: 'Master', duration: '1.5 years', tuition: 'AUD 44,000/year', intake: 'February, July' },
          { name: 'Bachelor of Engineering', degree: 'Bachelor', duration: '4 years', tuition: 'AUD 42,000/year', intake: 'February' },
        ],
        tuitionRange: 'AUD 30,000 - 44,000 per year',
        features: ['Oldest University in Australia', 'World Renowned', 'Beautiful Campus', 'Strong Alumni Network'],
        isFeatured: true,
      },
      {
        name: 'University of British Columbia',
        country: 'Canada',
        city: 'Vancouver',
        logo: '/images/unis/ubc-logo.png',
        coverImage: '/images/unis/ubc-cover.jpg',
        shortDescription: 'A global centre for teaching, learning and research consistently ranked among the top 3 universities in Canada.',
        description: 'The University of British Columbia is a public research university with campuses in Vancouver and Kelowna, British Columbia. It is one of the top universities in Canada and is known for its research excellence.',
        website: 'https://www.ubc.ca',
        ranking: '#3 in Canada, #40 globally',
        founded: '1908',
        type: 'public',
        programs: [
          { name: 'Master of Data Science', degree: 'Master', duration: '1 year', tuition: 'CAD 48,000/year', intake: 'September' },
          { name: 'BCom (Sauder)', degree: 'Bachelor', duration: '4 years', tuition: 'CAD 48,000/year', intake: 'September' },
        ],
        tuitionRange: 'CAD 35,000 - 50,000 per year',
        features: ['Top 3 in Canada', 'Research Excellence', 'Beautiful Campus', 'Strong Co-op Programs'],
        isFeatured: true,
      },
      {
        name: 'University of Manchester',
        country: 'United Kingdom',
        city: 'Manchester',
        logo: '/images/unis/manchester-logo.png',
        coverImage: '/images/unis/manchester-cover.jpg',
        shortDescription: 'A red brick university and a member of the Russell Group, known for groundbreaking discoveries.',
        description: 'The University of Manchester is a public research university in Manchester, England. It was formed in 2004 by the merger of the Victoria University of Manchester and the University of Manchester Institute of Science and Technology.',
        website: 'https://www.manchester.ac.uk',
        ranking: '#6 in UK, #27 globally',
        founded: '1824',
        type: 'public',
        programs: [
          { name: 'MSc International Business', degree: 'Master', duration: '1 year', tuition: 'GBP 26,000/year', intake: 'September' },
          { name: 'BEng Computer Science', degree: 'Bachelor', duration: '3 years', tuition: 'GBP 25,000/year', intake: 'September' },
        ],
        tuitionRange: 'GBP 20,000 - 30,000 per year',
        features: ['Russell Group', 'Nobel Laureates', 'Research Excellence', 'Employability'],
        isFeatured: true,
      },
      {
        name: 'Monash University',
        country: 'Australia',
        city: 'Melbourne',
        logo: '/images/unis/monash-logo.png',
        coverImage: '/images/unis/monash-cover.jpg',
        shortDescription: 'A member of the Group of Eight, known for pharmacy, engineering, and business programs.',
        description: 'Monash University is a public research university based in Melbourne, Australia. It was founded in 1958 and is the second oldest university in the state of Victoria.',
        website: 'https://www.monash.edu',
        ranking: '#5 in Australia, #57 globally',
        founded: '1958',
        type: 'public',
        programs: [
          { name: 'Master of Finance', degree: 'Master', duration: '1.5 years', tuition: 'AUD 42,000/year', intake: 'February, July' },
          { name: 'Master of IT', degree: 'Master', duration: '2 years', tuition: 'AUD 40,000/year', intake: 'February, July' },
        ],
        tuitionRange: 'AUD 30,000 - 42,000 per year',
        features: ['Group of Eight', 'Global Campuses', 'Industry Partnerships', 'Research Led Teaching'],
        isFeatured: true,
      },
      {
        name: 'University of Waterloo',
        country: 'Canada',
        city: 'Waterloo',
        logo: '/images/unis/waterloo-logo.png',
        coverImage: '/images/unis/waterloo-cover.jpg',
        shortDescription: 'Home to the world\'s largest co-operative education program, located in Canada\'s tech hub.',
        description: 'The University of Waterloo is a public research university in Waterloo, Ontario, Canada. It is known for its cooperative education programs and is one of the top universities in Canada.',
        website: 'https://uwaterloo.ca',
        ranking: '#4 in Canada, #112 globally',
        founded: '1957',
        type: 'public',
        programs: [
          { name: 'Master of Data Science', degree: 'Master', duration: '2 years', tuition: 'CAD 30,000/year', intake: 'September' },
          { name: 'BCS (Computer Science)', degree: 'Bachelor', duration: '4 years', tuition: 'CAD 40,000/year', intake: 'September' },
        ],
        tuitionRange: 'CAD 30,000 - 45,000 per year',
        features: ['Largest Co-op Program', 'Tech Hub', 'Innovation', 'Startup Incubator'],
        isFeatured: false,
      },
      {
        name: 'University of Auckland',
        country: 'New Zealand',
        city: 'Auckland',
        logo: '/images/unis/auckland-logo.png',
        coverImage: '/images/unis/auckland-cover.jpg',
        shortDescription: 'New Zealand\'s highest-ranked university, a member of the Group of Eight.',
        description: 'The University of Auckland is the largest university in New Zealand, located in the country\'s largest city. It is ranked first in New Zealand and is a member of the Universitas 21 network.',
        website: 'https://www.auckland.ac.nz',
        ranking: '#1 in New Zealand, #68 globally',
        founded: '1883',
        type: 'public',
        programs: [
          { name: 'Master of Business Management', degree: 'Master', duration: '1.5 years', tuition: 'NZD 35,000/year', intake: 'February, July' },
          { name: 'Bachelor of Engineering', degree: 'Bachelor', duration: '4 years', tuition: 'NZD 32,000/year', intake: 'February' },
        ],
        tuitionRange: 'NZD 25,000 - 35,000 per year',
        features: ['#1 in NZ', 'Research Intensive', 'Diverse Campus', 'Beautiful City'],
        isFeatured: true,
      },
      {
        name: 'National University of Singapore',
        country: 'Singapore',
        city: 'Singapore',
        logo: '/images/unis/nus-logo.png',
        coverImage: '/images/unis/nus-cover.jpg',
        shortDescription: 'Asia\'s top university with a global approach to education and research.',
        description: 'The National University of Singapore is a public research university in Singapore. It is the oldest higher education institution in Singapore and consistently ranked as the top university in Asia.',
        website: 'https://www.nus.edu.sg',
        ranking: '#1 in Asia, #8 globally',
        founded: '1905',
        type: 'public',
        programs: [
          { name: 'Master of Computing', degree: 'Master', duration: '1.5 years', tuition: 'SGD 45,000/year', intake: 'August, January' },
          { name: 'BBA (Business Administration)', degree: 'Bachelor', duration: '4 years', tuition: 'SGD 35,000/year', intake: 'August' },
        ],
        tuitionRange: 'SGD 30,000 - 50,000 per year',
        features: ['#1 in Asia', 'Global Recognition', 'Strong Industry Links', 'Research Excellence'],
        isFeatured: true,
      },
      {
        name: 'RWTH Aachen University',
        country: 'Germany',
        city: 'Aachen',
        logo: '/images/unis/rwth-logo.png',
        coverImage: '/images/unis/rwth-cover.jpg',
        shortDescription: 'Germany\'s largest technical university, renowned for engineering and natural sciences.',
        description: 'RWTH Aachen University is a public research university in Aachen, North Rhine-Westphalia, Germany. It is the largest technical university in Germany with about 45,000 students.',
        website: 'https://www.rwth-aachen.de',
        ranking: '#1 Technical University in Germany',
        founded: '1870',
        type: 'public',
        programs: [
          { name: 'MSc Mechanical Engineering', degree: 'Master', duration: '2 years', tuition: '€0 (semester fee only)', intake: 'October' },
          { name: 'MSc Computer Science', degree: 'Master', duration: '2 years', tuition: '€0 (semester fee only)', intake: 'October' },
        ],
        tuitionRange: '€0 - €1,500 per semester',
        features: ['No Tuition', 'Engineering Excellence', 'Industry Partnerships', 'Research Powerhouse'],
        isFeatured: true,
      },
    ];

    const unis = await University.create(
      uniData.map((u) => ({ ...u, seo: u.seo || makeSeoFromEntity({ type: 'university', name: u.name, country: u.country }) })),
    );

    console.log(`${unis.length} universities created`);

    const courseData = [
      {
        name: 'Master of Business Administration (MBA)',
        category: 'Business',
        description: 'Develop leadership and management skills for the global business landscape.',
        duration: '1-2 years',
        degreeLevel: 'master',
        countries: ['Australia', 'Canada', 'UK', 'USA'],
        universities: [unis[0]._id, unis[1]._id, unis[2]._id],
        tuitionRange: 'AUD 35,000 - CAD 60,000 per year',
        intake: 'February, July, September',
        requirements: 'Bachelor\'s degree, GMAT/GRE (some), IELTS 6.5+, work experience preferred',
        careerOutcomes: 'Business Manager, Marketing Director, Financial Analyst, Entrepreneur',
        isFeatured: true,
      },
      {
        name: 'Master of Computer Science',
        category: 'Technology',
        description: 'Advance your skills in software development, AI, and data science.',
        duration: '1-2 years',
        degreeLevel: 'master',
        countries: ['Canada', 'USA', 'Germany', 'Australia'],
        universities: [unis[1]._id, unis[3]._id, unis[9]._id],
        tuitionRange: 'CAD 20,000 - USD 55,000 per year',
        intake: 'September, January',
        requirements: 'Bachelor\'s in CS or related field, GRE (some), IELTS 6.5+',
        careerOutcomes: 'Software Engineer, Data Scientist, AI Engineer, Tech Lead',
        isFeatured: true,
      },
      {
        name: 'Bachelor of Information Technology',
        category: 'Technology',
        description: 'Gain foundational knowledge in IT, networking, and software development.',
        duration: '3-4 years',
        degreeLevel: 'bachelor',
        countries: ['Australia', 'New Zealand', 'Canada'],
        universities: [unis[0]._id, unis[7]._id, unis[6]._id],
        tuitionRange: 'AUD 30,000 - CAD 40,000 per year',
        intake: 'February, July, September',
        requirements: 'High school completion, IELTS 6.0+',
        careerOutcomes: 'IT Support, Network Administrator, Web Developer, Systems Analyst',
        isFeatured: true,
      },
      {
        name: 'Master of Engineering',
        category: 'Engineering',
        description: 'Specialize in civil, mechanical, electrical, or software engineering.',
        duration: '2 years',
        degreeLevel: 'master',
        countries: ['Australia', 'Germany', 'Canada', 'UK'],
        universities: [unis[0]._id, unis[9]._id, unis[6]._id],
        tuitionRange: '€0 - AUD 42,000 per year',
        intake: 'February, July, October',
        requirements: 'Bachelor\'s in Engineering, IELTS 6.5+',
        careerOutcomes: 'Professional Engineer, Project Manager, Technical Consultant',
        isFeatured: true,
      },
      {
        name: 'Master of Data Science',
        category: 'Technology',
        description: 'Learn to analyze and interpret complex data using machine learning and statistics.',
        duration: '1-2 years',
        degreeLevel: 'master',
        countries: ['Australia', 'Canada', 'UK', 'USA'],
        universities: [unis[3]._id, unis[0]._id],
        tuitionRange: 'AUD 38,000 - CAD 48,000 per year',
        intake: 'February, September',
        requirements: 'Bachelor\'s degree, programming knowledge, IELTS 6.5+',
        careerOutcomes: 'Data Scientist, Data Analyst, Machine Learning Engineer, Business Analyst',
        isFeatured: true,
      },
      {
        name: 'Bachelor of Business Administration',
        category: 'Business',
        description: 'Build a strong foundation in business management, marketing, and finance.',
        duration: '3-4 years',
        degreeLevel: 'bachelor',
        countries: ['Australia', 'Canada', 'UK', 'USA'],
        universities: [unis[2]._id, unis[1]._id],
        tuitionRange: 'AUD 30,000 - CAD 48,000 per year',
        intake: 'February, July, September',
        requirements: 'High school completion, IELTS 6.0+',
        careerOutcomes: 'Marketing Executive, HR Manager, Financial Advisor, Entrepreneur',
        isFeatured: true,
      },
      {
        name: 'Master of Professional Accounting',
        category: 'Business',
        description: 'Gain accounting expertise recognized by CPA Australia and global accounting bodies.',
        duration: '2 years',
        degreeLevel: 'master',
        countries: ['Australia', 'New Zealand', 'UK'],
        universities: [unis[0]._id, unis[4]._id],
        tuitionRange: 'AUD 35,000 - GBP 25,000 per year',
        intake: 'February, July',
        requirements: 'Bachelor\'s degree, IELTS 6.5+',
        careerOutcomes: 'Chartered Accountant, Financial Controller, Tax Consultant, Auditor',
        isFeatured: false,
      },
      {
        name: 'PhD in Computer Science',
        category: 'Technology',
        description: 'Conduct original research in AI, machine learning, cybersecurity, or software engineering.',
        duration: '3-4 years',
        degreeLevel: 'phd',
        countries: ['USA', 'UK', 'Germany', 'Canada'],
        universities: [unis[1]._id, unis[9]._id],
        tuitionRange: 'Funded/€0 - USD 40,000 per year',
        intake: 'September, January',
        requirements: 'Master\'s degree, research proposal, IELTS 7.0+',
        careerOutcomes: 'Research Scientist, University Professor, R&D Director',
        isFeatured: false,
      },
    ];

    const courses = await Course.create(
      courseData.map((c) => ({ ...c, seo: c.seo || makeSeoFromEntity({ type: 'course', name: c.name, country: c.countries?.[0] }) })),
    );

    console.log(`${courses.length} courses created`);

    const scholarshipData = [
      {
        name: 'Australia Awards Scholarships',
        country: 'Australia',
        description: 'Full scholarships funded by the Australian Government for students from developing countries to study at Australian universities.',
        eligibility: 'Citizens of developing countries including Nepal, minimum 2 years work experience, strong academic background',
        amount: 'Full tuition, return airfare, living allowance, health insurance',
        type: 'government',
        deadline: new Date('2026-04-30'),
        applicationProcess: 'Apply through Australian Embassy in Nepal or online portal',
        requirements: ['Academic transcripts', 'Work experience letters', 'English proficiency', 'Statement of purpose', 'References'],
        link: 'https://www.dfat.gov.au/people-to-people/australia-awards',
        isFeatured: true,
      },
      {
        name: 'Chevening Scholarships',
        country: 'United Kingdom',
        description: 'UK government\'s global scholarship programme offering awards to outstanding professionals with leadership potential.',
        eligibility: 'Must have 2+ years work experience, return to home country for 2 years after studies, IELTS 6.5+',
        amount: 'Full tuition, monthly living allowance, travel costs, arrival allowance',
        type: 'government',
        deadline: new Date('2026-11-01'),
        applicationProcess: 'Apply online at chevening.org between August-November',
        requirements: ['Work experience', 'Leadership potential', 'Study plan', 'IELTS 6.5+', 'References'],
        link: 'https://www.chevening.org',
        isFeatured: true,
      },
      {
        name: 'DAAD Scholarships',
        country: 'Germany',
        description: 'German Academic Exchange Service scholarships for international students to study at German universities.',
        eligibility: 'Academic excellence, bachelor\'s degree (for master\'s), German/English proficiency depending on program',
        amount: 'Monthly stipend €934, travel allowance, health insurance, tuition waiver',
        type: 'government',
        deadline: new Date('2026-10-15'),
        applicationProcess: 'Apply through DAAD portal or German Embassy',
        requirements: ['Academic transcripts', 'Motivation letter', 'CV', 'Language proficiency', 'References'],
        link: 'https://www.daad.de/en/',
        isFeatured: true,
      },
      {
        name: 'University of Melbourne Graduate Scholarship',
        country: 'Australia',
        description: 'Merit-based scholarships for graduate students at the University of Melbourne.',
        eligibility: 'Outstanding academic achievement in undergraduate studies, unconditional offer from Melbourne',
        amount: 'AUD 10,000 - 30,000 per year tuition remission',
        type: 'university',
        deadline: new Date('2026-03-31'),
        applicationProcess: 'Automatic consideration with graduate application',
        requirements: ['Academic excellence', 'Unconditional offer', 'Research potential'],
        link: 'https://scholarships.unimelb.edu.au',
        isFeatured: false,
      },
      {
        name: 'Fulbright Foreign Student Program',
        country: 'United States',
        description: 'Prestigious US government scholarship for graduate studies and research in the United States.',
        eligibility: 'Nepali citizens, strong academic background, English proficiency, leadership qualities',
        amount: 'Full tuition, living stipend, airfare, health insurance, book allowance',
        type: 'government',
        deadline: new Date('2026-06-30'),
        applicationProcess: 'Apply through Fulbright Commission in Nepal',
        requirements: ['Academic transcripts', 'GRE/GMAT', 'TOEFL/IELTS', 'References', 'Personal statement'],
        link: 'https://fulbright.org.np',
        isFeatured: true,
      },
      {
        name: 'Utrecht Excellence Scholarships',
        country: 'Netherlands',
        description: 'Excellent scholarships for non-EU/EEA students to pursue a master\'s degree at Utrecht University.',
        eligibility: 'Top 10% of graduating class, non-EU/EEA nationality, admitted to Utrecht University master\'s program',
        amount: '€22,000 - €27,000 per year (covers tuition and living)',
        type: 'university',
        deadline: new Date('2026-02-01'),
        applicationProcess: 'Apply through the university\'s scholarship portal',
        requirements: ['Academic excellence', 'Admission to master\'s program', 'Statement of financial need'],
        link: 'https://www.uu.nl/en/scholarships',
        isFeatured: false,
      },
    ];

    const scholarships = await Scholarship.create(
      scholarshipData.map((s) => ({ ...s, seo: s.seo || makeSeoFromEntity({ type: 'scholarship', name: s.name, country: s.country }) })),
    );

    console.log(`${scholarships.length} scholarships created`);

    const team = await TeamMember.insertMany([
      {
        name: 'Rajesh Sharma',
        position: 'Managing Director',
        avatar: '/images/team/rajesh.jpg',
        bio: 'With over 15 years of experience in the education consultancy industry, Rajesh has helped thousands of students achieve their dreams of studying abroad. He holds an MBA from the University of Sydney and is passionate about providing quality education guidance.',
        specialization: 'Australia & Canada',
        email: 'rajesh@eduvia.com',
        phone: '+977-9841234567',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/rajesh-sharma',
          facebook: 'https://facebook.com/rajesh.sharma',
        },
        order: 1,
      },
      {
        name: 'Priya Patel',
        position: 'Senior Counselor',
        avatar: '/images/team/priya.jpg',
        bio: 'Priya specializes in UK and European education destinations. With a background in international education and a Master\'s degree from the University of Manchester, she provides expert guidance on university selection and application processes.',
        specialization: 'UK & Europe',
        email: 'priya@eduvia.com',
        phone: '+977-9841234568',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/priya-patel',
          facebook: 'https://facebook.com/priya.patel',
        },
        order: 2,
      },
      {
        name: 'Anil Kumar Thapa',
        position: 'Immigration Expert',
        avatar: '/images/team/anil.jpg',
        bio: 'Anil is a registered migration agent with extensive knowledge of student visa processes for Australia, Canada, and New Zealand. He ensures every application is handled with precision and professionalism.',
        specialization: 'Visa & Immigration',
        email: 'anil@eduvia.com',
        phone: '+977-9841234569',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/anil-thapa',
        },
        order: 3,
      },
      {
        name: 'Suman Gurung',
        position: 'Student Relations Manager',
        avatar: '/images/team/suman.jpg',
        bio: 'Suman manages student relationships and ensures a smooth transition for students moving abroad. She helps with pre-departure orientation, accommodation arrangements, and ongoing support.',
        specialization: 'Student Support',
        email: 'suman@eduvia.com',
        phone: '+977-9841234570',
        socialLinks: {
          facebook: 'https://facebook.com/suman.gurung',
          instagram: 'https://instagram.com/suman.gurung',
        },
        order: 4,
      },
      {
        name: 'Nisha Magar',
        position: 'Documentation Specialist',
        avatar: '/images/team/nisha.jpg',
        bio: 'Nisha ensures all student documentation is complete and accurate for university applications and visa submissions. Her attention to detail has helped countless students avoid delays in their application process.',
        specialization: 'Documentation',
        email: 'nisha@eduvia.com',
        phone: '+977-9841234571',
        socialLinks: {
          linkedin: 'https://linkedin.com/in/nisha-magar',
          facebook: 'https://facebook.com/nisha.magar',
        },
        order: 5,
      },
    ]);

    console.log(`${team.length} team members created`);

    const faqs = await FAQ.insertMany([
      {
        question: 'How do I start the process of studying abroad?',
        answer: 'Start by visiting our office or filling out the inquiry form on our website. Our counselors will assess your profile, discuss your goals, and guide you through university selection, application, and visa processes.',
        category: 'general',
        order: 1,
      },
      {
        question: 'What are the requirements for studying in Australia?',
        answer: 'Requirements include: academic transcripts, English proficiency test scores (IELTS 6.0+), financial documents showing capacity to cover tuition and living costs, valid passport, and health insurance (OSHC). Some courses may require additional documents like work experience or portfolio.',
        category: 'australia',
        order: 2,
      },
      {
        question: 'How much does it cost to study in Canada?',
        answer: 'Tuition fees range from CAD 15,000-35,000 per year depending on the institution and program. Living costs range from CAD 10,000-15,000 per year. Scholarships and part-time work opportunities can help offset costs.',
        category: 'canada',
        order: 3,
      },
      {
        question: 'Can I work while studying abroad?',
        answer: 'Yes, most study abroad destinations allow part-time work. Australia allows 48 hours per fortnight, Canada allows 20 hours per week, UK allows 20 hours per week during term, and similar provisions exist in other countries. Full-time work is usually allowed during scheduled breaks.',
        category: 'general',
        order: 4,
      },
      {
        question: 'How long does the visa process take?',
        answer: 'Visa processing times vary by country: Australia (4-8 weeks), Canada (4-16 weeks), UK (3-6 weeks), USA (varies with interview scheduling). We recommend applying at least 3-4 months before your intended start date.',
        category: 'general',
        order: 5,
      },
      {
        question: 'Do you offer scholarships assistance?',
        answer: 'Yes, we help students identify and apply for scholarships based on their profile. We assist with scholarship applications including essay writing, document preparation, and interview preparation for prestigious scholarships like Australia Awards, Chevening, DAAD, and Fulbright.',
        category: 'general',
        order: 6,
      },
      {
        question: 'What if my visa gets rejected?',
        answer: 'In case of visa rejection, we analyze the reasons and help you reapply with a stronger application. We also explore alternative options such as different universities, countries, or intake dates. Our success rate for reapplications is very high.',
        category: 'general',
        order: 7,
      },
      {
        question: 'How does Eduvia charge for its services?',
        answer: 'Eduvia provides free counseling and guidance. Our revenue comes from university commissions, so students don\'t pay extra for our services. For premium services like SOP writing and mock interviews, nominal fees may apply. We are transparent about all costs.',
        category: 'general',
        order: 8,
      },
    ]);

    console.log(`${faqs.length} FAQs created`);

    const serviceData = [
      {
        title: 'University Selection & Application',
        icon: 'University',
        description: 'Expert guidance on choosing the right university and program based on your academic profile, career goals, and budget.',
        features: [
          'Personalized university shortlisting',
          'Application strategy development',
          'SOP and essay writing assistance',
          'Document preparation and review',
          'Application submission and follow-up',
        ],
        detailedContent: 'Our experienced counselors analyze your academic background, test scores, financial situation, and career aspirations to shortlist the best universities. We assist with the entire application process from filling out forms to writing compelling statements of purpose.',
        image: '/images/services/university.jpg',
        order: 1,
      },
      {
        title: 'Visa Assistance',
        icon: 'Visa',
        description: 'Complete visa guidance and preparation for student visas across all major study destinations.',
        features: [
          'Visa requirement analysis',
          'Document checklist preparation',
          'Financial documentation guidance',
          'Visa application form filling',
          'Mock visa interview preparation',
        ],
        detailedContent: 'Our immigration experts stay updated with the latest visa regulations for each country. We prepare you thoroughly for the visa process including financial documentation, health insurance, and interview preparation.',
        image: '/images/services/visa.jpg',
        order: 2,
      },
      {
        title: 'English Test Preparation',
        icon: 'English',
        description: 'Comprehensive coaching for IELTS, TOEFL, PTE, and Duolingo English Test.',
        features: [
          'Diagnostic test and personalized study plan',
          'Expert instructors with high band scores',
          'Practice tests and mock exams',
          'One-on-one feedback sessions',
          'Flexible class schedules',
        ],
        detailedContent: 'Our English test preparation program is designed to help you achieve your target score. We offer both in-person and online classes with experienced instructors who have achieved top scores themselves.',
        image: '/images/services/english.jpg',
        order: 3,
      },
      {
        title: 'Scholarship Guidance',
        icon: 'Scholarship',
        description: 'Help students find and apply for scholarships, grants, and financial aid opportunities.',
        features: [
          'Scholarship database search',
          'Application strategy',
          'Essay and personal statement review',
          'Reference letter guidance',
          'Interview preparation',
        ],
        detailedContent: 'We maintain an updated database of scholarships available for Nepali students. Our team helps you identify opportunities matching your profile and guides you through the application process.',
        image: '/images/services/scholarship.jpg',
        order: 4,
      },
      {
        title: 'SOP & Documentation',
        icon: 'Document',
        description: 'Professional assistance with Statement of Purpose, CV, and all academic documentation.',
        features: [
          'SOP/CV writing and editing',
          'Academic document verification',
          'Translation services',
          'Notarization guidance',
          'Document courier assistance',
        ],
        detailedContent: 'A well-crafted SOP and properly organized documents are crucial for university applications. Our documentation specialists help you present your profile in the best possible way.',
        image: '/images/services/documentation.jpg',
        order: 5,
      },
      {
        title: 'Pre-Departure Orientation',
        icon: 'Orientation',
        description: 'Comprehensive preparation for life abroad including cultural orientation and practical tips.',
        features: [
          'Cultural orientation sessions',
          'Travel and packing guidance',
          'Banking and finance setup',
          'Accommodation assistance',
          'Airport pickup coordination',
        ],
        detailedContent: 'Our pre-departure program ensures you are fully prepared for your journey. We cover everything from what to pack to how to open a bank account and navigate public transport.',
        image: '/images/services/orientation.jpg',
        order: 6,
      },
      {
        title: 'Career Counseling',
        icon: 'Career',
        description: 'Professional career guidance to align your study plan with long-term career goals.',
        features: [
          'Career assessment and planning',
          'Industry trend analysis',
          'Resume building workshops',
          'Interview preparation',
          'Networking guidance',
        ],
        detailedContent: 'We help you choose courses and universities that align with your career goals. Our career counselors provide insights into job markets and industry demands in various countries.',
        image: '/images/services/career.jpg',
        order: 7,
      },
      {
        title: 'Accommodation Assistance',
        icon: 'Accommodation',
        description: 'Help finding safe and affordable housing near your university.',
        features: [
          'On-campus housing applications',
          'Private rental search',
          'Homestay arrangements',
          'Shared accommodation matching',
          'Lease review assistance',
        ],
        detailedContent: 'Finding the right accommodation is crucial for a successful study experience. We help you find options that fit your budget and preferences, whether on-campus or private rental.',
        image: '/images/services/accommodation.jpg',
        order: 8,
      },
      {
        title: 'Airport Pickup & Settling',
        icon: 'Airport',
        description: 'Smooth transition with airport pickup and initial settling-in assistance abroad.',
        features: [
          'Airport pickup arrangement',
          'SIM card and connectivity setup',
          'University enrollment assistance',
          'Bank account opening help',
          'City orientation tour',
        ],
        detailedContent: 'Our team or partners in your destination country will welcome you at the airport and help you settle in during your first few days. We ensure your transition is smooth and comfortable.',
        image: '/images/services/airport.jpg',
        order: 9,
      },
      {
        title: 'Visa Extension & PR Guidance',
        icon: 'PR',
        description: 'Support for visa extensions, work permits, and permanent residency pathways.',
        features: [
          'Visa extension applications',
          'Work permit guidance',
          'PR pathway counseling',
          'Skills assessment assistance',
          'Migration planning',
        ],
        detailedContent: 'We don\'t just help you get there — we help you stay and build your future. Our immigration experts guide you through visa extensions, graduate work visas, and permanent residency pathways.',
        image: '/images/services/pr.jpg',
        order: 10,
      },
      {
        title: 'Parent Visa Assistance',
        icon: 'Parent',
        description: 'Helping families reunite through parent and family visa applications.',
        features: [
          'Parent visa assessment',
          'Application preparation',
          'Financial documentation',
          'Health insurance arrangement',
          'Follow-up and tracking',
        ],
        detailedContent: 'We assist families in reuniting through parent visa applications for countries like Australia, Canada, and New Zealand. Our team handles the complex documentation and application process.',
        image: '/images/services/parent-visa.jpg',
        order: 11,
      },
      {
        title: 'Corporate Training',
        icon: 'Training',
        description: 'Professional development and training programs for corporate clients.',
        features: [
          'English language training',
          'Cross-cultural communication',
          'International business etiquette',
          'Leadership development',
          'Team building workshops',
        ],
        detailedContent: 'Eduvia offers corporate training programs designed to enhance professional skills. We provide customized training solutions for organizations looking to develop their workforce.',
        image: '/images/services/training.jpg',
        order: 12,
      },
    ];

    const services = await Service.create(
      serviceData.map((s) => ({ ...s, seo: s.seo || makeSeoFromEntity({ type: 'service', name: s.title }) })),
    );

    console.log(`${services.length} services created`);

    await SiteSettings.create({
      company: {
        name: 'Eduvia Consultancy Pvt. Ltd.',
        logo: '/logo.png',
        tagline: 'Your Gateway to Global Education',
        description: 'Eduvia Consultancy Pvt. Ltd. is a leading education consultancy in Nepal, dedicated to helping students achieve their dreams of studying abroad. With over 15 years of experience, we have helped thousands of students successfully enroll in top universities worldwide.',
      },
      contact: {
        phone: ['+977-1-4567890', '+977-9841234567'],
        email: ['info@eduvia.com', 'admissions@eduvia.com'],
        address: 'Thamel, Kathmandu, Nepal',
        whatsapp: '+977-9841234567',
        facebook: 'https://facebook.com/eduviaconsultancy',
        instagram: 'https://instagram.com/eduviaconsultancy',
        tiktok: 'https://tiktok.com/@eduviaconsultancy',
        linkedin: 'https://linkedin.com/company/eduvia-consultancy',
        youtube: 'https://youtube.com/@eduviaconsultancy',
      },
      socialMedia: {
        facebook: 'https://facebook.com/eduviaconsultancy',
        instagram: 'https://instagram.com/eduviaconsultancy',
        tiktok: 'https://tiktok.com/@eduviaconsultancy',
        linkedin: 'https://linkedin.com/company/eduvia-consultancy',
        youtube: 'https://youtube.com/@eduviaconsultancy',
        twitter: 'https://twitter.com/eduviaconsultancy',
      },
      officeHours: 'Sun-Fri: 9:00 AM - 5:00 PM | Saturday: Closed',
      statistics: [
        { label: 'Students Placed', value: '5000+' },
        { label: 'Partner Universities', value: '100+' },
        { label: 'Countries', value: '12+' },
        { label: 'Success Rate', value: '98%' },
        { label: 'Years Experience', value: '15+' },
        { label: 'Happy Families', value: '4000+' },
      ],
      heroSettings: {
        title: 'Your Gateway to Global Education',
        subtitle: 'Empowering Nepali students to achieve their dreams of studying abroad since 2009',
        backgroundImage: '/images/hero-bg.jpg',
      },
      seo: {
        title: 'Eduvia Consultancy - Study Abroad Consultancy in Nepal | Kathmandu',
        description: 'Eduvia Consultancy Pvt. Ltd. is a premier education consultancy in Nepal helping students study in Australia, Canada, UK, USA, New Zealand, Japan, Germany, and more. Expert guidance for university selection, visa processing, and career counseling.',
        keywords: ['study abroad', 'education consultancy nepal', 'study in australia', 'study in canada', 'study in uk', 'student visa', 'kathmandu'],
      },
      footerSettings: {
        copyright: `© ${new Date().getFullYear()} Eduvia Consultancy Pvt. Ltd. All rights reserved.`,
      },
    });

    console.log('Site settings created');

    // Page SEO rows are created deliberately EMPTY. An empty row means "use the
    // default compiled into the frontend", so day-one output is byte-identical
    // to before, and the copy is not duplicated here where it would drift out
    // of sync with the JSX. These rows exist so the admin has something to edit.
    const pageSeo = await PageSeo.insertMany(
      PAGES.map((page) => ({ key: page.key, label: page.label, path: page.path, seo: {} }))
    );

    console.log(`${pageSeo.length} page SEO rows created`);

    const testimonials = await Testimonial.insertMany([
      {
        studentName: 'Aarav Sharma',
        country: 'Australia',
        university: 'University of Melbourne',
        course: 'Master of IT',
        quote: 'Eduvia made my dream of studying at the University of Melbourne a reality. From university selection to visa approval, their team guided me every step of the way. I am now working in Melbourne and living my dream!',
        rating: 5,
        isFeatured: true,
      },
      {
        studentName: 'Srijana Thapa',
        country: 'Canada',
        university: 'University of Toronto',
        course: 'MBA',
        quote: 'I had almost given up on my dream of studying in Canada due to visa rejections from other consultancies. Eduvia\'s immigration expert, Anil sir, helped me understand my mistakes and reapply successfully. Now I am at UofT!',
        rating: 5,
        isFeatured: true,
      },
      {
        studentName: 'Bikash Rai',
        country: 'United Kingdom',
        university: 'University of Manchester',
        course: 'MSc Data Science',
        quote: 'The counselors at Eduvia are incredibly knowledgeable. They helped me secure a Chevening Scholarship and get into the University of Manchester. Their guidance on the SOP was invaluable.',
        rating: 5,
        isFeatured: true,
      },
    ]);

    console.log(`${testimonials.length} testimonials created`);

    const stories = await SuccessStory.insertMany([
      {
        studentName: 'Prativa Gurung',
        country: 'Australia',
        university: 'Monash University',
        course: 'Bachelor of Business',
        intake: 'February 2023',
        testimonial: 'I applied through Eduvia in 2022 and got my student visa within 6 weeks. The team was incredibly supportive throughout the process. I am now in my final year at Monash and have received a graduate position at Deloitte Melbourne.',
        isFeatured: true,
      },
      {
        studentName: 'Roshan Shrestha',
        country: 'Canada',
        university: 'University of British Columbia',
        course: 'Master of Data Science',
        intake: 'September 2023',
        testimonial: 'After completing my Bachelor\'s in Nepal, I wanted to pursue my Master\'s in Canada. Eduvia helped me get into UBC with a scholarship. The entire process from application to visa was smooth and well-managed.',
        isFeatured: true,
      },
      {
        studentName: 'Sita Karki',
        country: 'Germany',
        university: 'RWTH Aachen',
        course: 'MSc Mechanical Engineering',
        intake: 'October 2023',
        testimonial: 'Studying in Germany was my dream because of zero tuition fees. Eduvia guided me through the uni-assist process, blocked account setup, and visa application. I am now pursuing my Master\'s at RWTH Aachen with no tuition burden.',
        isFeatured: true,
      },
    ]);

    console.log(`${stories.length} success stories created`);

    const blogData = [
      {
        title: 'Complete Guide to Studying in Australia in 2026',
        author: 'Eduvia Team',
        content: `<h2>Why Study in Australia?</h2>
<p>Australia is one of the most popular study abroad destinations for international students, especially from Nepal. With world-ranked universities, post-study work opportunities, and a high quality of life, Australia offers an excellent environment for academic and personal growth.</p>

<h2>Top Universities in Australia</h2>
<p>Australia is home to 8 universities in the global top 100, including the University of Melbourne, University of Sydney, and ANU. These universities are known for their research excellence and graduate employability.</p>

<h2>Cost of Studying in Australia</h2>
<p>Tuition fees range from AUD 20,000 to 45,000 per year depending on the course and university. Living costs are estimated at AUD 21,041 per year for visa purposes. Scholarships like Australia Awards and Destination Australia can significantly reduce costs.</p>

<h2>Student Visa Process</h2>
<p>The Subclass 500 student visa allows you to study full-time in Australia. You need to show evidence of enrollment (CoE), financial capacity, English proficiency, and health insurance (OSHC). Processing typically takes 4-8 weeks.</p>

<h2>Post-Study Work Opportunities</h2>
<p>The Subclass 485 Graduate Visa allows you to stay and work in Australia for 2-4 years after graduation. This is an excellent pathway to gaining work experience and potentially permanent residency.</p>`,
        excerpt: 'Everything you need to know about studying in Australia as a Nepali student - from university selection to visa process and post-study work.',
        featuredImage: '/images/blogs/study-in-australia.jpg',
        category: 'Destinations',
        tags: ['Australia', 'Study Abroad', 'Student Visa', 'Post-Study Work'],
        readTime: 8,
        isPublished: true,
        publishedAt: new Date('2025-12-01'),
        seo: {
          title: 'Complete Guide to Studying in Australia 2026 | Eduvia Consultancy',
          description: 'Everything you need to know about studying in Australia - university selection, visa process, costs, scholarships, and post-study work opportunities.',
          keywords: ['study in australia', 'australia student visa', 'australian universities', 'post study work australia'],
        },
        views: 1250,
      },
      {
        title: 'Canada vs Australia: Which is Better for Nepali Students?',
        author: 'Priya Patel',
        content: `<h2>The Great Debate: Canada or Australia?</h2>
<p>Choosing between Canada and Australia is one of the most common dilemmas for Nepali students planning to study abroad. Both countries offer excellent education, post-study work rights, and pathways to permanent residency. Let\'s compare them across key factors.</p>

<h2>Tuition Costs</h2>
<p><strong>Canada:</strong> CAD 15,000-35,000 per year<br/>
<strong>Australia:</strong> AUD 20,000-45,000 per year<br/>
Canada generally has lower tuition fees, especially for diploma programs.</p>

<h2>Living Costs</h2>
<p><strong>Canada:</strong> CAD 10,000-15,000 per year<br/>
<strong>Australia:</strong> AUD 21,041 per year (visa requirement)<br/>
Australia has a higher cost of living, particularly in Sydney and Melbourne.</p>

<h2>Post-Study Work</h2>
<p><strong>Canada:</strong> PGWP up to 3 years<br/>
<strong>Australia:</strong> Subclass 485 up to 4 years<br/>
Both countries offer generous post-study work rights.</p>

<h2>PR Pathway</h2>
<p>Both countries offer clear pathways to permanent residency. Canada\'s Express Entry and Provincial Nominee Programs, and Australia\'s General Skilled Migration program are popular routes.</p>

<h2>Our Verdict</h2>
<p>The best choice depends on your budget, course preference, and career goals. Visit Eduvia for a personalized consultation to determine which country is right for you.</p>`,
        excerpt: 'A detailed comparison of Canada and Australia for Nepali students covering tuition, living costs, work rights, and PR pathways.',
        featuredImage: '/images/blogs/canada-vs-australia.jpg',
        category: 'Comparisons',
        tags: ['Canada', 'Australia', 'Comparison', 'Study Abroad'],
        readTime: 6,
        isPublished: true,
        publishedAt: new Date('2025-11-15'),
        seo: {
          title: 'Canada vs Australia for Nepali Students 2026 | Eduvia',
          description: 'Detailed comparison of Canada and Australia for Nepali students - costs, work rights, PR pathway, and which is better for your situation.',
          keywords: ['canada vs australia', 'study abroad comparison', 'nepali students', 'which country better'],
        },
        views: 980,
      },
      {
        title: 'How to Write a Winning Statement of Purpose (SOP)',
        author: 'Nisha Magar',
        content: `<h2>What is a Statement of Purpose?</h2>
<p>A Statement of Purpose (SOP) is a critical document in your university application. It\'s your chance to tell the admissions committee who you are, why you want to study the chosen course, and how it aligns with your career goals.</p>

<h2>Key Elements of a Strong SOP</h2>
<p>1. <strong>Introduction:</strong> Start with a compelling hook that grabs attention.<br/>
2. <strong>Academic Background:</strong> Highlight relevant academic achievements.<br/>
3. <strong>Professional Experience:</strong> Mention relevant work experience and skills.<br/>
4. <strong>Why This Course:</strong> Explain why you chose this specific program.<br/>
5. <strong>Why This University:</strong> Show you\'ve researched the university and program.<br/>
6. <strong>Career Goals:</strong> Clear short-term and long-term career objectives.<br/>
7. <strong>Conclusion:</strong> Summarize and end with enthusiasm.</p>

<h2>Common Mistakes to Avoid</h2>
<p>- Being too generic (not tailoring to each university)<br/>
- Plagiarizing or using templates<br/>
- Exceeding the word limit<br/>
- Focusing on personal hardships instead of achievements<br/>
- Not proofreading for grammar and spelling</p>

<h2>Sample SOP Structure</h2>
<p>A typical SOP is 500-1000 words and follows a clear narrative arc. At Eduvia, we help students craft personalized, compelling SOPs that stand out.</p>`,
        excerpt: 'Learn how to write a compelling Statement of Purpose that gets you admitted to top universities abroad.',
        featuredImage: '/images/blogs/sop-writing.jpg',
        category: 'Tips',
        tags: ['SOP', 'Application Tips', 'University Application', 'Writing Tips'],
        readTime: 5,
        isPublished: true,
        publishedAt: new Date('2025-11-01'),
        seo: {
          title: 'How to Write a Winning SOP | Statement of Purpose Guide',
          description: 'Complete guide to writing a compelling Statement of Purpose for university applications abroad. Tips, structure, and common mistakes to avoid.',
          keywords: ['statement of purpose', 'SOP writing', 'university application', 'study abroad tips'],
        },
        views: 750,
      },
    ];

    const blogs = await Blog.create(blogData);

    console.log(`${blogs.length} blog posts created`);

    console.log('\n--- Seeding Complete! ---');
    console.log('Admin login: admin@eduvia.com / admin123');
    console.log(`Created: ${destinations.length} destinations, ${unis.length} universities, ${courses.length} courses, ${scholarships.length} scholarships, ${team.length} team members, ${faqs.length} FAQs, ${services.length} services, ${testimonials.length} testimonials, ${stories.length} success stories, ${blogs.length} blogs`);

    process.exit(0);
  } catch (error) {
    console.error('Seeding error:', error);
    process.exit(1);
  }
};

seed();
