"use client";
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import MapComponent from '@/components/priest-panel/MapComponent';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Badge } from '@/components/ui/badge';
import { MapPin, BarChart3, Navigation, Clock } from 'lucide-react';
import type { PriestPanelFamily } from '@/types/priest-panel';
import { calculateDistance, CHURCH_LOCATION } from '@/lib/geo-utils';

export default function MapAndLocationPage() {
  const [families, setFamilies] = useState<PriestPanelFamily[]>([]);
  const [selectedFamily, setSelectedFamily] = useState<PriestPanelFamily | null>(null);
  const [stats, setStats] = useState({
    total: 0,
    within1km: 0,
    within3km: 0,
    within5km: 0,
  });

  useEffect(() => {
    // Mock data for demonstration
    const mockFamilies: PriestPanelFamily[] = [
      { 
        id: 'fam1', 
        fatherName: 'جرجس رؤوف', 
        motherName: 'مارينا أسعد', 
        address: '15 شارع النصر، المعادي', 
        phoneNumber: '01234567890', 
        region: 'المعادي', 
        visitationStatus: 'عاجل', 
        lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 10), 
        notes: 'الأب مريض ويحتاج دعم.', 
        latitude: 29.9739, 
        longitude: 31.2582,
        members: [] 
      },
      { 
        id: 'fam2', 
        fatherName: 'مينا فكري', 
        motherName: 'تريزا لمعي', 
        address: '30 شارع 9، المقطم', 
        phoneNumber: '01098765431', 
        region: 'المقطم', 
        visitationStatus: 'تواصل فقط', 
        latitude: 30.0821, 
        longitude: 31.2483,
        members: []
      },
      { 
        id: 'fam4', 
        fatherName: 'بولس حليم', 
        motherName: 'أماني ذكي', 
        address: '120 شارع التحرير، الدقي', 
        phoneNumber: '01587654300', 
        region: 'الدقي', 
        visitationStatus: 'تمت الزيارة', 
        lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 2), 
        latitude: 30.0384, 
        longitude: 31.2069,
        members: [] 
      },
      { 
        id: 'fam5', 
        fatherName: 'المرحوم مراد فوزي', 
        motherName: 'الأم أنجيل', 
        address: 'عمارة 5، مساكن الزهور، مدينة نصر', 
        phoneNumber: '01011223344', 
        region: 'مدينة نصر', 
        visitationStatus: 'عاجل', 
        lastVisited: new Date(Date.now() - 1000 * 60 * 60 * 24 * 30), 
        notes: 'الأم أرملة وتحتاج إلى مساعدة', 
        latitude: 30.0688, 
        longitude: 31.3364,
        members: [] 
      },
    ];
    
    setFamilies(mockFamilies);
    
    // Calculate statistics
    const stats = mockFamilies.reduce((acc, family) => {
      if (!family.latitude || !family.longitude) return acc;
      
      acc.total++;
      const distance = calculateDistance(
        CHURCH_LOCATION.latitude,
        CHURCH_LOCATION.longitude,
        family.latitude,
        family.longitude
      );
      
      if (distance <= 1000) acc.within1km++;
      if (distance <= 3000) acc.within3km++;
      if (distance <= 5000) acc.within5km++;
      
      return acc;
    }, { total: 0, within1km: 0, within3km: 0, within5km: 0 });
    
    setStats(stats);
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="space-y-6"
    >
      <div>
        <h1 className="text-3xl font-bold text-primary mb-1">الخرائط والمواقع الجغرافية</h1>
        <p className="text-muted-foreground">
          عرض الأسر على الخريطة، تخطيط مسارات الزيارات، وحساب المسافات.
        </p>
      </div>
      
      <Tabs defaultValue="map" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="map">خريطة الأسر</TabsTrigger>
          <TabsTrigger value="analytics">تحليلات جغرافية</TabsTrigger>
        </TabsList>
        
        <TabsContent value="map" className="space-y-4">
          <MapComponent 
            families={families}
            onFamilySelect={setSelectedFamily}
            height="600px"
          />
          
          {selectedFamily && (
            <Card className="shadow-lg">
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="ml-2 h-5 w-5 text-primary" />
                  تفاصيل الأسرة المختارة
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-medium mb-2">معلومات الأسرة</h4>
                    <div className="space-y-1">
                      <p><strong>رب الأسرة:</strong> {selectedFamily.fatherName}</p>
                      <p><strong>الأم:</strong> {selectedFamily.motherName}</p>
                      <p><strong>العنوان:</strong> {selectedFamily.address}</p>
                      <p><strong>المنطقة:</strong> {selectedFamily.region}</p>
                    </div>
                  </div>
                  <div>
                    <h4 className="font-medium mb-2">معلومات الموقع</h4>
                    <div className="space-y-1">
                      <p><strong>خط العرض:</strong> {selectedFamily.latitude}</p>
                      <p><strong>خط الطول:</strong> {selectedFamily.longitude}</p>
                      {selectedFamily.latitude && selectedFamily.longitude && (
                        <p><strong>المسافة من الكنيسة:</strong> {
                          calculateDistance(
                            CHURCH_LOCATION.latitude,
                            CHURCH_LOCATION.longitude,
                            selectedFamily.latitude,
                            selectedFamily.longitude
                          ).toFixed(0)
                        } متر</p>
                      )}
                    </div>
                  </div>
                </div>
                {selectedFamily.notes && (
                  <div className="mt-4 p-3 bg-muted/30 rounded-md">
                    <h4 className="font-medium mb-1">ملاحظات:</h4>
                    <p className="text-sm">{selectedFamily.notes}</p>
                  </div>
                )}
              </CardContent>
            </Card>
          )}
        </TabsContent>
        
        <TabsContent value="analytics" className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <MapPin className="ml-2 h-5 w-5 text-primary" />
                  إجمالي الأسر
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{stats.total}</div>
                <p className="text-xs text-muted-foreground">أسرة في الخدمة</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Navigation className="ml-2 h-5 w-5 text-green-500" />
                  ضمن 1 كم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-green-500">{stats.within1km}</div>
                <p className="text-xs text-muted-foreground">أسرة قريبة</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Navigation className="ml-2 h-5 w-5 text-amber-500" />
                  ضمن 3 كم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-amber-500">{stats.within3km}</div>
                <p className="text-xs text-muted-foreground">أسرة في نطاق متوسط</p>
              </CardContent>
            </Card>
            
            <Card className="shadow-md">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg flex items-center">
                  <Navigation className="ml-2 h-5 w-5 text-blue-500" />
                  ضمن 5 كم
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold text-blue-500">{stats.within5km}</div>
                <p className="text-xs text-muted-foreground">أسرة في نطاق واسع</p>
              </CardContent>
            </Card>
          </div>
          
          <Card className="shadow-lg">
            <CardHeader>
              <CardTitle className="flex items-center">
                <BarChart3 className="ml-2 h-5 w-5 text-primary" />
                توزيع الأسر حسب المسافة
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {['المعادي', 'المقطم', 'الدقي', 'شبرا', 'مدينة نصر'].map((region, index) => {
                  const regionFamilies = families.filter(f => f.region === region);
                  const percentage = stats.total > 0 ? (regionFamilies.length / stats.total * 100) : 0;
                  
                  return (
                    <div key={index} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 rounded-full" style={{ 
                          backgroundColor: `hsl(${index * 60}, 70%, 50%)` 
                        }}></div>
                        <span className="font-medium">{region}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="w-32 bg-gray-200 rounded-full h-2">
                          <div 
                            className="h-2 rounded-full" 
                            style={{ 
                              width: `${percentage}%`,
                              backgroundColor: `hsl(${index * 60}, 70%, 50%)`
                            }}
                          ></div>
                        </div>
                        <Badge variant="outline" className="w-12 text-center">
                          {regionFamilies.length}
                        </Badge>
                      </div>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </motion.div>
  );
}