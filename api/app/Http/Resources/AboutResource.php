<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class AboutResource extends JsonResource
{
    /**
     * Transform the resource into an array.
     *
     * @return array<string, mixed>
     */
    public function toArray(Request $request): array
    {
        return [
            'id' => $this->id,
            'content' => $this->content,
            'profile_image' => $this->profile_image,
            'personal_details' => $this->personal_details ? json_decode($this->personal_details, true) : ['location' => '', 'email' => '', 'phone' => ''],
            'fun_facts' => $this->fun_facts ? json_decode($this->fun_facts, true) : [],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
