const terms = [
  {
    term: "个人闲置",
    category: "condition",
    categoryLabel: "成色与描述",
    translation: "卖家把商品定义为个人使用后的二手物品。",
    signal: "来源可能真实，但不等于状态透明。",
    action: "问购买时间、使用频率和转手原因。",
    risk: "中",
    aliases: ["个人出", "自用闲置"],
    tags: ["来源", "成色"],
  },
  {
    term: "自用一手",
    category: "condition",
    categoryLabel: "成色与描述",
    translation: "卖家声称自己是第一位使用者。",
    signal: "这是来源描述，不是购买凭证。",
    action: "需要时再看订单、发票或序列号信息。",
    risk: "中",
    aliases: ["一手自用", "自己用的"],
    tags: ["来源", "凭证"],
  },
  {
    term: "成色自定义",
    category: "condition",
    categoryLabel: "成色与描述",
    translation: "成色没有统一标准，卖家按自己的尺度描述。",
    signal: "同一个“九成新”，不同人理解可能完全不同。",
    action: "让对方逐项说磨损、功能、配件并补实拍。",
    risk: "高",
    aliases: ["成色自定", "几成新自定义"],
    tags: ["重点", "实拍"],
  },
  {
    term: "功能正常",
    category: "condition",
    categoryLabel: "成色与描述",
    translation: "卖家认为商品能正常工作，但测试范围不明确。",
    signal: "“能开机”不代表所有功能都正常。",
    action: "列出你最在意的功能，请对方逐项录视频。",
    risk: "中",
    aliases: ["使用正常", "一切正常"],
    tags: ["功能", "视频"],
  },
  {
    term: "懂的都懂",
    category: "condition",
    categoryLabel: "成色与描述",
    translation: "卖家省略了具体信息，默认买家熟悉商品或行情。",
    signal: "信息密度低，容易把关键问题藏在模糊话术后面。",
    action: "不要猜，直接问型号、版本、缺陷和配件。",
    risk: "高",
    aliases: ["懂行的来", "懂得自然懂"],
    tags: ["模糊", "型号"],
  },
  {
    term: "原盒原装",
    category: "condition",
    categoryLabel: "成色与描述",
    translation: "卖家声称保留原包装或原配件。",
    signal: "有盒有配件，不自动等于成色好或来源可靠。",
    action: "让对方列明缺少什么，并核对序列号和实物。",
    risk: "中",
    aliases: ["盒装", "原配"],
    tags: ["配件", "核对"],
  },
  {
    term: "全套",
    category: "condition",
    categoryLabel: "成色与描述",
    translation: "卖家表示配件齐全，但“全”指哪些东西并不明确。",
    signal: "包装、说明书、赠品和保修凭证可能不在其中。",
    action: "让对方拍一张配件平铺图，再逐项确认。",
    risk: "中",
    aliases: ["配件齐全", "一套齐"],
    tags: ["配件", "清单"],
  },
  {
    term: "有票",
    category: "condition",
    categoryLabel: "成色与描述",
    translation: "卖家表示有发票、订单或购买凭证。",
    signal: "凭证的时间、主体和可用范围需要单独核对。",
    action: "确认凭证日期、购买人、序列号和售后条件。",
    risk: "中",
    aliases: ["带票", "发票在"],
    tags: ["凭证", "售后"],
  },
  {
    term: "不刀",
    category: "price",
    categoryLabel: "价格与议价",
    translation: "价格不接受议价，或卖家不想反复谈价。",
    signal: "不一定是市场最低价，也不一定包含运费。",
    action: "先比较同款，再确认总价、运费和配件。",
    risk: "低",
    aliases: ["一口价", "不议价"],
    tags: ["价格", "总价"],
  },
  {
    term: "小刀可谈",
    category: "price",
    categoryLabel: "价格与议价",
    translation: "可以小幅议价，但卖家没有承诺具体幅度。",
    signal: "“小”是双方理解，不要把试探当成成交。",
    action: "带着同款参考价，直接给出你的合理报价。",
    risk: "低",
    aliases: ["小刀", "可小刀"],
    tags: ["议价", "报价"],
  },
  {
    term: "大刀勿扰",
    category: "price",
    categoryLabel: "价格与议价",
    translation: "不接受大幅砍价，希望买家按接近标价沟通。",
    signal: "议价空间通常有限，但标价仍需和市场比较。",
    action: "先问最低可接受价，不要用极低价反复试探。",
    risk: "低",
    aliases: ["拒绝大刀", "大刀免谈"],
    tags: ["议价", "边界"],
  },
  {
    term: "急出",
    category: "price",
    categoryLabel: "价格与议价",
    translation: "卖家希望尽快成交，可能愿意交换速度和价格。",
    signal: "急迫感可能是真实需求，也可能被用来催你决定。",
    action: "可以谈价，但不要因为“最后一件”跳过验货。",
    risk: "中",
    aliases: ["急转", "着急出"],
    tags: ["节奏", "价格"],
  },
  {
    term: "福利价",
    category: "price",
    categoryLabel: "价格与议价",
    translation: "卖家强调价格划算，但没有给出比较基准。",
    signal: "“便宜”要和同款、成色、配件一起看。",
    action: "搜同款成交价，再把运费和维修成本算进去。",
    risk: "中",
    aliases: ["超值价", "捡漏价"],
    tags: ["行情", "比价"],
  },
  {
    term: "诚心要可议",
    category: "price",
    categoryLabel: "价格与议价",
    translation: "卖家愿意为确定成交的买家留出谈价空间。",
    signal: "“诚心”通常意味着明确需求，而不是先随便砍价。",
    action: "先确认商品信息，再一次性给出报价和成交条件。",
    risk: "低",
    aliases: ["诚心可议", "诚心价"],
    tags: ["议价", "条件"],
  },
  {
    term: "同城自提",
    category: "trade",
    categoryLabel: "交易与物流",
    translation: "买家到约定地点取货，通常可以当面检查。",
    signal: "省去物流环节，但不代表自动有售后。",
    action: "先约公共地点，验货完成后再按平台流程付款。",
    risk: "低",
    aliases: ["同城面交", "本地自取"],
    tags: ["面交", "验货"],
  },
  {
    term: "面交验货",
    category: "trade",
    categoryLabel: "交易与物流",
    translation: "双方见面，在交付前检查商品状态。",
    signal: "验货范围和验货时长需要提前约定。",
    action: "按清单测试，确认无误后再完成平台内交易。",
    risk: "低",
    aliases: ["当面验货", "见面验"],
    tags: ["面交", "清单"],
  },
  {
    term: "包邮",
    category: "trade",
    categoryLabel: "交易与物流",
    translation: "卖家承担约定范围内的寄送费用。",
    signal: "偏远地区、超重件或特殊包装可能另算。",
    action: "问清快递、保价、包装和异常件责任。",
    risk: "低",
    aliases: ["邮费卖家出", "含运费"],
    tags: ["物流", "费用"],
  },
  {
    term: "顺丰到付",
    category: "trade",
    categoryLabel: "交易与物流",
    translation: "卖家发出顺丰，运费由收件人签收时支付。",
    signal: "到付费用可能高于普通快递，且不代表已保价。",
    action: "先估运费，确认包装和保价，再决定是否接受。",
    risk: "低",
    aliases: ["到付", "运费到付"],
    tags: ["物流", "运费"],
  },
  {
    term: "不包邮",
    category: "trade",
    categoryLabel: "交易与物流",
    translation: "商品标价不包含寄送费用，通常由买家承担。",
    signal: "低价商品加上运费后，可能不再划算。",
    action: "把商品价、运费、保价和包装费合并比较。",
    risk: "低",
    aliases: ["邮费自理", "运费另付"],
    tags: ["物流", "总价"],
  },
  {
    term: "走平台",
    category: "trade",
    categoryLabel: "交易与物流",
    translation: "双方在闲鱼内完成沟通、付款和物流记录。",
    signal: "记录更完整，但仍要在付款前核对商品信息。",
    action: "保持平台内沟通，不点击来路不明的外部链接。",
    risk: "低",
    aliases: ["平台交易", "走闲鱼"],
    tags: ["平台", "记录"],
  },
  {
    term: "私下交易",
    category: "risk",
    categoryLabel: "风险提醒",
    translation: "卖家希望绕开平台，在其他渠道收款或沟通。",
    signal: "平台记录、争议处理和对方身份都更难核实。",
    action: "不私下转账，回到平台确认交易；对方坚持就放弃。",
    risk: "高",
    aliases: ["私下转", "加微信交易", "脱离平台"],
    tags: ["高风险", "停"],
  },
  {
    term: "先款后货",
    category: "risk",
    categoryLabel: "风险提醒",
    translation: "卖家要求买家先付款，再安排发货。",
    signal: "买家先承担全部信任成本，出了问题更难追踪。",
    action: "优先使用平台担保流程，不接受陌生人的私下先款。",
    risk: "高",
    aliases: ["先付后发", "先打款"],
    tags: ["高风险", "停"],
  },
  {
    term: "拍下不退",
    category: "risk",
    categoryLabel: "风险提醒",
    translation: "卖家声明拍下后不接受退货或反悔。",
    signal: "售后空间较小，商品信息必须在付款前问清。",
    action: "先确认瑕疵、功能、配件和退换约定，再决定是否拍。",
    risk: "高",
    aliases: ["拍下不接受退款", "不退不换"],
    tags: ["售后", "重点"],
  },
  {
    term: "售出不退",
    category: "risk",
    categoryLabel: "风险提醒",
    translation: "卖家表示成交后不接受退货。",
    signal: "这不是商品没有问题的证明，反而更需要提前核对。",
    action: "要求关键功能实拍，并把约定留在平台聊天记录里。",
    risk: "高",
    aliases: ["售出不换", "卖出不退"],
    tags: ["售后", "记录"],
  },
  {
    term: "到手刀",
    category: "risk",
    categoryLabel: "风险提醒",
    translation: "买家收到货后，以状态或瑕疵为理由要求降价。",
    signal: "容易引发争议，也可能被用来事后压价。",
    action: "付款前确认成色，收货后先留证，再按平台流程沟通。",
    risk: "高",
    aliases: ["收到砍价", "到手砍"],
    tags: ["争议", "证据"],
  },
  {
    term: "瑕疵自理",
    category: "risk",
    categoryLabel: "风险提醒",
    translation: "卖家表示已有缺陷由买家自行承担。",
    signal: "瑕疵的范围可能比一句话更大。",
    action: "让对方逐条列明问题，并确认是否影响你要用的功能。",
    risk: "高",
    aliases: ["小瑕自理", "瑕疵不管"],
    tags: ["瑕疵", "清单"],
  },
  {
    term: "可验机",
    category: "risk",
    categoryLabel: "风险提醒",
    translation: "卖家愿意接受第三方或当面检查。",
    signal: "愿意验机是积极信号，但验什么、谁来验要先说好。",
    action: "提前确认验机项目、费用承担和验不过时的处理方式。",
    risk: "中",
    aliases: ["支持验机", "可以验货"],
    tags: ["验货", "边界"],
  },
  {
    term: "鸽子勿扰",
    category: "risk",
    categoryLabel: "风险提醒",
    translation: "卖家不希望买家约好后临时取消或失联。",
    signal: "这是交易节奏要求，不代表商品本身更可靠。",
    action: "确认时间地点后再出发，不要因对方催促跳过检查。",
    risk: "低",
    aliases: ["别放鸽子", "爽约勿扰"],
    tags: ["面交", "节奏"],
  },
];

