import { createAssociatedTokenAccountInstruction, createInitializeMetadataPointerInstruction, createInitializeMintInstruction, createMintToInstruction, ExtensionType, getAssociatedTokenAddressSync, getMintLen, LENGTH_SIZE, TOKEN_2022_PROGRAM_ID, TYPE_SIZE } from "@solana/spl-token";
import { useConnection, useWallet } from "@solana/wallet-adapter-react";
import { Keypair, SystemProgram, Transaction } from "@solana/web3.js";
import { useState } from "react"
import { createInitializeInstruction, pack } from "@solana/spl-token-metadata" // add this package for metadata

function TokenLaunchPad() {

    
    const [formData, setFormData] = useState({
        name: "",
        symbol: "",
        supply: "",
        img: "",
    });

    const { connection } = useConnection();
    const wallet = useWallet();

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { id, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [id]: value,
        }));
    }

    async function createToken() {

        if(!wallet.publicKey){
            throw new Error("Wallet not connected");
        }

        const mintKeypair = Keypair.generate();

        // adding metadata
        const metaData = {
            mint: mintKeypair.publicKey,
            name: formData.name,
            symbol: formData.symbol,
            uri: formData.img,
            additionalMetadata: []
        }

        const mintLen = getMintLen([ExtensionType.MetadataPointer]);
        const metadataLen = TYPE_SIZE + LENGTH_SIZE + pack(metaData).length;

        const lamports = await connection.getMinimumBalanceForRentExemption(mintLen + metadataLen);

        const transaction = new Transaction().add(
            SystemProgram.createAccount({
                fromPubkey: wallet.publicKey,
                newAccountPubkey: mintKeypair.publicKey,
                space: mintLen,
                lamports,
                programId: TOKEN_2022_PROGRAM_ID,
            }),
            createInitializeMetadataPointerInstruction(mintKeypair.publicKey, wallet.publicKey, mintKeypair.publicKey, TOKEN_2022_PROGRAM_ID),
            createInitializeMintInstruction(mintKeypair.publicKey, 9, wallet.publicKey, null, TOKEN_2022_PROGRAM_ID),
            createInitializeInstruction({
                programId: TOKEN_2022_PROGRAM_ID,
                mint: mintKeypair.publicKey,
                metadata: mintKeypair.publicKey,
                name: metaData.name,
                symbol: metaData.symbol,
                uri: metaData.uri,
                mintAuthority: wallet.publicKey,
                updateAuthority: wallet.publicKey   
            })
        );
            
        transaction.feePayer = wallet.publicKey;
        transaction.recentBlockhash = (await connection.getLatestBlockhash()).blockhash;
        // Partial sign with mint keypair
        transaction.partialSign(mintKeypair);
        // Send transaction
        const txSignature = await wallet.sendTransaction(transaction, connection);
        console.log(`Token mint created at ${mintKeypair.publicKey.toBase58()}`);
        console.log(`Transaction signature: ${txSignature}`);

        // create an ata
        const associatedToken = getAssociatedTokenAddressSync(
            mintKeypair.publicKey,
            wallet.publicKey,
            false,
            TOKEN_2022_PROGRAM_ID,
        );

        console.log(associatedToken.toBase58());

        const transaction2 = new Transaction().add(
            createAssociatedTokenAccountInstruction(
                wallet.publicKey,
                associatedToken,
                wallet.publicKey,
                mintKeypair.publicKey,
                TOKEN_2022_PROGRAM_ID,
            ),
        );

        await wallet.sendTransaction(transaction2, connection);

        const transaction3 = new Transaction().add(
            createMintToInstruction(mintKeypair.publicKey, associatedToken, wallet.publicKey, Number(formData.supply), [], TOKEN_2022_PROGRAM_ID)
        );

        await wallet.sendTransaction(transaction3, connection);

        console.log("Minted!")
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        // console.log("Form Data: ", formData);
        await createToken();
    }

    return (
        <div className="flex flex-col items-center gap-1.5 mt-3">
            <div>
                <h1 className="text-2xl">Enter your Token Details</h1>
            </div>
            <div className="flex flex-col">
                <div className="w-3xl mx-auto bg-white rounded-lg shadow-lg p-6 space-y-4">
                    {/* Name */}
                    <div>
                        <label htmlFor="name" className="block text-gray-700 font-medium mb-1">
                        Name:
                        </label>
                        <input
                        type="text"
                        id="name"
                        value={formData.name}
                        placeholder="Enter token name"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Symbol */}
                    <div>
                        <label htmlFor="symbol" className="block text-gray-700 font-medium mb-1">
                        Symbol:
                        </label>
                        <input
                        type="text"
                        id="symbol"
                        value={formData.symbol}
                        placeholder="Enter token symbol"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Initial Supply */}
                    <div>
                        <label htmlFor="supply" className="block text-gray-700 font-medium mb-1">
                        Initial Supply:
                        </label>
                        <input
                        type="number"
                        id="supply"
                        value={formData.supply}
                        placeholder="Enter initial supply"
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Image URL */}
                    <div>
                        <label htmlFor="img" className="block text-gray-700 font-medium mb-1">
                        Image URL:
                        </label>
                        <input
                        type="text"
                        id="img"
                        value={formData.img}
                        placeholder="Enter image URL"
                        onChange={handleChange}
                        onPaste={(e) => {
                            const paste = e.clipboardData.getData("text");
                            setFormData(prev => ({ ...prev, img: paste }));
                        }}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500"
                        />
                    </div>

                    {/* Submit Button */}
                    <button
                        type="submit"
                        onClick={handleSubmit}
                        className="w-full bg-purple-600 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-md transition duration-200"
                    >
                        Create Token
                    </button>
                    </div>
            </div>
        </div>
    )
}

export default TokenLaunchPad
