<?php

namespace Database\Seeders;

use Illuminate\Database\Console\Seeds\WithoutModelEvents;
use Illuminate\Database\Seeder;
use Illuminate\Support\Facades\DB;

class PortfolioSeeder extends Seeder
{
    use WithoutModelEvents;

    /**
     * Run the database seeds.
     */
    public function run(): void
    {
        // Seed Skills
        $skills = [
            // Languages
            ['name' => 'PHP', 'category' => 'Language'],
            ['name' => 'SQL', 'category' => 'Language'],
            ['name' => 'HTML', 'category' => 'Language'],
            ['name' => 'CSS', 'category' => 'Language'],
            ['name' => 'JavaScript', 'category' => 'Language'],

            // Frameworks
            ['name' => 'Laravel', 'category' => 'Framework'],
            ['name' => 'Bootstrap', 'category' => 'Framework'],
            ['name' => 'FilamentPHP', 'category' => 'Framework'],

            // Databases
            ['name' => 'MySQL', 'category' => 'Database'],

            // API & Real-Time Technologies
            ['name' => 'RESTful APIs', 'category' => 'Concept'],
            ['name' => 'Sanctum', 'category' => 'Framework'],
            ['name' => 'Agora', 'category' => 'Tools'],
            ['name' => 'Pusher', 'category' => 'Tools'],
            ['name' => 'Firebase Cloud Messaging', 'category' => 'Tools'],

            // Development Tools
            ['name' => 'Git', 'category' => 'Tools'],
            ['name' => 'GitHub', 'category' => 'Tools'],
            ['name' => 'Composer', 'category' => 'Tools'],
            ['name' => 'XAMPP', 'category' => 'Tools'],
            ['name' => 'PhpStorm', 'category' => 'Tools'],
            ['name' => 'VSCode', 'category' => 'Tools'],

            // Core Concepts
            ['name' => 'MVC Architecture', 'category' => 'Concept'],
            ['name' => 'OOP', 'category' => 'Concept'],
            ['name' => 'Design Patterns', 'category' => 'Concept'],
            ['name' => 'Performance Optimization', 'category' => 'Concept'],

            // Payment Gateways
            ['name' => 'Moyasser', 'category' => 'Tools'],
            ['name' => 'Stripe', 'category' => 'Tools'],
            ['name' => 'MyFatoorah', 'category' => 'Tools'],
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
                'title' => 'E-commerce Platform',
                'description' => 'A fully functional e-commerce platform with secure payment integration.',
                'long_description' => 'Developed a fully functional e-commerce platform with secure payment integration. Integrated real-time order tracking and notifications for users via Pusher, enhancing user experience. Built a comprehensive admin dashboard for managing product listings, inventory, and customer orders.',
                'tech_stack' => ['Laravel', 'MySQL', 'Pusher'],
                'features' => ['Secure payment integration', 'Real-time order tracking', 'Admin dashboard', 'Inventory management', 'Customer order management'],
                'architecture' => 'MVC architecture with real-time notifications using Pusher.',
                'github_url' => null,
                'live_url' => null,
                'image' => 'https://picsum.photos/seed/ecommerce/800/450',
            ],
            [
                'title' => 'Freelance Marketplace Platform',
                'description' => 'Online freelance marketplace similar to "Mostaql" for project bidding and secure communication.',
                'long_description' => 'Developed an online freelance marketplace similar to "Mostaql," enabling users to post projects, bid on tasks, and communicate securely. Integrated Moyasser payment gateway for secure financial transactions between freelancers and clients. Implemented real-time messaging and notifications using Pusher and Firebase to keep users engaged and updated.',
                'tech_stack' => ['Laravel', 'Pusher', 'Firebase', 'MySQL', 'Moyasser'],
                'features' => ['Project posting and bidding', 'Secure messaging', 'Payment gateway integration', 'Real-time notifications', 'User authentication'],
                'architecture' => 'MVC architecture with real-time features using Pusher and Firebase Cloud Messaging.',
                'github_url' => null,
                'live_url' => null,
                'image' => 'https://picsum.photos/seed/freelance/800/450',
            ],
            [
                'title' => 'Live Auctions & Ads Platform',
                'description' => 'Real-time auction platform with live video streaming and bidding features.',
                'long_description' => 'Built a real-time auction platform supporting live video streaming through Agora and real-time bidding features. Integrated Pusher for real-time auction updates and Firebase Cloud Messaging for push notifications, driving user engagement and interaction.',
                'tech_stack' => ['Laravel', 'Agora', 'Pusher', 'Firebase', 'MySQL'],
                'features' => ['Live video streaming', 'Real-time bidding', 'Push notifications', 'Auction management', 'User engagement tracking'],
                'architecture' => 'Event-driven architecture with live streaming via Agora and real-time updates via Pusher.',
                'github_url' => null,
                'live_url' => null,
                'image' => 'https://picsum.photos/seed/auction/800/450',
            ],
            [
                'title' => 'Education Academy Platform',
                'description' => 'Udemy-style educational platform with comprehensive RESTful API.',
                'long_description' => 'Developed a Udemy-style educational platform, including a comprehensive RESTful API for handling course catalog, authentication, and enrollments. Integrated Moyasser payment gateway to handle subscription-based payments and course purchases securely. Designed an advanced admin panel with FilamentPHP for role-based user management and course administration.',
                'tech_stack' => ['Laravel', 'FilamentPHP', 'MySQL', 'RESTful API', 'Moyasser'],
                'features' => ['Course catalog management', 'User authentication and enrollment', 'Payment gateway integration', 'Admin panel with FilamentPHP', 'Role-based access control'],
                'architecture' => 'RESTful API architecture with FilamentPHP admin panel for content management.',
                'github_url' => null,
                'live_url' => null,
                'image' => 'https://picsum.photos/seed/education/800/450',
            ],
            [
                'title' => 'Blood Bank Management System',
                'description' => 'Centralized donor management system with hospital integration.',
                'long_description' => 'Developed a centralized donor management system, including donor records, inventory tracking, and integration with hospital systems via RESTful APIs. The system streamlines blood donation processes and ensures efficient inventory management.',
                'tech_stack' => ['Laravel', 'MySQL', 'Bootstrap', 'RESTful API'],
                'features' => ['Donor record management', 'Inventory tracking', 'Hospital system integration', 'RESTful API', 'Responsive UI'],
                'architecture' => 'MVC architecture with RESTful API for hospital system integration.',
                'github_url' => null,
                'live_url' => null,
                'image' => 'https://picsum.photos/seed/bloodbank/800/450',
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
                'role' => 'Back-End Developer',
                'company' => 'Waitbuzz',
                'period' => '04/2025 – Present',
                'description' => [
                    'Engineered and maintained secure, high-performance RESTful APIs for web and mobile applications.',
                    'Designed and developed dynamic, real-time dashboard UIs with Laravel Blade, improving hotel booking and customer reservation systems.',
                    'Spearheaded the creation of an admin panel that streamlined operations, enhanced room management, and improved reservation tracking.'
                ],
            ],
            [
                'role' => 'Back-End Developer',
                'company' => 'Rmoztec',
                'period' => '01/2025 – 03/2025',
                'description' => [
                    'Developed full-featured web applications from the ground up using PHP and Laravel, implementing efficient backend logic and MySQL database architecture.',
                    'Integrated Moyasser payment gateway for secure transaction processing within an e-learning platform.',
                    'Designed and built custom admin dashboards with FilamentPHP, improving administrative workflows for multiple projects.'
                ],
            ],
            [
                'role' => 'Web Development Intern',
                'company' => 'Digital Egypt Pioneers Initiative (DEPI)',
                'period' => '04/2024 – 11/2024',
                'description' => [
                    'Contributed to PHP-based web application development, focusing on feature enhancements and debugging.',
                    'Optimized SQL queries and restructured database schemas to improve application response times.',
                    'Participated in agile sprint meetings, collaborating with senior developers to ensure timely project delivery.'
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
            'name' => 'Kareem Sabry Elsayed',
            'title' => 'Backend PHP Developer',
            'subtitle' => 'Building Secure, Scalable Web Applications & RESTful APIs',
            'description' => 'Hi, I\'m Kareem Sabry. A motivated Backend PHP Developer with over a year of hands-on experience in PHP, Laravel, and MySQL. I specialize in building secure, scalable web applications and RESTful APIs with expertise in payment gateway integration and database optimization.',
            'hero_image' => 'https://picsum.photos/seed/kareem/800/800',
            'background_images' => json_encode([
                'main' => 'https://picsum.photos/seed/bg1/500/500',
                'secondary' => 'https://picsum.photos/seed/bg2/400/400'
            ]),
            'stats' => json_encode([
                'yearsExp' => '1+',
                'projects' => 5,
                'uptime' => '99.9%'
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
            'title' => 'About Me',
            'description' => 'I\'m a motivated and results-oriented Backend PHP Developer with over a year of hands-on experience in PHP, Laravel, and MySQL. I demonstrate a proven ability to design and develop secure, scalable web applications and RESTful APIs.

My expertise includes integrating payment gateways (Moyasser, Stripe, MyFatoorah), optimizing database performance, and delivering dynamic user interfaces. I have experience working with real-time technologies like Pusher, Firebase Cloud Messaging, and Agora for live streaming.

I hold a Bachelor\'s degree in Computer Science from Mansoura University (2018-2022) and have completed professional certifications in PHP Web Development and Back-End Development. I\'m dedicated to continuous learning and thrive in collaborative team environments to deliver innovative technical solutions.

When I\'m not coding, I\'m exploring new technologies and working on personal projects to expand my knowledge in PHP, Laravel, and API development.',
            'image' => 'https://picsum.photos/seed/kareem-profile/400/400',
            'stats' => json_encode([
                ['label' => 'Location', 'value' => 'Mansoura, Dakahlia, Egypt'],
                ['label' => 'Email', 'value' => 'karem.metrial@hotmail.com'],
                ['label' => 'Phone', 'value' => '+201006567821'],
                ['label' => 'Experience', 'value' => '1+ Year']
            ]),
            'created_at' => now(),
            'updated_at' => now(),
        ]);

        // Seed Contact Information
        DB::table('contacts')->insert([
            'email' => 'karem.metrial@hotmail.com',
            'phone' => '+201006567821',
            'location' => 'Mansoura, Dakahlia, Egypt',
            'availability' => 'Available for Hire',
            'social_links' => json_encode([
                'github' => 'https://github.com/KaremMetrial',
                'linkedin' => 'https://linkedin.com/in/karem-metrial',
                'twitter' => null,
                'email' => 'mailto:karem.metrial@hotmail.com'
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
            'site_title' => 'Kareem Sabry - Backend PHP Developer Portfolio',
            'meta_description' => 'Portfolio of Kareem Sabry Elsayed, Backend PHP Developer specializing in PHP, Laravel, MySQL, and RESTful API development with expertise in payment gateway integration.',
            'theme_colors' => json_encode([
                'primary' => '#6366f1',
                'secondary' => '#8b5cf6',
                'background' => '#0a0a0a',
                'text' => '#f5f5f5'
            ]),
            'footer_content' => '© 2025 Kareem Sabry Elsayed. Built with ❤️ and Laravel.',
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
