// 팀명을 배열로 정의합니다. 필요에 따라 수정하세요.
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
const spinButton = document.getElementById("spinButton");

// 스핀 중인지 여부를 추적하는 변수
let isSpinning = false;

// 스핀 버튼 클릭 시 호출되는 함수
function spinRoulette() {
  if (isSpinning) return; // 이미 스핀 중이면 무시
  isSpinning = true;
  spinButton.disabled = true;

  // 총 회전 횟수를 랜덤하게 정합니다 (40에서 70 사이)
  const minSpins = 40;
  const maxSpins = 70;
  const totalSpins = Math.floor(Math.random() * (maxSpins - minSpins + 1)) + minSpins;

  // 초기/최종 딜레이(ms)
  const initialDelay = 50;  // 빠르게 시작
  const finalDelay = 300;   // 천천히 멈추면서 기대감 UP

  // 각 회전별 딜레이를 선형적으로 계산
  const delays = [];
  for (let i = 0; i < totalSpins; i++) {
    // i/totalSpins 비율만큼 딜레이를 느리게 한다
    const delay = initialDelay + (finalDelay - initialDelay) * (i / totalSpins);
    delays.push(delay);
  }

  // 누적 딜레이를 구하고 setTimeout으로 순차 실행
  let cumulativeDelay = 0;

  for (let i = 0; i < totalSpins; i++) {
    cumulativeDelay += delays[i];
    setTimeout(() => {
      // 순서대로 순환하며 팀명 표시
      const currentIndex = i % teamNames.length;
      rouletteElement.textContent = teamNames[currentIndex];

      // 스핀 도는 중간에는 깜빡이는 효과 추가
      rouletteElement.classList.add("blink");

      // 마지막 회전에서 깜빡임 제거 후 멈춤 처리
      if (i === totalSpins - 1) {
        rouletteElement.classList.remove("blink");
        isSpinning = false;
        spinButton.disabled = false;
        // 최종 결과를 강조하기 위해 잠깐 애니메이션을 줄 수도 있습니다.
        // 예: 텍스트를 살짝 커졌다 작아졌다 하게 만들기
        animationEndEffect();
      }
    }, cumulativeDelay);
  }
}

// 스핀이 끝난 뒤 최종 결과 강조 애니메이션 함수
function animationEndEffect() {
  rouletteElement.style.transform = "scale(1.2)";
  setTimeout(() => {
    rouletteElement.style.transform = "scale(1)";
  }, 400);
}

// 버튼에 이벤트 리스너 연결
spinButton.addEventListener("click", spinRoulette);

// 페이지 로드 시 초기 텍스트 설정
document.addEventListener("DOMContentLoaded", () => {
  rouletteElement.textContent = "랜덤 팀명을 눌러주세요!";
});
