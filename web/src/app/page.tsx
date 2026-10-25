"use client";

import React, { useState, useEffect, useMemo } from "react";
import {
  TrendingUp,
  Landmark,
  AlertTriangle,
  Activity,
  ShieldCheck,
  Search,
  ExternalLink,
  BookOpen,
  Scale,
  Clock,
  Compass,
  FileText,
  BarChart2,
  Menu,
  X,
  ChevronRight,
  ChevronDown,
  ChevronUp,
  Info,
  Percent,
  Briefcase,
  Users,
  DollarSign,
  Layers,
  History,
  Filter,
  SlidersHorizontal,
  CheckCircle2,
  TrendingDown,
  Gauge,
} from "lucide-react";

export interface BankBrandTheme {
  name: string;
  ticker: string;
  primary: string; // Cor principal da marca
  secondary: string; // Cor secundária
  badgeBg: string; // Fundo do chip
  badgeText: string; // Texto contrastante
  borderColor: string; // Borda do chip/card
  accentLight: string; // Fundo sutil com transparência
  accentBorder: string; // Borda de destaque
}

export const BANK_BRAND_THEMES: Record<string, BankBrandTheme> = {
  "Nubank (Nu Holdings)": {
    name: "Nubank (Nu Holdings)",
    ticker: "ROXO34",
    primary: "#820AD1",
    secondary: "#9D2DE0",
    badgeBg: "#FAF5FF",
    badgeText: "#6B21A8",
    borderColor: "#C084FC",
    accentLight: "rgba(130, 10, 209, 0.08)",
    accentBorder: "rgba(130, 10, 209, 0.4)",
  },
  "Itaú Unibanco": {
    name: "Itaú Unibanco",
    ticker: "ITUB4",
    primary: "#EC7000",
    secondary: "#002D62",
    badgeBg: "#FFF7ED",
    badgeText: "#C2410C",
    borderColor: "#FDBA74",
    accentLight: "rgba(236, 112, 0, 0.08)",
    accentBorder: "rgba(236, 112, 0, 0.4)",
  },
  "Bradesco": {
    name: "Bradesco",
    ticker: "BBDC4",
    primary: "#CC092F",
    secondary: "#ED1941",
    badgeBg: "#FEF2F2",
    badgeText: "#991B1B",
    borderColor: "#FCA5A5",
    accentLight: "rgba(204, 9, 47, 0.08)",
    accentBorder: "rgba(204, 9, 47, 0.4)",
  },
  "Banco do Brasil": {
    name: "Banco do Brasil",
    ticker: "BBAS3",
    primary: "#003882",
    secondary: "#F8D117",
    badgeBg: "#EFF6FF",
    badgeText: "#1E40AF",
    borderColor: "#93C5FD",
    accentLight: "rgba(0, 56, 130, 0.08)",
    accentBorder: "rgba(0, 56, 130, 0.4)",
  },
  "Caixa Econômica Federal": {
    name: "Caixa Econômica Federal",
    ticker: "CEF",
    primary: "#005CA9",
    secondary: "#F37021",
    badgeBg: "#F0F9FF",
    badgeText: "#0369A1",
    borderColor: "#7DD3FC",
    accentLight: "rgba(0, 92, 169, 0.08)",
    accentBorder: "rgba(0, 92, 169, 0.4)",
  },
  "Santander Brasil": {
    name: "Santander Brasil",
    ticker: "SANB11",
    primary: "#EC0000",
    secondary: "#CC0000",
    badgeBg: "#FFF1F2",
    badgeText: "#BE123C",
    borderColor: "#FDA4AF",
    accentLight: "rgba(236, 0, 0, 0.08)",
    accentBorder: "rgba(236, 0, 0, 0.4)",
  },
  "BTG Pactual": {
    name: "BTG Pactual",
    ticker: "BPAC11",
    primary: "#0B1F3F",
    secondary: "#1E3A8A",
    badgeBg: "#F8FAFC",
    badgeText: "#0F172A",
    borderColor: "#94A3B8",
    accentLight: "rgba(11, 31, 63, 0.08)",
    accentBorder: "rgba(11, 31, 63, 0.4)",
  },
  "Banco Safra": {
    name: "Banco Safra",
    ticker: "Safra",
    primary: "#002B49",
    secondary: "#C5A059",
    badgeBg: "#FDFBF7",
    badgeText: "#854D0E",
    borderColor: "#E2D4B7",
    accentLight: "rgba(197, 160, 89, 0.12)",
    accentBorder: "rgba(197, 160, 89, 0.45)",
  },
  "Banco BV": {
    name: "Banco BV",
    ticker: "BV",
    primary: "#004B87",
    secondary: "#00A3E0",
    badgeBg: "#F0F8FD",
    badgeText: "#075985",
    borderColor: "#BAE6FD",
    accentLight: "rgba(0, 75, 135, 0.08)",
    accentBorder: "rgba(0, 75, 135, 0.4)",
  },
  "Banrisul": {
    name: "Banrisul",
    ticker: "BRSR6",
    primary: "#008852",
    secondary: "#005CA9",
    badgeBg: "#F0FDF4",
    badgeText: "#166534",
    borderColor: "#86EFAC",
    accentLight: "rgba(0, 136, 82, 0.08)",
    accentBorder: "rgba(0, 136, 82, 0.4)",
  },
  "Banco Inter": {
    name: "Banco Inter",
    ticker: "INTR",
    primary: "#FF7A00",
    secondary: "#EA580C",
    badgeBg: "#FFF7ED",
    badgeText: "#C2410C",
    borderColor: "#FDBA74",
    accentLight: "rgba(255, 122, 0, 0.08)",
    accentBorder: "rgba(255, 122, 0, 0.4)",
  },
};

export function getBankTheme(nameOrDenom: string): BankBrandTheme | null {
  if (!nameOrDenom) return null;
  const n = nameOrDenom.toUpperCase();

  if (n.includes("NUBANK") || n.includes("NU HOLDINGS")) return BANK_BRAND_THEMES["Nubank (Nu Holdings)"];
  if (n.includes("ITAU") || n.includes("ITAÚ")) return BANK_BRAND_THEMES["Itaú Unibanco"];
  if (n.includes("BRADESCO")) return BANK_BRAND_THEMES["Bradesco"];
  if (n.includes("BCO BRASIL") || n.includes("BANCO DO BRASIL")) return BANK_BRAND_THEMES["Banco do Brasil"];
  if (n.includes("SANTANDER")) return BANK_BRAND_THEMES["Santander Brasil"];
  if (n.includes("BTG PACTUAL") || n.includes("BTG")) return BANK_BRAND_THEMES["BTG Pactual"];
  if (n.includes("CAIXA") || n.includes("CEF")) return BANK_BRAND_THEMES["Caixa Econômica Federal"];
  if (n.includes("SAFRA")) return BANK_BRAND_THEMES["Banco Safra"];
  if (n.includes("BANCO BV") || n.includes("VOTORANTIM") || n.includes("BCO BV")) return BANK_BRAND_THEMES["Banco BV"];
  if (n.includes("BANRISUL") || n.includes("ESTADO DO RIO GRANDE DO SUL")) return BANK_BRAND_THEMES["Banrisul"];
  if (n.includes("BANCO INTER") || n.includes("INTER S.A.") || (n.includes("INTER") && !n.includes("INTERNATIONAL"))) return BANK_BRAND_THEMES["Banco Inter"];

  // Demais instituições financeiras na B3 (Pilar 3)
  if (n.includes("PAN")) {
    return {
      name: "Banco Pan",
      ticker: "BPAN4",
      primary: "#0099DA",
      secondary: "#002B49",
      badgeBg: "#F0F9FF",
      badgeText: "#0369A1",
      borderColor: "#7DD3FC",
      accentLight: "rgba(0, 153, 218, 0.08)",
      accentBorder: "rgba(0, 153, 218, 0.35)",
    };
  }
  if (n.includes("BMG")) {
    return {
      name: "Banco BMG",
      ticker: "BMGB4",
      primary: "#FF6600",
      secondary: "#000000",
      badgeBg: "#FFF7ED",
      badgeText: "#C2410C",
      borderColor: "#FDBA74",
      accentLight: "rgba(255, 102, 0, 0.08)",
      accentBorder: "rgba(255, 102, 0, 0.35)",
    };
  }
  if (n.includes("DAYCOVAL")) {
    return {
      name: "Banco Daycoval",
      ticker: "DAYC",
      primary: "#003865",
      secondary: "#C5A059",
      badgeBg: "#F0F4F8",
      badgeText: "#0B1F3F",
      borderColor: "#94A3B8",
      accentLight: "rgba(0, 56, 101, 0.08)",
      accentBorder: "rgba(0, 56, 101, 0.35)",
    };
  }
  if (n.includes("B3 S.A.") || n.includes("B3")) {
    return {
      name: "B3 S.A.",
      ticker: "B3SA3",
      primary: "#003366",
      secondary: "#D4AF37",
      badgeBg: "#F0F4F8",
      badgeText: "#1E3A8A",
      borderColor: "#93C5FD",
      accentLight: "rgba(0, 51, 102, 0.08)",
      accentBorder: "rgba(0, 51, 102, 0.35)",
    };
  }
  if (n.includes("XP INVESTIMENTOS") || n.includes("XP")) {
    return {
      name: "XP Investimentos",
      ticker: "XPBR31",
      primary: "#111111",
      secondary: "#F2B705",
      badgeBg: "#FEFCE8",
      badgeText: "#854D0E",
      borderColor: "#FDE047",
      accentLight: "rgba(242, 183, 5, 0.12)",
      accentBorder: "rgba(242, 183, 5, 0.5)",
    };
  }
  if (n.includes("CIELO")) {
    return {
      name: "Cielo",
      ticker: "CIEL3",
      primary: "#00AEEF",
      secondary: "#002B49",
      badgeBg: "#F0F9FF",
      badgeText: "#0284C7",
      borderColor: "#38BDF8",
      accentLight: "rgba(0, 174, 239, 0.08)",
      accentBorder: "rgba(0, 174, 239, 0.35)",
    };
  }
  if (n.includes("BB SEGURIDADE")) {
    return {
      name: "BB Seguridade",
      ticker: "BBSE3",
      primary: "#003882",
      secondary: "#FCDE00",
      badgeBg: "#EFF6FF",
      badgeText: "#1E40AF",
      borderColor: "#93C5FD",
      accentLight: "rgba(0, 56, 130, 0.08)",
      accentBorder: "rgba(0, 56, 130, 0.35)",
    };
  }
  if (n.includes("CAIXA SEGURIDADE")) {
    return {
      name: "Caixa Seguridade",
      ticker: "CXSE3",
      primary: "#005CA9",
      secondary: "#F37021",
      badgeBg: "#F0F9FF",
      badgeText: "#0369A1",
      borderColor: "#7DD3FC",
      accentLight: "rgba(0, 92, 169, 0.08)",
      accentBorder: "rgba(0, 92, 169, 0.35)",
    };
  }
  if (n.includes("PORTO SEGURO") || n.includes("PORTO")) {
    return {
      name: "Porto Seguro",
      ticker: "PSSA3",
      primary: "#003399",
      secondary: "#00A3E0",
      badgeBg: "#EFF6FF",
      badgeText: "#1D4ED8",
      borderColor: "#93C5FD",
      accentLight: "rgba(0, 51, 153, 0.08)",
      accentBorder: "rgba(0, 51, 153, 0.35)",
    };
  }
  if (n.includes("BANESTES")) {
    return {
      name: "Banestes",
      ticker: "BEES3",
      primary: "#008542",
      secondary: "#005CA9",
      badgeBg: "#F0FDF4",
      badgeText: "#166534",
      borderColor: "#86EFAC",
      accentLight: "rgba(0, 133, 66, 0.08)",
      accentBorder: "rgba(0, 133, 66, 0.35)",
    };
  }
  if (n.includes("BRB")) {
    return {
      name: "BRB Banco de Brasília",
      ticker: "BSLI3",
      primary: "#005CAA",
      secondary: "#FCDE00",
      badgeBg: "#EFF6FF",
      badgeText: "#1E40AF",
      borderColor: "#93C5FD",
      accentLight: "rgba(0, 92, 170, 0.08)",
      accentBorder: "rgba(0, 92, 170, 0.35)",
    };
  }

  return null;
}

