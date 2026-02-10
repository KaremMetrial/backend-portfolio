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
            'availability' => $this->availability,
            'social_links' => $this->social_links ?? ['github' => '', 'linkedin' => '', 'twitter' => '', 'email' => ''],
            'contact_form_config' => $this->contact_form_config ?? ['enabled' => false, 'fields' => []],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
