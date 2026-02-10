<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Project extends Model
{
    protected $guarded = [];

    protected $casts = [
        'tech_stack' => 'array',
        'features' => 'array',
    ];

    //
}
