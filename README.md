# PulseRescue AI - Emergency Response Platform

An AI-powered emergency response platform designed for citizens, hospitals, and ambulance fleets to streamline emergency medical services and reduce response times.

## 🚀 Features

### Dispatch Control Center
The heart of the emergency response system, providing real-time coordination between emergencies, ambulances, and hospitals.

#### Active Emergency Management
- **Real-time Emergency List**: View all active emergencies with priority sorting
- **AI Triage Scoring**: Automated severity assessment (0-100 scale)
- **Priority Indicators**: Visual severity levels (Critical, High, Medium, Low)
- **Location Tracking**: GPS coordinates and address information
- **Time Tracking**: Elapsed time since emergency was reported
- **Patient Information**: Name, contact details, and medical description

#### Smart Dispatch Assignment
- **Available Ambulance View**: See all ambulances and their current status
- **Distance & ETA Calculation**: Automatic calculation of nearest units
- **One-Click Assignment**: Assign ambulances to emergencies instantly
- **Driver Information**: Contact details and vehicle numbers
- **Status Management**: Track ambulance availability (Available, Busy, Offline)

#### Emergency Details Panel
- **Comprehensive Patient Data**: Full emergency information at a glance
- **AI Severity Score**: Visual progress bar showing triage assessment
- **Hospital Recommendations**: AI-suggested nearest appropriate hospital
- **Response Time Estimates**: Predicted arrival times
- **Contact Information**: Quick access to caller phone numbers
- **Location Details**: Full address and coordinates

#### Communication Tools
- **Multi-Channel Messaging**: Contact callers, drivers, and hospitals
- **Quick Actions**: Pre-built communication buttons
- **Message Composer**: Send custom messages to any party
- **Notification System**: Alert hospitals of incoming patients

#### Analytics & History
- **Dispatch History**: Complete log of all dispatches
- **Response Time Metrics**: Average response time tracking
- **Success Rate**: Performance monitoring
- **Outcome Tracking**: Success, failure, and cancellation records

#### Live Map View (Ready for Integration)
- Emergency location markers
- Real-time ambulance positions
- Hospital locations
- Optimized route visualization

### Dashboard Overview
- **Active Emergencies Counter**: Real-time count of ongoing cases
- **Pending Dispatch Queue**: Emergencies awaiting assignment
- **Average Resolution Time**: Performance metrics
- **Backend Health Status**: API connectivity monitoring

### Additional Dashboards
- **Driver Dashboard**: For ambulance drivers to receive and manage assignments
- **Police Dashboard**: Law enforcement coordination interface
- **Units Management**: Fleet and resource management
- **Settings**: System configuration and preferences

## 🛠️ Tech Stack

- **Framework**: Next.js 16.2.4 (with Turbopack)
- **React**: 19.2.4
- **Styling**: Tailwind CSS v4
- **Icons**: Lucide React
- **Language**: TypeScript
- **Testing**: Vitest + Testing Library

## 📋 Prerequisites

- Node.js 20.x or higher
- npm or yarn package manager
- Backend API running on `http://localhost:4000` (optional for full functionality)

## 🚀 Getting Started

### Installation

1. Clone the repository:
```bash
git clone https://github.com/aniket3077/techhunter-frontend-.git
cd techhunter-frontend-
```

2. Install dependencies:
```bash
npm install
```

3. Run the development server:
```bash
npm run dev
```

4. Open your browser and navigate to:
```
http://localhost:3000
```

### Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm start` - Start production server
- `npm run lint` - Run ESLint
- `npm run test` - Run tests once
- `npm run test:watch` - Run tests in watch mode

## 🔧 Configuration

### Environment Variables

Create a `.env.local` file in the root directory:

```env
NEXT_PUBLIC_API_BASE_URL=http://localhost:4000
```

### API Endpoints

The application connects to the following backend endpoints:

- `GET /api/health` - Backend health check
- `GET /api/dashboard/summary` - Dashboard statistics
- `GET /api/cases` - Emergency cases
- `GET /api/ambulances` - Ambulance fleet data
- `POST /api/sos` - Create new emergency

## 📁 Project Structure

```
techhunter-frontend-/
├── app/
│   ├── dashboard/
│   │   ├── dispatch/          # Dispatch control center
│   │   │   ├── page.tsx
│   │   │   └── dispatch-client.tsx
│   │   ├── driver/            # Driver dashboard
│   │   ├── police/            # Police dashboard
│   │   ├── units/             # Units management
│   │   ├── settings/          # Settings page
│   │   ├── layout.tsx         # Dashboard layout
│   │   └── page.tsx           # Dashboard home
│   ├── layout.tsx             # Root layout
│   ├── page.tsx               # Landing page
│   └── globals.css            # Global styles
├── lib/
│   └── api.ts                 # API configuration
├── public/                    # Static assets
├── package.json
├── tsconfig.json
├── tailwind.config.ts
└── README.md
```

