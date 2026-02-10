<?php

namespace Tests\Feature;

use Illuminate\Foundation\Testing\RefreshDatabase;
use Tests\TestCase;
use App\Models\About;
use App\Models\Hero;
use App\Models\Contact;
use App\Models\SiteConfig;

class ApiEndpointsTest extends TestCase
{
    use RefreshDatabase;

    /**
     * Test Basic GET Endpoints
     */
    public function test_basic_get_endpoints_return_successful_response()
    {
        // Seed Singleton Data
        About::create([
            'content' => 'Test About Content',
            'profile_image' => 'test-image.jpg',
            'personal_details' => json_encode(['location' => 'Test Loc', 'email' => 'a@b.c', 'phone' => '123']),
            'fun_facts' => json_encode(['fact' => 'fun']),
        ]);

        Hero::create([
            'name' => 'Test Hero Name',
            'title' => 'Test Hero Title',
            'subtitle' => 'Subtitle',
            'description' => 'Desc',
            'hero_image' => 'hero.jpg',
            'background_images' => json_encode(['img1.jpg']),
            'stats' => json_encode(['exp' => 5]),
            'cta_buttons' => json_encode(['label' => 'Click Me']),
        ]);

        Contact::create([
            'email' => 'test@example.com',
            'phone' => '1234567890',
            'location' => 'Test City',
            'social_links' => json_encode(['github' => 'url']),
            'contact_form_config' => json_encode(['enabled' => true]),
        ]);

        SiteConfig::create([
            'site_title' => 'Test Site', // Correct column name from migration
            'meta_description' => 'Meta Desc',
            'theme_colors' => json_encode(['primary' => '#000']),
            'footer_content' => 'Footer',
            'navbar_items' => json_encode(['home' => '/']),
        ]);

        $endpoints = [
            '/api/about',
            '/api/contact',
            '/api/experiences',
            '/api/hero',
            '/api/projects',
            '/api/site-config',
            '/api/skills',
            // '/api/user', // Skipping user for now as it probably requires auth or specific setup
        ];

        foreach ($endpoints as $endpoint) {
            $response = $this->get($endpoint);

            if ($response->status() !== 200) {
                dump("Endpoint failed: $endpoint with status " . $response->status());
                // dump($response->content());
            }

            $response->assertStatus(200);
        }
    }

    public function test_projects_crud_endpoints()
    {
        // 1. Create a project
        $projectData = [
            'title' => 'New Test Project',
            'description' => 'A test description',
            'long_description' => 'Detailed description',
            'tech_stack' => ['PHP', 'Laravel'],
            'features' => ['Feature 1', 'Feature 2'],
            'architecture' => 'MVC',
            'github_url' => 'http://github.com/test',
            'live_url' => 'http://example.com',
            'image' => 'test-image.jpg',
        ];

        $response = $this->postJson('/api/projects', $projectData);
        $response->assertStatus(201);
        $this->assertDatabaseHas('projects', ['title' => 'New Test Project']);
        $projectId = $response->json('data.id');

        // 2. Update the project
        $updateData = ['title' => 'Updated Project Title'];
        $response = $this->putJson("/api/projects/{$projectId}", $updateData);
        $response->assertStatus(200);
        $this->assertDatabaseHas('projects', ['id' => $projectId, 'title' => 'Updated Project Title']);

        // 3. Delete the project
        $response = $this->deleteJson("/api/projects/{$projectId}");
        $response->assertStatus(204);
        $this->assertDatabaseMissing('projects', ['id' => $projectId]);
    }
}
