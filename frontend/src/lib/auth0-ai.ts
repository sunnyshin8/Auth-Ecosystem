import { Auth0AI, getAccessTokenFromTokenVault } from "@auth0/ai-vercel";
import { AccessDeniedInterrupt } from "@auth0/ai/interrupts";
import { getRefreshToken, getUser } from "./auth0";

const auth0AI = new Auth0AI();
const HIGH_RISK_AWARD_THRESHOLD = 250000;

// Exchange token via Token Vault
export const getAgentAccessToken = async () => getAccessTokenFromTokenVault();

// Token Vault: Used to call external/partner APIs on behalf of user
export const withBackendAPI = auth0AI.withTokenVault({
  connection: "procurement-api", // The API connection configured in Token Vault
  scopes: ["read:bids", "write:evaluations"],
  refreshToken: getRefreshToken,
});

// Step-Up Auth (CIBA): Used for high-stakes actions like awarding contracts
export const withContractApproval = auth0AI.withAsyncAuthorization({
  userID: async () => {
    const user = await getUser();
    return user?.sub as string;
  },
  bindingMessage: async ({ contractId, amount }) => {
    const riskLabel = amount >= HIGH_RISK_AWARD_THRESHOLD ? "HIGH RISK" : "standard risk";
    return `Approve ${riskLabel} contract award for ${contractId} with value $${amount}?`;
  },
  scopes: ["openid", "contract:award"], 
  audience: process.env.AUTH0_AUDIENCE!,
  onAuthorizationRequest: "interrupt", // UI interruption mode
  onUnauthorized: async (e: Error) => {
    if (e instanceof AccessDeniedInterrupt) {
      return "The user rejected the authorization request.";
    }
    return `Authorization error: ${e.message}`;
  },
});
