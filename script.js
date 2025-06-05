// 팀명 배열: 원하는 팀명으로 수정 가능
const teamNames = [
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
];

// DOM 요소 가져오기
const rouletteElement = document.getElementById("roulette");
const toggleButton = document.getElementById("toggleButton");

let spinInterval = null;       // setInterval ID
let autoStopTimeout = null;    // setTimeout ID
let isSpinning = false;        // 회전 중 여부

// 플레이어가 '시작' 버튼을 누르면 호출
function startSpin() {
  isSpinning = true;
  toggleButton.textContent = "멈춤";
  toggleButton.classList.remove("start-button");
  toggleButton.classList.add("stop-button");
  toggleButton.disabled = false;

  rouletteElement.classList.add("spin-mode");
  rouletteElement.textContent = ""; // 내부 텍스트 초기화
  const textSpan = document.createElement("span");
  textSpan.classList.add("text");
  rouletteElement.appendChild(textSpan);

  // 100ms 간격으로 무작위 팀명 표시
  spinInterval = setInterval(() => {
    const randomName = teamNames[Math.floor(Math.random() * teamNames.length)];
    textSpan.textContent = randomName;
  }, 100);

  // 3초 후 자동으로 멈춤 처리
  autoStopTimeout = setTimeout(() => {
    if (isSpinning) {
      stopSpin();
    }
  }, 3000);
}

// 플레이어가 '멈춤' 버튼을 누르거나 자동 타이머 만료 시 호출
function stopSpin() {
  isSpinning = false;
  toggleButton.textContent = "시작";
  toggleButton.classList.remove("stop-button");
  toggleButton.classList.add("start-button");
  rouletteElement.classList.remove("spin-mode");
  clearInterval(spinInterval);
  clearTimeout(autoStopTimeout);

  // 현재 보여지는 팀명을 최종 결과로 확정
  const finalName = rouletteElement.querySelector(".text")?.textContent || "팀 없음";
  rouletteElement.textContent = finalName;

  // 강조 애니메이션
  rouletteElement.classList.add("final-effect");
  setTimeout(() => {
    rouletteElement.classList.remove("final-effect");
  }, 500);
}

// 버튼 클릭 이벤트: 회전 중이 아니면 start, 회전 중이면 stop
toggleButton.addEventListener("click", () => {
  if (!isSpinning) {
    startSpin();
  } else {
    stopSpin();
  }
});

// 페이지 로드 시 초기 설정
document.addEventListener("DOMContentLoaded", () => {
  rouletteElement.textContent = "랜덤 팀명을 눌러주세요!";
  toggleButton.textContent = "시작";
  // 이미 index.html에서 초기 클래스(start-button)를 설정했으므로 별도 추가 작업은 필요없음
});
