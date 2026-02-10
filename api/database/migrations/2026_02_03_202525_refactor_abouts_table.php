<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('abouts', function (Blueprint $table) {
            $table->string('title')->after('id')->nullable();
            $table->renameColumn('content', 'description');
            $table->renameColumn('profile_image', 'image');
            $table->renameColumn('personal_details', 'stats');
            $table->dropColumn('fun_facts');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('abouts', function (Blueprint $table) {
            $table->dropColumn('title');
            $table->renameColumn('description', 'content');
            $table->renameColumn('image', 'profile_image');
            $table->renameColumn('stats', 'personal_details');
            $table->json('fun_facts')->nullable();
        });
    }
};