const categoryLabels = {
  condition: "成色与描述",
  price: "价格与议价",
  trade: "交易与物流",
  risk: "风险提醒",
};

const state = {
  query: "",
  category: "all",
};

const termGrid = document.querySelector("#term-grid");
const emptyState = document.querySelector("#empty-state");
const resultsCount = document.querySelector("#results-count");
const termSearch = document.querySelector("#term-search");
const clearSearch = document.querySelector("#clear-search");
const resetSearch = document.querySelector("#reset-search");
const decoderForm = document.querySelector("#decoder-form");
const decoderInput = document.querySelector("#decoder-input");
const decoderOutput = document.querySelector("#decoder-output");

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&#039;");
}

function escapeRegExp(value) {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

function highlight(value, query) {
  const safe = escapeHtml(value);
  if (!query) return safe;
  const pattern = new RegExp(`(${escapeRegExp(query)})`, "ig");
  return safe.replace(pattern, "<mark>$1</mark>");
}

function normalize(value) {
  return value.trim().toLocaleLowerCase("zh-CN");
}

function getFilteredTerms() {
  const query = normalize(state.query);
  return terms.filter((item) => {
    const inCategory = state.category === "all" || item.category === state.category;
    const searchable = [item.term, item.translation, item.signal, item.action, item.categoryLabel, ...item.aliases]
      .join(" ")
      .toLocaleLowerCase("zh-CN");
    return inCategory && (!query || searchable.includes(query));
  });
}

function termCard(item, index) {
  const query = normalize(state.query);
  const cards = [
    `<article class="term-card">`,
    `  <div class="card-header"><span class="card-number">${String(index + 1).padStart(2, "0")}</span><span class="card-category">${escapeHtml(item.categoryLabel)}</span></div>`,
    `  <h3>${highlight(item.term, query)}</h3>`,
    `  <p class="term-translation">${highlight(item.translation, query)}</p>`,
    `  <div class="term-details">`,
    `    <div><span class="detail-label">它可能意味着</span><span class="detail-value">${highlight(item.signal, query)}</span></div>`,
    `    <div><span class="detail-label">下一步</span><span class="detail-value">${highlight(item.action, query)}</span></div>`,
    `  </div>`,
    `  <div class="card-footer"><div class="term-tags">${item.tags.map((tag) => `<span class="term-tag">${escapeHtml(tag)}</span>`).join("")}</div><button class="copy-term" type="button" data-copy="${escapeHtml(item.action)}">复制行动建议</button></div>`,
    `</article>`,
  ];
  return cards.join("");
}

function renderTerms() {
  const filtered = getFilteredTerms();
  termGrid.innerHTML = filtered.map(termCard).join("");
  termGrid.hidden = filtered.length === 0;
  emptyState.hidden = filtered.length !== 0;
  resultsCount.textContent = `${filtered.length} / ${terms.length} 条词典内容`;
  clearSearch.hidden = state.query.length === 0;
}

function setCategory(category) {
  state.category = category;
  document.querySelectorAll("[data-filter]").forEach((button) => {
    const active = button.dataset.filter === category;
    button.classList.toggle("is-active", active);
    button.setAttribute("aria-pressed", String(active));
  });
  renderTerms();
}

function resetFilters() {
  state.query = "";
  state.category = "all";
  termSearch.value = "";
  setCategory("all");
}

function renderStats() {
  const categoryCount = new Set(terms.map((item) => item.category)).size;
  document.querySelector("#stat-terms").textContent = terms.length;
  document.querySelector("#stat-categories").textContent = categoryCount;
}

function matchedTerms(text) {
  const normalizedText = normalize(text);
  return terms.filter((item) => {
    const phrases = [item.term, ...item.aliases];
    return phrases.some((phrase) => normalizedText.includes(normalize(phrase)));
  });
}

function renderDecoder(text) {
  const trimmed = text.trim();
  if (!trimmed) {
    decoderOutput.hidden = false;
    decoderOutput.innerHTML = `<p class="decoder-advice">先粘贴一句商品描述，拆解器才知道从哪里开始。</p>`;
    return;
  }

  const matches = matchedTerms(trimmed);
  if (matches.length === 0) {
    decoderOutput.hidden = false;
    decoderOutput.innerHTML = `
      <p class="decoder-output-title">没有命中现成词条</p>
      <p class="decoder-advice">这句话可能还没收录。先把商品型号、成色、功能、配件、运费和售后问清楚；如果对方要求私下付款，直接先停。</p>
    `;
    return;
  }

  const hasHighRisk = matches.some((item) => item.risk === "高");
  const title = matches.length === 1 ? "命中 1 个信号" : `命中 ${matches.length} 个信号`;
  const cards = matches
    .map(
      (item) => `
        <article class="decoder-match">
          <div class="decoder-match-top"><h3>${escapeHtml(item.term)}</h3><span class="risk-label">${escapeHtml(item.risk)}风险</span></div>
          <p>${escapeHtml(item.translation)} ${escapeHtml(item.action)}</p>
        </article>
      `,
    )
    .join("");
  const advice = hasHighRisk
    ? "这段描述里有高风险信号：先不要私下转账或确认收货，把关键约定留在平台内。"
    : "目前没有命中高风险信号，但仍要把成色、功能、配件和总价核对清楚。";
  decoderOutput.hidden = false;
  decoderOutput.innerHTML = `<p class="decoder-output-title">${title}</p>${cards}<p class="decoder-advice">${advice}</p>`;
}

async function copyText(text, button) {
  try {
    await navigator.clipboard.writeText(text);
    button.textContent = "已复制";
  } catch {
    button.textContent = "请手动复制";
  }
  window.setTimeout(() => {
    button.textContent = "复制行动建议";
  }, 1600);
}

termSearch.addEventListener("input", (event) => {
  state.query = event.target.value;
  renderTerms();
});

clearSearch.addEventListener("click", resetFilters);
resetSearch.addEventListener("click", resetFilters);

document.querySelectorAll("[data-filter]").forEach((button) => {
  button.addEventListener("click", () => setCategory(button.dataset.filter));
});

termGrid.addEventListener("click", (event) => {
  const button = event.target.closest("[data-copy]");
  if (button) copyText(button.dataset.copy, button);
});

decoderForm.addEventListener("submit", (event) => {
  event.preventDefault();
  renderDecoder(decoderInput.value);
});

document.querySelectorAll("[data-example]").forEach((button) => {
  button.addEventListener("click", () => {
    decoderInput.value = button.dataset.example;
    renderDecoder(decoderInput.value);
    decoderInput.focus();
  });
});

renderStats();
renderTerms();
