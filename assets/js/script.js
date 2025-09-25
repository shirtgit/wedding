// Tailwind CSS 테마 커스터마이징
tailwind.config = {
    theme: {
        extend: {
            fontFamily: {
                serif: ['Noto Serif KR', 'serif'],
                display: ['Playfair Display', 'serif'],
            },
            colors: {
                'stone': {
                    50: '#fafaf9',
                    100: '#f5f5f4',
                    200: '#e7e5e4',
                    300: '#d6d3d1',
                    400: '#a8a29e',
                    500: '#78716c',
                    600: '#57534e',
                    700: '#44403c',
                    800: '#292524',
                    900: '#1c1917',
                },
                'rose': {
                    100: '#ffe4e6',
                    200: '#fecdd3',
                    300: '#fda4af',
                    400: '#fb7185',
                    500: '#f43f5e',
                }
            },
        }
    }
}

// 전역 변수
let currentImageIndex = 0;
const galleryImages = [];

// DOM이 로드된 후 실행
document.addEventListener('DOMContentLoaded', () => {
    // AOS 초기화
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        offset: 100
    });

    // 각종 이벤트 리스너 설정
    initCalendar();
    initGallery();
    initRSVPForm();
    initFloatingButtons();
    initScrollEffects();
    initMessageSystem();
    initCherryBlossoms();
});

// 달력 초기화
function initCalendar() {
    const calendarContainer = document.getElementById('calendar-container');
    const targetDate = new Date(2025, 8, 25); // 2025년 9월 25일
    const year = targetDate.getFullYear();
    const month = targetDate.getMonth();
    const day = targetDate.getDate();

    const getMonthName = (m) => {
        const months = ['1월', '2월', '3월', '4월', '5월', '6월', '7월', '8월', '9월', '10월', '11월', '12월'];
        return months[m];
    };

    const getDayName = (date) => {
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        return days[date.getDay()];
    };

    const generateCalendar = (year, month) => {
        const firstDay = new Date(year, month, 1);
        const lastDay = new Date(year, month + 1, 0);
        const numDays = lastDay.getDate();
        const weddingDay = new Date(year, month, day);

        let html = `
            <div class="text-center mb-6">
                <h3 class="text-2xl font-medium text-stone-800 mb-2">${year}년 ${getMonthName(month)}</h3>
                <p class="text-stone-600">${getDayName(weddingDay)}요일</p>
            </div>
            <div class="calendar-grid text-sm mb-3 font-medium text-stone-600">
                <span class="text-rose-400">일</span>
                <span>월</span>
                <span>화</span>
                <span>수</span>
                <span>목</span>
                <span>금</span>
                <span class="text-blue-400">토</span>
            </div>
            <div class="calendar-grid text-lg">
        `;

        // 첫 주 공백 채우기
        for (let i = 0; i < firstDay.getDay(); i++) {
            html += `<div class="calendar-day"></div>`;
        }

        // 날짜 채우기
        for (let d = 1; d <= numDays; d++) {
            const isTargetDay = (d === day);
            const isToday = new Date().toDateString() === new Date(year, month, d).toDateString();
            const dayOfWeek = new Date(year, month, d).getDay();
            
            let classes = 'calendar-day';
            if (isTargetDay) classes += ' highlight';
            if (isToday && !isTargetDay) classes += ' bg-stone-100';
            if (dayOfWeek === 0) classes += ' text-rose-400'; // 일요일
            if (dayOfWeek === 6) classes += ' text-blue-400'; // 토요일

            html += `<div class="${classes}">${d}</div>`;
        }

        html += `</div>`;
        
        // D-Day 계산
        const today = new Date();
        const timeDiff = weddingDay.getTime() - today.getTime();
        const daysDiff = Math.ceil(timeDiff / (1000 * 3600 * 24));
        
        if (daysDiff > 0) {
            html += `<div class="text-center mt-6 p-4 bg-rose-50 rounded-xl">
                <p class="text-rose-600 font-medium">D-${daysDiff}</p>
                <p class="text-sm text-stone-600 mt-1">결혼식까지 ${daysDiff}일 남았습니다</p>
            </div>`;
        } else if (daysDiff === 0) {
            html += `<div class="text-center mt-6 p-4 bg-rose-100 rounded-xl">
                <p class="text-rose-700 font-bold text-lg">D-DAY</p>
                <p class="text-sm text-stone-700 mt-1">오늘이 바로 그 날입니다! 💕</p>
            </div>`;
        }

        calendarContainer.innerHTML = html;
    };

    generateCalendar(year, month);
}

