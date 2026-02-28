'use client';

import { useWalletContext } from '@/contexts/WalletContext';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { WalletConnect } from '@/components/WalletConnect';
import { Shield, GraduationCap, Mail, MessageSquare, BookOpen, ExternalLink, Code } from 'lucide-react';

// Mock data for alumni since we are transitioning the backend
const ALUMNI_DATA = [
    {
        id: 1,
        name: "Alex Thompson",
        wallet: "A7B8C9...X1Y2Z3",
        degree: "B.S. Computer Science",
        year: 2023,
        expertise: ["Blockchain Engineering", "Smart Contracts", "Algorand"],
        status: "Senior Engineer at AlgoTech",
        offering: "Mentorship & Technical Guidance"
    },
    {
        id: 2,
        name: "Sarah Chen",
        wallet: "D4E5F6...W4V5U6",
        degree: "B.S. Software Engineering",
        year: 2022,
        expertise: ["Frontend Development", "React/Next.js", "UI/UX"],
        status: "Lead Developer at Web3 Innovations",
        offering: "Career Advice & Portfolio Review"
    },
    {
        id: 3,
        name: "Marcus Johnson",
        wallet: "G1H2I3...T7S8R9",
        degree: "M.S. Cybersecurity",
        year: 2023,
        expertise: ["Web3 Security", "Smart Contract Auditing", "Cryptography"],
        status: "Security Auditor",
        offering: "Technical Interviews & Security Guidance"
    }
];

export default function AlumniPage() {
    const { isConnected } = useWalletContext();

    if (!isConnected) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Card className="w-full max-w-md shadow-xl border-t-4 border-t-indigo-600">
                    <CardHeader className="text-center">
                        <div className="mx-auto bg-indigo-100 p-3 rounded-full w-16 h-16 flex items-center justify-center mb-4">
                            <GraduationCap className="h-8 w-8 text-indigo-600" />
                        </div>
                        <CardTitle className="text-2xl font-bold text-gray-900">Alumni Network</CardTitle>
                        <CardDescription className="text-gray-600 mt-2">
                            Connect your wallet to access the exclusive alumni directory and mentorship network.
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="flex justify-center pb-8">
                        <WalletConnect />
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            <nav className="border-b bg-white shadow-sm sticky top-0 z-10">
                <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                    <div className="flex items-center gap-2">
                        <Shield className="h-6 w-6 text-indigo-600" />
                        <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-indigo-600 to-blue-600">
                            CredChain - Alumni Network
                        </span>
                    </div>
                    <div className="flex items-center gap-4">
                        <Button variant="ghost" asChild>
                            <a href="/">Home</a>
                        </Button>
                        <Button variant="ghost" asChild>
                            <a href="/student">My Profile</a>
                        </Button>
                        <WalletConnect />
                    </div>
                </div>
            </nav>

            <main className="container mx-auto px-4 py-8 max-w-6xl">
                <div className="mb-8 text-center space-y-4">
                    <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">
                        Connect with our <span className="text-indigo-600">Alumni</span>
                    </h1>
                    <p className="text-xl text-gray-600 max-w-3xl mx-auto">
                        Get guidance, tech advice, and career support from verified graduates who have been in your shoes.
                    </p>
                </div>

                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {ALUMNI_DATA.map((alumnus) => (
                        <Card key={alumnus.id} className="border-none shadow-lg hover:shadow-xl transition-shadow duration-300 overflow-hidden group">
                            <div className="h-2 bg-gradient-to-r from-indigo-500 to-blue-500"></div>
                            <CardHeader className="pb-4">
                                <div className="flex justify-between items-start">
                                    <div>
                                        <CardTitle className="text-2xl font-bold text-gray-900">{alumnus.name}</CardTitle>
                                        <p className="text-sm font-medium text-indigo-600 mt-1">{alumnus.degree} '{alumnus.year.toString().slice(-2)}</p>
                                    </div>
                                    <div className="bg-indigo-50 p-2 rounded-full">
                                        <GraduationCap className="h-5 w-5 text-indigo-600" />
                                    </div>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-4">
                                <div className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg border border-gray-100">
                                    <span className="font-semibold block mb-1 text-gray-700">Current Role:</span>
                                    {alumnus.status}
                                </div>

                                <div>
                                    <span className="font-semibold text-sm text-gray-700 block mb-2 flex items-center gap-1">
                                        <Code className="h-4 w-4" /> Technical Expertise
                                    </span>
                                    <div className="flex flex-wrap gap-2">
                                        {alumnus.expertise.map((skill, idx) => (
                                            <span key={idx} className="bg-blue-50 text-blue-700 text-xs px-2 py-1 rounded-full font-medium border border-blue-100">
                                                {skill}
                                            </span>
                                        ))}
                                    </div>
                                </div>

                                <div className="pt-4 border-t border-gray-100">
                                    <span className="font-semibold text-sm text-gray-700 block mb-2 flex items-center gap-1">
                                        <BookOpen className="h-4 w-4" /> Offering
                                    </span>
                                    <p className="text-sm text-gray-600 italic">"{alumnus.offering}"</p>
                                </div>

                                <div className="flex gap-2 pt-2 mt-4">
                                    <Button className="flex-1 bg-indigo-600 hover:bg-indigo-700 gap-2">
                                        <MessageSquare className="h-4 w-4" /> Connect
                                    </Button>
                                    <Button variant="outline" className="flex-1 gap-2 border-indigo-200 text-indigo-700 hover:bg-indigo-50">
                                        <ExternalLink className="h-4 w-4" /> View NFT
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            </main>
        </div>
    );
}
