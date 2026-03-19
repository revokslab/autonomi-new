# Testing (Solana-only)

## Automated (unit)

Run:

```bash
cd apps/web
bun test
```

## Manual smoke (mainnet)

- Log in via Privy and confirm an **embedded Solana** wallet was created.
- Go to **Dashboard → Deposit**:
  - Copy address works
  - QR renders
  - Explorer link opens
  - “Buy SOL” opens MoonPay flow (via Privy)
- Go to **Dashboard → Withdraw**:
  - Enter a valid recipient + small SOL amount
  - Approve in Privy modal
  - Signature shows and explorer link opens

