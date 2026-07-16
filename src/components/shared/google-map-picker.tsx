'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Button } from '@heroui/react';
import { MapPin, X } from 'lucide-react';

declare global {
  interface Window {
    google?: any;
    __googleMapsPlacesPromise?: Promise<void>;
  }
}

export interface MapPickerSelection {
  latitude: number;
  longitude: number;
  formattedAddress?: string;
  streetLine1?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  countryCode?: string;
  neighborhood?: string;
}

interface GoogleMapPickerProps {
  apiKey?: string;
  initialLatitude?: number;
  initialLongitude?: number;
  onLocationSelect: (selection: MapPickerSelection) => void;
  onClose: () => void;
  defaultCenter?: { lat: number; lng: number };
}

function loadGoogleMapsPlaces(apiKey: string) {
  if (window.google?.maps?.places) {
    return Promise.resolve();
  }

  if (window.__googleMapsPlacesPromise) {
    return window.__googleMapsPlacesPromise;
  }

  window.__googleMapsPlacesPromise = new Promise<void>((resolve, reject) => {
    const script = document.createElement('script');
    const params = new URLSearchParams({
      key: apiKey,
      libraries: 'places',
      v: 'weekly',
    });

    script.src = `https://maps.googleapis.com/maps/api/js?${params.toString()}`;
    script.async = true;
    script.defer = true;
    script.onload = () => resolve();
    script.onerror = () => reject(new Error('No se pudo cargar Google Maps'));
    document.head.appendChild(script);
  });

  return window.__googleMapsPlacesPromise;
}

function getAddressComponent(
  components: Array<{ long_name: string; short_name: string; types: string[] }> | undefined,
  type: string,
  variant: 'long' | 'short' = 'long',
) {
  const component = components?.find(item => item.types.includes(type));
  if (!component) return '';
  return variant === 'short' ? component.short_name : component.long_name;
}

