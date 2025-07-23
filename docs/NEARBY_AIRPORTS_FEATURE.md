# 📍 Nearby Airports Feature Documentation

A comprehensive geolocation-based airport discovery system for your Google Flights app.

## 🌟 Overview

The Nearby Airports feature allows users to:
- Automatically detect their current location
- Find airports near their location using GPS coordinates
- Browse airports with beautiful, intuitive UI components
- Seamlessly integrate airport selection into flight search

## 🏗️ Architecture

### API Integration
- **Endpoint**: `https://sky-scrapper.p.rapidapi.com/api/v1/flights/getNearByAirports`
- **Parameters**: `lat`, `lng`, `locale`
- **Response**: Current airport + nearby airports with full details

### Data Structure
```typescript
interface NearbyAirportsResponse {
  status: boolean;
  timestamp: number;
  data: {
    current: CurrentAirport;    // Airport at user's location
    nearby: NearbyAirport[];    // Surrounding airports
    recent: NearbyAirport[];    // Recently searched (if any)
  };
}
```

## 🎯 Core Components

### 1. `useGeolocation` Hook
```typescript
const {
  coordinates,
  loading,
  error,
  hasPermission,
  getCurrentLocation,
  clearError
} = useGeolocation();
```

**Features:**
- ✅ GPS coordinate detection
- ✅ Permission handling
- ✅ Error states with user-friendly messages
- ✅ Automatic permission status monitoring

### 2. `useNearbyAirports` Hook
```typescript
const {
  coordinates,
  currentAirport,
  nearbyAirports,
  allAirports,
  isReady,
  refreshAll
} = useNearbyAirports(autoFetch);
```

**Features:**
- ✅ Combined geolocation + airports API
- ✅ Automatic locale injection
- ✅ Smart error handling
- ✅ Auto-fetch option for seamless UX

### 3. `NearbyAirports` Component
```typescript
<NearbyAirports 
  onAirportSelect={handleSelect}
  showCurrentLocation={true}
  maxAirports={8}
/>
```

**Features:**
- ✅ Full-featured airport browser
- ✅ Current location highlighting
- ✅ Shimmer loading states
- ✅ Error handling with retry
- ✅ Beautiful card-based UI

### 4. `QuickAirportSelector` Component
```typescript
<QuickAirportSelector 
  onAirportSelect={handleSelect}
  compact={true}
  maxAirports={5}
/>
```

**Features:**
- ✅ Compact horizontal scroll
- ✅ Easy integration into other screens
- ✅ Reduced visual footprint
- ✅ Same functionality as full component

## 🎨 UI/UX Features

### Visual Design
- **Airport Icons**: Custom emoji icons per airport code
- **Location Badges**: Clear current location indicators
- **Card Layout**: Modern card-based design with shadows
- **Responsive**: Works on all screen sizes

### User Experience
- **Progressive Disclosure**: Step-by-step location → airports flow
- **Error Recovery**: Clear error messages with retry actions
- **Loading States**: Shimmer effects and spinners
- **Accessibility**: Proper contrast and touch targets

### Interaction Patterns
- **Tap to Enable**: Easy location permission flow
- **Pull to Refresh**: Refresh airports and location
- **Select Airport**: Tap airport to select for flight search
- **Visual Feedback**: Ripple effects and state changes

## 🚀 Usage Examples

### Basic Usage
```typescript
import { NearbyAirports } from '../components';

const FlightSearchScreen = () => {
  const handleAirportSelect = (airport) => {
    // Use airport for flight search
    setDepartureAirport(airport.navigation.relevantFlightParams.skyId);
  };

  return (
    <NearbyAirports 
      onAirportSelect={handleAirportSelect}
      maxAirports={6}
    />
  );
};
```

### Compact Integration
```typescript
import { QuickAirportSelector } from '../components';

const HomeScreen = () => {
  return (
    <View>
      <SearchHeader />
      <QuickAirportSelector compact={true} maxAirports={3} />
      <FlightDeals />
    </View>
  );
};
```

