'use client';

import { useWalletContext } from '@/contexts/WalletContext';
import { Button } from './ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Wallet, LogOut } from 'lucide-react';
import NeoButton from './ui/NeoButton';

export function WalletConnect() {
  const { activeAddress, isConnected, connectWallet, disconnectWallet } = useWalletContext();

  const handleConnect = async () => {
    try {
      await connectWallet();
    } catch (error) {
      console.error('Failed to connect:', error);
    }
  };

  const handleDisconnect = async () => {
    try {
      await disconnectWallet();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    }
  };

  if (isConnected && activeAddress) {
    return (
      <DropdownMenu>
        <DropdownMenuTrigger asChild>
          <div>
            <NeoButton hoverText="Wallet" className="scale-90 origin-right">
              <Wallet className="h-4 w-4" />
              {activeAddress.slice(0, 6)}...{activeAddress.slice(-4)}
            </NeoButton>
          </div>
        </DropdownMenuTrigger>
        <DropdownMenuContent align="end" className="bg-black border-white/10 text-white">
          <DropdownMenuItem onClick={handleDisconnect} className="gap-2 cursor-pointer hover:bg-white hover:text-black">
            <LogOut className="h-4 w-4" />
            Disconnect
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>
    );
  }

  return (
    <NeoButton
      onClick={handleConnect}
      hoverText="Connect"
    >
      <Wallet className="h-4 w-4" />
      Connect Wallet
    </NeoButton>
  );
}
