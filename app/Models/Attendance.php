<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
    use HasFactory;

    // 🔒 Daftarkan kolom-kolom ini agar diizinkan melakukan Mass Assignment
    protected $fillable = [
        'user_id',
        'schedule_id',
        'attended_at',
        'latitude',
        'longitude',
        'photo_path',
    ];

    /**
     * Hubungan relasi balik ke Model User (GSM)
     */
    public function user()
    {
        return $this->belongsTo(User::class);
    }
    
    public function schedule()
    {
        return $this->belongsTo(Schedule::class);
    }
}