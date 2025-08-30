# Deployment Checklist for MonadPe

## ✅ Pre-deployment Requirements

### Smart Contract Deployment
- [ ] Deploy PaymentReceiver contract to Monad Testnet
- [ ] Verify contract on Monad Explorer
- [ ] Update contract address in environment variables
- [ ] Test contract functions (pay with ETH/MON and ERC20 tokens)

### Environment Configuration
- [ ] Set up Vercel project
- [ ] Configure environment variables in Vercel:
  - `NEXT_PUBLIC_WALLETCONNECT_ID`
  - `NEXT_PUBLIC_CONTRACT_ADDRESS` 
  - `NEXT_PUBLIC_NETWORK_MODE=production`
  - `NEXT_PUBLIC_APP_URL=https://monadpe.vercel.app`

### Frontend Testing
- [ ] Test wallet connection (MetaMask, WalletConnect)
- [ ] Test network switching to Monad Testnet
- [ ] Test payment link generation
- [ ] Test QR code generation and download
- [ ] Test payment flow end-to-end
- [ ] Test responsive design on mobile
- [ ] Test error handling scenarios

### Production Readiness
- [ ] Remove console.log statements
- [ ] Optimize images and assets
- [ ] Test with Monad Testnet tokens
- [ ] Verify all external links work
- [ ] Test with low/no balance scenarios

## 🚀 Deployment Steps

### 1. Smart Contract to Monad Testnet

```bash
cd contract
# Configure hardhat.config.cjs with Monad Testnet
npx hardhat ignition deploy ./ignition/modules/PaymentReciever.js --network monadTestnet
```

### 2. Vercel Deployment

```bash
# Install Vercel CLI
npm i -g vercel

# Deploy
cd client
vercel --prod
```

### 3. Post-deployment Verification

- [ ] Test live application at https://monadpe.vercel.app/
- [ ] Verify wallet connections work
- [ ] Test payment creation and execution
- [ ] Check all pages load correctly
- [ ] Verify QR codes generate properly

## 🔧 Configuration Files Updated

- ✅ `client/src/app/config.ts` - Network configuration
- ✅ `client/src/app/contracts.ts` - Contract addresses and ABIs  
- ✅ `client/src/components/WalletOptions.tsx` - Auto network switching
- ✅ `client/src/app/dashboard/page.tsx` - Network validation
- ✅ `client/src/app/pay/[id]/page.tsx` - Payment processing
- ✅ `client/.env.local` - Environment variables
- ✅ `client/.env.example` - Example configuration

## 📱 Key Features Implemented

- ✅ Wallet connection with MetaMask and WalletConnect
- ✅ Automatic network switching to appropriate chain
- ✅ Payment link generation with UUID
- ✅ QR code generation with download capability
- ✅ Support for ETH, MON, USDC, USDT payments
- ✅ Responsive mobile-first design
- ✅ Error handling and user feedback
- ✅ Payment status tracking
- ✅ Clean and intuitive UI/UX

## 🧪 Testing Scenarios

### Merchant Flow
1. Connect wallet → Should auto-switch to correct network
2. Create payment link → Should generate unique link and QR
3. Copy/share link → Should work on mobile and desktop

### Customer Flow  
1. Open payment link → Should show payment details
2. Connect wallet → Should prompt network switch if needed
3. Execute payment → Should process transaction and show success

### Error Cases
1. Wrong network → Should prompt to switch
2. Insufficient balance → Should show appropriate error
3. Transaction rejection → Should handle gracefully
4. Invalid payment link → Should show not found page

## 📊 Analytics & Monitoring

Consider adding:
- [ ] Payment success/failure tracking
- [ ] User engagement metrics
- [ ] Error monitoring (Sentry)
- [ ] Performance monitoring

## 🔐 Security Considerations

- ✅ No private keys stored
- ✅ Client-side only wallet interactions
- ✅ Proper input validation
- ✅ Secure random payment ID generation
- ✅ Environment variable protection
