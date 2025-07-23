r# 🛫 Google Flights App - React Native

A comprehensive flight booking application built with React Native and Expo, featuring real-time airport search, nearby airports discovery, and complete flight search functionality using the Sky Scrapper API.

## ✨ Features

### 🔍 **Intelligent Airport Search**
- **Real-time autocomplete** with debounced search (300ms)
- **Multi-entity support**: Search airports, cities, and countries
- **Visual categorization** with icons (✈️ Airports, 🏙️ Cities, 🌍 Countries)
- **Smart airport codes** display (JFK, LAX, etc.)
- **Grouped results** for better UX

### 📍 **Location-Based Discovery**
- **GPS-powered nearby airports** using device location
- **Cross-platform geolocation** with `expo-location` and `@react-native-community/geolocation`
- **Smart permission handling** for iOS and Android
- **Quick selection** horizontal scroll interface
- **Fallback support** for web and location-disabled devices

### ✈️ **Complete Flight Search**
- **Real Sky Scrapper API integration** with proper parameters
- **Round-trip and one-way** flight support
- **Advanced filtering**: Direct flights, 1 stop, 2+ stops
- **Smart sorting**: Best, Cheapest, Fastest, Departure time
- **Real-time results** with loading states
- **Beautiful flight cards** with airline logos and route visualization

### 🌍 **Multi-language Support**
- **Dynamic locale switching** with 40+ languages
- **Automatic API localization** for all search requests
- **Persistent language preferences**
- **RTL support ready**

### 🎨 **Modern UI/UX**
- **Material Design 3** with React Native Paper
- **Custom reusable components** with TypeScript
- **Responsive layouts** for all screen sizes
- **Loading states** and error handling
- **Professional airline branding** with logos and colors

## 🚀 Quick Start

