import { carriers, organizations, policies } from "./mockData";

export type Organization = (typeof organizations)[number];
export type Policy = (typeof policies)[number];
export type Carrier = (typeof carriers)[number];

export type ApiResponse<T> = {
  success: boolean;
  data: T;
  errors: string[];
  metadata: {
    tenant_id: string;
    source: "mock-service";
  };
};

export type AppetiteMatch = Carrier & {
  score: number;
  citations: string[];
};

function response<T>(tenantId: string, data: T): ApiResponse<T> {
  return {
    success: true,
    data,
    errors: [],
    metadata: {
      tenant_id: tenantId,
      source: "mock-service",
    },
  };
}

function belongsToTenant<T extends { tenant_id: string }>(tenantId: string, record: T) {
  return record.tenant_id === tenantId;
}

export function listOrganizations() {
  return organizations;
}

export function listPoliciesByTenant(tenantId: string) {
  return response(
    tenantId,
    policies.filter((policy) => belongsToTenant(tenantId, policy))
  );
}

export function findPolicyByNumber(tenantId: string, policyNo: string) {
  const tenantPolicies = listPoliciesByTenant(tenantId).data;
  return response(
    tenantId,
    tenantPolicies.find((policy) => policy.policy_no === policyNo) ?? tenantPolicies[0]
  );
}

export function listCarriersByTenant(tenantId: string) {
  return response(
    tenantId,
    carriers.filter((carrier) => belongsToTenant(tenantId, carrier))
  );
}

export function searchCarrierAppetite(tenantId: string, policy: Policy) {
  const candidateCarriers = listCarriersByTenant(tenantId).data;

  const matches = candidateCarriers
    .map((carrier) => {
      const stateFit = carrier.states.includes(policy.policy_state) ? 35 : 0;
      const classFit = carrier.classes.includes(policy.class_of_business) ? 35 : 0;
      const limitFit = policy.location_limit <= carrier.maxLocationLimit ? 20 : 0;
      const constructionFit = /masonry|non-combustible/i.test(policy.construction_type) ? 10 : 4;

      return {
        ...carrier,
        score: stateFit + classFit + limitFit + constructionFit,
        citations: carrier.documents,
      };
    })
    .filter((carrier) => carrier.score >= 45)
    .sort((first, second) => second.score - first.score);

  return response(tenantId, matches);
}
