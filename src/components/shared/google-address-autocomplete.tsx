'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { Input, Label, TextField } from '@heroui/react';

declare global {
  interface Window {
    google?: any;
    __googleMapsPlacesPromise?: Promise<void>;
  }
}

export interface GoogleAddressSelection {
  formattedAddress?: string;
  streetLine1?: string;
  city?: string;
  province?: string;
  postalCode?: string;
  countryCode?: string;
  latitude: number;
  longitude: number;
  neighborhood?: string;
  googlePlaceId?: string;
}

interface GoogleAddressAutocompleteProps {
  label?: string;
  placeholder?: string;
  apiKey?: string;
  value?: string;
  inputName?: string;
  countryCode?: string;
  className?: string;
  onSelect: (selection: GoogleAddressSelection) => void;
  onValueChange?: (value: string) => void;
}

interface GoogleLocationMapPreviewProps {
  apiKey?: string;
  latitude: number;
  longitude: number;
  address?: string | null;
  className?: string;
}

interface GooglePlacePrediction {
  description: string;
  place_id: string;
  structured_formatting?: {
    main_text?: string;
    secondary_text?: string;
  };
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

function parsePlace(place: any): GoogleAddressSelection | null {
  const location = place.geometry?.location;
  if (!location) return null;
  const latitude = typeof location.lat === 'function' ? location.lat() : Number(location.lat);
  const longitude = typeof location.lng === 'function' ? location.lng() : Number(location.lng);

  if (!Number.isFinite(latitude) || !Number.isFinite(longitude) || (latitude === 0 && longitude === 0)) {
    return null;
  }

  const components = place.address_components;
  const route = getAddressComponent(components, 'route');
  const streetNumber = getAddressComponent(components, 'street_number');
  const formattedAddress = place.formatted_address || place.name || '';
  const locality = getAddressComponent(components, 'locality');
  const city = locality || getAddressComponent(components, 'administrative_area_level_2');
  const province = getAddressComponent(components, 'administrative_area_level_1');
  const postalCode = getAddressComponent(components, 'postal_code');
  const countryCode = getAddressComponent(components, 'country', 'short');
  const neighborhood =
    getAddressComponent(components, 'neighborhood') ||
    getAddressComponent(components, 'sublocality_level_1') ||
    getAddressComponent(components, 'sublocality') ||
    city;

  return {
    formattedAddress,
    streetLine1: formattedAddress || [route, streetNumber].filter(Boolean).join(' '),
    city,
    province,
    postalCode,
    countryCode,
    latitude,
    longitude,
    neighborhood,
    googlePlaceId: place.place_id,
  };
}

export function GoogleLocationMapPreview({
  apiKey: apiKeyProp,
  latitude,
  longitude,
  address,
  className = '',
}: GoogleLocationMapPreviewProps) {
  const mapContainerRef = useRef<HTMLDivElement | null>(null);
  const mapRef = useRef<any>(null);
  const markerRef = useRef<any>(null);
  const [loadError, setLoadError] = useState<string | null>(null);
  const apiKey = apiKeyProp || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const hasCoordinates =
    Number.isFinite(latitude) &&
    Number.isFinite(longitude) &&
    !(latitude === 0 && longitude === 0);

  useEffect(() => {
    if (!apiKey || !hasCoordinates || !mapContainerRef.current) {
      return;
    }

    let active = true;
    const position = { lat: latitude, lng: longitude };

    loadGoogleMapsPlaces(apiKey)
      .then(() => {
        if (!active || !mapContainerRef.current || !window.google?.maps) {
          return;
        }

        const maps = window.google.maps;

        if (!mapRef.current) {
          mapRef.current = new maps.Map(mapContainerRef.current, {
            center: position,
            zoom: 17,
            clickableIcons: false,
            fullscreenControl: false,
            mapTypeControl: false,
            streetViewControl: false,
            gestureHandling: 'cooperative',
          });
        } else {
          mapRef.current.setCenter(position);
          mapRef.current.setZoom(17);
        }

        markerRef.current?.setMap?.(null);
        markerRef.current = new maps.Marker({
          map: mapRef.current,
          position,
          title: address || 'Direccion seleccionada',
        });
        setLoadError(null);
      })
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : 'No se pudo cargar el mapa');
      });

