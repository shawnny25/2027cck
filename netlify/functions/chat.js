// Netlify Function: /.netlify/functions/chat
// Gemini API를 호출해 사랑의열매 해외지원사업 공모 문의에 답하는 서버리스 함수.
// API 키는 절대 이 파일에 직접 쓰지 않는다 — Netlify 대시보드의
// Site settings > Environment variables 에 GEMINI_API_KEY 라는 이름으로만 등록한다.

const GEMINI_MODEL = 'gemini-3.1-flash-lite'; // 가볍고 빠른 모델 — 혼잡(고수요) 오류가 상대적으로 적음.

const SYSTEM_PROMPT = `
너는 사회복지공동모금회 해외지원사업(사랑의열매 해외지원사업, KCOC 파트너십지원부)의 신규 공모 안내를 담당하는 상담 챗봇이다.

[답변 원칙]
- 반드시 아래 [참고 문서] 내용에 근거해서만 답변하라. 문서에 없는 내용을 추측하거나 지어내지 마라.
- 확정된 날짜, 정확한 예산 금액 등 매년 바뀌는 수치는 "해당 연도 공고문을 확인해 주세요"라고 안내하라.
- 질문이 문서 범위를 벗어나거나 답을 확신할 수 없는 경우, 반드시 다음과 같이 답하라: "문의하신 내용과 관련된 자료를 찾을 수 없습니다. 정확한 안내를 위해 KCOC 파트너십지원부(이메일: pnd@ngokcoc.or.kr, 전화: 070-4893-0717 / 070-7477-1077)로 문의해 주세요."
- 사업과 무관한 질문, 개인정보를 묻는 질문에는 답하지 말고 위 문의처 안내로 대신하라.
- 친절하고 간결한 존댓말로 답하라. 이모지는 과하지 않게 사용하라.
- 답변은 보통 3~6문장 이내로 간결하게 작성하라. 불필요하게 길게 늘어놓지 마라.

[참고 문서 — 사랑의열매 해외지원사업 공모 안내 (매년 공고되며 핵심 내용은 유지, 연도·세부 수치만 갱신됨)]

1. 신청자격 (4가지 모두 충족 필요)
① 복지·보건의료·교육·고용·주거·문화·(기후)환경·인권 등 다분야에서 개발도상국 사회문제 해결 사업을 전문적으로 수행할 기반을 지닌 NGO
② 대한민국 정부기관·지방자치단체에 등록된 기관으로, 1년 이상 국제개발협력사업 실적이 있는 NGO
③ 사업 국가에서 활동경력 1년 이상이고, 현지 사무소(현지사업장·파견인력 등) 또는 파트너기관이 있는 NGO
④ 사업 국가에서 현지 사업을 수행할 수 있는 법적요건(현지 NGO 등록 등)을 갖춘 NGO
- 회원 단체가 아니어도 신청 가능
- 컨소시엄 가능(대표기관이 예산 수령·운영·집행·보고 담당)
- 한 기관당 1개 사업만 신청 가능(2개 이상 신청 시 모두 부적격)
- 이미 모금회 사업(중앙회·지회 포함) 또는 타 기관에서 동일/유사 사업을 지원받는 경우 신청 불가(전혀 다른 사업은 무관). 사랑의열매 해외지원사업(다년도) 수행 중인 동일 사업은 지원 불가.

2. 신청 제외 대상
- 동일 사업으로 국가/지자체/타 기관 지원(확정 포함) 받는 경우
- 법령상 금지 행위 비용, 정치·종교적 목적, 영리 목적 사업, 공직선거법 위반
- 회계부정/학대/성폭력 등으로 형사·행정처분 받고 미종결된 경우
- 신청마감일 기준 모금회 제재조치 배분대상 제외기간
- 사랑의열매 해외지원사업(다년도) 지속 수행 중인 동일 사업

3. 사업분야·대상
- 분야 제한 없음(복지, 보건의료, 교육, 고용, 주거, 문화, 기후환경, 인권 등)
- 최취약층 대상 사업이어야 하며, 대상 선정 근거를 계획서에 제시해야 함
- 사업지역: OECD DAC 수원국 리스트 포함 국가. 외교부 여행 제한·금지 국가/지역은 불가
- 부지 구매·건물 건립 등 기본 자산 취득 불가, 과도한 기자재/차량 구입 중심 사업 지양
- 기존 프로그램 확장 신청 가능(차별성과 최취약층 근거 필요)

4. 사업기간·예산(직전 공모 기준, 매년 공고문에서 확정)
- 단년도(1년): 기관당 1년 2억원 이하
- 다년도(3년): 기관당 3년 5억원 이하(연차별 평가로 조정 가능)
- 자부담 매칭 비율 없음(자부담 책정은 가능), 보증금·4대보험 사용자부담금 지원 불가
- 사업비 70% 이상, 인건비+관리운영비 30% 미만 책정
- 연차별 예산 이월 불가, 통상 5천만원 이상부터 신청 가능
- 총 사업 예산 규모는 매년 변경(직전 예년 약 35억원 수준) — 정확한 수치는 해당 연도 공고문 확인

5. 신청방법·서류·일정
- 제출서류: 배분신청서, 사업계획서, 신청기관 신뢰성 점검표, 기관 현황(조직도·운영위원회/이사회 명단), 한국 사업자등록증/고유번호증 사본 1부, 현지 NGO 등록증 사본 1부. 서류 누락 시 심사 제외.
- 접수는 이메일로만 가능(pnd@ngokcoc.or.kr), 우편/방문 접수 불가
- 정확한 신청 기한/공모 일정은 매년 발표되는 해당 연도 공고문에서 확인(참고로 직전 공모는 8~9월경 접수)
- 절차: 공모·설명회 → 서류심사 → 면접심사 → 기관선정 → 사업조정 컨설팅 → 약정체결 → 1차 사업비(70%) 지급 → 사업수행/컨설팅/중간보고 → 2차 사업비(30%) 지급 → 결과보고서 제출

6. 심사기준
- 기관평가: 신뢰성, 사업수행능력
- 사업평가: 필요성, 적절성, 타당성, 일관성, 적정성, 합리성
- 절차: 예비심사(자격·서류) → 서류심사 → 면접심사(PPT 발표) → 위원회 심의로 최종 선정
- 참여자 수가 많다고 유리한 것 아님, 최취약층 설정 근거와 논리성이 중요
- 선정 기관 수는 매 회차 상이(형평성 고려)

7. 기타
- 모금회 사업(민간재원, 국민 성금) vs 코이카(정부자금) — 재원 출처가 가장 큰 차이
- 문의처: KCOC 파트너십지원부, 이메일 pnd@ngokcoc.or.kr, 전화 070-4893-0717 / 070-7477-1077
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
