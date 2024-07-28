// src/nftService.js
import { sdk } from './uniqueSdk';

export const getNftBalances = async (address) => {
  try {
    const { address, availableBalance, lockedBalance, freeBalance } = await sdk.balance.get({ address });
    return { availableBalance, lockedBalance, freeBalance };
  } catch (error) {
    console.error("Failed to fetch NFT balances:", error);
    return { success: false, error: error.message };
  }
};

export const mintAndTransferNFTs = async (addresses) => {
  try {
    // Create a new collection
    const { parsed: collectionData, error: collectionError } = await sdk.collection.create.submitWaitResult({
      name: "Test collection",
      description: "NFT for winners",
      tokenPrefix: "WIN",
    });

    if (collectionError) throw new Error("Error occurred while creating a collection");
    if (!collectionData) throw new Error("Cannot parse collection creation results");

    const { collectionId } = collectionData;

    // Mint a new NFT in the created collection
    const { parsed: tokenData, error: tokenError } = await sdk.token.create.submitWaitResult({
      collectionId,
    });

    if (tokenError) throw new Error("Error occurred while creating a token");
    if (!tokenData) throw new Error("Cannot parse token creation results");

    const { tokenId } = tokenData;

    // Transfer the NFT to each address
    await Promise.all(
      addresses.map(address => sdk.token.transfer.submitWaitResult({
        collectionId,
        tokenId,
        to: address,
      }))
    );

    return { success: true, collectionId, tokenId };
  } catch (error) {
    console.error("Failed to mint and transfer NFT:", error);
    return { success: false, error: error.message };
  }
};