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
        Schema::create('spells', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->string('description');
            $table->string('spell_type'); // 'combat', 'utility', 'terrain', 'area_effect'

            // Requirements
            $table->integer('required_magic_level')->default(1);
            $table->json('required_runes')->nullable(); // [{'type': 'fire', 'amount': 3}]
            $table->integer('mana_cost')->default(10);

            // Basic spell properties
            $table->integer('cast_time_ms')->default(2000); // Casting time in milliseconds
            $table->integer('cooldown_ms')->default(0); // Cooldown in milliseconds
            $table->integer('range_tiles')->default(1); // How far the spell can reach

            // Enhanced spell properties for our game
            $table->boolean('modifies_terrain')->default(false);
            $table->boolean('has_area_effect')->default(false);
            $table->integer('area_radius')->default(0); // Radius in tiles for AoE spells
            $table->string('area_shape')->default('circle'); // 'circle', 'square', 'line'

            // Terrain modification properties
            $table->string('terrain_effect')->nullable(); // 'raise', 'lower', 'create_wall', 'create_bridge'
            $table->integer('terrain_height_change')->default(0); // How much to raise/lower terrain
            $table->integer('duration_seconds')->default(0); // 0 = permanent, >0 = temporary

            // Damage and effects
            $table->integer('base_damage')->default(0);
            $table->json('status_effects')->nullable(); // [{'type': 'burn', 'duration': 5000}]

            // Animation and visual effects
            $table->string('animation_name')->nullable();
            $table->string('particle_effect')->nullable();
            $table->string('sound_effect')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('spells');
    }
};
