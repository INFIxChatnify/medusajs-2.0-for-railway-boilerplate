import {
  // other imports...
  createWorkflow,
  WorkflowResponse,
} from "@medusajs/framework/workflows-sdk";
import { createStep, StepResponse } from "@medusajs/framework/workflows-sdk";
import { MedusaRequest } from "@medusajs/framework/http";
import { Modules, MedusaError } from "@medusajs/framework/utils";
import { AuthenticationInput } from "@medusajs/framework/types";

type WorkflowInput = {
  url: String;
  headers: MedusaRequest;
  query: String;
  body: String;
  protocol: String;
};

const authenticateUserStep = createStep(
  "qwe",
  async (
    { url, headers, query, body, protocol }: WorkflowInput,
    { container }
  ) => {
    const authModuleService = container.resolve(Modules.AUTH);

    const data: any = {
      url: url || "",
      headers: headers || {},
      query: typeof query === "string" ? JSON.parse(query) : query || {},
      body: body || "",
      protocol: protocol || "",
    };
    const { success, authIdentity, error } =
      await authModuleService.validateCallback("my-auth", data);
    console.log(success, authIdentity, error);

    if (!success) {
      // incorrect authentication details
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        error || "Incorrect authentication details"
      );
    }

    return new StepResponse({ authIdentity }, authIdentity?.id);
  },
  async (authIdentityId, { container }) => {
    if (!authIdentityId) {
      return;
    }

    const authModuleService = container.resolve(Modules.AUTH);

    await authModuleService.deleteAuthIdentities([authIdentityId]);
  }
);

export const authenticateUserWorkflow = createWorkflow(
  "qwe",
  (input: WorkflowInput) => {
    const { authIdentity } = authenticateUserStep(input);

    return new WorkflowResponse({
      authIdentity,
    });
  }
);
