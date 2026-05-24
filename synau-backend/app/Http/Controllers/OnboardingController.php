<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use App\Models\Guru;
use App\Models\User;

class OnboardingController extends Controller
{
    public function store(Request $request)
    {
        $request->validate([
            'mata_pelajaran' => 'required|array|min:1',
            'jadwal'         => 'required|array|min:1',
            'slot_jam'       => 'required|array',
        ]);

        /** @var User $user */
        $user = Auth::user();

        // Langsung assign array, biarkan Eloquent cast yang menangani JSON
        Guru::updateOrCreate(
            ['user_id' => $user->id],
            [
                'mata_pelajaran'       => $request->mata_pelajaran,
                'jadwal'               => $request->jadwal,
                'slot_jam'             => $request->slot_jam,
                'onboarding_completed' => true,
            ]
        );

        $user->onboarding_completed = true;
        $user->save();

        return response()->json([
            'message'              => 'Onboarding berhasil disimpan.',
            'onboarding_completed' => true,
        ]);
    }
}
