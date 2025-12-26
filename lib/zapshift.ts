export type Division = { id: string; name: string };
export type District = { id: string; name: string; divisionId?: string };
export type City = { id: string; name: string; districtId?: string };
export type Area = { id: string; name: string; cityId?: string };

const BASE = process.env.NEXT_PUBLIC_ZAPSHIFT_BASE ||
  'https://raw.githubusercontent.com/ProgrammingHero1/zap-shift-resources/main/data';

const cache = new Map<string, unknown>();

async function getJSON<T>(path: string): Promise<T> {
  const url = `${BASE}/${path}`;
  if (cache.has(url)) return cache.get(url) as T;
  const res = await fetch(url, { next: { revalidate: 60 * 60 } });
  if (!res.ok) throw new Error(`Failed to fetch ${path}`);
  const data = (await res.json()) as T;
  cache.set(url, data);
  return data;
}

export async function fetchDivisions(): Promise<Division[]> {
  // Try common file names in this order
  for (const candidate of ['divisions.json', 'division.json', 'Divisions.json']) {
    try {
      const data = await getJSON<any>(candidate);
      if (Array.isArray(data)) return data.map((d) => normalizeNode(d));
      if (Array.isArray(data?.data)) return data.data.map((d: any) => normalizeNode(d));
    } catch {}
  }
  return [];
}

export async function fetchDistricts(divisionId: string): Promise<District[]> {
  for (const candidate of ['districts.json', 'district.json', 'Districts.json']) {
    try {
      const raw = await getJSON<any>(candidate);
      const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
      return list
        .filter((x: any) => matchParent(x, divisionId, ['division_id', 'divisionId', 'parentId']))
        .map((d: any) => normalizeNode(d, divisionId));
    } catch {}
  }
  return [];
}

export async function fetchCities(districtId: string): Promise<City[]> {
  for (const candidate of ['cities.json', 'city.json', 'upazilas.json', 'Cities.json']) {
    try {
      const raw = await getJSON<any>(candidate);
      const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
      return list
        .filter((x: any) => matchParent(x, districtId, ['district_id', 'districtId', 'parentId']))
        .map((d: any) => normalizeNode(d, districtId));
    } catch {}
  }
  return [];
}

export async function fetchAreas(cityId: string): Promise<Area[]> {
  for (const candidate of ['areas.json', 'area.json', 'unions.json', 'Areas.json']) {
    try {
      const raw = await getJSON<any>(candidate);
      const list = Array.isArray(raw?.data) ? raw.data : Array.isArray(raw) ? raw : [];
      return list
        .filter((x: any) => matchParent(x, cityId, ['city_id', 'cityId', 'upazila_id', 'parentId']))
        .map((d: any) => normalizeNode(d, cityId));
    } catch {}
  }
  return [];
}

function normalizeNode<T extends { id: string; name: string }>(x: any, parentId?: string): T {
  const id = String(x?.id ?? x?.code ?? x?._id ?? x?.value ?? x?.slug);
  const name = String(x?.name ?? x?.bn_name ?? x?.title ?? x?.label ?? id);
  const node: any = { id, name };
  if (parentId) node.parentId = parentId;
  return node as T;
}

function matchParent(x: any, parentId: string, keys: string[]) {
  return keys.some((k) => String(x?.[k]) === String(parentId));
}
