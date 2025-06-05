// 팀명 배열: 원하는 팀명으로 수정 가능
const teamNames = [
  "팀 A", "팀 B", "팀 C", "팀 D",
  "팀 E", "팀 F", "팀 G", "팀 H",
  "특별팀", "레전드팀", "히든팀"
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
  toggleButton.disabled = false;
  rouletteElement.classList.add("spin-mode");
  rouletteElement.textContent = ""; // 내부 텍스트를 동적으로 처리하므로 클리어
  const textSpan = document.createElement("span");
  textSpan.classList.add("text");
  rouletteElement.appendChild(textSpan);

  // 빠른 속도로 계속 랜덤 팀명 보여주기 (100ms 간격)
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

// 플레이어가 '멈춤' 버튼을 누르거나 3초 경과 시 호출
function stopSpin() {
  isSpinning = false;
  toggleButton.textContent = "시작";
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
});
