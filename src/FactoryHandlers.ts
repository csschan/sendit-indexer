import {
  StableFactory_TokenCreated_handler,
} from "../generated/src/Handlers.gen";

// Handle TokenCreated events from SenditTokenFactory
StableFactory_TokenCreated_handler(({ event, context }) => {
  context.Token.set({
    id: event.params.token.toLowerCase(),
    address: event.params.token.toLowerCase(),
    creator: event.params.creator.toLowerCase(),
    name: event.params.name,
    symbol: event.params.symbol,
    imageURI: event.params.imageURI,
    pool: event.params.pool.toLowerCase(),
    chainId: event.chainId,
    supply: event.params.supply,
    createdAt: event.blockTimestamp,
    createdBlock: event.blockNumber,
  });

  // Initialize pool entity with token mapping
  context.LiquidityPool.set({
    id: event.params.pool.toLowerCase(),
    token: event.params.token.toLowerCase(),
    chainId: event.chainId,
    tick: 0n,
    cumulativeVolume0: 0n,
    cumulativeVolume1: 0n,
    swapCount: 0,
    lastPrice: 0n,
    lastUpdateTimestamp: BigInt(event.blockTimestamp),
    lastUpdateBlock: BigInt(event.blockNumber),
  });
});
