import React, { useMemo, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  AlertTriangle,
  Building2,
  ChevronRight,
  ClipboardCheck,
  FileSearch,
  LayoutDashboard,
  Search,
  ShieldCheck,
} from "lucide-react";
import "./styles.css";

const today = new Date();

const policies = [
  {
    customer_nm: "Worlds Apart Apartments LLC",
    policy_no: "MOS-WA-240701",
    policy_state: "TX",
    effective_dt: "2026-08-01",
    term_dt: "2027-08-01",
    current_carrier: "MiddleOak Specialties",
    product: "Worlds Apart",
    class_of_business: "Apartments",
    line_of_business: "Habitational Package",
    year_built: 1994,
    construction_type: "Joisted Masonry",
    location_limit: 8750000,
    building_limit: 2150000,
    buildings_per_location: 6,
    brokerCode: "TX-1842",
    brokerControlsBusiness: "Yes",
    brokerName: "BTS Risk Advisors",
    dateBindableQuoteNeeded: "2026-07-15",
    targetPremium: 148500,
    useClasses: ["Apartments", "Senior"],
    totalUnits: 184,
    occupiedUnits: 176,
    underConstructionUnits: 0,
    vacantUnits: 8,
    evictedLast12Months: 3,
    prequalificationClear: true,
    ratingItems: {
      ingroundPools: 1,
      centralStationFireAlarms: true,
      hardWiredSmokeDetectors: true,
      sprinkler13R: false,
      commercialGradeSprinkler13: false,
      dogRecreationArea: true,
      stoveTopFireStops: true,
      smokeFreeProperty: false,
      designatedSmokeFreeArea: true,
      gutRehab: false,
      vacantLand: false,
    },
    priorLosses: "No",
    priorLossDescription: "",
  },
  {
    customer_nm: "Cedar Ridge Apartments LLC",
    policy_no: "MGA-GL-104892",
    policy_state: "CO",
    effective_dt: "2025-09-01",
    term_dt: "2026-09-01",
    current_carrier: "Rocky Mountain Specialty",
    product: "Commercial Property",
    class_of_business: "Habitational",
    line_of_business: "Commercial Property",
    year_built: 1998,
    construction_type: "Joisted Masonry",
    location_limit: 6250000,
    building_limit: 1850000,
    buildings_per_location: 4,
  },
  {
    customer_nm: "Prairie Supply Warehouse",
    policy_no: "MGA-CP-772014",
    policy_state: "KS",
    effective_dt: "2026-02-15",
    term_dt: "2027-02-15",
    current_carrier: "Summit Excess & Surplus",
    product: "Package",
    class_of_business: "Warehouse",
    line_of_business: "Package",
    year_built: 2008,
    construction_type: "Non-Combustible",
    location_limit: 4800000,
    building_limit: 3200000,
    buildings_per_location: 1,
  },
  {
    customer_nm: "Lakeside Family Dining Inc.",
    policy_no: "MGA-BOP-381245",
    policy_state: "MI",
    effective_dt: "2025-11-30",
    term_dt: "2026-11-30",
    current_carrier: "Great Lakes Mutual",
    product: "Business Owners",
    class_of_business: "Restaurant",
    line_of_business: "Business Owners",
    year_built: 1987,
    construction_type: "Frame",
    location_limit: 2100000,
    building_limit: 950000,
    buildings_per_location: 1,
  },
  {
    customer_nm: "Mesa Equipment Rental",
    policy_no: "MGA-IM-629401",
    policy_state: "AZ",
    effective_dt: "2026-01-01",
    term_dt: "2027-01-01",
    current_carrier: "Desert Star Insurance",
    product: "Inland Marine",
    class_of_business: "Equipment Rental",
    line_of_business: "Inland Marine",
    year_built: 2015,
    construction_type: "Metal",
    location_limit: 3500000,
    building_limit: 1250000,
    buildings_per_location: 2,
  },
  {
    customer_nm: "Harborview Medical Plaza",
    policy_no: "MGA-PR-510266",
    policy_state: "FL",
    effective_dt: "2025-08-10",
    term_dt: "2026-08-10",
    current_carrier: "Atlantic Specialty",
    product: "Commercial Property",
    class_of_business: "Medical Office",
    line_of_business: "Commercial Property",
    year_built: 2001,
    construction_type: "Masonry Non-Combustible",
    location_limit: 12250000,
    building_limit: 7900000,
    buildings_per_location: 1,
  },
];

const navItems = [
  { id: "accounts", label: "Account Insights", icon: LayoutDashboard },
  { id: "policy", label: "Policy Insights", icon: FileSearch },
];