export function GoogleMapPicker({
  apiKey: apiKeyProp,
  initialLatitude,
  initialLongitude,
  onLocationSelect,
  onClose,
  defaultCenter = { lat: 2.4448, lng: -76.6147 }, // Popayán, Cauca por defecto
}: GoogleMapPickerProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const geocoderRef = useRef<any>(null);
  const [selectedLocation, setSelectedLocation] = useState<{ lat: number; lng: number } | null>(
    initialLatitude && initialLongitude
      ? { lat: initialLatitude, lng: initialLongitude }
      : null
  );
  const [address, setAddress] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const apiKey = apiKeyProp || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  useEffect(() => {
    if (!apiKey || !mapContainerRef.current) {
      return;
    }

    let active = true;
    setIsLoading(true);

    loadGoogleMapsPlaces(apiKey)
      .then(() => {
        if (!active || !mapContainerRef.current || !window.google?.maps) {
          return;
        }

        const maps = window.google.maps;
        const center = selectedLocation || defaultCenter;

        // Crear el mapa
        mapRef.current = new maps.Map(mapContainerRef.current, {
          center,
          zoom: selectedLocation ? 17 : 13,
          clickableIcons: false,
          fullscreenControl: false,
          mapTypeControl: true,
          streetViewControl: true,
          gestureHandling: 'greedy',
        });

        // Crear geocoder para reverse geocoding
        geocoderRef.current = new maps.Geocoder();

        // Si hay ubicación inicial, crear marcador
        if (selectedLocation) {
          markerRef.current = new maps.Marker({
            map: mapRef.current,
            position: selectedLocation,
            draggable: true,
            animation: maps.Animation.DROP,
          });

          // Evento cuando se arrastra el marcador
          markerRef.current.addListener('dragend', (event: any) => {
            const newPosition = {
              lat: event.latLng.lat(),
              lng: event.latLng.lng(),
            };
            setSelectedLocation(newPosition);
            reverseGeocode(newPosition);
          });
        }

        // Evento de clic en el mapa
        mapRef.current.addListener('click', (event: any) => {
          const clickedPosition = {
            lat: event.latLng.lat(),
            lng: event.latLng.lng(),
          };

          // Actualizar o crear marcador
          if (markerRef.current) {
            markerRef.current.setPosition(clickedPosition);
            markerRef.current.setAnimation(maps.Animation.BOUNCE);
            setTimeout(() => markerRef.current?.setAnimation(null), 700);
          } else {
            markerRef.current = new maps.Marker({
              map: mapRef.current,
              position: clickedPosition,
              draggable: true,
              animation: maps.Animation.DROP,
            });

            // Evento cuando se arrastra el marcador
            markerRef.current.addListener('dragend', (dragEvent: any) => {
              const newPosition = {
                lat: dragEvent.latLng.lat(),
                lng: dragEvent.latLng.lng(),
              };
              setSelectedLocation(newPosition);
              reverseGeocode(newPosition);
            });
          }

          setSelectedLocation(clickedPosition);
          reverseGeocode(clickedPosition);
        });

        // Si hay ubicación inicial, obtener dirección
        if (selectedLocation) {
          reverseGeocode(selectedLocation);
        }

        setIsLoading(false);
        setLoadError(null);
      })
      .catch((error) => {
        setIsLoading(false);
        setLoadError(error instanceof Error ? error.message : 'No se pudo cargar el mapa');
      });

    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [apiKey]);

  const reverseGeocode = useCallback((position: { lat: number; lng: number }) => {
    if (!geocoderRef.current) return;

    geocoderRef.current.geocode(
      { location: position },
      (results: any[], status: string) => {
        if (status === 'OK' && results?.[0]) {
          const place = results[0];
          setAddress(place.formatted_address || '');
        } else {
          setAddress(`${position.lat.toFixed(6)}, ${position.lng.toFixed(6)}`);
        }
      }
    );
  }, []);

  const handleConfirm = useCallback(() => {
    if (!selectedLocation) {
      return;
    }

    if (!geocoderRef.current) {
      onLocationSelect({
        latitude: selectedLocation.lat,
        longitude: selectedLocation.lng,
        formattedAddress: address || `${selectedLocation.lat}, ${selectedLocation.lng}`,
        streetLine1: address || `${selectedLocation.lat}, ${selectedLocation.lng}`,
      });
      return;
    }

    // Obtener información detallada de la dirección
    geocoderRef.current.geocode(
      { location: selectedLocation },
      (results: any[], status: string) => {
        if (status === 'OK' && results?.[0]) {
          const place = results[0];
          const components = place.address_components;

          const route = getAddressComponent(components, 'route');
          const streetNumber = getAddressComponent(components, 'street_number');
          const formattedAddress = place.formatted_address || '';
          
          // Extraer ciudad - priorizar locality, luego administrative_area_level_2
          const locality = getAddressComponent(components, 'locality');
          const adminLevel2 = getAddressComponent(components, 'administrative_area_level_2');
          const city = locality || adminLevel2 || '';
          
          // Extraer provincia/departamento/estado
          const province = getAddressComponent(components, 'administrative_area_level_1') || '';
          
          const postalCode = getAddressComponent(components, 'postal_code');
          const countryCode = getAddressComponent(components, 'country', 'short');
          const neighborhood =
            getAddressComponent(components, 'neighborhood') ||
            getAddressComponent(components, 'sublocality_level_1') ||
            getAddressComponent(components, 'sublocality') ||
            '';

          onLocationSelect({
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
            formattedAddress,
            streetLine1: formattedAddress || [route, streetNumber].filter(Boolean).join(' '),
            city,
            province,
            postalCode,
            countryCode,
            neighborhood,
          });
        } else {
          // Si falla el geocoding, enviar solo las coordenadas
          onLocationSelect({
            latitude: selectedLocation.lat,
            longitude: selectedLocation.lng,
            formattedAddress: address || `${selectedLocation.lat}, ${selectedLocation.lng}`,
            streetLine1: address || `${selectedLocation.lat}, ${selectedLocation.lng}`,
          });
        }
      }
    );
  }, [selectedLocation, address, onLocationSelect]);

  if (!apiKey) {
    return (
      <div className="rounded-lg border border-border bg-background p-6 text-center">
        <p className="text-sm text-muted-foreground">
          Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para usar el selector de mapa.
        </p>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
      <div className="relative w-full max-w-4xl max-h-[90vh] bg-background rounded-2xl shadow-2xl overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-border bg-gradient-to-r from-[#9969F8]/5 to-[#6BB8FF]/5 flex-shrink-0">
          <div>
            <h3 className="text-lg font-bold text-foreground flex items-center gap-2">
              <MapPin className="h-5 w-5 text-[#9969F8]" />
              Seleccionar ubicación en el mapa
            </h3>
            <p className="text-sm text-muted-foreground mt-1">
              Haz clic en el mapa o arrastra el marcador para seleccionar tu ubicación
            </p>
          </div>
          <Button
            isIconOnly
            variant="ghost"
            onPress={onClose}
            className="text-muted-foreground hover:text-foreground"
            aria-label="Cerrar"
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* Map Container */}
        <div className="relative flex-1 min-h-[240px]">
          <div
            ref={mapContainerRef}
            className="w-full h-full min-h-[240px] bg-muted"
            aria-label="Mapa para seleccionar ubicación"
          />

          {isLoading && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#9969F8] mx-auto mb-3" />
                <p className="text-sm text-muted-foreground">Cargando mapa...</p>
              </div>
            </div>
          )}

          {loadError && (
            <div className="absolute inset-0 flex items-center justify-center bg-background/90">
              <div className="text-center max-w-md px-4">
                <p className="text-sm text-destructive">{loadError}</p>
              </div>
            </div>
          )}
        </div>

        {/* Address Display & Actions */}
        <div className="px-6 py-4 border-t border-border bg-muted/30 flex-shrink-0 overflow-y-auto">
          {selectedLocation && address && (
            <div className="mb-4 p-3 rounded-lg bg-background border border-border">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-1">
                Dirección seleccionada:
              </p>
              <p className="text-sm font-medium text-foreground">{address}</p>
              <p className="text-xs text-muted-foreground mt-1">
                Coordenadas: {selectedLocation.lat.toFixed(6)}, {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
          )}

          <div className="flex justify-end gap-3">
            <Button
              type="button"
              variant="danger-soft"
              className="rounded-xl px-5"
              onPress={onClose}
            >
              Cancelar
            </Button>
            <Button
              type="button"
              isDisabled={!selectedLocation}
              className="rounded-xl px-6 bg-[#9969F8] text-white hover:opacity-90 transition"
              onPress={handleConfirm}
            >
              <MapPin className="h-4 w-4 mr-2" />
              Confirmar ubicación
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
