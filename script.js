// script.js
const SCRIPT_URL = 'https://script.google.com/macros/s/AKfycbzrQYWsGtcivWnD2ydP7PeNuWhEkeomZ7G1FpSnflUAjs00w6zT8bsjyPnugGmwyplS/exec';

document.addEventListener('DOMContentLoaded', () => {
  // 멀티스텝 네비게이션
  const steps = Array.from(document.querySelectorAll('.step'));
  const dots  = Array.from(document.querySelectorAll('.step-dot'));
  const prevBtn = document.getElementById('prevBtn');
  const nextBtn = document.getElementById('nextBtn');
  const submitBtn = document.getElementById('submitBtn');
  let current = 0;

  function showStep(n) {
    steps.forEach((s,i)=> s.style.display = i===n ? 'block' : 'none');
    dots.forEach((d,i)=> d.classList.toggle('active', i===n));
    prevBtn.style.display   = n===0               ? 'none' : 'inline-block';
    nextBtn.style.display   = n===steps.length-1  ? 'none' : 'inline-block';
    submitBtn.style.display = n===steps.length-1  ? 'inline-block' : 'none';
  }
  prevBtn.addEventListener('click', ()=> { current = Math.max(current-1,0); showStep(current); });
  nextBtn.addEventListener('click', ()=> { current = Math.min(current+1,steps.length-1); showStep(current); });
  showStep(current);

  // 방 선택
  const roomButtons = document.querySelectorAll('.room-buttons button');
  const roomInput   = document.getElementById('roomSize');
  roomButtons.forEach(btn => btn.addEventListener('click', ()=>{
    roomButtons.forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    roomInput.value = btn.dataset.value;
  }));

  // 난이도 선택
  const diffBtns = document.querySelectorAll('.difficulty-buttons button');
  const diffInput= document.getElementById('difficulty');
  const diffNote = document.getElementById('difficultyNote');
  const noteMap  = {
    'ㅂ베이직': '(👶처음이거나, 아이와 함께라면^^🎈)',
    'ㅇ이지':   '(😉처음인데, 내가 센스는 좀 있다!👍)',
    'ㅅ우주':   '(🌌우주급 도전, 준비됐나요?🚀)',
    'ㄴ노말':   '(💪평소 운동 좀 한다!🏃‍♂️)',
    'ㅎ하드':   '(🤯발이 안보인다! 너무 어려워요!🥵)',
    'ㅊ챌린져':'(🏆최강자 도전, 살아남을 수 있겠어?💥)'
  };
  diffBtns.forEach(btn => btn.addEventListener('click', ()=>{
    diffBtns.forEach(b=>b.classList.remove('selected'));
    btn.classList.add('selected');
    diffInput.value = btn.dataset.value;
    diffNote.textContent = noteMap[btn.dataset.value] || '(처음이시라면 베이직, 이지 추천!)';
  }));

  // 폼 제출
  const form = document.getElementById('reservationForm');
  const resultDiv = document.getElementById('result');
  form.addEventListener('submit', e=>{
    e.preventDefault();
    submitBtn.disabled = true;
    if (!confirm('입력한 정보가 맞습니까?')) { submitBtn.disabled = false; return; }

    const teamName = form.teamName.value.trim();
    const adult    = Number(form.adultCount.value);
    const youth    = Number(form.youthCount.value);
    if (!teamName) { alert('팀명을 입력해주세요.'); submitBtn.disabled = false; return; }
    if (adult + youth <= 0) { alert('인원 수를 입력해주세요.'); submitBtn.disabled = false; return; }

    // 슬롯 계산
    const now = new Date(); let h=now.getHours(), m=now.getMinutes();
    const slots = [0,20,40];
    let chosen = slots.find(s=> m <= s+3);
    if (chosen===undefined){ h=(h+1)%24; chosen=0; }
    const slotStr = `${String(h).padStart(2,'0')}:${String(chosen).padStart(2,'0')}`;
    document.getElementById('walkInTime').value = slotStr;

    // 백그라운드 전송
    const payload = {
      walkInTime: slotStr,
      roomSize:   form.roomSize.value,
      teamName:   teamName,
      difficulty: form.difficulty.value,
      totalCount: adult + youth,
      youthCount: youth,
      vehicle:    form.vehicle.value.trim() || ''
    };
    resultDiv.textContent = '전송 중...';
    fetch(SCRIPT_URL, { method:'POST', mode:'no-cors',
      headers:{'Content-Type':'application/json'},
      body: JSON.stringify(payload)
    });

    // 결제 안내
    const adultAmt = adult * 7000, youthAmt = youth * 5000, totalAmt = adultAmt + youthAmt;
    resultDiv.innerHTML =
      `전송 완료 ^^<br>`+
      `결제 금액은 :<br>`+
      `<strong style="font-size:1.2em; color:#d32f2f;">총 금액 = ${totalAmt.toLocaleString()}원</strong><br>`+
      `성인 ${adult}명 × 7,000원 = ${adultAmt.toLocaleString()}원<br>`+
      `청소년 ${youth}명 × 5,000원 = ${youthAmt.toLocaleString()}원<br>`;

    // 초기화
    setTimeout(()=>{
      resultDiv.innerHTML = '';
      form.reset();
      roomButtons.forEach(b=>b.classList.remove('selected'));
      diffBtns.forEach(b=>b.classList.remove('selected'));
      current = 0; showStep(current);
      submitBtn.disabled = false;
    }, 2000);
  });
});
