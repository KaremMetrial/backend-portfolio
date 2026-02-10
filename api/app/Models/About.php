<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class About extends Model
{
    protected $guarded = [];

    protected $casts = [
        'stats' => 'array',
        'personal_details' => 'array',
        'fun_facts' => 'array',
    ];
}