## 🎨 Design System

### Color Palette

- **Primary (Cyan)**: `#0891b2` - Main actions and highlights
- **Success (Green)**: `#10b981` - Successful operations
- **Warning (Amber)**: `#f59e0b` - Warnings and pending states
- **Danger (Red)**: `#ef4444` - Critical emergencies and errors
- **Info (Blue)**: `#3b82f6` - Information and available states

### Severity Levels

- **Critical**: Red - Immediate life-threatening emergencies (AI Score 80-100)
- **High**: Orange - Serious conditions requiring urgent care (AI Score 60-79)
- **Medium**: Yellow - Moderate conditions (AI Score 40-59)
- **Low**: Green - Minor conditions (AI Score 0-39)

## 🔌 Backend Integration

### Mock Data vs Real API

Currently, the dispatch page uses mock data for demonstration. To connect to a real backend:

1. Ensure your backend API is running on `http://localhost:4000`
2. Update the `useEffect` in `dispatch-client.tsx` to fetch from actual endpoints:

```typescript
useEffect(() => {
  const fetchData = async () => {
    const emergenciesRes = await fetch(`${API_BASE_URL}/api/emergencies`);
    const ambulancesRes = await fetch(`${API_BASE_URL}/api/ambulances`);
    const historyRes = await fetch(`${API_BASE_URL}/api/dispatch-history`);
    
    setEmergencies(await emergenciesRes.json());
    setAmbulances(await ambulancesRes.json());
    setHistory(await historyRes.json());
  };
  
  fetchData();
}, []);
```

### Expected API Response Formats

#### Emergency Object
```typescript
{
  id: string;
  patientName: string;
  location: string;
  coordinates: { lat: number; lng: number };
  severity: 'critical' | 'high' | 'medium' | 'low';
  aiScore: number;
  reportedAt: string; // ISO timestamp
  status: 'pending' | 'assigned' | 'enroute' | 'arrived' | 'completed';
  description: string;
  contactNumber: string;
  recommendedHospital?: string;
  estimatedResponseTime?: number;
}
```

#### Ambulance Object
```typescript
{
  id: string;
  vehicleNumber: string;
  status: 'available' | 'busy' | 'offline';
  location: string;
  coordinates: { lat: number; lng: number };
  driverName: string;
  driverPhone: string;
  distanceKm?: number;
  eta?: number;
}
```

## 🗺️ Map Integration

To add live map functionality:

1. Install a mapping library:
```bash
npm install @vis.gl/react-google-maps
# or
npm install react-map-gl mapbox-gl
```

2. Add your API key to `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_MAPS_API_KEY=your_api_key_here
```

3. Replace the map placeholder in `dispatch-client.tsx` with the actual map component

## 🧪 Testing

Run the test suite:
```bash
npm run test
```

Run tests in watch mode during development:
```bash
npm run test:watch
```

## 🚀 Deployment

### Build for Production

```bash
npm run build
npm start
```

### Deploy to Vercel

The easiest way to deploy is using [Vercel](https://vercel.com):

```bash
npm install -g vercel
vercel
```

Or connect your GitHub repository to Vercel for automatic deployments.

## 📝 Future Enhancements

- [ ] Real-time WebSocket updates for emergency status
- [ ] Interactive map with live tracking
- [ ] Voice-to-text emergency reporting
- [ ] Image-based accident detection
- [ ] Multi-language support
- [ ] Mobile app for drivers
- [ ] Advanced analytics dashboard
- [ ] Predictive AI for resource allocation
- [ ] Integration with hospital bed availability systems
- [ ] Automated route optimization with traffic data

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is private and proprietary.

## 👥 Team

**TechHunter Team**
- Emergency Response System Development
- AI-Powered Triage Implementation
- Real-time Dispatch Coordination

## 📞 Support

For support and questions:
- GitHub Issues: [Create an issue](https://github.com/aniket3077/techhunter-frontend-/issues)
- Email: support@pulserescue.ai

## 🙏 Acknowledgments

- Next.js team for the amazing framework
- Tailwind CSS for the utility-first CSS framework
- Lucide for the beautiful icon set
- All contributors and testers

---

**Built with ❤️ for saving lives**
