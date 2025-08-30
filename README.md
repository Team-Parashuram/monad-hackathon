# 🚀 MonadPe - Web3 Payments Made Simple

<div align="center">

![MonadPe Logo](https://img.shields.io/badge/MonadPe-Web3%20Payments-orange?style=for-the-badge&logo=ethereum)

**Lightning-fast crypto payments on the Monad blockchain**

[![Live Demo](https://img.shields.io/badge/🌐%20Live%20Demo-Visit%20App-blue?style=for-the-badge)](https://monadpe.vercel.app/)
[![GitHub](https://img.shields.io/badge/GitHub-Repository-black?style=for-the-badge&logo=github)](https://github.com/Team-Parashuram/monad-hackathon)

</div>

---

## 📖 Overview

MonadPe revolutionizes crypto payments by making them as simple as sharing a link. Built on the high-performance Monad blockchain, MonadPe enables merchants to generate instant payment links and accept cryptocurrencies with zero coding required.

### 🎯 Key Features

- **🔗 Instant Payment Links** - Generate payment links in seconds
- **📱 QR Code Integration** - Mobile-friendly QR code payments
- **⚡ Lightning Fast** - Built on Monad's high-performance EVM
- **🎨 Professional UI** - Clean, modern interface with dark/light themes
- **🔒 Secure** - Non-custodial, direct wallet-to-wallet transfers
- **💰 Multi-Token Support** - ETH, MON, USDC, USDT support
- **📊 Dashboard Analytics** - Track payments and transaction history

---

## 🛠️ Technology Stack

### Frontend
- **Framework**: Next.js 15.5.2 with TypeScript
- **Styling**: Tailwind CSS with professional design system
- **UI Components**: Lucide React icons, Shadcn/ui
- **Wallet Integration**: Wagmi, Viem
- **Theme**: Next-themes for dark/light mode

### Blockchain
- **Network**: Monad Testnet
- **Smart Contracts**: Solidity
- **Development**: Hardhat
- **Libraries**: OpenZeppelin

### Deployment
- **Frontend**: Vercel
- **Smart Contracts**: Monad Testnet

---

## 🚀 Quick Start

### Prerequisites

- Node.js 18+ 
- npm or yarn
- MetaMask or compatible Web3 wallet

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/Team-Parashuram/monad-hackathon.git
   cd monad-hackathon
   ```

2. **Install dependencies**
   ```bash
   # Frontend
   cd client
   npm install
   
   # Smart Contracts
   cd ../contract
   npm install
   ```

3. **Environment Setup**
   ```bash
   # Copy environment file
   cp .env.example .env.local
   
   # Add your configuration
   NEXT_PUBLIC_NETWORK_MODE=development
   ```

4. **Run the application**
   ```bash
   cd client
   npm run dev
   ```

5. **Visit the app**
   ```
   http://localhost:3001
   ```

---

## 💳 How It Works

### For Merchants

1. **Connect Wallet** - Connect your MetaMask or compatible wallet
2. **Generate Link** - Specify amount and token type
3. **Share Payment** - Send the generated link or QR code to customers
4. **Receive Payments** - Funds are sent directly to your wallet

### For Customers

1. **Click Link** - Open the payment link on any device
2. **Connect Wallet** - Connect wallet to complete payment
3. **Confirm Transaction** - Review and confirm the payment
4. **Payment Complete** - Transaction is processed on Monad blockchain

---

## 🏗️ Project Structure

```
monad-hackathon/
├── client/                 # Next.js frontend application
│   ├── src/
│   │   ├── app/           # App router pages
│   │   ├── components/    # Reusable UI components
│   │   ├── hooks/         # Custom React hooks
│   │   └── lib/           # Utility functions
│   ├── public/            # Static assets
│   └── package.json
├── contract/              # Smart contracts
│   ├── contracts/         # Solidity contracts
│   ├── scripts/           # Deployment scripts
│   ├── test/              # Contract tests
│   └── hardhat.config.cjs
└── README.md
```

---

## 🎨 Features Showcase

### Professional Design System
- **Orange/Yellow Theme** - Professional color scheme for light/dark modes
- **Responsive Design** - Mobile-first approach with perfect desktop experience
- **Clean Typography** - Professional fonts and spacing
- **Intuitive UX** - Streamlined user experience for crypto payments

### Smart Contract Integration
- **Payment Receiver Contract** - Secure payment processing
- **Multi-token Support** - ERC-20 token compatibility
- **Gas Optimization** - Efficient contract design
- **Event Logging** - Complete payment tracking

### Advanced Features
- **QR Code Generation** - Instant mobile payment support
- **Payment History** - Track all transactions
- **Network Auto-switching** - Seamless Monad testnet connection
- **Error Handling** - Comprehensive error management

---

## 🔧 Development

### Smart Contract Development

```bash
cd contract

# Compile contracts
npx hardhat compile

# Run tests
npx hardhat test

# Deploy to testnet
npx hardhat run scripts/deploy.js --network monad-testnet
```

### Frontend Development

```bash
cd client

# Development server
npm run dev

# Build for production
npm run build

# Run production build
npm start
```

---

## 🌐 Deployment

### Frontend (Vercel)
1. Connect repository to Vercel
2. Configure environment variables
3. Deploy automatically on push

### Smart Contracts (Monad Testnet)
1. Configure network in hardhat.config.cjs
2. Add private key and RPC URL
3. Deploy using Hardhat scripts

---

## 🛡️ Security Features

- **Non-custodial** - Users maintain full control of funds
- **Smart Contract Audited** - Secure payment processing
- **Frontend Security** - XSS protection and secure coding practices
- **Wallet Integration** - Industry-standard wallet connections

---

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## � License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## 👥 Team

**Team Parashuram**
- Professional blockchain developers
- UI/UX design specialists  
- Smart contract security experts

---

## 🔗 Links

- **Live Application**: [https://monadpe.vercel.app/](https://monadpe.vercel.app/)
- **GitHub Repository**: [https://github.com/Team-Parashuram/monad-hackathon](https://github.com/Team-Parashuram/monad-hackathon)
- **Monad Network**: [https://monad.xyz/](https://monad.xyz/)

---

## ⚡ Why Monad?

MonadPe leverages Monad's high-performance EVM to provide:
- **10,000+ TPS** - Lightning-fast transaction processing
- **Low Fees** - Cost-effective payments for merchants and customers
- **EVM Compatibility** - Seamless integration with existing Ethereum tools
- **Developer-Friendly** - Easy deployment and development experience

---

<div align="center">

**Built with ❤️ for the Monad ecosystem**

[![Monad](https://img.shields.io/badge/Built%20on-Monad-yellow?style=for-the-badge)](https://monad.xyz/)

</div>