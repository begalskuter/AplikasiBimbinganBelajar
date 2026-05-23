<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Auth;
use Illuminate\Support\Facades\DB;

class FavoritController extends Controller
{
    private function getUser(): User
    {
        return User::findOrFail(Auth::id());
    }

    /**
     * GET /api/favorit
     * Ambil semua guru yang difavoritkan user login.
     */
    public function index()
    {
        $favorit = DB::table('favorit')
            ->where('user_id', Auth::id())
            ->pluck('guru_id')
            ->toArray();

        return response()->json($favorit);
    }

    /**
     * POST /api/favorit/{guruId}
     * Tambah guru ke favorit. Abaikan jika sudah ada.
     */
    public function store($guruId)
    {
        try {
            DB::table('favorit')->insertOrIgnore([
                'user_id'    => Auth::id(),
                'guru_id'    => $guruId,
                'created_at' => now(),
                'updated_at' => now(),
            ]);
        } catch (\Exception $e) {
            // unique constraint — sudah ada, tidak masalah
        }

        return response()->json(['message' => 'Ditambahkan ke favorit.']);
    }

    /**
     * DELETE /api/favorit/{guruId}
     * Hapus guru dari favorit.
     */
    public function destroy($guruId)
    {
        DB::table('favorit')
            ->where('user_id', Auth::id())
            ->where('guru_id', $guruId)
            ->delete();

        return response()->json(['message' => 'Dihapus dari favorit.']);
    }
}
