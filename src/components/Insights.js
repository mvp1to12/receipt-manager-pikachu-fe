import React, { useState, useEffect } from "react";
import { insightsAPI } from "../services/api";
import TranslatedText from "./TranslatedText";

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
        <h2><TranslatedText>Expected expense for next month</TranslatedText></h2>
        <div className="expense-amount">
          {insightsLoading
            ? "Loading..."
            : `₹${expectedExpense.toLocaleString()}`}
        </div>
      </div>

      <div className="section">
        <h3><TranslatedText>Shopping Alerts</TranslatedText></h3>
        {insightsLoading ? (
          <div className="loading-placeholder"><TranslatedText>Loading shopping alerts...</TranslatedText></div>
        ) : (
          shoppingAlerts.map((alert) => (
            <div key={alert.id} className="alert-card">
              <div className="alert-info">
                <h4><TranslatedText>{alert.item}</TranslatedText></h4>
                                  <p><TranslatedText>Expires in: {alert.expiresIn}</TranslatedText></p>
                  <p><TranslatedText>Last Purchased: {alert.lastPurchased}</TranslatedText></p>
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
                {addingToShoppingList ? <TranslatedText>Adding...</TranslatedText> : <TranslatedText>Add to list</TranslatedText>}
              </button>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3><TranslatedText>Your Subscriptions</TranslatedText></h3>
        {insightsLoading ? (
          <div className="loading-placeholder"><TranslatedText>Loading subscriptions...</TranslatedText></div>
        ) : (
          subscriptions.map((subscription) => (
            <div key={subscription.id} className="subscription-card">
              <h4><TranslatedText>{subscription.name}</TranslatedText></h4>
              <p><TranslatedText>Renews On: {subscription.renewsOn}</TranslatedText></p>
              <p><TranslatedText>Days Left: {subscription.daysLeft} Days</TranslatedText></p>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3><TranslatedText>Savings Goals</TranslatedText></h3>
        {insightsLoading ? (
          <div className="loading-placeholder"><TranslatedText>Loading savings goals...</TranslatedText></div>
        ) : (
          savingsGoals.map((goal) => (
            <div key={goal.id} className="goal-card">
              <h4><TranslatedText>{goal.name}</TranslatedText></h4>
              <p><TranslatedText>Goal: ₹{goal.goal.toLocaleString()}</TranslatedText></p>
              <p><TranslatedText>Est. Months to Goal: {goal.estimatedMonths} Months</TranslatedText></p>
              <p><TranslatedText>{goal.suggestion}</TranslatedText></p>
              <p>
                <TranslatedText>You could save ₹{goal.monthlySavings}/month towards your goal</TranslatedText>
              </p>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3><TranslatedText>Product Warranty</TranslatedText></h3>
        {insightsLoading ? (
          <div className="loading-placeholder"><TranslatedText>Loading warranties...</TranslatedText></div>
        ) : (
          warranties.map((warranty) => (
            <div key={warranty.id} className="warranty-card">
              <h4><TranslatedText>{warranty.product}</TranslatedText></h4>
              <p><TranslatedText>Warranty Ends: {warranty.warrantyEnds}</TranslatedText></p>
              <p><TranslatedText>Days Left: {warranty.daysLeft} Days</TranslatedText></p>
            </div>
          ))
        )}
      </div>

      <div className="section">
        <h3><TranslatedText>Financial Snapshot</TranslatedText></h3>
        {insightsLoading ? (
          <div className="loading-placeholder">
            <TranslatedText>Loading financial snapshot...</TranslatedText>
          </div>
        ) : (
          <div className="snapshot-card">
            <h4><TranslatedText>Highest Spending Category</TranslatedText></h4>
            <p>
              <TranslatedText>Category: {financialSnapshot.highestSpendingCategory?.category}</TranslatedText>
            </p>
            <p>
              <TranslatedText>Amount: ₹
              {financialSnapshot.highestSpendingCategory?.amount?.toLocaleString()}</TranslatedText>
            </p>

            <h4><TranslatedText>Highest Spending Month</TranslatedText></h4>
            <p><TranslatedText>Month: {financialSnapshot.highestSpendingMonth?.month}</TranslatedText></p>
            <p>
              <TranslatedText>Amount: ₹
              {financialSnapshot.highestSpendingMonth?.amount?.toLocaleString()}</TranslatedText>
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
              <TranslatedText>Item Added to Shopping List!</TranslatedText>
            </h3>
            <p style={{ 
              margin: '0 0 24px 0', 
              fontSize: '16px', 
              color: '#666',
              lineHeight: '1.5'
            }}>
              <TranslatedText>Your item has been added to the shopping list and is ready to be added to Google Wallet for easy access and organization.</TranslatedText>
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
                <TranslatedText>Skip</TranslatedText>
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
                <TranslatedText>Add to Google Wallet</TranslatedText>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Insights;
