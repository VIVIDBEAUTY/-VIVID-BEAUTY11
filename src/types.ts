export interface ServiceItem {
  id: string;
  name: string;
  price: number;
  category: string;
}

export interface ServiceCategory {
  title: string;
  items: ServiceItem[];
  note?: string;
}

export interface BookingDetails {
  name: string;
  phone: string;
  date: string;
  time: string;
  selectedServices: ServiceItem[];
  totalPrice: number;
}

export interface IntegrationConfig {
  telegramToken: string;
  telegramChatId: string;
  appsScriptUrl: string;
  whatsappNumber: string;
  logoUrl?: string;
  faviconUrl?: string;
  backgroundImages?: string[];
  workingHoursStart?: string;
  workingHoursEnd?: string;
  googlePlaceId?: string;
  googleApiKey?: string;
}
