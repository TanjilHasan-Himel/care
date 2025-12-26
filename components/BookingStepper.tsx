"use client";

import { FormEvent, useEffect, useMemo, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { Service } from '@/data/services';
import { calculateCost, useBookingStore } from '@/lib/booking-store';
import { fetchAreas, fetchCities, fetchDistricts, fetchDivisions } from '@/lib/zapshift';

export type Unit = 'hours' | 'days';

export type StepperSummary = {
  durationValue: number;
  durationUnit: Unit;
  division?: string;
  district?: string;
  city?: string;
  area?: string;
  addressLine?: string;
  totalCost: number;
};

export function BookingStepper({ service, onSummaryChange }: { service: Service; onSummaryChange?: (summary: StepperSummary) => void }) {
  const { data: session } = useSession();
  const router = useRouter();
  const pathname = usePathname();
  const addBooking = useBookingStore((s) => s.addBooking);

  const [step, setStep] = useState(1); // 1: Duration, 2: Location, 3: Address

  const [durationValue, setDurationValue] = useState(4);
  const [durationUnit, setDurationUnit] = useState<Unit>('hours');

  const [divisionId, setDivisionId] = useState('');
  const [districtId, setDistrictId] = useState('');
  const [cityId, setCityId] = useState('');
  const [areaId, setAreaId] = useState('');

  const [divisions, setDivisions] = useState<{ id: string; name: string }[]>([]);
  const [districts, setDistricts] = useState<{ id: string; name: string }[]>([]);
  const [cities, setCities] = useState<{ id: string; name: string }[]>([]);
  const [areas, setAreas] = useState<{ id: string; name: string }[]>([]);

  const [loadingDiv, setLoadingDiv] = useState(false);
  const [loadingDis, setLoadingDis] = useState(false);
  const [loadingCity, setLoadingCity] = useState(false);
  const [loadingArea, setLoadingArea] = useState(false);
  const [errDiv, setErrDiv] = useState<string | null>(null);
  const [errDis, setErrDis] = useState<string | null>(null);
  const [errCity, setErrCity] = useState<string | null>(null);
  const [errArea, setErrArea] = useState<string | null>(null);

  const [addressLine, setAddressLine] = useState('');
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');

  const totalCost = useMemo(
    () => calculateCost(service.pricePerHour, service.pricePerDay, durationValue, durationUnit),
    [service.pricePerHour, service.pricePerDay, durationValue, durationUnit]
  );

  useEffect(() => {
    if (!onSummaryChange) return;
    onSummaryChange({
      durationValue,
      durationUnit,
      division: divisions.find((d) => d.id === divisionId)?.name,
      district: districts.find((d) => d.id === districtId)?.name,
      city: cities.find((d) => d.id === cityId)?.name,
      area: areas.find((d) => d.id === areaId)?.name,
      addressLine,
      totalCost
    });
  }, [durationValue, durationUnit, divisionId, districtId, cityId, areaId, divisions, districts, cities, areas, addressLine, totalCost, onSummaryChange]);

  // Load divisions on mount
  useEffect(() => {
    const load = async () => {
      setLoadingDiv(true); setErrDiv(null);
      try {
        const list = await fetchDivisions();
        setDivisions(list);
      } catch (e) {
        setErrDiv('Failed to load divisions');
      } finally {
        setLoadingDiv(false);
      }
    };
    load();
  }, []);

  // Load districts when division changes
  useEffect(() => {
    if (!divisionId) { setDistricts([]); setDistrictId(''); return; }
    const load = async () => {
      setLoadingDis(true); setErrDis(null);
      try {
        const list = await fetchDistricts(divisionId);
        setDistricts(list);
      } catch { setErrDis('Failed to load districts'); }
      finally { setLoadingDis(false); }
    };
    load();
  }, [divisionId]);

  // Load cities when district changes
  useEffect(() => {
    if (!districtId) { setCities([]); setCityId(''); return; }
    const load = async () => {
      setLoadingCity(true); setErrCity(null);
      try {
        const list = await fetchCities(districtId);
        setCities(list);
      } catch { setErrCity('Failed to load cities'); }
      finally { setLoadingCity(false); }
    };
    load();
  }, [districtId]);

  // Load areas when city changes
  useEffect(() => {
    if (!cityId) { setAreas([]); setAreaId(''); return; }
    const load = async () => {
      setLoadingArea(true); setErrArea(null);
      try {
        const list = await fetchAreas(cityId);
        setAreas(list);
      } catch { setErrArea('Failed to load areas'); }
      finally { setLoadingArea(false); }
    };
    load();
  }, [cityId]);

  const canNextFromDuration = durationValue > 0;
  const canNextFromLocation = divisionId && districtId && cityId && areaId;
  const canSubmit = canNextFromDuration && canNextFromLocation && addressLine.trim().length > 5;

  const onSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    if (!session?.user?.email) {
      router.push(`/login?callbackUrl=${encodeURIComponent(pathname)}`);
      return;
    }
    if (!canSubmit) {
      setError('Please complete all steps before confirming.');
      return;
    }
    setSubmitting(true);
    const booking = addBooking({
      serviceId: service.id,
      serviceSlug: service.slug,
      serviceName: service.name,
      durationValue,
      durationUnit,
      division: divisions.find(d => d.id === divisionId)?.name || divisionId,
      district: districts.find(d => d.id === districtId)?.name || districtId,
      city: cities.find(d => d.id === cityId)?.name || cityId,
      area: areas.find(d => d.id === areaId)?.name || areaId,
      addressLine,
      totalCost,
      userEmail: session.user.email
    });

    await fetch('/api/notify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        to: session.user.email,
        subject: `Booking invoice - ${service.name}`,
        html: `<p>Hi ${session.user.name || ''},</p><p>Your booking for ${service.name} is received.</p><p>Total: $${totalCost}</p><p>Status: Pending</p>`
      })
    }).catch(() => {});

    setSubmitting(false);
    router.push('/my-bookings');
    return booking;
  };

  return (
    <form className="card flex flex-col gap-4" onSubmit={onSubmit}>
      {error && <div className="rounded-lg bg-red-50 px-3 py-2 text-sm text-red-700">{error}</div>}

      {/* Stepper header */}
      <ol className="flex items-center gap-2 text-sm">
        <li className={`px-2 py-1 rounded-full ${step === 1 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>1. Duration</li>
        <li className={`px-2 py-1 rounded-full ${step === 2 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>2. Location</li>
        <li className={`px-2 py-1 rounded-full ${step === 3 ? 'bg-teal-600 text-white' : 'bg-slate-100 text-slate-700'}`}>3. Address</li>
      </ol>

      {/* Step 1: Duration */}
      {step === 1 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <label className="flex flex-col gap-1">
            <span className="label">Duration value</span>
            <input
              className="input"
              type="number"
              min={1}
              value={durationValue}
              onChange={(e) => setDurationValue(Number(e.target.value))}
              required
            />
          </label>
          <label className="flex flex-col gap-1">
            <span className="label">Unit</span>
            <select className="input" value={durationUnit} onChange={(e) => setDurationUnit(e.target.value as Unit)}>
              <option value="hours">Hours</option>
              <option value="days">Days</option>
            </select>
          </label>
          <div className="sm:col-span-2 rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <p className="font-semibold">Total cost</p>
            <p>${totalCost} ({durationValue} {durationUnit})</p>
          </div>
          <div className="sm:col-span-2 flex items-center justify-between">
            <span className="text-sm text-slate-500">Pricing: ${service.pricePerHour}/hr • ${service.pricePerDay}/day</span>
            <button type="button" className="btn-primary" onClick={() => setStep(2)} disabled={!canNextFromDuration}>Next</button>
          </div>
        </div>
      )}

      {/* Step 2: Location */}
      {step === 2 && (
        <div className="grid gap-4 sm:grid-cols-2">
          <div className="flex flex-col gap-1 sm:col-span-2">
            <span className="label">Division</span>
            <div className="flex gap-2">
              <select className="input flex-1" value={divisionId} onChange={(e) => setDivisionId(e.target.value)}>
                <option value="">Select division</option>
                {divisions.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {loadingDiv && <span className="text-xs text-slate-500 self-center">Loading...</span>}
              {errDiv && <button type="button" className="text-xs text-red-600 underline" onClick={() => {
                setErrDiv(null); setLoadingDiv(true); fetchDivisions().then(setDivisions).catch(()=>setErrDiv('Failed to load divisions')).finally(()=>setLoadingDiv(false));
              }}>Retry</button>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="label">District</span>
            <div className="flex gap-2">
              <select className="input flex-1" value={districtId} onChange={(e) => setDistrictId(e.target.value)} disabled={!divisionId}>
                <option value="">Select district</option>
                {districts.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {loadingDis && <span className="text-xs text-slate-500 self-center">Loading...</span>}
              {errDis && <button type="button" className="text-xs text-red-600 underline" onClick={() => {
                setErrDis(null); setLoadingDis(true); fetchDistricts(divisionId).then(setDistricts).catch(()=>setErrDis('Failed to load districts')).finally(()=>setLoadingDis(false));
              }}>Retry</button>}
            </div>
          </div>

          <div className="flex flex-col gap-1">
            <span className="label">City / Upazila</span>
            <div className="flex gap-2">
              <select className="input flex-1" value={cityId} onChange={(e) => setCityId(e.target.value)} disabled={!districtId}>
                <option value="">Select city</option>
                {cities.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {loadingCity && <span className="text-xs text-slate-500 self-center">Loading...</span>}
              {errCity && <button type="button" className="text-xs text-red-600 underline" onClick={() => {
                setErrCity(null); setLoadingCity(true); fetchCities(districtId).then(setCities).catch(()=>setErrCity('Failed to load cities')).finally(()=>setLoadingCity(false));
              }}>Retry</button>}
            </div>
          </div>

          <div className="flex flex-col gap-1 sm:col-span-2">
            <span className="label">Area / Union</span>
            <div className="flex gap-2">
              <select className="input flex-1" value={areaId} onChange={(e) => setAreaId(e.target.value)} disabled={!cityId}>
                <option value="">Select area</option>
                {areas.map((d) => (
                  <option key={d.id} value={d.id}>{d.name}</option>
                ))}
              </select>
              {loadingArea && <span className="text-xs text-slate-500 self-center">Loading...</span>}
              {errArea && <button type="button" className="text-xs text-red-600 underline" onClick={() => {
                setErrArea(null); setLoadingArea(true); fetchAreas(cityId).then(setAreas).catch(()=>setErrArea('Failed to load areas')).finally(()=>setLoadingArea(false));
              }}>Retry</button>}
            </div>
          </div>

          <div className="sm:col-span-2 flex items-center justify-between">
            <button type="button" className="btn-ghost" onClick={() => setStep(1)}>Back</button>
            <button type="button" className="btn-primary" onClick={() => setStep(3)} disabled={!canNextFromLocation}>Next</button>
          </div>
        </div>
      )}

      {/* Step 3: Address */}
      {step === 3 && (
        <div className="grid gap-4">
          <label className="flex flex-col gap-1">
            <span className="label">Address</span>
            <textarea
              className="input min-h-[90px]"
              value={addressLine}
              onChange={(e) => setAddressLine(e.target.value)}
              placeholder="House, road, landmark"
              required
            />
          </label>

          <div className="rounded-xl bg-blue-50 px-4 py-3 text-sm text-blue-900">
            <p className="font-semibold">Order summary</p>
            <p>Service: {service.name}</p>
            <p>Duration: {durationValue} {durationUnit}</p>
            <p>Location: {[divisions.find(d=>d.id===divisionId)?.name, districts.find(d=>d.id===districtId)?.name, cities.find(d=>d.id===cityId)?.name, areas.find(d=>d.id===areaId)?.name].filter(Boolean).join(' › ')}</p>
            <p className="mt-1">Total: ${totalCost}</p>
          </div>

          <div className="flex items-center justify-between">
            <button type="button" className="btn-ghost" onClick={() => setStep(2)}>Back</button>
            <button type="submit" className="btn-primary" disabled={!canSubmit || submitting}>{submitting ? 'Saving...' : 'Confirm Booking'}</button>
          </div>
        </div>
      )}
    </form>
  );
}
