import { useState, useEffect, useCallback } from "react";
import api from "../services/api";

/**
 * Hook untuk manajemen favorit guru.
 * Sinkron ke database, bukan localStorage.
 *
 * Cara pakai:
 *   const { favoritIds, tambah, hapus, isFavorit, loading } = useFavorit();
 */
export default function useFavorit() {
    const [favoritIds, setFavoritIds] = useState([]);
    const [loading, setLoading] = useState(true);

    // Ambil dari DB saat pertama load
    useEffect(() => {
        api.get("/favorit")
            .then((res) => setFavoritIds(res.data ?? []))
            .catch(() => setFavoritIds([]))
            .finally(() => setLoading(false));
    }, []);

    const tambah = useCallback(async (guruId) => {
        // Optimistic update
        setFavoritIds((prev) => prev.includes(guruId) ? prev : [...prev, guruId]);
        try {
            await api.post(`/favorit/${guruId}`);
        } catch {
            // Rollback jika gagal
            setFavoritIds((prev) => prev.filter((id) => id !== guruId));
        }
    }, []);

    const hapus = useCallback(async (guruId) => {
        // Optimistic update
        setFavoritIds((prev) => prev.filter((id) => id !== guruId));
        try {
            await api.delete(`/favorit/${guruId}`);
        } catch {
            // Rollback jika gagal
            setFavoritIds((prev) => [...prev, guruId]);
        }
    }, []);

    const toggle = useCallback(async (guruId) => {
        if (favoritIds.includes(guruId)) {
            await hapus(guruId);
        } else {
            await tambah(guruId);
        }
    }, [favoritIds, tambah, hapus]);

    const isFavorit = useCallback(
        (guruId) => favoritIds.includes(guruId),
        [favoritIds]
    );

    return { favoritIds, tambah, hapus, toggle, isFavorit, loading };
}