    return () => {
      active = false;
    };
  }, [address, apiKey, hasCoordinates, latitude, longitude]);

  if (!hasCoordinates) {
    return null;
  }

  return (
    <div className={`mt-3 ${className}`}>
      <div className="relative h-44 w-full overflow-hidden rounded-md border border-emerald-200 bg-white">
        <div ref={mapContainerRef} className="h-full w-full" aria-label="Mapa de la direccion seleccionada" />
        {!apiKey && (
          <div className="absolute inset-0 flex items-center justify-center bg-background/90 px-4 text-center text-sm text-muted-foreground">
            Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para ver el mapa.
          </div>
        )}
      </div>
      {loadError && <p className="mt-2 text-xs text-destructive">{loadError}</p>}
      <a
        href={`https://www.google.com/maps/search/?api=1&query=${latitude},${longitude}`}
        target="_blank"
        rel="noopener noreferrer"
        className="mt-2 inline-flex text-xs font-medium text-emerald-700 underline underline-offset-2 hover:text-emerald-900"
      >
        Abrir en Google Maps
      </a>
    </div>
  );
}

export function GoogleAddressAutocomplete({
  label = 'Buscar direccion con Google Maps',
  placeholder = 'Escribe y selecciona una direccion',
  apiKey: apiKeyProp,
  value,
  inputName = 'google-maps-address-search',
  countryCode = 'co',
  className = 'col-span-2',
  onSelect,
  onValueChange,
}: GoogleAddressAutocompleteProps) {
  const inputRef = useRef<HTMLInputElement | null>(null);
  const placesServiceNodeRef = useRef<HTMLDivElement | null>(null);
  const autocompleteServiceRef = useRef<any>(null);
  const placesServiceRef = useRef<any>(null);
  const sessionTokenRef = useRef<any>(null);
  const predictionsRequestRef = useRef(0);
  const blurTimeoutRef = useRef<number | null>(null);
  const [internalInputValue, setInternalInputValue] = useState('');
  const [predictions, setPredictions] = useState<GooglePlacePrediction[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [isLoadingDetails, setIsLoadingDetails] = useState(false);
  const [isMapsReady, setIsMapsReady] = useState(false);
  const [loadError, setLoadError] = useState<string | null>(null);
  const apiKey = apiKeyProp || process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const inputValue = value ?? internalInputValue;

  const updateInputValue = useCallback((nextValue: string) => {
    if (value === undefined) {
      setInternalInputValue(nextValue);
    }
    onValueChange?.(nextValue);
  }, [onValueChange, value]);

  useEffect(() => {
    if (!apiKey || !placesServiceNodeRef.current || autocompleteServiceRef.current) return;

    let active = true;

    loadGoogleMapsPlaces(apiKey)
      .then(() => {
        if (!active || !placesServiceNodeRef.current || !window.google?.maps?.places) return;

        autocompleteServiceRef.current = new window.google.maps.places.AutocompleteService();
        placesServiceRef.current = new window.google.maps.places.PlacesService(
          placesServiceNodeRef.current,
        );
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();
        setIsMapsReady(true);
      })
      .catch((error) => {
        setLoadError(error instanceof Error ? error.message : 'No se pudo cargar Google Maps');
      });

    return () => {
      active = false;
    };
  }, [apiKey]);

  useEffect(() => {
    const query = inputValue.trim();

    if (!query || !isMapsReady || !autocompleteServiceRef.current || !window.google?.maps?.places) {
      setPredictions([]);
      return;
    }

    const requestId = predictionsRequestRef.current + 1;
    predictionsRequestRef.current = requestId;

    const timeoutId = window.setTimeout(() => {
      autocompleteServiceRef.current.getPlacePredictions(
        {
          componentRestrictions: { country: countryCode },
          input: query,
          sessionToken: sessionTokenRef.current,
        },
        (results: GooglePlacePrediction[] | null, status: string) => {
          if (predictionsRequestRef.current !== requestId) return;

          if (status === window.google.maps.places.PlacesServiceStatus.OK && results?.length) {
            setPredictions(results);
            setIsOpen(true);
            return;
          }

          setPredictions([]);
        },
      );
    }, 220);

    return () => window.clearTimeout(timeoutId);
  }, [countryCode, inputValue, isMapsReady]);

  const handlePredictionSelect = useCallback((prediction: GooglePlacePrediction) => {
    if (!placesServiceRef.current || !window.google?.maps?.places) return;

    if (blurTimeoutRef.current) {
      window.clearTimeout(blurTimeoutRef.current);
    }

    updateInputValue(prediction.description);
    setIsOpen(false);
    setPredictions([]);
    setIsLoadingDetails(true);
    setLoadError(null);

    placesServiceRef.current.getDetails(
      {
        fields: ['address_components', 'formatted_address', 'geometry', 'name', 'place_id'],
        placeId: prediction.place_id,
        sessionToken: sessionTokenRef.current,
      },
      (place: any, status: string) => {
        setIsLoadingDetails(false);
        sessionTokenRef.current = new window.google.maps.places.AutocompleteSessionToken();

        if (status !== window.google.maps.places.PlacesServiceStatus.OK || !place) {
          setLoadError('No se pudo obtener la direccion seleccionada.');
          return;
        }

        const parsed = parsePlace(place);

        if (!parsed) {
          setLoadError('La direccion seleccionada no tiene coordenadas validas.');
          return;
        }

        const selectedAddress = parsed.formattedAddress || prediction.description;
        updateInputValue(selectedAddress);
        onSelect({
          ...parsed,
          formattedAddress: selectedAddress,
          streetLine1: selectedAddress,
        });
      },
    );
  }, [onSelect, updateInputValue]);

  if (!apiKey) {
    return (
      <p className="col-span-2 text-sm text-muted-foreground">
        Configura NEXT_PUBLIC_GOOGLE_MAPS_API_KEY para seleccionar direcciones con Google Maps.
      </p>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <TextField>
        <Label>{label}</Label>
        <Input
          ref={inputRef}
          name={inputName}
          placeholder={placeholder}
          value={inputValue}
          autoComplete="new-password"
          autoCorrect="off"
          spellCheck={false}
          onChange={(event) => {
            updateInputValue(event.target.value);
            setLoadError(null);
          }}
          onFocus={() => {
            if (predictions.length) {
              setIsOpen(true);
            }
          }}
          onBlur={() => {
            blurTimeoutRef.current = window.setTimeout(() => setIsOpen(false), 180);
          }}
        />
      </TextField>

      <p className="mt-2 text-sm text-muted-foreground">
        Selecciona una sugerencia para llenar automaticamente el campo Direccion.
      </p>

      {isOpen && predictions.length > 0 && (
        <div className="mt-3 max-h-64 overflow-y-auto rounded-lg border border-border bg-background shadow-xl">
          {predictions.map((prediction) => (
            <button
              key={prediction.place_id}
              type="button"
              className="flex w-full flex-col gap-0.5 border-b border-border/70 px-4 py-3 text-left last:border-b-0 hover:bg-muted"
              onMouseDown={(event) => {
                event.preventDefault();
                handlePredictionSelect(prediction);
              }}
            >
              <span className="font-semibold text-foreground">
                {prediction.structured_formatting?.main_text || prediction.description}
              </span>
              {prediction.structured_formatting?.secondary_text && (
                <span className="text-sm text-muted-foreground">
                  {prediction.structured_formatting.secondary_text}
                </span>
              )}
            </button>
          ))}
          <div className="px-4 py-2 text-right text-xs text-muted-foreground">Google</div>
        </div>
      )}

      {isLoadingDetails && (
        <p className="mt-2 text-sm text-muted-foreground">Cargando direccion seleccionada...</p>
      )}
      {loadError && <p className="mt-2 text-sm text-destructive">{loadError}</p>}
      <div ref={placesServiceNodeRef} className="hidden" aria-hidden />
    </div>
  );
}
