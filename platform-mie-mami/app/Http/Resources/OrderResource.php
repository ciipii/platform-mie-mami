<?php

namespace App\Http\Resources;

use Illuminate\Http\Request;
use Illuminate\Http\Resources\Json\JsonResource;

class OrderResource extends JsonResource
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
            'user_id' => $this->user_id,
            'status' => $this->status,
            'order_date' => $this->order_date,
            'created_at' => $this->created_at,
            'updated_at' => $this->updated_at,
            'details' => OrderDetailResource::collection($this->whenLoaded('details')),
            'payment' => new PaymentResource($this->whenLoaded('payment')),
            'total_amount' => $this->details->sum(function ($detail) {
                return $detail->price * $detail->quantity;
            }),
        ];
    }
}
