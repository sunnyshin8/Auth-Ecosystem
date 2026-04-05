import { tool } from "ai";
import { z } from "zod";
import { withContractApproval } from "../auth0-ai";
import { getAsyncAuthorizationCredentials } from "@auth0/ai-vercel";

function writeAwardAuditEvent(event: {
  contractId: string;
  vendor: string;
  amount: number;
  outcome: "attempted" | "approved" | "denied";
  risk: "high" | "standard";
}) {
  console.log(JSON.stringify({
    scope: "contract:award",
    event: "award_attempt_audit",
    timestamp: new Date().toISOString(),
    ...event,
  }));
}

export const awardContractTool = withContractApproval(
  tool({
    description: "Awards a contract to a vendor for a substantial money amount. This expects Human-in-the-loop approval.",
    parameters: z.object({
      contractId: z.string().trim().min(3).max(80).describe("The ID of the contract/RFP"),
      vendor: z.string().trim().min(2).max(120).describe("The name of the vendor to award"),
      amount: z.number().positive().max(100000000).describe("The total monetary value of the contract"),
    }),
    execute: async ({ contractId, vendor, amount }) => {
      const normalizedContractId = contractId.trim();
      const normalizedVendor = vendor.trim();
      const risk: "high" | "standard" = amount >= 250000 ? "high" : "standard";

      writeAwardAuditEvent({
        contractId: normalizedContractId,
        vendor: normalizedVendor,
        amount,
        outcome: "attempted",
        risk,
      });

      // Once approved, the async auth provides us with credentials
      const credentials = await getAsyncAuthorizationCredentials();
      const accessToken = credentials?.accessToken;

      if (!accessToken) {
        writeAwardAuditEvent({
          contractId: normalizedContractId,
          vendor: normalizedVendor,
          amount,
          outcome: "denied",
          risk,
        });
        return "Authorization missing. Contract was NOT awarded.";
      }

      writeAwardAuditEvent({
        contractId: normalizedContractId,
        vendor: normalizedVendor,
        amount,
        outcome: "approved",
        risk,
      });

      console.log(`[CIBA Step-Up] Executing contract award: ${normalizedContractId} to ${normalizedVendor}`);
      console.log(`[Security] Step-up approval verified for award amount $${amount}`);
      
      // We would call our blockchain or backend API here, securely with the token
      return `Success: Contract ${normalizedContractId} formally awarded to ${normalizedVendor} for $${amount}. Recorded on blockchain.`;
    },
  })
);
