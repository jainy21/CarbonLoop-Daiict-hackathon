import React, { useState, useEffect } from 'react';
import { AuthProvider, useAuth } from './context/AuthContext.js';
import { Navigation, NavTab } from './components/Navigation.js';
import { DemoFlowBar } from './components/DemoFlowBar.js';
import { LoginPageView } from './views/LoginPageView.js';
import { LoginModal } from './components/LoginModal.js';
import { ProtectedRoute, RoleRoute } from './components/ProtectedRoute.js';
import { OverviewView } from './views/OverviewView.js';
import { WasteBatchesView } from './views/WasteBatchesView.js';
import { FacilitiesView } from './views/FacilitiesView.js';
import { SmartMatchingView } from './views/SmartMatchingView.js';
import { LogisticsMapView } from './views/LogisticsMapView.js';
import { CarbonImpactView } from './views/CarbonImpactView.js';
import { CarbonPassportView } from './views/CarbonPassportView.js';
import { MunicipalityAnalyticsView } from './views/MunicipalityAnalyticsView.js';
import { AdminManagementView } from './views/AdminManagementView.js';
import { FacilityOperatorDashboardView } from './views/FacilityOperatorDashboardView.js';
import { GeneratorDashboardView } from './views/GeneratorDashboardView.js';
import { PublicPassportVerification } from './views/PublicPassportVerification.js';
import { AskCarbonLoopModal } from './components/AskCarbonLoopModal.js';
import { WasteBatch, Facility, UserRole } from './types/index.js';

// Centralized Flagship Demo Baseline
const FLAGSHIP_DEMO_BATCH: WasteBatch = {
  id: 'batch-ahmedabad-demo',
  trackingNumber: 'WL-1024',
  wasteType: 'Rice Husk',
  category: 'Agricultural',
  quantityTonnes: 10,
  moistureContentPercent: 11,
  generatorId: 'usr-generator-1',
  generatorName: 'Gujarat Agro Producer Cooperative',
  generatorType: 'Farmer',
  origin: {
    lat: 23.0225,
    lng: 72.5714,
    address: 'APMC Market Yard, Vasna Road',
    city: 'Ahmedabad',
    state: 'Gujarat'
  },
  preferredConversion: 'Biochar',
  status: 'matched',
  facilityId: 'fac-biochar-a',
  facilityName: 'BioChar Plant A (Sanand Industrial Eco-Park)',
  estimatedCarbonImpactTonnesCO2e: 8.4,
  createdAt: '2026-09-12T08:30:00.000Z',
  updatedAt: '2026-09-12T08:35:00.000Z'
};

const FLAGSHIP_DEMO_FACILITY: Facility = {
  id: 'fac-biochar-a',
  name: 'BioChar Plant A (Sanand Industrial Eco-Park)',
  location: {
    lat: 22.9858,
    lng: 72.3812,
    address: 'Plot 42-B, GIDC Sanand Phase II',
    city: 'Sanand / Ahmedabad',
    state: 'Gujarat'
  },
  conversionType: 'Biochar',
  acceptedWasteTypes: ['Rice Husk', 'Agricultural Residue', 'Cotton Stalks', 'Groundnut Shells', 'Wheat Straw', 'Sawdust'],
  totalCapacityTonnesPerDay: 80,
  availableCapacityTonnesPerDay: 45,
  monthlyCapacity: 2400,
  currentUtilization: 44,
  conversionEfficiencyPercent: 88,
  conversionEfficiency: 0.88,
  carbonBenefitFactorPerTonne: 0.92,
  carbonRetentionFactor: 0.92,
  operationalStatus: 'Active',
  status: 'Active',
  verifiedCompliance: true,
  contactEmail: 'operations@sanandbiochar.in',
  processingCostPerTonneINR: 180
};

