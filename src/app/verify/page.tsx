'use client';

import { useState } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';

interface Credential {
  degree_name: string;
  graduation_year: number;
  asset_id: number;
  issued_tx_hash: string;
}

interface VerificationResult {
  verified: boolean;
  credentials: Credential[];
}

interface FilteredStudent {
  wallet: string;
  degree_name: string;
  graduation_year: number;
}

export default function VerifyPage() {
  const [walletAddress, setWalletAddress] = useState('');
  const [verificationResult, setVerificationResult] = useState<VerificationResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [degreeName, setDegreeName] = useState('');
  const [graduationYear, setGraduationYear] = useState('');
  const [filteredStudents, setFilteredStudents] = useState<FilteredStudent[]>([]);
  const [filterLoading, setFilterLoading] = useState(false);
  const [filterError, setFilterError] = useState('');

  const handleVerify = async () => {
    if (!walletAddress.trim()) {
      setError('Please enter a wallet address');
      return;
    }

    setLoading(true);
    setError('');
    setVerificationResult(null);

    try {
      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/integration/verify/${walletAddress}`
      );

      if (!response.ok) {
        throw new Error('Failed to verify credentials');
      }

      const data = await response.json();
      setVerificationResult(data);
    } catch (err: any) {
      setError(err.message || 'Failed to verify credentials');
    } finally {
      setLoading(false);
    }
  };

  const handleFilter = async () => {
    setFilterLoading(true);
    setFilterError('');
    setFilteredStudents([]);

    try {
      const body: any = {};
      if (degreeName.trim()) body.degree_name = degreeName.trim();
      if (graduationYear.trim()) body.graduation_year = parseInt(graduationYear);

      const response = await fetch(
        `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/integration/filter`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(body),
        }
      );

      if (!response.ok) {
        throw new Error('Failed to filter students');
      }

      const data = await response.json();
      setFilteredStudents(data);
    } catch (err: any) {
      setFilterError(err.message || 'Failed to filter students');
    } finally {
      setFilterLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 p-8">
      <div className="max-w-6xl mx-auto space-y-8">
        <div className="text-center">
          <h1 className="text-4xl font-bold text-gray-900 mb-2">
            Credential Verification Portal
          </h1>
          <p className="text-gray-600">
            For Scholarship DAOs, Hiring Companies & Hackathon Organizers
          </p>
        </div>

        <div className="grid md:grid-cols-2 gap-8">
          {/* Verify Student by Wallet */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Verify Student Credentials</h2>
            <p className="text-sm text-gray-600 mb-6">
              Check if a student has approved NFT credentials by their wallet address
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="wallet">Wallet Address</Label>
                <Input
                  id="wallet"
                  placeholder="Enter Algorand wallet address"
                  value={walletAddress}
                  onChange={(e) => setWalletAddress(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && handleVerify()}
                />
              </div>

              <Button
                onClick={handleVerify}
                disabled={loading}
                className="w-full"
              >
                {loading ? 'Verifying...' : 'Verify Credentials'}
              </Button>

              {error && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {error}
                </div>
              )}

              {verificationResult && (
                <div className="mt-4 space-y-3">
                  {verificationResult.verified ? (
                    <div className="p-4 bg-green-50 border border-green-200 rounded">
                      <div className="flex items-center gap-2 mb-3">
                        <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                        <span className="font-semibold text-green-800">
                          Verified Student
                        </span>
                      </div>

                      <div className="space-y-3">
                        {verificationResult.credentials.map((cred, idx) => (
                          <div
                            key={idx}
                            className="bg-white p-3 rounded border border-green-100"
                          >
                            <div className="grid grid-cols-2 gap-2 text-sm">
                              <div>
                                <span className="text-gray-600">Degree:</span>
                                <p className="font-medium">{cred.degree_name}</p>
                              </div>
                              <div>
                                <span className="text-gray-600">Year:</span>
                                <p className="font-medium">{cred.graduation_year}</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-600">Asset ID:</span>
                                <p className="font-mono text-xs">{cred.asset_id}</p>
                              </div>
                              <div className="col-span-2">
                                <span className="text-gray-600">TX Hash:</span>
                                <p className="font-mono text-xs break-all">
                                  {cred.issued_tx_hash}
                                </p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div className="p-4 bg-yellow-50 border border-yellow-200 rounded">
                      <div className="flex items-center gap-2">
                        <div className="w-3 h-3 bg-yellow-500 rounded-full"></div>
                        <span className="font-semibold text-yellow-800">
                          No Verified Credentials Found
                        </span>
                      </div>
                      <p className="text-sm text-yellow-700 mt-2">
                        This wallet does not have any approved credentials.
                      </p>
                    </div>
                  )}
                </div>
              )}
            </div>
          </Card>

          {/* Filter Eligible Students */}
          <Card className="p-6">
            <h2 className="text-2xl font-bold mb-4">Filter Eligible Students</h2>
            <p className="text-sm text-gray-600 mb-6">
              Find verified students by degree and graduation year
            </p>

            <div className="space-y-4">
              <div>
                <Label htmlFor="degree">Degree Name (Optional)</Label>
                <Input
                  id="degree"
                  placeholder="e.g., Computer Science"
                  value={degreeName}
                  onChange={(e) => setDegreeName(e.target.value)}
                />
              </div>

              <div>
                <Label htmlFor="year">Graduation Year (Optional)</Label>
                <Input
                  id="year"
                  type="number"
                  placeholder="e.g., 2024"
                  value={graduationYear}
                  onChange={(e) => setGraduationYear(e.target.value)}
                />
              </div>

              <Button
                onClick={handleFilter}
                disabled={filterLoading}
                className="w-full"
              >
                {filterLoading ? 'Searching...' : 'Search Students'}
              </Button>

              {filterError && (
                <div className="p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
                  {filterError}
                </div>
              )}

              {filteredStudents.length > 0 && (
                <div className="mt-4">
                  <div className="flex items-center justify-between mb-3">
                    <span className="font-semibold text-gray-700">
                      Found {filteredStudents.length} student(s)
                    </span>
                  </div>

                  <div className="space-y-2 max-h-96 overflow-y-auto">
                    {filteredStudents.map((student, idx) => (
                      <div
                        key={idx}
                        className="bg-white p-3 rounded border border-gray-200 hover:border-blue-300 transition-colors"
                      >
                        <div className="space-y-1 text-sm">
                          <div>
                            <span className="text-gray-600">Wallet:</span>
                            <p className="font-mono text-xs break-all">
                              {student.wallet}
                            </p>
                          </div>
                          <div className="flex gap-4">
                            <div>
                              <span className="text-gray-600">Degree:</span>
                              <p className="font-medium">{student.degree_name}</p>
                            </div>
                            <div>
                              <span className="text-gray-600">Year:</span>
                              <p className="font-medium">{student.graduation_year}</p>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {filteredStudents.length === 0 && !filterLoading && !filterError && (
                <div className="text-center text-gray-500 text-sm py-4">
                  No results yet. Use filters to search for verified students.
                </div>
              )}
            </div>
          </Card>
        </div>

        {/* API Documentation */}
        <Card className="p-6 bg-gray-50">
          <h3 className="text-xl font-bold mb-4">API Integration</h3>
          <div className="space-y-4 text-sm">
            <div>
              <p className="font-semibold mb-2">Verify Endpoint:</p>
              <code className="block bg-white p-2 rounded border">
                GET {process.env.NEXT_PUBLIC_BACKEND_URL}/api/integration/verify/:wallet
              </code>
            </div>
            <div>
              <p className="font-semibold mb-2">Filter Endpoint:</p>
              <code className="block bg-white p-2 rounded border">
                POST {process.env.NEXT_PUBLIC_BACKEND_URL}/api/integration/filter
              </code>
            </div>
            <div className="pt-2 border-t">
              <p className="text-gray-600">
                These endpoints are public and do not require authentication.
                Perfect for integrating with scholarship platforms, hiring portals, and hackathon registration systems.
              </p>
            </div>
          </div>
        </Card>
      </div>
    </div>
  );
}
