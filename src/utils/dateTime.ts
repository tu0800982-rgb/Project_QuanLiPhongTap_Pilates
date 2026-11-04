const vietnamFormatter = new Intl.DateTimeFormat('en-GB', {
  timeZone: 'Asia/Ho_Chi_Minh', hour: '2-digit', minute: '2-digit', second: '2-digit',
  day: '2-digit', month: '2-digit', year: 'numeric', hour12: false,
})

export const formatPaymentTime = (paymentTime?: string) => {
  if (!paymentTime) return 'Chưa có thông tin giờ'
  const parsed = new Date(paymentTime)
  if (Number.isNaN(parsed.getTime())) return 'Chưa có thông tin giờ'
  const parts = Object.fromEntries(vietnamFormatter.formatToParts(parsed).filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]))
  return `${parts.hour}:${parts.minute}:${parts.second} - ${parts.day}/${parts.month}/${parts.year}`
}

export const currentVietnamDate = () => {
  const parts = Object.fromEntries(vietnamFormatter.formatToParts(new Date()).filter(({ type }) => type !== 'literal').map(({ type, value }) => [type, value]))
  return `${parts.year}-${parts.month}-${parts.day}`
}
