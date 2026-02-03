<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class HeroResource extends JsonResource
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
            'name' => $this->name,
            'title' => $this->title,
            'subtitle' => $this->subtitle,
            'description' => $this->description,
            'hero_image' => $this->hero_image,
            'background_images' => $this->background_images ? json_decode($this->background_images, true) : null,
            'stats' => $this->stats ? json_decode($this->stats, true) : ['yearsExp' => 0, 'projects' => 0, 'uptime' => '0%'],
            'cta_buttons' => $this->cta_buttons ? json_decode($this->cta_buttons, true) : ['viewProjects' => 'View Projects', 'contactMe' => 'Contact Me'],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
