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
  REGISTRATION: 'https://forms.office.com/pages/responsepage.aspx?id=H6Uzjjv8NEKFcXd_n6BcKXaW6jJ9klBJkXu-E-UI-RdUMDI1TTBCNUVYQkRTRzdLRVJQMjlVMjNORi4u&route=shorturl',
} as const;