### Prerequisites
- Node.js 16+ and npm/yarn
- Expo CLI: `npm install -g @expo/cli`
- Sky Scrapper API key from [RapidAPI](https://rapidapi.com/3b-data-3b-data-default/api/sky-scrapper)

### Installation
```bash
# Clone the repository
git clone https://github.com/your-username/google-flights-app.git
cd google-flights-app

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Add your EXPO_PUBLIC_RAPIDAPI_KEY=your_api_key_here

# Start the development server
npm start
```

### Environment Setup
Create a `.env` file with:
```env
EXPO_PUBLIC_RAPIDAPI_KEY=your_sky_scrapper_api_key
```

## 🛠 Technical Architecture

### **API Integration**
```typescript
// Real Sky Scrapper API endpoints
/api/v1/flights/searchAirport    // Airport/city/country search
/api/v1/flights/getNearByAirports // GPS-based airport discovery
/api/v1/flights/searchFlights    // Complete flight search
```

### **Core Components**

#### **Airport Search Input**
```typescript
<AirportSearchInput
  label="From"
  value={origin}
  onValueChange={setOrigin}
  onAirportSelect={(airport) => {
    // Auto-fills with skyId and entityId for API calls
    setSelectedAirport(airport);
  }}
  placeholder="Search airports, cities..."
/>
```

#### **Flight Results Display**
```typescript
<FlightCard
  itinerary={flightData}
  onPress={() => navigateToDetails(flight.id)}
/>
```

### **Navigation Structure**
```
MainTabNavigator
├── Search (FlightSearchScreen)
├── Results (FlightResultsScreen)  
└── Profile (ProfileScreen)

RootStackNavigator
├── Main (TabNavigator)
├── NearbyAirports (Modal)
└── LanguageSelector (Modal)
```

### **State Management**
- **React Context** for locale/language preferences
- **Custom hooks** for geolocation, airport search, and API calls
- **TypeScript interfaces** for complete type safety
- **Formik + Yup** for form validation

## 📱 User Experience Flow

### **1. Airport Selection**
```
User opens app → Search screen
├── Type "new" → See "New York (Any)", "New York JFK", etc.
├── Select "New York JFK" → Auto-fills origin with complete data
└── OR tap "Nearby" → GPS finds local airports
```

### **2. Flight Search**
```
Select airports → Choose dates → Set passengers → Search
├── API call with: originSkyId, destinationSkyId, entityIds
├── Real-time results loading
└── Navigate to results screen
```

### **3. Results & Filtering**
```
Results screen → 10+ flights displayed
├── Sort by: Best, Cheapest, Fastest, Departure time
├── Filter by: All, Direct only, 1 stop, 2+ stops
├── Airline logos, route visualization, price tags
└── Tap flight → Navigate to details (TODO)
```

## 🌟 Key Features Showcase

### **Intelligent Search**
- **Debounced API calls**: 300ms delay prevents excessive requests
- **Request cancellation**: Previous requests cancelled on new input
- **Smart suggestions**: "New York" shows city + all airports
- **Code extraction**: Automatically gets JFK, LGA, EWR for NYC

### **Location Discovery**
- **Cross-platform GPS**: Works on iOS, Android, and web
- **Permission flows**: Graceful handling of denied permissions
- **Fallback options**: Manual search when location unavailable
- **Quick selection**: Horizontal scroll of nearby airports

### **Flight Display**
- **Airline branding**: Real logos from Sky Scrapper CDN
- **Route visualization**: Green departure, red arrival points
- **Stop indicators**: Visual indicators for layovers
- **Price formatting**: Currency-aware price display
- **Tag system**: "Cheapest", "Fastest", "Best" badges

### **Real API Integration**
```typescript
// Actual API call structure
const searchParams = {
  originSkyId: "LOND",        // London area
  destinationSkyId: "NYCA",   // New York area  
  originEntityId: "27544008", // Specific entity
  destinationEntityId: "27537542",
  date: "2024-07-01",
  cabinClass: "economy",
  adults: 1,
  sortBy: "best",
  currency: "USD",
  market: "en-US"
};
```

## 🏗 Project Structure

```
src/
├── components/           # Reusable UI components
│   ├── AirportSearchInput.tsx
│   ├── FlightCard.tsx
│   ├── NearbyAirports.tsx
│   └── QuickAirportSelector.tsx
├── hooks/               # Custom React hooks
│   ├── useAirportSearch.ts
│   ├── useGeolocation.ts
│   └── useNearbyAirports.ts
├── navigation/          # Navigation configuration
├── screens/            # Screen components
│   ├── main/
│   └── auth/
├── services/           # API services
│   └── api.ts
├── types/             # TypeScript definitions
└── utils/             # Helper functions
```

## 🔧 Development Commands

```bash
# Start development server
npm start

# Run on specific platforms
npm run ios
npm run android
npm run web

# Type checking
npm run type-check

# Build for production
npm run build
```

## 🌍 API Integration Details

### **Sky Scrapper API Features Used**
1. **Airport Search**: Real-time search with autocomplete
2. **Nearby Airports**: GPS-based airport discovery
3. **Flight Search**: Complete flight booking flow
4. **Localization**: 40+ language support
5. **Rich Data**: Airline logos, route details, pricing

### **API Response Handling**
- **Type-safe interfaces** for all API responses
- **Error boundaries** with graceful fallbacks
- **Loading states** for better UX
- **Retry mechanisms** for failed requests

## 🚦 Testing

The app includes comprehensive error handling:
- **Network errors**: Graceful fallbacks to cached data
- **Permission denials**: Alternative search methods
- **Invalid searches**: Clear error messages
- **API failures**: Retry options and mock data

## 🎯 Future Enhancements

- [ ] **Flight booking flow** with payment integration
- [ ] **User authentication** and saved searches
- [ ] **Price alerts** and notifications
- [ ] **Flight details** screen with full itinerary
- [ ] **Offline support** with cached data
- [ ] **Travel preferences** and frequent flyer integration

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details.

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

**Built with ❤️ using React Native, Expo, and the Sky Scrapper API** 