// Simple test to verify the getTxs API endpoint
const testGetTxs = async () => {
    try {
        const response = await fetch('http://localhost:3000/api/getTxs');
        const data = await response.json();

        if (response.ok) {
            console.log('✅ API Response:', data);
            console.log(`📊 Found ${data.count} transactions`);
            if (data.transactions && data.transactions.length > 0) {
                console.log('📋 Sample transaction:', data.transactions[0]);
            }
        } else {
            console.error('❌ API Error:', data);
        }
    } catch (error) {
        console.error('❌ Network Error:', error);
    }
};

testGetTxs();
