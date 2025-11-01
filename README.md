<p align="center">
  <img src="production/loveli-logo.png" alt="Lovtiti Agro Mart Logo" width="200"/>
</p>

# 🌾 Lovtiti Agro Mart

# Track : Onchain Finance And Real-World Assets (RWA)

🔗 **Live Demo**  
<p align="center">
  <strong>🚀 Live Demo</strong><br>
  <a href="https://agro-mart-beta.vercel.app/listings/browse">Browse the Lovtiti Agro Mart Marketplace</a>
</p>



## ❗ Challenge We’re Solving

Across Africa, countless farmers face devastating losses after harvest. Their produce spoils, their livestock is undervalued, and their hard work is often exploited by middlemen. Limited access to fair markets and transparent pricing keeps them trapped in cycles of poverty.

**Lovtiti Agro Mart** is our solution: a decentralized marketplace that connects farmers directly to buyers using Hedera blockchain technology. No middlemen. No guesswork. Just trust, transparency, and fair trade.



## 💔 Why It Matters

In rural communities, the story is heartbreakingly familiar:

- Crops rot because buyers never arrive.
- Livestock is sold at unfair prices just to make ends meet.
- Fishermen return with full nets but no market.
- Beekeepers watch their honey spoil without access to buyers.

These aren’t isolated incidents—they’re daily realities. **Lovtiti Agro Mart** was born from this pain. It’s more than a platform; it’s a movement to restore dignity, income, and control to the people who feed our continent.



## 🌍 Project Vision

Lovtiti Agro Mart is built for every grower, fisher, and keeper across Africa. Whether you’re harvesting cassava or raising catfish, our platform connects you directly to buyers—securely, transparently, and fairly.

Powered by Hedera and guided by our HARAR framework, we bring:

- 📜 **History** of every product
- 📦 **Availability** in real time
- ⭐ **Reviews** from trusted buyers
- ✅ **Authentication** of origin
- 🔔 **Real-time updates** on every transaction

Lovtiti isn’t just tech—it’s empowerment.



## 👥 Team Members

Lovtiti Agro Mart is built by a passionate, cross-functional team committed to transforming agriculture through blockchain:

- **Mary Josephine Gatogoh** — *Team Lead & Project Strategist*  
  Visionary founder driving the project from concept to execution, focused on impact and inclusion.

- **Shia** — *UI/UX Designer*  
  Designs intuitive, culturally resonant interfaces that reflect the soul of African agriculture.

- **Padmore Edusei** — *Frontend Developer*  
  Built the digital storefront using React.js, ensuring smooth user experience and wallet integration.

- **Carita** — *Backend Developer*  
  Engineered the server-side logic and database architecture for secure, scalable performance.

- **Captain AI** — *Backend Developer*  
  Structured routes, authentication, and system stability to support seamless operations.

- **Gurpratap** — *Smart Contract Developer*  
  Developed Hedera-powered smart contracts for secure, traceable, and trust-based transactions.

## 🛠️ Hedera Services Used

Lovtiti Agro Mart leverages Hedera’s distributed ledger technology to ensure secure, traceable, and transparent operations across its decentralized marketplace.
- ✅ Smart Contract Service – Used to manage escrow logic, product authentication, and transaction finality.
- ✅ Token Service (planned) – Will support stablecoin payments and reward mechanisms for farmers. 
- ✅ Consensus Service – Ensures timestamped, immutable records of buyer reviews and product availability  
- ✅ Scheduled Transactions – Enables automated release of funds upon delivery confirmation.  
- ✅ Topic Messaging – Facilitates real-time updates on product status, dispatch, and payment confirmation.


🔁 Hedera Transactions Executed

Our smart contract developer confirmed the following transaction types are actively used in the platform:

- User Creation via Smart Contract  
  Farmers and buyers are registered on-chain using Hedera smart contracts, ensuring identity verification and traceability.

- Financial Transactions for Product Sales  
  Buyers initiate purchases through smart contracts that lock funds in escrow. Upon delivery confirmation, funds are released to the farmer using Scheduled Transactions.

