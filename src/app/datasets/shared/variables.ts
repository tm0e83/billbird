const cycleMonths: object = {
  'month': 1,
  'quarter': 3,
  'year': 12,
  '2years': 24
};

const currencyMaskOptions: object = {
  prefix: '',
  suffix: ' € ',
  thousands: '.',
  decimal: ','
}

const simpleNotificationsOptions: object = {
  position: ["bottom", "right"],
  timeOut: 3000,
  lastOnBottom: true,
  pauseOnHover: false,
  showProgressBar: false,
  theClass: 'default',
  icons: { success: '', error: '' }
};

export { cycleMonths, currencyMaskOptions, simpleNotificationsOptions };