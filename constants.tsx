
import { Skill, Project, Experience } from './types';

export const SKILLS: Skill[] = [
  { name: 'PHP 8.x', category: 'Language' },
  { name: 'Laravel', category: 'Framework' },
  { name: 'Eloquent ORM', category: 'Framework' },
  { name: 'MySQL / PostgreSQL', category: 'Database' },
  { name: 'Redis', category: 'Database' },
  { name: 'RESTful APIs', category: 'Concept' },
  { name: 'Docker', category: 'Tools' },
  { name: 'Git & GitHub Actions', category: 'Tools' },
  { name: 'Clean Architecture', category: 'Concept' },
  { name: 'Linux / Nginx', category: 'Tools' },
  { name: 'TDD (PHPUnit)', category: 'Concept' },
  { name: 'Queue Workers', category: 'Framework' },
];

export const PROJECTS: Project[] = [
  {
    id: '1',
    title: 'Enterprise ERP Microservice',
    description: 'A scalable inventory management backend built with Laravel and PostgreSQL.',
    longDescription: 'Developed a robust microservice-based ERP system that handles high-concurrency inventory transactions for a multi-warehouse retail chain.',
    techStack: ['Laravel', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Docker'],
    features: ['Real-time inventory sync', 'JWT-based Auth', 'Automated PDF invoicing'],
    architecture: 'Microservices architecture with API Gateway and central authentication service.',
    githubUrl: '#',
    liveUrl: '#',
    image: 'https://picsum.photos/seed/erp/800/450'
  },
  {
    id: '2',
    title: 'Financial SaaS API',
    description: 'RESTful API focusing on secure transaction processing and reconciliation.',
    longDescription: 'High-security financial API capable of processing 10,000+ transactions daily with strict audit logging and multi-layer verification.',
    techStack: ['PHP 8.2', 'Laravel', 'MySQL', 'Stripe API', 'Sentry'],
    features: ['Webhooks integration', 'Encryption at rest', 'Role-based Access Control (RBAC)'],
    architecture: 'Modular Monolith with repository pattern for decoupled data access.',
    githubUrl: '#',
    liveUrl: '#',
    image: 'https://picsum.photos/seed/fin/800/450'
  },
  {
    id: '3',
    title: 'Real-time Analytics Engine',
    description: 'Backend engine for tracking and visualizing user behavior in real-time.',
    longDescription: 'A data-intensive application that ingests millions of events daily, processing them through Laravel queues and storing them for quick retrieval.',
    techStack: ['Laravel Octane', 'Swoole', 'ClickHouse', 'Redis'],
    features: ['High-performance ingestion', 'Complex aggregation queries', 'Websocket broadcasting'],
    architecture: 'Event-driven architecture leveraging Laravel Queues and Redis Pub/Sub.',
    githubUrl: '#',
    liveUrl: '#',
    image: 'https://picsum.photos/seed/analytics/800/450'
  }
];

export const EXPERIENCES: Experience[] = [
  {
    id: 'exp1',
    role: 'Senior Backend Developer',
    company: 'TechFlow Solutions',
    period: '2021 - Present',
    description: [
      'Leading the transition from monolithic architecture to microservices using Laravel and Docker.',
      'Optimizing database queries reducing API latency by 45%.',
      'Implementing CI/CD pipelines with GitHub Actions for automated testing and deployment.'
    ]
  },
  {
    id: 'exp2',
    role: 'Backend Engineer',
    company: 'Nexus Creative Lab',
    period: '2019 - 2021',
    description: [
      'Developed custom CMS solutions for high-traffic media websites.',
      'Integrated third-party payment gateways and CRM systems.',
      'Authored technical documentation for API consumers.'
    ]
  }
];
