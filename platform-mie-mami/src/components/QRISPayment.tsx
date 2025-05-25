import React, { useState, useEffect } from 'react';
import QRCode from 'qrcode';

interface QRISPaymentProps {
  amount: number;
  orderId: string;
  onPaymentSuccess: () => void;
  onPaymentCancel: () => void;
}

function QRISPayment({ amount, orderId, onPaymentSuccess, onPaymentCancel }: QRISPaymentProps) {
  const [paymentStatus, setPaymentStatus] = useState<'pending' | 'processing' | 'success' | 'failed'>('pending');
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes countdown
  const [qrisCode, setQrisCode] = useState('');
  const [qrCodeDataURL, setQrCodeDataURL] = useState('');

  // Generate QRIS code (in real implementation, this would come from payment gateway)
  useEffect(() => {
    // Simulate QRIS code generation
    const generateQRIS = async () => {
      // In real implementation, you would call your payment gateway API
      // For demo purposes, we'll generate a mock QRIS string
      const merchantId = "ID1234567890";
      const terminalId = "T001";
      const timestamp = Date.now();
      const mockQRIS = `00020101021226580014ID.CO.QRIS.WWW0118${merchantId}0303UMI51440014ID.DANA.WWW0118${merchantId}520454995303360540${amount.toFixed(2)}5802ID5914Mie Mami Store6007Jakarta61051234062070703${terminalId}630${timestamp.toString().slice(-4)}`;
      setQrisCode(mockQRIS);

      // Generate QR code image
      try {
        const qrDataURL = await QRCode.toDataURL(mockQRIS, {
          width: 200,
          margin: 2,
          color: {
            dark: '#000000',
            light: '#FFFFFF'
          }
        });
        setQrCodeDataURL(qrDataURL);
      } catch (error) {
        console.error('Error generating QR code:', error);
      }
    };

    generateQRIS();
  }, [amount]);

  // Countdown timer
  useEffect(() => {
    if (timeLeft > 0 && paymentStatus === 'pending') {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0) {
      setPaymentStatus('failed');
    }
  }, [timeLeft, paymentStatus]);

  // Simulate payment checking (in real implementation, you'd poll your backend)
  useEffect(() => {
    if (paymentStatus === 'processing') {
      const checkPayment = setTimeout(() => {
        // Simulate random success/failure for demo
        const isSuccess = Math.random() > 0.2; // 80% success rate
        if (isSuccess) {
          setPaymentStatus('success');
          setTimeout(onPaymentSuccess, 1000);
        } else {
          setPaymentStatus('failed');
        }
      }, 3000);

      return () => clearTimeout(checkPayment);
    }
  }, [paymentStatus, onPaymentSuccess]);

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const handleSimulatePayment = () => {
    setPaymentStatus('processing');
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-lg max-w-md w-full p-6">
        <div className="text-center">
          <h2 className="text-xl font-bold mb-4">QRIS Payment</h2>

          {paymentStatus === 'pending' && (
            <>
              <div className="mb-4">
                <div className="bg-gray-100 p-4 rounded-lg mb-4">
                  {qrCodeDataURL ? (
                    <img
                      src={qrCodeDataURL}
                      alt="QRIS Code"
                      className="mx-auto mb-2"
                    />
                  ) : (
                    <div className="w-[200px] h-[200px] bg-gray-300 mx-auto mb-2 flex items-center justify-center">
                      <span className="text-gray-500">Generating QR...</span>
                    </div>
                  )}
                  <p className="text-sm text-gray-600">Scan QR code with your e-wallet app</p>
                </div>

                <div className="text-lg font-semibold text-[#E64516] mb-2">
                  Rp {amount.toLocaleString()}
                </div>

                <div className="text-sm text-gray-600 mb-4">
                  Order ID: {orderId}
                </div>

                <div className="text-sm text-red-600 mb-4">
                  Time remaining: {formatTime(timeLeft)}
                </div>

                <div className="text-xs text-gray-500 mb-4">
                  Supported e-wallets: Dana, OVO, GoPay, LinkAja, ShopeePay
                </div>
              </div>

              <div className="flex space-x-3">
                <button
                  onClick={onPaymentCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSimulatePayment}
                  className="flex-1 bg-[#441E1B] hover:bg-[#5a2826] text-white py-2 px-4 rounded-md transition-colors"
                >
                  Simulate Payment
                </button>
              </div>
            </>
          )}

          {paymentStatus === 'processing' && (
            <div className="py-8">
              <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-[#441E1B] mx-auto mb-4"></div>
              <p className="text-lg font-medium">Processing Payment...</p>
              <p className="text-sm text-gray-600">Please wait while we verify your payment</p>
            </div>
          )}

          {paymentStatus === 'success' && (
            <div className="py-8">
              <div className="text-green-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-medium text-green-600">Payment Successful!</p>
              <p className="text-sm text-gray-600">Your order has been confirmed</p>
            </div>
          )}

          {paymentStatus === 'failed' && (
            <div className="py-8">
              <div className="text-red-500 mb-4">
                <svg className="w-16 h-16 mx-auto" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <p className="text-lg font-medium text-red-600">Payment Failed</p>
              <p className="text-sm text-gray-600 mb-4">
                {timeLeft === 0 ? 'Payment time expired' : 'Payment could not be processed'}
              </p>
              <div className="flex space-x-3">
                <button
                  onClick={onPaymentCancel}
                  className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-800 py-2 px-4 rounded-md transition-colors"
                >
                  Close
                </button>
                <button
                  onClick={() => {
                    setPaymentStatus('pending');
                    setTimeLeft(300);
                  }}
                  className="flex-1 bg-[#441E1B] hover:bg-[#5a2826] text-white py-2 px-4 rounded-md transition-colors"
                >
                  Try Again
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default QRISPayment;
