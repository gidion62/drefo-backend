require('dotenv').config();
const mongoose = require('mongoose');
const Admin    = require('../models/Admin');
const Project  = require('../models/Project');
const Update   = require('../models/Update');
const Gallery  = require('../models/Gallery');

const connectDB = require('../config/db');

const seedProjects = [
  {
    title: 'Education & Entrepreneurship',
    description: 'Empowering young minds with skills, knowledge, and opportunities for a self-sustaining future through vocational training and educational support.',
    category: 'Education',
    status: 'Active',
    image: '/images/project-education.jpg',
    featured: true,
    order: 1,
  },
  {
    title: 'Free Pad Initiative',
    description: 'Breaking barriers in menstrual health by providing free sanitary pads and health education to young women across communities.',
    category: 'Health',
    status: 'Active',
    image: '/images/project-health-pads.jpg',
    featured: true,
    order: 2,
  },
  {
    title: 'Thanksgiving Project',
    description: 'Bringing communities together through shared meals and food distribution, fostering unity and support for families in need.',
    category: 'Community',
    status: 'Active',
    image: '/images/project-thanksgiving.jpg',
    order: 3,
  },
  {
    title: 'Door to Door Outreach',
    description: 'Reaching the most vulnerable through personalized home visits, delivering supplies, support, and connecting families with resources.',
    category: 'Community',
    status: 'Active',
    image: '/images/project-outreach.jpg',
    order: 4,
  },
  {
    title: 'Kuwa Unachotaka (Dreamers)',
    description: 'Inspiring youth to pursue their dreams through mentorship, career guidance, and exposure to new opportunities and possibilities.',
    category: 'Youth',
    status: 'Active',
    image: '/images/project-dreamers.jpg',
    order: 5,
  },
  {
    title: "The Girl's Archive",
    description: "Documenting and celebrating the stories of young women in our communities, preserving their voices and inspiring future generations.",
    category: 'Empowerment',
    status: 'Active',
    image: '/images/project-girls-archive.jpg',
    order: 6,
  },
  {
    title: 'Talk to Your Child',
    description: 'Strengthening family bonds through workshops that help parents communicate effectively with their children about life challenges.',
    category: 'Family',
    status: 'Active',
    image: '/images/project-talk-child.jpg',
    order: 7,
  },
  {
    title: 'Rafiki Project',
    description: 'Building a network of friendship and mutual support within communities, creating lasting connections that strengthen social fabric.',
    category: 'Friendship',
    status: 'Active',
    image: '/images/project-rafiki.jpg',
    order: 8,
  },
];

const seedUpdates = [
  {
    title: 'Community Health Fair Reaches 500+ Families',
    excerpt: 'Our recent health fair brought essential medical services, health education, and free screenings to over 500 families in the Moshi region.',
    content: 'Local health workers and DREFO volunteers collaborated to provide checkups, distribute health supplies, and connect community members with ongoing care resources.',
    date: 'March 15, 2025',
    image: '/images/update-1.jpg',
    published: true,
    featured: true,
  },
  {
    title: 'New Educational Materials Distributed to Schools',
    excerpt: "Thanks to the generosity of our donors, we delivered over 2,000 textbooks, notebooks, and learning supplies to 12 schools across 5 communities.",
    content: 'Teachers reported immediate impact as students eagerly embraced their new materials.',
    date: 'February 28, 2025',
    image: '/images/update-2.jpg',
    published: true,
  },
  {
    title: 'Annual Community Celebration Brings Hope',
    excerpt: "Hundreds of community members gathered to celebrate achievements from the past year and share stories of transformation.",
    content: 'The event featured performances, awards for outstanding volunteers, and a shared vision for the year ahead.',
    date: 'January 20, 2025',
    image: '/images/update-3.jpg',
    published: true,
  },
  {
    title: 'Free Pad Initiative Expands to Three New Communities',
    excerpt: 'Our menstrual health program has grown to serve three additional communities, reaching over 200 more young women with sanitary supplies and health education.',
    date: 'December 10, 2024',
    image: '/images/project-health-pads.jpg',
    published: true,
  },
  {
    title: 'Youth Entrepreneurship Workshop Sparks Innovation',
    excerpt: 'A week-long workshop brought together 50 young entrepreneurs to learn business skills, financial literacy, and creative problem-solving.',
    date: 'November 5, 2024',
    image: '/images/project-dreamers.jpg',
    published: true,
  },
  {
    title: 'Door to Door Campaign Connects with 300 Families',
    excerpt: 'Our outreach team visited homes across three villages, identifying families in need and connecting them with DREFO programs.',
    date: 'October 18, 2024',
    image: '/images/project-outreach.jpg',
    published: true,
  },
];

