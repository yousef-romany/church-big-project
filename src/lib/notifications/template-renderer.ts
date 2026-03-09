// Template rendering utility for notifications
// Supports simple placeholder replacement: {{variableName}}

export const renderTemplate = (template: string, data: Record<string, any>): string => {
  if (!template || !data) {
    return template || '';
  }

  let rendered = template;

  // Replace all {{variable}} with actual values
  Object.entries(data).forEach(([key, value]) => {
    const placeholder = `{{${key}}}`;
    rendered = rendered.replace(new RegExp(placeholder, 'g'), String(value || ''));
  });

  return rendered;
};

// Predefined template variables
export const TEMPLATE_VARIABLES = {
  USER_NAME: 'userName',
  EVENT_NAME: 'eventName',
  EVENT_DATE: 'eventDate',
  EVENT_TIME: 'eventTime',
  EVENT_LOCATION: 'eventLocation',
  CHURCH_NAME: 'churchName',
  PRIEST_NAME: 'priestName',
  APPOINTMENT_DATE: 'appointmentDate',
  APPOINTMENT_TIME: 'appointmentTime',
  FAMILY_NAME: 'familyName',
  CHILD_NAME: 'childName',
  POINTS_AWARDED: 'pointsAwarded',
  TRIP_NAME: 'tripName',
  TRIP_DATE: 'tripDate',
  REMINDER_MESSAGE: 'reminderMessage',
  CURRENT_DATE: 'currentDate',
  CUSTOM_MESSAGE: 'customMessage',
};

// Helper to get default template data
export const getDefaultTemplateData = (type: string, additionalData?: Record<string, any>): Record<string, any> => {
  const baseData = {
    currentDate: new Date().toLocaleDateString('ar-EG'),
    churchName: 'كنيستنا',
  };

  const typeSpecificData: Record<string, Record<string, any>> = {
    EVENT: {
      eventName: additionalData?.eventName || 'الفعالية القادمة',
      eventDate: additionalData?.eventDate || '',
      eventTime: additionalData?.eventTime || '',
      eventLocation: additionalData?.eventLocation || '',
    },
    APPOINTMENT: {
      appointmentDate: additionalData?.appointmentDate || '',
      appointmentTime: additionalData?.appointmentTime || '',
      priestName: additionalData?.priestName || '',
    },
    REMINDER: {
      reminderMessage: additionalData?.reminderMessage || '',
    },
    ANNOUNCEMENT: {
      customMessage: additionalData?.customMessage || '',
    },
    FAMILY: {
      familyName: additionalData?.familyName || '',
    },
    CHILD: {
      childName: additionalData?.childName || '',
      pointsAwarded: additionalData?.pointsAwarded || '0',
    },
    TRIP: {
      tripName: additionalData?.tripName || '',
      tripDate: additionalData?.tripDate || '',
    },
  };

  return {
    ...baseData,
    ...typeSpecificData[type],
    ...additionalData,
  };
};

// Validation for template syntax
export const validateTemplate = (template: string): { isValid: boolean; errors: string[] } => {
  const errors: string[] = [];
  
  // Check for unclosed placeholders
  const openPlaceholders = (template.match(/{{/g) || []).length;
  const closePlaceholders = (template.match(/}}/g) || []).length;
  
  if (openPlaceholders !== closePlaceholders) {
    errors.push('أقواس النائبة غير مكتملة');
  }

  // Check for empty placeholders
  const emptyPlaceholders = template.match(/{{\s*}}/g);
  if (emptyPlaceholders && emptyPlaceholders.length > 0) {
    errors.push('توجد عناصر نائبة فارغة');
  }

  return {
    isValid: errors.length === 0,
    errors,
  };
};

// Extract variables from template
export const extractTemplateVariables = (template: string): string[] => {
  const matches = template.match(/{{(\w+)}}/g) || [];
  return matches.map(match => match.replace(/[{}]/g, ''));
};