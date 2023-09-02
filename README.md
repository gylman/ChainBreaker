# ChainBreak

## How to build

1. Follow [Chain README](chain/README.md) to build and deploy smart contracts.
2. Copy `chain/artifacts/contracts/ChainBreak.sol/ChainBreak.json` to `client/src/ChainBreak.json`.
3. Set `VITE_CHAINBREAK_ADDRESS` env variable in `client/.env` to be the address received after the deployment.
4. Follow [Client README](client/README.md) to build the frontend app.