// 갤러리 초기화
function initGallery() {
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('galleryModal');
    const modalImg = document.getElementById('galleryModalImg');
    const closeBtn = document.querySelector('.gallery-close');
    const prevBtn = document.getElementById('galleryPrev');
    const nextBtn = document.getElementById('galleryNext');

    // 이미지 목록 생성
    galleryItems.forEach((item, index) => {
        const img = item.querySelector('img');
        galleryImages.push(img.src);
        
        item.addEventListener('click', () => {
            currentImageIndex = index;
            showModal();
        });
    });

    function showModal() {
        modal.style.display = 'block';
        modalImg.src = galleryImages[currentImageIndex];
        document.body.style.overflow = 'hidden';
    }

    function hideModal() {
        modal.style.display = 'none';
        document.body.style.overflow = 'auto';
    }

    function showPrevImage() {
        currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
        modalImg.src = galleryImages[currentImageIndex];
    }

    function showNextImage() {
        currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
        modalImg.src = galleryImages[currentImageIndex];
    }

    // 이벤트 리스너
    closeBtn.addEventListener('click', hideModal);
    prevBtn.addEventListener('click', showPrevImage);
    nextBtn.addEventListener('click', showNextImage);
    
    // 모달 외부 클릭시 닫기
    modal.addEventListener('click', (e) => {
        if (e.target === modal) hideModal();
    });

    // 키보드 이벤트
    document.addEventListener('keydown', (e) => {
        if (modal.style.display === 'block') {
            if (e.key === 'Escape') hideModal();
            if (e.key === 'ArrowLeft') showPrevImage();
            if (e.key === 'ArrowRight') showNextImage();
        }
    });
}

// RSVP 폼 초기화
function initRSVPForm() {
    const form = document.getElementById('rsvpForm');
    
    if (form) {
        form.addEventListener('submit', (e) => {
            e.preventDefault();
            
            const formData = new FormData(form);
            const data = {
                name: formData.get('name') || document.getElementById('name').value,
                phone: formData.get('phone') || document.getElementById('phone').value,
                attendance: formData.get('attendance'),
                companions: document.getElementById('companions').value,
                message: document.getElementById('message').value
            };

            // 폼 유효성 검사
            if (!data.name.trim()) {
                alert('성함을 입력해주세요.');
                return;
            }

            if (!data.attendance) {
                alert('참석 여부를 선택해주세요.');
                return;
            }

            // 성공 메시지
            showSuccessMessage('참석 의사가 성공적으로 전달되었습니다! 감사합니다.');
            
            // 폼 초기화
            form.reset();
            
            // 메시지 추가 (실제로는 서버로 전송)
            if (data.message.trim()) {
                addMessageToBoard(data.name, data.message);
            }
        });
    }
}

// 성공 메시지 표시
function showSuccessMessage(message) {
    const successDiv = document.createElement('div');
    successDiv.className = 'fixed top-4 right-4 bg-green-500 text-white px-6 py-3 rounded-lg shadow-lg z-50 animate-pulse';
    successDiv.textContent = message;
    
    document.body.appendChild(successDiv);
    
    setTimeout(() => {
        successDiv.remove();
    }, 3000);
}

// 메시지 보드에 메시지 추가
function addMessageToBoard(name, message) {
    const messagesContainer = document.getElementById('messagesContainer');
    const messageCard = document.createElement('div');
    const now = new Date();
    const dateStr = `${now.getFullYear()}.${String(now.getMonth() + 1).padStart(2, '0')}.${String(now.getDate()).padStart(2, '0')}`;
    
    messageCard.className = 'message-card fade-in-up';
    messageCard.innerHTML = `
        <div class="flex items-start space-x-4">
            <div class="message-avatar">
                <i class="fas fa-user"></i>
            </div>
            <div class="flex-1">
                <div class="flex items-center justify-between mb-2">
                    <h4 class="font-medium text-stone-800">${name}</h4>
                    <span class="text-xs text-stone-500">${dateStr}</span>
                </div>
                <p class="text-stone-600">${message}</p>
            </div>
        </div>
    `;
    
    messagesContainer.prepend(messageCard);
}

