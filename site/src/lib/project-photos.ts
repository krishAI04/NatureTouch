// Build-time helper: every graded master for a project, in order (01.jpg is the cover).
const all = import.meta.glob<{ default: ImageMetadata }>('../assets/projects/*/*.jpg', { eager: true });

export function photosOf(slug: string): ImageMetadata[] {
  return Object.entries(all)
    .filter(([path]) => path.includes(`/projects/${slug}/`))
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([, m]) => m.default);
}

/** '<slug>/<NN>' for a photo, used to look up its alt text */
export function keyOf(img: ImageMetadata): string {
  const hit = Object.entries(all).find(([, m]) => m.default === img);
  const m = hit?.[0].match(/projects\/([^/]+)\/(\d+)\.jpg$/);
  return m ? `${m[1]}/${m[2]}` : '';
}

export const coverOf = (slug: string) => photosOf(slug)[0];

/** The sharpest photo (most pixels) for full-bleed use; the cover can be a small portrait crop. */
export const heroOf = (slug: string) => [...photosOf(slug)].sort((a, b) => b.width * b.height - a.width * a.height)[0];
