import React, { useState, useEffect } from "react";
import { insightsAPI } from "../services/api";

const Insights = ({ sessionId, insightsData }) => {
  const [expectedExpense, setExpectedExpense] = useState(0);
  const [shoppingAlerts, setShoppingAlerts] = useState([]);
  const [subscriptions, setSubscriptions] = useState([]);
  const [savingsGoals, setSavingsGoals] = useState([]);
  const [warranties, setWarranties] = useState([]);
  const [financialSnapshot, setFinancialSnapshot] = useState({});
  const [loading, setLoading] = useState(false);
  const [insightsLoading, setInsightsLoading] = useState(false);
  const [showWalletModal, setShowWalletModal] = useState(false);
  const [walletToken, setWalletToken] = useState(null);
  const [addingToShoppingList, setAddingToShoppingList] = useState(false);

  useEffect(() => {
    // Use insightsData prop instead of fetching from API
    console.log('Insights: insightsData changed:', insightsData);
    if (insightsData) {
      processInsightsData(insightsData);
    } else {
      // Show loading state while waiting for data
      console.log('Insights: No data yet, showing loading state');
      setInsightsLoading(true);
    }
  }, [insightsData]);

  const processInsightsData = (data) => {
    console.log('Insights: Processing data:', data);
    try {
      if (data.success) {
        const responseData = data.data;
        console.log('Insights: Response data:', responseData);

        // Map expected expense from the response
        if (responseData.expectedExpenseNextMonth?.amount) {
          setExpectedExpense(responseData.expectedExpenseNextMonth.amount);
        }

        // Map shopping alerts from the response
        if (responseData.shoppingAlerts?.runningLow) {
          const alert = responseData.shoppingAlerts.runningLow;
          setShoppingAlerts([
            {
              id: 1,
              item: alert.itemName,
              expiresIn: alert.expectedRunOutIn,
              lastPurchased: alert.lastPurchased,
            },
          ]);
        }

        // Map subscriptions from the response
        if (
          responseData.subscriptions &&
          Array.isArray(responseData.subscriptions)
        ) {
          const mappedSubscriptions = responseData.subscriptions.map(
            (sub, index) => ({
              id: index + 1,
              name: sub.subscriptionName,
              renewsOn: sub.renewsOn,
              daysLeft: sub.daysLeft,
            })
          );
          setSubscriptions(mappedSubscriptions);
        }

        // Keep hardcoded data for savings goals
        setSavingsGoals([
          {
            id: 1,
            name: "Buy Nike Jordans sneakers",
            goal: 12000,
            estimatedMonths: 3,
            suggestion: "Cut back on dining out and evening snacks.",
            monthlySavings: "4000",
          },
        ]);

        // Keep hardcoded data for warranties
        setWarranties([
          {
            id: 1,
            product: "Prestige pressure cooker",
            warrantyEnds: "August 24, 2025",
            daysLeft: 28,
          },
        ]);

        // Map financial snapshot from the response
        if (responseData.financialSnapshot) {
          setFinancialSnapshot({
            highestSpendingCategory:
              responseData.financialSnapshot.highestSpendingCategory,
            highestSpendingMonth:
              responseData.financialSnapshot.highestSpendingMonth,
          });
        }
        console.log('Insights: Data processed successfully');
      } else {
        throw new Error("Failed to process insights data");
      }
    } catch (error) {
      console.error("Failed to process insights data:", data);
      // Fallback to default values if processing fails
      setExpectedExpense(0);
      setShoppingAlerts([]);
      setSubscriptions([]);
      setSavingsGoals([]);
      setWarranties([]);
      setFinancialSnapshot();
    } finally {
      setInsightsLoading(false);
      console.log('Insights: Loading set to false');
    }
  };

  const addToShoppingList = async (item) => {
    if (!sessionId) {
      alert('Session not initialized. Please refresh the page.');
      return;
    }

    setAddingToShoppingList(true);
    try {
      const result = await insightsAPI.addItemToShoppingList(sessionId, item);
      if (result.success) {
        if (result.data) {
          // Show Google Wallet dialog
          setWalletToken(result.data);
          setShowWalletModal(true);
        } else {
          alert('Item added to shopping list successfully!');
        }
      } else {
        alert('Failed to add item to shopping list. Please try again.');
      }
    } catch (err) {
      console.error('Add to shopping list error:', err);
      let errorMessage = 'Failed to add item to shopping list.';
      
      if (err.message.includes('HTTP error! status: 401')) {
        errorMessage = 'Authentication failed. Please check your credentials.';
      } else if (err.message.includes('HTTP error! status: 403')) {
        errorMessage = 'Access denied. You may not have permission to add items.';
      } else if (err.message.includes('HTTP error! status: 500')) {
        errorMessage = 'Server error. Please try again later.';
      } else if (err.message.includes('NetworkError') || err.message.includes('Failed to fetch')) {
        errorMessage = 'Network error. Please check your internet connection.';
      }
      
      alert(errorMessage);
    } finally {
      setAddingToShoppingList(false);
    }
  };

  // Handle Google Wallet button click
  const handleAddToGoogleWallet = () => {
    if (walletToken) {
      window.open(walletToken, '_blank');
      setShowWalletModal(false);
      setWalletToken(null);
    }
  };

  return (
    <div className="insights">
      <div className="expected-expense">
        <h2>Expected expense for next month</h2>
        <div className="expense-amount">
          {insightsLoading
            ? "Loading..."
            : `₹${expectedExpense.toLocaleString()}`}
        </div>
      </div>

      <div className="section">
        <h3>Shopping Alerts</h3>
        {insightsLoading ? (
          <div className="loading-placeholder">Loading shopping alerts...</div>
        ) : (
          shoppingAlerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <div className="alert-info">
                <h4>{alert.item}</h4>
                <p>Expires in: {alert.expiresIn}</p>
                <p>Last Purchased: {alert.lastPurchased}</p>
              </div>
              <button
                className="add-to-list-btn"
                onClick={() => addToShoppingList(alert.item)}
                disabled={addingToShoppingList}
                style={{
                  opacity: addingToShoppingList ? 0.6 : 1,
                  cursor: addingToShoppingList ? 'not-allowed' : 'pointer',
                  display: 'flex',
                  alignItems: 'center',
                  gap: '8px'
                }}
              >
                {addingToShoppingList && (
                  <div style={{
                    width: '12px',
                    height: '12px',
                    border: '2px solid #ffffff',
                    borderTop: '2px solid transparent',
                    borderRadius: '50%',
                    animation: 'spin 1s linear infinite'
                  }}></div>
                )}
                {addingToShoppingList ? 'Adding...' : 'Add to list'}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3>Your Subscriptions</h3>
        {insightsLoading ? (
          <div className="loading-placeholder">Loading subscriptions...</div>
        ) : (
          subscriptions.map((subscription) => (
            <div key={subscription.id} className="subscription-card">
              <h4>{subscription.name}</h4>
              <p>Renews On: {subscription.renewsOn}</p>
              <p>Days Left: {subscription.daysLeft} Days</p>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3>Savings Goals</h3>
        {insightsLoading ? (
          <div className="loading-placeholder">Loading savings goals...</div>
        ) : (
          savingsGoals.map((goal) => (
            <div key={goal.id} className="goal-card">
              <h4>{goal.name}</h4>
              <p>Goal: ₹{goal.goal.toLocaleString()}</p>
              <p>Est. Months to Goal: {goal.estimatedMonths} Months</p>
              <p>{goal.suggestion}</p>
              <p>
                You could save ₹{goal.monthlySavings}/month towards your goal
              </p>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3>Product Warranty</h3>
        {insightsLoading ? (
          <div className="loading-placeholder">Loading warranties...</div>
        ) : (
          warranties.map((warranty) => (
            <div key={warranty.id} className="warranty-card">
              <h4>{warranty.product}</h4>
              <p>Warranty Ends: {warranty.warrantyEnds}</p>
              <p>Days Left: {warranty.daysLeft} Days</p>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3>Financial Snapshot</h3>
        {insightsLoading ? (
          <div className="loading-placeholder">
            Loading financial snapshot...
          </div>
        ) : (
          <div className="snapshot-card">
            <h4>Highest Spending Category</h4>
            <p>
              Category: {financialSnapshot.highestSpendingCategory?.category}
            </p>
            <p>
              Amount: ₹
              {financialSnapshot.highestSpendingCategory?.amount?.toLocaleString()}
            </p>

            <h4>Highest Spending Month</h4>
            <p>Month: {financialSnapshot.highestSpendingMonth?.month}</p>
            <p>
              Amount: ₹
              {financialSnapshot.highestSpendingMonth?.amount?.toLocaleString()}
            </p>
          </div>
        )}
      </div>

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
              Item Added to Shopping List!
            </h3>
            <p style={{ 
              margin: '0 0 24px 0', 
              fontSize: '16px', 
              color: '#666',
              lineHeight: '1.5'
            }}>
              Your item has been added to the shopping list and is ready to be added to Google Wallet for easy access and organization.
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

export default Insights;
