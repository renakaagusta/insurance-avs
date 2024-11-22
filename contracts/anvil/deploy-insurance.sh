#!/usr/bin/env bash

RPC_URL=https://eth.renakaagusta.dev
PRIVATE_KEY=0xac0974bec39a17e36ba4a6b4d238ff944bacb478cbed5efcae784d7bf4f2ff80

# cd to the directory of this script so that this can be run from anywhere
parent_path=$(
    cd "$(dirname "${BASH_SOURCE[0]}")"
    pwd -P
)
cd "$parent_path"

cd ../

forge script script/InsuranceDeployer.s.sol --rpc-url https://eth.renakaagusta.dev --broadcast