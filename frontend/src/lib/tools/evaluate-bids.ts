import { tool } from "ai";
import { z } from "zod";
import { withBackendAPI, getAgentAccessToken } from "../auth0-ai";

export const evaluateBidsTool = withBackendAPI(
  tool({
    description: "Evaluates the submitted bids for a specific RFP.",
    parameters: z.object({
      rfpId: z.string().describe("The ID of the Request for Proposal (RFP) to evaluate"),
    }),
    execute: async ({ rfpId }) => {
      // In a real scenario, this would call the backend evaluation endpoint
      // using the access token from Token Vault.
      try {
        const accessToken = await getAgentAccessToken();
        console.log(`[Token Vault] Authorized call to evaluate bids for ${rfpId}`);
        
        // Mocking the backend call for now
        // const response = await fetch(`http://localhost:5000/api/bids/rfp/${rfpId}/analyze`, {
        //   headers: { Authorization: `Bearer ${accessToken}` }
        // });
        
        return {
          status: "success",
          evaluation: `Successfully analyzed bids for RFP ${rfpId}. The top vendor is 'CloudSecure Inc' with a score of 95/100.`
        };
      } catch (error: any) {
        return { status: "error", message: "Failed to evaluate bids due to authorization or backend error" };
      }
    },
  })
);
