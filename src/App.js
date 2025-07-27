import React, { useState, useEffect, useRef } from 'react';
import { BarChart3, Lightbulb, MessageCircle } from 'lucide-react';
import Dashboard from './components/Dashboard';
import Insights from './components/Insights';
import Chat from './components/Chat';
import { createSession, dashboardAPI, insightsAPI } from './services/api';
import TranslatedText from './components/TranslatedText';
import './App.css';

import {mockDashboardData, mockInsightsData} from './components/mock_data';

function App() {
  const [activeTab, setActiveTab] = useState('dashboard');
  const [sessionId, setSessionId] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // Data states for dashboard and insights
  const [dashboardData, setDashboardData] = useState(null);
  const [insightsData, setInsightsData] = useState(null);
  
  // Ref to prevent duplicate initialization
  const isInitializing = useRef(false);

  // Initialize session first, then load data asynchronously
  useEffect(() => {
    // Prevent duplicate initialization
    if (isInitializing.current) {
      console.log('Initialization already in progress, skipping...');
      return;
    }
    
    console.log('Starting app initialization...');
    isInitializing.current = true;
    
    const initializeApp = async () => {
      try {
        setIsLoading(true);
        setError(null);
        
        // Step 1: Create session only
        console.log('Creating session...');
        const newSessionId = await createSession();
        setSessionId(newSessionId);
        console.log('Session created successfully:', newSessionId);
        
        // Step 2: Show the app immediately after session creation
        console.log('Showing app interface...');
        setIsLoading(false);
        
        // // Step 3: Load dashboard data asynchronously
        console.log('Starting async dashboard data load...');
        setTimeout(() => {
          setDashboardData(mockDashboardData);
          
        }, 1200);
        loadDashboardData(newSessionId);
        
        // // Step 4: Load insights data asynchronously
        console.log('Starting async insights data load...');
              // setting mock initial data

        setTimeout(() => {
          loadInsightsData(newSessionId);
        }, 10000);
        setTimeout(() => {
          setInsightsData(mockInsightsData);
          
        }, 1500);
        
      } catch (err) {
        console.error('Failed to create session:', err);
        setError(<TranslatedText>Failed to initialize application. Please refresh the page.</TranslatedText>);
        setIsLoading(false);
      }
    };

    initializeApp();
    
    // Cleanup function
    return () => {
      console.log('App initialization cleanup...');
      isInitializing.current = false;
    };
  }, []);

  // Separate function to load dashboard data
  const loadDashboardData = async (sessionId) => {
    try {
      console.log('Loading dashboard data...');
      const dashboardResponse = await dashboardAPI.getAllDashboardData(sessionId);
      setDashboardData(dashboardResponse);
      console.log('Dashboard data fetched successfully');
    } catch (err) {
      setDashboardData({'success': false, 'data': null});
      console.error('Failed to fetch dashboard data:', err);
      // Don't set error state, let the component handle it
    }
  };

  // Separate function to load insights data
  const loadInsightsData = async (sessionId) => {
    try {

      console.log('Loading insights data...');
      const insightsResponse = await insightsAPI.getAllInsightsData(sessionId);
      setInsightsData(insightsResponse);
      console.log('Insights data fetched successfully');
    } catch (err) {
      setInsightsData({'success': false, 'data': null});
      console.error('Failed to fetch insights data:', err);
      // Don't set error state, let the component handle it
    }
  };

  const renderActiveTab = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard sessionId={sessionId} dashboardData={dashboardData} />;
      case 'insights':
        return <Insights sessionId={sessionId} insightsData={insightsData} />;
      case 'chat':
        return <Chat />;
      default:
        return <Dashboard sessionId={sessionId} dashboardData={dashboardData} />;
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="app">
        <div className="loading-container">
          <div className="loading-spinner"></div>
          <p><TranslatedText>Initializing application...</TranslatedText></p>
        </div>
      </div>
    );
  }

  // Show error state
  if (error) {
    return (
      <div className="app">
        <div className="error-container">
          <p className="error-message">{error}</p>
          <button onClick={() => window.location.reload()}><TranslatedText>Retry</TranslatedText></button>
        </div>
      </div>
    );
  }

  return (
    <div className="app">
      <div className="tab-content">
        {renderActiveTab()}
      </div>
      
      <nav className="bottom-nav">
        <button
          className={`nav-item ${activeTab === 'dashboard' ? 'active' : ''}`}
          onClick={() => setActiveTab('dashboard')}
        >
          <BarChart3 size={24} />
          <span><TranslatedText>Dashboard</TranslatedText></span>
        </button>
        
        <button
          className={`nav-item ${activeTab === 'insights' ? 'active' : ''}`}
          onClick={() => setActiveTab('insights')}
        >
          <Lightbulb size={24} />
          <span><TranslatedText>Insights</TranslatedText></span>
        </button>
        
        <button
          className={`nav-item ${activeTab === 'chat' ? 'active' : ''}`}
          onClick={() => setActiveTab('chat')}
        >
          <MessageCircle size={24} />
          <span><TranslatedText>Chat</TranslatedText></span>
        </button>
      </nav>
    </div>
  );
}

export default App; 