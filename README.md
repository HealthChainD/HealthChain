# HealthChain

HealthChain is a decentralized platform for storing, managing, and securely sharing medical data as NFTs. Data is encrypted locally on the user's side, stored on IPFS, and access to it is controlled by smart contracts on the Solana blockchain.

## Goal

To give patients complete control over their own medical records without involving centralized healthcare systems. The system allows:

- storing medical data in encrypted form;
- creating NFTs containing links to this data;
- granting doctors or other parties access to view data through smart contracts;
- maintaining a transparent history of access to medical information.

## Technologies

- **Next.js** + **TypeScript** — frontend application
- **Solana** — blockchain for storing NFTs and managing access rights
- **IPFS** — decentralized storage for medical data
- **WebCrypto API** — client-side data encryption
- **Metaplex SDK** — minting NFTs on Solana

## Main Functionality

1.  **Wallet Connection**
    On the main page, the user can connect their Solana wallet via Phantom or other supported adapters.

2.  **Upload and Encryption**
    Data entered into the form is encrypted locally in the browser, and only the encrypted version is uploaded to IPFS.

3.  **NFT Minting**
    After uploading to IPFS, an NFT is created that contains a link to the encrypted data. The NFT is stored in the user's wallet.

4.  **Access Control**
    Future implementation includes the use of smart contracts to grant temporary or permanent access rights to data based on the NFT.

## Installation

```bash
git clone [https://github.com/HealthChainD/HealthChain.git](https://github.com/HealthChainD/HealthChain.git)
cd healthchain
npm install
npm run dev