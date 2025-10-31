#!/bin/bash
# ================================================
# Hedera Contract Caller (Foundry + Hashio RPC)
# ================================================

# Load environment variables from .env if exists
if [ -f .env ]; then
  export $(grep -v '^#' .env | xargs)
fi

# Ensure required vars
: "${RPC_URL:?Need RPC_URL in .env}"
: "${PRIVATE_KEY:?Need PRIVATE_KEY in .env}"
: "${CHAIN_ID:?Need CHAIN_ID in .env}"
: "${CONTRACT:?Need CONTRACT=0xYourContractAddress in .env}"

# Check if cast is installed
if ! command -v cast &> /dev/null; then
  echo "❌ Foundry (cast) not found."
  echo "👉 Install with: curl -L https://foundry.paradigm.xyz | bash && foundryup"
  exit 1
fi

echo "✅ Foundry detected."
echo "🔗 Using RPC: $RPC_URL"
echo "🏦 Using Contract: $CONTRACT"
echo

# Ask user for function name
read -rp "Enter function name (e.g. donate or getBalance): " FUNC

# Ask for inputs (optional)
read -rp "Enter function inputs (space-separated, or leave blank): " ARGS

# Ask if payable
read -rp "Is this function payable? (y/n): " PAYABLE
VALUE_ARG=""

if [[ "$PAYABLE" =~ ^[Yy]$ ]]; then
  read -rp "Enter amount of HBAR to send (e.g. 0.1): " AMOUNT
  VALUE_ARG="--value ${AMOUNT}ether"
fi

# Ask if it’s read-only
read -rp "Is this a view/pure function? (y/n): " READONLY

echo
echo "🚀 Executing..."

if [[ "$READONLY" =~ ^[Yy]$ ]]; then
  # Read-only call
  cast call "$CONTRACT" "${FUNC}(${ARGS})" \
    --rpc-url "$RPC_URL"
else
  # State-changing send
  cast send "$CONTRACT" "${FUNC}(${ARGS})" \
    $VALUE_ARG \
    --private-key "$PRIVATE_KEY" \
    --rpc-url "$RPC_URL" \
    --chain "$CHAIN_ID" \
    --gas-limit 350000
fi

echo "✅ Done."
