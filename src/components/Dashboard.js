import React, { useState, useEffect } from 'react';
import { Camera, Video, Mic, Upload, AlertCircle, Languages, ArrowLeft } from 'lucide-react';
import { dashboardAPI } from '../services/api';
import LanguageSelector from './LanguageSelector';
import useLanguageStore, { languages } from '../services/languageStore';
import TranslatedText from './TranslatedText';

const Dashboard = ({ sessionId, dashboardData }) => {
  const [totalExpense, setTotalExpense] = useState(0);
  const [recentSpending, setRecentSpending] = useState([]);
  const [topCategories, setTopCategories] = useState([]);
  const [monthlyExpenseGraph, setMonthlyExpenseGraph] = useState([]);
  const [dashboardLoading, setDashboardLoading] = useState(false);
  const [showModal, setShowModal] = useState(null); // 'photo' | 'video' | 'audio' | 'upload' | null
  const [showCategoryModal, setShowCategoryModal] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [mediaStream, setMediaStream] = useState(null);
  const [mediaBlob, setMediaBlob] = useState(null);
  const [isRecording, setIsRecording] = useState(false);
  const [mediaURL, setMediaURL] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [showLanguageModal, setShowLanguageModal] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletToken, setWalletToken] = useState(null);
  const { targetLanguage } = useLanguageStore();
  const fileInputRef = React.useRef();
  const photoInputRef = React.useRef();
  const videoInputRef = React.useRef();
  const mediaRecorderRef = React.useRef();

  useEffect(() => {
    // Use dashboardData prop instead of fetching from API
    console.log('Dashboard: dashboardData changed:', dashboardData);
    if (dashboardData) {
      processDashboardData(dashboardData);
    } else {
      // Show loading state while waiting for data
      console.log('Dashboard: No data yet, showing loading state');
      setDashboardLoading(true);
    }
  }, [dashboardData]);

  const getCurrentLanguageName = () => {
    const currentLang = languages.find(lang => lang.code === targetLanguage);
    return currentLang ? currentLang.nativeName : 'English';
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setShowCategoryModal(true);
  };

  const processDashboardData = (data) => {
    console.log('Dashboard: Processing data:', data);
    try {
      if(data.success) {
        const responseData = data.data;
        console.log('Dashboard: Response data:', responseData);
        
        // Map the API response to component state
        setTotalExpense(responseData.totalMonthlyExpense || 25000);
        setMonthlyExpenseGraph(responseData.monthlyExpenseGraph || []);
        
        // Map recent spending data
        const mappedRecentSpending = (responseData.recentSpending || []).map((item, index) => ({
          id: index + 1,
          item: item.name || 'Unknown Item',
          amount: item.amount || 0,
          date: item.purchaseDate || 'Unknown Date',
          category: item.category || 'Uncategorized'
        }));
        setRecentSpending(mappedRecentSpending);
        
        // Map top spending categories data
        const mappedTopCategories = (responseData.topSpendingCategories || []).map(category => ({
          name: category.category || 'Unknown Category',
          amount: category.amount || 0,
          hasAlert: category.saveMore && category.saveMore.length > 0,
          saveMore: category.saveMore || [],
          items: category.items || []
        }));
        setTopCategories(mappedTopCategories);
        console.log('Dashboard: Data processed successfully');
      } else {
        throw new Error('Failed to process dashboard data');
      }
    } catch (error) {
      console.error('Failed to process dashboard data:', data);
      // Fallback to mock data if processing fails
      const mockRecentSpending = [
        { id: 1, item: 'Tomato', amount: 30, date: '24 July 2025', category: 'Grocery' },
        { id: 2, item: 'Tomato', amount: 30, date: '24 July 2025', category: 'Grocery' },
        { id: 3, item: 'Tomato', amount: 30, date: '24 July 2025', category: 'Grocery' }
      ];
      const mockTopCategories = [
        {
          name: "Utilities",
          amount: 15000.0,
          items: [
            {
              name: "Monthly House Rent",
              amount: 15000.0
            }
          ],
          saveMore: []
        },
        {
          name: "Groceries",
          amount: 8329.0,
          items: [
            {
              name: "Aashirvaad Atta (5kg)",
              amount: 550.0
            },
            {
              name: "Amul Taaza Milk (1L)",
              amount: 461.0
            },
            {
              name: "White Rice (1kg)",
              amount: 600.0
            },
            {
              name: "Fresh Vegetables Mix (1kg)",
              amount: 310.0
            },
            {
              name: "Eggs (12 Pcs)",
              amount: 277.0
            },
            {
              name: "Eggs (6 Pcs)",
              amount: 121.0
            },
            {
              name: "Surf Excel Detergent (1kg)",
              amount: 355.0
            },
            {
              name: "Fresh Vegetables (Assorted)",
              amount: 220.0
            },
            {
              name: "Hand Sanitizer (100ml)",
              amount: 170.0
            },
            {
              name: "Potatoes (1kg)",
              amount: 85.0
            },
            {
              name: "Tomatoes (1kg)",
              amount: 95.0
            },
            {
              name: "Onions (500g)",
              amount: 42.0
            },
            {
              name: "Bread (Brown)",
              amount: 70.0
            },
            {
              name: "Bread (White)",
              amount: 72.0
            },
            {
              name: "Fortune Refined Oil (1L)",
              amount: 160.0
            },
            {
              name: "Sugar (1kg)",
              amount: 42.0
            },
            {
              name: "Fresh Fruits (Apples, Bananas)",
              amount: 200.0
            },
            {
              name: "Onions (1kg)",
              amount: 35.0
            },
            {
              name: "Tomatoes (500g)",
              amount: 25.0
            },
            {
              name: "Maggi Ketchup (500g)",
              amount: 110.0
            },
            {
              name: "Colgate Toothpaste (150g)",
              amount: 198.0
            },
            {
              name: "Capsicum (250g)",
              amount: 45.0
            },
            {
              name: "Daawat Basmati Rice (1kg)",
              amount: 115.0
            },
            {
              name: "Vim Dishwash Liquid (500ml)",
              amount: 90.0
            },
            {
              name: "Patanjali Honey (250g)",
              amount: 120.0
            },
            {
              name: "Tata Salt (1kg)",
              amount: 25.0
            },
            {
              name: "Dove Shampoo (340ml)",
              amount: 280.0
            },
            {
              name: "Lizol Floor Cleaner (1L)",
              amount: 190.0
            },
            {
              name: "Dettol Soap (4 Pcs)",
              amount: 180.0
            },
            {
              name: "Coriander Leaves",
              amount: 10.0
            },
            {
              name: "Green Chillies",
              amount: 10.0
            }
          ],
          saveMore: [
            {
              name: "White Rice (1kg)",
              cheaperPrice: 80.0,
              cheaperMerchantName: "Village Supermarket",
              higherPrice: 120.0,
              higherMerchantName: "Reliance Smart",
              savings: "Save INR 40.0 per kg"
            },
            {
              name: "Amul Taaza Milk (1L)",
              cheaperPrice: 65.0,
              cheaperMerchantName: "Big Bazaar",
              higherPrice: 68.0,
              higherMerchantName: "Local Kirana Store",
              savings: "Save INR 3.0 per L"
            }
          ]
        },
        {
          name: "Dining",
          amount: 2980.0,
          items: [
            {
              name: "Farmhouse Pizza (Medium)",
              amount: 550.0
            },
            {
              name: "Paneer Butter Masala",
              amount: 380.0
            },
            {
              name: "South Indian Combo",
              amount: 300.0
            },
            {
              name: "Veg Thali",
              amount: 300.0
            },
            {
              name: "McAloo Tikki Burger Meal",
              amount: 250.0
            },
            {
              name: "Cappuccino",
              amount: 300.0
            },
            {
              name: "Pizza (Medium)",
              amount: 400.0
            },
            {
              name: "Chicken Biryani",
              amount: 350.0
            },
            {
              name: "Masala Chai",
              amount: 80.0
            },
            {
              name: "Veg Sandwich",
              amount: 70.0
            },
            {
              name: "Chai",
              amount: 40.0
            },
            {
              name: "Butter Naan",
              amount: 140.0
            }
          ],
          saveMore: [
            {
              name: "Chai",
              cheaperPrice: 20.0,
              cheaperMerchantName: "Local Tea Stall",
              higherPrice: 20.0,
              higherMerchantName: "Local Tea Stall",
              savings: "Save 0%"
            },
            {
              name: "Cappuccino",
              cheaperPrice: 150.0,
              cheaperMerchantName: "Cafe Coffee Day",
              higherPrice: 150.0,
              higherMerchantName: "Cafe Coffee Day",
              savings: "Save 0%"
            }
          ]
        }
      ];
      setRecentSpending(mockRecentSpending);
      setTopCategories(mockTopCategories);
    } finally {
      setDashboardLoading(false);
      console.log('Dashboard: Loading set to false');
    }
  };

  const handleReceiptUpload = async (method) => {
    if (method === 'photo') {
      // For mobile, use native camera
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        photoInputRef.current.click();
      } else {
        setShowModal(method);
      }
    } else if (method === 'video') {
      // For mobile, use native camcorder
      if (/Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        videoInputRef.current.click();
      } else {
        setShowModal(method);
      }
    } else if (method === 'voice') {
      setShowModal(method);
    } else if (method === 'upload') {
      fileInputRef.current.click();
    }
  };

  // Handle file input (upload)
  const handleFileChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadMedia(file, 'upload');
    }
    e.target.value = '';
  };

  // Handle photo input (native camera)
  const handlePhotoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadMedia(file, 'photo');
    }
    e.target.value = '';
  };

  // Handle video input (native camcorder)
  const handleVideoChange = async (e) => {
    const file = e.target.files[0];
    if (file) {
      await uploadMedia(file, 'video');
    }
    e.target.value = '';
  };

  // Upload media to backend
  const uploadMedia = async (file, method) => {
    if (!sessionId) {
      alert('Session not initialized. Please refresh the page.');
      return;
    }

    setUploading(true);
    try {
      const result = await dashboardAPI.uploadReceipt(file, method, sessionId);
      if (result.success) {
        if (result.data?.wallet_token) {
          // Show Google Wallet dialog
          setWalletToken(result.data.wallet_token);
          setShowWalletModal(true);
        } else {
          alert('Receipt uploaded successfully!');
        }
      } else {
        alert('Failed to upload receipt. Please try again.');
      }
    } catch (err) {
      console.error('Upload error:', err);
      let errorMessage = 'Failed to upload receipt.';
      
      if (err.message.includes('HTTP error! status: 401')) {
        errorMessage = 'Authentication failed. Please check your credentials.';
      } else if (err.message.includes('HTTP error! status: 403')) {
        errorMessage = 'Access denied. You may not have permission to upload files.';
      } else if (err.message.includes('HTTP error! status: 413')) {
        errorMessage = 'File too large. Please try a smaller file.';
      } else if (err.message.includes('HTTP error! status: 500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      alert(errorMessage);
    }
    setUploading(false);
    setShowModal(null);
    setMediaBlob(null);
    setMediaURL(null);
    if (mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
    }
  };

  // Handle Google Wallet button click
  const handleAddToGoogleWallet = () => {
    if (walletToken) {
      const walletUrl = `https://pay.google.com/gp/v/save/${walletToken}`;
      window.open(walletUrl, '_blank');
      setShowWalletModal(false);
      setWalletToken(null);
    }
  };

  // Camera/photo capture
  const startCamera = async (video = false) => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Camera access is not supported in this browser.');
        setShowModal(null);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ 
        video: true, 
        audio: video 
      });
      setMediaStream(stream);
      setMediaURL(null);
    } catch (err) {
      console.error('Camera access error:', err);
      let errorMessage = 'Camera access denied.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Camera access was denied. Please allow camera access in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No camera found on your device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Camera is not supported in this browser.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Camera is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Camera does not meet the required constraints.';
      } else if (err.name === 'TypeError') {
        errorMessage = 'Camera access requires HTTPS. Please use HTTPS or localhost for development.';
      }
      
      alert(errorMessage);
      setShowModal(null);
    }
  };

  // Audio recording
  const startAudioRecording = async () => {
    try {
      // Check if mediaDevices is supported
      if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
        alert('Microphone access is not supported in this browser.');
        setShowModal(null);
        return;
      }

      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setMediaStream(stream);
      setMediaURL(null);
    } catch (err) {
      console.error('Microphone access error:', err);
      let errorMessage = 'Microphone access denied.';
      
      if (err.name === 'NotAllowedError') {
        errorMessage = 'Microphone access was denied. Please allow microphone access in your browser settings.';
      } else if (err.name === 'NotFoundError') {
        errorMessage = 'No microphone found on your device.';
      } else if (err.name === 'NotSupportedError') {
        errorMessage = 'Microphone is not supported in this browser.';
      } else if (err.name === 'NotReadableError') {
        errorMessage = 'Microphone is already in use by another application.';
      } else if (err.name === 'OverconstrainedError') {
        errorMessage = 'Microphone does not meet the required constraints.';
      } else if (err.name === 'TypeError') {
        errorMessage = 'Microphone access requires HTTPS. Please use HTTPS or localhost for development.';
      }
      
      alert(errorMessage);
      setShowModal(null);
    }
  };

  // Start/stop recording (video/audio)
  const startRecording = () => {
    if (!mediaStream) return;
    const options = { mimeType: showModal === 'voice' ? 'audio/webm' : 'video/webm' };
    const recorder = new window.MediaRecorder(mediaStream, options);
    let chunks = [];
    recorder.ondataavailable = (e) => chunks.push(e.data);
    recorder.onstop = () => {
      const blob = new Blob(chunks, { type: options.mimeType });
      setMediaBlob(blob);
      setMediaURL(URL.createObjectURL(blob));
      setIsRecording(false);
    };
    recorder.start();
    mediaRecorderRef.current = recorder;
    setIsRecording(true);
  };
  const stopRecording = () => {
    if (mediaRecorderRef.current) {
      mediaRecorderRef.current.stop();
    }
    setIsRecording(false);
  };

  // Take photo
  const capturePhoto = () => {
    if (!mediaStream) return;
    const videoTrack = mediaStream.getVideoTracks()[0];
    const imageCapture = new window.ImageCapture(videoTrack);
    imageCapture.takePhoto().then(blob => {
      setMediaBlob(blob);
      setMediaURL(URL.createObjectURL(blob));
    }).catch(() => {
      alert('Failed to capture photo.');
    });
  };

  // Modal effect: start/stop streams
  useEffect(() => {
    if (showModal === 'photo') startCamera(false);
    else if (showModal === 'video') startCamera(true);
    else if (showModal === 'voice') startAudioRecording();
    else if (!showModal && mediaStream) {
      mediaStream.getTracks().forEach(track => track.stop());
      setMediaStream(null);
      setMediaBlob(null);
      setMediaURL(null);
      setIsRecording(false);
    }
    // eslint-disable-next-line
  }, [showModal]);

  return (
    <div className="dashboard">
      <div className="expense-header">
        <div className="expense-info">
          <h2><TranslatedText>Your total expense for this month</TranslatedText></h2>
          <div className="total-amount">
            {dashboardLoading ? (
              <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '8px',
                fontSize: '24px',
                color: '#666'
              }}>
                <div style={{
                  width: 20,
                  height: 20,
                  border: '2px solid #f3f3f3',
                  borderTop: '2px solid #4285f4',
                  borderRadius: '50%',
                  animation: 'spin 1s linear infinite'
                }}></div>
                Loading...
              </div>
            ) : (
              `₹${totalExpense.toLocaleString()}`
            )}
          </div>
        </div>
        <button 
          className="language-button"
          onClick={() => setShowLanguageModal(true)}
        >
          <Languages size={20} strokeWidth={1}/>
          <span>{getCurrentLanguageName()}</span>
        </button>
      </div>

      <div className="receipt-upload">
        <h3><TranslatedText>Add a receipt</TranslatedText></h3>
        <div className="upload-options">
          <button 
            className="upload-option"
            onClick={() => handleReceiptUpload('photo')}
          >
            <Camera size={24} />
            <span><TranslatedText>Photo</TranslatedText></span>
          </button>
          <button 
            className="upload-option"
            onClick={() => handleReceiptUpload('video')}
          >
            <Video size={24} />
            <span><TranslatedText>Video</TranslatedText></span>
          </button>
          <button 
            className="upload-option"
            onClick={() => handleReceiptUpload('voice')}
          >
            <Mic size={24} />
            <span><TranslatedText>Voice</TranslatedText></span>
          </button>
          <button 
            className="upload-option"
            onClick={() => handleReceiptUpload('upload')}
          >
            <Upload size={24} />
            <span><TranslatedText>Upload</TranslatedText></span>
          </button>
        </div>
      </div>

      <div className="spending-graph">
        <div className="graph-placeholder">
          <h3><TranslatedText>Monthly Spending Trend</TranslatedText></h3>
          {dashboardLoading ? (
            <div style={{
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              padding: '20px'
            }}>
              <div style={{
                width: 32,
                height: 32,
                border: '3px solid #f3f3f3',
                borderTop: '3px solid #4285f4',
                borderRadius: '50%',
                animation: 'spin 1s linear infinite'
              }}></div>
              <span style={{ color: '#666', fontSize: '14px' }}><TranslatedText>Loading spending trends...</TranslatedText></span>
            </div>
          ) : monthlyExpenseGraph.length > 0 ? (
            <div className="monthly-graph">
              {(() => {
                // Calculate the maximum amount for scaling
                const maxAmount = Math.max(...monthlyExpenseGraph.map(item => item.amount));
                const maxBarHeight = 120; // Maximum height in pixels
                
                return monthlyExpenseGraph.map((monthData, index) => {
                  const barHeight = maxAmount > 0 ? (monthData.amount / maxAmount) * maxBarHeight : 0;
                  const currentMonth = new Date().toLocaleString('en-US', { month: 'long' });
                  const isCurrentMonth = monthData.month === currentMonth;
                  
                  return (
                    <div key={index} className="month-bar">
                      <div className="bar-container">
                        <div 
                          className={`bar ${isCurrentMonth ? 'current-month' : ''}`}
                          style={{ 
                            height: `${barHeight}px`,
                            backgroundColor: isCurrentMonth ? '#4285f4' : '#e0e0e0'
                          }}
                        >
                          <div className="bar-tooltip">
                            ₹{monthData.amount.toLocaleString()}
                          </div>
                        </div>
                      </div>
                      <div className="bar-label">{monthData.month}</div>
                    </div>
                  );
                });
              })()}
            </div>
          ) : (
            <p><TranslatedText>No spending data available</TranslatedText></p>
          )}
        </div>
      </div>

      <div className="recent-spending">
        <h3><TranslatedText>Recent spending</TranslatedText></h3>
        {dashboardLoading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '20px'
          }}>
            <div style={{
              width: 32,
              height: 32,
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #4285f4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
                          <span style={{ color: '#666', fontSize: '14px' }}><TranslatedText>Loading recent spending...</TranslatedText></span>
          </div>
        ) : (
          <div className="spending-list">
            {recentSpending.map((item) => (
              <div key={item.id} className="spending-item">
                <div className="item-info">
                  <div className="item-name"><TranslatedText>{item.item}</TranslatedText></div>
                  <div className="item-date"><TranslatedText>{item.date}</TranslatedText></div>
                </div>
                <div className="item-details">
                  <div className="item-amount">₹{item.amount.toFixed(2)}</div>
                  <div className="item-category"><TranslatedText>{item.category}</TranslatedText></div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="top-categories">
        <h3><TranslatedText>Top spending categories</TranslatedText></h3>
        {dashboardLoading ? (
          <div style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            gap: '12px',
            padding: '20px'
          }}>
            <div style={{
              width: 32,
              height: 32,
              border: '3px solid #f3f3f3',
              borderTop: '3px solid #4285f4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite'
            }}></div>
            <span style={{ color: '#666', fontSize: '14px' }}><TranslatedText>Loading spending categories...</TranslatedText></span>
          </div>
        ) : (
          <div className="categories-list">
            {topCategories.map((category, index) => (
              <div 
                key={index} 
                className="category-item"
                onClick={() => handleCategoryClick(category)}
                style={{ cursor: 'pointer' }}
              >
                <div className="category-info">
                  <span className="category-name"><TranslatedText>{category.name}</TranslatedText></span>
                  {category.hasAlert && <AlertCircle size={16} className="alert-icon" />}
                </div>
                <span className="category-amount">₹{category.amount.toLocaleString()}</span>
              </div>
            ))}
          </div>
        )}
      </div>
      {/* Hidden file inputs for native camera/camcorder */}
      <input
        type="file"
        ref={fileInputRef}
        style={{ display: 'none' }}
        accept="image/*,video/*,audio/*"
        onChange={handleFileChange}
      />
      <input
        type="file"
        ref={photoInputRef}
        style={{ display: 'none' }}
        accept="image/*"
        capture="environment"
        onChange={handlePhotoChange}
      />
      <input
        type="file"
        ref={videoInputRef}
        style={{ display: 'none' }}
        accept="video/*"
        capture="environment"
        onChange={handleVideoChange}
      />
      {/* Media Modal Overlay */}
      {showModal && (
        <div style={{
          position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh', background: 'rgba(0,0,0,0.6)', zIndex: 9999,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ background: '#fff', borderRadius: 16, padding: 24, minWidth: 320, textAlign: 'center', position: 'relative' }}>
            <button style={{ position: 'absolute', top: 8, right: 8 }} onClick={() => setShowModal(null)}>X</button>
                         {showModal === 'photo' && (
               <div>
                 <h3>Capture Photo</h3>
                 <p style={{ fontSize: '12px', color: '#666', marginBottom: 16 }}>
                   Allow camera access when prompted by your browser
                 </p>
                 {mediaStream && !mediaBlob && (
                   <>
                     <video autoPlay playsInline ref={el => { if (el && mediaStream) el.srcObject = mediaStream; }} style={{ width: '100%', borderRadius: 8 }} />
                     <button onClick={capturePhoto} style={{ marginTop: 16 }}>Take Photo</button>
                   </>
                 )}
                 {mediaURL && (
                   <>
                     <img src={mediaURL} alt="Captured" style={{ width: '100%', borderRadius: 8 }} />
                     <button disabled={uploading} onClick={() => uploadMedia(mediaBlob, 'photo')} style={{ marginTop: 16 }}>Upload</button>
                   </>
                 )}
               </div>
             )}
                         {showModal === 'video' && (
               <div>
                 <h3>Record Video</h3>
                 <p style={{ fontSize: '12px', color: '#666', marginBottom: 16 }}>
                   Allow camera and microphone access when prompted by your browser
                 </p>
                 {mediaStream && !mediaBlob && (
                   <>
                     <video autoPlay playsInline ref={el => { if (el && mediaStream) el.srcObject = mediaStream; }} style={{ width: '100%', borderRadius: 8 }} />
                     {!isRecording ? (
                       <button onClick={startRecording} style={{ marginTop: 16 }}>Start Recording</button>
                     ) : (
                       <button onClick={stopRecording} style={{ marginTop: 16 }}>Stop Recording</button>
                     )}
                   </>
                 )}
                 {mediaURL && (
                   <>
                     <video src={mediaURL} controls style={{ width: '100%', borderRadius: 8 }} />
                     <button disabled={uploading} onClick={() => uploadMedia(mediaBlob, 'video')} style={{ marginTop: 16 }}>Upload</button>
                   </>
                 )}
               </div>
             )}
                         {showModal === 'voice' && (
               <div>
                 <h3>Record Audio</h3>
                 <p style={{ fontSize: '12px', color: '#666', marginBottom: 16 }}>
                   Allow microphone access when prompted by your browser
                 </p>
                 {mediaStream && !mediaBlob && (
                   <>
                     {!isRecording ? (
                       <button onClick={startRecording} style={{ marginTop: 16 }}>Start Recording</button>
                     ) : (
                       <button onClick={stopRecording} style={{ marginTop: 16 }}>Stop Recording</button>
                     )}
                   </>
                 )}
                 {mediaURL && (
                   <>
                     <audio src={mediaURL} controls style={{ width: '100%' }} />
                     <button disabled={uploading} onClick={() => uploadMedia(mediaBlob, 'voice')} style={{ marginTop: 16 }}>Upload</button>
                   </>
                 )}
               </div>
             )}
          </div>
        </div>
      )}
      
      {/* Upload Loading Screen - Outside modal so it appears for all upload types */}
      {uploading && (
        <div style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100vw',
          height: '100vh',
          background: 'rgba(0,0,0,0.8)',
          zIndex: 10002,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          flexDirection: 'column'
        }}>
          <div style={{
            background: '#fff',
            borderRadius: 16,
            padding: 32,
            textAlign: 'center',
            maxWidth: '90vw',
            minWidth: 300
          }}>
            <div style={{
              width: 48,
              height: 48,
              border: '4px solid #f3f3f3',
              borderTop: '4px solid #4285f4',
              borderRadius: '50%',
              animation: 'spin 1s linear infinite',
              margin: '0 auto 16px auto'
            }}></div>
            <h3 style={{ 
              margin: '0 0 8px 0', 
              fontSize: '18px', 
              fontWeight: '600',
              color: '#333'
            }}>
              Uploading Receipt
            </h3>
            <p style={{ 
              margin: 0, 
              fontSize: '14px', 
              color: '#666',
              lineHeight: '1.5'
            }}>
              Please wait while we process your receipt...
            </p>
          </div>
        </div>
      )}
      
      {/* Category Detail Modal */}
      {showCategoryModal && selectedCategory && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          background: '#fff', 
          zIndex: 10000,
          overflow: 'auto'
        }}>
          {/* Header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            padding: '16px',
            borderBottom: '1px solid #e0e0e0',
            position: 'sticky',
            top: 0,
            background: '#fff',
            zIndex: 1
          }}>
            <button 
              onClick={() => setShowCategoryModal(false)}
              style={{
                background: 'none',
                border: 'none',
                padding: '8px',
                marginRight: '12px',
                cursor: 'pointer',
                display: 'flex',
                alignItems: 'center'
              }}
            >
              <ArrowLeft size={24} />
            </button>
            <h2 style={{ margin: 0, fontSize: '20px', fontWeight: '600' }}>
              {selectedCategory.name}
            </h2>
          </div>

          {/* Content */}
          <div style={{ padding: '16px' }}>
            {/* Smart Saver Section */}
            {selectedCategory.saveMore && selectedCategory.saveMore.length > 0 && (
              <div style={{ marginBottom: '24px' }}>
                <h3 style={{ 
                  margin: '0 0 12px 0', 
                  fontSize: '18px', 
                  fontWeight: '600',
                  color: '#333'
                }}>
                  Smart saver
                </h3>
                <div style={{
                  border: '1px solid #e0e0e0',
                  borderRadius: '8px',
                  padding: '16px',
                  background: '#f9f9f9'
                }}>
                  {selectedCategory.saveMore.map((item, index) => (
                    <div key={index} style={{ marginBottom: index < selectedCategory.saveMore.length - 1 ? '12px' : 0 }}>
                      <div style={{ fontWeight: '600', marginBottom: '4px' }}>
                        {item.name}
                      </div>
                      <div style={{ fontSize: '14px', color: '#666' }}>
                        {item.savings} by buying from {item.cheaperMerchantName} instead of {item.higherMerchantName}.
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Items List */}
            <div style={{ marginBottom: '24px' }}>
              <h3 style={{ 
                margin: '0 0 12px 0', 
                fontSize: '18px', 
                fontWeight: '600',
                color: '#333'
              }}>
                Items
              </h3>
              <div style={{
                border: '1px solid #e0e0e0',
                borderRadius: '8px',
                overflow: 'hidden'
              }}>
                {/* Header */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  padding: '12px 16px',
                  background: '#f5f5f5',
                  borderBottom: '1px solid #e0e0e0',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  <span>Item</span>
                  <span>Cost</span>
                </div>
                
                {/* Items */}
                {selectedCategory.items.map((item, index) => (
                  <div 
                    key={index}
                    style={{
                      display: 'grid',
                      gridTemplateColumns: '1fr auto',
                      padding: '12px 16px',
                      borderBottom: index < selectedCategory.items.length - 1 ? '1px solid #e0e0e0' : 'none'
                    }}
                  >
                    <span>{item.name}</span>
                    <span>₹{item.amount.toLocaleString()}</span>
                  </div>
                ))}
                
                {/* Total */}
                <div style={{
                  display: 'grid',
                  gridTemplateColumns: '1fr auto',
                  padding: '12px 16px',
                  background: '#f5f5f5',
                  borderTop: '1px solid #e0e0e0',
                  fontWeight: '600',
                  fontSize: '14px'
                }}>
                  <span>Total</span>
                  <span>₹{selectedCategory.amount.toLocaleString()}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
      
      <LanguageSelector 
        isOpen={showLanguageModal}
        onClose={() => setShowLanguageModal(false)}
      />

      {/* Google Wallet Modal */}
      {showWalletModal && (
        <div style={{
          position: 'fixed', 
          top: 0, 
          left: 0, 
          width: '100vw', 
          height: '100vh', 
          background: 'rgba(0,0,0,0.6)', 
          zIndex: 10001,
          display: 'flex', 
          alignItems: 'center', 
          justifyContent: 'center',
        }}>
          <div style={{ 
            background: '#fff', 
            borderRadius: 16, 
            padding: 24, 
            minWidth: 320, 
            textAlign: 'center',
            maxWidth: '90vw'
          }}>
            <h3 style={{ margin: '0 0 16px 0', fontSize: '20px', fontWeight: '600' }}>
              Receipt Uploaded Successfully!
            </h3>
            <p style={{ 
              margin: '0 0 24px 0', 
              fontSize: '16px', 
              color: '#666',
              lineHeight: '1.5'
            }}>
              Your receipt has been processed and is ready to be added to Google Wallet for easy access and organization.
            </p>
            <div style={{ display: 'flex', gap: '12px', justifyContent: 'center' }}>
              <button 
                onClick={() => {
                  setShowWalletModal(false);
                  setWalletToken(null);
                }}
                style={{
                  padding: '12px 24px',
                  border: '1px solid #ddd',
                  borderRadius: '8px',
                  background: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Skip
              </button>
              <button 
                onClick={handleAddToGoogleWallet}
                style={{
                  padding: '12px 24px',
                  border: 'none',
                  borderRadius: '8px',
                  background: '#4285f4',
                  color: '#fff',
                  cursor: 'pointer',
                  fontSize: '14px',
                  fontWeight: '500'
                }}
              >
                Add to Google Wallet
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Dashboard; 