const seedGallery = [
  { src: '/images/hero-community.jpg',      alt: 'Community aid workers in Tanzania',  category: 'Community', order: 1 },
  { src: '/images/project-education.jpg',   alt: 'Children in classroom',              category: 'Education', order: 2 },
  { src: '/images/project-health-pads.jpg', alt: 'Health education session',           category: 'Health',    order: 3 },
  { src: '/images/project-thanksgiving.jpg',alt: 'Community Thanksgiving gathering',   category: 'Community', order: 4 },
  { src: '/images/project-outreach.jpg',    alt: 'Door to door outreach',              category: 'Community', order: 5 },
  { src: '/images/project-dreamers.jpg',    alt: 'Youth empowerment workshop',         category: 'Youth',     order: 6 },
  { src: '/images/project-girls-archive.jpg', alt: "Girl's mentorship program",        category: 'Empowerment', order: 7 },
  { src: '/images/project-talk-child.jpg',  alt: 'Family communication workshop',     category: 'Family',    order: 8 },
  { src: '/images/project-rafiki.jpg',      alt: 'Friendship and community support',  category: 'Community', order: 9 },
  { src: '/images/volunteer-team.jpg',      alt: 'Volunteers working together',       category: 'Volunteers', order: 10 },
  { src: '/images/update-1.jpg',            alt: 'Community health fair',             category: 'Health',    order: 11 },
  { src: '/images/update-2.jpg',            alt: 'School children with supplies',     category: 'Education', order: 12 },
  { src: '/images/update-3.jpg',            alt: 'Community celebration',             category: 'Community', order: 13 },
  { src: '/images/about-founder.jpg',       alt: 'DREFO founder portrait',            category: 'General',   order: 14 },
  { src: '/images/gallery-1.jpg',           alt: 'Children learning outdoors',        category: 'Education', order: 15 },
  { src: '/images/gallery-2.jpg',           alt: 'Food distribution event',           category: 'Community', order: 16 },
  { src: '/images/gallery-3.jpg',           alt: 'Youth discussion circle',           category: 'Youth',     order: 17 },
  { src: '/images/gallery-4.jpg',           alt: 'Women health education',            category: 'Health',    order: 18 },
  { src: '/images/gallery-5.jpg',           alt: 'Community building project',        category: 'Community', order: 19 },
  { src: '/images/gallery-6.jpg',           alt: 'Girl reading under tree',           category: 'Education', order: 20 },
];

const run = async () => {
  await connectDB();

  console.log('🌱  Starting seed...\n');

  // ── Admin ──────────────────────────────────
  const existingAdmin = await Admin.findOne({ email: process.env.ADMIN_EMAIL });
  if (!existingAdmin) {
    await Admin.create({
      name: 'DREFO Admin',
      email: process.env.ADMIN_EMAIL || 'admin@DREFO.org',
      password: process.env.ADMIN_PASSWORD || 'Admin@DREFO2025!',
      role: 'superadmin',
    });
    console.log(`✅  Admin created: ${process.env.ADMIN_EMAIL}`);
  } else {
    console.log(`ℹ️   Admin already exists: ${existingAdmin.email}`);
  }

  // ── Projects ───────────────────────────────
  await Project.deleteMany({});
  await Project.insertMany(seedProjects);
  console.log(`✅  ${seedProjects.length} projects seeded`);

  // ── Updates ────────────────────────────────
  await Update.deleteMany({});
  await Update.insertMany(seedUpdates);
  console.log(`✅  ${seedUpdates.length} updates seeded`);

  // ── Gallery ────────────────────────────────
  await Gallery.deleteMany({});
  await Gallery.insertMany(seedGallery);
  console.log(`✅  ${seedGallery.length} gallery items seeded`);

  console.log('\n🎉  Seed complete!\n');
  process.exit(0);
};

run().catch((err) => {
  console.error('❌  Seed failed:', err);
  process.exit(1);
});
