export interface RecommendRequest {
  destination: string;
  preferences: string;
  companionType: string;
  travelStyle: string;
  durationHours: number;
  budgetLevel: string;
  weatherAware: boolean;
}