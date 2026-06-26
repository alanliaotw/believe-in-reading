'use client';

import { useState, type FormEvent } from 'react';

const inquiryRecipient = "service@reading.com.tw";

const serviceHighlights = [
  {
    title: "企業 ESG 內容企劃",
    description: "從議題設定、採訪撰稿到專題呈現，把永續行動轉化成可閱讀、可分享的品牌內容。",
  },
  {
    title: "永續活動紀錄",
    description: "協助活動文字紀錄、人物訪談、成果報導與社群延伸，讓一次活動留下長期內容資產。",
  },
  {
    title: "永續禮盒與數位導讀",
    description: "結合禮盒、閱讀與數位內容，設計更低耗材、更有敘事感的永續溝通體驗。",
  },
];

const serviceOptions = [
  "企業 ESG 內容企劃",
  "永續活動紀錄",
  "永續禮盒",
  "聚焦誌專題內容",
  "潮永續 / 永續之夜",
  "大同創新研究院相關合作",
  "其他合作",
];

const timelineOptions = ["一個月內", "一到三個月", "三個月以上", "尚未確定"];

type InquiryForm = {
  organization: string;
  name: string;
  role: string;
  email: string;
  phone: string;
  service: string;
  timeline: string;
  budget: string;
  message: string;
};

const initialInquiryForm: InquiryForm = {
  organization: "",
  name: "",
  role: "",
  email: "",
  phone: "",
  service: serviceOptions[0],
  timeline: timelineOptions[3],
  budget: "",
  message: "",
};

