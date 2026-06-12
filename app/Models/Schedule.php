<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Schedule extends Model
{
    protected $fillable = ['sunday_date', 'pujian_id', 'horong1_id', 'horong2_id', 'horong3_id', 'pemusik_id'];

    public function pujian(): BelongsTo { return $this->belongsTo(User::class, 'pujian_id'); }
    public function horong1(): BelongsTo { return $this->belongsTo(User::class, 'horong1_id'); }
    public function horong2(): BelongsTo { return $this->belongsTo(User::class, 'horong2_id'); }
    public function horong3(): BelongsTo { return $this->belongsTo(User::class, 'horong3_id'); }
    public function pemusik(): BelongsTo { return $this->belongsTo(User::class, 'pemusik_id'); }
}