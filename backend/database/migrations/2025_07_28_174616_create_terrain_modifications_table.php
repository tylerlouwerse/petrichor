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
        Schema::create('terrain_modifications', function (Blueprint $table) {
            $table->id();
            $table->foreignId('character_id')->constrained()->onDelete('cascade'); // Who cast the spell
            $table->foreignId('spell_id')->constrained()->onDelete('cascade'); // Which spell caused this
            $table->string('map_name'); // Which map this affects

            // Location and area affected
            $table->integer('center_x'); // Center point of the modification
            $table->integer('center_y');
            $table->integer('center_z');
            $table->json('affected_tiles'); // Array of {x, y, original_height, new_height}

            // Modification details
            $table->string('modification_type'); // 'raise', 'lower', 'wall', 'bridge', 'crater'
            $table->integer('height_change')->default(0);
            $table->string('texture_change')->nullable(); // New texture for affected tiles

            // Timing
            $table->timestamp('created_at');
            $table->timestamp('expires_at')->nullable(); // NULL = permanent
            $table->boolean('is_active')->default(true);

            // Effects and properties
            $table->boolean('blocks_movement')->default(false);
            $table->boolean('blocks_projectiles')->default(false);
            $table->json('special_properties')->nullable(); // Fire damage, ice slipping, etc.

            // Visual effects
            $table->string('particle_effect')->nullable();
            $table->string('ambient_sound')->nullable();
            $table->json('lighting_effects')->nullable();

            $table->timestamp('updated_at');

            // Index for quick spatial queries
            $table->index(['map_name', 'center_x', 'center_y']);
            $table->index(['expires_at']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('terrain_modifications');
    }
};
