"use client";

import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import 'leaflet/dist/leaflet.css';
import type { LatLngExpression } from 'leaflet';

interface MapDisplayProps {
  center: LatLngExpression;
  zoom: number;
  markers?: Array<{
    position: LatLngExpression;
    popup: string;
  }>;
  className?: string;
  style?: React.CSSProperties;
}

export default function MapDisplay({ center, zoom, markers, className, style }: MapDisplayProps) {
  return (
    <MapContainer
      center={center}
      zoom={zoom}
      style={{ height: '400px', width: '100%', ...style }}
      className={className}
    >
      <TileLayer
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
      />
      {markers?.map((marker, index) => (
        <Marker key={index} position={marker.position}>
          <Popup>{marker.popup}</Popup>
        </Marker>
      ))}
    </MapContainer>
  );
}
