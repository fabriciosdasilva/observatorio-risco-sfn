"use client";

import React, { useState, useEffect } from "react";
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
  Info,
  Percent,
  Briefcase,
  Users,
  DollarSign,
  Layers,
  History,
} from "lucide-react";

export default function EditorialObservatorio() {
  const [activeTab, setActiveTab] = useState<"pilar1" | "pilar2" | "pilar3">("pilar1");
  const [pilar1Data, setPilar1Data] = useState<any>(null);
  const [pilar2Data, setPilar2Data] = useState<any>(null);
  const [pilar3Data, setPilar3Data] = useState<any>(null);
  const [selectedModality, setSelectedModality] = useState<string>("inad_pf_cartao_rotativo");
  const [selectedBank, setSelectedBank] = useState<string>("Itaú Unibanco");
  const [searchCompany, setSearchCompany] = useState<string>("");
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
                  2. Raio-X dos 10 Maiores Bancos &amp; Stress Testing (IFRS 9 / CMN 4.966)
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                  Análise comparativa aprofundada com base nas demonstrações contábeis auditadas da CVM (2018–2025) e dados oficiais extraídos diretamente dos <strong>Releases de Resultados das Relações com Investidores (RI)</strong> das 10 maiores instituições financeiras do Brasil. Inclui simulação de estresse prospectivo de <strong>migração de estágios de risco de crédito</strong> e impacto no Capital Regulatório de Basileia.
                </p>
              </div>

              {/* 2.1 Tabela Comparativa de Benchmark dos 10 Maiores Bancos */}
              {pilar2Data && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h3 className="font-serif font-bold text-gray-900 text-base flex items-center gap-2">
                        <Landmark className="w-4 h-4 text-[#f56a6a]" />
                        Ranking Comparativo de Crédito, Solvência e Risco (RI Benchmark)
                      </h3>
                      <p className="text-xs text-gray-600">
                        Indicadores regulatórios oficiais dos 10 maiores conglomerados bancários brasileiros:
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

                          return (
                            <tr key={bName} className={isSelected ? "bg-[#fff5f5] font-semibold" : ""}>
                              <td className="font-sans font-medium text-gray-900 flex items-center gap-2">
                                <span className={`w-2 h-2 rounded-full ${rm.inadimplencia_npl90_pct < 3.0 ? "bg-emerald-500" : rm.inadimplencia_npl90_pct < 4.5 ? "bg-amber-500" : "bg-rose-500"}`} />
                                {bName}
                              </td>
                              <td className="font-sans text-gray-500 text-[11px]">
                                <span className="font-bold text-gray-800">{b.ticker}</span> • {b.tipo.split("/")[0]}
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
                                  className="text-xs text-[#f56a6a] hover:underline font-bold uppercase tracking-wider"
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

              {/* 2.2 Grid de Seleção dos 10 Bancos */}
              {pilar2Data && (
                <div>
                  <h3 className="font-serif font-bold text-gray-900 text-sm mb-3">
                    Selecione uma Instituição para Análise Aprofundada de RI:
                  </h3>
                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
                    {Object.keys(pilar2Data.banks).map((bName) => {
                      const b = pilar2Data.banks[bName];
                      const rm = b.ri_metrics;
                      const isSelected = selectedBank === bName;

                      return (
                        <div
                          key={bName}
                          onClick={() => setSelectedBank(bName)}
                          className={`p-3.5 rounded-lg border-2 cursor-pointer transition-all bg-white ${
                            isSelected
                              ? "border-[#f56a6a] shadow-md shadow-[#f56a6a]/10"
                              : "border-gray-200 hover:border-gray-400"
                          }`}
                        >
                          <div className="flex justify-between items-start mb-1.5">
                            <h4 className="font-serif font-bold text-gray-900 text-xs truncate max-w-[110px]">
                              {bName}
                            </h4>
                            <span className="text-[9px] font-mono font-bold text-[#f56a6a] bg-rose-50 px-1 rounded">
                              {b.ticker}
                            </span>
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
              {bankData && (
                <div className="space-y-6">
                  {/* Spotlight Header */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 sm:p-8 space-y-6 shadow-xs">
                    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between pb-4 border-b border-gray-200 gap-3">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold uppercase tracking-wider text-[#f56a6a]">
                            Relatório Executivo de RI
                          </span>
                          <span className="text-xs font-mono px-2 py-0.5 rounded bg-gray-100 text-gray-700 font-bold border border-gray-300">
                            Ticker: {bankData.ticker}
                          </span>
                          <span className="text-xs font-mono text-gray-500">
                            CNPJ: {bankData.cnpj}
                          </span>
                        </div>
                        <h3 className="text-2xl font-serif font-bold text-gray-900">
                          {selectedBank}
                        </h3>
                      </div>

                      <a
                        href={bankData.ri_url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-gray-100 hover:bg-gray-200 text-xs font-sans font-bold text-gray-800 border border-gray-300 transition-colors self-start sm:self-auto"
                      >
                        Portal de RI Oficial <ExternalLink className="w-3.5 h-3.5" />
                      </a>
                    </div>

                    <p className="text-sm text-gray-700 leading-relaxed font-sans bg-gray-50 p-4 rounded-lg border-l-4 border-[#f56a6a]">
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
                          {Object.entries(bankData.ri_metrics.segmentacao_carteira).map(([seg, pct]: [string, any]) => (
                            <div key={seg} className="flex items-center gap-3">
                              <span className="w-40 text-gray-600 font-sans truncate capitalize">
                                {seg.replace("_pct", "").replace("_", " ")}:
                              </span>
                              <div className="flex-1 bg-gray-100 rounded h-3 overflow-hidden border border-gray-200">
                                <div style={{ width: `${pct}%` }} className="h-full bg-slate-700" />
                              </div>
                              <span className="w-12 text-right font-bold text-gray-900">{pct}%</span>
                            </div>
                          ))}
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
                        <span>Série Histórica Contábil Auditada (CVM): {selectedBank}</span>
                        <span className="text-xs font-mono text-gray-500 font-normal">
                          Valores em R$ Bilhões (2018–2025)
                        </span>
                      </h3>

                      <div tabIndex={0} role="region" aria-label="Tabela Histórica do Banco" className="table-wrapper shadow-xs">
                        <table>
                          <thead>
                            <tr>
                              <th>Ano</th>
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
                                <td className="font-bold text-gray-900">{h.ano}</td>
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
                    <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4 flex flex-col justify-between shadow-xs">
                      <div>
                        <div className="text-xs uppercase tracking-wider font-bold text-[#f56a6a] mb-1">
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
                            <span className="text-[#f56a6a] font-bold text-sm">
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
              )}
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
                  Painel de mais de <strong>3.400 balanços contábeis da CVM</strong> de companhias abertas na B3. O modelo preditivo <strong>XGBoost Calibrado</strong> foi treinado no período 2018–2021 e submetido a <strong>teste cego Out-of-Time (2022–2025)</strong> no ápice do ciclo de Selic alta e recuperação subsequente. A metodologia de explicabilidade <strong>TreeSHAP</strong> revela as variáveis contábeis que precipitam a quebra antes de atrasos bancários formais.
                </p>
              </div>

              {/* Regulatory Metrics Grid */}
              {pilar3Data && (
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="p-5 bg-white border-2 border-gray-200 rounded-lg">
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                      ROC-AUC (OOT)
                    </span>
                    <div className="text-3xl font-serif font-bold text-[#f56a6a]">
                      {pilar3Data.oot_backtesting_metrics.calibrated_xgboost.roc_auc}
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono mt-1 block">
                      Linear: {pilar3Data.oot_backtesting_metrics.logistic_regression.roc_auc}
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
                      Separação Solvente vs. Falência
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
                      2 * AUC - 1
                    </span>
                  </div>

                  <div className="p-5 bg-white border-2 border-gray-200 rounded-lg">
                    <span className="text-xs uppercase font-bold tracking-wider text-gray-500 font-sans block mb-1">
                      Brier Score
                    </span>
                    <div className="text-3xl font-serif font-bold text-emerald-700">
                      {pilar3Data.oot_backtesting_metrics.calibrated_xgboost.brier_score}
                    </div>
                    <span className="text-[11px] text-gray-500 font-mono mt-1 block">
                      Alta Precisão de Probabilidade
                    </span>
                  </div>
                </div>
              )}

              {/* TreeSHAP & Monitored Scanner */}
              {pilar3Data && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* SHAP Feature Importance */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="text-xs uppercase font-bold tracking-wider text-[#f56a6a]">
                      Explicabilidade de Modelo
                    </div>
                    <h3 className="font-serif font-bold text-gray-900 text-base">
                      Fatores de Risco TreeSHAP
                    </h3>
                    <p className="text-xs text-gray-600 leading-relaxed font-sans">
                      Impacto médio das variáveis contábeis na decisão do algoritmo de classificar a companhia em risco de distress.
                    </p>

                    <div className="space-y-2.5 font-mono text-xs pt-2">
                      {Object.entries(pilar3Data.feature_importance_shap).slice(0, 8).map(([feat, imp]: any, idx: number) => (
                        <div
                          key={feat}
                          className="flex justify-between items-center py-1 border-b border-gray-100"
                        >
                          <span className="text-gray-700 font-sans capitalize">
                            {idx + 1}. {feat.replace(/_/g, " ")}:
                          </span>
                          <span className="font-bold text-[#f56a6a]">{imp}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Company Scanner Table */}
                  <div className="lg:col-span-2 bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="text-xs uppercase font-bold tracking-wider text-[#f56a6a]">
                          Teste Cego Out-of-Time
                        </div>
                        <h3 className="font-serif font-bold text-gray-900 text-base">
                          Scanner de Empresas da B3
                        </h3>
                      </div>
                      <div className="relative">
                        <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
                        <input
                          type="text"
                          placeholder="Buscar empresa (ex: Americanas, Gol)..."
                          value={searchCompany}
                          onChange={(e) => setSearchCompany(e.target.value)}
                          className="pl-9 pr-3 py-1.5 text-xs bg-gray-50 border border-gray-300 rounded font-sans text-gray-900 focus:outline-none focus:border-[#f56a6a] w-full sm:w-64"
                        />
                      </div>
                    </div>

                    <div
                      tabIndex={0}
                      role="region"
                      aria-label="Tabela de Empresas Monitoradas"
                      className="table-wrapper shadow-xs"
                    >
                      <table>
                        <thead>
                          <tr>
                            <th>Companhia</th>
                            <th>Ano</th>
                            <th>Prob. Calote (PD)</th>
                            <th>Rating</th>
                            <th>Alerta Principal (TreeSHAP)</th>
                          </tr>
                        </thead>
                        <tbody className="font-mono text-xs">
                          {pilar3Data.sample_companies_monitor
                            .filter((c: any) =>
                              c.DENOM_CIA.toLowerCase().includes(searchCompany.toLowerCase())
                            )
                            .map((c: any, idx: number) => {
                              const isDistress = c.prob_distress > 50;
                              const mainDriver = c.top_shap_drivers?.[0];

                              return (
                                <tr key={idx}>
                                  <td className="font-sans font-bold text-gray-900">
                                    {c.DENOM_CIA.slice(0, 30)}
                                  </td>
                                  <td className="text-gray-500">{c.ano}</td>
                                  <td>
                                    <span
                                      className={`px-2 py-0.5 rounded font-bold ${
                                        isDistress
                                          ? "bg-rose-100 text-rose-800"
                                          : "bg-emerald-100 text-emerald-800"
                                      }`}
                                    >
                                      {c.prob_distress}%
                                    </span>
                                  </td>
                                  <td className="font-bold text-gray-900">{c.rating}</td>
                                  <td className="font-sans text-gray-600 text-[11px]">
                                    {mainDriver
                                      ? `${mainDriver.feature} (${mainDriver.shap_impact > 0 ? "+" : ""}${mainDriver.shap_impact})`
                                      : "-"}
                                  </td>
                                </tr>
                              );
                            })}
                        </tbody>
                      </table>
                    </div>
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
