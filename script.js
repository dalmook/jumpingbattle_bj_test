// script.js
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrQYWsGtcivWnD2ydP7PeNuWhEkeomZ7G1FpSnflUAjs00w6zT8bsjyPnugGmwyplS/exec';

document.addEventListener('DOMContentLoaded', () => {
  const steps       = Array.from(document.querySelectorAll('.step'));
  const dots        = Array.from(document.querySelectorAll('.step-dot'));
  const stepCounter = document.getElementById('stepCounter');
  const prevBtn     = document.getElementById('prevBtn');
  const nextBtn     = document.getElementById('nextBtn');
  const submitBtn   = document.getElementById('submitBtn');
  let current = 0;

  // 팀명 자동 생성 리스트
  const teamNameList = [
    '순대', '떡볶이', '트랄랄레로 트랄랄라', '봄바르디로 크로코딜로', '퉁퉁퉁퉁퉁퉁퉁퉁퉁 사후르',
    '리릴리 라릴라', '보네카 암발라부', '브르르 브르르 파타핌', '침판지니 바나니니', '봄봄비니 구지니',
    '카푸치노 아사시노', '트리피 트로피', '프리고 카멜로', '발레리나 카푸치나', '오 딘딘딘딘 둔 마 딘딘딘 둔',
    '대박', '뽀로로', '미래소년코난', '피구왕통키', '독수리슛', '번개슛', '도깨비슛',
    '왼발의달인 하석주', '날쌘돌이 서정원', '호나우딩요', '곱창', '대창', '막창', '잡채와 떡갈비',
    '홍어', '코딱지', '은하철도999', '순돌이', '제로콜라', '불고기와퍼', '김치찜', '도르마무',
    '아이언맨', '헐크', '심슨', '도라에몽', '톰과제리', '나는 자연인이다', '무한도전', '런닝맨',
    '우솝', '쵸파', '조로', '갈비탕', '순대국', '돼지국밥', '달마', '시네마천국', '우르사',
    '깔라만씨', '고길동', '둘리', '호의가 계속되면 둘리', '순살치킨', '신라면', '진라면',
    '불닭볶음면', '돼지엄마', '누워서 먹으면 소된다', '방귀가 잦으면 똥이 나온다',
    '언 발에 오줌누기', '번개불에 콩볶아 먹겠다', '참을 인 세번이면 호구', '너 서울대',
    '너 하버드', '너 연세대', '너 고려대', '블랙홀', '쿠쿠다스', '칼국수와 보쌈',
    '에겐남', '에겐녀', '테토남', '테토녀', '아따아따', '방가방가 햄토리', '요술공주 밍키',
    '호빵맨', '검정고무신', '요리왕비룡', '배추도사 무도사', '돈테크만', '보거스', '괴짜가족',
    '보노보노', '구린내', '구데기', '파리지옥'
  ];

  // 단계별 유효성 검사
  function validateStep(n) {
    let ok = false;
    switch (n) {
      case 0:
        ok = !!document.getElementById('roomSize').value;
        break;
      case 1:
        const a = Number(document.getElementById('adultCount').value);
        const y = Number(document.getElementById('youthCount').value);
        ok = (a + y) > 0;
        break;
      case 2:
        ok = !!document.getElementById('teamName').value.trim();
        break;
      case 3:
        ok = !!document.getElementById('difficulty').value;
        break;
      case 4:
        ok = true;
        break;
    }
    nextBtn.disabled = !ok;
  }

  // 화면 전환 및 UI 업데이트
  function showStep(n) {
    steps.forEach((s,i) => s.style.display = i === n ? 'block' : 'none');
    dots.forEach((d,i) => d.classList.toggle('active', i === n));
    prevBtn.style.display   = n === 0               ? 'none' : 'inline-block';
    nextBtn.style.display   = n === steps.length-1  ? 'none' : 'inline-block';
    submitBtn.style.display = n === steps.length-1  ? 'inline-block' : 'none';
    stepCounter.textContent = `STEP ${n+1}/${steps.length}`;
    validateStep(n);
  }

  // 이벤트 바인딩
  dots.forEach((dot, idx) => dot.addEventListener('click', () => {
    current = idx;
    showStep(current);
  }));
  prevBtn.addEventListener('click', () => showStep(--current));
  nextBtn.addEventListener('click', () => showStep(++current));

  // 방 선택
  document.querySelectorAll('.room-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.room-buttons button')
        .forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('roomSize').value = btn.dataset.value;
      validateStep(current);
    });
  });

  // 인원 입력
  ['adultCount','youthCount'].forEach(id => {
    document.getElementById(id).addEventListener('input', () => {
      if (current === 1) validateStep(1);
    });
  });

  // 팀명 자동 생성
  document.getElementById('generateTeamNameBtn').addEventListener('click', () => {
    const rand = teamNameList[Math.floor(Math.random() * teamNameList.length)];
    document.getElementById('teamName').value = rand;
    if (current === 2) validateStep(2);
  });
  // 팀명 직접 입력
  document.getElementById('teamName').addEventListener('input', () => {
    if (current === 2) validateStep(2);
  });

  // 난이도 선택
  document.querySelectorAll('.difficulty-buttons button').forEach(btn => {
    btn.addEventListener('click', () => {
      document.querySelectorAll('.difficulty-buttons button')
        .forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      document.getElementById('difficulty').value = btn.dataset.value;
      if (current === 3) validateStep(3);
    });
  });

  // 폼 제출 처리 (기존 로직 유지)
  const form      = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');
  form.addEventListener('submit', e => {
    e.preventDefault();
    submitBtn.disabled = true;

    const teamName = form.teamName.value.trim();
    const adult    = Number(form.adultCount.value);
    const youth    = Number(form.youthCount.value);
    if (!teamName) {
      alert('팀명을 입력해주세요.');
      submitBtn.disabled = false;
      return;
    }
    if (adult + youth <= 0) {
      alert('인원 수를 입력해주세요.');
      submitBtn.disabled = false;
      return;
    }

    // 슬롯 계산
    const now     = new Date();
    let h         = now.getHours(), m = now.getMinutes();
    const slots   = [0, 20, 40];
    let chosen    = slots.find(s => m <= s + 3);
    if (chosen === undefined) { h = (h + 1) % 24; chosen = 0; }
    const slotStr = `${String(h).padStart(2,'0')}:${String(chosen).padStart(2,'0')}`;
    document.getElementById('walkInTime').value = slotStr;

    // 백그라운드 전송
    const payload = {
      walkInTime: slotStr,
      roomSize:   form.roomSize.value,
      teamName,
      difficulty: form.difficulty.value,
      totalCount: adult + youth,
      youthCount: youth,
      vehicle:    form.vehicle.value.trim() || ''
    };
    resultDiv.textContent = '전송 중...';
    fetch(SCRIPT_URL, { method:'POST', mode:'no-cors', headers:{'Content-Type':'application/json'}, body: JSON.stringify(payload) });

    // 결제 안내
    const adultAmt = adult * 7000;
    const youthAmt = youth * 5000;
    const totalAmt = adultAmt + youthAmt;
    resultDiv.innerHTML =
      `전송 완료 ^^<br>` +
      `결제 금액은 :<br>` +
      `<strong style="font-size:1.2em; color:#d32f2f;">총 금액 = ${totalAmt.toLocaleString()}원</strong><br>` +
      `성인 ${adult}명 × 7,000원 = ${adultAmt.toLocaleString()}원<br>` +
      `청소년 ${youth}명 × 5,000원 = ${youthAmt.toLocaleString()}원<br>`;

    // 초기화
    setTimeout(() => {
      resultDiv.innerHTML = '';
      form.reset();
      document.querySelectorAll('.room-buttons button').forEach(b => b.classList.remove('selected'));
      document.querySelectorAll('.difficulty-buttons button').forEach(b => b.classList.remove('selected'));
      current = 0;
      showStep(current);
      submitBtn.disabled = false;
    }, 2000);
  });

  // 초기화
  showStep(current);
});
