"use client";

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Calendar, 
  Plus, 
  Search, 
  Filter,
  Edit,
  Trash2,
  Eye,
  MapPin,
  Clock,
  Users,
  CheckCircle,
  XCircle,
  AlertCircle,
  FileText,
  TrendingUp,
  BarChart3
} from 'lucide-react';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';

// Mock data for demonstration - replace with actual API calls
const eventsData = [
  {
    id: '1',
    title: 'قداس عيد القيامة',
    description: 'الاحتفال بعيد القيامة المجيد',
    type: 'worship',
    date: '2024-04-14',
    time: '22:00',
    location: 'الكاتدرائية الرئيسية',
    organizer: 'القس مرقس يوسف',
    status: 'approved',
    participants: 450,
    capacity: 500,
    registrationDeadline: '2024-04-10'
  },
  {
    id: '2',
    title: 'رحلة صيفية للشباب',
    description: 'رحلة ترفيهية روحية للشباب',
    type: 'activity',
    date: '2024-07-15',
    time: '07:00',
    location: 'مركز الإرسالية',
    organizer: 'الخادم يوسف',
    status: 'pending',
    participants: 32,
    capacity: 50,
    registrationDeadline: '2024-07-01'
  },
  {
    id: '3',
    title: 'محاضرة عن تاريخ الكنيسة',
    description: 'سلسلة محاضرات عن تاريخ الكنيسة القبطية',
    type: 'educational',
    date: '2024-05-20',
    time: '19:00',
    location: 'قاعة المحاضرات',
    organizer: 'د. مينا غبريال',
    status: 'approved',
    participants: 85,
    capacity: 120,
    registrationDeadline: '2024-05-18'
  },
  {
    id: '4',
    title: 'يوم خدمة مجتمعي',
    description: 'زيارة المستشفيات وتوزيع المساعدات',
    type: 'service',
    date: '2024-06-08',
    time: '09:00',
    location: 'مستشفى السرطان',
    organizer: 'لجنة الخدمة',
    status: 'rejected',
    participants: 0,
    capacity: 30,
    registrationDeadline: '2024-06-05'
  }
];

const tripsData = [
  {
    id: '1',
    title: 'رحلة دير السريان',
    description: 'رحلة روحية إلى دير السريان',
    destination: 'دير السريان، الواحات',
    startDate: '2024-08-10',
    endDate: '2024-08-12',
    organizer: 'الخادم مينا',
    status: 'planning',
    participants: 45,
    capacity: 60,
    cost: 850,
    registrationDeadline: '2024-07-25'
  },
  {
    id: '2',
    title: 'رحلة أديرة وادي النطرون',
    description: 'زيارة الأديرة الأربعة في وادي النطرون',
    destination: 'وادي النطرون',
    startDate: '2024-09-05',
    endDate: '2024-09-06',
    organizer: 'الخادم بطرس',
    status: 'approved',
    participants: 58,
    capacity: 60,
    cost: 650,
    registrationDeadline: '2024-08-20'
  }
];

const eventTypeLabels = {
  worship: 'عبادة',
  educational: 'تعليمي',
  activity: 'نشاط',
  service: 'خدمة'
};

const eventTypeColors = {
  worship: 'default',
  educational: 'secondary',
  activity: 'outline',
  service: 'destructive'
};

const statusLabels = {
  approved: 'معتمد',
  pending: 'في الانتظار',
  rejected: 'مرفوض',
  planning: 'قيد التخطيط',
  cancelled: 'ملغي'
};

const statusColors = {
  approved: 'default',
  pending: 'secondary',
  rejected: 'destructive',
  planning: 'outline',
  cancelled: 'destructive'
};

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: { 
      duration: 0.5, 
      ease: "easeOut"
    }
  }
};

