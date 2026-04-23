export interface WeatherInfo {
  provider: string;
  location: string;
  startTime: string;
  endTime: string;
  weatherMain: string;
  description: string;
  rainProbability: number;
  minTemperature: number;
  maxTemperature: number;
  comfort: string;
  rainy: boolean;
  hot: boolean;
  suitableOutdoor: boolean;
}