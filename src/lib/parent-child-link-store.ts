
'use client';
import type { LinkRequest, LinkedChild } from '@/types/public';
import { getSundaySchoolChildren, saveSundaySchoolChildren, findChildByQrCode } from './sunday-school-store';
import type { SundaySchoolChild } from '@/types/sunday-school';

// This file simulates a backend store for parent-child linking using localStorage.

const REQUESTS_KEY = 'parentChildLinkRequests_v1';
const LINKS_KEY = 'parentChildLinks_v1';

const generateId = () => `linkreq_${Date.now().toString(36)}_${Math.random().toString(36).substring(2, 7)}`;

// Mock users for demonstration. In a real app, this would come from a central user store.
const MOCK_PARENT_USER = { id: 'parent1_mock_id', name: 'ولي الأمر: مايكل سمير' };
const MOCK_CHILD_USER_ID = 'child_SS-CHILD-001'; // Corresponds to 'بيتر جورج'

// --- Requests Management ---

export function getRequests(): LinkRequest[] {
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(REQUESTS_KEY);
  return stored ? JSON.parse(stored) : [];
}

function saveRequests(requests: LinkRequest[]): void {
  if (typeof window === 'undefined') return;
  localStorage.setItem(REQUESTS_KEY, JSON.stringify(requests));
}

export function sendLinkRequest(parent: {id: string; name: string}, childQrCode: string): { success: boolean, message: string } {
    const child = findChildByQrCode(childQrCode);
    if (!child) {
        return { success: false, message: 'لم يتم العثور على ابن بهذا الكود.' };
    }
    
    const requests = getRequests();
    const existingRequest = requests.find(r => r.parentId === parent.id && r.childId === child.id && r.status === 'pending');
    if (existingRequest) {
        return { success: false, message: 'لقد أرسلت طلبًا بالفعل لهذا الابن وهو قيد المراجعة.' };
    }

    const newRequest: LinkRequest = {
        id: generateId(),
        parentId: parent.id,
        parentName: parent.name,
        childId: child.id,
        childName: child.name,
        status: 'pending',
        requestedAt: new Date().toISOString(),
    };
    
    requests.push(newRequest);
    saveRequests(requests);
    return { success: true, message: `تم إرسال طلب الربط بنجاح إلى ${child.name}.` };
}

export function getRequestsForChild(childId: string): LinkRequest[] {
    return getRequests().filter(r => r.childId === childId && r.status === 'pending');
}

export function getRequestsForParent(parentId: string): LinkRequest[] {
    return getRequests().filter(r => r.parentId === parentId);
}

export function updateRequestStatus(requestId: string, newStatus: 'accepted' | 'rejected'): boolean {
    const requests = getRequests();
    const requestIndex = requests.findIndex(r => r.id === requestId);
    if (requestIndex === -1) return false;

    const request = requests[requestIndex];
    request.status = newStatus;
    
    if (newStatus === 'accepted') {
        // Create the link
        addLink(request.parentId, request.childId);
    }
    
    saveRequests(requests);
    return true;
}

// --- Links Management ---

export function getLinks(parentId: string): string[] { // returns array of childIds
  if (typeof window === 'undefined') return [];
  const stored = localStorage.getItem(LINKS_KEY);
  if (stored) {
    const allLinks = JSON.parse(stored);
    return allLinks[parentId] || [];
  }
  return [];
}

function saveLinks(parentId: string, childIds: string[]): void {
  if (typeof window === 'undefined') return;
  const stored = localStorage.getItem(LINKS_KEY);
  const allLinks = stored ? JSON.parse(stored) : {};
  allLinks[parentId] = childIds;
  localStorage.setItem(LINKS_KEY, JSON.stringify(allLinks));
}

function addLink(parentId: string, childId: string): void {
  const linkedChildIds = getLinks(parentId);
  if (!linkedChildIds.includes(childId)) {
    linkedChildIds.push(childId);
    saveLinks(parentId, linkedChildIds);
  }
}

export function getLinkedChildrenData(parentId: string): LinkedChild[] {
    const linkedIds = getLinks(parentId);
    const allChildren = getSundaySchoolChildren();
    return linkedIds.map(id => {
        const childData = allChildren.find(c => c.id === id);
        return childData ? { id: childData.id, name: childData.name, avatarUrl: childData.avatarUrl, points: childData.points } : null;
    }).filter((c): c is LinkedChild => c !== null);
}