### Advanced Hook Usage
```typescript
import { useNearbyAirports } from '../hooks';

const CustomAirportComponent = () => {
  const {
    isReady,
    currentAirport,
    nearbyAirports,
    refreshAll,
    locationError
  } = useNearbyAirports(true); // Auto-fetch enabled

  if (locationError) {
    return <LocationErrorView onRetry={refreshAll} />;
  }

  return (
    <CustomAirportList 
      airports={[currentAirport, ...nearbyAirports].filter(Boolean)} 
    />
  );
};
```

## 🔧 Configuration

### Environment Setup
```typescript
// API Configuration in services/api.ts
const API_BASE_URL = 'https://sky-scrapper.p.rapidapi.com';
const API_KEY = process.env.EXPO_PUBLIC_RAPIDAPI_KEY;
```

### Geolocation Options
```typescript
const options: PositionOptions = {
  enableHighAccuracy: true,
  timeout: 10000,
  maximumAge: 300000, // 5 minutes
};
```

## 🌍 Localization

The feature automatically uses the current app locale:
- Language selection affects API responses
- Error messages in user's language
- Airport names in preferred language

```typescript
// Automatic locale injection
const response = await getNearbyAirports(coordinates, currentLocale?.id);
```

## 🔒 Privacy & Security

### Location Privacy
- Location only used for airport discovery
- No data storage or sharing
- User can revoke permissions anytime
- Clear privacy messaging in UI

### API Security
- API key secured in environment variables
- Rate limiting handled gracefully
- Error states don't expose sensitive info

## 📱 Platform Support

### React Native
- ✅ iOS geolocation support
- ✅ Android geolocation support
- ✅ Permission handling per platform
- ✅ Native UI components

### Web (Expo Web)
- ✅ Browser geolocation API
- ✅ Permission management
- ✅ Responsive design
- ✅ Touch and mouse interactions

## 🧪 Testing Scenarios

### Happy Path
1. User opens app
2. Grants location permission
3. Location detected automatically
4. Airports loaded and displayed
5. User selects airport for booking

### Error Scenarios
1. **Permission Denied**: Clear message + retry button
2. **Location Unavailable**: Fallback to manual search
3. **Network Error**: Retry mechanism
4. **API Error**: Graceful degradation

### Edge Cases
1. **No Nearby Airports**: Appropriate empty state
2. **Slow Network**: Loading states with timeouts
3. **Location Changes**: Auto-refresh functionality

## 🔄 Future Enhancements

### Planned Features
- **Distance Calculation**: Show airport distances
- **Airport Details**: Extended airport information
- **Favorites**: Save frequently used airports
- **Offline Support**: Cached airport data
- **Route Planning**: Multi-stop journey support

### Performance Optimizations
- **Virtualization**: For large airport lists
- **Caching**: Smart data caching strategies
- **Lazy Loading**: Load airports on demand
- **Background Sync**: Periodic location updates

## 📊 Integration Points

### Flight Search Integration
```typescript
const handleAirportSelect = (airport) => {
  // Direct integration with flight search
  navigation.navigate('FlightSearch', {
    departureAirport: airport.navigation.relevantFlightParams.skyId,
    departureAirportName: airport.presentation.title
  });
};
```

### Profile Integration
```typescript
// Added to ProfileScreen
<List.Item
  title="Nearby Airports"
  description="Find airports near your location"
  left={props => <List.Icon {...props} icon="airplane-landing" />}
  onPress={() => navigation.navigate('NearbyAirports')}
/>
```

---

## 🎉 Summary

The Nearby Airports feature provides a complete, production-ready solution for location-based airport discovery with:

- **Beautiful UI/UX** with modern Material Design
- **Robust Error Handling** for all edge cases
- **Multiple Integration Options** (full component, compact version, custom hooks)
- **Privacy-First Approach** with clear user messaging
- **Cross-Platform Support** for mobile and web
- **Comprehensive TypeScript** support with full type safety

Perfect for enhancing user experience in flight booking apps! ✈️ 