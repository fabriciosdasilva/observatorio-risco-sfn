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
            <section className="space-y-10 animate-fadeIn">
              <div>
                <h2 className="major-heading text-xl sm:text-2xl text-gray-900">
                  1. Transmissão Monetária &amp; Defasagem Temporal
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                  Investigação empírica com <strong>166 meses de dados contínuos do BACEN SGS (2013–2026)</strong>. Demonstra a assimetria na velocidade em que os juros atingem cada modalidade de crédito. O modelo regularizado <strong>Ridge AR-X</strong> é comparado contra o <strong>Naive Random Walk</strong> em validação <strong>Walk-Forward</strong> (janela de expansão com horizonte trimestral).
                </p>
              </div>

              {/* Responsive Data Table */}
              {pilar1Data && (
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <h3 className="font-serif font-bold text-gray-900 text-base">
                      Matriz Econométrica de Defasagem (Lags) e Ganho de Erro
                    </h3>
                    <span className="text-xs font-mono text-gray-500">
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

              {/* Selected Modality Deep-Dive (HTML5 UP Spotlight Style) */}
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
          {/* PILAR 2: BALANÇOS BANCÁRIOS & STRESS TESTING            */}
          {/* ======================================================== */}
          {activeTab === "pilar2" && (
            <section className="space-y-10 animate-fadeIn">
              <div>
                <h2 className="major-heading text-xl sm:text-2xl text-gray-900">
                  2. Raio-X dos Grandes Bancos &amp; Teste de Estresse
                </h2>
                <p className="text-sm text-gray-600 leading-relaxed max-w-3xl">
                  Demonstrações contábeis auditadas pela CVM e BACEN de 2018 a 2025. Revela a dimensão dos ativos de trilhões dos grandes conglomerados brasileiros e simula um teste de estresse prospectivo (*Forward-Looking Stress*) de perda de crédito adicional de +1.5% do ativo total, espelhando os requisitos da <strong>Resolução CMN nº 4.966</strong> e <strong>IFRS 9</strong>.
                </p>
              </div>

              {/* Bank Cards Grid */}
              {pilar2Data && (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.keys(pilar2Data.banks).map((bName) => {
                    const b = pilar2Data.banks[bName];
                    const latest = b.historico[b.historico.length - 1];
                    const isSelected = selectedBank === bName;

                    return (
                      <div
                        key={bName}
                        onClick={() => setSelectedBank(bName)}
                        className={`p-5 rounded-lg border-2 cursor-pointer transition-all bg-white ${
                          isSelected
                            ? "border-[#f56a6a] shadow-md shadow-[#f56a6a]/10"
                            : "border-gray-200 hover:border-gray-400"
                        }`}
                      >
                        <div className="flex justify-between items-start mb-3">
                          <h4 className="font-serif font-bold text-gray-900 text-sm">
                            {bName}
                          </h4>
                          <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded bg-gray-100 text-gray-600 border border-gray-300">
                            {b.tipo}
                          </span>
                        </div>

                        <div className="space-y-1.5 font-mono text-xs">
                          <div className="flex justify-between text-gray-600">
                            <span>Ativo:</span>
                            <span className="font-bold text-gray-900">
                              R$ {latest.ativo_total_bi} bi
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>Patrimônio:</span>
                            <span className="font-bold text-gray-900">
                              R$ {latest.patrimonio_liquido_bi} bi
                            </span>
                          </div>
                          <div className="flex justify-between text-gray-600">
                            <span>ROE {latest.ano}:</span>
                            <span
                              className={`font-bold ${
                                latest.roe_pct >= 0 ? "text-emerald-700" : "text-rose-700"
                              }`}
                            >
                              {latest.roe_pct}%
                            </span>
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {/* Bank Historical Trajectory & Stress Test */}
              {bankData && (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Historical Table */}
                  <div className="lg:col-span-2 bg-white border border-gray-200 rounded-lg p-6 space-y-4">
                    <h3 className="font-serif font-bold text-gray-900 text-base flex justify-between items-center">
                      <span>Série Histórica Auditada (CVM): {selectedBank}</span>
                      <span className="text-xs font-mono text-gray-500 font-normal">
                        Valores Consolidados em R$ Bilhões
                      </span>
                    </h3>

                    <div
                      tabIndex={0}
                      role="region"
                      aria-label="Tabela Histórica do Banco"
                      className="table-wrapper shadow-xs"
                    >
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

                  {/* Stress Testing Box */}
                  <div className="bg-white border-2 border-gray-200 rounded-lg p-6 space-y-4 flex flex-col justify-between">
                    <div>
                      <div className="text-xs uppercase tracking-wider font-bold text-[#f56a6a] mb-1">
                        Resolução CMN nº 4.966
                      </div>
                      <h3 className="font-serif font-bold text-gray-900 text-base mb-4">
                        Teste de Estresse de Crédito
                      </h3>

                      <div className="space-y-3 font-mono text-xs">
                        <div className="p-3 bg-gray-50 rounded border border-gray-200">
                          <span className="text-gray-500 block text-[11px] font-sans">
                            Cenário de Estresse Prospectivo:
                          </span>
                          <span className="font-bold text-gray-900 mt-0.5 block font-sans">
                            Choque de Inadimplência (+1.5% do Ativo)
                          </span>
                        </div>

                        <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                          <span className="text-gray-600 font-sans">Perda Estimada:</span>
                          <span className="text-rose-700 font-bold">
                            -R$ {bankData.stress_test.perda_adicional_estimada_bi} bi
                          </span>
                        </div>

                        <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                          <span className="text-gray-600 font-sans">ROE Pós-Choque:</span>
                          <span
                            className={`font-bold ${
                              bankData.stress_test.roe_pos_choque_pct >= 0
                                ? "text-emerald-700"
                                : "text-rose-700"
                            }`}
                          >
                            {bankData.stress_test.roe_pos_choque_pct}%
                          </span>
                        </div>

                        <div className="p-3 bg-gray-50 rounded border border-gray-200 flex justify-between items-center">
                          <span className="text-gray-600 font-sans">Resiliência:</span>
                          <span
                            className={`px-2 py-0.5 rounded text-[11px] font-bold ${
                              bankData.stress_test.resiliente
                                ? "bg-emerald-100 text-emerald-800 border border-emerald-300"
                                : "bg-rose-100 text-rose-800 border border-rose-300"
                            }`}
                          >
                            {bankData.stress_test.resiliente ? "CAPITAL SOLVENTE" : "ALERTA PRUDENCIAL"}
                          </span>
                        </div>
                      </div>
                    </div>

                    <p className="text-[11px] text-gray-500 font-sans leading-relaxed border-t border-gray-200 pt-3">
                      Métrica prospectiva simulando necessidade de provisão (PCLD) em ambiente de estresse severo de liquidez e juros.
                    </p>
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