- TopicMessageSubmitTransaction  
  Used to broadcast product availability, dispatch status, and buyer feedback to a Hedera topic. These messages are read by mirror nodes and trigger smart contract actions.

- ContractCallTransaction  
  Executes logic for listing products, verifying delivery, and releasing payments.



🔐 ABFT Implementation

Lovtiti Agro Mart uses Hedera’s Asynchronous Byzantine Fault Tolerance (ABFT) consensus mechanism to ensure:

- Tamper-proof records of every transaction and review.
- Fast finality for escrow releases and product authentication.
- Secure messaging between buyers and sellers via Hedera topics.

This architecture guarantees trust and transparency for all participants in the marketplace. 

🧱 Technical Architecture

Lovtiti Agro Mart is built as a decentralized e-commerce platform that connects African farmers directly to buyers. It uses the Hedera Hashgraph network to ensure secure, traceable, and transparent transactions.
+---------------------+       +---------------------+       +---------------------+
|     Frontend        | <---> |     Backend/API     | <---> |   Hedera Network    |
|  (React + Tailwind) |       |  (Node.js + Express)|       | (Smart Contracts +  |
|                     |       |                     |       |  Consensus Service) |
+---------------------+       +---------------------+       +---------------------+

        ↑                          ↑                          ↑
        |                          |                          |
        |                          |                          |
+---------------------+       +---------------------+       +---------------------+
|   Neon Database     |       |  HashPack Wallet    |       |  Mirror Node        |
| (User profiles,     |       | (User auth &        |       | (Transaction logs,  |
|  listings, reviews) |       |  payment signing)   |       |  topic messages)    |
+---------------------+       +---------------------+       +---------------------+


## 🔗 Hedera SDK/API

- JavaScript SDK (`hedera-sdk-js`)


## 🌐 Network

- Deployed on **Hedera Testnet**


## 🔐 Smart Contract Details

- **Contract Address:** `0.0.7008432`  
- **ABI:** [View ABI](./contracts/abi.json)

## 🔐 How HARAR & HBAR Power Every Transaction

Let’s walk through a real example:

**Buyer:** Amina  
**Seller:** Kofi (Tomato Farmer)

### 🅷 History  
Amina sees the full lifecycle of Kofi’s tomatoes—harvest date, handling, and past transactions—anchored immutably on Hedera.

### 🅰 Availability  
Real-time inventory shows how many crates are ready. Updates are logged using HBAR microtransactions.

### 🆁 Reviews  
Amina reads feedback from other buyers. Each review is timestamped and stored on-chain for transparency.

### 🅰 Authentication  
Kofi’s tomatoes carry a digital certificate verified by Lovtiti’s smart contract—ensuring origin and quality.

### 🆁 Real-Time Updates  
Amina receives live notifications: payment confirmation, dispatch time, and delivery tracking—all recorded on Hedera.



## 💸 Role of HBAR in Lovtiti Agro Mart

- 💰 **Transaction Fees**: Every blockchain action is powered by HBAR.
- ⚙️ **Smart Contract Execution**: HARAR logic runs on Hedera, secured by HBAR.
- 🔒 **Security & Speed**: Fast, low-cost, and reliable—perfect for micro-payments in agriculture.



## 🧠 Database Architecture

- **MongoDB** stores:
  - User profiles
  - Product listings
  - Transaction logs
  - Buyer reviews



## 📍 Target Users

- Smallholder farmers across Africa  
- Local cooperatives and agricultural networks  
- Buyers seeking traceable, ethically sourced produce

---

## 🧪 Getting Started

# Install dependencies
npm install

# Start the development server
npm run dev

## 📂 Submission Assets

- 🎯 [Pitch Deck – Lovtiti Agro Mart](https://gamma.app/docs/Lovtiti-Agro-Mart-vcws1ek15xfd6cx)
- ✅ [Certification – Hedera Hashgraph](https://claim.hashgraphdev.com/certification?oneTimeCode=6054cfa3-833d-11f0-95ff-c9277d9399ff)
```bash



