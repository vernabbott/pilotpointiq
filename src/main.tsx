import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  ClipboardCheck,
  Database,
  FileSearch,
  LayoutDashboard,
  Search,
  ShieldCheck,
  Sparkles,
} from "lucide-react";
import {
  findPolicyByNumber,
  listOrganizations,
  listPoliciesByTenant,
  searchCarrierAppetite,
  type AppetiteMatch,
  type Policy,
} from "./services";
import { policyInsightConfigs } from "./mockData";
import "./styles.css";

type PageId = "accounts" | "policy" | "appetite";
type AiState = "idle" | "searching" | "complete";

const today = new Date();
const organizations = listOrganizations();

const navItems = [
  { id: "accounts", label: "Accounts", icon: LayoutDashboard },
  { id: "policy", label: "Policy Insights", icon: FileSearch },
  { id: "appetite", label: "Appetite Search", icon: Sparkles },
] as const;

function daysToTerm(termDate: string) {
  const term = new Date(`${termDate}T00:00:00`);
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((term.getTime() - current.getTime()) / 86400000);
}

function formatDate(value: string) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatCurrency(value: number) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getByPath(source: Record<string, unknown>, path: string): unknown {
  return path.split(".").reduce<unknown>((value, key) => {
    if (!value || typeof value !== "object") {
      return undefined;
    }

    return (value as Record<string, unknown>)[key];
  }, source);
}

function formatFieldValue(policy: Policy, field: { key: string; format?: string }) {
  const value = getByPath(policy as unknown as Record<string, unknown>, field.key);

  if (value === undefined || value === null || value === "") {
    return "Not captured";
  }

  if (field.format === "currency" && typeof value === "number") {
    return formatCurrency(value);
  }

  if (field.format === "date" && typeof value === "string") {
    return formatDate(value);
  }

  if (field.format === "yesNo") {
    return value ? "Yes" : "No";
  }

  if (field.format === "list" && Array.isArray(value)) {
    return value.join(", ");
  }

  return String(value);
}

function Header({
  activePage,
  setActivePage,
  tenantId,
  setTenantId,
}: {
  activePage: PageId;
  setActivePage: (page: PageId) => void;
  tenantId: string;
  setTenantId: (tenantId: string) => void;
}) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark">
          <ShieldCheck size={22} />
        </div>
        <div>
          <p>Multi-tenant Underwriting Intelligence</p>
          <h1>Pilot Point IQ</h1>
        </div>
      </div>
      <nav className="nav-tabs" aria-label="Primary navigation">
        {navItems.map((item) => {
          const Icon = item.icon;
          return (
            <button
              className={activePage === item.id ? "nav-tab active" : "nav-tab"}
              key={item.id}
              onClick={() => setActivePage(item.id)}
              type="button"
            >
              <Icon size={18} />
              <span>{item.label}</span>
            </button>
          );
        })}
      </nav>
      <label className="tenant-picker">
        <span>Organization</span>
        <select value={tenantId} onChange={(event) => setTenantId(event.target.value)}>
          {organizations.map((organization) => (
            <option key={organization.id} value={organization.id}>
              {organization.name}
            </option>
          ))}
        </select>
      </label>
    </header>
  );
}

