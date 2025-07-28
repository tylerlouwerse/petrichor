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
        Schema::create('characters', function (Blueprint $table) {
            $table->id();
            $table->foreignId('player_id')->constrained()->onDelete('cascade');
            $table->string('name')->unique();
            $table->integer('level')->default(1);
            $table->bigInteger('experience')->default(0);

            // Position in the world
            $table->integer('world_x')->default(100);
            $table->integer('world_y')->default(100);
            $table->integer('world_z')->default(0);
            $table->string('current_map')->default('tutorial_island');

            // Combat stats
            $table->integer('health')->default(100);
            $table->integer('max_health')->default(100);
            $table->integer('mana')->default(50);
            $table->integer('max_mana')->default(50);
            $table->integer('attack_level')->default(1);
            $table->integer('defense_level')->default(1);
            $table->integer('magic_level')->default(1);

            // Skills (OSRS-style)
            $table->integer('mining_level')->default(1);
            $table->integer('fishing_level')->default(1);
            $table->integer('woodcutting_level')->default(1);
            $table->integer('cooking_level')->default(1);
            $table->integer('crafting_level')->default(1);

            // Enhanced magic system
            $table->json('learned_spells')->nullable(); // Array of spell IDs
            $table->json('inventory')->nullable(); // JSON inventory data
            $table->json('equipment')->nullable(); // JSON equipment data

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('characters');
    }
};
