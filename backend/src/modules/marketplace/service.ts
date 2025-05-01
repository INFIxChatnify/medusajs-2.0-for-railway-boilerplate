import { MedusaService } from "@medusajs/framework/utils";
import Vendor from "./models/1vendor";
import VendorAdmin from "./models/vendor-admin";

class MarketplaceModuleService extends MedusaService({
  Vendor,
  VendorAdmin,
}) {}

export default MarketplaceModuleService;
