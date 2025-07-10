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

🎯 Riepilogo Finale\
1️⃣ Avvia la blockchain locale (npx hardhat node) ➡ lascia aperto il terminale.\
2️⃣ Deploya lo smart contract (npx hardhat run scripts/deploy.js --network localhost) e copia l’indirizzo.\
3️⃣ Aggiorna server.py con l’indirizzo del contratto e l’ABI.\
4️⃣ Avvia il backend (python -m uvicorn server:app --reload).\
5️⃣ Avvia il frontend (npm start).\
6️⃣ Apri il browser su http://localhost:3000\

ora per deployare lo smart contract su sepolia npx hardhat run scripts/deploy.js --network sepolia