'use client';

import { useState } from 'react';
import { useWalletContext } from '@/contexts/WalletContext';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { WalletConnect } from '@/components/WalletConnect';
import { uploadCredential, getMyRequests, getPendingClaims, claimCredential } from '@/lib/api';
import { useToast } from '@/hooks/use-toast';
import { Shield, Upload, CheckCircle, XCircle, Clock, ExternalLink, Gift } from 'lucide-react';
import algosdk from 'algosdk';

// Algorand testnet node for sending opt-in transactions
const algodClient = new algosdk.Algodv2(
  '',
  'https://testnet-api.algonode.cloud',
  443
);

export default function StudentPage() {
  const { activeAddress, isConnected, signTransactions } = useWalletContext();
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const [credentialId, setCredentialId] = useState('');
  const [degreeName, setDegreeName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [file, setFile] = useState<File | null>(null);

  const { data: requests, isLoading } = useQuery({
    queryKey: ['my-requests', activeAddress],
    queryFn: () => getMyRequests(activeAddress!),
    enabled: !!activeAddress && isConnected,
  });

  // Fetch MINTED credentials that need to be claimed
  const { data: pendingClaims, isLoading: claimsLoading } = useQuery({
    queryKey: ['pending-claims', activeAddress],
    queryFn: () => getPendingClaims(activeAddress!),
    enabled: !!activeAddress && isConnected,
    refetchInterval: 10000, // Poll every 10s for new minted NFTs
  });

  const uploadMutation = useMutation({
    mutationFn: async () => {
      if (!file || !activeAddress) throw new Error('Missing data');

      const formData = new FormData();
      formData.append('credential_id', credentialId);
      formData.append('degree_name', degreeName);
      formData.append('graduation_year', graduationYear);
      formData.append('document', file);

      return uploadCredential(formData, activeAddress);
    },
    onSuccess: () => {
      toast({ title: 'Success', description: 'Credential request submitted!' });
      setCredentialId('');
      setDegreeName('');
      setGraduationYear('');
      setFile(null);
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Error', description: error.message, variant: 'destructive' });
    },
  });

  // One-click claim: opt-in to ASA + call backend to transfer
  const claimMutation = useMutation({
    mutationFn: async ({ requestId, assetId }: { requestId: string; assetId: number }) => {
      if (!activeAddress) throw new Error('Wallet not connected');

      // Step 1: Build opt-in transaction (0-amount self-transfer)
      const suggestedParams = await algodClient.getTransactionParams().do();
      const optInTxn = algosdk.makeAssetTransferTxnWithSuggestedParamsFromObject({
        from: activeAddress,
        to: activeAddress,
        amount: 0,
        assetIndex: assetId,
        suggestedParams,
      });

      // Step 2: Sign with Lute wallet
      const signedTxns = await signTransactions([optInTxn]);

      // Step 3: Send opt-in transaction to Algorand
      await algodClient.sendRawTransaction(signedTxns[0]).do();
      await algosdk.waitForConfirmation(algodClient, optInTxn.txID(), 4);

      // Step 4: Call backend to transfer the NFT
      return claimCredential(requestId, activeAddress);
    },
    onSuccess: (data) => {
      toast({
        title: '🎉 NFT Claimed!',
        description: `Credential NFT (Asset ID: ${data.assetId}) has been transferred to your wallet.`,
      });
      queryClient.invalidateQueries({ queryKey: ['pending-claims'] });
      queryClient.invalidateQueries({ queryKey: ['my-requests'] });
    },
    onError: (error: Error) => {
      toast({ title: 'Claim Failed', description: error.message, variant: 'destructive' });
    },
  });

  if (!isConnected) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Connect Wallet</CardTitle>
          </CardHeader>
          <CardContent>
            <WalletConnect />
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <nav className="border-b bg-white shadow-sm">
        <div className="container mx-auto px-4 py-4 flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Shield className="h-6 w-6 text-blue-600" />
            <span className="text-xl font-bold">CredChain - Student</span>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <a href="/">Home</a>
            </Button>
            <Button variant="ghost" className="text-indigo-600 font-medium bg-indigo-50 hover:bg-indigo-100" asChild>
              <a href="/alumni">Alumni Network</a>
            </Button>
            <WalletConnect />
          </div>
        </div>
      </nav>

      <main className="container mx-auto px-4 py-8">
        {/* Pending Claims Banner */}
        {pendingClaims?.data?.length > 0 && (
          <Card className="mb-8 border-2 border-amber-400 bg-amber-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-amber-800">
                <Gift className="h-5 w-5" />
                Pending NFT Claims ({pendingClaims.data.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-sm text-amber-700 mb-4">
                Your credentials have been approved! Click &quot;Claim NFT&quot; to opt-in and receive your credential NFT in one step.
              </p>
              <div className="space-y-3">
                {pendingClaims.data.map((claim: any) => (
                  <div key={claim.id} className="flex items-center justify-between p-4 bg-white rounded-lg border border-amber-200">
                    <div>
                      <p className="font-semibold text-gray-900">{claim.degree_name}</p>
                      <p className="text-sm text-gray-500">ID: {claim.credential_id}</p>
                      {claim.credentials?.[0] && (
                        <p className="text-xs text-gray-400 font-mono mt-1">
                          Asset ID: {claim.credentials[0].nft_asset_id}
                        </p>
                      )}
                    </div>
                    <Button
                      onClick={() => claimMutation.mutate({
                        requestId: claim.id,
                        assetId: claim.credentials?.[0]?.nft_asset_id,
                      })}
                      disabled={claimMutation.isPending}
                      className="bg-amber-600 hover:bg-amber-700 text-white"
                    >
                      <Gift className="h-4 w-4 mr-2" />
                      {claimMutation.isPending ? 'Claiming...' : 'Claim NFT'}
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        )}

        <div className="grid lg:grid-cols-2 gap-8">
          {/* Upload Form */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                Submit Credential Request
              </CardTitle>
            </CardHeader>
            <CardContent>
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  uploadMutation.mutate();
                }}
                className="space-y-4"
              >
                <div>
                  <Label htmlFor="credentialId">Credential ID</Label>
                  <Input
                    id="credentialId"
                    value={credentialId}
                    onChange={(e) => setCredentialId(e.target.value)}
                    placeholder="e.g., CRED-2024-001"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="degreeName">Degree Name</Label>
                  <Input
                    id="degreeName"
                    value={degreeName}
                    onChange={(e) => setDegreeName(e.target.value)}
                    placeholder="e.g., Bachelor of Science"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="graduationYear">Graduation Year</Label>
                  <Input
                    id="graduationYear"
                    type="number"
                    value={graduationYear}
                    onChange={(e) => setGraduationYear(e.target.value)}
                    placeholder="e.g., 2024"
                    required
                  />
                </div>

                <div>
                  <Label htmlFor="document">Document (PDF)</Label>
                  <Input
                    id="document"
                    type="file"
                    accept=".pdf"
                    onChange={(e) => setFile(e.target.files?.[0] || null)}
                    required
                  />
                </div>

                <Button type="submit" className="w-full" disabled={uploadMutation.isPending}>
                  {uploadMutation.isPending ? 'Uploading...' : 'Submit Request'}
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* My Requests */}
          <Card>
            <CardHeader>
              <CardTitle>My Requests</CardTitle>
            </CardHeader>
            <CardContent>
              {isLoading ? (
                <p className="text-gray-500">Loading...</p>
              ) : requests?.data?.length === 0 ? (
                <p className="text-gray-500">No requests yet</p>
              ) : (
                <div className="space-y-4">
                  {requests?.data?.map((req: any) => (
                    <Card key={req.id} className="border-2">
                      <CardContent className="pt-6">
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <p className="text-xl font-bold text-gray-900 border-b-2 border-blue-500 inline-block pb-1">
                              {req.degree_name}
                            </p>
                            <p className="text-sm text-gray-500 mt-2">ID: {req.credential_id}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            {req.status === 'PENDING' && (
                              <>
                                <Clock className="h-4 w-4 text-yellow-600" />
                                <span className="text-sm text-yellow-600">Pending</span>
                              </>
                            )}
                            {req.status === 'MINTED' && (
                              <>
                                <Gift className="h-4 w-4 text-amber-600" />
                                <span className="text-sm text-amber-600">Ready to Claim</span>
                              </>
                            )}
                            {req.status === 'APPROVED' && (
                              <>
                                <CheckCircle className="h-4 w-4 text-green-600" />
                                <span className="text-sm text-green-600">Approved</span>
                              </>
                            )}
                            {req.status === 'REJECTED' && (
                              <>
                                <XCircle className="h-4 w-4 text-red-600" />
                                <span className="text-sm text-red-600">Rejected</span>
                              </>
                            )}
                          </div>
                        </div>

                        {req.credentials?.[0] && (
                          <div className="mt-4 p-4 bg-green-50 rounded-lg space-y-2 border border-green-200">
                            <p className="text-sm font-semibold text-green-900 flex items-center gap-2">
                              <Shield className="h-4 w-4" />
                              Secured as NFT on Algorand
                            </p>
                            <div className="space-y-1">
                              <p className="text-xs text-gray-600 flex justify-between">
                                <span className="font-medium">Asset ID:</span>
                                <span className="font-mono">{req.credentials[0].nft_asset_id}</span>
                              </p>
                              {req.credentials[0].issued_tx_hash && (
                                <p className="text-xs text-gray-600 flex justify-between">
                                  <span className="font-medium">Transaction:</span>
                                  <span className="font-mono" title={req.credentials[0].issued_tx_hash}>
                                    {req.credentials[0].issued_tx_hash.slice(0, 12)}...{req.credentials[0].issued_tx_hash.slice(-12)}
                                  </span>
                                </p>
                              )}
                            </div>
                            <div className="pt-2 flex gap-4">
                              <a
                                href={`https://testnet.algoexplorer.io/asset/${req.credentials[0].nft_asset_id}`}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-xs text-blue-600 hover:underline flex items-center gap-1 font-medium bg-blue-50 px-2 py-1 rounded"
                              >
                                View Asset <ExternalLink className="h-3 w-3" />
                              </a>
                              {req.credentials[0].issued_tx_hash && (
                                <a
                                  href={`https://testnet.algoexplorer.io/tx/${req.credentials[0].issued_tx_hash}`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="text-xs text-indigo-600 hover:underline flex items-center gap-1 font-medium bg-indigo-50 px-2 py-1 rounded"
                                >
                                  Tx details <ExternalLink className="h-3 w-3" />
                                </a>
                              )}
                            </div>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
}
