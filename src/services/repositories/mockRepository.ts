import { attendance, classes, memberships, members, packages, payments, registrations, users } from '../../mocks/data'
import type { Attendance, Member, Package, Payment, Registration, StudioClass, User } from '../../types'
import { currentVietnamDate } from '../../utils/dateTime'

const delay = <T,>(value: T) => new Promise<T>(resolve => setTimeout(() => resolve(structuredClone(value)), 180))
const id = () => crypto.randomUUID()
const nextCode = (prefix: string, total: number, length = 3) => `${prefix}-${String(total + 1).padStart(length, '0')}`
const hasMemberHistory = (memberId: string) => memberships.some(x => x.memberId === memberId) || registrations.some(x => x.memberId === memberId) || payments.some(x => x.memberId === memberId) || attendance.some(x => x.memberId === memberId)
const hasEmployeeHistory = (employeeId: string) => classes.some(x => x.trainerId === employeeId)

const storageKey = 'pilates-mock-data'
type StoredData = { users: User[]; members: Member[]; packages: Package[]; memberships: typeof memberships; classes: StudioClass[]; registrations: Registration[]; attendance: Attendance[]; payments: Payment[] }
const replace = <T,>(target: T[], source: T[]) => target.splice(0, target.length, ...source)
const legacyPaymentTimes = ['08:12:16','09:26:43','10:05:29','10:48:51','11:17:34','11:52:08','13:14:27','13:46:55','14:35:27','15:09:42','15:41:18','16:23:36','16:57:09','17:28:44','18:06:21','18:39:53','19:12:38','19:47:05','20:18:31','20:54:16']
const backfillLegacyPaymentTimes = () => { let changed = false; payments.forEach((payment, index) => { if (payment.status === 'paid' && !payment.paymentTime) { payment.paymentTime = `${payment.date}T${legacyPaymentTimes[index % legacyPaymentTimes.length]}+07:00`; changed = true } }); return changed }
const persist = () => localStorage.setItem(storageKey, JSON.stringify({ users, members, packages, memberships, classes, registrations, attendance, payments } satisfies StoredData))
try {
  const saved = localStorage.getItem(storageKey)
  if (saved) {
    const data = JSON.parse(saved) as StoredData
    replace(users, data.users); replace(members, data.members); replace(packages, data.packages); replace(memberships, data.memberships)
    replace(classes, data.classes); replace(registrations, data.registrations); replace(attendance, data.attendance); replace(payments, data.payments)
  }
  if (backfillLegacyPaymentTimes()) persist()
} catch { localStorage.removeItem(storageKey) }