// 플로팅 버튼 초기화
function initFloatingButtons() {
    const shareBtn = document.getElementById('shareBtn');
    const scrollTopBtn = document.getElementById('scrollTop');

    // 공유 버튼
    shareBtn.addEventListener('click', () => {
        if (navigator.share) {
            navigator.share({
                title: '김민수 ♥ 이지은 결혼식 초대장',
                text: '저희의 결혼식에 초대합니다.',
                url: window.location.href
            });
        } else {
            // 폴백: URL 복사
            navigator.clipboard.writeText(window.location.href).then(() => {
                showSuccessMessage('링크가 복사되었습니다!');
            });
        }
    });

    // 맨 위로 버튼
    scrollTopBtn.addEventListener('click', () => {
        window.scrollTo({
            top: 0,
            behavior: 'smooth'
        });
    });

    // 스크롤에 따른 버튼 표시/숨김
    window.addEventListener('scroll', () => {
        if (window.pageYOffset > 300) {
            scrollTopBtn.style.opacity = '1';
            scrollTopBtn.style.pointerEvents = 'all';
        } else {
            scrollTopBtn.style.opacity = '0';
            scrollTopBtn.style.pointerEvents = 'none';
        }
    });
}

// 스크롤 효과 초기화
function initScrollEffects() {
    // 패럴랙스 효과
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        
        const hero = document.querySelector('.hero-section');
        if (hero) {
            hero.style.transform = `translateY(${rate}px)`;
        }
    });

    // 부드러운 앵커 링크
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });
}

// 메시지 시스템 초기화
function initMessageSystem() {
    // 샘플 메시지들 (실제로는 서버에서 가져와야 함)
    const sampleMessages = [
        { name: '김○○', message: '두 분의 앞날에 행복만 가득하시길 바랍니다. 축하해요!', date: '2025.09.20' },
        { name: '이○○', message: '정말 아름다운 커플이에요. 오래오래 행복하세요!', date: '2025.09.19' },
        { name: '박○○', message: '결혼을 진심으로 축하드립니다. 멋진 가정 이루세요.', date: '2025.09.18' }
    ];

    const messagesContainer = document.getElementById('messagesContainer');
    
    // 기존 메시지 제거 후 샘플 메시지 추가
    messagesContainer.innerHTML = '';
    
    sampleMessages.forEach((msg, index) => {
        setTimeout(() => {
            const messageCard = document.createElement('div');
            messageCard.className = 'message-card fade-in-up';
            messageCard.innerHTML = `
                <div class="flex items-start space-x-4">
                    <div class="message-avatar">
                        <i class="fas fa-user"></i>
                    </div>
                    <div class="flex-1">
                        <div class="flex items-center justify-between mb-2">
                            <h4 class="font-medium text-stone-800">${msg.name}</h4>
                            <span class="text-xs text-stone-500">${msg.date}</span>
                        </div>
                        <p class="text-stone-600">${msg.message}</p>
                    </div>
                </div>
            `;
            messagesContainer.appendChild(messageCard);
        }, index * 200);
    });
}

// 유틸리티 함수들
function formatPhoneNumber(phone) {
    return phone.replace(/(\d{3})(\d{4})(\d{4})/, '$1-$2-$3');
}

function validateEmail(email) {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
}

// 디바이스 감지
function isMobile() {
    return window.innerWidth <= 768;
}

// 터치 이벤트 (모바일 갤러리 스와이프)
let touchStartX = 0;
let touchEndX = 0;

document.addEventListener('touchstart', e => {
    touchStartX = e.changedTouches[0].screenX;
});

document.addEventListener('touchend', e => {
    touchEndX = e.changedTouches[0].screenX;
    handleSwipe();
});

