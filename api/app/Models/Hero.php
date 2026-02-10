<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Hero extends Model
{
    protected $guarded = [];

    protected $casts = [
        'background_images' => 'array',
        'stats' => 'array',
        'cta_buttons' => 'array',
    ];
}