const carrierMatches = [
  {
    carrier: "Berkshire Hathaway GUARD",
    appetite: "Strong",
    rationale:
      "Broad commercial property appetite with capacity for established habitational, office, and light commercial schedules.",
  },
  {
    carrier: "AmTrust E&S",
    appetite: "Moderate",
    rationale:
      "Often competitive for small to middle-market commercial risks where construction and limits are well documented.",
  },
  {
    carrier: "Crum & Forster Specialty",
    appetite: "Selective",
    rationale:
      "Useful market for excess and specialty property placements requiring underwriting flexibility.",
  },
  {
    carrier: "Nationwide E&S/Specialty",
    appetite: "Moderate",
    rationale:
      "May fit package or property-driven accounts depending on occupancy, location catastrophe exposure, and loss history.",
  },
];

const policyInsightConfigs = {
  "MiddleOak Specialties|Worlds Apart": {
    title: "MiddleOak Specialties Worlds Apart",
    subtitle: "Supplement-driven underwriting checklist",
    requiredAttachments: [
      "ACORD Application",
      "Statement of Values",
      "Completed WORLDS APART Supplement",
      "Currently Valued, 5-Year Hard Copy Loss Runs",
    ],
    sections: [
      {
        title: "Submission Details",
        fields: [
          { label: "Broker Code", key: "brokerCode" },
          { label: "Broker Controls Business", key: "brokerControlsBusiness" },
          { label: "Name of Broker", key: "brokerName" },
          { label: "Date Bindable Quote Needed", key: "dateBindableQuoteNeeded", format: "date" },
          { label: "Target Premium", key: "targetPremium", format: "currency" },
        ],
      },
      {
        title: "Use Classes",
        fields: [
          { label: "Selected Classes", key: "useClasses", format: "list" },
          { label: "Total Number of Units", key: "totalUnits" },
          { label: "Occupied", key: "occupiedUnits" },
          { label: "Under Construction", key: "underConstructionUnits" },
          { label: "Vacant", key: "vacantUnits" },
          { label: "Evicted Last 12 Months", key: "evictedLast12Months" },
        ],
      },
      {
        title: "Rating Items",
        fields: [
          { label: "Number of Inground Pools", key: "ratingItems.ingroundPools" },
          { label: "Central Station Fire Alarms", key: "ratingItems.centralStationFireAlarms", format: "yesNo" },
          { label: "Hard Wired Smoke Detectors", key: "ratingItems.hardWiredSmokeDetectors", format: "yesNo" },
          { label: "Full System 13R Sprinkler", key: "ratingItems.sprinkler13R", format: "yesNo" },
          { label: "Commercial Grade Sprinkler", key: "ratingItems.commercialGradeSprinkler13", format: "yesNo" },
          { label: "Dog Recreation Area", key: "ratingItems.dogRecreationArea", format: "yesNo" },
          { label: "Stove Top Fire Stops", key: "ratingItems.stoveTopFireStops", format: "yesNo" },
          { label: "Smoke Free Property", key: "ratingItems.smokeFreeProperty", format: "yesNo" },
          { label: "Designated Smoke Free Area", key: "ratingItems.designatedSmokeFreeArea", format: "yesNo" },
          { label: "Gut Rehab", key: "ratingItems.gutRehab", format: "yesNo" },
          { label: "Vacant Land", key: "ratingItems.vacantLand", format: "yesNo" },
        ],
      },
    ],
    knockoutItems: [
      "Locations undergoing major construction",
      "Armed guards, courtesy officers, or off-duty police officers",
      "Major systems not updated within the past 30 years",
      "Disqualifying electrical conditions",
      "Galvanized or polybutylene piping",
    ],
  },
};

function daysToTerm(termDate) {
  const term = new Date(`${termDate}T00:00:00`);
  const current = new Date(today.getFullYear(), today.getMonth(), today.getDate());
  return Math.ceil((term - current) / 86400000);
}

function formatDate(value) {
  return new Intl.DateTimeFormat("en-US", {
    month: "short",
    day: "2-digit",
    year: "numeric",
  }).format(new Date(`${value}T00:00:00`));
}

function formatCurrency(value) {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: 0,
  }).format(value);
}

function getByPath(source, path) {
  return path.split(".").reduce((value, key) => value?.[key], source);
}

function formatFieldValue(policy, field) {
  const value = getByPath(policy, field.key);

  if (value === undefined || value === null || value === "") {
    return "Not captured";
  }

  if (field.format === "currency") {
    return formatCurrency(value);
  }

  if (field.format === "date") {
    return formatDate(value);
  }

  if (field.format === "yesNo") {
    return value ? "Yes" : "No";
  }

  if (field.format === "list") {
    return value.join(", ");
  }

  return value;
}