export default function EditorialObservatorio() {
  const [activeTab, setActiveTab] = useState<"pilar1" | "pilar2" | "pilar3">("pilar1");
  const [pilar1Data, setPilar1Data] = useState<any>(null);
  const [pilar2Data, setPilar2Data] = useState<any>(null);
  const [pilar3Data, setPilar3Data] = useState<any>(null);
  const [selectedModality, setSelectedModality] = useState<string>("inad_pf_cartao_rotativo");
  const [selectedBank, setSelectedBank] = useState<string>("Itaú Unibanco");
  const [searchCompany, setSearchCompany] = useState<string>("");
  const [selectedRiskFactor, setSelectedRiskFactor] = useState<string>("all");
  const [selectedRating, setSelectedRating] = useState<string>("all");
  const [selectedYear, setSelectedYear] = useState<string>("all");
  const [selectedSegment, setSelectedSegment] = useState<string>("all");
  const [onlyTopLatestYear, setOnlyTopLatestYear] = useState<boolean>(false);
  const [sortBy, setSortBy] = useState<"risk_desc" | "revenue_desc" | "risk_asc">("risk_desc");
  const [expandedCompanyKey, setExpandedCompanyKey] = useState<string | null>(null);
  const [showWeightsDetails, setShowWeightsDetails] = useState<boolean>(true);
  const [isSidebarOpen, setIsSidebarOpen] = useState<boolean>(true);

  useEffect(() => {
    fetch("/data/pilar1_macro_lags.json")
      .then((r) => r.json())
      .then((d) => setPilar1Data(d))
      .catch((e) => console.error("Erro Pilar 1:", e));

    fetch("/data/pilar2_bancos_balancos.json")
      .then((r) => r.json())
      .then((d) => setPilar2Data(d))
      .catch((e) => console.error("Erro Pilar 2:", e));

    fetch("/data/pilar3_cvm_empresas.json")
      .then((r) => r.json())
      .then((d) => setPilar3Data(d))
      .catch((e) => console.error("Erro Pilar 3:", e));
  }, []);

  const modData = pilar1Data?.modalities?.[selectedModality];
  const bankData = pilar2Data?.banks?.[selectedBank];

  // Filtros Avançados do Pilar 3 (Fatores de Risco, Segmento Financeiro/Corporativo, Rating, Ano, Maiores 2025)
  const filteredCompanies = useMemo(() => {
    if (!pilar3Data?.sample_companies_monitor) return [];

    return pilar3Data.sample_companies_monitor
      .filter((company: any) => {
        // 1. Busca textual (Nome limpo, razão social, setor ou CNPJ)
        const query = searchCompany.toLowerCase().trim();
        const matchesSearch =
          query === "" ||
          company.DENOM_CIA_CLEAN?.toLowerCase().includes(query) ||
          company.DENOM_CIA?.toLowerCase().includes(query) ||
          company.setor?.toLowerCase().includes(query) ||
          company.CNPJ_CIA?.includes(query);

        if (!matchesSearch) return false;

        // 2. Filtro por Ano
        if (selectedYear !== "all" && String(company.ano) !== selectedYear) {
          return false;
        }

        // 3. Filtro por Segmento (Bancos & Financeiro vs Não Financeiro)
        if (selectedSegment !== "all" && company.segmento !== selectedSegment) {
          return false;
        }

        // 4. Filtro exclusivo das maiores no último ano (2025)
        if (onlyTopLatestYear && !company.top_maior_ultimo_ano) {
          return false;
        }

        // 5. Filtro por Rating Regulatório
        if (selectedRating !== "all") {
          if (selectedRating === "distress" && company.rating !== "CCC/Distress") return false;
          if (selectedRating === "high_risk" && !["BB", "B"].includes(company.rating)) return false;
          if (selectedRating === "moderate" && company.rating !== "BBB") return false;
          if (selectedRating === "investment_grade" && !["AAA", "AA", "A"].includes(company.rating)) return false;
        }

        // 6. Filtro por Fator de Risco Específico
        if (selectedRiskFactor !== "all") {
          const isPrimary = company.alerta_principal?.feature === selectedRiskFactor;
          const isInVulns = company.vulnerabilidades_ativas?.includes(selectedRiskFactor);
          const detailedItem = company.fatores_detalhados?.find((f: any) => f.key === selectedRiskFactor);
          const isCriticalOrAlert =
            detailedItem &&
            (detailedItem.shap_impact > 0.02 ||
              detailedItem.status === "Crítico" ||
              detailedItem.status === "Atenção");

          if (!isPrimary && !isInVulns && !isCriticalOrAlert) {
            return false;
          }
        }

        return true;
      })
      .sort((a: any, b: any) => {
        if (sortBy === "revenue_desc") {
          return (b.receita_liquida_bi || 0) - (a.receita_liquida_bi || 0);
        }
        if (sortBy === "risk_asc") {
          return (a.score_fator_consolidado || 0) - (b.score_fator_consolidado || 0);
        }
        // default: risk_desc (mantém agrupamento por ano e maior risco primeiro)
        if (selectedYear === "all" && b.ano !== a.ano) {
          return b.ano - a.ano;
        }
        return (b.score_fator_consolidado || 0) - (a.score_fator_consolidado || 0);
      });
  }, [
    pilar3Data,
    searchCompany,
    selectedYear,
    selectedSegment,
    onlyTopLatestYear,
    selectedRating,
    selectedRiskFactor,
    sortBy,
  ]);

  // Metadados do Fator de Risco Selecionado
  const selectedRiskFactorMeta = useMemo(() => {
    if (!pilar3Data?.pesos_globais_modelo || selectedRiskFactor === "all") return null;
    return pilar3Data.pesos_globais_modelo.find((item: any) => item.key === selectedRiskFactor) || null;
  }, [pilar3Data, selectedRiskFactor]);

  return (
    <div className="min-h-screen bg-[#f8f9fa] text-[#4a5568] flex flex-col antialiased">
      {/* Mobile Topbar */}
      <div className="lg:hidden bg-white border-b border-gray-200 px-4 py-3 flex items-center justify-between sticky top-0 z-50">
        <div className="font-serif font-bold text-gray-900 tracking-wider text-sm uppercase">
          Observatório SFN
        </div>
        <button
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-1.5 rounded text-gray-600 hover:text-gray-900 hover:bg-gray-100"
          aria-label="Abrir Menu"
        >
          {isSidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>

      {/* Main Layout Container */}
      <div className="flex-1 flex flex-col lg:flex-row max-w-[1440px] w-full mx-auto">
        {/* ======================================================== */}
        {/* MAIN CONTENT AREA (#main)                                */}
        {/* ======================================================== */}
        <div className="flex-1 px-6 sm:px-10 py-8 lg:py-12 order-2 lg:order-1 overflow-x-hidden">
          {/* Editorial Top Header */}
          <header className="border-b-2 border-gray-200 pb-5 mb-10 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div className="font-serif font-bold tracking-widest uppercase text-base text-gray-900">
              <span className="text-[#f56a6a]">SFN</span> Analytics &amp; Risk Laboratory
            </div>
            <div className="flex items-center gap-4 text-xs font-semibold text-gray-500 uppercase tracking-wider">
              <span className="flex items-center gap-1.5">
                <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse"></span>
                BACEN SGS 2026
              </span>
              <span>•</span>
              <span>CVM DFP IFRS</span>
              <span>•</span>
              <span>Vercel Production</span>
            </div>
          </header>

          {/* Banner Editorial Section */}
          <section className="mb-14 pb-12 border-b border-gray-200">
            <div className="max-w-4xl">
              <div className="text-xs uppercase tracking-[0.2em] font-semibold text-[#f56a6a] mb-2 flex items-center gap-1.5">
                <Compass className="w-4 h-4" /> Portfólio de Ciência de Dados &amp; Modelagem Bancária
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-serif font-bold text-gray-900 leading-tight mb-5">
                Observatório Quantitativo do <br />
                Sistema Financeiro Nacional
              </h1>
              <p className="text-base sm:text-lg text-gray-600 leading-relaxed font-sans mb-6">
                Desenvolvido por um profissional que atua no setor bancário brasileiro, este laboratório conecta dados <strong>100% reais e auditados do Banco Central e da CVM</strong> em um ecossistema preditivo de risco de crédito, eliminando silos tradicionais e gerando inteligência acionável com rigor estatístico.
              </p>

              <div className="flex flex-wrap gap-3">
                <button
                  onClick={() => setActiveTab("pilar1")}
                  className={`editorial-btn ${activeTab === "pilar1" ? "editorial-btn-primary" : ""}`}
                >
                  1. Defasagem da Selic
                </button>
                <button
                  onClick={() => setActiveTab("pilar2")}
                  className={`editorial-btn ${activeTab === "pilar2" ? "editorial-btn-primary" : ""}`}
                >
                  2. Balanços dos Bancos
                </button>
                <button
                  onClick={() => setActiveTab("pilar3")}
                  className={`editorial-btn ${activeTab === "pilar3" ? "editorial-btn-primary" : ""}`}
                >
                  3. Early Warning PJ
                </button>
              </div>
            </div>
          </section>

          {/* ======================================================== */}
          {/* PILAR 1: TRANSMISSÃO DA SELIC & DEFASAGEM               */}
          {/* ======================================================== */}
          {activeTab === "pilar1" && (
            <section className="space-y-12 animate-fadeIn">
              <div>
                <h2 className="major-heading text-xl sm:text-2xl text-gray-900">
                  1. Transmissão Monetária &amp; Defasagem Temporal
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                  Investigação empírica com <strong>166 meses de dados contínuos do BACEN SGS (2013–2026)</strong>. Demonstra como os ciclos de aperto monetário do COPOM se propagam pela economia real até atingir a inadimplência das diferentes carteiras de crédito, com validação <strong>Walk-Forward</strong> (janela expansiva trimestral sem <em>look-ahead bias</em>).
                </p>
              </div>

              {/* 1.1 Snapshot Macroeconômico Oficial */}
              {pilar1Data?.macro_snapshot && (
                <div>
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
                      <Activity className="w-4 h-4 text-[#f56a6a]" />
                      Painel Macroeconômico Multivariado (BACEN SGS Oficial)
                    </h3>
                    <span className="text-xs font-mono text-gray-500">
                      Posições mais recentes consolidadas
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
                    <div className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-xs hover:border-[#f56a6a] transition-colors">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                        Taxa Selic Meta
                      </span>
                      <div className="text-2xl font-serif font-bold text-[#f56a6a]">
                        {pilar1Data.macro_snapshot.selic_meta.valor}%
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                        a.a. • {pilar1Data.macro_snapshot.selic_meta.data}
                      </span>
                    </div>

                    <div className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-xs hover:border-[#f56a6a] transition-colors">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                        Inflação IPCA 12m
                      </span>
                      <div className="text-2xl font-serif font-bold text-gray-900">
                        {pilar1Data.macro_snapshot.ipca_12m.valor}%
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                        Acumulado • {pilar1Data.macro_snapshot.ipca_12m.data}
                      </span>
                    </div>

                    <div className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-xs hover:border-[#f56a6a] transition-colors">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                        Desemprego (PNAD)
                      </span>
                      <div className="text-2xl font-serif font-bold text-emerald-700">
                        {pilar1Data.macro_snapshot.desemprego_pnad.valor}%
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                        Mínima Histórica • IBGE
                      </span>
                    </div>

                    <div className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-xs hover:border-[#f56a6a] transition-colors">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                        Atividade (IBC-Br)
                      </span>
                      <div className="text-2xl font-serif font-bold text-gray-900">
                        {pilar1Data.macro_snapshot.ibc_br_dessaz.valor}
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                        Índice Dessaz. • BACEN
                      </span>
                    </div>

                    <div className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-xs hover:border-[#f56a6a] transition-colors">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                        Comprometimento Renda
                      </span>
                      <div className="text-2xl font-serif font-bold text-rose-700">
                        {pilar1Data.macro_snapshot.comprometimento_renda.valor}%
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                        Serviço da Dívida Famílias
                      </span>
                    </div>

                    <div className="p-4 bg-white border-2 border-gray-200 rounded-lg shadow-xs hover:border-[#f56a6a] transition-colors">
                      <span className="text-[10px] uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                        Saldo Carteira SFN
                      </span>
                      <div className="text-2xl font-serif font-bold text-gray-900">
                        R$ {pilar1Data.macro_snapshot.saldo_credito_sfn_tri.valor} T
                      </div>
                      <span className="text-[10px] text-gray-500 font-mono mt-1 block">
                        Ativo de Crédito Total
                      </span>
                    </div>
                  </div>
                </div>
              )}

              {/* 1.2 Mecanismo Didático de Transmissão */}
              <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 shadow-xs space-y-6">
                <div>
                  <h3 className="font-serif font-bold text-gray-900 text-base mb-1">
                    Como a Política Monetária vira Inadimplência Bancária? (O Ciclo em 4 Fases)
                  </h3>
                  <p className="text-xs text-gray-600">
                    O canal de transmissão do juro não é instantâneo. Ele percorre uma cadeia de atrito financeiro até bater nas provisões de crédito:
                  </p>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                  <div className="p-4 bg-gray-50 border-l-4 border-gray-400 rounded">
                    <span className="text-xs font-mono font-bold text-gray-500 block mb-1">FASE 1 • MÊS 0</span>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Choque de Decisão</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      COPOM eleva a Selic. O custo de captação interbancário (CDI) sobe instantaneamente na mesa de operações do banco.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border-l-4 border-gray-600 rounded">
                    <span className="text-xs font-mono font-bold text-gray-500 block mb-1">FASE 2 • MÊS 1</span>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Repasse &amp; Spreads</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Bancos repassam o custo para as linhas rotativas e de giro. A política de concessão fica mais seletiva e os limites caem.
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border-l-4 border-[#f56a6a] rounded">
                    <span className="text-xs font-mono font-bold text-[#f56a6a] block mb-1">FASE 3 • MÊS 2 A 3</span>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Asfixia Orçamentária</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      Juros compostos multiplicam o saldo devedor. Famílias deixam de pagar faturas integrais e entram no rotativo (atraso de 30-60d).
                    </p>
                  </div>

                  <div className="p-4 bg-gray-50 border-l-4 border-rose-700 rounded">
                    <span className="text-xs font-mono font-bold text-rose-700 block mb-1">FASE 4 • MÊS 3 A 10</span>
                    <h4 className="font-bold text-gray-900 text-sm mb-1">Default Contábil (NPL 90)</h4>
                    <p className="text-xs text-gray-600 leading-relaxed">
                      O atraso cruza o marco de <strong>90 dias</strong> do BACEN. A perda é reconhecida na DRE via provisão (IFRS 9 / CMN 4.966).
                    </p>
                  </div>
                </div>
              </div>

              {/* 1.3 Matriz de Sensibilidade Macroeconômica */}
              {pilar1Data?.macro_sensitivity_matrix && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-gray-900 text-base">
                        Matriz de Sensibilidade Macroeconômica Multivariada
                      </h3>
                      <p className="text-xs text-gray-600">
                        Correlação linear de Pearson de cada modalidade de crédito com os principais indicadores do país:
                      </p>
                    </div>
                  </div>

                  <div className="table-wrapper shadow-xs">
                    <table>
                      <thead>
                        <tr>
                          <th>Modalidade</th>
                          <th>Selic (% a.a.)</th>
                          <th>Inflação (IPCA)</th>
                          <th>Desemprego</th>
                          <th>Atividade (IBC-Br)</th>
                          <th>Comprometimento Renda</th>
                          <th>Endividamento Famílias</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-xs">
                        {pilar1Data.macro_sensitivity_matrix.map((row: any) => (
                          <tr key={row.target} className={selectedModality === row.target ? "bg-[#fff5f5] font-semibold" : ""}>
                            <td className="font-sans font-medium text-gray-900">
                              {row.label}
                            </td>
                            <td className={row.correlations.selic_anualizada > 0.4 ? "text-[#f56a6a] font-bold" : "text-gray-700"}>
                              {row.correlations.selic_anualizada > 0 ? `+${row.correlations.selic_anualizada}` : row.correlations.selic_anualizada}
                            </td>
                            <td className="text-gray-700">
                              {row.correlations.ipca_12m > 0 ? `+${row.correlations.ipca_12m}` : row.correlations.ipca_12m}
                            </td>
                            <td className={row.correlations.desemprego_pnad > 0.4 ? "text-rose-700 font-bold" : "text-gray-700"}>
                              {row.correlations.desemprego_pnad > 0 ? `+${row.correlations.desemprego_pnad}` : row.correlations.desemprego_pnad}
                            </td>
                            <td className="text-gray-700">
                              {row.correlations.ibc_br_dessaz > 0 ? `+${row.correlations.ibc_br_dessaz}` : row.correlations.ibc_br_dessaz}
                            </td>
                            <td className={row.correlations.comprometimento_renda > 0.6 ? "text-rose-700 font-bold bg-rose-50" : "text-gray-700"}>
                              {row.correlations.comprometimento_renda > 0 ? `+${row.correlations.comprometimento_renda}` : row.correlations.comprometimento_renda}
                            </td>
                            <td className={row.correlations.endividamento_familias > 0.6 ? "text-rose-700 font-bold bg-rose-50" : "text-gray-700"}>
                              {row.correlations.endividamento_familias > 0 ? `+${row.correlations.endividamento_familias}` : row.correlations.endividamento_familias}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  <div className="mt-2 text-xs text-gray-500 font-sans italic">
                    💡 <strong>Insight Chave:</strong> O Cartão Rotativo tem correlação recorde com o <strong>Comprometimento de Renda (+0.8331)</strong> e com o <strong>Endividamento (+0.8030)</strong>, provando que o endividamento prévio das famílias atua como o principal catalisador para o calote no rotativo.
                  </div>
                </div>
              )}

              {/* 1.4 Linha do Tempo dos 5 Grandes Ciclos Econômicos */}
              {pilar1Data?.economic_cycles && (
                <div className="space-y-4">
                  <div>
                    <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
                      <History className="w-4 h-4 text-[#f56a6a]" />
                      Linha do Tempo dos Ciclos de Crédito &amp; Choques Macroeconômicos
                    </h3>
                    <p className="text-xs text-gray-600">
                      Como os choques históricos da Selic, inflação e emprego se desdobraram no Sistema Financeiro Nacional:
                    </p>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {pilar1Data.economic_cycles.map((cycle: any, idx: number) => (
                      <div
                        key={idx}
                        className="p-5 bg-white border-2 border-gray-200 rounded-lg shadow-xs flex flex-col justify-between hover:border-gray-400 transition-colors"
                      >
                        <div>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-[11px] font-mono font-bold text-[#f56a6a]">
                              {cycle.periodo}
                            </span>
                            <span className="text-[10px] uppercase font-bold px-2 py-0.5 rounded bg-gray-100 text-gray-700 border border-gray-300">
                              {cycle.status_risco}
                            </span>
                          </div>

                          <h4 className="font-serif font-bold text-gray-900 text-sm mb-3">
                            {cycle.titulo}
                          </h4>

                          <div className="space-y-1.5 font-mono text-[11px] text-gray-600 mb-3 bg-gray-50 p-2.5 rounded border border-gray-100">
                            <div><span className="text-gray-400 font-sans">Selic Média:</span> <span className="font-bold text-gray-900">{cycle.selic_media}</span></div>
                            <div><span className="text-gray-400 font-sans">IPCA Pico:</span> <span className="font-bold text-gray-900">{cycle.ipca_pico}</span></div>
                            <div><span className="text-gray-400 font-sans">Mercado Trabalho:</span> <span className="font-bold text-gray-900">{cycle.desemprego}</span></div>
                          </div>

                          <p className="text-xs text-gray-600 leading-relaxed font-sans mb-3">
                            {cycle.dinamica_credito}
                          </p>
                        </div>

                        <div className="pt-2 border-t border-gray-100 text-[11px] font-sans font-semibold text-gray-800">
                          🎯 <span className="text-gray-500 font-normal">Impacto Central:</span> {cycle.impacto_principal}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* 1.5 Matriz Econométrica de Defasagem (Lags) */}
              {pilar1Data && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-gray-900 text-base">
                        Matriz Econométrica de Defasagem (Lags) &amp; Backtesting Walk-Forward
                      </h3>
                      <p className="text-xs text-gray-600">
                        Comparativo preditivo do modelo regularizado <strong>Ridge AR-X</strong> vs. <strong>Naive Baseline</strong> (Random Walk):
                      </p>
                    </div>
                    <span className="text-xs font-mono text-gray-500 hidden sm:inline-block">
                      Walk-Forward • Horizonte: 3 Meses
                    </span>
                  </div>

                  <div
                    tabIndex={0}
                    role="region"
                    aria-label="Tabela de Defasagem Temporal da Selic"
                    className="table-wrapper shadow-xs"
                  >
                    <table>
                      <thead>
                        <tr>
                          <th>Modalidade</th>
                          <th>Pico de Defasagem</th>
                          <th>Correlação no Pico</th>
                          <th>RMSE Naive (Base)</th>
                          <th>RMSE Ridge (AR-X)</th>
                          <th>Ganho vs. Base</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-xs">
                        {pilar1Data.lag_summary_comparison.map((row: any) => (
                          <tr
                            key={row.target}
                            className={selectedModality === row.target ? "bg-[#fff5f5] font-semibold" : ""}
                          >
                            <td className="font-sans font-medium text-gray-900">
                              {row.label}
                            </td>
                            <td>
                              <span className="inline-block px-2 py-0.5 rounded bg-gray-100 text-gray-800 font-bold border border-gray-300">
                                {row.peak_lag_months} meses
                              </span>
                            </td>
                            <td className="text-gray-900 font-bold">{row.peak_correlation}</td>
                            <td className="text-gray-500">{row.naive_rmse}</td>
                            <td className="text-[#f56a6a] font-bold">{row.ridge_rmse}</td>
                            <td>
                              <span
                                className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                                  row.ridge_improvement_pct > 0
                                    ? "bg-emerald-100 text-emerald-800"
                                    : "bg-gray-100 text-gray-600"
                                }`}
                              >
                                {row.ridge_improvement_pct > 0
                                  ? `+${row.ridge_improvement_pct}%`
                                  : `${row.ridge_improvement_pct}%`}
                              </span>
                            </td>
                            <td className="font-sans">
                              <button
                                onClick={() => setSelectedModality(row.target)}
                                className="text-xs text-[#f56a6a] hover:underline font-bold uppercase tracking-wider"
                              >
                                Selecionar
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 1.6 Selected Modality Deep-Dive (HTML5 UP Spotlight Style) */}
              {modData && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-2">
                    <div>
                      <span className="text-xs font-semibold uppercase tracking-wider text-[#f56a6a]">
                        Análise Aprofundada
                      </span>
                      <h3 className="text-xl font-serif font-bold text-gray-900">
                        {modData.label}
                      </h3>
                    </div>
                    <div className="text-xs font-mono bg-gray-100 px-3 py-1 rounded text-gray-700 border border-gray-300 self-start sm:self-auto">
                      Pico em {modData.cross_correlation.peak_lag_months} meses (r ={" "}
                      {modData.cross_correlation.peak_correlation})
                    </div>
                  </div>

                  {/* Horizontal Bar Chart for Cross-Correlation */}
                  <div className="space-y-2">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans mb-3">
                      Curva de Correlação Cruzada (CCF: Selic(t) vs. Inadimplência(t + k))
                    </h4>

                    {modData.cross_correlation.lags.slice(0, 13).map((lag: number) => {
                      const corr = modData.cross_correlation.correlations[lag];
                      const width = Math.min(Math.abs(corr) * 100, 100);
                      const isPeak = lag === modData.cross_correlation.peak_lag_months;

                      return (
                        <div key={lag} className="flex items-center gap-3 text-xs font-mono">
                          <span className="w-14 text-gray-500">t + {lag}m</span>
                          <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden border border-gray-200">
                            <div
                              style={{ width: `${width}%` }}
                              className={`h-full transition-all ${
                                isPeak ? "bg-[#f56a6a]" : "bg-gray-400"
                              }`}
                            />
                          </div>
                          <span
                            className={`w-14 text-right font-bold ${
                              isPeak ? "text-[#f56a6a]" : "text-gray-600"
                            }`}
                          >
                            {corr > 0 ? `+${corr}` : corr}
                          </span>
                        </div>
                      );
                    })}
                  </div>

                  {/* Econometric Note */}
                  <div className="p-4 bg-[#f8f9fa] border-l-4 border-[#f56a6a] rounded text-xs text-gray-700 leading-relaxed font-sans">
                    <strong>Interpretação para o Comitê de Risco:</strong> O pico de defasagem de{" "}
                    <strong>{modData.cross_correlation.peak_lag_months} meses</strong> indica o tempo médio necessário para que decisões do COPOM se manifestem plenamente no atraso superior a 90 dias desta carteira. Na validação Walk-Forward, o modelo linear regularizado Ridge AR-X capturou as inflexões cíclicas superando a persistência aleatória.
                  </div>
                </div>
              )}
            </section>
          )}

          {/* ======================================================== */}
          {/* PILAR 2: 10 MAIORES BANCOS DO BRASIL (RI & IFRS 9)       */}
          {/* ======================================================== */}
          {activeTab === "pilar2" && (
            <section className="space-y-12 animate-fadeIn">
              <div>
                <h2 className="major-heading text-xl sm:text-2xl text-gray-900">
                  2. Raio-X dos Maiores Bancos &amp; Neobancos (IFRS 9 / CMN 4.966)
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                  Análise comparativa aprofundada com base nas demonstrações contábeis auditadas (2018–2025) e dados oficiais extraídos diretamente dos <strong>Releases de Resultados das Relações com Investidores (RI)</strong> dos maiores bancos tradicionais e neobancos do Brasil (incluindo Itaú, BB, Bradesco, Caixa, Santander, BTG, Nubank, Safra, BV, Banrisul e Inter). Inclui simulação de estresse prospectivo de <strong>migração de estágios de risco de crédito</strong> e impacto no Capital Regulatório de Basileia.
                </p>
              </div>

              {/* 2.1 Tabela Comparativa de Benchmark dos Bancos & Neobancos */}
              {pilar2Data && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-[#f56a6a]" />
                        Ranking Comparativo de Crédito, Solvência e Risco (RI Benchmark)
                      </h3>
                      <p className="text-xs text-gray-600">
                        Indicadores regulatórios oficiais dos maiores conglomerados bancários e instituições financeiras do Brasil:
                      </p>
                    </div>
                    <span className="text-xs font-mono text-gray-500 hidden sm:inline-block">
                      Posição Consolidada mais recente
                    </span>
                  </div>

                  <div tabIndex={0} role="region" aria-label="Ranking dos 10 Maiores Bancos" className="table-wrapper shadow-xs">
                    <table>
                      <thead>
                        <tr>
                          <th>Instituição</th>
                          <th>Ticker / Tipo</th>
                          <th>Carteira de Crédito</th>
                          <th>NPL 90+</th>
                          <th>Cobertura</th>
                          <th>Basileia Atual</th>
                          <th>Capital CET1</th>
                          <th>Custo Crédito</th>
                          <th>ROE Atual</th>
                          <th>Basileia Estressada</th>
                          <th>Ação</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-xs">
                        {Object.keys(pilar2Data.banks).map((bName) => {
                          const b = pilar2Data.banks[bName];
                          const rm = b.ri_metrics;
                          const st = b.stress_test;
                          const latest = b.historico[b.historico.length - 1];
                          const isSelected = selectedBank === bName;
                          const theme = getBankTheme(bName);

                          return (
                            <tr
                              key={bName}
                              className={`transition-colors ${isSelected ? "font-semibold" : "hover:bg-slate-50"}`}
                              style={
                                isSelected && theme
                                  ? { backgroundColor: theme.accentLight, borderLeft: `4px solid ${theme.primary}` }
                                  : isSelected
                                  ? { backgroundColor: "#fff5f5" }
                                  : {}
                              }
                            >
                              <td className="font-sans font-medium text-gray-900 flex items-center gap-2">
                                {theme ? (
                                  <span
                                    className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                                    style={{ backgroundColor: theme.primary }}
                                    title={`Cor característica oficial: ${theme.name}`}
                                  />
                                ) : (
                                  <span
                                    className={`w-2 h-2 rounded-full ${
                                      rm.inadimplencia_npl90_pct < 3.0
                                        ? "bg-emerald-500"
                                        : rm.inadimplencia_npl90_pct < 4.5
                                        ? "bg-amber-500"
                                        : "bg-rose-500"
                                    }`}
                                  />
                                )}
                                <span className={isSelected && theme ? "font-bold text-gray-900" : ""}>{bName}</span>
                              </td>
                              <td className="font-sans text-gray-500 text-[11px]">
                                {theme ? (
                                  <span
                                    className="font-bold px-1.5 py-0.5 rounded text-[10px] font-mono border inline-block"
                                    style={{
                                      backgroundColor: theme.badgeBg,
                                      color: theme.badgeText,
                                      borderColor: theme.borderColor,
                                    }}
                                  >
                                    {b.ticker}
                                  </span>
                                ) : (
                                  <span className="font-bold text-gray-800">{b.ticker}</span>
                                )}
                                <span className="ml-1.5 text-gray-400">•</span> {b.tipo.split("/")[0]}
                              </td>
                              <td className="font-bold text-gray-900">
                                R$ {rm.carteira_credito_expandida_bi} bi
                              </td>
                              <td className={rm.inadimplencia_npl90_pct < 2.5 ? "text-emerald-700 font-bold" : rm.inadimplencia_npl90_pct > 4.5 ? "text-rose-700 font-bold" : "text-gray-900"}>
                                {rm.inadimplencia_npl90_pct}%
                              </td>
                              <td className="text-gray-800">
                                {rm.indice_cobertura_pct}%
                              </td>
                              <td className="text-gray-900 font-bold">
                                {rm.indice_basileia_pct}%
                              </td>
                              <td className="text-gray-600">
                                {rm.capital_cet1_pct}%
                              </td>
                              <td className="text-gray-600">
                                {rm.custo_credito_pct}%
                              </td>
                              <td className={latest.roe_pct >= 15 ? "text-emerald-700 font-bold" : "text-gray-900"}>
                                {latest.roe_pct}%
                              </td>
                              <td>
                                <span className={`px-2 py-0.5 rounded text-[11px] font-bold ${st.solvente_acima_minimo_cmn ? "bg-emerald-100 text-emerald-800" : "bg-rose-100 text-rose-800"}`}>
                                  {st.basileia_estressado_pct}% ({st.alerta_capital})
                                </span>
                              </td>
                              <td className="font-sans">
                                <button
                                  onClick={() => setSelectedBank(bName)}
                                  className="text-xs hover:underline font-bold uppercase tracking-wider"
                                  style={{ color: theme ? theme.primary : "#f56a6a" }}
                                >
                                  Inspecionar
                                </button>
                              </td>
                            </tr>
                          );
                        })}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}

              {/* 2.2 Grid de Seleção das Instituições Financeiras */}
              {pilar2Data && (
                <div>
                  <h3 className="font-serif font-bold text-gray-900 text-sm mb-3">
                    Selecione uma Instituição para Análise Aprofundada de RI:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-3">
                    {Object.keys(pilar2Data.banks).map((bName) => {
                      const b = pilar2Data.banks[bName];
                      const rm = b.ri_metrics;
                      const isSelected = selectedBank === bName;
                      const theme = getBankTheme(bName);

                      return (
                        <div
                          key={bName}
                          onClick={() => setSelectedBank(bName)}
                          className="p-3.5 rounded-lg border-2 cursor-pointer transition-all bg-white relative overflow-hidden group hover:shadow-md"
                          style={
                            isSelected && theme
                              ? {
                                  borderColor: theme.primary,
                                  boxShadow: `0 4px 14px ${theme.accentBorder}`,
                                  backgroundColor: "#ffffff",
                                }
                              : theme
                              ? {
                                  borderColor: "#E2E8F0",
                                }
                              : {}
                          }
                        >
                          {/* Barra superior de destaque na cor da marca do banco */}
                          <div
                            className="absolute top-0 left-0 right-0 transition-all"
                            style={{
                              backgroundColor: theme ? theme.primary : "#94A3B8",
                              height: isSelected ? "3px" : "2px",
                            }}
                          />

                          <div className="flex justify-between items-start mb-1.5 pt-0.5">
                            <div className="flex items-center gap-1.5 min-w-0">
                              {theme && (
                                <span
                                  className="w-2 h-2 rounded-full shrink-0"
                                  style={{ backgroundColor: theme.primary }}
                                />
                              )}
                              <h4 className="font-serif font-bold text-gray-900 text-xs truncate max-w-[105px]">
                                {bName}
                              </h4>
                            </div>
                            {theme ? (
                              <span
                                className="text-[9px] font-mono font-bold px-1.5 py-0.2 rounded border shrink-0"
                                style={{
                                  backgroundColor: theme.badgeBg,
                                  color: theme.badgeText,
                                  borderColor: theme.borderColor,
                                }}
                              >
                                {b.ticker}
                              </span>
                            ) : (
                              <span className="text-[9px] font-mono font-bold text-[#f56a6a] bg-rose-50 px-1 rounded">
                                {b.ticker}
                              </span>
                            )}
                          </div>
                          <div className="space-y-1 font-mono text-[11px] text-gray-600">
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-sans">Carteira:</span>
                              <span className="font-bold text-gray-900">R$ {rm.carteira_credito_expandida_bi}b</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-sans">NPL 90+:</span>
                              <span className={rm.inadimplencia_npl90_pct < 2.5 ? "text-emerald-700 font-bold" : "text-gray-800"}>
                                {rm.inadimplencia_npl90_pct}%
                              </span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-gray-400 font-sans">Basileia:</span>
                              <span className="font-bold text-gray-900">{rm.indice_basileia_pct}%</span>
                            </div>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}

              {/* 2.3 Deep-Dive do Banco Selecionado */}
              {bankData && (() => {
                const bankTheme = getBankTheme(selectedBank);

                return (
                  <div className="space-y-6">
                    {/* Spotlight Header */}
                    <div
                      className="bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs relative overflow-hidden"
                      style={bankTheme ? { borderTop: `5px solid ${bankTheme.primary}` } : {}}
                    >
                      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-3">
                        <div>
                          <div className="flex items-center gap-2 mb-1 flex-wrap">
                            <span
                              className="text-xs font-semibold uppercase tracking-wider flex items-center gap-1.5"
                              style={{ color: bankTheme ? bankTheme.primary : "#f56a6a" }}
                            >
                              {bankTheme && (
                                <span
                                  className="w-2.5 h-2.5 rounded-full inline-block"
                                  style={{ backgroundColor: bankTheme.primary }}
                                />
                              )}
                              Relatório Executivo de RI
                            </span>
                            {bankTheme ? (
                              <span
                                className="text-xs font-mono px-2 py-0.5 rounded font-bold border"
                                style={{
                                  backgroundColor: bankTheme.badgeBg,
                                  color: bankTheme.badgeText,
                                  borderColor: bankTheme.borderColor,
                                }}
                              >
                                Ticker: {bankData.ticker}
                              </span>
                            ) : (
                              <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold border border-gray-300">
                                Ticker: {bankData.ticker}
                              </span>
                            )}
                            <span className="text-xs font-mono text-gray-500">
                              CNPJ: {bankData.cnpj}
                            </span>
                          </div>
                          <h3 className="text-2xl font-serif font-bold text-gray-900 flex items-center gap-2.5">
                            <span>{selectedBank}</span>
                            {bankTheme && (
                              <span
                                className="text-[11px] font-sans font-bold px-2 py-0.5 rounded-full border hidden sm:inline-block"
                                style={{
                                  backgroundColor: bankTheme.badgeBg,
                                  color: bankTheme.badgeText,
                                  borderColor: bankTheme.borderColor,
                                }}
                              >
                                Identidade Visual: {bankTheme.name}
                              </span>
                            )}
                          </h3>
                        </div>

                        <a
                          href={bankData.ri_url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded text-xs font-sans font-bold border transition-all self-start sm:self-auto hover:opacity-90 shadow-xs"
                          style={
                            bankTheme
                              ? {
                                  backgroundColor: bankTheme.badgeBg,
                                  color: bankTheme.badgeText,
                                  borderColor: bankTheme.borderColor,
                                }
                              : { backgroundColor: "#f3f4f6", color: "#1f2937", borderColor: "#d1d5db" }
                          }
                        >
                          Portal de RI Oficial <ExternalLink className="w-3.5 h-3.5" />
                        </a>
                      </div>

                      <p
                        className="text-sm text-gray-700 leading-relaxed font-sans bg-gray-50 p-4 rounded-lg border-l-4"
                        style={bankTheme ? { borderLeftColor: bankTheme.primary } : { borderLeftColor: "#f56a6a" }}
                      >
                        <strong>Perfil Estratégico &amp; Risco de Crédito:</strong> {bankData.perfil_estrategico}
                      </p>

                    {/* 8 Cards de Métricas Granulares de RI */}
                    <div>
                      <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans mb-3">
                        Métricas Operacionais, Capital e Qualidade de Ativos (RI Consolidado)
                      </h4>
                      <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-8 gap-3 font-mono text-xs">
                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <span className="text-[10px] text-gray-400 font-sans block uppercase">Carteira Total</span>
                          <span className="text-base font-bold text-gray-900 block mt-1">R$ {bankData.ri_metrics.carteira_credito_expandida_bi} bi</span>
                        </div>

                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <span className="text-[10px] text-gray-400 font-sans block uppercase">NPL &gt; 90 dias</span>
                          <span className={`text-base font-bold block mt-1 ${bankData.ri_metrics.inadimplencia_npl90_pct < 2.5 ? "text-emerald-700" : "text-rose-700"}`}>
                            {bankData.ri_metrics.inadimplencia_npl90_pct}%
                          </span>
                        </div>

                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <span className="text-[10px] text-gray-400 font-sans block uppercase">NPL 15-90d</span>
                          <span className="text-base font-bold text-amber-700 block mt-1">{bankData.ri_metrics.inadimplencia_npl15_90_pct}%</span>
                        </div>

                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <span className="text-[10px] text-gray-400 font-sans block uppercase">Cobertura</span>
                          <span className="text-base font-bold text-gray-900 block mt-1">{bankData.ri_metrics.indice_cobertura_pct}%</span>
                        </div>

                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <span className="text-[10px] text-gray-400 font-sans block uppercase">Custo Crédito</span>
                          <span className="text-base font-bold text-gray-900 block mt-1">{bankData.ri_metrics.custo_credito_pct}% a.a.</span>
                        </div>

                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <span className="text-[10px] text-gray-400 font-sans block uppercase">Margem (NIM)</span>
                          <span className="text-base font-bold text-gray-900 block mt-1">{bankData.ri_metrics.margem_financeira_nim_pct}%</span>
                        </div>

                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <span className="text-[10px] text-gray-400 font-sans block uppercase">Eficiência</span>
                          <span className="text-base font-bold text-gray-900 block mt-1">{bankData.ri_metrics.indice_eficiencia_pct}%</span>
                        </div>

                        <div className="p-3 bg-white border border-gray-200 rounded-lg">
                          <span className="text-[10px] text-gray-400 font-sans block uppercase">Basileia / CET1</span>
                          <span className="text-base font-bold text-[#f56a6a] block mt-1">{bankData.ri_metrics.indice_basileia_pct}%</span>
                          <span className="text-[10px] text-gray-500 block">CET1: {bankData.ri_metrics.capital_cet1_pct}%</span>
                        </div>
                      </div>
                    </div>

                    {/* Segmentação da Carteira e Decomposição CMN 4.966 / IFRS 9 */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4 border-t border-gray-200">
                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans mb-3">
                          Composição da Carteira por Segmento de Tomador
                        </h4>
                        <div className="space-y-2 font-mono text-xs">
                          {Object.entries(bankData.ri_metrics.segmentacao_carteira).map(([seg, pct]: [string, any], segIdx: number) => {
                            const opacityVal = Math.max(0.45, 1 - segIdx * 0.14);
                            return (
                              <div key={seg} className="flex items-center gap-3">
                                <span className="w-40 text-gray-600 font-sans truncate capitalize">
                                  {seg.replace("_pct", "").replace(/_/g, " ")}:
                                </span>
                                <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden border border-gray-200">
                                  <div
                                    style={{
                                      width: `${pct}%`,
                                      backgroundColor: bankTheme ? bankTheme.primary : "#334155",
                                      opacity: bankTheme ? opacityVal : 1,
                                    }}
                                    className="h-full rounded-r transition-all"
                                  />
                                </div>
                                <span className="w-12 text-right font-bold text-gray-900">{pct}%</span>
                              </div>
                            );
                          })}
                        </div>
                      </div>

                      <div>
                        <h4 className="text-xs font-bold uppercase tracking-wider text-gray-500 font-sans mb-3">
                          Estágios de Risco de Crédito (Resolução CMN nº 4.966 / IFRS 9)
                        </h4>
                        <div className="space-y-2 font-mono text-xs">
                          <div className="flex items-center gap-3">
                            <span className="w-44 text-gray-700 font-sans">Estágio 1 (Risco Normal - 12m):</span>
                            <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden border border-gray-200">
                              <div style={{ width: `${bankData.ri_metrics.cmn_4966_estagios.estagio_1_pct}%` }} className="h-full bg-emerald-600" />
                            </div>
                            <span className="w-12 text-right font-bold text-emerald-700">{bankData.ri_metrics.cmn_4966_estagios.estagio_1_pct}%</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="w-44 text-gray-700 font-sans">Estágio 2 (SICR - Lifetime ECL):</span>
                            <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden border border-gray-200">
                              <div style={{ width: `${bankData.ri_metrics.cmn_4966_estagios.estagio_2_sicr_pct}%` }} className="h-full bg-amber-500" />
                            </div>
                            <span className="w-12 text-right font-bold text-amber-700">{bankData.ri_metrics.cmn_4966_estagios.estagio_2_sicr_pct}%</span>
                          </div>

                          <div className="flex items-center gap-3">
                            <span className="w-44 text-gray-700 font-sans">Estágio 3 (Inadimplente / Default):</span>
                            <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden border border-gray-200">
                              <div style={{ width: `${bankData.ri_metrics.cmn_4966_estagios.estagio_3_default_pct}%` }} className="h-full bg-rose-600" />
                            </div>
                            <span className="w-12 text-right font-bold text-rose-700">{bankData.ri_metrics.cmn_4966_estagios.estagio_3_default_pct}%</span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Historical Table & Stress Test Simulator */}
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    {/* Historical Table */}
                    <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 space-y-4 shadow-xs">
                      <h3 className="font-serif font-bold text-gray-900 text-base flex justify-between items-center">
                        <span className="flex items-center gap-2">
                          {bankTheme && (
                            <span
                              className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
                              style={{ backgroundColor: bankTheme.primary }}
                            />
                          )}
                          <span>Série Histórica Contábil Auditada: {selectedBank}</span>
                        </span>
                        <span className="text-xs font-mono text-gray-500 font-normal">
                          Valores em R$ Bilhões (2018–2026 • 1S26 / 2T26)
                        </span>
                      </h3>

                      <div tabIndex={0} role="region" aria-label="Tabela Histórica do Banco" className="table-wrapper shadow-xs">
                        <table>
                          <thead>
                            <tr>
                              <th>Ano / Período</th>
                              <th>Ativo Total</th>
                              <th>Patr. Líquido</th>
                              <th>Lucro Líquido</th>
                              <th>Desp. Captação</th>
                              <th>ROE</th>
                            </tr>
                          </thead>
                          <tbody className="font-mono text-xs">
                            {bankData.historico.map((h: any) => (
                              <tr key={h.ano}>
                                <td className="font-bold text-gray-900">
                                  {h.ano === 2026 ? (
                                    <span className="flex items-center gap-1.5">
                                      <span>2026</span>
                                      <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                                        1S26
                                      </span>
                                    </span>
                                  ) : (
                                    h.ano
                                  )}
                                </td>
                                <td>R$ {h.ativo_total_bi} bi</td>
                                <td>R$ {h.patrimonio_liquido_bi} bi</td>
                                <td className="text-emerald-700 font-bold">R$ {h.lucro_liquido_bi} bi</td>
                                <td className="text-gray-600">R$ {h.despesas_captacao_bi} bi</td>
                                <td className="font-bold text-gray-900">{h.roe_pct}%</td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                    </div>

                    {/* Stress Testing Box (Stage Migration CMN 4.966) */}
                    <div
                      className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4 flex flex-col justify-between shadow-xs"
                      style={bankTheme ? { borderTop: `4px solid ${bankTheme.primary}` } : {}}
                    >
                      <div>
                        <div
                          className="text-xs uppercase tracking-wider font-bold mb-1"
                          style={{ color: bankTheme ? bankTheme.primary : "#f56a6a" }}
                        >
                          Simulador de Estresse Prospectivo
                        </div>
                        <h3 className="font-serif font-bold text-gray-900 text-base mb-3">
                          Migração de Estágios CMN 4.966
                        </h3>

                        <div className="space-y-2.5 font-mono text-xs">
                          <div className="p-3 bg-gray-50 rounded border border-gray-200">
                            <span className="text-gray-500 block text-[11px] font-sans">
                              Cenário Regulatório Severo:
                            </span>
                            <span className="font-bold text-gray-900 mt-0.5 block font-sans text-xs">
                              12% E1 → E2 (Lifetime) &amp; 20% E2 → E3 (Default)
                            </span>
                          </div>

                          <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                            <span className="text-gray-600 font-sans">PDD Adicional:</span>
                            <span className="text-rose-700 font-bold">
                              -R$ {bankData.stress_test.perda_adicional_estimada_bi} bi
                            </span>
                          </div>

                          <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                            <span className="text-gray-600 font-sans">Lucro Pós-Choque:</span>
                            <span className={`font-bold ${bankData.stress_test.lucro_pos_choque_bi >= 0 ? "text-emerald-700" : "text-rose-700"}`}>
                              R$ {bankData.stress_test.lucro_pos_choque_bi} bi
                            </span>
                          </div>

                          <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                            <span className="text-gray-600 font-sans">Consumo Basileia:</span>
                            <span className="text-amber-800 font-bold">
                              -{bankData.stress_test.consumo_capital_bps} bps
                            </span>
                          </div>

                          <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                            <span className="text-gray-600 font-sans">Basileia Pós-Choque:</span>
                            <span
                              className="font-bold text-sm"
                              style={{ color: bankTheme ? bankTheme.primary : "#f56a6a" }}
                            >
                              {bankData.stress_test.basileia_estressado_pct}%
                            </span>
                          </div>

                          <div className="p-2.5 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                            <span className="text-gray-600 font-sans">Status Prudencial:</span>
                            <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${bankData.stress_test.solvente_acima_minimo_cmn ? "bg-emerald-100 text-emerald-800 border border-emerald-300" : "bg-rose-100 text-rose-800 border border-rose-300"}`}>
                              {bankData.stress_test.alerta_capital.toUpperCase()} (&gt; 11% BACEN)
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-[11px] text-gray-500 font-sans leading-relaxed border-t border-gray-200 pt-3">
                        Simula a necessidade de provisão contra perda esperada de longo prazo e absorção pelo Patrimônio de Referência, conforme as diretrizes do Acordo de Basileia III e CMN 4.966.
                      </p>
                    </div>
                  </div>
                </div>
              );
            })()}
            </section>
          )}

          {/* ======================================================== */}
          {/* PILAR 3: EARLY WARNING DE CRÉDITO CORPORATIVO (CVM)      */}
          {/* ======================================================== */}
          {activeTab === "pilar3" && (
            <section className="space-y-10 animate-fadeIn">
              <div>
                <h2 className="major-heading text-xl sm:text-2xl text-gray-900">
                  3. Early Warning de Crédito Corporativo (CVM)
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                  Painel analítico alimentado por <strong>3.492 demonstrações contábeis auditadas (DFPs da CVM)</strong> de companhias abertas na B3 (2018–2025). O modelo <strong>XGBoost Calibrado com TreeSHAP</strong> sintetiza 12 variáveis contábeis no <strong>Fator Consolidado de Risco</strong> (Score Ponderado de 0 a 100), submetido a <strong>teste cego Out-of-Time (2022–2025)</strong> durante o ciclo de juros elevados da Selic.
                </p>
              </div>

              {/* Regulatory Metrics Grid */}
              {pilar3Data && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-white border-2 border-gray-200 rounded-lg">
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                      ROC-AUC (OOT 2022-2025)
                    </span>
                    <div className="text-3xl font-serif font-bold text-[#f56a6a]">
                      {pilar3Data.oot_backtesting_metrics.calibrated_xgboost.roc_auc}
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono mt-1 block">
                      Linear Baseline: {pilar3Data.oot_backtesting_metrics.logistic_regression.roc_auc}
                    </span>
                  </div>

                  <div className="p-5 bg-white border-2 border-gray-200 rounded-lg">
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                      Estatística KS
                    </span>
                    <div className="text-3xl font-serif font-bold text-gray-900">
                      {pilar3Data.oot_backtesting_metrics.calibrated_xgboost.ks_stat}
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono mt-1 block">
                      Discriminação Solvente vs. Calote
                    </span>
                  </div>

                  <div className="p-5 bg-white border-2 border-gray-200 rounded-lg">
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                      Coeficiente Gini
                    </span>
                    <div className="text-3xl font-serif font-bold text-gray-900">
                      {pilar3Data.oot_backtesting_metrics.calibrated_xgboost.gini}
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono mt-1 block">
                      Aderência Regulatória Basileia
                    </span>
                  </div>

                  <div className="p-5 bg-white border-2 border-gray-200 rounded-lg">
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                      Brier Score (Calibração)
                    </span>
                    <div className="text-3xl font-serif font-bold text-emerald-700">
                      {pilar3Data.oot_backtesting_metrics.calibrated_xgboost.brier_score}
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono mt-1 block">
                      Precisão Probabilística IFRS 9
                    </span>
                  </div>
                </div>
              )}

              {/* PAINEL DE FATOR CONSOLIDADO E MATRIZ DE PESOS GLOBAIS */}
              {pilar3Data && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-gray-200 pb-4">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold tracking-wider text-[#f56a6a]">
                          Ponderação Multidimensional
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                          TreeSHAP Normalized Weights
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-gray-900 text-lg sm:text-xl mt-1">
                        Fator Consolidado: Matriz de Pesos Globais do Modelo
                      </h3>
                    </div>

                    <button
                      onClick={() => setShowWeightsDetails(!showWeightsDetails)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold bg-gray-50 hover:bg-gray-100 text-gray-700 border border-gray-300 rounded transition"
                    >
                      <SlidersHorizontal className="w-3.5 h-3.5 text-[#f56a6a]" />
                      {showWeightsDetails ? "Ocultar Metodologia de Pesos" : "Exibir Metodologia de Pesos"}
                    </button>
                  </div>

                  {showWeightsDetails && (
                    <div className="space-y-6">
                      {/* Explicação da Fórmula do Fator Consolidado */}
                      <div className="bg-slate-50 border border-slate-200 rounded-lg p-5 space-y-3 font-sans text-xs">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                          <div>
                            <span className="font-bold text-gray-900 text-sm block">
                              Como o Fator Consolidado é calculado?
                            </span>
                            <p className="text-gray-600 mt-1 leading-relaxed max-w-2xl">
                              O <strong>Fator Consolidado</strong> sintetiza os 12 indicadores contábeis da CVM em um score único de 0 a 100. Cada fator possui um peso global relativo ($w_k$) determinado pela magnitude média de impacto marginal no algoritmo ($\sum w_k = 100\%$). Para cada balanço auditado, a combinação das forças de solvência e das pressões de juros determina a classificação final.
                            </p>
                          </div>
                          <div className="bg-white border border-gray-300 rounded p-3 font-mono text-[11px] text-gray-800 shrink-0">
                            <span className="text-gray-500 block text-[10px] uppercase font-sans font-bold">
                              Fórmula do Escore Sintético:
                            </span>
                            <span className="text-[#f56a6a] font-bold">
                              Score = &sum;<sub>k=1..12</sub> (w<sub>k</sub> &times; &phi;<sub>k</sub>(x)) &rarr; PD (%)
                            </span>
                          </div>
                        </div>

                        {/* Escala de Cores do Fator Consolidado */}
                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 pt-2 border-t border-slate-200">
                          <div className="p-2 bg-emerald-50 border border-emerald-200 rounded">
                            <span className="text-[10px] uppercase font-bold text-emerald-800 block">
                              0 a 15 • Sólido
                            </span>
                            <span className="text-[11px] text-emerald-900 font-bold">Grau de Investimento (AAA/AA)</span>
                          </div>
                          <div className="p-2 bg-blue-50 border border-blue-200 rounded">
                            <span className="text-[10px] uppercase font-bold text-blue-800 block">
                              15 a 40 • Moderado
                            </span>
                            <span className="text-[11px] text-blue-900 font-bold">Solvência Monitorada (A/BBB)</span>
                          </div>
                          <div className="p-2 bg-amber-50 border border-amber-200 rounded">
                            <span className="text-[10px] uppercase font-bold text-amber-800 block">
                              40 a 70 • Alerta Alto
                            </span>
                            <span className="text-[11px] text-amber-900 font-bold">Vulnerabilidade a Juros (BB/B)</span>
                          </div>
                          <div className="p-2 bg-rose-50 border border-rose-200 rounded">
                            <span className="text-[10px] uppercase font-bold text-rose-800 block">
                              70 a 100 • Distress
                            </span>
                            <span className="text-[11px] text-rose-900 font-bold">Risco Iminente / RJ (CCC)</span>
                          </div>
                        </div>
                      </div>

                      {/* Tabela Interativa de Pesos Globais */}
                      <div tabIndex={0} role="region" aria-label="Matriz de Pesos Globais" className="table-wrapper shadow-xs">
                        <table>
                          <thead>
                            <tr>
                              <th>Rank</th>
                              <th>Fator de Risco Contábil</th>
                              <th>Categoria</th>
                              <th>Peso Global (%)</th>
                              <th>Importância TreeSHAP</th>
                              <th>Gatilho / Limite Prudencial</th>
                              <th>Ação</th>
                            </tr>
                          </thead>
                          <tbody className="font-mono text-xs">
                            {pilar3Data.pesos_globais_modelo?.map((item: any, idx: number) => {
                              const isSelected = selectedRiskFactor === item.key;
                              return (
                                <tr
                                  key={item.key}
                                  className={isSelected ? "bg-amber-50/60 font-bold" : ""}
                                >
                                  <td className="text-gray-500">{idx + 1}º</td>
                                  <td className="font-sans font-bold text-gray-900">
                                    <div className="flex items-center gap-2">
                                      <span>{item.nome}</span>
                                      {idx === 0 && (
                                        <span className="px-1.5 py-0.5 rounded text-[9px] bg-[#f56a6a]/10 text-[#f56a6a] uppercase font-bold">
                                          Maior Peso
                                        </span>
                                      )}
                                    </div>
                                    <span className="text-[11px] text-gray-500 font-normal block font-sans">
                                      {item.descricao}
                                    </span>
                                  </td>
                                  <td className="font-sans">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700">
                                      {item.categoria}
                                    </span>
                                  </td>
                                  <td>
                                    <div className="flex items-center gap-2">
                                      <div className="w-24 bg-gray-200 rounded h-2.5 overflow-hidden">
                                        <div
                                          style={{ width: `${item.peso_pct}%` }}
                                          className="h-full bg-[#f56a6a]"
                                        />
                                      </div>
                                      <span className="font-bold text-gray-900">{item.peso_pct}%</span>
                                    </div>
                                  </td>
                                  <td className="text-gray-600">{item.mean_abs_shap}</td>
                                  <td className="font-sans text-gray-600 text-[11px]">
                                    <span className="text-amber-800 font-bold block">{item.benchmark_alerta}</span>
                                    <span className="text-[10px] text-gray-500">{item.direcao_economica}</span>
                                  </td>
                                  <td>
                                    <button
                                      onClick={() => setSelectedRiskFactor(item.key)}
                                      className={`px-2.5 py-1 rounded text-[11px] font-sans font-bold transition ${
                                        isSelected
                                          ? "bg-[#f56a6a] text-white"
                                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      {isSelected ? "Filtrado" : "Filtrar"}
                                    </button>
                                  </td>
                                </tr>
                              );
                            })}
                          </tbody>
                        </table>
                      </div>
                    </div>
                  )}
                </div>
              )}

              {/* SCANNER DE EMPRESAS DA B3 COM FILTROS MULTIDIMENSIONAIS */}
              {pilar3Data && (
                <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
                  {/* Cabeçalho do Scanner */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-200 pb-5">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs uppercase font-bold tracking-wider text-[#f56a6a]">
                          Monitoramento Contábil Prospectivo
                        </span>
                        <span className="text-[10px] bg-slate-100 text-slate-800 px-2 py-0.5 rounded font-mono font-bold">
                          Bancos + Grandes Corporações
                        </span>
                      </div>
                      <h3 className="font-serif font-bold text-gray-900 text-lg sm:text-xl mt-1">
                        Scanner da B3: Bancos, Instituições Financeiras e Maiores Empresas
                      </h3>
                      <p className="text-xs text-gray-600 font-sans mt-0.5">
                        Exibindo <strong>{filteredCompanies.length}</strong> de {pilar3Data.sample_companies_monitor?.length} balanços auditados (DFP CVM 2022–2025).
                      </p>
                    </div>

                    {/* Botão de Limpar Filtros quando algum filtro estiver ativo */}
                    {(selectedRiskFactor !== "all" ||
                      selectedRating !== "all" ||
                      selectedYear !== "all" ||
                      selectedSegment !== "all" ||
                      onlyTopLatestYear ||
                      searchCompany !== "") && (
                      <button
                        onClick={() => {
                          setSelectedRiskFactor("all");
                          setSelectedRating("all");
                          setSelectedYear("all");
                          setSelectedSegment("all");
                          setOnlyTopLatestYear(false);
                          setSearchCompany("");
                          setSortBy("risk_desc");
                        }}
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-sans font-bold text-rose-700 bg-rose-50 border border-rose-200 rounded hover:bg-rose-100 transition self-start md:self-auto"
                      >
                        <X className="w-3.5 h-3.5" />
                        Limpar Todos os Filtros
                      </button>
                    )}
                  </div>

                  {/* BARRA DE FILTROS INTERATIVOS */}
                  <div className="space-y-3 p-4 bg-gray-50 border border-gray-200 rounded-lg">
                    {/* Linha 1 de Filtros Principais */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                      {/* Filtro 1: Todos os Fatores de Risco */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 font-sans mb-1.5">
                          <span className="flex items-center gap-1">
                            <Filter className="w-3 h-3 text-[#f56a6a]" />
                            Fator de Risco:
                          </span>
                        </label>
                        <select
                          value={selectedRiskFactor}
                          onChange={(e) => setSelectedRiskFactor(e.target.value)}
                          className="w-full text-xs bg-white border border-gray-300 rounded p-2 font-sans text-gray-900 focus:outline-none focus:border-[#f56a6a]"
                        >
                          <option value="all">Todos os Fatores (Visão Consolidada)</option>
                          {pilar3Data.pesos_globais_modelo?.map((item: any) => (
                            <option key={item.key} value={item.key}>
                              {item.nome} (Peso: {item.peso_pct}%)
                            </option>
                          ))}
                        </select>
                      </div>

                      {/* Filtro 2: Segmento (Financeiro vs Corporativo) */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 font-sans mb-1.5">
                          <span className="flex items-center gap-1">
                            <Landmark className="w-3 h-3 text-[#f56a6a]" />
                            Segmento / Tipo:
                          </span>
                        </label>
                        <select
                          value={selectedSegment}
                          onChange={(e) => setSelectedSegment(e.target.value)}
                          className="w-full text-xs bg-white border border-gray-300 rounded p-2 font-sans text-gray-900 focus:outline-none focus:border-[#f56a6a]"
                        >
                          <option value="all">Todos os Segmentos (Corporativo + Bancos)</option>
                          <option value="Financeiro">🏛️ Bancos &amp; Instituições Financeiras</option>
                          <option value="Não Financeiro">🏭 Empresas Corporativas Não Financeiras</option>
                        </select>
                      </div>

                      {/* Filtro 3: Rating Regulatório */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 font-sans mb-1.5">
                          <span className="flex items-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-[#f56a6a]" />
                            Rating de Risco:
                          </span>
                        </label>
                        <select
                          value={selectedRating}
                          onChange={(e) => setSelectedRating(e.target.value)}
                          className="w-full text-xs bg-white border border-gray-300 rounded p-2 font-sans text-gray-900 focus:outline-none focus:border-[#f56a6a]"
                        >
                          <option value="all">Todos os Ratings</option>
                          <option value="distress">CCC / Distress (Score &gt; 70)</option>
                          <option value="high_risk">BB e B (Risco Elevado • Score 40-70)</option>
                          <option value="moderate">BBB (Moderado • Score 15-40)</option>
                          <option value="investment_grade">AAA, AA e A (Grau de Investimento)</option>
                        </select>
                      </div>

                      {/* Filtro 4: Ano do Balanço Auditado */}
                      <div>
                        <label className="block text-[11px] font-bold uppercase tracking-wider text-gray-600 font-sans mb-1.5">
                          <span className="flex items-center gap-1">
                            <Clock className="w-3 h-3 text-[#f56a6a]" />
                            Ano do Balanço:
                          </span>
                        </label>
                        <select
                          value={selectedYear}
                          onChange={(e) => setSelectedYear(e.target.value)}
                          className="w-full text-xs bg-white border border-gray-300 rounded p-2 font-sans text-gray-900 focus:outline-none focus:border-[#f56a6a]"
                        >
                          <option value="all">Todos os Períodos (2022–2026 / 1S26)</option>
                          <option value="2026">2026 (1S26 / 2T26 • Posição mais recente)</option>
                          <option value="2025">2025 (DFP Consolidada)</option>
                          <option value="2024">2024</option>
                          <option value="2023">2023</option>
                          <option value="2022">2022</option>
                        </select>
                      </div>
                    </div>

                    {/* Linha 2: Busca Textual, Atalhos Rápidos e Ordenação */}
                    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 pt-3 border-t border-gray-200">
                      {/* Busca Textual */}
                      <div className="relative flex-1 max-w-md">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Buscar banco ou empresa (ex: Itaú, BB, Petrobras, Gol)..."
                          value={searchCompany}
                          onChange={(e) => setSearchCompany(e.target.value)}
                          className="pl-9 pr-3 py-1.5 text-xs bg-white border border-gray-300 rounded font-sans text-gray-900 focus:outline-none focus:border-[#f56a6a] w-full"
                        />
                      </div>

                      {/* Botões de Atalho Rápido */}
                      <div className="flex flex-wrap items-center gap-2">
                        <button
                          onClick={() => {
                            setOnlyTopLatestYear(!onlyTopLatestYear);
                            if (!onlyTopLatestYear) setSelectedYear("2026");
                          }}
                          className={`px-2.5 py-1.5 rounded text-xs font-sans font-bold transition flex items-center gap-1 ${
                            onlyTopLatestYear
                              ? "bg-amber-600 text-white shadow-xs"
                              : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                          }`}
                        >
                          <span>⭐ Top 25 Maiores no Último Período (2026 • 1S26)</span>
                        </button>

                        <button
                          onClick={() => setSelectedSegment(selectedSegment === "Financeiro" ? "all" : "Financeiro")}
                          className={`px-2.5 py-1.5 rounded text-xs font-sans font-bold transition flex items-center gap-1 ${
                            selectedSegment === "Financeiro"
                              ? "bg-indigo-700 text-white shadow-xs"
                              : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-300"
                          }`}
                        >
                          <Landmark className="w-3.5 h-3.5" />
                          <span>Apenas Bancos / Financeiro</span>
                        </button>

                        {/* Seletor de Ordenação */}
                        <div className="flex items-center gap-1.5 text-xs font-sans">
                          <span className="text-gray-500 font-bold text-[11px]">Ordem:</span>
                          <select
                            value={sortBy}
                            onChange={(e: any) => setSortBy(e.target.value)}
                            className="text-xs bg-white border border-gray-300 rounded p-1.5 font-sans text-gray-900 focus:outline-none focus:border-[#f56a6a]"
                          >
                            <option value="risk_desc">Maior Risco Primeiro</option>
                            <option value="revenue_desc">Maior Faturamento / Porte</option>
                            <option value="risk_asc">Mais Sólidas (Menor Risco)</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* BANNER INFORMATIVO PARA BANCOS & INSTITUIÇÕES FINANCEIRAS */}
                  {selectedSegment === "Financeiro" && (
                    <div className="bg-indigo-50/80 border-2 border-indigo-200 rounded-lg p-4 space-y-3 font-sans text-xs">
                      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <Landmark className="w-4 h-4 text-indigo-700" />
                            <span className="font-bold text-gray-900 text-sm">
                              Filtro Ativo: Instituições Financeiras da B3
                            </span>
                            <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-indigo-200 text-indigo-900">
                              Bancos Comerciais, Múltiplos, Investimento, Seguradoras &amp; B3
                            </span>
                          </div>
                          <p className="text-gray-700 leading-relaxed">
                            Os dados abaixo mostram a solvência contábil registrada nas DFPs auditadas da CVM. Para métricas regulatórias aprofundadas do BACEN (Índice de Basileia III, NII, carteira de crédito e Estresse de Estágios CMN 4.966 / IFRS 9), explore também o <strong>Pilar 02 (Balanços dos Bancos)</strong>.
                          </p>
                        </div>

                        <button
                          onClick={() => setActiveTab("pilar2")}
                          className="px-3 py-1.5 bg-indigo-700 hover:bg-indigo-800 text-white rounded font-bold text-xs shrink-0 transition"
                        >
                          Ir para Pilar 02 (Top Bancos)
                        </button>
                      </div>

                      {/* Atalhos Rápidos com Cores Características Oficiais de Cada Instituição */}
                      <div className="pt-2 border-t border-indigo-200/80">
                        <span className="text-[10px] uppercase font-bold tracking-wider text-indigo-900 block mb-1.5">
                          Filtrar por Banco / Instituição Específica (Cores Oficiais da Marca):
                        </span>
                        <div className="flex flex-wrap gap-1.5 items-center">
                          {[
                            { name: "Nubank", query: "NUBANK", theme: BANK_BRAND_THEMES["Nubank (Nu Holdings)"] },
                            { name: "Itaú", query: "ITAU", theme: BANK_BRAND_THEMES["Itaú Unibanco"] },
                            { name: "Banco do Brasil", query: "BRASIL", theme: BANK_BRAND_THEMES["Banco do Brasil"] },
                            { name: "Bradesco", query: "BRADESCO", theme: BANK_BRAND_THEMES["Bradesco"] },
                            { name: "Santander", query: "SANTANDER", theme: BANK_BRAND_THEMES["Santander Brasil"] },
                            { name: "BTG Pactual", query: "BTG", theme: BANK_BRAND_THEMES["BTG Pactual"] },
                            { name: "Banco Inter", query: "INTER", theme: BANK_BRAND_THEMES["Banco Inter"] },
                            { name: "Banrisul", query: "BANRISUL", theme: BANK_BRAND_THEMES["Banrisul"] },
                            {
                              name: "Banco Pan",
                              query: "PAN",
                              theme: { primary: "#0099DA", badgeBg: "#F0F9FF", badgeText: "#0369A1", borderColor: "#7DD3FC", ticker: "BPAN4" },
                            },
                            {
                              name: "B3",
                              query: "B3",
                              theme: { primary: "#003366", badgeBg: "#F0F4F8", badgeText: "#1E3A8A", borderColor: "#93C5FD", ticker: "B3SA3" },
                            },
                            {
                              name: "XP",
                              query: "XP",
                              theme: { primary: "#111111", badgeBg: "#FEFCE8", badgeText: "#854D0E", borderColor: "#FDE047", ticker: "XPBR31" },
                            },
                            {
                              name: "Cielo",
                              query: "CIELO",
                              theme: { primary: "#00AEEF", badgeBg: "#F0F9FF", badgeText: "#0284C7", borderColor: "#38BDF8", ticker: "CIEL3" },
                            },
                          ].map((item) => {
                            const isActive = searchCompany.toUpperCase() === item.query;
                            return (
                              <button
                                key={item.name}
                                onClick={() => setSearchCompany(isActive ? "" : item.query)}
                                className="px-2 py-0.5 rounded text-[11px] font-sans font-bold border transition flex items-center gap-1.5"
                                style={{
                                  backgroundColor: isActive ? item.theme.primary : item.theme.badgeBg,
                                  color: isActive ? "#ffffff" : item.theme.badgeText,
                                  borderColor: item.theme.borderColor,
                                  boxShadow: isActive ? `0 2px 8px ${item.theme.primary}40` : "none",
                                }}
                              >
                                <span
                                  className="w-2 h-2 rounded-full inline-block"
                                  style={{ backgroundColor: isActive ? "#ffffff" : item.theme.primary }}
                                />
                                <span>{item.name}</span>
                                <span className="text-[9px] opacity-80 font-mono">({item.theme.ticker})</span>
                              </button>
                            );
                          })}
                          {searchCompany !== "" && (
                            <button
                              onClick={() => setSearchCompany("")}
                              className="px-2 py-0.5 rounded text-[10px] font-sans text-gray-500 hover:text-gray-800 underline"
                            >
                              Limpar busca
                            </button>
                          )}
                        </div>
                      </div>
                    </div>
                  )}

                  {/* BANNER INFORMATIVO QUANDO UM FATOR ESPECÍFICO ESTÁ SELECIONADO */}
                  {selectedRiskFactorMeta && (
                    <div className="bg-amber-50/80 border-2 border-amber-300/80 rounded-lg p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 font-sans text-xs">
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          <span className="font-bold text-gray-900 text-sm">
                            Filtro Ativo: {selectedRiskFactorMeta.nome}
                          </span>
                          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-200 text-amber-900">
                            Peso Global: {selectedRiskFactorMeta.peso_pct}%
                          </span>
                        </div>
                        <p className="text-gray-700 leading-relaxed">
                          <strong>Gatilho Prudencial:</strong> {selectedRiskFactorMeta.benchmark_alerta} •{" "}
                          <strong>Direção Econômica:</strong> {selectedRiskFactorMeta.direcao_economica}
                        </p>
                      </div>

                      <button
                        onClick={() => setSelectedRiskFactor("all")}
                        className="px-3 py-1 bg-white border border-amber-400 rounded text-amber-900 hover:bg-amber-100 font-bold text-xs shrink-0"
                      >
                        Voltar à Visão Geral Consolidada
                      </button>
                    </div>
                  )}

                  {/* TABELA DO SCANNER */}
                  <div tabIndex={0} role="region" aria-label="Scanner de Empresas e Bancos" className="table-wrapper shadow-xs">
                    <table>
                      <thead>
                        <tr>
                          <th>Instituição / Empresa &amp; CNPJ</th>
                          <th>Ano</th>
                          <th>Setor &amp; Escala CVM</th>
                          <th>Fator Consolidado (Score Ponderado)</th>
                          <th>Rating</th>
                          <th>Alerta Principal (TreeSHAP)</th>
                          <th>Decomposição</th>
                        </tr>
                      </thead>
                      <tbody className="font-mono text-xs">
                        {filteredCompanies.length === 0 ? (
                          <tr>
                            <td colSpan={7} className="text-center py-8 text-gray-500 font-sans">
                              Nenhuma entidade encontrada com os filtros selecionados. Tente ajustar os parâmetros de busca.
                            </td>
                          </tr>
                        ) : (
                          filteredCompanies.map((c: any) => {
                            const rowKey = `${c.CNPJ_CIA}_${c.ano}`;
                            const isExpanded = expandedCompanyKey === rowKey;
                            const score = c.score_fator_consolidado ?? c.prob_distress;
                            const isDistress = score >= 70;
                            const isHighRisk = score >= 40 && score < 70;
                            const isModerate = score >= 15 && score < 40;
                            const isSolid = score < 15;
                            const bankTheme = getBankTheme(c.DENOM_CIA_CLEAN || c.DENOM_CIA);

                            const mainAlert = c.alerta_principal;
                            const selectedFactorDetail = selectedRiskFactor !== "all"
                              ? c.fatores_detalhados?.find((f: any) => f.key === selectedRiskFactor)
                              : null;

                            return (
                              <React.Fragment key={rowKey}>
                                <tr
                                  className={`transition-colors ${
                                    isExpanded
                                      ? "bg-slate-50 border-b-0"
                                      : bankTheme && c.top_maior_ultimo_ano
                                      ? "hover:bg-slate-50"
                                      : "hover:bg-slate-50"
                                  }`}
                                  style={
                                    isExpanded && bankTheme
                                      ? { borderLeft: `4px solid ${bankTheme.primary}` }
                                      : {}
                                  }
                                >
                                  <td className="font-sans">
                                    <div className="flex items-center gap-1.5 flex-wrap">
                                      {bankTheme && (
                                        <span
                                          className="w-2.5 h-2.5 rounded-full shrink-0 shadow-2xs"
                                          style={{ backgroundColor: bankTheme.primary }}
                                          title={`Instituição Financeira: ${bankTheme.name}`}
                                        />
                                      )}
                                      <span className="font-bold text-gray-900">
                                        {c.DENOM_CIA_CLEAN || c.DENOM_CIA}
                                      </span>
                                      {c.top_maior_ultimo_ano && (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-amber-100 text-amber-900 border border-amber-300 font-bold">
                                          {c.ano === 2026 ? "⭐ Top 25 (2026)" : "⭐ Top 25"}
                                        </span>
                                      )}
                                      {bankTheme ? (
                                        <span
                                          className="px-1.5 py-0.2 rounded text-[9px] font-bold border"
                                          style={{
                                            backgroundColor: bankTheme.badgeBg,
                                            color: bankTheme.badgeText,
                                            borderColor: bankTheme.borderColor,
                                          }}
                                        >
                                          🏛️ {bankTheme.ticker || "Banco"}
                                        </span>
                                      ) : c.segmento === "Financeiro" ? (
                                        <span className="px-1.5 py-0.2 rounded text-[9px] bg-indigo-100 text-indigo-800 border border-indigo-200 font-bold">
                                          🏛️ Banco/Fin
                                        </span>
                                      ) : null}
                                    </div>
                                    <span className="text-[10px] text-gray-500 font-mono block">
                                      CNPJ: {c.CNPJ_CIA}
                                    </span>
                                  </td>
                                  <td className="text-gray-600 font-bold">
                                    {c.ano === 2026 ? (
                                      <span className="flex items-center gap-1">
                                        <span>2026</span>
                                        <span className="text-[9px] font-mono px-1 py-0.2 rounded bg-emerald-100 text-emerald-800 border border-emerald-300">
                                          1S26
                                        </span>
                                      </span>
                                    ) : (
                                      c.ano
                                    )}
                                  </td>
                                  <td className="font-sans text-[11px]">
                                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-gray-100 text-gray-700 block w-fit mb-0.5">
                                      {c.setor || "Geral"}
                                    </span>
                                    {c.receita_liquida_bi > 0 && (
                                      <span className="text-[10px] text-gray-500 font-mono">
                                        Faturamento: <strong>R$ {c.receita_liquida_bi} bi</strong>
                                      </span>
                                    )}
                                  </td>
                                  <td>
                                    <div className="space-y-1">
                                      <div className="flex items-center gap-2">
                                        <div className="w-20 bg-gray-200 rounded h-2.5 overflow-hidden border border-gray-300">
                                          <div
                                            style={{ width: `${Math.min(score, 100)}%` }}
                                            className={`h-full ${
                                              isDistress
                                                ? "bg-rose-600"
                                                : isHighRisk
                                                ? "bg-amber-500"
                                                : isModerate
                                                ? "bg-blue-600"
                                                : "bg-emerald-600"
                                            }`}
                                          />
                                        </div>
                                        <span className="font-bold text-gray-900">{score}%</span>
                                      </div>
                                      <span
                                        className={`inline-block px-1.5 py-0.2 rounded text-[10px] font-sans font-bold ${
                                          isDistress
                                            ? "bg-rose-100 text-rose-800"
                                            : isHighRisk
                                            ? "bg-amber-100 text-amber-800"
                                            : isModerate
                                            ? "bg-blue-100 text-blue-800"
                                            : "bg-emerald-100 text-emerald-800"
                                        }`}
                                      >
                                        {c.fator_consolidado_classificacao || (isDistress ? "Distress Crítico" : "Sólido")}
                                      </span>
                                    </div>
                                  </td>
                                  <td>
                                    <span
                                      className={`px-2 py-0.5 rounded font-bold text-xs ${
                                        c.rating === "CCC/Distress"
                                          ? "bg-rose-100 text-rose-800 border border-rose-300"
                                          : ["BB", "B"].includes(c.rating)
                                          ? "bg-amber-100 text-amber-800 border border-amber-300"
                                          : c.rating === "BBB"
                                          ? "bg-blue-100 text-blue-800 border border-blue-300"
                                          : "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                      }`}
                                    >
                                      {c.rating}
                                    </span>
                                  </td>
                                  <td className="font-sans text-[11px]">
                                    {selectedFactorDetail ? (
                                      <div className="space-y-0.5">
                                        <span className="font-bold text-gray-900">
                                          {selectedFactorDetail.nome}: {selectedFactorDetail.valor_formatado}
                                        </span>
                                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                          <span className="text-gray-500">SHAP:</span>
                                          <span
                                            className={`font-bold ${
                                              selectedFactorDetail.shap_impact > 0
                                                ? "text-rose-700"
                                                : "text-emerald-700"
                                            }`}
                                          >
                                            {selectedFactorDetail.shap_impact > 0 ? "+" : ""}
                                            {selectedFactorDetail.shap_impact}
                                          </span>
                                          <span className="text-gray-400">
                                            ({selectedFactorDetail.direcao})
                                          </span>
                                        </div>
                                      </div>
                                    ) : mainAlert ? (
                                      <div className="space-y-0.5">
                                        <span className="font-bold text-gray-900">
                                          {mainAlert.nome || mainAlert.feature}
                                        </span>
                                        <div className="flex items-center gap-1.5 font-mono text-[10px]">
                                          <span className="text-gray-500">Impacto:</span>
                                          <span className="font-bold text-rose-700">
                                            {mainAlert.shap_impact > 0 ? "+" : ""}
                                            {mainAlert.shap_impact}
                                          </span>
                                        </div>
                                      </div>
                                    ) : (
                                      <span className="text-gray-400">-</span>
                                    )}
                                  </td>
                                  <td>
                                    <button
                                      onClick={() =>
                                        setExpandedCompanyKey(isExpanded ? null : rowKey)
                                      }
                                      className={`inline-flex items-center gap-1 px-2.5 py-1 rounded text-[11px] font-sans font-bold transition ${
                                        isExpanded
                                          ? "bg-slate-800 text-white"
                                          : "bg-gray-100 hover:bg-gray-200 text-gray-700"
                                      }`}
                                    >
                                      <span>{isExpanded ? "Recolher" : "Decompor (12 Fatores)"}</span>
                                      {isExpanded ? (
                                        <ChevronUp className="w-3.5 h-3.5" />
                                      ) : (
                                        <ChevronDown className="w-3.5 h-3.5" />
                                      )}
                                    </button>
                                  </td>
                                </tr>

                                {/* LINHA EXPANDIDA COM A DECOMPOSIÇÃO COMPLETA DOS 12 FATORES */}
                                {isExpanded && (
                                  <tr className="bg-slate-50 border-b-2 border-slate-300">
                                    <td
                                      colSpan={7}
                                      className="p-4 sm:p-6"
                                      style={bankTheme ? { borderLeft: `4px solid ${bankTheme.primary}` } : {}}
                                    >
                                      <div
                                        className="bg-white border border-gray-300 rounded-lg p-5 space-y-4"
                                        style={bankTheme ? { borderTop: `3px solid ${bankTheme.primary}` } : {}}
                                      >
                                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-gray-200 pb-3">
                                          <div>
                                            <div
                                              className="text-[11px] uppercase tracking-wider font-bold"
                                              style={{ color: bankTheme ? bankTheme.primary : "#f56a6a" }}
                                            >
                                              Decomposição do Fator Consolidado (TreeSHAP)
                                            </div>
                                            <h4 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
                                              {bankTheme && (
                                                <span
                                                  className="w-2.5 h-2.5 rounded-full inline-block shadow-2xs"
                                                  style={{ backgroundColor: bankTheme.primary }}
                                                />
                                              )}
                                              <span>{c.DENOM_CIA_CLEAN || c.DENOM_CIA} — Balanço {c.ano}</span>
                                            </h4>
                                          </div>
                                          <div className="flex items-center gap-3 font-mono text-xs">
                                            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                                              <span className="text-gray-500 block text-[10px] font-sans">
                                                Fator Consolidado:
                                              </span>
                                              <span className="font-bold text-gray-900 text-sm">
                                                {score}%
                                              </span>
                                            </div>
                                            <div className="p-2 bg-gray-50 border border-gray-200 rounded">
                                              <span className="text-gray-500 block text-[10px] font-sans">
                                                Rating Atribuído:
                                              </span>
                                              <span className="font-bold text-[#f56a6a] text-sm">
                                                {c.rating}
                                              </span>
                                            </div>
                                          </div>
                                        </div>

                                        <p className="text-xs text-gray-600 font-sans leading-relaxed">
                                          Abaixo está o detalhamento de como cada um dos 12 fatores de risco influenciou a composição do rating. Valores positivos no impacto TreeSHAP aumentam a vulnerabilidade de calote (vermelho), enquanto valores negativos ou nulos atestam robustez patrimonial e mitigam o risco (verde).
                                        </p>

                                        {/* Tabela dos 12 Fatores da Empresa */}
                                        <div tabIndex={0} role="region" aria-label="Fatores Detalhados da Empresa" className="table-wrapper">
                                          <table>
                                            <thead>
                                              <tr>
                                                <th>Fator Contábil</th>
                                                <th>Categoria</th>
                                                <th>Valor Auditado CVM</th>
                                                <th>Peso Global</th>
                                                <th>Contribuição SHAP</th>
                                                <th>Efeito no Risco</th>
                                                <th>Status</th>
                                              </tr>
                                            </thead>
                                            <tbody className="font-mono text-xs">
                                              {c.fatores_detalhados?.map((f: any) => {
                                                const isRisk = f.shap_impact > 0.02;
                                                const isShield = f.shap_impact < -0.05;
                                                return (
                                                  <tr key={f.key}>
                                                    <td className="font-sans font-bold text-gray-900">
                                                      {f.nome}
                                                    </td>
                                                    <td className="font-sans">
                                                      <span className="px-1.5 py-0.5 rounded text-[10px] bg-gray-100 text-gray-700">
                                                        {f.categoria}
                                                      </span>
                                                    </td>
                                                    <td className="font-bold text-gray-900">
                                                      {f.valor_formatado}
                                                    </td>
                                                    <td className="text-gray-600 font-bold">
                                                      {f.peso_global_pct}%
                                                    </td>
                                                    <td>
                                                      <span
                                                        className={`font-bold ${
                                                          isRisk
                                                            ? "text-rose-700"
                                                            : isShield
                                                            ? "text-emerald-700"
                                                            : "text-gray-600"
                                                        }`}
                                                      >
                                                        {f.shap_impact > 0 ? "+" : ""}
                                                        {f.shap_impact}
                                                      </span>
                                                    </td>
                                                    <td className="font-sans text-[11px]">
                                                      {isRisk ? (
                                                        <span className="text-rose-700 font-bold flex items-center gap-1">
                                                          <TrendingUp className="w-3 h-3 text-rose-600" />
                                                          Aumenta Risco
                                                        </span>
                                                      ) : isShield ? (
                                                        <span className="text-emerald-700 font-bold flex items-center gap-1">
                                                          <TrendingDown className="w-3 h-3 text-emerald-600" />
                                                          Mitiga Risco (Proteção)
                                                        </span>
                                                      ) : (
                                                        <span className="text-gray-500">Neutro</span>
                                                      )}
                                                    </td>
                                                    <td>
                                                      <span
                                                        className={`px-2 py-0.5 rounded text-[10px] font-sans font-bold ${
                                                          f.status === "Crítico"
                                                            ? "bg-rose-100 text-rose-800 border border-rose-300"
                                                            : f.status === "Atenção"
                                                            ? "bg-amber-100 text-amber-800 border border-amber-300"
                                                            : f.status === "Forte"
                                                            ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                                            : "bg-gray-100 text-gray-700"
                                                        }`}
                                                      >
                                                        {f.status}
                                                      </span>
                                                    </td>
                                                  </tr>
                                                );
                                              })}
                                            </tbody>
                                          </table>
                                        </div>
                                      </div>
                                    </td>
                                  </tr>
                                )}
                              </React.Fragment>
                            );
                          })
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              )}
            </section>
          )}

          {/* Footer note inside main */}
          <footer className="mt-16 pt-8 border-t border-gray-200 text-xs text-gray-500 font-sans flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <strong>Observatório do Sistema Financeiro Nacional</strong> • Metodologia em conformidade com Lei Complementar nº 105 &amp; LGPD.
            </div>
            <div className="font-mono text-[11px]">
              Engine: Python 3.12 • Next.js 16 • Vercel
            </div>
          </footer>
        </div>

        {/* ======================================================== */}
        {/* EDITORIAL SIDEBAR (#sidebar)                             */}
        {/* ======================================================== */}
        <aside
          className={`w-full lg:w-80 bg-[#f1f3f5] border-l border-gray-200 p-6 lg:p-8 order-1 lg:order-2 flex flex-col gap-8 shrink-0 ${
            isSidebarOpen ? "block" : "hidden lg:block"
          }`}
        >
          {/* Author / Bio Box */}
          <div className="pb-6 border-b border-gray-300">
            <div className="text-[10px] uppercase font-bold tracking-widest text-[#f56a6a] mb-1">
              Perfil do Autor
            </div>
            <h3 className="font-serif font-bold text-gray-900 text-lg">
              Fabricio Santos
            </h3>
            <p className="text-xs text-gray-600 mt-2 font-sans leading-relaxed">
              Profissional de Ciência de Dados com atuação no setor bancário brasileiro. Focado em modelagem de risco de crédito, econometria de séries temporais macroeconômicas e inteligência analítica para produtos financeiros.
            </p>
          </div>

          {/* Editorial Navigation Menu */}
          <div>
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-3">
              Módulos de Análise
            </div>
            <nav className="space-y-1 font-serif text-sm">
              <button
                onClick={() => setActiveTab("pilar1")}
                className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition-colors ${
                  activeTab === "pilar1"
                    ? "bg-white font-bold text-[#f56a6a] shadow-xs border-l-4 border-[#f56a6a]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>01. Defasagem da Selic</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setActiveTab("pilar2")}
                className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition-colors ${
                  activeTab === "pilar2"
                    ? "bg-white font-bold text-[#f56a6a] shadow-xs border-l-4 border-[#f56a6a]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>02. Balanços dos Bancos</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>

              <button
                onClick={() => setActiveTab("pilar3")}
                className={`w-full text-left px-3 py-2 rounded flex items-center justify-between transition-colors ${
                  activeTab === "pilar3"
                    ? "bg-white font-bold text-[#f56a6a] shadow-xs border-l-4 border-[#f56a6a]"
                    : "text-gray-700 hover:bg-gray-200"
                }`}
              >
                <span>03. Early Warning PJ</span>
                <ChevronRight className="w-4 h-4 text-gray-400" />
              </button>
            </nav>
          </div>

          {/* Mini Insights Editorial Box */}
          <div className="space-y-4 pt-4 border-t border-gray-300">
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500">
              Destaques de Negócio
            </div>

            <article className="text-xs space-y-1">
              <h4 className="font-serif font-bold text-gray-900 leading-snug">
                Cartão Rotativo vs. Capital de Giro
              </h4>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                A inadimplência do cartão atinge o pico com apenas 3 meses de defasagem, enquanto o capital de giro PJ suporta até 10 meses antes do estresse máximo.
              </p>
            </article>

            <article className="text-xs space-y-1">
              <h4 className="font-serif font-bold text-gray-900 leading-snug">
                Resolução CMN nº 4.966 (IFRS 9)
              </h4>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                A simulação prospectiva avalia a solvência do patrimônio dos 8 maiores bancos do Brasil frente a choques de crédito sobre ativos de trilhões.
              </p>
            </article>

            <article className="text-xs space-y-1">
              <h4 className="font-serif font-bold text-gray-900 leading-snug">
                Early Warning &amp; TreeSHAP
              </h4>
              <p className="text-gray-600 text-[11px] leading-relaxed">
                O modelo isolou o distress de Americanas e Gol com PD superior a 97% utilizando apenas dados anteriores à decretação formal de crise.
              </p>
            </article>
          </div>

          {/* Institutional Sources & Standards */}
          <div className="pt-4 border-t border-gray-300 space-y-2 text-xs text-gray-600 font-sans">
            <div className="text-[10px] uppercase font-bold tracking-widest text-gray-500 mb-2">
              Fontes &amp; Padrões
            </div>
            <div className="flex items-center gap-2">
              <Scale className="w-3.5 h-3.5 text-[#f56a6a]" />
              <span>Banco Central do Brasil (SGS)</span>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="w-3.5 h-3.5 text-[#f56a6a]" />
              <span>CVM Dados Abertos (DFP/ITR)</span>
            </div>
            <div className="flex items-center gap-2">
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-700" />
              <span>Resolução CMN 4.966 / IFRS 9</span>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}
