import algosdk from 'algosdk';
import { algodClient, getCollegeAdminAccount } from '../config/algorand';
import { config } from '../config/env';
import { ipfsService } from './ipfs.service';

export class NFTService {
  async mintCredentialNFT(params: {
    credentialId: string;
    studentWallet: string;
    degreeName: string;
    graduationYear: number;
    documentCid: string;
    documentHash: string;
  }): Promise<{ assetId: number; txHash: string; metadataCid: string; metadataHash: string }> {

    // Step 1: Create metadata JSON
    const metadata = {
      credential_id: params.credentialId,
      student_wallet: params.studentWallet,
      degree_name: params.degreeName,
      graduation_year: params.graduationYear,
      document_ipfs_cid: params.documentCid,
      document_hash: params.documentHash,
      verified_by: config.collegeAdminWallet,
      issued_at: new Date().toISOString(),
    };

    // Step 2: Upload metadata to IPFS
    const { cid: metadataCid, hash: metadataHash } = await ipfsService.uploadJSON(metadata);

    // Step 3: Get college admin account
    const collegeAdmin = getCollegeAdminAccount();

    // Step 4: Get suggested params
    const suggestedParams = await algodClient.getTransactionParams().do();

    // Step 5: Create ASA
    const hashBytes = Buffer.from(metadataHash, 'hex');
    const metadataHashBuffer = new Uint8Array(32);
    metadataHashBuffer.set(hashBytes.subarray(0, 32));

    const assetCreateTxn = algosdk.makeAssetCreateTxnWithSuggestedParamsFromObject({
      from: collegeAdmin.addr,
      total: 1,
      decimals: 0,
      assetName: params.degreeName.substring(0, 32),
      unitName: 'DEGREE',
      assetURL: `ipfs://${metadataCid}`,
      assetMetadataHash: metadataHashBuffer,
      manager: collegeAdmin.addr,
      reserve: collegeAdmin.addr,
      freeze: collegeAdmin.addr,
      clawback: collegeAdmin.addr,
      defaultFrozen: false,
      suggestedParams,
    });

    // Step 6: Sign and send
    const signedTxn = assetCreateTxn.signTxn(collegeAdmin.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

    // Step 7: Wait for confirmation
    const confirmedTxn = await algosdk.waitForConfirmation(algodClient, txId, 4);
    const assetId = confirmedTxn['asset-index'];

    console.log(`✅ NFT Created: Asset ID ${assetId}`);

    // NFT stays in admin wallet until student claims it
    return {
      assetId,
      txHash: txId,
      metadataCid,
      metadataHash,
    };
  }

  /**
   * Check whether a wallet has opted in to a given ASA.
   * Returns true if the account holds the asset (even with 0 balance).
   */
  async checkOptIn(walletAddress: string, assetId: number): Promise<boolean> {
    try {
      const accountInfo = await algodClient.accountInformation(walletAddress).do();
      const assets: Array<{ 'asset-id': number }> = accountInfo['assets'] ?? [];
      return assets.some((a) => a['asset-id'] === assetId);
    } catch {
      return false;
    }
  }

  async transferNFT(assetId: number, from: string, to: string): Promise<string> {
    const collegeAdmin = getCollegeAdminAccount();
    const suggestedParams = await algodClient.getTransactionParams().do();

    const transferTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
      from: collegeAdmin.addr,
      to,
      amount: 1,
      assetIndex: assetId,
      suggestedParams,
    });

    const signedTxn = transferTxn.signTxn(collegeAdmin.sk);
    const { txId } = await algodClient.sendRawTransaction(signedTxn).do();

    // Wait for confirmation
    await algosdk.waitForConfirmation(algodClient, txId, 4);

    console.log(`✅ NFT Transferred: ${txId}`);

    return txId;
  }
}

export const nftService = new NFTService();
