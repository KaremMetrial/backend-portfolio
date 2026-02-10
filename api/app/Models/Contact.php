<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Contact extends Model
{
    protected $guarded = [];

    protected $casts = [
        'social_links' => 'array',
        'contact_form_config' => 'array',
    ];
}