export default function EventsActivitiesOversight() {
  const { toast } = useToast();
  const [events, setEvents] = useState(eventsData);
  const [trips, setTrips] = useState(tripsData);
  const [filteredEvents, setFilteredEvents] = useState(eventsData);
  const [filteredTrips, setFilteredTrips] = useState(tripsData);
  const [searchTerm, setSearchTerm] = useState('');
  const [typeFilter, setTypeFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');
  const [isCreateEventDialogOpen, setIsCreateEventDialogOpen] = useState(false);
  const [isCreateTripDialogOpen, setIsCreateTripDialogOpen] = useState(false);
  const [isViewEventDialogOpen, setIsViewEventDialogOpen] = useState(false);
  const [isViewTripDialogOpen, setIsViewTripDialogOpen] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [selectedTrip, setSelectedTrip] = useState<any>(null);
  const [activeTab, setActiveTab] = useState('events');

  useEffect(() => {
    let filtered = events;
    
    if (searchTerm) {
      filtered = filtered.filter(event => 
        event.title.includes(searchTerm) || 
        event.description.includes(searchTerm) ||
        event.location.includes(searchTerm) ||
        event.organizer.includes(searchTerm)
      );
    }
    
    if (typeFilter !== 'all') {
      filtered = filtered.filter(event => event.type === typeFilter);
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(event => event.status === statusFilter);
    }
    
    setFilteredEvents(filtered);
  }, [events, searchTerm, typeFilter, statusFilter]);

  useEffect(() => {
    let filtered = trips;
    
    if (searchTerm) {
      filtered = filtered.filter(trip => 
        trip.title.includes(searchTerm) || 
        trip.description.includes(searchTerm) ||
        trip.destination.includes(searchTerm) ||
        trip.organizer.includes(searchTerm)
      );
    }
    
    if (statusFilter !== 'all') {
      filtered = filtered.filter(trip => trip.status === statusFilter);
    }
    
    setFilteredTrips(filtered);
  }, [trips, searchTerm, statusFilter]);

  const handleCreateEvent = () => {
    setIsCreateEventDialogOpen(true);
  };

  const handleCreateTrip = () => {
    setIsCreateTripDialogOpen(true);
  };

  const handleViewEvent = (event: any) => {
    setSelectedEvent(event);
    setIsViewEventDialogOpen(true);
  };

  const handleViewTrip = (trip: any) => {
    setSelectedTrip(trip);
    setIsViewTripDialogOpen(true);
  };

  const handleUpdateEventStatus = (eventId: string, newStatus: string) => {
    setEvents(prev => 
      prev.map(event => 
        event.id === eventId 
          ? { ...event, status: newStatus }
          : event
      )
    );
    
    toast({
      title: 'تم التحديث',
      description: `تم تحديث حالة الفعالية إلى ${statusLabels[newStatus as keyof typeof statusLabels]}.`,
    });
  };

  const handleUpdateTripStatus = (tripId: string, newStatus: string) => {
    setTrips(prev => 
      prev.map(trip => 
        trip.id === tripId 
          ? { ...trip, status: newStatus }
          : trip
      )
    );
    
    toast({
      title: 'تم التحديث',
      description: `تم تحديث حالة الرحلة إلى ${statusLabels[newStatus as keyof typeof statusLabels]}.`,
    });
  };

  const handleDeleteEvent = (eventId: string) => {
    if (confirm('هل أنت متأكد من أنك تريد حذف هذه الفعالية؟')) {
      setEvents(prev => prev.filter(event => event.id !== eventId));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الفعالية بنجاح.',
      });
    }
  };

  const handleDeleteTrip = (tripId: string) => {
    if (confirm('هل أنت متأكد من أنك تريد حذف هذه الرحلة؟')) {
      setTrips(prev => prev.filter(trip => trip.id !== tripId));
      toast({
        title: 'تم الحذف',
        description: 'تم حذف الرحلة بنجاح.',
      });
    }
  };

  const getParticipationPercentage = (participants: number, capacity: number) => {
    return Math.round((participants / capacity) * 100);
  };

  return (
    <div className="space-y-6">
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="bg-gradient-to-r from-blue-600 to-blue-800 text-white rounded-lg p-6 shadow-lg"
      >
        <h1 className="text-3xl font-bold mb-2">الفعاليات والأنشطة</h1>
        <p className="text-blue-100">مراقبة وإدارة جميع فعاليات وأنشطة الكنيسة والرحلات المنظمة.</p>
      </motion.div>

      {/* Stats Cards */}
      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
        className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
      >
        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">إجمالي الفعاليات</CardTitle>
            <Calendar className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{events.length}</div>
            <p className="text-xs text-muted-foreground">
              {events.filter(e => e.status === 'approved').length} فعالية معتمدة
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">الرحلات المنظمة</CardTitle>
            <MapPin className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{trips.length}</div>
            <p className="text-xs text-muted-foreground">
              {trips.filter(t => t.status === 'approved').length} رحلة معتمدة
            </p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">المشاركون الإجماليون</CardTitle>
            <Users className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.reduce((sum, e) => sum + e.participants, 0) + 
               trips.reduce((sum, t) => sum + t.participants, 0)}
            </div>
            <p className="text-xs text-muted-foreground">في جميع الأنشطة</p>
          </CardContent>
        </Card>

        <Card className="shadow-md">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">في انتظار الموافقة</CardTitle>
            <AlertCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">
              {events.filter(e => e.status === 'pending').length + 
               trips.filter(t => t.status === 'planning').length}
            </div>
            <p className="text-xs text-muted-foreground">نشاطات تحتاج مراجعة</p>
          </CardContent>
        </Card>
      </motion.div>

      <motion.div
        variants={cardVariants}
        initial="hidden"
        animate="visible"
      >
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="events">الفعاليات</TabsTrigger>
            <TabsTrigger value="trips">الرحلات</TabsTrigger>
          </TabsList>

          <TabsContent value="events" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center">
                  <Calendar className="ml-2 h-5 w-5" />
                  قائمة الفعاليات
                </CardTitle>
                <Button 
                  onClick={handleCreateEvent}
                  className="flex items-center"
                >
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة فعالية
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="بحث بالعنوان أو الموقع أو المنظم..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-8"
                      />
                    </div>
                  </div>
                  <Select value={typeFilter} onValueChange={setTypeFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="فلترة حسب النوع" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الأنواع</SelectItem>
                      {Object.entries(eventTypeLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="فلترة حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الفعالية</TableHead>
                        <TableHead className="text-right">النوع</TableHead>
                        <TableHead className="text-right">التاريخ والوقت</TableHead>
                        <TableHead className="text-right">المشاركون</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredEvents.map((event) => (
                        <TableRow key={event.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{event.title}</div>
                              <div className="text-sm text-muted-">{event.location}</div>
                              <div className="text-xs text-muted-foreground">{event.organizer}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={eventTypeColors[event.type as keyof typeof eventTypeColors] as any}>
                              {eventTypeLabels[event.type as keyof typeof eventTypeLabels]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div>
                              <div>{event.date}</div>
                              <div className="text-sm text-muted-foreground">{event.time}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${getParticipationPercentage(event.participants, event.capacity)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{event.participants}/{event.capacity}</span>
                            </div>
                          </TableCell>
                          <TableCell>
                            <Badge variant={statusColors[event.status as keyof typeof statusColors] as any}>
                              {statusLabels[event.status as keyof typeof statusLabels]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-reverse space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewEvent(event)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {event.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleUpdateEventStatus(event.id, 'approved')}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {event.status === 'pending' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleUpdateEventStatus(event.id, 'rejected')}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteEvent(event.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="trips" className="space-y-4">
            <Card>
              <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between space-y-2 sm:space-y-0">
                <CardTitle className="flex items-center">
                  <MapPin className="ml-2 h-5 w-5" />
                  قائمة الرحلات
                </CardTitle>
                <Button 
                  onClick={handleCreateTrip}
                  className="flex items-center"
                >
                  <Plus className="ml-2 h-4 w-4" />
                  إضافة رحلة
                </Button>
              </CardHeader>
              <CardContent>
                <div className="flex flex-col sm:flex-row gap-4 mb-4">
                  <div className="flex-1">
                    <div className="relative">
                      <Search className="absolute right-2 top-2.5 h-4 w-4 text-muted-foreground" />
                      <Input
                        placeholder="بحث بالعنوان أو الوجهة أو المنظم..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="pr-8"
                      />
                    </div>
                  </div>
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-full sm:w-48">
                      <SelectValue placeholder="فلترة حسب الحالة" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">جميع الحالات</SelectItem>
                      {Object.entries(statusLabels).map(([key, label]) => (
                        <SelectItem key={key} value={key}>{label}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="rounded-md border">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead className="text-right">الرحلة</TableHead>
                        <TableHead className="text-right">الوجهة</TableHead>
                        <TableHead className="text-right">التاريخ</TableHead>
                        <TableHead className="text-right">المشاركون</TableHead>
                        <TableHead className="text-right">التكلفة</TableHead>
                        <TableHead className="text-right">الحالة</TableHead>
                        <TableHead className="text-right">الإجراءات</TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {filteredTrips.map((trip) => (
                        <TableRow key={trip.id}>
                          <TableCell>
                            <div>
                              <div className="font-medium">{trip.title}</div>
                              <div className="text-xs text-muted-foreground">{trip.organizer}</div>
                            </div>
                          </TableCell>
                          <TableCell>{trip.destination}</TableCell>
                          <TableCell>
                            <div>
                              <div>{trip.startDate}</div>
                              <div className="text-sm text-muted-foreground">إلى {trip.endDate}</div>
                            </div>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center">
                              <div className="w-16 bg-gray-200 rounded-full h-2 mr-2">
                                <div 
                                  className="bg-blue-600 h-2 rounded-full" 
                                  style={{ width: `${getParticipationPercentage(trip.participants, trip.capacity)}%` }}
                                ></div>
                              </div>
                              <span className="text-sm">{trip.participants}/{trip.capacity}</span>
                            </div>
                          </TableCell>
                          <TableCell>{trip.cost} جنيه</TableCell>
                          <TableCell>
                            <Badge variant={statusColors[trip.status as keyof typeof statusColors] as any}>
                              {statusLabels[trip.status as keyof typeof statusLabels]}
                            </Badge>
                          </TableCell>
                          <TableCell>
                            <div className="flex items-center space-x-reverse space-x-2">
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleViewTrip(trip)}
                              >
                                <Eye className="h-4 w-4" />
                              </Button>
                              {trip.status === 'planning' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleUpdateTripStatus(trip.id, 'approved')}
                                  className="text-green-600 hover:text-green-800"
                                >
                                  <CheckCircle className="h-4 w-4" />
                                </Button>
                              )}
                              {trip.status === 'planning' && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => handleUpdateTripStatus(trip.id, 'cancelled')}
                                  className="text-red-600 hover:text-red-800"
                                >
                                  <XCircle className="h-4 w-4" />
                                </Button>
                              )}
                              <Button
                                variant="ghost"
                                size="icon"
                                onClick={() => handleDeleteTrip(trip.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </div>
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </motion.div>

      {/* Event Details Dialog */}
      <Dialog open={isViewEventDialogOpen} onOpenChange={setIsViewEventDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الفعالية</DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن الفعالية المحددة
            </DialogDescription>
          </DialogHeader>
          {selectedEvent && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{selectedEvent.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedEvent.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">النوع</Label>
                  <Badge variant={eventTypeColors[selectedEvent.type as keyof typeof eventTypeColors] as any}>
                    {eventTypeLabels[selectedEvent.type as keyof typeof eventTypeLabels]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">الحالة</Label>
                  <Badge variant={statusColors[selectedEvent.status as keyof typeof statusColors] as any}>
                    {statusLabels[selectedEvent.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">التاريخ</Label>
                  <div>
                    <div>{selectedEvent.date}</div>
                    <div className="text-sm text-muted-foreground">{selectedEvent.time}</div>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">الموقع</Label>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 ml-1 text-muted-foreground" />
                    <span>{selectedEvent.location}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">المنظم</Label>
                  <p>{selectedEvent.organizer}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">المشاركون</Label>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getParticipationPercentage(selectedEvent.participants, selectedEvent.capacity)}%` }}
                      ></div>
                    </div>
                    <span>{selectedEvent.participants}/{selectedEvent.capacity}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">آخر موعد للتسجيل</Label>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 ml-1 text-muted-foreground" />
                  <span>{selectedEvent.registrationDeadline}</span>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewEventDialogOpen(false)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Trip Details Dialog */}
      <Dialog open={isViewTripDialogOpen} onOpenChange={setIsViewTripDialogOpen}>
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle>تفاصيل الرحلة</DialogTitle>
            <DialogDescription>
              معلومات مفصلة عن الرحلة المحددة
            </DialogDescription>
          </DialogHeader>
          {selectedTrip && (
            <div className="space-y-4">
              <div className="space-y-2">
                <h3 className="text-lg font-medium">{selectedTrip.title}</h3>
                <p className="text-sm text-muted-foreground">{selectedTrip.description}</p>
              </div>
              
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">الوجهة</Label>
                  <div className="flex items-center">
                    <MapPin className="h-4 w-4 ml-1 text-muted-foreground" />
                    <span>{selectedTrip.destination}</span>
                  </div>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">الحالة</Label>
                  <Badge variant={statusColors[selectedTrip.status as keyof typeof statusColors] as any}>
                    {statusLabels[selectedTrip.status as keyof typeof statusLabels]}
                  </Badge>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">تاريخ البدء</Label>
                  <p>{selectedTrip.startDate}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">تاريخ الانتهاء</Label>
                  <p>{selectedTrip.endDate}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">المنظم</Label>
                  <p>{selectedTrip.organizer}</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">التكلفة</Label>
                  <p>{selectedTrip.cost} جنيه</p>
                </div>
                <div className="space-y-1">
                  <Label className="text-sm text-muted-foreground">المشاركون</Label>
                  <div className="flex items-center">
                    <div className="w-16 bg-gray-200 rounded-full h-2 ml-2">
                      <div 
                        className="bg-blue-600 h-2 rounded-full" 
                        style={{ width: `${getParticipationPercentage(selectedTrip.participants, selectedTrip.capacity)}%` }}
                      ></div>
                    </div>
                    <span>{selectedTrip.participants}/{selectedTrip.capacity}</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-1">
                <Label className="text-sm text-muted-foreground">آخر موعد للتسجيل</Label>
                <div className="flex items-center">
                  <Clock className="h-4 w-4 ml-1 text-muted-foreground" />
                  <span>{selectedTrip.registrationDeadline}</span>
                </div>
              </div>
              
              <div className="flex justify-end pt-4">
                <Button 
                  variant="outline" 
                  onClick={() => setIsViewTripDialogOpen(false)}
                >
                  إغلاق
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Event Dialog */}
      <Dialog open={isCreateEventDialogOpen} onOpenChange={setIsCreateEventDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة فعالية جديدة</DialogTitle>
            <DialogDescription>
              إنشاء فعالية جديدة في النظام
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="event-title">عنوان الفعالية</Label>
              <Input id="event-title" placeholder="أدخل عنوان الفعالية" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-description">الوصف</Label>
              <Input id="event-description" placeholder="أدخل وصف الفعالية" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-type">النوع</Label>
              <Select>
                <SelectTrigger>
                  <SelectValue placeholder="اختر نوع الفعالية" />
                </SelectTrigger>
                <SelectContent>
                  {Object.entries(eventTypeLabels).map(([key, label]) => (
                    <SelectItem key={key} value={key}>{label}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-date">التاريخ</Label>
              <Input id="event-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-time">الوقت</Label>
              <Input id="event-time" type="time" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-location">الموقع</Label>
              <Input id="event-location" placeholder="أدخل موقع الفعالية" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-organizer">المنظم</Label>
              <Input id="event-organizer" placeholder="أدخل اسم المنظم" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-capacity">السعة القصوى</Label>
              <Input id="event-capacity" type="number" placeholder="أدخل السعة القصوى" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="event-deadline">آخر موعد للتسجيل</Label>
              <Input id="event-deadline" type="date" />
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateEventDialogOpen(false)}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: 'تم الإنشاء',
                    description: 'تم إنشاء الفعالية بنجاح.',
                  });
                  setIsCreateEventDialogOpen(false);
                }}
              >
                إنشاء فعالية
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

      {/* Create Trip Dialog */}
      <Dialog open={isCreateTripDialogOpen} onOpenChange={setIsCreateTripDialogOpen}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle>إضافة رحلة جديدة</DialogTitle>
            <DialogDescription>
              إنشاء رحلة جديدة في النظام
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="trip-title">عنوان الرحلة</Label>
              <Input id="trip-title" placeholder="أدخل عنوان الرحلة" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-description">الوصف</Label>
              <Input id="trip-description" placeholder="أدخل وصف الرحلة" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-destination">الوجهة</Label>
              <Input id="trip-destination" placeholder="أدخل وجهة الرحلة" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-start-date">تاريخ البدء</Label>
              <Input id="trip-start-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-end-date">تاريخ الانتهاء</Label>
              <Input id="trip-end-date" type="date" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-organizer">المنظم</Label>
              <Input id="trip-organizer" placeholder="أدخل اسم المنظم" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-capacity">السعة القصوى</Label>
              <Input id="trip-capacity" type="number" placeholder="أدخل السعة القصوى" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-cost">التكلفة (جنيه)</Label>
              <Input id="trip-cost" type="number" placeholder="أدخل التكلفة" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="trip-deadline">آخر موعد للتسجيل</Label>
              <Input id="trip-deadline" type="date" />
            </div>
            <div className="flex justify-end pt-4">
              <Button 
                variant="outline" 
                onClick={() => setIsCreateTripDialogOpen(false)}
                className="ml-2"
              >
                إلغاء
              </Button>
              <Button 
                onClick={() => {
                  toast({
                    title: 'تم الإنشاء',
                    description: 'تم إنشاء الرحلة بنجاح.',
                  });
                  setIsCreateTripDialogOpen(false);
                }}
              >
                إنشاء رحلة
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}