export const repositories = {
  auth: { login: async (email: string, password: string) => { const user = [...users, ...members].find(x => x.email === email); if (!user || password !== '123456') throw new Error('Email or password is incorrect.'); if (user.status === 'inactive') throw new Error('This account is inactive.'); return delay(user) } },
  members: {
    list: () => delay(members),
    create: async (data: Omit<Member, 'id' | 'code' | 'role'>) => { const item: Member = { ...data, id: id(), code: nextCode('HV', members.length), role: 'MEMBER' }; members.unshift(item); persist(); return delay(item) },
    update: async (memberId: string, data: Partial<Member>) => { const item = members.find(x => x.id === memberId); if (!item) throw new Error('Member not found.'); Object.assign(item, data); persist(); return delay(item) },
    remove: async (memberId: string) => { const item = members.find(x => x.id === memberId); if (!item) throw new Error('Member not found.'); if (hasMemberHistory(memberId)) { item.status = 'inactive'; persist(); return delay({ mode: 'deactivated' as const, item }) } members.splice(members.indexOf(item), 1); persist(); return delay({ mode: 'deleted' as const, item }) }
  },
  employees: {
    list: () => delay(users.filter(x => x.role !== 'ADMIN' && x.role !== 'MEMBER')),
    create: async (data: Omit<User, 'id'>) => { const item: User = { ...data, id: id(), status: 'active' }; users.push(item); persist(); return delay(item) },
    update: async (employeeId: string, data: Partial<User>) => { const item = users.find(x => x.id === employeeId); if (!item) throw new Error('Employee not found.'); Object.assign(item, data); persist(); return delay(item) },
    remove: async (employeeId: string) => { const item = users.find(x => x.id === employeeId); if (!item) throw new Error('Employee not found.'); if (hasEmployeeHistory(employeeId)) { item.status = 'inactive'; persist(); return delay({ mode: 'deactivated' as const, item }) } users.splice(users.indexOf(item), 1); persist(); return delay({ mode: 'deleted' as const, item }) }
  },
  packages: {
    list: () => delay(packages),
    create: async (data: Omit<Package, 'id' | 'code'>) => { const item: Package = { ...data, id: id(), code: nextCode('PK', packages.length, 2) }; packages.unshift(item); persist(); return delay(item) },
    update: async (packageId: string, data: Partial<Package>) => { const item = packages.find(x => x.id === packageId); if (!item) throw new Error('Package not found.'); Object.assign(item, data); persist(); return delay(item) },
    remove: async (packageId: string) => { const item = packages.find(x => x.id === packageId); if (!item) throw new Error('Package not found.'); if (memberships.some(x => x.packageId === packageId) || payments.some(x => x.packageId === packageId)) { item.status = 'inactive'; persist(); return delay({ mode: 'deactivated' as const, item }) } packages.splice(packages.indexOf(item), 1); persist(); return delay({ mode: 'deleted' as const, item }) }
  },
  classes: {
    list: () => delay(classes),
    create: async (data: Omit<StudioClass, 'id' | 'code' | 'registered'>) => { const item: StudioClass = { ...data, id: id(), code: nextCode('LH', classes.length), registered: 0 }; classes.unshift(item); persist(); return delay(item) },
    update: async (classId: string, data: Partial<StudioClass>) => { const item = classes.find(x => x.id === classId); if (!item) throw new Error('Class not found.'); Object.assign(item, data); persist(); return delay(item) },
    remove: async (classId: string) => { const item = classes.find(x => x.id === classId); if (!item) throw new Error('Class not found.'); if (registrations.some(x => x.classId === classId) || attendance.some(x => x.classId === classId)) { item.status = 'cancelled'; persist(); return delay({ mode: 'cancelled' as const, item }) } classes.splice(classes.indexOf(item), 1); persist(); return delay({ mode: 'deleted' as const, item }) }
  },
  registrations: {
    list: () => delay(registrations),
    create: async (data: Omit<Registration, 'id' | 'registeredAt' | 'status'>) => { const cls = classes.find(x => x.id === data.classId); const membership = memberships.find(x => x.id === data.membershipId); const member = members.find(x => x.id === data.memberId); if (!cls || cls.status !== 'active' || cls.registered >= cls.capacity) throw new Error('Class has no available space.'); if (!member || member.status !== 'active') throw new Error('Member is unavailable.'); if (!membership || membership.remainingSessions < 1 || membership.status !== 'active') throw new Error('Membership is unavailable.'); const pack = packages.find(x => x.id === membership.packageId); if (!pack?.allowedClasses.includes(cls.type)) throw new Error('Membership does not cover this class.'); if (registrations.some(x => x.classId === data.classId && x.memberId === data.memberId && x.status === 'active')) throw new Error('Member is already registered.'); membership.remainingSessions--; cls.registered++; const item: Registration = { ...data, id: id(), registeredAt: new Date().toISOString(), status: 'active' }; registrations.unshift(item); persist(); return delay(item) },
    cancel: async (registrationId: string) => { const item = registrations.find(x => x.id === registrationId); if (!item || item.status === 'cancelled') throw new Error('Registration cannot be cancelled.'); item.status = 'cancelled'; const cls = classes.find(x => x.id === item.classId); if (cls) cls.registered = Math.max(0, cls.registered - 1); const membership = memberships.find(x => x.id === item.membershipId); if (membership) membership.remainingSessions++; persist(); return delay(item) }
  },
  attendance: { list: () => delay(attendance), save: async (items: Attendance[]) => { items.forEach(item => { const old = attendance.find(x => x.id === item.id || (x.classId === item.classId && x.memberId === item.memberId && x.date === item.date)); old ? Object.assign(old, item) : attendance.push({ ...item, id: id() }) }); persist(); return delay(items) } },
  payments: {
    list: () => delay(payments),
    create: async (data: Omit<Payment, 'id' | 'code' | 'date' | 'paymentTime'>) => { const paidAt = data.status === 'paid' ? new Date().toISOString() : undefined; const item: Payment = { ...data, id: id(), code: nextCode('GD', payments.length, 4), date: currentVietnamDate(), ...(paidAt ? { paymentTime: paidAt } : {}) }; payments.unshift(item); persist(); return delay(item) },
    update: async (paymentId: string, data: Partial<Payment>) => { const item = payments.find(x => x.id === paymentId); if (!item) throw new Error('Payment not found.'); const { paymentTime: _paymentTime, ...updates } = data; const becomesPaid = updates.status === 'paid' && item.status !== 'paid'; Object.assign(item, updates); if (becomesPaid && !item.paymentTime) item.paymentTime = new Date().toISOString(); persist(); return delay(item) }
  },
  memberships: { list: () => delay(memberships) }
}
