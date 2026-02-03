<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PortfolioSeeder extends Seeder
{
    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed Skills
        $skills = [
            ['name' => 'PHP 8.x', 'category' => 'Language'],
            ['name' => 'Laravel', 'category' => 'Framework'],
            ['name' => 'Eloquent ORM', 'category' => 'Framework'],
            ['name' => 'MySQL / PostgreSQL', 'category' => 'Database'],
            ['name' => 'Redis', 'category' => 'Database'],
            ['name' => 'RESTful APIs', 'category' => 'Concept'],
            ['name' => 'Docker', 'category' => 'Tools'],
            ['name' => 'Git & GitHub Actions', 'category' => 'Tools'],
            ['name' => 'Clean Architecture', 'category' => 'Concept'],
            ['name' => 'Linux / Nginx', 'category' => 'Tools'],
            ['name' => 'TDD (PHPUnit)', 'category' => 'Concept'],
            ['name' => 'Queue Workers', 'category' => 'Framework'],
        ];

        foreach ($skills as $skill) {
            DB::table('skills')->insert([
                'name' => $skill['name'],
                'category' => $skill['category'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Projects
        $projects = [
            [
                'title' => 'Enterprise ERP Microservice',
                'description' => 'A scalable inventory management backend built with Laravel and PostgreSQL.',
                'long_description' => 'Developed a robust microservice-based ERP system that handles high-concurrency inventory transactions for a multi-warehouse retail chain.',
                'tech_stack' => ['Laravel', 'PostgreSQL', 'Redis', 'RabbitMQ', 'Docker'],
                'features' => ['Real-time inventory sync', 'JWT-based Auth', 'Automated PDF invoicing'],
                'architecture' => 'Microservices architecture with API Gateway and central authentication service.',
                'github_url' => '#',
                'live_url' => '#',
                'image' => 'https://picsum.photos/seed/erp/800/450',
            ],
            [
                'title' => 'Financial SaaS API',
                'description' => 'RESTful API focusing on secure transaction processing and reconciliation.',
                'long_description' => 'High-security financial API capable of processing 10,000+ transactions daily with strict audit logging and multi-layer verification.',
                'tech_stack' => ['PHP 8.2', 'Laravel', 'MySQL', 'Stripe API', 'Sentry'],
                'features' => ['Webhooks integration', 'Encryption at rest', 'Role-based Access Control (RBAC)'],
                'architecture' => 'Modular Monolith with repository pattern for decoupled data access.',
                'github_url' => '#',
                'live_url' => '#',
                'image' => 'https://picsum.photos/seed/fin/800/450',
            ],
            [
                'title' => 'Real-time Analytics Engine',
                'description' => 'Backend engine for tracking and visualizing user behavior in real-time.',
                'long_description' => 'A data-intensive application that ingests millions of events daily, processing them through Laravel queues and storing them for quick retrieval.',
                'tech_stack' => ['Laravel Octane', 'Swoole', 'ClickHouse', 'Redis'],
                'features' => ['High-performance ingestion', 'Complex aggregation queries', 'Websocket broadcasting'],
                'architecture' => 'Event-driven architecture leveraging Laravel Queues and Redis Pub/Sub.',
                'github_url' => '#',
                'live_url' => '#',
                'image' => 'https://picsum.photos/seed/analytics/800/450',
            ],
        ];

        foreach ($projects as $project) {
            DB::table('projects')->insert([
                'title' => $project['title'],
                'description' => $project['description'],
                'long_description' => $project['long_description'],
                'tech_stack' => json_encode($project['tech_stack']),
                'features' => json_encode($project['features']),
                'architecture' => $project['architecture'],
                'github_url' => $project['github_url'],
                'live_url' => $project['live_url'],
                'image' => $project['image'],
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Experiences
        $experiences = [
            [
                'role' => 'Senior Backend Developer',
                'company' => 'TechFlow Solutions',
                'period' => '2021 - Present',
                'description' => [
                    'Leading the transition from monolithic architecture to microservices using Laravel and Docker.',
                    'Optimizing database queries reducing API latency by 45%.',
                    'Implementing CI/CD pipelines with GitHub Actions for automated testing and deployment.'
                ],
            ],
            [
                'role' => 'Backend Engineer',
                'company' => 'Nexus Creative Lab',
                'period' => '2019 - 2021',
                'description' => [
                    'Developed custom CMS solutions for high-traffic media websites.',
                    'Integrated third-party payment gateways and CRM systems.',
                    'Authored technical documentation for API consumers.'
                ],
            ],
        ];

        foreach ($experiences as $experience) {
            DB::table('experiences')->insert([
                'role' => $experience['role'],
                'company' => $experience['company'],
                'period' => $experience['period'],
                'description' => json_encode($experience['description']),
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        }

        // Seed Hero Content
        DB::table('heroes')->insert([
            'name' => 'Alex Rivera',
            'title' => 'Backend Engineer',
            'subtitle' => 'I Architect Robust Backend Systems.',
            'description' => 'Hi, I\'m Alex Rivera. A Backend Engineer specialized in building high-performance, secure, and scalable APIs using PHP & Laravel.',
            'hero_image' => 'https://picsum.photos/seed/alex/800/800',
            'background_images' => json_encode([
                'main' => 'https://picsum.photos/seed/bg1/500/500',
                'secondary' => 'https://picsum.photos/seed/bg2/400/400'
            ]),
            'stats' => json_encode([
                'yearsExp' => 5,
                'projects' => 40,
                'uptime' => '100%'
            ]),
            'cta_buttons' => json_encode([
                'viewProjects' => 'View Projects',
                'contactMe' => 'Contact Me'
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed About Content
        DB::table('abouts')->insert([
            'content' => 'I\'m a Backend Engineer with a passion for creating robust, scalable systems that power modern web applications. With over 5 years of experience in PHP and Laravel development, I specialize in building high-performance APIs and microservices that handle thousands of requests per second.\n\nMy expertise lies in clean architecture patterns, database optimization, and implementing security best practices. I believe that great backend development is not just about writing code, but about understanding business requirements and translating them into efficient, maintainable solutions.\n\nWhen I\'m not coding, you can find me exploring new technologies, contributing to open-source projects, or sharing knowledge with the developer community.',
            'profile_image' => 'https://picsum.photos/seed/profile/400/400',
            'personal_details' => json_encode([
                'location' => 'San Francisco, CA',
                'email' => 'alex.rivera@example.com',
                'phone' => '+1 (555) 123-4567'
            ]),
            'fun_facts' => json_encode([
                'Coffee enthusiast who can code on a single espresso',
                'Open-source contributor with 50+ PRs merged',
                'Tech conference speaker on backend architecture',
                'Guitar player who finds coding rhythm in algorithms'
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed Contact Information
        DB::table('contacts')->insert([
            'email' => 'alex.rivera@example.com',
            'phone' => '+1 (555) 123-4567',
            'location' => 'San Francisco, CA',
            'social_links' => json_encode([
                'github' => 'https://github.com/alexriv',
                'linkedin' => 'https://linkedin.com/in/alexriv',
                'twitter' => 'https://twitter.com/alexriv_dev',
                'email' => 'mailto:alex.rivera@example.com'
            ]),
            'contact_form_config' => json_encode([
                'enabled' => true,
                'fields' => ['name', 'email', 'message', 'subject']
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed Site Configuration
        DB::table('site_configs')->insert([
            'site_title' => 'Alex Rivera - Backend Engineer Portfolio',
            'meta_description' => 'Portfolio of Alex Rivera, Backend Engineer specializing in PHP, Laravel, and scalable API development.',
            'theme_colors' => json_encode([
                'primary' => '#6366f1',
                'secondary' => '#8b5cf6',
                'background' => '#0a0a0a',
                'text' => '#f5f5f5'
            ]),
            'footer_content' => '© 2024 Alex Rivera. Built with ❤️ and Laravel.',
            'navbar_items' => json_encode([
                ['label' => 'Home', 'href' => '#home', 'order' => 1],
                ['label' => 'About', 'href' => '#about', 'order' => 2],
                ['label' => 'Skills', 'href' => '#skills', 'order' => 3],
                ['label' => 'Projects', 'href' => '#projects', 'order' => 4],
                ['label' => 'Experience', 'href' => '#experience', 'order' => 5],
                ['label' => 'Contact', 'href' => '#contact', 'order' => 6]
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);
    }
}
