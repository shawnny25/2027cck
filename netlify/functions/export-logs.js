// Netlify Function: /.netlify/functions/export-logs
// 챗봇에 들어온 질문 로그(Netlify Blobs 'chat-logs' 스토어)를 모아서 보여주는 관리자 전용 페이지.
// 아무나 볼 수 없도록 비밀 키(LOG_EXPORT_KEY)를 주소 끝의 ?key=... 로 확인한다.
// 사용 전 Netlify 대시보드 > Site configuration > Environment variables 에
// LOG_EXPORT_KEY 라는 이름으로 본인이 정한 비밀번호(영문+숫자 조합 추천)를 등록해야 한다.
// (chat.js의 GEMINI_API_KEY 등록했던 것과 같은 화면, 같은 방법)

const { getStore, connectLambda } = require('@netlify/blobs');

function escapeHtml(s) {
  return String(s)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function escapeCsv(s) {
  return `"${String(s).replace(/"/g, '""')}"`;
}

exports.handler = async function (event) {
  connectLambda(event); // Netlify Blobs를 이 함수(Lambda 호환 모드)에서 쓰려면 반드시 가장 먼저 호출해야 함

  const params = event.queryStringParameters || {};
  const requiredKey = process.env.LOG_EXPORT_KEY;

  if (!requiredKey) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: '서버에 LOG_EXPORT_KEY 환경변수가 설정되지 않았습니다. Netlify 사이트 설정(Environment variables)에서 LOG_EXPORT_KEY 라는 이름으로 비밀번호를 등록한 뒤 다시 시도해 주세요.',
    };
  }

  if (!params.key || params.key !== requiredKey) {
    return {
      statusCode: 401,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: '접근 권한이 없습니다. 주소 끝에 ?key=설정한비밀번호 를 붙여서 다시 시도해 주세요.',
    };
  }

  let rows = [];
  try {
    const store = getStore('chat-logs');
    const { blobs } = await store.list();
    for (const b of blobs) {
      const data = await store.get(b.key, { type: 'json' });
      if (data && data.message) rows.push(data);
    }
    rows.sort((a, b) => new Date(b.time) - new Date(a.time));
  } catch (err) {
    return {
      statusCode: 500,
      headers: { 'Content-Type': 'text/plain; charset=utf-8' },
      body: '로그를 불러오는 중 오류가 발생했습니다: ' + (err && err.message),
    };
  }

  const format = params.format === 'csv' ? 'csv' : 'html';

  if (format === 'csv') {
    const csv = ['시간,질문', ...rows.map((r) => `${escapeCsv(r.time)},${escapeCsv(r.message)}`)].join('\n');
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="chatbot_questions.csv"',
      },
      body: '﻿' + csv, // 엑셀에서 한글 깨지지 않도록 BOM 추가
    };
  }

  const tableRows = rows
    .map(
      (r) =>
        `<tr><td>${escapeHtml(new Date(r.time).toLocaleString('ko-KR'))}</td><td>${escapeHtml(r.message)}</td></tr>`
    )
    .join('');

  const html = `<!DOCTYPE html>
<html lang="ko">
<head>
<meta charset="UTF-8">
<meta name="viewport" content="width=device-width, initial-scale=1.0">
<title>챗봇 질문 로그</title>
<style>
  body{font-family:"Apple SD Gothic Neo","Malgun Gothic",sans-serif;padding:24px;background:#f4f5f7;color:#1f2328;}
  h1{font-size:19px;margin:0 0 4px;}
  .meta{color:#6b7280;font-size:13px;margin-bottom:16px;}
  .btn{display:inline-block;margin-bottom:16px;padding:8px 16px;background:#e2231a;color:#fff;
       text-decoration:none;border-radius:8px;font-size:13px;font-weight:600;}
  .btn:hover{background:#b81a13;}
  table{border-collapse:collapse;width:100%;background:#fff;box-shadow:0 1px 2px rgba(0,0,0,.05);}
  th,td{border:1px solid #e5e7eb;padding:9px 12px;font-size:13.5px;text-align:left;vertical-align:top;}
  th{background:#f7941e;color:#fff;position:sticky;top:0;}
  td:first-child{white-space:nowrap;color:#6b7280;width:170px;}
  tr:nth-child(even){background:#fafafa;}
</style>
</head>
<body>
  <h1>챗봇 질문 로그 (총 ${rows.length}건)</h1>
  <div class="meta">최근 질문 순으로 정렬되어 있습니다. 개인정보 없이 질문 내용과 시간만 저장됩니다.</div>
  <a class="btn" href="?key=${encodeURIComponent(params.key)}&format=csv">⬇ CSV로 다운로드 (엑셀에서 열기)</a>
  <table>
    <thead><tr><th>시간</th><th>질문 내용</th></tr></thead>
    <tbody>${tableRows || '<tr><td colspan="2">아직 기록된 질문이 없습니다.</td></tr>'}</tbody>
  </table>
</body>
</html>`;

  return {
    statusCode: 200,
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
    body: html,
  };
};
