export type Role = 'ADMIN' | 'STAFF' | 'TRAINER' | 'MEMBER'
export type Status = 'active' | 'inactive' | 'pending' | 'cancelled'
export interface User { id: string; name: string; email: string; role: Role; phone: string; avatar?: string; status?: Status }
export interface Member extends User { code: string; birthday: string; gender: 'Nữ' | 'Nam'; address: string; joinedAt: string; status: Status }
export interface Package { id: string; code: string; name: string; type: string; duration: number; sessions: number; price: number; allowedClasses: string[]; description: string; status: Status }
export interface Membership { id: string; memberId: string; packageId: string; startDate: string; expiryDate: string; remainingSessions: number; status: Status }
export interface StudioClass { id: string; code: string; name: string; type: string; trainerId: string; date: string; startTime: string; endTime: string; location: string; capacity: number; registered: number; status: Status }
export interface Registration { id: string; classId: string; memberId: string; membershipId: string; registeredAt: string; status: Status }
export interface Attendance { id: string; classId: string; memberId: string; date: string; status: 'present' | 'absent' | 'excused'; markedBy: string; markedAt: string }
export interface Payment { id: string; code: string; memberId: string; packageId: string; amount: number; date: string; paymentTime?: string; method: 'Tiền mặt' | 'Chuyển khoản' | 'Thẻ'; status: 'paid' | 'pending' | 'refunded' }
