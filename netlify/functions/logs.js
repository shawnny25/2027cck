// Netlify Function: /.netlify/functions/logs?key=본인이_정한_비밀값
// 챗봇에 들어온 질문 목록(익명, 개인 식별 정보 없음)을 표로 보여주는 비공개 페이지.
// ADMIN_KEY는 Netlify 환경변수에만 등록한다 (GEMINI_API_KEY와 동일한 방식).
// 이 URL은 다른 사람에게 공유하지 말 것 — key 값을 아는 사람은 누구나 목록을 볼 수 있다.

const { getStore } = require('@netlify/blobs');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

exports.handler = async function (event) {
  const headers = { 'Content-Type': 'text/html; charset=utf-8' };

  const providedKey = (event.queryStringParameters && event.queryStringParameters.key) || '';
  const adminKey = process.env.ADMIN_KEY;

  if (!adminKey) {
    return {
      statusCode: 500,
      headers,
      body: '<h1>ADMIN_KEY 환경변수가 설정되지 않았습니다.</h1><p>Netlify 사이트 설정에서 ADMIN_KEY를 먼저 등록해 주세요.</p>',
    };
  }

  if (providedKey !== adminKey) {
    return { statusCode: 401, headers, body: '<h1>접근 권한이 없습니다.</h1>' };
  }

  try {
    const store = getStore('chat-logs');
    const { blobs } = await store.list();

    const items = [];
    for (const b of blobs) {
      const data = await store.get(b.key, { type: 'json' });
      if (data && data.message) items.push(data);
    }
    items.sort((a, b) => new Date(b.time) - new Date(a.time));

    const rows = items
      .map(
        (it) =>
          `<tr><td class="t">${escapeHtml(it.time)}</td><td class="m">${escapeHtml(it.message)}</td></tr>`
      )
      .join('');

    const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>챗봇 질문 로그</title>
<style>
  body{font-family:"Apple SD Gothic Neo","Malgun Gothic",sans-serif;background:#f4f5f7;padding:24px;color:#1f2328;}
  h1{font-size:19px;margin-bottom:4px;}
  .count{color:#6b7280;font-size:13px;margin-bottom:16px;}
  table{border-collapse:collapse;width:100%;background:#fff;box-shadow:0 1px 3px rgba(0,0,0,.08);border-radius:8px;overflow:hidden;}
  td{border-bottom:1px solid #eee;font-size:14px;padding:8px 12px;vertical-align:top;}
  td.t{white-space:nowrap;color:#9ca3af;font-size:12px;width:150px;}
  tr:last-child td{border-bottom:none;}
</style>
</head>
<body>
  <h1>사랑의열매 해외지원사업 챗봇 — 질문 로그</h1>
  <div class="count">총 ${items.length}건 · 최신순 · 개인 식별 정보 없음</div>
  <table>${rows || '<tr><td class="m">아직 기록된 질문이 없습니다.</td></tr>'}</table>
</body>
</html>`;

    return { statusCode: 200, headers, body: html };
  } catch (err) {
    return {
      statusCode: 500,
      headers,
      body: `<pre>오류: ${escapeHtml((err && err.message) || String(err))}</pre>`,
    };
  }
};
