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
        Schema::create('world_maps', function (Blueprint $table) {
            $table->id();
            $table->string('map_name')->unique();
            $table->string('display_name');
            $table->text('description')->nullable();

            // Map dimensions
            $table->integer('width_tiles');
            $table->integer('height_tiles');
            $table->integer('default_height')->default(0);

            // Tile data - we'll store this as JSON for flexibility
            // Each tile contains: height, texture, walkable, objects, etc.
            $table->longText('tile_data'); // JSON array of tile data

            // Spawn points and important locations
            $table->json('spawn_points')->nullable(); // [{'x': 50, 'y': 50, 'z': 0, 'type': 'default'}]
            $table->json('npc_spawns')->nullable(); // NPC spawn locations
            $table->json('resource_nodes')->nullable(); // Mining, trees, fishing spots

            // Map settings
            $table->boolean('is_pvp_enabled')->default(false);
            $table->boolean('is_safe_zone')->default(false);
            $table->integer('required_level')->default(1);

            // Weather and environment
            $table->string('weather_type')->default('clear'); // 'clear', 'rain', 'snow', 'fog'
            $table->string('ambient_sound')->nullable();
            $table->json('lighting_config')->nullable(); // Day/night cycle, ambient light

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('world_maps');
    }
};
