import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { useState, useCallback } from 'react';
import { MapPin, Navigation } from 'lucide-react';
import { mockJobs } from '@/data/mockJobs';

const containerStyle = {
  width: '100%',
  height: '100%',
  borderRadius: '1rem',
};

const center = {
  lat: 40.4093,
  lng: 49.8671,
};

const mapStyles = [
  {
    featureType: 'all',
    elementType: 'geometry.fill',
    stylers: [{ weight: '2.00' }],
  },
  {
    featureType: 'all',
    elementType: 'geometry.stroke',
    stylers: [{ color: '#9c9c9c' }],
  },
  {
    featureType: 'all',
    elementType: 'labels.text',
    stylers: [{ visibility: 'on' }],
  },
  {
    featureType: 'landscape',
    elementType: 'all',
    stylers: [{ color: '#f2f2f2' }],
  },
  {
    featureType: 'landscape',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'landscape.man_made',
    elementType: 'geometry.fill',
    stylers: [{ color: '#ffffff' }],
  },
  {
    featureType: 'poi',
    elementType: 'all',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'road',
    elementType: 'all',
    stylers: [{ saturation: -100 }, { lightness: 45 }],
  },
  {
    featureType: 'road.highway',
    elementType: 'all',
    stylers: [{ visibility: 'simplified' }],
  },
  {
    featureType: 'road.highway',
    elementType: 'geometry.fill',
    stylers: [{ color: '#fac669' }],
  },
  {
    featureType: 'road.arterial',
    elementType: 'labels.icon',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'transit',
    elementType: 'all',
    stylers: [{ visibility: 'off' }],
  },
  {
    featureType: 'water',
    elementType: 'all',
    stylers: [{ color: '#c3e7f5' }, { visibility: 'on' }],
  },
];

interface JobLocation {
  id: string;
  title: string;
  location: string;
  salary: string;
  lat: number;
  lng: number;
}

const jobLocations: JobLocation[] = [
  { id: '1', title: 'Tədbir Köməkçisi', location: 'Bakı, Nəsimi', salary: '60 AZN/gün', lat: 40.4093, lng: 49.8671 },
  { id: '2', title: 'Ofisiant', location: 'Bakı, Xətai', salary: '50 AZN/gün', lat: 40.3897, lng: 49.8766 },
  { id: '3', title: 'Anbar İşçisi', location: 'Bakı, Binəqədi', salary: '55 AZN/gün', lat: 40.4485, lng: 49.8199 },
  { id: '4', title: 'Reklam Paylayanı', location: 'Bakı, Yasamal', salary: '45 AZN/gün', lat: 40.3956, lng: 49.8516 },
  { id: '5', title: 'Festival Köməkçisi', location: 'Bakı, Səbail', salary: '70 AZN/gün', lat: 40.3665, lng: 49.8326 },
];

interface LocationMapProps {
  apiKey: string;
}

export function LocationMap({ apiKey }: LocationMapProps) {
  const [selectedJob, setSelectedJob] = useState<JobLocation | null>(null);
  const [map, setMap] = useState<google.maps.Map | null>(null);

  const onLoad = useCallback((map: google.maps.Map) => {
    setMap(map);
  }, []);

  const onUnmount = useCallback(() => {
    setMap(null);
  }, []);

  return (
    <LoadScript googleMapsApiKey={apiKey}>
      <GoogleMap
        mapContainerStyle={containerStyle}
        center={center}
        zoom={12}
        onLoad={onLoad}
        onUnmount={onUnmount}
        options={{
          styles: mapStyles,
          disableDefaultUI: true,
          zoomControl: true,
          fullscreenControl: true,
        }}
      >
        {jobLocations.map((job) => (
          <Marker
            key={job.id}
            position={{ lat: job.lat, lng: job.lng }}
            onClick={() => setSelectedJob(job)}
            icon={{
              url: `data:image/svg+xml,${encodeURIComponent(`
                <svg xmlns="http://www.w3.org/2000/svg" width="40" height="40" viewBox="0 0 40 40">
                  <circle cx="20" cy="20" r="18" fill="#f97316" stroke="white" stroke-width="3"/>
                  <circle cx="20" cy="20" r="8" fill="white"/>
                </svg>
              `)}`,
              scaledSize: new google.maps.Size(40, 40),
              anchor: new google.maps.Point(20, 20),
            }}
          />
        ))}

        {selectedJob && (
          <InfoWindow
            position={{ lat: selectedJob.lat, lng: selectedJob.lng }}
            onCloseClick={() => setSelectedJob(null)}
          >
            <div className="p-2 min-w-[180px]">
              <h3 className="font-semibold text-slate-900 mb-1">{selectedJob.title}</h3>
              <div className="flex items-center gap-1 text-sm text-slate-600 mb-1">
                <MapPin className="h-3 w-3" />
                {selectedJob.location}
              </div>
              <p className="text-sm font-medium text-orange-600">{selectedJob.salary}</p>
            </div>
          </InfoWindow>
        )}
      </GoogleMap>
    </LoadScript>
  );
}

export function MapPlaceholder() {
  return (
    <div className="w-full h-full rounded-2xl bg-gradient-to-br from-muted to-secondary flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
          <Navigation className="h-8 w-8 text-primary" />
        </div>
        <p className="text-muted-foreground">Xəritə yüklənir...</p>
      </div>
    </div>
  );
}