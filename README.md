# Google Flights App - React Native

A comprehensive flight booking application built with React Native, Expo, and TypeScript featuring location-based airport discovery.

## ✨ Features

### 🛫 Flight Search & Booking
- **Advanced Search**: Round-trip and one-way flights with date selection
- **Flight Results**: Detailed flight information with pricing
- **Mock Data**: Integrated mock flight data for development

### 📍 **Nearby Airports (NEW)**
- **GPS Location**: Automatic location detection using device GPS
- **Smart Discovery**: Find airports near your current location
- **Beautiful UI**: Modern card-based interface with airport icons
- **Quick Selection**: Horizontal scroll component for easy integration
- **Booking Integration**: Direct integration with flight search
- **Cross-Platform**: Works on iOS, Android, and Web (Expo)

### 🌍 Multi-Language Support
- **Language Selector**: Beautiful modal with search functionality
- **Popular Languages**: Quick access grid for common languages
- **API Integration**: Automatic locale injection into API calls
- **Persistent Settings**: User language preference saved locally

### 🔧 Reusable Components
- **Design System**: Complete UI component library
- **TypeScript**: Full type safety throughout
- **Material Design**: React Native Paper integration
- **Customizable**: Flexible props and styling options

### 🚀 Modern Architecture
- **Context API**: Global state management
- **Custom Hooks**: Reusable business logic
- **Error Handling**: Comprehensive error boundaries
- **Navigation**: Stack and tab navigation with TypeScript

## 🏗️ Tech Stack

- **React Native** with Expo
- **TypeScript** for type safety
- **React Native Paper** for UI components
- **React Navigation 6** for navigation
- **Expo Location** for geolocation
- **AsyncStorage** for data persistence
- **Axios** for API calls
- **Formik & Yup** for form handling

## 📱 App Structure

```
GoogleFlightsApp/
├── src/
│   ├── components/           # Reusable UI components
│   │   ├── CustomButton.tsx
│   │   ├── CustomText.tsx
│   │   ├── NearbyAirports.tsx      # 📍 NEW
│   │   ├── QuickAirportSelector.tsx # 📍 NEW
│   │   └── LanguageSelector.tsx
│   ├── hooks/                # Custom React hooks
│   │   ├── useGeolocation.ts       # 📍 NEW
│   │   ├── useNearbyAirports.ts    # 📍 NEW
│   │   └── useLocalizedApi.ts
│   ├── screens/              # App screens
│   │   ├── main/
│   │   │   ├── FlightSearchScreen.tsx
│   │   │   ├── NearbyAirportsScreen.tsx # 📍 NEW
│   │   │   └── ProfileScreen.tsx
│   │   └── auth/
│   ├── services/             # API and external services
│   │   └── api.ts
│   ├── context/              # React Context providers
│   │   ├── AuthContext.tsx
│   │   └── LocaleContext.tsx
│   └── types/                # TypeScript type definitions
└── docs/                     # Documentation
    └── NEARBY_AIRPORTS_FEATURE.md # 📍 NEW
```

## 🚀 Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI
- iOS Simulator / Android Emulator (optional)

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd GoogleFlightsApp
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   EXPO_PUBLIC_RAPIDAPI_KEY=your_rapidapi_key_here
   ```

4. **Start the development server**
   ```bash
   npx expo start
   ```

5. **Run on device/simulator**
   - **iOS**: Press `i` in terminal or scan QR code with Camera app
   - **Android**: Press `a` in terminal or scan QR code with Expo Go
   - **Web**: Press `w` in terminal

## 🌟 Nearby Airports Feature

### Quick Integration

```typescript
import { NearbyAirports, QuickAirportSelector } from '../components';

// Full component
<NearbyAirports 
  onAirportSelect={(airport) => console.log(airport)}
  maxAirports={8}
/>

// Compact version
<QuickAirportSelector 
  compact={true}
  maxAirports={5}
  onAirportSelect={(airport) => setAirport(airport)}
/>
```

### Custom Hook Usage

```typescript
import { useNearbyAirports } from '../hooks';

const { 
  coordinates, 
  currentAirport, 
  nearbyAirports, 
  getCurrentLocation 
} = useNearbyAirports(true); // Auto-fetch enabled
```

### Navigation Integration

```typescript
// Navigate to airport selector
navigation.navigate('NearbyAirports', {
  selectionMode: 'departure', // or 'arrival'
});

// Results in flight search pre-filled
navigation.navigate('Main', {
  screen: 'Search',
  params: {
    preselectedDeparture: {
      code: 'BOM',
      name: 'Mumbai'
    }
  }
});
```

## 🎯 Key Features in Detail

### Location-Based Discovery
- **Smart Permissions**: Automatic permission handling with user-friendly messages
- **Accurate GPS**: High-accuracy location detection with fallbacks
- **Privacy First**: Location only used for airport discovery, not stored

### Beautiful UI/UX
- **Progressive Disclosure**: Step-by-step location → airports → selection flow
- **Loading States**: Professional shimmer effects and spinners
- **Error Recovery**: Clear error messages with retry actions
- **Visual Feedback**: Ripple effects and state changes

### Cross-Platform Support
- **React Native**: Native iOS and Android performance
- **Expo Web**: Works in browsers with geolocation API
- **Responsive Design**: Adapts to different screen sizes

## 📡 API Integration

### Sky Scrapper API
```typescript
// Nearby airports endpoint
GET /api/v1/flights/getNearByAirports
Parameters: lat, lng, locale

// Example response
{
  "status": true,
  "data": {
    "current": { /* Current airport */ },
    "nearby": [ /* Nearby airports */ ]
  }
}
```

### Automatic Localization
```typescript
// API calls automatically include user's selected language
const response = await getNearbyAirports(coordinates, currentLocale?.id);
```

## 🏃‍♂️ Development Workflow

### Running Tests
```bash
npm test
```

### Type Checking
```bash
npm run type-check
```

### Building for Production
```bash
npx expo build:android
npx expo build:ios
```

## 📖 Documentation

- **[Nearby Airports Feature](docs/NEARBY_AIRPORTS_FEATURE.md)** - Complete feature documentation
- **[Component Library](src/components/README.md)** - UI components guide
- **[API Documentation](src/services/README.md)** - API integration guide

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- **Sky Scrapper API** for flight and airport data
- **React Native Paper** for beautiful Material Design components
- **Expo** for excellent development experience
- **React Navigation** for seamless navigation

---

## 🎉 Ready to Fly!

Your Google Flights app now includes powerful location-based airport discovery, making flight booking easier and more intuitive than ever. The nearby airports feature seamlessly integrates into your booking flow, providing users with a smart, location-aware flight search experience.

**Happy coding and safe travels!** ✈️🌍 