"use client";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import Link from "next/link";
import { useEffect, useMemo, useRef } from "react";
import { MapContainer, Marker, Popup, TileLayer, Tooltip, useMap } from "react-leaflet";
import { company } from "@/lib/content";
import type { MapProject } from "@/lib/map";

export type { MapProject };
export type Selection = { slug: string; from: "map" | "list" } | null;

const esc = (s: string) => s.replace(/[&<>"']/g, (c) => `&#${c.charCodeAt(0)};`);

const officeIcon = L.divIcon({
  className: "",
  iconSize: [28, 36],
  iconAnchor: [14, 34],
  popupAnchor: [0, -30],
  html: `<div class="gbc-pin"><svg width="28" height="36" viewBox="0 0 28 36" xmlns="http://www.w3.org/2000/svg" style="display:block;position:relative"><path d="M14 35s12-11 12-21A12 12 0 0 0 2 14c0 10 12 21 12 21Z" fill="#20382f" stroke="#f5f3ec" stroke-width="2"/><circle cx="14" cy="14" r="4.5" fill="#f5f3ec"/></svg></div>`,
});

// Photo pin: project thumbnail in a framed tile with a pointer. Dashed frame = approximate position.
const photoIcon = (p: MapProject, i: number) =>
  L.divIcon({
    className: "",
    iconSize: [56, 66],
    iconAnchor: [28, 64],
    popupAnchor: [0, -62],
    html: `<div class="gbc-photo-drop" style="--d:${0.5 + i * 0.12}s"><div class="gbc-photo-pin${p.approximate ? " is-approx" : ""}"><span class="gbc-photo-pin__img"><img src="${esc(p.image)}" alt="" /></span></div></div>`,
  });

const tiles = process.env.NEXT_PUBLIC_MAP_TILE_URL ?? "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png";
const reduceMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

function Controller({
  projects,
  selected,
  hovered,
  markers,
}: {
  projects: MapProject[];
  selected: Selection;
  hovered: string | null;
  markers: React.RefObject<Record<string, L.Marker>>;
}) {
  const map = useMap();

  // Frame the office and every project pin (pins grow upwards, so pad the top more).
  useEffect(() => {
    if (!projects.length) return;
    const bounds = L.latLngBounds([company.coords, ...projects.map((p) => [p.latitude, p.longitude] as [number, number])]);
    map.fitBounds(bounds, { paddingTopLeft: [50, 90], paddingBottomRight: [50, 30], maxZoom: 14, animate: false });
  }, [map, projects]);

  // Highlight the selected / hovered pin and lift it above the others.
  useEffect(() => {
    for (const [slug, m] of Object.entries(markers.current)) {
      const on = slug === selected?.slug || slug === hovered;
      m.getElement()?.querySelector(".gbc-photo-pin")?.classList.toggle("is-active", on);
      m.setZIndexOffset(on ? 1000 : 0);
    }
  }, [selected, hovered, projects, markers]);

  // Picking a project from the list flies to it, then opens its card.
  useEffect(() => {
    if (selected?.from !== "list") return;
    const m = markers.current[selected.slug];
    if (!m) return;
    if (reduceMotion()) {
      map.setView(m.getLatLng(), Math.max(map.getZoom(), 14), { animate: false });
      m.openPopup();
      return;
    }
    map.once("moveend", () => m.openPopup());
    map.flyTo(m.getLatLng(), Math.max(map.getZoom(), 14), { duration: 0.8 });
  }, [selected, map, markers]);

  return null;
}

export default function ProjectMap({
  projects = [],
  zoom = 12,
  interactive = true,
  selected = null,
  hovered = null,
  onSelect,
}: {
  projects?: MapProject[];
  zoom?: number;
  interactive?: boolean;
  selected?: Selection;
  hovered?: string | null;
  onSelect?: (s: Selection) => void;
}) {
  const markers = useRef<Record<string, L.Marker>>({});
  const icons = useMemo(() => Object.fromEntries(projects.map((p, i) => [p.slug, photoIcon(p, i)])), [projects]);

  return (
    <MapContainer
      center={company.coords}
      zoom={zoom}
      scrollWheelZoom={false}
      dragging={interactive}
      zoomControl={interactive}
      doubleClickZoom={interactive}
      touchZoom={interactive}
      attributionControl
      className="h-full w-full [&_.leaflet-tile-pane]:[filter:saturate(.55)_sepia(.12)]"
    >
      <TileLayer url={tiles} attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors' />
      <Controller projects={projects} selected={selected} hovered={hovered} markers={markers} />
      <Marker position={company.coords} icon={officeIcon} zIndexOffset={-100}>
        <Tooltip permanent direction="right" offset={[12, -18]} className="gbc-map-label">
          {company.city}
        </Tooltip>
      </Marker>
      {projects.map((p) => (
        <Marker
          key={p.slug}
          position={[p.latitude, p.longitude]}
          icon={icons[p.slug]}
          title={p.title}
          alt={p.title}
          ref={(m) => {
            if (m) markers.current[p.slug] = m;
            else delete markers.current[p.slug];
          }}
          eventHandlers={{ click: () => onSelect?.({ slug: p.slug, from: "map" }) }}
        >
          <Popup className="gbc-popup" minWidth={240} maxWidth={240} closeButton>
            <Link href={`/projects/${p.slug}`} className="block">
              {/* eslint-disable-next-line @next/next/no-img-element -- Leaflet popup, sized by CSS */}
              <img src={p.image} alt={p.imageNote ? `${p.category} illustrative architecture visual` : `${p.title}, ${p.location}`} className="gbc-popup__img" />
            </Link>
            <div className="gbc-popup__body">
              <p className="gbc-popup__cat">{p.category}</p>
              <p className="gbc-popup__title">{p.title}</p>
              <p className="gbc-popup__loc">
                {p.location}
                {p.approximate && <span> · approximate position</span>}
              </p>
              {p.imageNote && <p className="mt-2 text-[10px] uppercase tracking-wide text-muted">{p.imageNote}</p>}
              <Link href={`/projects/${p.slug}`} className="gbc-popup__link">
                View project
              </Link>
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
