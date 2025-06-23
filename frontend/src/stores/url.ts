import { create } from "zustand";
import { urlapi } from "@/lib/api";

interface Url {
  id: string;
  url: string;
  lastChecked: string;
  isUp: boolean;
  avgResponseTime: number;
  uptimePercent: number;
}

interface UrlStore {
  urls: Url[];
  loading: boolean;
  fetchUrls: () => Promise<void>;
  addUrl: (newUrl: string) => Promise<void>;
}

export const useUrlStore = create<UrlStore>((set) => ({
  urls: [],
  loading: true,

  fetchUrls: async () => {
    set({ loading: true });
    try {
      const res = await urlapi.get("/");
      set({ urls: res.data });
    } catch (err) {
      console.error("Fetch failed", err);
    } finally {
      set({ loading: false });
    }
  },

  addUrl: async (url: string) => {
    try {
      const res = await urlapi.post("/", { url });
      set((state) => ({ urls: [...state.urls, res.data] }));
    } catch (err) {
      alert("Failed to add URL");
    }
  },
}));
