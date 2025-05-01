import {
  createWorkflow,
  WorkflowResponse,
  createStep,
  StepResponse,
} from "@medusajs/framework/workflows-sdk";
import { Modules, MedusaError } from "@medusajs/framework/utils";
import { MedusaRequest } from "@medusajs/framework/http";
import { AuthenticationInput } from "@medusajs/framework/types";

type WorkflowInput = {
  req: MedusaRequest;
};

const authenticateUserStep = createStep(
  "authenticate-user",
  async ({ req }: WorkflowInput, { container }) => {
    const authModuleService = container.resolve(Modules.AUTH);

    const { success, authIdentity, error } =
      await authModuleService.validateCallback("my-auth", {
        url: req.url,
        headers: req.headers,
        query: req.query,
        body: req.body,
        protocol: req.protocol,
        authScope: "admin", // or custom actor type
      } as AuthenticationInput);

    if (!success) {
      // incorrect authentication details
      throw new MedusaError(
        MedusaError.Types.UNAUTHORIZED,
        error || "Incorrect authentication details"
      );
    }
    console.log(success, authIdentity, error);

    return new StepResponse({ authIdentity }, authIdentity?.id);
  }
  //   async (authIdentityId, { container }) => {
  //     if (!authIdentityId) {
  //       return;
  //     }

  //     const authModuleService = container.resolve(Modules.AUTH);

  //     await authModuleService.deleteAuthIdentities([authIdentityId]);
  //   }
);

export const authenticateUserWorkflow = createWorkflow(
  "authenticate-user",
  (input: WorkflowInput) => {
    const { authIdentity } = authenticateUserStep(input);

    return new WorkflowResponse({
      authIdentity,
    });
  }
);
