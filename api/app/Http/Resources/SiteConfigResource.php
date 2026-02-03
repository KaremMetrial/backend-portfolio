<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class SiteConfigResource extends JsonResource
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
            'site_title' => $this->site_title,
            'meta_description' => $this->meta_description,
            'theme_colors' => $this->theme_colors ? json_decode($this->theme_colors, true) : ['primary' => '#6366f1', 'secondary' => '#8b5cf6', 'background' => '#0a0a0a', 'text' => '#f5f5f5'],
            'footer_content' => $this->footer_content,
            'navbar_items' => $this->navbar_items ? json_decode($this->navbar_items, true) : [],
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
        ];
    }
}
