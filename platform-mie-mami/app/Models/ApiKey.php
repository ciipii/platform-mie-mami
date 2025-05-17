<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\SoftDeletes;

class ApiKey extends Model
{
    use HasFactory, SoftDeletes;

    /**
     * The attributes that are mass assignable.
     *
     * @var array<int, string>
     */
    protected $fillable = [
        'name',
        'key',
    ];

    /**
     * Generate a new API key.
     *
     * @param string $name
     * @return self
     */
    public static function generate(string $name): self
    {
        return self::create([
            'name' => $name,
            'key' => self::generateUniqueKey(),
        ]);
    }

    /**
     * Generate a unique API key.
     *
     * @return string
     */
    protected static function generateUniqueKey(): string
    {
        do {
            $key = bin2hex(random_bytes(16));
        } while (self::where('key', $key)->exists());

        return $key;
    }
}
