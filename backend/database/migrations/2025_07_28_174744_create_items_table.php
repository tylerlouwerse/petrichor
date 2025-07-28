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
        Schema::create('items', function (Blueprint $table) {
            $table->id();
            $table->string('name')->unique();
            $table->text('description');
            $table->string('type'); // 'weapon', 'armor', 'consumable', 'resource', 'quest', 'rune'
            $table->string('subtype')->nullable(); // 'sword', 'helmet', 'food', 'ore', etc.

            // Basic properties
            $table->integer('stack_size')->default(1); // How many can stack in one inventory slot
            $table->integer('value')->default(1); // Base value for trading
            $table->boolean('is_tradeable')->default(true);
            $table->boolean('is_droppable')->default(true);

            // Equipment stats
            $table->integer('attack_bonus')->default(0);
            $table->integer('defense_bonus')->default(0);
            $table->integer('magic_bonus')->default(0);
            $table->integer('required_level')->default(1);
            $table->string('required_skill')->nullable(); // 'attack', 'magic', etc.

            // Consumable properties
            $table->integer('health_restore')->default(0);
            $table->integer('mana_restore')->default(0);
            $table->json('status_effects')->nullable(); // Buffs/debuffs when consumed

            // Visual and game data
            $table->string('sprite_name')->nullable(); // For 2D rendering
            $table->string('model_name')->nullable(); // For 3D rendering
            $table->string('icon_name')->nullable(); // For UI
            $table->json('animation_data')->nullable(); // Animation information

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('items');
    }
};
