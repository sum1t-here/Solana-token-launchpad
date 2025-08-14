import { WalletDisconnectButton, WalletMultiButton } from '@solana/wallet-adapter-react-ui'

function Header() {
    return (
        <nav className="flex justify-between items-center px-3 py-2.5 gap-1.5 bg-gray-300 shadow-md">
            <h1 className="text-3xl font-bold ml-0.5">Solana Token Launchpad</h1>
            <div className="flex gap-0.5">
                <WalletMultiButton/>
                <WalletDisconnectButton/>
            </div>
        </nav>
)}

export default Header
