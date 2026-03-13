import type { MetadataRoute } from "next";
import { supabase } from "../lib/supabase";

const BASE_URL = "https://thesuperboys.jp";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const staticPages: MetadataRoute.Sitemap = [
    { url: BASE_URL, lastModified: new Date(), changeFrequency: "weekly", priority: 1.0 },
    { url: `${BASE_URL}/live-event`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/news`, lastModified: new Date(), changeFrequency: "daily", priority: 0.9 },
    { url: `${BASE_URL}/media`, lastModified: new Date(), changeFrequency: "weekly", priority: 0.8 },
    { url: `${BASE_URL}/profile`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.8 },
    { url: `${BASE_URL}/movie`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/discography`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.7 },
    { url: `${BASE_URL}/goods`, lastModified: new Date(), changeFrequency: "monthly", priority: 0.6 },
    { url: `${BASE_URL}/contact`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.5 },
    { url: `${BASE_URL}/event-guide`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/photo-rules`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/fan-letter`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.4 },
    { url: `${BASE_URL}/privacy`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
    { url: `${BASE_URL}/copyright`, lastModified: new Date(), changeFrequency: "yearly", priority: 0.3 },
  ];

  const [newsRes, eventsRes, mediaRes] = await Promise.all([
    supabase.from("news").select("id").eq("published", true),
    supabase.from("live_events").select("id").eq("published", true),
    supabase.from("media").select("id").eq("published", true),
  ]);

  const newsPages: MetadataRoute.Sitemap = (newsRes.data || []).map((item) => ({
    url: `${BASE_URL}/news/${item.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const eventPages: MetadataRoute.Sitemap = (eventsRes.data || []).map((item) => ({
    url: `${BASE_URL}/live-event/${item.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  const mediaPages: MetadataRoute.Sitemap = (mediaRes.data || []).map((item) => ({
    url: `${BASE_URL}/media/${item.id}`,
    lastModified: new Date(),
    changeFrequency: "weekly",
    priority: 0.7,
  }));

  return [...staticPages, ...newsPages, ...eventPages, ...mediaPages];
}
