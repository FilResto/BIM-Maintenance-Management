# Ethereum BIM Asset Management Project

This project combines Building Information Modeling (BIM) with blockchain technology for asset management, maintenance tracking, and payment processing.

## Setup Instructions

### 1. Environment Configuration

Before running the project, you need to set up the environment files with your actual API keys and private keys:

#### Backend Environment
```bash
cp backend/.env.template backend/.env
```
Edit `backend/.env` and replace all placeholder values with your actual:
- Database URLs
- Infura/Alchemy API keys  
- Private keys (use testnet keys only)
- Contract addresses

#### Scripts Environment  
```bash
cp scripts/.env.template scripts/.env
```
Edit `scripts/.env` and replace all placeholder values with your actual:
- RPC URLs with your API keys
- Deployer private keys (use testnet keys only)
- API keys for Infura, Alchemy, Etherscan

#### Frontend Configuration
```bash
cp frontend/src/config.template.js frontend/src/config.js
```
Edit `frontend/src/config.js` and replace all placeholder values with your actual:
- Contract addresses after deployment
- Infura API keys
- Private keys for testing (use testnet keys only)

### 2. Installation & Running

🎯 Steps\
1️⃣ Deploy the smart constracts on sepholia with npx hardhat run scripts/deploy.js --network sepolia or on Amoy with npx hardhat run scripts/deploy.js --network Amoy\
2️⃣ Open 2 terminals\
3️⃣ In the first one go inside /backend folder and run nodemon server.js\
4️⃣ IN the second one go inside /frontend folder and run npm start\
5️⃣ Open the browser on http://localhost:3000\
