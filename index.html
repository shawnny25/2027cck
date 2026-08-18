// Netlify Function: /.netlify/functions/chat
// Gemini API를 호출해 국제 나눔파트너십 지원사업(구 사랑의열매 해외지원사업) 공모 문의에 답하는 서버리스 함수.
// API 키는 절대 이 파일에 직접 쓰지 않는다 — Netlify 대시보드의
// Site settings > Environment variables 에 GEMINI_API_KEY 라는 이름으로만 등록한다.

const { getStore } = require('@netlify/blobs');

// 질문 내용만(개인 식별 정보 없이) 익명으로 기록한다. 실패해도 챗봇 응답에는 영향을 주지 않는다.
async function logQuestion(message) {
  try {
    const store = getStore('chat-logs');
    const key = `q-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
    await store.setJSON(key, { time: new Date().toISOString(), message });
  } catch (e) {
    console.error('question log failed:', e && e.message);
  }
}

const GEMINI_MODEL = 'gemini-3.1-flash-lite'; // 가볍고 빠른 모델 — 혼잡(고수요) 오류가 상대적으로 적음.

const SYSTEM_PROMPT = `
너는 사회복지공동모금회 해외지원사업(2027년 기준 사업명: 국제 나눔파트너십 지원사업 — 예전 명칭 "사랑의열매 해외지원사업"과 동일 계열의 사업, KCOC 파트너십지원부)의 신규 공모 안내를 담당하는 상담 챗봇이다.

[답변 원칙]
- 반드시 아래 [참고 문서] 내용에 근거해서만 답변하라. 문서에 없는 내용을 추측하거나 지어내지 마라.
- [참고 문서]에 2027년 수치(신청기한, 예산, 사업기간 등)가 있으면 그 수치로 답하라. 문서에 없는 세부 수치나 향후 변경 가능성이 있는 내용은 "정확한 사항은 2027년 공고문/사업계획서 양식을 확인해 주세요"라고 안내하라.
- 질문이 문서 범위를 벗어나거나 답을 확신할 수 없는 경우, 반드시 다음과 같이 답하라: "문의하신 내용과 관련된 자료를 찾을 수 없습니다. 정확한 안내를 위해 KCOC 파트너십지원부(이메일: pnd@ngokcoc.or.kr, 김원영 과장 070-4893-0717 / 김지숙 대리 070-7477-1077)로 문의해 주세요."
- 사업과 무관한 질문, 개인정보를 묻는 질문에는 답하지 말고 위 문의처 안내로 대신하라.
- 친절하고 간결한 존댓말로 답하라. 이모지는 과하지 않게 사용하라.
- 답변은 보통 3~6문장 이내로 간결하게 작성하라. 불필요하게 길게 늘어놓지 마라.

[참고 문서 — 국제 나눔파트너십 지원사업(구 사랑의열매 해외지원사업) 공모 안내. 2027년 공고문 내용을 기준으로 작성했고, 공고문에 없는 세부 항목(심사기준 등)은 직전 연도(2026년) 자료를 참고로 유지했다. 이 사업은 매년 공고되며 핵심 내용은 유지되고 연도·세부 수치만 갱신된다.]

0. 사업명 관련 참고
- 2027년 신규 공모부터 공식 사업명이 "국제 나눔파트너십 지원사업"으로 바뀌었다(예전 명칭: 사랑의열매 해외지원사업). 이용자가 "사랑의열매 해외지원사업"이라는 이름으로 문의해도 같은 사업으로 이해하고 답하라. 다만 이미 다년도로 선정되어 수행 중인 기존 사업은 계속 "사랑의열매 해외지원사업(다년도)"으로 불린다.
- 사업목적: 개발도상국 내 다양한 사회문제를 해결하는 해외지원사업의 발굴 / 사업의 성과확산을 통한 최취약층 해외 주민의 복지 향상 및 지속 가능한 현지 역량개발 지원

1. 신청자격 (4가지 모두 충족 필요)
① 복지·보건의료·교육·고용·주거·문화·(기후)환경·인권 등 다분야에서 개발도상국 사회문제 해결 사업을 전문적으로 수행할 기반을 지닌 NGO
② 대한민국 정부기관·지방자치단체에 등록된 기관으로, 1년 이상 국제개발협력사업 실적이 있는 NGO
③ 사업 국가에서 활동경력 1년 이상이고, 현지 사무소(현지사업장·파견인력 등) 또는 파트너기관이 있는 NGO
④ 사업 국가에서 현지 사업을 수행할 수 있는 법적요건(현지 NGO 등록 등)을 갖춘 NGO
- 회원 단체가 아니어도 신청 가능
- 컨소시엄 가능(대표기관이 예산 수령·운영·집행·보고를 담당하며, 예산도 대표기관이 일괄 편성)
- 한 기관당 1개 사업만 신청 가능
- 사랑의열매 해외지원사업(다년도)으로 지속 수행 중인 동일 사업은 신청 불가

2. 신청 제외 대상
- 동일한 사업으로 국가·지방자치단체 또는 다른 기관으로부터 지원을 받았거나 받기로 확정된 사업
- 법령상 금지된 행위에 사용되는 비용
- 정치·종교적 목적에 이용될 수 있는 경우
- 영리를 주된 목적으로 하는 사업
- 공직선거법에 위반되는 경우
- 회계부정 또는 학대·성폭력 등의 인권침해로 형사 또는 행정처분을 받고 해당 조치가 종결되지 않은 경우
- 신청마감일 기준, 모금회의 제재조치에 따른 배분대상 제외기간에 배분 신청한 경우
- 사랑의열매 해외지원사업(다년도)으로 지속 수행 중인 동일 사업

3. 사업분야·대상
- 복지, 보건·의료, 교육, 고용, 주거, 문화, (기후)환경, 인권 등 다분야에서 최취약층 해외 주민의 삶의 질 향상을 통해 지역사회 발전에 기여하는 사업(분야 제한 없음)
- 현지에서 안전하고 지속가능한 환경조성을 도모하고, SDGs 달성에 기여하는 사업
- 사업 시행 후 현지 정부의 제도적인 지원 등을 통해 발전 가능한 사업
- 최취약층 대상 사업이어야 하며, 대상 선정 근거를 계획서에 제시해야 함
- 사업지역: OECD DAC 수원국 리스트에 포함된 국가. 외교부 여행 제한·금지 국가/지역에서의 사업은 지원 불가
- 부지 구매·건물 건립 등 기본 자산 취득 불가, 과도한 기자재·차량 구입 중심 사업 지양
- 기존 프로그램의 확장 신청도 가능(차별성과 최취약층 선정 근거 필요)

4. 사업기간·예산 (2027년 공고 기준)
- 총 사업 규모: 35억원(3,500,000,000원)
- 단년도(1년): 2027년 1월 중 ~ 2027. 12. 31, 기관당 1년간 2억원 이하 지원
- 다년도(3년): 2027년 1월 중 ~ 2029. 12. 31, 기관당 3년간 5억원 이하 지원(연차별 평가결과에 따라 지원 기간·규모가 조정될 수 있음)
- 예산은 사회복지공동모금회 예산편성기준표에 근거해 수립, 보증금 항목과 4대보험 사용자부담금은 지원 불가
- 배분신청 금액 중 인건비 및 관리운영비는 30% 미만으로 책정(= 사업비 70% 이상)
- 최종 지원금액은 심사과정 및 사업조정을 통해 최초 신청금액과 달라질 수 있음
- 컨소시엄의 경우 대표기관에서 예산을 일괄 편성·운용

5. 신청방법·서류·일정 (2027년 공고 기준)
- 신청기한: 2026년 8월 21일(금) ~ 2026년 9월 29일(화) 18:00까지
- 제출서류(공고문 기준, 서류 누락 시 심사 제외): 신청공문, 배분신청서, 사업계획서, 기관현황(조직도·운영위원회·이사회 명단), (한국) 사업자등록증 또는 고유번호증 사본 1부, (현지) NGO 등록증 사본 1부
  ※ 직전연도에는 이 서류들과 함께 "신청기관 신뢰성 점검표"도 제출했다. 2027년 세부 사업계획서 양식/안내서가 별도 배포되면 서류 목록이 조금 더 늘어날 수 있으니, 정확한 최종 서류 목록은 안내서 또는 문의처를 통해 다시 확인하라고 안내하라.
- 제출방법: 위 서류를 모두 첨부하여 KCOC 파트너십지원부 이메일(pnd@ngokcoc.or.kr)로 제출, 우편·방문 접수 불가
- 사업설명회: 2026년 8월 20일(목) 17:00~18:00, 사회복지공동모금회 대강당(장기사업 대상 성과공유회 동시 진행), 2027년 국제 나눔파트너십 지원사업 안내 및 Q&A 진행. 현장 참석이 어려우면 2026년 8월 27일(목)부터 KCOC 유튜브 채널에서 상시 시청 가능
- 유의사항: 기관별 1개 사업만 신청 가능, 신청서 기재 내용은 사실에 근거해야 하며 허위사실 확인 시 배분 취소 및 향후 지원중단 등 제재조치 가능, 심사과정에서 추가자료 제출을 요청할 수 있고 제출된 서류는 반환하지 않음, 선정 기관은 전문가(성과관리위원) 및 KCOC와 사업계획·예산을 협의하여 조정사업계획서를 제출해야 함
- (직전연도 기준 참고) 절차: 공모·설명회 → 서류심사 → 면접심사 → 기관선정 → 사업조정 컨설팅 → 약정체결 → 1차 사업비(70%) 지급 → 사업수행/컨설팅/중간보고 → 2차 사업비(30%) 지급 → 결과보고서 제출

6. 심사기준 (직전연도 자료 기준 — 핵심 내용은 매년 유지됨)
- 기관평가: 신뢰성(기관·법인의 인적·물적·조직적 구성체계 적절성), 사업수행능력(관련 분야 수행경험 등)
- 사업평가: 필요성, 적절성, 타당성, 일관성, 적정성, 합리성
- 절차: 예비심사(자격·서류) → 서류심사 → 면접심사(PPT 발표) → 위원회 심의로 최종 선정
- 참여자 수가 많다고 유리한 것은 아니며, 최취약층 설정 근거와 논리성이 중요
- 선정 기관 수는 매 회차 상이(형평성 고려)

7. 기타
- 모금회 사업(민간재원, 국민 성금) vs 코이카(정부자금) — 재원 출처가 가장 큰 차이
- 문의처: KCOC 파트너십지원부 — 김원영 과장(070-4893-0717), 김지숙 대리(070-7477-1077), 이메일 pnd@ngokcoc.or.kr
`.trim();

exports.handler = async function (event) {
  const headers = {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
  };

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers };
  }
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, headers, body: JSON.stringify({ error: 'Method Not Allowed' }) };
  }

  let payload;
  try {
    payload = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: '잘못된 요청입니다.' }) };
  }

  const message = (payload.message || '').trim();
  const history = Array.isArray(payload.history) ? payload.history : []; // [{role:'user'|'bot', text:'...'}, ...]

  if (!message) {
    return { statusCode: 400, headers, body: JSON.stringify({ error: '질문을 입력해 주세요.' }) };
  }

  await logQuestion(message);

  const apiKey = process.env.GEMINI_API_KEY;
  if (!apiKey) {
    return {
      statusCode: 500,
      headers,
      body: JSON.stringify({ error: '서버에 GEMINI_API_KEY 환경변수가 설정되지 않았습니다. Netlify 사이트 설정에서 등록해 주세요.' }),
    };
  }

  // 최근 대화 이력을 Gemini 형식으로 변환 (최근 10턴만 유지해 과금/컨텍스트 절약)
  const trimmedHistory = history.slice(-10).map((turn) => ({
    role: turn.role === 'bot' ? 'model' : 'user',
    parts: [{ text: String(turn.text || '') }],
  }));

  const contents = [...trimmedHistory, { role: 'user', parts: [{ text: message }] }];

  const callGemini = async () => {
    const resp = await fetch(
      `https://generativelanguage.googleapis.com/v1beta/models/${GEMINI_MODEL}:generateContent`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-goog-api-key': apiKey,
        },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: SYSTEM_PROMPT }] },
          contents,
          generationConfig: {
            temperature: 0.3,
            maxOutputTokens: 2048,
            thinkingConfig: { thinkingLevel: 'minimal' },
          },
        }),
      }
    );
    const data = await resp.json();
    return { ok: resp.ok, status: resp.status, data };
  };

  // 구글 서버 혼잡(고수요/503류) 오류는 자주 일시적이므로, 최대 2번까지 짧은 대기 후 재시도한다.
  const isOverloaded = (r) => {
    if (r.ok) return false;
    const msg = ((r.data && r.data.error && r.data.error.message) || '').toLowerCase();
    return r.status === 503 || r.status === 429 || msg.includes('overloaded') || msg.includes('high demand');
  };
  const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

  try {
    let result = await callGemini();
    let attempt = 1;
    while (isOverloaded(result) && attempt < 3) {
      await sleep(600 * attempt);
      result = await callGemini();
      attempt += 1;
    }

    if (!result.ok) {
      const msg =
        (result.data && result.data.error && result.data.error.message) ||
        'Gemini API 호출 중 오류가 발생했습니다.';
      return { statusCode: result.status, headers, body: JSON.stringify({ error: msg }) };
    }

    const answer =
      result.data?.candidates?.[0]?.content?.parts?.map((p) => p.text).join('') ||
      '문의하신 내용과 관련된 자료를 찾을 수 없습니다. 정확한 안내를 위해 KCOC 파트너십지원부(pnd@ngokcoc.or.kr)로 문의해 주세요.';

    return { statusCode: 200, headers, body: JSON.stringify({ answer }) };
  } catch (err) {
    return { statusCode: 500, headers, body: JSON.stringify({ error: err.message || '알 수 없는 오류가 발생했습니다.' }) };
  }
};
