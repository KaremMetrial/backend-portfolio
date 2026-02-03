<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('heroes', function (Blueprint $table) {
            $table->id();
            $table->string('name');
            $table->string('title');
            $table->string('subtitle');
            $table->text('description');
            $table->string('hero_image')->nullable(); // For uploaded profile/hero images
            $table->json('background_images')->nullable(); // For decorative background URLs
            $table->json('stats'); // Years Exp, Projects, Uptime
            $table->json('cta_buttons'); // View Projects, Contact Me buttons
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('heroes');
    }
};