function AppContent() {
  const { user, isAuthenticated, isLoading } = useAuth();
  const [activeTab, setActiveTab] = useState<NavTab>('overview');
  const [activeBatch, setActiveBatch] = useState<WasteBatch | null>(FLAGSHIP_DEMO_BATCH);
  const [selectedFacility, setSelectedFacility] = useState<Facility | null>(FLAGSHIP_DEMO_FACILITY);
  const [demoStage, setDemoStage] = useState<number>(1);
  const [publicVerificationBatchId, setPublicVerificationBatchId] = useState<string | null>(null);
  const [isLoginModalOpen, setIsLoginModalOpen] = useState(false);
  const [isAskAIOpen, setIsAskAIOpen] = useState(false);

  // Check URL for public passport verification link e.g. /passport/:id or /verify/:id
  useEffect(() => {
    const path = window.location.pathname;
    if (path.startsWith('/passport/')) {
      const id = path.replace('/passport/', '');
      if (id) {
        setPublicVerificationBatchId(id);
      }
    } else if (path.startsWith('/verify/')) {
      const id = path.replace('/verify/', '');
      if (id) {
        setPublicVerificationBatchId(id);
      }
    }
  }, []);

  // Set default tab based on user role when user changes
  useEffect(() => {
    if (user) {
      if (user.role === 'facility_operator') {
        setActiveTab('overview');
      } else if (user.role === 'municipality') {
        setActiveTab('municipality-analytics');
      } else if (user.role === 'admin') {
        setActiveTab('admin-users');
      } else {
        setActiveTab('overview');
      }
    }
  }, [user?.role]);

  const handleLoadDemoScenario = () => {
    setActiveBatch(FLAGSHIP_DEMO_BATCH);
    setSelectedFacility(FLAGSHIP_DEMO_FACILITY);
    setDemoStage(1);
    setActiveTab('overview');
  };

  const handleStartFlagshipDemo = () => {
    setActiveBatch(FLAGSHIP_DEMO_BATCH);
    setSelectedFacility(FLAGSHIP_DEMO_FACILITY);
    setDemoStage(1);
    setActiveTab('waste-batches');
  };

  const handleSelectDemoStage = (stage: number) => {
    setDemoStage(stage);
    switch (stage) {
      case 1:
        setActiveTab('waste-batches');
        break;
      case 2:
        setActiveTab('smart-path');
        break;
      case 3:
        setActiveTab('map-logistics');
        break;
      case 4:
        setActiveTab('waste-batches');
        break;
      case 5:
        setActiveTab('carbon-impact');
        break;
      case 6:
        setActiveTab('carbon-passports');
        break;
      default:
        setActiveTab('overview');
    }
  };

  const handleResetDemo = () => {
    setActiveBatch(null);
    setSelectedFacility(null);
    setDemoStage(1);
    setActiveTab('overview');
  };

  const handleBatchCreatedOrSelected = (batch: WasteBatch) => {
    setActiveBatch(batch);
    setDemoStage(2);
    setActiveTab('smart-path');
  };

  const handleSelectFacilityForLogistics = (facility: Facility, _matchScore: any) => {
    setSelectedFacility(facility);
    if (activeBatch) {
      const updatedBatch: WasteBatch = {
        ...activeBatch,
        facilityId: facility.id,
        facilityName: facility.name,
        status: 'matched'
      };
      setActiveBatch(updatedBatch);
      fetch(`/api/waste-batches/${activeBatch.id}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          status: 'matched',
          facilityId: facility.id,
          facilityName: facility.name
        })
      }).catch((err) => console.warn('Status update warning:', err));
    }
    setDemoStage(3);
    setActiveTab('map-logistics');
  };

  const handleNavigateToCarbonImpact = (_routeData: any) => {
    setDemoStage(5);
    setActiveTab('carbon-impact');
  };

  const handleNavigateToPassport = () => {
    setDemoStage(6);
    setActiveTab('carbon-passports');
  };

  const handleOpenPublicVerification = (batchId: string) => {
    setPublicVerificationBatchId(batchId);
  };

  // 1. PUBLIC QR SCAN VERIFICATION VIEW (MUST WORK WITHOUT LOGIN)
  if (publicVerificationBatchId) {
    return (
      <PublicPassportVerification
        batchId={publicVerificationBatchId}
        onBackToApp={() => {
          window.history.pushState({}, '', '/');
          setPublicVerificationBatchId(null);
        }}
      />
    );
  }

  // 2. LOADING STATE
  if (isLoading) {
    return (
      <div className="min-h-screen bg-[#070e1b] text-slate-100 flex flex-col items-center justify-center gap-3 font-sans">
        <div className="w-8 h-8 border-2 border-brand-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-mono text-slate-400">Loading CarbonLoop ecosystem...</span>
      </div>
    );
  }

  // 3. UNAUTHENTICATED: RENDER DEDICATED LOGIN PAGE WITH 4 ROLE PORTALS
  if (!isAuthenticated || !user) {
    return (
      <LoginPageView
        onLoginSuccess={(role: UserRole) => {
          if (role === 'facility_operator') setActiveTab('overview');
          else if (role === 'municipality') setActiveTab('municipality-analytics');
          else if (role === 'admin') setActiveTab('admin-users');
          else setActiveTab('overview');
        }}
      />
    );
  }

  // 4. AUTHENTICATED: RENDER APP WITH ROLE-SPECIFIC DASHBOARDS & NAVIGATION
  return (
    <div className="min-h-screen bg-[#090e1a] text-slate-100 flex flex-col font-sans selection:bg-brand-500 selection:text-white">
      {/* Top Demo Bar */}
      <DemoFlowBar
        currentStage={demoStage}
        onSelectStage={handleSelectDemoStage}
        onLoadDemoScenario={handleLoadDemoScenario}
        onResetDemo={handleResetDemo}
      />

      {/* Main Navigation Header */}
      <Navigation
        activeTab={activeTab}
        onSelectTab={(tab) => {
          setActiveTab(tab);
          if (tab === 'waste-batches') setDemoStage(1);
          if (tab === 'smart-path') setDemoStage(2);
          if (tab === 'map-logistics') setDemoStage(3);
          if (tab === 'carbon-impact') setDemoStage(5);
          if (tab === 'carbon-passports') setDemoStage(6);
        }}
        onOpenLoginModal={() => setIsLoginModalOpen(true)}
        onOpenAskAI={() => setIsAskAIOpen(true)}
      />

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Role-Specific Overview / Dashboard */}
        {activeTab === 'overview' && (
          <>
            {user.role === 'facility_operator' ? (
              <FacilityOperatorDashboardView
                onNavigateToTab={(t) => setActiveTab(t)}
                onSelectBatchForDetail={(b) => {
                  setActiveBatch(b);
                  setActiveTab('waste-batches');
                }}
              />
            ) : user.role === 'waste_generator' ? (
              <GeneratorDashboardView
                onNavigateToCreateBatch={() => {
                  setActiveTab('waste-batches');
                }}
                onNavigateToSmartMatch={() => {
                  setActiveTab('smart-path');
                }}
                onSelectBatch={(b) => {
                  setActiveBatch(b);
                  setActiveTab('waste-batches');
                }}
              />
            ) : user.role === 'municipality' ? (
              <MunicipalityAnalyticsView />
            ) : (
              <OverviewView
                onStartDemo={handleStartFlagshipDemo}
                onNavigateToTab={(tab) => setActiveTab(tab)}
                onSelectBatchForDetail={(b) => {
                  setActiveBatch(b);
                  setActiveTab('waste-batches');
                }}
                onOpenAskAI={() => setIsAskAIOpen(true)}
              />
            )}
          </>
        )}

        {/* Waste Batches (Accessible to Generator, Admin, Facility Operator, Municipality) */}
        {activeTab === 'waste-batches' && (
          <WasteBatchesView
            onBatchCreated={handleBatchCreatedOrSelected}
            onNavigateToModule={(moduleKey) => {
              if (moduleKey === 'matching') setActiveTab('smart-path');
              if (moduleKey === 'logistics') setActiveTab('map-logistics');
              if (moduleKey === 'passport') setActiveTab('carbon-passports');
            }}
            activeBatchId={activeBatch?.id}
          />
        )}

        {/* Facilities Directory */}
        {activeTab === 'facilities' && <FacilitiesView />}

        {/* Smart Matching (Generator, Admin) */}
        {activeTab === 'smart-path' && (
          <SmartMatchingView
            activeBatch={activeBatch}
            onSelectFacilityForLogistics={handleSelectFacilityForLogistics}
            onNavigateToBatches={() => setActiveTab('waste-batches')}
          />
        )}

        {/* GIS Logistics Map */}
        {activeTab === 'map-logistics' && (
          <LogisticsMapView
            activeBatch={activeBatch}
            selectedFacility={selectedFacility}
            onNavigateToCarbonImpact={handleNavigateToCarbonImpact}
          />
        )}

        {/* Carbon Impact Calculation Breakdown */}
        {activeTab === 'carbon-impact' && (
          <CarbonImpactView
            activeBatch={activeBatch}
            selectedFacility={selectedFacility}
            onNavigateToPassport={handleNavigateToPassport}
          />
        )}

        {/* Carbon Passports */}
        {activeTab === 'carbon-passports' && (
          <CarbonPassportView
            activeBatch={activeBatch}
            onOpenPublicVerification={handleOpenPublicVerification}
          />
        )}

        {/* Municipality Analytics (Restricted to Municipality & Admin) */}
        {activeTab === 'municipality-analytics' && (
          <RoleRoute allowedRoles={['municipality', 'admin']} onOpenLogin={() => setIsLoginModalOpen(true)}>
            <MunicipalityAnalyticsView />
          </RoleRoute>
        )}

        {/* Admin User & Permission Directory (Restricted to Admin) */}
        {activeTab === 'admin-users' && (
          <RoleRoute allowedRoles={['admin']} onOpenLogin={() => setIsLoginModalOpen(true)}>
            <AdminManagementView />
          </RoleRoute>
        )}
      </main>

      {/* Login & Role Switcher Modal */}
      <LoginModal
        isOpen={isLoginModalOpen}
        onClose={() => setIsLoginModalOpen(false)}
        onSuccess={(role) => {
          if (role === 'facility_operator') setActiveTab('overview');
          else if (role === 'municipality') setActiveTab('municipality-analytics');
          else if (role === 'admin') setActiveTab('admin-users');
          else setActiveTab('overview');
        }}
      />

      {/* Ask CarbonLoop AI Assistant Modal */}
      <AskCarbonLoopModal
        isOpen={isAskAIOpen}
        onClose={() => setIsAskAIOpen(false)}
      />

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-wrap items-center justify-between gap-2">
          <span>CarbonLoop • Circular Carbon Ecosystem Protocol</span>
          <span className="font-mono text-[11px] text-slate-400">
            Authenticated Role: <strong className="text-brand-300 uppercase">{user.role.replace('_', ' ')}</strong> ({user.name})
          </span>
        </div>
      </footer>
    </div>
  );
}

export function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}

export default App;
