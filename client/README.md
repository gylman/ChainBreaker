# ChainBreak Client

## How to build
1. Make sure you're in `client/` directory and `npm install` run.
2. Run `npx typechain --target ethers-v6 --out-dir src/abi/types './src/ChainBreak.json'`
3. Run `npm run build` to get the built files in `client/dist` directory.
