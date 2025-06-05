// Google Apps Script 웹앱 URL
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrQYWsGtcivWnD2ydP7PeNuWhEkeomZ7G1FpSnflUAjs00w6zT8bsjyPnugGmwyplS/exec';

document.addEventListener('DOMContentLoaded', () => {
  // --- (기존 코드 생략) ---
  const walkInInput = document.getElementById('walkInTime');
  const roomInput = document.getElementById('roomSize');
  const difficultyInput = document.getElementById('difficulty');
  const roomButtons = document.querySelectorAll('.room-buttons button');
  const difficultyButtons = document.querySelectorAll('.difficulty-buttons button');
  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');

  // *** 1. 팀명 랜덤 생성용 리스트 정의 ***
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
    // 여기에 원하시는 팀명들을 추가로 넣으세요.
  ];

  const teamNameInput = document.getElementById('teamName');
  const randomBtn = document.getElementById('randomTeamNameBtn');

  // 방 크기 선택
  roomButtons.forEach(btn => btn.addEventListener('click', () => {
    roomButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    roomInput.value = btn.dataset.value;
  }));

  // 난이도 선택
  const difficultyNote = document.getElementById('difficultyNote');
  difficultyButtons.forEach(btn => btn.addEventListener('click', () => {
    difficultyButtons.forEach(b => b.classList.remove('selected'));
    btn.classList.add('selected');
    difficultyInput.value = btn.dataset.value;

    const mapping = {
      'ㅂ베이직': '(👶처음이거나, 아이와 함께라면^^🎈)',
      'ㅇ이지':   '(😉처음인데, 내가 센스는 좀 있다!👍)',
      'ㄴ노멀': '(💪평소 운동 좀 한다!🏃‍♂️)',
      'ㅎ하드': '(🤯발이 안보인다. 너무 어려워요!🥵)'
    };
    difficultyNote.textContent = mapping[btn.dataset.value] || '(처음이시라면 베이직, 이지 추천!)';
  }));

  form.addEventListener('submit', e => {
    e.preventDefault();
    const submitBtn = form.querySelector('button[type="submit"]');
    submitBtn.disabled = true;

    if (!confirm('입력한 정보가 맞습니까?')) {
      submitBtn.disabled = false;
      return;
    }

    const teamName = form.teamName.value.trim();
    const adult = Number(form.adultCount.value);
    const youth = Number(form.youthCount.value);
    const vehicleVal = form.vehicle.value.trim();
    if (!teamName) {
      alert('팀명을 입력해주세요.'); submitBtn.disabled = false; return;
    }
    if (adult + youth <= 0) {
      alert('인원 수를 입력해주세요.'); submitBtn.disabled = false; return;
    }
    if (vehicleVal !== '' && !/^\d{4}$/.test(vehicleVal)) {
      alert('차량번호는 숫자 네 자리 또는 빈칸으로 입력해주세요.');
      submitBtn.disabled = false;
      return;
    }

    // 슬롯 계산
    const now = new Date();
    let h = now.getHours();
    const m = now.getMinutes();
    const slots = [0, 20, 40];
    let chosen = slots.find(s => m <= s + 3);
    if (chosen === undefined) { h = (h + 1) % 24; chosen = 0; }
    const slotStr = `${String(h).padStart(2,'0')}:${String(chosen).padStart(2,'0')}`;
    walkInInput.value = slotStr;

    // payload 준비
    const payload = {
      walkInTime: slotStr,
      roomSize: roomInput.value,
      teamName,
      difficulty: difficultyInput.value,
      totalCount: adult + youth,
      youthCount: youth,
      vehicle: form.vehicle.value.trim() || ''
    };

    // 전송 시작 (비동기 백그라운드)
    resultDiv.textContent = '전송 중...';
    fetch(SCRIPT_URL, {
      method: 'POST',
      mode: 'no-cors',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });

    // 결제 금액 안내
    const adultAmount = adult * 7000;
    const youthAmount = youth * 5000;
    const totalAmount = adultAmount + youthAmount;
    resultDiv.innerHTML =
      `전송 완료 ^^<br>` +
      `결제 금액은 : <br>` +
      `<strong style="font-size:1.2em; color:#d32f2f;">총 금액 = ${totalAmount.toLocaleString()}원</strong><br>` +
      `성인 ${adult}명 × 7,000원 = ${adultAmount.toLocaleString()}원<br>` +
      `청소년 ${youth}명 × 5,000원 = ${youthAmount.toLocaleString()}원<br>`;

    // 2초 후 초기화
    setTimeout(() => {
      resultDiv.innerHTML = '';
      form.reset();
      roomButtons.forEach(b => b.classList.remove('selected'));
      difficultyButtons.forEach(b => b.classList.remove('selected'));
      submitBtn.disabled = false;
    }, 2000);
  });
});
      resultDiv.innerHTML = '';
      form.reset();
      roomButtons.forEach(b => b.classList.remove('selected'));
      difficultyButtons.forEach(b => b.classList.remove('selected'));
      submitBtn.disabled = false;
    }, 2000);
  });
});