function handleSwipe() {
    const modal = document.getElementById('galleryModal');
    
    if (modal.style.display === 'block') {
        if (touchEndX < touchStartX - 50) {
            // 왼쪽 스와이프 - 다음 이미지
            currentImageIndex = (currentImageIndex + 1) % galleryImages.length;
            document.getElementById('galleryModalImg').src = galleryImages[currentImageIndex];
        }
        
        if (touchEndX > touchStartX + 50) {
            // 오른쪽 스와이프 - 이전 이미지
            currentImageIndex = (currentImageIndex - 1 + galleryImages.length) % galleryImages.length;
            document.getElementById('galleryModalImg').src = galleryImages[currentImageIndex];
        }
    }
}

// 인쇄 기능
function printInvitation() {
    window.print();
}

// 로딩 애니메이션
window.addEventListener('load', () => {
    const loader = document.querySelector('.loader');
    if (loader) {
        loader.style.opacity = '0';
        setTimeout(() => {
            loader.remove();
        }, 300);
    }
});

// 에러 핸들링
window.addEventListener('error', (e) => {
    console.error('Error occurred:', e.error);
});

// 온라인/오프라인 상태 감지
window.addEventListener('online', () => {
    showSuccessMessage('인터넷 연결이 복구되었습니다.');
});

window.addEventListener('offline', () => {
    showSuccessMessage('인터넷 연결이 끊어졌습니다. 일부 기능이 제한될 수 있습니다.');
});

// Cherry Blossom Animation
function initCherryBlossoms() {
    const canvas = document.getElementById('cherry-canvas');
    if (!canvas) return;
    
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    const ctx = canvas.getContext('2d');
    
    const TOTAL = 50; // 꽃잎 개수를 줄여서 성능 최적화
    const petalArray = [];
    
    // 꽃잎 이미지 (간단한 핑크색 원으로 대체)
    function createPetalImage() {
        const canvas = document.createElement('canvas');
        canvas.width = 20;
        canvas.height = 20;
        const ctx = canvas.getContext('2d');
        
        // 핑크색 꽃잎 모양 그리기
        ctx.fillStyle = 'rgba(255, 182, 193, 0.7)';
        ctx.beginPath();
        ctx.ellipse(10, 10, 8, 4, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        
        ctx.fillStyle = 'rgba(255, 192, 203, 0.5)';
        ctx.beginPath();
        ctx.ellipse(10, 10, 6, 3, Math.PI / 4, 0, 2 * Math.PI);
        ctx.fill();
        
        return canvas;
    }
    
    const petalImg = createPetalImage();
    
    class Petal {
        constructor() {
            this.x = Math.random() * canvas.width;
            this.y = Math.random() * canvas.height - canvas.height;
            this.w = Math.random() * 15 + 5;
            this.h = this.w;
            this.opacity = Math.random() * 0.5 + 0.3;
            this.flip = Math.random();
            this.xSpeed = Math.random() * 2 - 1;
            this.ySpeed = Math.random() * 1 + 1;
            this.flipSpeed = Math.random() * 0.03;
        }
        
        draw() {
            if (this.y > canvas.height || this.x > canvas.width || this.x < 0) {
                this.x = Math.random() * canvas.width;
                this.y = -this.h;
                this.xSpeed = Math.random() * 2 - 1;
                this.ySpeed = Math.random() * 1 + 1;
            }
            
            ctx.globalAlpha = this.opacity;
            ctx.drawImage(
                petalImg,
                this.x,
                this.y,
                this.w * Math.abs(Math.cos(this.flip)),
                this.h
            );
        }
        
        animate() {
            this.x += this.xSpeed;
            this.y += this.ySpeed;
            this.flip += this.flipSpeed;
        }
    }
    
    // 꽃잎 생성
    for (let i = 0; i < TOTAL; i++) {
        petalArray.push(new Petal());
    }
    
    function render() {
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        
        petalArray.forEach(petal => {
            petal.animate();
            petal.draw();
        });
        
        requestAnimationFrame(render);
    }
    
    render();
    
    // 창 크기 변경시 캔버스 크기 조정
    window.addEventListener('resize', () => {
        canvas.width = window.innerWidth;
        canvas.height = window.innerHeight;
    });
}
