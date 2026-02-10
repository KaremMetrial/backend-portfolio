<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class SiteConfig extends Model
{
    protected $guarded = [];

    protected $casts = [
        'theme_colors' => 'array',
        'navbar_items' => 'array',
    ];
}
