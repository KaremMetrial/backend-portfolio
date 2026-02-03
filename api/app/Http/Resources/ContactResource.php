<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class ContactResource extends JsonResource
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
            'email' => $this->email,
            'phone' => $this->phone,
            'location' => $this->location,
            'social_links' => $this->social_links ? json_decode($this->social_links, true) : ['github' => '', 'linkedin' => '', 'twitter' => '', 'email' => ''],
            'contact_form_config' => $this->contact_form_config ? json_decode($this->contact_form_config, true) : ['enabled' => false, 'fields' => []],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
