import { createBaseAccountSDK, pay, getPaymentStatus } from "@base-org/account";

// Inisialisasi SDK
const provider = createBaseAccountSDK({
  appName: 'Base Account Quick-start',
  appLogoUrl: 'https://base.org/logo.png',
}).getProvider();

const statusDiv = document.getElementById("status");
let userAddress = null;

// Fungsi untuk update UI
function showStatus(message, type = 'success') {
  statusDiv.innerHTML = message;
}

// Generate nonce untuk autentikasi
function generateNonce() {
  return crypto.randomUUID().replace(/-/g, '');
}

// Sign in with Base
document.getElementById("signin").onclick = async () => {
  try {
    showStatus("Connecting to Base Account...", 'success');
    const nonce = generateNonce();
    const { accounts } = await provider.request({
      method: 'wallet_connect',
      params: [{
        version: '1',
        capabilities: {
          signInWithEthereum: { 
            nonce, 
            chainId: '0x2105' // Base Mainnet, tapi testnet OK karena params.testnet
          }
        }
      }]
    });
    const { address } = accounts[0];
    userAddress = address;
    showStatus(`✅ Successfully signed in! Address: ${address.slice(0, 6)}...${address.slice(-4)}`);
  } catch (error) {
    console.error('Sign-in error:', error);
    showStatus(`❌ Sign-in failed: ${error.message}`, 'error');
  }
};

// Pay with Base (5 USDC)
document.getElementById("pay").onclick = async () => {
  try {
    showStatus("Processing payment...", 'success');
    const result = await pay({
      amount: "5.00",
      to: "0x2211d1D0020DAEA8039E46Cf1367962070d77DA9",
      testnet: true
    });
    const status = await getPaymentStatus({
      id: result.id,
      testnet: true
    });
    showStatus(`🎉 Payment completed! Status: ${status.status}`);
  } catch (error) {
    console.error('Payment error:', error);
    showStatus(`❌ Payment failed: ${error.message}`, 'error');
  }
};