export default function PartnershipInquiry() {
  const [inquiryForm, setInquiryForm] = useState<InquiryForm>(initialInquiryForm);
  const [copyStatus, setCopyStatus] = useState("");
  const [draftStatus, setDraftStatus] = useState("");

  const updateInquiryField = (field: keyof InquiryForm, value: string) => {
    setInquiryForm((current) => ({ ...current, [field]: value }));
    setCopyStatus("");
    setDraftStatus("");
  };

  const buildInquiryBody = () => {
    return [
      "您好，我想洽詢相信閱讀 / 聚焦誌 Focus Journal 合作：",
      "",
      `公司 / 單位：${inquiryForm.organization || "未填"}`,
      `聯絡人：${inquiryForm.name || "未填"}`,
      `職稱 / 部門：${inquiryForm.role || "未填"}`,
      `Email：${inquiryForm.email || "未填"}`,
      `電話 / LINE：${inquiryForm.phone || "未填"}`,
      `合作項目：${inquiryForm.service}`,
      `預計時程：${inquiryForm.timeline}`,
      `預算範圍：${inquiryForm.budget || "未填"}`,
      "",
      "需求說明：",
      inquiryForm.message || "未填",
      "",
      "我希望進一步討論合作方式，謝謝。",
    ].join("\n");
  };

  const openEmailDraft = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const subjectName = inquiryForm.organization || inquiryForm.name || "官網訪客";
    const subject = `合作洽詢｜${subjectName}`;
    const mailtoUrl = `mailto:${inquiryRecipient}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(buildInquiryBody())}`;

    window.location.href = mailtoUrl;
    setDraftStatus("已開啟信件草稿");
  };

  const copyInquirySummary = async () => {
    try {
      await navigator.clipboard.writeText(buildInquiryBody());
      setCopyStatus("已複製洽詢摘要");
    } catch {
      setCopyStatus("瀏覽器不支援自動複製，請改用信件草稿");
    }
  };

  return (
    <section id="cooperate" className="relative z-10 max-w-7xl mx-auto mt-20 scroll-mt-28 border-t border-white/10 px-6 pt-14">
      <div className="grid gap-10 lg:grid-cols-[0.9fr_1.1fr] lg:items-start">
        <div>
          <p className="text-sm font-bold uppercase tracking-[0.28em] text-emerald-300">Partnership Inquiry</p>
          <h2 className="mt-4 max-w-2xl text-3xl font-black leading-tight text-white md:text-4xl">
            讓永續行動變成被看見、被理解、被留下的內容資產。
          </h2>
          <p className="mt-5 max-w-2xl text-base leading-8 text-gray-300">
            相信閱讀協助企業、基金會、學校與品牌團隊，把 ESG 專案、永續活動、禮盒企劃與倡議內容整理成清楚、有質感、能持續傳播的敘事。
          </p>

          <div className="mt-8 grid gap-4">
            {serviceHighlights.map((item) => (
              <div key={item.title} className="rounded-lg border border-white/10 bg-white/[0.04] p-5">
                <h3 className="text-base font-bold text-white">{item.title}</h3>
                <p className="mt-2 text-sm leading-7 text-gray-400">{item.description}</p>
              </div>
            ))}
          </div>
        </div>

        <form onSubmit={openEmailDraft} className="rounded-lg border border-white/10 bg-black/55 p-5 shadow-2xl backdrop-blur-md md:p-7">
          <div className="grid gap-4 md:grid-cols-2">
            <label className="block">
              <span className="text-sm font-semibold text-gray-200">公司 / 單位</span>
              <input
                value={inquiryForm.organization}
                onChange={(event) => updateInquiryField("organization", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
                placeholder="例：大同公司"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-200">聯絡人</span>
              <input
                value={inquiryForm.name}
                onChange={(event) => updateInquiryField("name", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
                placeholder="姓名"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-200">職稱 / 部門</span>
              <input
                value={inquiryForm.role}
                onChange={(event) => updateInquiryField("role", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
                placeholder="永續部、品牌行銷、秘書室"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-200">Email</span>
              <input
                type="email"
                value={inquiryForm.email}
                onChange={(event) => updateInquiryField("email", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
                placeholder="name@example.com"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-200">電話 / LINE</span>
              <input
                value={inquiryForm.phone}
                onChange={(event) => updateInquiryField("phone", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
                placeholder="方便聯繫的方式"
              />
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-200">合作項目</span>
              <select
                value={inquiryForm.service}
                onChange={(event) => updateInquiryField("service", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
              >
                {serviceOptions.map((option) => (
                  <option key={option} value={option} className="bg-neutral-950 text-white">
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-200">預計時程</span>
              <select
                value={inquiryForm.timeline}
                onChange={(event) => updateInquiryField("timeline", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
              >
                {timelineOptions.map((option) => (
                  <option key={option} value={option} className="bg-neutral-950 text-white">
                    {option}
                  </option>
                ))}
              </select>
            </label>
            <label className="block">
              <span className="text-sm font-semibold text-gray-200">預算範圍</span>
              <input
                value={inquiryForm.budget}
                onChange={(event) => updateInquiryField("budget", event.target.value)}
                className="mt-2 w-full rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm text-white outline-none transition focus:border-emerald-300"
                placeholder="可留空，或填大約區間"
              />
            </label>
          </div>

          <label className="mt-4 block">
            <span className="text-sm font-semibold text-gray-200">需求說明</span>
            <textarea
              value={inquiryForm.message}
              onChange={(event) => updateInquiryField("message", event.target.value)}
              rows={5}
              className="mt-2 w-full resize-none rounded-lg border border-white/10 bg-white/10 px-4 py-3 text-sm leading-7 text-white outline-none transition focus:border-emerald-300"
              placeholder="請簡單說明合作背景、活動主題、想達成的目標或需要的內容形式。"
            />
          </label>

          <div className="mt-5 flex flex-col gap-3 sm:flex-row">
            <button type="submit" className="min-h-12 flex-1 rounded-lg bg-emerald-400 px-5 py-3 text-sm font-black text-black transition hover:bg-emerald-300">
              開啟信件草稿
            </button>
            <button
              type="button"
              onClick={copyInquirySummary}
              className="min-h-12 flex-1 rounded-lg border border-white/15 px-5 py-3 text-sm font-bold text-white transition hover:border-emerald-300 hover:text-emerald-200"
            >
              複製洽詢摘要
            </button>
          </div>

          {(draftStatus || copyStatus) && (
            <p className="mt-4 min-h-6 text-sm font-semibold text-emerald-200">{draftStatus || copyStatus}</p>
          )}
          <p className="mt-4 text-sm leading-6 text-gray-400">
            合作信箱：
            <a href={`mailto:${inquiryRecipient}`} className="font-semibold text-emerald-200 hover:text-emerald-100">
              {inquiryRecipient}
            </a>
          </p>
        </form>
      </div>
    </section>
  );
}