function Header({ activePage, setActivePage }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-mark">
          <ShieldCheck size={22} />
        </div>
        <div>
          <p>MGA Policy Administration</p>
          <h1>Account Insights</h1>
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
    </header>
  );
}

function AccountInsights({ selectedPolicyNo, setSelectedPolicyNo, setActivePage }) {
  return (
    <main className="page-shell">
      <section className="page-title-row">
        <div>
          <p className="eyebrow">Book overview</p>
          <h2>Account Insights</h2>
        </div>
        <div className="metric-strip">
          <div>
            <span>{policies.length}</span>
            <p>Active policies</p>
          </div>
          <div>
            <span>
              {policies.filter((policy) => daysToTerm(policy.term_dt) <= 90).length}
            </span>
            <p>Terms inside 90 days</p>
          </div>
          <div>
            <span>
              {formatCurrency(
                policies.reduce((total, policy) => total + policy.location_limit, 0)
              )}
            </span>
            <p>Total location limit</p>
          </div>
        </div>
      </section>

      <section className="table-panel" aria-label="Policy list">
        <div className="panel-toolbar">
          <div className="search-box">
            <Search size={17} />
            <span>Policy portfolio</span>
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
                    <span
                      className={
                        daysToTerm(policy.term_dt) <= 90 ? "term-pill urgent" : "term-pill"
                      }
                    >
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

function DetailItem({ label, value }) {
  return (
    <div className="detail-item">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function SupplementField({ label, value }) {
  return (
    <div className="supplement-field">
      <span>{label}</span>
      <strong>{value}</strong>
    </div>
  );
}

function ProductQuestionnaire({ config, policy }) {
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
          <SupplementField label="Losses in the Past Three Years" value={policy.priorLosses} />
          <SupplementField
            label="Description"
            value={policy.priorLossDescription || "No prior losses reported"}
          />
        </div>
      </section>
    </div>
  );
}

function PolicyInsights({ selectedPolicyNo, setSelectedPolicyNo }) {
  const [aiState, setAiState] = useState("idle");
  const [matches, setMatches] = useState([]);

  const selectedPolicy = useMemo(
    () => policies.find((policy) => policy.policy_no === selectedPolicyNo) ?? policies[0],
    [selectedPolicyNo]
  );
  const productConfig =
    policyInsightConfigs[`${selectedPolicy.current_carrier}|${selectedPolicy.product}`];

  function runCarrierSearch() {
    setAiState("searching");
    setMatches([]);
    window.setTimeout(() => {
      setMatches(carrierMatches);
      setAiState("complete");
    }, 700);
  }

  return (
    <main className="page-shell">
      <section className="page-title-row align-start">
        <div>
          <p className="eyebrow">Policy module</p>
          <h2>Policy Insights</h2>
        </div>
        <label className="policy-picker">
          <span>Selected policy</span>
          <select
            value={selectedPolicy.policy_no}
            onChange={(event) => {
              setSelectedPolicyNo(event.target.value);
              setAiState("idle");
              setMatches([]);
            }}
          >
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
            <p className="eyebrow">AI market search</p>
            <h3>Carrier appetite matches</h3>
          </div>
          <button className="primary-action" onClick={runCarrierSearch} type="button">
            <Search size={18} />
            <span>{aiState === "searching" ? "Searching" : "Find Carriers"}</span>
          </button>
          <div className="ai-results" aria-live="polite">
            {aiState === "idle" && (
              <p className="empty-state">
                Run an AI search to identify carriers that fit this policy's underwriting
                characteristics.
              </p>
            )}
            {aiState === "searching" && <p className="empty-state">Reviewing carrier appetite...</p>}
            {matches.map((match) => (
              <article className="carrier-card" key={match.carrier}>
                <div>
                  <h4>{match.carrier}</h4>
                  <span>{match.appetite}</span>
                </div>
                <p>{match.rationale}</p>
              </article>
            ))}
          </div>
        </aside>
      </section>
    </main>
  );
}

function App() {
  const [activePage, setActivePage] = useState("policy");
  const [selectedPolicyNo, setSelectedPolicyNo] = useState(policies[0].policy_no);

  return (
    <div className="app">
      <Header activePage={activePage} setActivePage={setActivePage} />
      {activePage === "accounts" ? (
        <AccountInsights
          selectedPolicyNo={selectedPolicyNo}
          setSelectedPolicyNo={setSelectedPolicyNo}
          setActivePage={setActivePage}
        />
      ) : (
        <PolicyInsights
          selectedPolicyNo={selectedPolicyNo}
          setSelectedPolicyNo={setSelectedPolicyNo}
        />
      )}
    </div>
  );
}

createRoot(document.getElementById("root")).render(<App />);
