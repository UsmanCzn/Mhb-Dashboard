export default {
    COMPANY_ID: 1,
    brandId: 1
};

export const PaymentGateWayEnum = {
    None: 0,
    Tap: 1,
    Ottu: 2,
    Tehseeel: 3,
    Square: 4,
    Checkout: 5,
    MyFatoorah: 6
};

export const ReversedPayementGateWayEnum = {
    0: 'None',
    1: 'Tap',
    2: 'Ottu',
    3: 'Tehseeel',
    4: 'Square',
    5: 'Checkout',
    6: 'MyFatoorah'
};
// utils/timezones.ts
export const TimeZonesList = [
  { code: 'GMT', name: 'Greenwich Mean Time', value: 0 },
  { code: 'UTC', name: 'Universal Coordinated Time', value: 0 },
  { code: 'ECT', name: 'European Central Time', value: 1 },
  { code: 'EET', name: 'Eastern European Time', value: 2 },
  { code: 'ART', name: '(Arabic) Egypt Standard Time', value: 2 },
  { code: 'EAT', name: 'Eastern African Time', value: 3 },
  { code: 'MET', name: 'Middle East Time', value: 3.5 },
  { code: 'NET', name: 'Near East Time', value: 4 },
  { code: 'PLT', name: 'Pakistan Lahore Time', value: 5 },
  { code: 'IST', name: 'India Standard Time', value: 5.5 },
  { code: 'BST', name: 'Bangladesh Standard Time', value: 6 },
  { code: 'VST', name: 'Vietnam Standard Time', value: 7 },
  { code: 'CTT', name: 'China Taiwan Time', value: 8 },
  { code: 'JST', name: 'Japan Standard Time', value: 9 },
  { code: 'ACT', name: 'Australia Central Time', value: 9.5 },
  { code: 'AET', name: 'Australia Eastern Time', value: 10 },
  { code: 'SST', name: 'Solomon Standard Time', value: 11 },
  { code: 'NST', name: 'New Zealand Standard Time', value: 12 },
  { code: 'MIT', name: 'Midway Islands Time', value: -11 },
  { code: 'HST', name: 'Hawaii Standard Time', value: -10 },
  { code: 'AST', name: 'Alaska Standard Time', value: -9 },
  { code: 'PST', name: 'Pacific Standard Time', value: -8 },
  { code: 'PNT', name: 'Phoenix Standard Time', value: -7 },
  { code: 'MST', name: 'Mountain Standard Time', value: -7 },
  { code: 'CST', name: 'Central Standard Time', value: -6 },
  { code: 'EST', name: 'Eastern Standard Time', value: -5 },
  { code: 'IET', name: 'Indiana Eastern Standard Time', value: -5 },
  { code: 'PRT', name: 'Puerto Rico and US Virgin Islands Time', value: -4 },
  { code: 'CNT', name: 'Canada Newfoundland Time', value: -3.5 },
  { code: 'AGT', name: 'Argentina Standard Time', value: -3 },
  { code: 'BET', name: 'Brazil Eastern Time', value: -3 },
  { code: 'CAT', name: 'Central African Time', value: -1 },
];

// Small helper to render GMT offsets like +5.5
export const formatOffset = (val) => {
  const sign = val >= 0 ? '+' : '-';
  const abs = Math.abs(val);
  const hours = Math.trunc(abs);
  const mins = (abs - hours) * 60;
  const mm = mins ? `:${String(mins).padStart(2, '0')}` : '';
  return `GMT${sign}${hours}${mm}`;
};

