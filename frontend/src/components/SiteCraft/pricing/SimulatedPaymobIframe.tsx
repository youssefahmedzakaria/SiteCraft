import React, { useEffect } from "react";

interface SimulatedPaymobIframeProps {
  planName: string;
  planPrice: number;
  onSuccess: () => void;
  onCancel: () => void;
}

const SimulatedPaymobIframe: React.FC<SimulatedPaymobIframeProps> = ({ planName, planPrice, onSuccess, onCancel }) => {
  useEffect(() => {
    function handleMessage(event: MessageEvent) {
      if (event.data && event.data.type === 'PAYMOB_SIMULATE_SUCCESS') {
        onSuccess();
      } else if (event.data && event.data.type === 'PAYMOB_SIMULATE_CANCEL') {
        onCancel();
      }
    }
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [onSuccess, onCancel]);

  const simulatedIframeHtml = `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      <title>Paymob Payment</title>
      <style>
        html, body { height: 100%; margin: 0; padding: 0; background: transparent; }
        body { font-family: 'Inter', Arial, sans-serif; background: transparent; }
        .header-bar {
          background: linear-gradient(90deg, #00B4D8 0%, #0077B6 100%);
          color: #fff;
          padding: 0 0 0 0;
          height: 56px;
          display: flex;
          align-items: center;
          justify-content: space-between;
          border-radius: 12px 12px 0 0;
        }
        .header-left { display: flex; align-items: center; gap: 12px; padding-left: 20px; }
        .header-logo {
          background: #fff;
          border-radius: 8px;
          width: 36px;
          height: 36px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-logo-inner {
          background: linear-gradient(135deg, #00B4D8, #0077B6);
          color: #fff;
          font-weight: bold;
          font-size: 1.2rem;
          border-radius: 8px;
          width: 32px;
          height: 32px;
          display: flex;
          align-items: center;
          justify-content: center;
        }
        .header-title { font-size: 1.1rem; font-weight: 600; }
        .header-desc { font-size: 0.8rem; color: #e0f7fa; }
        .header-right { display: flex; align-items: center; gap: 6px; padding-right: 20px; }
        .ssl-badge { font-size: 0.8rem; color: #e0f7fa; display: flex; align-items: center; gap: 4px; }
        .lock-icon { width: 14px; height: 14px; display: inline-block; vertical-align: middle; }
        .main-content { background: #f8fafc; min-height: 520px; padding: 0; display: flex; flex-direction: column; align-items: center; }
        .order-summary {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          margin: 20px auto 16px auto;
          padding: 18px 22px 16px 22px;
          width: 90%;
          max-width: 360px;
          border: 1px solid #e2e8f0;
        }
        .order-summary-title { font-size: 1rem; color: #64748b; margin-bottom: 8px; display: flex; align-items: center; gap: 6px; font-weight: 500; }
        .order-summary-row { display: flex; justify-content: space-between; align-items: center; }
        .order-plan { font-weight: 600; color: #1e293b; font-size: 1rem; }
        .order-period { font-size: 0.9rem; color: #64748b; margin-top: 2px; }
        .order-price { font-size: 1.25rem; font-weight: bold; color: #0077B6; }
        .order-vat { font-size: 0.8rem; color: #64748b; text-align: right; margin-top: 2px; }
        .form-container {
          background: #fff;
          border-radius: 10px;
          box-shadow: 0 2px 8px rgba(0,0,0,0.08);
          padding: 20px 22px 18px 22px;
          width: 90%;
          max-width: 360px;
          border: 1px solid #e2e8f0;
          margin-bottom: 16px;
        }
        .tabs { display: flex; gap: 8px; margin-bottom: 14px; }
        .tab { flex: 1; padding: 10px 0; border-radius: 8px; background: #f1f5f9; color: #0077B6; font-weight: 500; text-align: center; cursor: pointer; border: 2px solid transparent; transition: all 0.2s ease; font-size: 0.95rem; }
        .tab.active { background: #00B4D8; color: #fff; border-color: #00B4D8; box-shadow: 0 2px 4px rgba(0,180,216,0.2); }
        .form-group { margin-bottom: 12px; }
        .form-label { display: block; font-size: 0.9rem; color: #374151; margin-bottom: 4px; font-weight: 500; }
        .form-input { width: 100%; padding: 10px 12px; border-radius: 6px; border: 1px solid #d1d5db; font-size: 0.95rem; transition: border-color 0.2s; box-sizing: border-box; }
        .form-input:focus { outline: none; border-color: #00B4D8; box-shadow: 0 0 0 3px rgba(0,180,216,0.1); }
        .button-group { display: flex; gap: 12px; margin-top: 16px; }
        .pay-btn { flex: 1; background: linear-gradient(90deg, #00B4D8, #0077B6); color: #fff; font-weight: 600; border: none; border-radius: 8px; padding: 12px 0; font-size: 1rem; cursor: pointer; transition: all 0.2s ease; }
        .pay-btn:hover { background: linear-gradient(90deg, #0096C7, #005577); transform: translateY(-1px); box-shadow: 0 4px 8px rgba(0,180,216,0.3); }
        .cancel-btn { flex: 1; background: #f8fafc; color: #64748b; font-weight: 500; border: 1px solid #e2e8f0; border-radius: 8px; padding: 12px 0; font-size: 1rem; cursor: pointer; transition: all 0.2s ease; }
        .cancel-btn:hover { background: #f1f5f9; border-color: #cbd5e1; color: #475569; }
      </style>
    </head>
    <body>
      <div class="header-bar">
        <div class="header-left">
          <div class="header-logo"><div class="header-logo-inner">P</div></div>
          <div>
            <div class="header-title">Paymob</div>
            <div class="header-desc">Secure Payment Gateway</div>
          </div>
        </div>
        <div class="header-right">
          <span class="ssl-badge">
            <svg class="lock-icon" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 17a1.5 1.5 0 0 0 1.5-1.5V14a1.5 1.5 0 0 0-3 0v1.5A1.5 1.5 0 0 0 12 17zm6-6V9a6 6 0 1 0-12 0v2a2 2 0 0 0-2 2v7a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-7a2 2 0 0 0-2-2z"/></svg>
            SSL Secured
          </span>
        </div>
      </div>
      <div class="main-content">
        <div class="order-summary">
          <div class="order-summary-title">Order Summary <svg class="lock-icon" fill="none" stroke="#22c55e" stroke-width="2" viewBox="0 0 24 24" style="margin-left:4px;"><path stroke-linecap="round" stroke-linejoin="round" d="M17 9V7a5 5 0 0 0-10 0v2"/><rect width="14" height="10" x="5" y="11" rx="2"/><path d="M12 15v2"/></svg></div>
          <div class="order-summary-row">
            <div>
              <div class="order-plan">${planName} Plan</div>
              <div class="order-period">monthly subscription</div>
            </div>
            <div class="text-right">
              <div class="order-price">${planPrice} EGP</div>
              <div class="order-vat">incl. VAT</div>
            </div>
          </div>
        </div>
        <div class="form-container">
          <form id="pay-form">
            <div class="tabs">
              <div class="tab active" id="tab-card">Card</div>
              <div class="tab" id="tab-wallet">Wallet</div>
              <div class="tab" id="tab-fawry">Fawry</div>
            </div>
            <div id="card-fields">
              <div class="form-group">
                <label class="form-label">Card Number</label>
                <input class="form-input" type="text" maxlength="19" placeholder="1234 5678 9012 3456" required />
              </div>
              <div class="form-group" style="display: flex; gap: 12px;">
                <div style="flex: 1;">
                  <label class="form-label">Expiry Date</label>
                  <input class="form-input" type="text" maxlength="5" placeholder="MM/YY" required />
                </div>
                <div style="flex: 1;">
                  <label class="form-label">CVV</label>
                  <input class="form-input" type="text" maxlength="4" placeholder="CVV" required />
                </div>
              </div>
              <div class="form-group">
                <label class="form-label">Cardholder Name</label>
                <input class="form-input" type="text" placeholder="John Doe" required />
              </div>
            </div>
            <div id="wallet-fields" style="display:none;">
              <div class="form-group">
                <label class="form-label">Mobile Wallet Number</label>
                <input class="form-input" type="text" maxlength="11" placeholder="01XXXXXXXXX" required />
              </div>
            </div>
            <div id="fawry-fields" style="display:none;">
              <div class="form-group">
                <label class="form-label">Fawry Reference Code</label>
                <input class="form-input" type="text" maxlength="10" placeholder="Enter reference code" required />
              </div>
            </div>
            <div class="button-group">
              <button type="button" class="cancel-btn" onclick="window.parent.postMessage({ type: 'PAYMOB_SIMULATE_CANCEL' }, '*')">Cancel</button>
              <button type="submit" class="pay-btn">Pay ${planPrice} EGP</button>
            </div>
          </form>
        </div>
      </div>
      <script>
        // Tab switching
        const tabCard = document.getElementById('tab-card');
        const tabWallet = document.getElementById('tab-wallet');
        const tabFawry = document.getElementById('tab-fawry');
        const cardFields = document.getElementById('card-fields');
        const walletFields = document.getElementById('wallet-fields');
        const fawryFields = document.getElementById('fawry-fields');
        tabCard.onclick = () => {
          tabCard.classList.add('active'); tabWallet.classList.remove('active'); tabFawry.classList.remove('active');
          cardFields.style.display = ''; walletFields.style.display = 'none'; fawryFields.style.display = 'none';
        };
        tabWallet.onclick = () => {
          tabWallet.classList.add('active'); tabCard.classList.remove('active'); tabFawry.classList.remove('active');
          cardFields.style.display = 'none'; walletFields.style.display = ''; fawryFields.style.display = 'none';
        };
        tabFawry.onclick = () => {
          tabFawry.classList.add('active'); tabCard.classList.remove('active'); tabWallet.classList.remove('active');
          cardFields.style.display = 'none'; walletFields.style.display = 'none'; fawryFields.style.display = '';
        };
        // Payment simulation
        document.getElementById('pay-form').onsubmit = function(e) {
          e.preventDefault();
          window.parent.postMessage({ type: 'PAYMOB_SIMULATE_SUCCESS' }, '*');
        };
      </script>
    </body>
    </html>
  `;

  return (
    <iframe
      srcDoc={simulatedIframeHtml}
      width="100%"
      height="560"
      frameBorder="0"
      allow="payment"
      className="rounded-lg shadow-lg border border-gray-200"
      title="Paymob Payment"
      style={{ background: 'transparent' }}
      scrolling="no"
    />
  );
};

export default SimulatedPaymobIframe; 