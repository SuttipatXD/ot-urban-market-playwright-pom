export const FORM_CONSTANTS = {
  MAX_PRODUCT_TYPES: 2,
  TIMEOUTS: {
    ELEMENT_WAIT: 5000,
    PAGE_LOAD: 10000,
    SUBMIT_SUCCESS: 10000,
  },
  VALIDATION: {
    NATIONAL_ID_LENGTH: 13,
    PHONE_LENGTH: 10,
    POSTAL_CODE_MIN_LENGTH: 5,
  },
} as const;

export const FORM_URLS = {
  REGISTRATION: 'https://forms.office.com/r/hPvVHUKgdF',
} as const;