function AccountInsights({
  policies,
  selectedPolicyNo,
  setSelectedPolicyNo,
  setActivePage,
}: {
  policies: Policy[];
  selectedPolicyNo: string;
  setSelectedPolicyNo: (policyNo: string) => void;
  setActivePage: (page: PageId) => void;
}) {
  return (
    <main className="page-shell">
      <section className="page-title-row">
        <div>
          <p className="eyebrow">Carrier intelligence module</p>
          <h2>Account Insights</h2>
        </div>
        <div className="metric-strip">
          <div>
            <span>{policies.length}</span>
            <p>Tenant policies</p>
          </div>
          <div>
            <span>{policies.filter((policy) => daysToTerm(policy.term_dt) <= 90).length}</span>
            <p>Terms inside 90 days</p>
          </div>
          <div>
            <span>
              {formatCurrency(policies.reduce((total, policy) => total + policy.location_limit, 0))}
            </span>
            <p>Total location limit</p>
          </div>
        </div>
      </section>

      <section className="table-panel" aria-label="Policy list">
        <div className="panel-toolbar">
          <div className="search-box">
            <Database size={17} />
            <span>Tenant-scoped policy portfolio</span>
          </div>
          <span className="as-of">As of {formatDate(today.toISOString().slice(0, 10))}</span>
        </div>
        <div className="table-scroll">
          <table>
            <thead>
              <tr>
                <th>Customer</th>
                <th>Policy No.</th>
                <th>State</th>
                <th>Effective</th>
                <th>Term</th>
                <th>Days to Term</th>
                <th aria-label="Action"></th>
              </tr>
            </thead>
            <tbody>
              {policies.map((policy) => (
                <tr
                  className={policy.policy_no === selectedPolicyNo ? "selected" : ""}
                  key={policy.policy_no}
                >
                  <td>{policy.customer_nm}</td>
                  <td>{policy.policy_no}</td>
                  <td>{policy.policy_state}</td>
                  <td>{formatDate(policy.effective_dt)}</td>
                  <td>{formatDate(policy.term_dt)}</td>
                  <td>
                    <span className={daysToTerm(policy.term_dt) <= 90 ? "term-pill urgent" : "term-pill"}>
                      {daysToTerm(policy.term_dt)}
                    </span>
                  </td>
                  <td>
                    <button
                      className="icon-action"
                      onClick={() => {
                        setSelectedPolicyNo(policy.policy_no);
                        setActivePage("policy");
                      }}
                      title="Open Policy Insights"
                      type="button"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </main>
  );
}

function DetailItem({ label, value }: { label: string; value: string | number }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SupplementField({ label, value }: { label: string; value: string }) {
  return (
    <div className="supplement-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProductQuestionnaire({
  config,
  policy,
}: {
  config: (typeof policyInsightConfigs)[keyof typeof policyInsightConfigs] | undefined;
  policy: Policy;
}) {
  if (!config) {
    return null;
  }

  return (
    <div className="questionnaire-panel">
      <div className="panel-heading">
        <ClipboardCheck size={20} />
        <div>
          <h3>{config.title}</h3>
          <p>{config.subtitle}</p>
        </div>
      </div>

      <section className="questionnaire-section">
        <h4>Required Attachments</h4>
        <div className="attachment-list">
          {config.requiredAttachments.map((attachment) => (
            <span key={attachment}>{attachment}</span>
          ))}
        </div>
      </section>

      {config.sections.map((section) => (
        <section className="questionnaire-section" key={section.title}>
          <h4>{section.title}</h4>
          <div className="supplement-grid">
            {section.fields.map((field) => (
              <SupplementField
                key={field.key}
                label={field.label}
                value={formatFieldValue(policy, field)}
              />
            ))}
          </div>
        </section>
      ))}

      <section className="questionnaire-section knockout-section">
        <div className="knockout-heading">
          <AlertTriangle size={18} />
          <h4>Prequalification Knockouts</h4>
          <span className={policy.prequalificationClear ? "status-pill clear" : "status-pill blocked"}>
            {policy.prequalificationClear ? "None indicated" : "Review required"}
          </span>
        </div>
        <ul>
          {config.knockoutItems.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      </section>

      <section className="questionnaire-section loss-section">
        <h4>Loss History</h4>
        <div className="supplement-grid">
          <SupplementField label="Losses in the Past Three Years" value={policy.priorLosses ?? "Not captured"} />
          <SupplementField
            label="Description"
            value={policy.priorLossDescription || "No prior losses reported"}
          />
        </div>
      </section>
    </div>
  );
}

function CarrierResults({
  aiState,
  matches,
}: {
  aiState: AiState;
  matches: AppetiteMatch[];
}) {
  return (
    <div className="ai-results" aria-live="polite">
      {aiState === "idle" && (
        <p className="empty-state">
          Search begins with tenant-scoped structured rules, then cites relevant appetite documents.
        </p>
      )}
      {aiState === "searching" && <p className="empty-state">Reducing carrier candidates...</p>}
      {matches.map((match) => (
        <article className="carrier-card" key={match.id}>
          <div>
            <h4>{match.carrier}</h4>
            <span>{match.score}% fit</span>
          </div>
          <p>{match.rationale}</p>
          <p className="citation-line">Citations: {match.citations.join(", ")}</p>
        </article>
      ))}
    </div>
  );
}

function PolicyInsights({
  policies,
  selectedPolicy,
  selectedPolicyNo,
  setSelectedPolicyNo,
  runCarrierSearch,
  aiState,
  matches,
}: {
  policies: Policy[];
  selectedPolicy: Policy;
  selectedPolicyNo: string;
  setSelectedPolicyNo: (policyNo: string) => void;
  runCarrierSearch: () => void;
  aiState: AiState;
  matches: AppetiteMatch[];
}) {
  const productConfig =
    policyInsightConfigs[`${selectedPolicy.current_carrier}|${selectedPolicy.product}` as keyof typeof policyInsightConfigs];

  return (
    <main className="page-shell">
      <section className="page-title-row align-start">
        <div>
          <p className="eyebrow">Property intelligence module</p>
          <h2>Policy Insights</h2>
        </div>
        <label className="policy-picker">
          <span>Selected policy</span>
          <select value={selectedPolicyNo} onChange={(event) => setSelectedPolicyNo(event.target.value)}>
            {policies.map((policy) => (
              <option key={policy.policy_no} value={policy.policy_no}>
                {policy.policy_no} - {policy.customer_nm}
              </option>
            ))}
          </select>
        </label>
      </section>

      <section className="insight-layout">
        <div className="details-panel">
          <div className="panel-heading">
            <Building2 size={20} />
            <div>
              <h3>{selectedPolicy.customer_nm}</h3>
              <p>{selectedPolicy.policy_no}</p>
            </div>
          </div>
          <div className="detail-grid">
            <DetailItem label="Policy State" value={selectedPolicy.policy_state} />
            <DetailItem label="Effective Date" value={formatDate(selectedPolicy.effective_dt)} />
            <DetailItem label="Term Date" value={formatDate(selectedPolicy.term_dt)} />
            <DetailItem label="Current Carrier" value={selectedPolicy.current_carrier} />
            <DetailItem label="Product" value={selectedPolicy.product} />
            <DetailItem label="Class of Business" value={selectedPolicy.class_of_business} />
            <DetailItem label="Line of Business" value={selectedPolicy.line_of_business} />
            <DetailItem label="Year Built" value={selectedPolicy.year_built} />
            <DetailItem label="Construction Type" value={selectedPolicy.construction_type} />
            <DetailItem label="Location Limit" value={formatCurrency(selectedPolicy.location_limit)} />
            <DetailItem label="Building Limit" value={formatCurrency(selectedPolicy.building_limit)} />
            <DetailItem label="Buildings per Location" value={selectedPolicy.buildings_per_location} />
          </div>
          <ProductQuestionnaire config={productConfig} policy={selectedPolicy} />
        </div>

        <aside className="ai-panel">
          <div>
            <p className="eyebrow">AI advisory layer</p>
            <h3>Carrier appetite matches</h3>
          </div>
          <button className="primary-action" onClick={runCarrierSearch} type="button">
            <Search size={18} />
            <span>{aiState === "searching" ? "Searching" : "Find Carriers"}</span>
          </button>
          <CarrierResults aiState={aiState} matches={matches} />
        </aside>
      </section>
    </main>
  );
}

function AppetiteSearch({
  selectedPolicy,
  runCarrierSearch,
  aiState,
  matches,
}: {
  selectedPolicy: Policy;
  runCarrierSearch: () => void;
  aiState: AiState;
  matches: AppetiteMatch[];
}) {
  return (
    <main className="page-shell">
      <section className="page-title-row align-start">
        <div>
          <p className="eyebrow">Structured search plus citations</p>
          <h2>Appetite Search</h2>
        </div>
        <button className="primary-action compact-action" onClick={runCarrierSearch} type="button">
          <Search size={18} />
          <span>{aiState === "searching" ? "Searching" : "Run Appetite Search"}</span>
        </button>
      </section>

      <section className="workflow-grid">
        <article>
          <span>1</span>
          <h3>Structured Filters</h3>
          <p>
            Tenant, state, class, construction, and limit rules reduce the candidate carriers first.
          </p>
        </article>
        <article>
          <span>2</span>
          <h3>Document Evidence</h3>
          <p>Matching appetite documents are attached as citations before AI summarization.</p>
        </article>
        <article>
          <span>3</span>
          <h3>AI Summary</h3>
          <p>AI remains advisory and never overrides structured underwriting rules.</p>
        </article>
      </section>

      <section className="appetite-layout">
        <div className="details-panel">
          <div className="panel-heading">
            <Building2 size={20} />
            <div>
              <h3>{selectedPolicy.customer_nm}</h3>
              <p>
                {selectedPolicy.policy_state} / {selectedPolicy.class_of_business} /{" "}
                {formatCurrency(selectedPolicy.location_limit)}
              </p>
            </div>
          </div>
          <div className="detail-grid">
            <DetailItem label="Tenant Guardrail" value={selectedPolicy.tenant_id} />
            <DetailItem label="Line of Business" value={selectedPolicy.line_of_business} />
            <DetailItem label="Construction" value={selectedPolicy.construction_type} />
            <DetailItem label="Buildings" value={selectedPolicy.buildings_per_location} />
          </div>
        </div>
        <aside className="ai-panel">
          <div>
            <p className="eyebrow">Ranked output</p>
            <h3>Candidate carriers</h3>
          </div>
          <CarrierResults aiState={aiState} matches={matches} />
        </aside>
      </section>
    </main>
  );
}

function App() {
  const [tenantId, setTenantId] = useState<string>(organizations[0].id);
  const [activePage, setActivePage] = useState<PageId>("policy");
  const [selectedPolicyNo, setSelectedPolicyNo] = useState("");
  const [aiState, setAiState] = useState<AiState>("idle");
  const [matches, setMatches] = useState<AppetiteMatch[]>([]);

  const policies = useMemo(() => listPoliciesByTenant(tenantId).data, [tenantId]);
  const selectedPolicy = useMemo(() => {
    const policyNo = selectedPolicyNo || policies[0]?.policy_no || "";
    return findPolicyByNumber(tenantId, policyNo).data;
  }, [policies, selectedPolicyNo, tenantId]);

  function changeTenant(nextTenantId: string) {
    const nextPolicies = listPoliciesByTenant(nextTenantId).data;
    setTenantId(nextTenantId);
    setSelectedPolicyNo(nextPolicies[0]?.policy_no ?? "");
    setAiState("idle");
    setMatches([]);
  }

  function changePolicy(policyNo: string) {
    setSelectedPolicyNo(policyNo);
    setAiState("idle");
    setMatches([]);
  }

  function runCarrierSearch() {
    if (!selectedPolicy) {
      return;
    }

    setAiState("searching");
    setMatches([]);
    window.setTimeout(() => {
      const result = searchCarrierAppetite(tenantId, selectedPolicy);
      setMatches(result.data);
      setAiState("complete");
    }, 500);
  }

  if (!selectedPolicy) {
    return null;
  }

  return (
    <div className="app">
      <Header
        activePage={activePage}
        setActivePage={setActivePage}
        tenantId={tenantId}
        setTenantId={changeTenant}
      />
      {activePage === "accounts" && (
        <AccountInsights
          policies={policies}
          selectedPolicyNo={selectedPolicy.policy_no}
          setSelectedPolicyNo={changePolicy}
          setActivePage={setActivePage}
        />
      )}
      {activePage === "policy" && (
        <PolicyInsights
          policies={policies}
          selectedPolicy={selectedPolicy}
          selectedPolicyNo={selectedPolicy.policy_no}
          setSelectedPolicyNo={changePolicy}
          runCarrierSearch={runCarrierSearch}
          aiState={aiState}
          matches={matches}
        />
      )}
      {activePage === "appetite" && (
        <AppetiteSearch
          selectedPolicy={selectedPolicy}
          runCarrierSearch={runCarrierSearch}
          aiState={aiState}
          matches={matches}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById("root") as HTMLElement).render(<App />);
