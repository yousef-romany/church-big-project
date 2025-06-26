
'use client';
import type { Trip, Booking } from '@/types/trips';
import { format, addDays } from 'date-fns';

const TRIPS_KEY = 'churchTrips_v1';
const BOOKINGS_KEY = 'churchTripBookings_v1';

const generateId = (prefix: string) => `${prefix}_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;
const generateBookingCode = () => `TRIP-${Math.random().toString(36).substring(2, 5).toUpperCase()}-${Math.floor(100 + Math.random() * 900)}`;

// --- TRIPS ---

const createDefaultTrips = (): Trip[] => {
    return [
        {
            id: generateId('trip'),
            title: "رحلة دير الأنبا أنطونيوس",
            destination: "البحر الأحمر",
            startDate: addDays(new Date(), 15).toISOString(),
            endDate: addDays(new Date(), 17).toISOString(),
            price: 750,
            capacity: 50,
            overview: "رحلة روحية وترفيهية إلى دير القديس العظيم الأنبا أنطونيوس بالبحر الأحمر. فرصة للخلوة الروحية والاستمتاع بجمال الطبيعة.",
            itinerary: "اليوم الأول: التجمع صباحًا والتحرك بالأتوبيس. الوصول والتسكين. اجتماع صلاة.\nاليوم الثاني: حضور القداس الإلهي. جولة في الدير. وقت حر على الشاطئ.\nاليوم الثالث: الإفطار والعودة.",
            included: "الانتقالات بأتوبيسات حديثة مكيفة.\nالإقامة لمدة ليلتين.\nالوجبات (إفطار وعشاء).",
            excluded: "المصاريف الشخصية.\nالأنشطة الاختيارية.",
        },
        {
            id: generateId('trip'),
            title: "يوم روحي في وادي النطرون",
            destination: "وادي النطرون",
            startDate: addDays(new Date(), 30).toISOString(),
            endDate: addDays(new Date(), 30).toISOString(),
            price: 150,
            capacity: 100,
            overview: "يوم واحد لزيارة أديرة وادي النطرون العامرة وأخذ بركة القديسين.",
            itinerary: "التجمع الساعة 7 صباحًا.\nزيارة دير السريان ودير البراموس.\nالعودة مساءً.",
            included: "الانتقالات.\nوجبة إفطار.",
            excluded: "وجبة الغداء.",
        },
    ];
};

export function getTrips(): Trip[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(TRIPS_KEY);
        if (stored) return JSON.parse(stored).sort((a: Trip, b: Trip) => new Date(a.startDate).getTime() - new Date(b.startDate).getTime());
        const defaults = createDefaultTrips();
        saveTrips(defaults);
        return defaults;
    } catch (e) { console.error(e); return []; }
}

export function getTripById(tripId: string): Trip | null {
    return getTrips().find(t => t.id === tripId) || null;
}

function saveTrips(trips: Trip[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(TRIPS_KEY, JSON.stringify(trips));
}

export function createTrip(data: Omit<Trip, 'id'>): Trip {
    const trips = getTrips();
    const newTrip: Trip = {
        ...data,
        id: generateId('trip'),
        startDate: data.startDate.toISOString(),
        endDate: data.endDate.toISOString(),
    };
    saveTrips([...trips, newTrip]);
    return newTrip;
}

// --- BOOKINGS ---

export function getAllBookings(): Booking[] {
    if (typeof window === 'undefined') return [];
    try {
        const stored = localStorage.getItem(BOOKINGS_KEY);
        return stored ? JSON.parse(stored) : [];
    } catch (e) { console.error(e); return []; }
}

function saveBookings(bookings: Booking[]): void {
    if (typeof window === 'undefined') return;
    localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function getBookingsForTrip(tripId: string): Booking[] {
    return getAllBookings().filter(b => b.tripId === tripId);
}

export function getBookingStats(tripId: string): { total: number; paid: number; unpaid: number } {
    const bookings = getBookingsForTrip(tripId);
    const total = bookings.length;
    const paid = bookings.filter(b => b.status === 'paid').length;
    return { total, paid, unpaid: total - paid };
}

export function createBooking(tripId: string, userId: string, userName: string): { success: boolean, booking: Booking | null, message: string } {
    const trip = getTripById(tripId);
    if (!trip) return { success: false, booking: null, message: "لم يتم العثور على الرحلة." };

    const stats = getBookingStats(tripId);
    if (stats.total >= trip.capacity) {
        return { success: false, booking: null, message: "عذرًا، الرحلة مكتملة." };
    }
    
    const allBookings = getAllBookings();
    const existingBooking = allBookings.find(b => b.tripId === tripId && b.userId === userId);
    if (existingBooking) {
        return { success: false, booking: null, message: "لقد قمت بالحجز في هذه الرحلة بالفعل." };
    }

    const newBooking: Booking = {
        id: generateId('book'),
        tripId,
        userId,
        userName,
        bookingCode: generateBookingCode(),
        status: 'booked',
        bookedAt: new Date().toISOString(),
    };
    
    saveBookings([...allBookings, newBooking]);
    return { success: true, booking: newBooking, message: "تم الحجز بنجاح." };
}

export function confirmPayment(bookingCode: string): { success: boolean, booking: Booking | null, message: string } {
    const allBookings = getAllBookings();
    const bookingIndex = allBookings.findIndex(b => b.bookingCode.toUpperCase() === bookingCode.toUpperCase());

    if (bookingIndex === -1) {
        return { success: false, booking: null, message: "كود الحجز غير صحيح." };
    }
    
    if (allBookings[bookingIndex].status === 'paid') {
        return { success: false, booking: allBookings[bookingIndex], message: "هذا الحجز تم تأكيد دفعه بالفعل." };
    }

    allBookings[bookingIndex].status = 'paid';
    saveBookings(allBookings);
    return { success: true, booking: allBookings[bookingIndex], message: "تم تأكيد الدفع بنجاح." };
}
