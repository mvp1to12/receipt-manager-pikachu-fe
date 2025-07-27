export const mockInsightsData = {
    'success': true,
    'data': {
        "expectedExpenseNextMonth": {
            "amount": 24023.75
        },
        "shoppingAlerts": {
            "runningLow": {
                "itemName": "Eggs",
                "expectedRunOutIn": "8 days",
                "lastPurchased": "July 26, 2025"
            }
        },
        "subscriptions": [
            {
                "subscriptionName": "Monthly House Rent",
                "renewsOn": "August 05, 2025",
                "daysLeft": 9
            },
            {
                "subscriptionName": "Annual Gym Membership",
                "renewsOn": "July 22, 2026",
                "daysLeft": 360
            }
        ],
        "financialSnapshot": {
            "highestSpendingCategory": {
                "category": "Groceries",
                "amount": 10582
            },
            "highestSpendingMonth": {
                "month": "July, 2025",
                "amount": 35645.25
            },
            "highestSpendingWeek": {
                "week": "Week of June 03, 2025",
                "amount": 5440.75
            }
        }
    }
}

export const mockDashboardData = {
    'success': true,
    'data': {
        "totalMonthlyExpense": 36005.25,
        "monthlyExpenseGraph": [
            {
                "month": "February",
                "amount": 0
            },
            {
                "month": "March",
                "amount": 0
            },
            {
                "month": "April",
                "amount": 0
            },
            {
                "month": "May",
                "amount": 0
            },
            {
                "month": "June",
                "amount": 12722.25
            },
            {
                "month": "July",
                "amount": 36005.25
            }
        ],
        "recentSpending": [
            {
                "name": "Red Bull Energy Drink",
                "purchaseDate": "July 27, 2025",
                "amount": 125,
                "category": "Beverages"
            },
            {
                "name": "So Good Almond",
                "purchaseDate": "July 27, 2025",
                "amount": 75,
                "category": "Beverages"
            },
            {
                "name": "Amul Taaza Milk (1L)",
                "purchaseDate": "July 26, 2025",
                "amount": 68,
                "category": "Groceries"
            }
        ],
        "topSpendingCategories": [
            {
                "category": "Utilities",
                "amount": 15000,
                "items": [
                    {
                        "name": "Monthly House Rent",
                        "amount": 15000
                    }
                ],
                "saveMore": []
            },
            {
                "category": "Health & Wellness",
                "amount": 12080,
                "items": [
                    {
                        "name": "Annual Gym Membership",
                        "amount": 12000
                    },
                    {
                        "name": "Band-Aid (10 Pcs)",
                        "amount": 50
                    },
                    {
                        "name": "Dolo 650 (10 tablets)",
                        "amount": 30
                    }
                ],
                "saveMore": []
            },
            {
                "category": "Groceries",
                "amount": 5370,
                "items": [
                    {
                        "name": "White Rice (1kg)",
                        "amount": 680
                    },
                    {
                        "name": "Aashirvaad Atta (5kg)",
                        "amount": 550
                    },
                    {
                        "name": "Amul Taaza Milk (1L)",
                        "amount": 532
                    },
                    {
                        "name": "Surf Excel Detergent (1kg)",
                        "amount": 355
                    },
                    {
                        "name": "Eggs (12 Pcs)",
                        "amount": 338
                    },
                    {
                        "name": "Fresh Vegetables Mix (1kg)",
                        "amount": 310
                    },
                    {
                        "name": "Dove Shampoo (340ml)",
                        "amount": 280
                    },
                    {
                        "name": "Fresh Vegetables (Assorted)",
                        "amount": 220
                    },
                    {
                        "name": "Lizol Floor Cleaner (1L)",
                        "amount": 190
                    },
                    {
                        "name": "Colgate Toothpaste (150g)",
                        "amount": 198
                    },
                    {
                        "name": "Dettol Soap (4 Pcs)",
                        "amount": 180
                    },
                    {
                        "name": "Hand Sanitizer (100ml)",
                        "amount": 170
                    },
                    {
                        "name": "Fortune Refined Oil (1L)",
                        "amount": 160
                    },
                    {
                        "name": "Patanjali Honey (250g)",
                        "amount": 120
                    },
                    {
                        "name": "Eggs (6 Pcs)",
                        "amount": 111
                    },
                    {
                        "name": "Maggi Ketchup (500g)",
                        "amount": 110
                    },
                    {
                        "name": "Tomatoes (1kg)",
                        "amount": 95
                    },
                    {
                        "name": "Vim Dishwash Liquid (500ml)",
                        "amount": 90
                    },
                    {
                        "name": "Potatoes (1kg)",
                        "amount": 85
                    },
                    {
                        "name": "Bread (White)",
                        "amount": 72
                    },
                    {
                        "name": "Daawat Basmati Rice (1kg)",
                        "amount": 115
                    },
                    {
                        "name": "Sugar (1kg)",
                        "amount": 42
                    },
                    {
                        "name": "Onions (500g)",
                        "amount": 42
                    },
                    {
                        "name": "Bread (Brown)",
                        "amount": 35
                    },
                    {
                        "name": "Onions (1kg)",
                        "amount": 35
                    },
                    {
                        "name": "Capsicum (250g)",
                        "amount": 30
                    },
                    {
                        "name": "Tata Salt (1kg)",
                        "amount": 25
                    },
                    {
                        "name": "Tomatoes (500g)",
                        "amount": 25
                    },
                    {
                        "name": "Coriander Leaves",
                        "amount": 15
                    },
                    {
                        "name": "Green Chillies",
                        "amount": 10
                    }
                ],
                "saveMore": [
                    {
                        "name": "Eggs (6 Pcs)",
                        "cheaperPrice": 27,
                        "cheaperMerchantName": "Local Kirana Store",
                        "higherPrice": 57,
                        "higherMerchantName": "Local Kirana Store",
                        "savings": "Save 52.6%"
                    },
                    {
                        "name": "White Rice (1kg)",
                        "cheaperPrice": 80,
                        "cheaperMerchantName": "Village Supermarket",
                        "higherPrice": 120,
                        "higherMerchantName": "Reliance Smart",
                        "savings": "Save 33.3%"
                    }
                ]
            }
        ]
    }
}