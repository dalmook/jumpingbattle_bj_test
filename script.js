// Google Apps Script 웹앱 URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrQYWsGtcivWnD2ydP7PeNuWhEkeomZ7G1FpSnflUAjs00w6zT8bsjyPnugGmwyplS/exec';

document.addEventListener('DOMContentLoaded', () => {
  // --- 랜덤 팀명 생성용 리스트 정의 ---
  const teamNameList = [
    '점핑히어로즈',
    '배틀킹',
    '점프스피릿',
    '스카이라이더즈',
    '점핑레전드',
    '배틀브레이커',
    '점프천사',
    '스텝마스터',
    '점핑제네시스',
    '배틀스매셔'
    // 필요한 만큼 팀명을 추가하세요.
  ];

  // 각종 폼 요소들 가져오기
  const walkInInput     = document.getElementById('walkInTime');
  const roomInput       = document.getElementById('roomSize');
  const difficultyInput = document.getElementById('difficulty');
  const teamNameInput   = document.getElementById('teamName');
  const randomBtn       = document.getElementById('randomTeamNameBtn');
  const roomButtons     = document.querySelectorAll('.room-buttons button');
  const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
  const form            = document.getElementById('reservationForm');
  const resultDiv       = document.getElementById('result');
  const difficultyNote  = document.getElementById('difficultyNote');

  // --- 랜덤 팀명 버튼 클릭 시 ---
  randomBtn.addEventListener('click', () => {
    const idx = Math.floor(Math.random() * teamNameList.length);
    teamNameInput.value = teamNameList[idx];
  });

  // --- 방 크기 선택 버튼 클릭 시 ---
  roomButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      roomButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      roomInput.value = btn.dataset.value;
    });
  });

  // --- 난이도 선택 버튼 클릭 시 ---
  difficultyButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      difficultyButtons.forEach(b => b.classList.remove('selected'));
      btn.classList.add('selected');
      difficultyInput.value = btn.dataset.value;

      // 난이도별 안내 문구 업데이트
      const mapping = {
        'ㅂ베이직': '(👶처음이거나, 아이와 함께라면^^🎈)',
        'ㅇ이지':   '(😉처음인데, 내가 센스는 좀 있다!👍)',
        'ㄴ노멀': '(💪평소 운동 좀 한다!🏃‍♂️)',
        'ㅎ하드': '(🤯발이 안보인다. 너무 어려워요!🥵)'
      };
      difficultyNote.textContent = mapping[btn.dataset.value] || '(처음이시라면 베이직, 이지 추천!)';
    });
  });

  // --- 폼 제출 시 이벤트 핸들러 ---
  form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    // 최종 확인
    if (!confirm('입력한 정보가 맞습니까?')) {
      submitBtn.disabled = false;
      return;
    }

    // 값 검증
    const teamName = form.teamName.value.trim();
    const adult     = Number(form.adultCount.value);
    const youth     = Number(form.youthCount.value);
    const vehicleVal = form.vehicle.value.trim();

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
    if (vehicleVal !== '' && !/^\d{4}$/.test(vehicleVal)) {
      alert('차량번호는 숫자 네 자리 또는 빈칸으로 입력해주세요.');
      submitBtn.disabled = false;
      return;
    }

    // 현재 시각 기반 슬롯 계산
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const slots = [0, 20, 40];
    let chosen = slots.find(s => m <= s + 3);
    if (chosen === undefined) {
      h = (h + 1) % 24;
      chosen = 0;
    }
    const slotStr = `${String(h).padStart(2, '0')}:${String(chosen).padStart(2, '0')}`;
    walkInInput.value = slotStr;

    // 전송할 데이터(payload) 준비
    const payload = {
      walkInTime: slotStr,
      roomSize:   roomInput.value,
      teamName:   teamName,
      difficulty: difficultyInput.value,
      totalCount: adult + youth,
      youthCount: youth,
      vehicle:    vehicleVal || ''
    };

    // 백그라운드로 전송
    resultDiv.textContent = '전송 중...';
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode:   'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body:   JSON.stringify(payload)
    });

    // 결제 금액 계산 및 화면 표시
    const adultAmount = adult * 7000;
    const youthAmount = youth * 5000;
    const totalAmount = adultAmount + youthAmount;
    resultDiv.innerHTML =
      `전송 완료 ^^<br>` +
      `결제 금액은 : <br>` +
      `<strong style="font-size:1.2em; color:#d32f2f;">총 금액 = ${totalAmount.toLocaleString()}원</strong><br>` +
      `성인 ${adult}명 × 7,000원 = ${adultAmount.toLocaleString()}원<br>` +
      `청소년 ${youth}명 × 5,000원 = ${youthAmount.toLocaleString()}원<br>`;

    // 2초 후 폼 초기화 및 버튼 활성화
    setTimeout(() => {
      resultDiv.innerHTML = '';
      form.reset();
      roomButtons.forEach(b => b.classList.remove('selected'));
      difficultyButtons.forEach(b => b.classList.remove('selected'));
      submitBtn.disabled = false;
    }, 2000);
  });
});
