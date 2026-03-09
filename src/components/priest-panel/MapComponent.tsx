"use client";

import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { MapPin, Navigation, Search, Route, Maximize2, Compass } from 'lucide-react';
import type { PriestPanelFamily } from '@/types/priest-panel';
import { calculateDistance, CHURCH_LOCATION, type GeoCoordinates } from '@/lib/geo-utils';
import { useToast } from '@/hooks/use-toast';
import { motion } from 'framer-motion';

interface MapComponentProps {
  families?: PriestPanelFamily[];
  center?: GeoCoordinates;
  zoom?: number;
  onFamilySelect?: (family: PriestPanelFamily) => void;
  height?: string;
}

export default function MapComponent({ 
  families = [], 
  center = CHURCH_LOCATION, 
  zoom = 12,
  onFamilySelect,
  height = '500px'
}: MapComponentProps) {
  const [mapCenter, setMapCenter] = useState<GeoCoordinates>(center);
  const [mapZoom, setMapZoom] = useState(zoom);
  const [searchQuery, setSearchQuery] = useState('');
  const [showRoute, setShowRoute] = useState(false);
  const [selectedFamily, setSelectedFamily] = useState<PriestPanelFamily | null>(null);
  const mapRef = useRef<HTMLDivElement>(null);
  const [mapLoaded, setMapLoaded] = useState(false);
  const { toast } = useToast();

  // In a real implementation, this would integrate with OpenFreeMap
  // For now, we'll create a placeholder that demonstrates the functionality
  useEffect(() => {
    // Simulate map loading
    setTimeout(() => {
      setMapLoaded(true);
    }, 1000);
  }, []);

  const handleSearch = () => {
    const found = families.find(f => 
      f.fatherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.motherName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.region?.toLowerCase().includes(searchQuery.toLowerCase()) ||
      f.address.toLowerCase().includes(searchQuery.toLowerCase())
    );
    
    if (found && found.latitude && found.longitude) {
      setMapCenter({ latitude: found.latitude, longitude: found.longitude });
      setMapZoom(15);
      setSelectedFamily(found);
      onFamilySelect?.(found);
      toast({
        title: "تم العثور على الأسرة",
        description: `${found.fatherName} و ${found.motherName}`,
      });
    } else {
      toast({
        title: "لم يتم العثور على نتيجة",
        description: "يرجى التحقق من البحث والمحاولة مرة أخرى",
        variant: "destructive",
      });
    }
  };

  const handleFamilyClick = (family: PriestPanelFamily) => {
    if (family.latitude && family.longitude) {
      setMapCenter({ latitude: family.latitude, longitude: family.longitude });
      setMapZoom(15);
      setSelectedFamily(family);
      onFamilySelect?.(family);
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setMapCenter({
            latitude: position.coords.latitude,
            longitude: position.coords.longitude
          });
          setMapZoom(15);
          toast({
            title: "تم تحديد موقعك",
            description: "تم تحديد موقعك الحالي بنجاح",
          });
        },
        (error) => {
          toast({
            title: "فشل تحديد الموقع",
            description: "يرجى التحقق من إعدادات الموقع في متصفحك",
            variant: "destructive",
          });
        }
      );
    } else {
      toast({
        title: "الموقع غير مدعوم",
        description: "المتصفح الخاص بك لا يدعم تحديد الموقع",
        variant: "destructive",
      });
    }
  };

  const handleShowRoute = () => {
    if (selectedFamily) {
      setShowRoute(true);
      toast({
        title: "عرض المسار",
        description: `المسار من الكنيسة إلى ${selectedFamily.fatherName} و ${selectedFamily.motherName}`,
      });
    }
  };

  return (
    <Card className="shadow-lg">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div className="flex items-center">
            <MapPin className="ml-2 h-5 w-5 text-primary" />
            خريطة الأسر والمواقع
          </div>
          <Badge variant="outline" className="text-xs">
            {families.length} أسرة
          </Badge>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Search and Controls */}
        <div className="flex flex-col sm:flex-row gap-2">
          <div className="relative flex-1">
            <Search className="absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="ابحث عن أسرة بالاسم أو العنوان..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pr-10"
              onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
            />
          </div>
          <Button onClick={handleSearch} disabled={!searchQuery}>
            بحث
          </Button>
          <Button variant="outline" onClick={handleGetCurrentLocation}>
            <Navigation className="ml-2 h-4 w-4" />
            موقعي
          </Button>
        </div>
        
        {/* Map Placeholder */}
        <div 
          ref={mapRef}
          className="relative w-full rounded-md border overflow-hidden bg-muted/20"
          style={{ height }}
        >
          {!mapLoaded ? (
            <div className="absolute inset-0 flex items-center justify-center bg-background/80">
              <div className="text-center">
                <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary mx-auto mb-2"></div>
                <p className="text-sm text-muted-foreground">جاري تحميل الخريطة...</p>
              </div>
            </div>
          ) : (
            <div className="relative w-full h-full">
              {/* Map Placeholder */}
              <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-green-50 flex items-center justify-center">
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-primary mx-auto mb-2" />
                  <p className="text-lg font-medium">OpenFreeMap</p>
                  <p className="text-sm text-muted-foreground">
                    عرض الأسر في المنطقة المحيطة
                  </p>
                  <div className="mt-2 flex justify-center gap-2">
                    <Badge variant="outline">خط عرض: {mapCenter.latitude.toFixed(4)}</Badge>
                    <Badge variant="outline">خط طول: {mapCenter.longitude.toFixed(4)}</Badge>
                  </div>
                </div>
              </div>
              
              {/* Map Controls */}
              <div className="absolute top-2 left-2 bg-background/90 rounded-md p-1 shadow-md">
                <Button variant="outline" size="icon" onClick={() => setMapZoom(Math.max(5, mapZoom - 1))}>
                  -
                </Button>
                <Button variant="outline" size="icon" onClick={() => setMapZoom(Math.min(18, mapZoom + 1))}>
                  +
                </Button>
              </div>
              
              <div className="absolute top-2 right-2 bg-background/90 rounded-md p-1 shadow-md">
                <Button variant="outline" size="icon" onClick={() => setMapCenter(CHURCH_LOCATION)}>
                  <MapPin className="h-4 w-4" />
                </Button>
              </div>
              
              {/* Route Button */}
              {selectedFamily && (
                <div className="absolute bottom-2 right-2">
                  <Button onClick={handleShowRoute} variant="default" size="sm">
                    <Route className="ml-2 h-4 w-4" />
                    المسار
                  </Button>
                </div>
              )}
              
              {/* Route Visualization */}
              {showRoute && selectedFamily && (
                <div className="absolute inset-0 pointer-events-none">
                  <svg className="w-full h-full">
                    <path
                      d={`M 50% 50% L ${Math.random() * 80 + 10}% ${Math.random() * 80 + 10}%`}
                      stroke="hsl(var(--primary))"
                      strokeWidth="3"
                      fill="none"
                      strokeDasharray="5, 5"
                      className="animate-pulse"
                    />
                  </svg>
                </div>
              )}
            </div>
          )}
        </div>
        
        {/* Family List */}
        {families.length > 0 && (
          <div className="space-y-2 max-h-48 overflow-y-auto">
            <h4 className="font-medium text-sm">الأسر القريبة:</h4>
            <div className="space-y-1">
              {families
                .filter(f => f.latitude && f.longitude)
                .sort((a, b) => {
                  const distA = calculateDistance(
                    mapCenter.latitude, 
                    mapCenter.longitude, 
                    a.latitude!, 
                    a.longitude!
                  );
                  const distB = calculateDistance(
                    mapCenter.latitude, 
                    mapCenter.longitude, 
                    b.latitude!, 
                    b.longitude!
                  );
                  return distA - distB;
                })
                .slice(0, 5)
                .map((family) => (
                  <motion.div
                    key={family.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    className={`p-2 rounded-md border cursor-pointer transition-colors ${
                      selectedFamily?.id === family.id
                        ? 'bg-primary/10 border-primary'
                        : 'hover:bg-muted/50'
                    }`}
                    onClick={() => handleFamilyClick(family)}
                  >
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="font-medium text-sm">
                          {family.fatherName} و {family.motherName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {family.address} ({family.region})
                        </p>
                      </div>
                      <Badge variant="outline" className="text-xs">
                        {calculateDistance(
                          mapCenter.latitude,
                          mapCenter.longitude,
                          family.latitude!,
                          family.longitude!
                        ).toFixed(0)} م
                      </Badge>
                    </div>
                  </motion.div>
                ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}