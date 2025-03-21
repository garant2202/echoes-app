// Three.js сцена
let camera, scene, renderer;
let particlesMesh, sphere;

// Ініціалізація 3D-сцени
function init3DScene() {
    // Сцена
    scene = new THREE.Scene();
    scene.background = new THREE.Color(0x111111);
    
    // Камера
    camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 0.1, 1000);
    camera.position.z = 5;
    
    // Створення частинок для імітації туману
    const particlesGeometry = new THREE.BufferGeometry();
    const particlesCount = 1000;
    const posArray = new Float32Array(particlesCount * 3);
    
    for(let i = 0; i < particlesCount * 3; i++) {
        posArray[i] = (Math.random() - 0.5) * 10;
    }
    
    particlesGeometry.setAttribute('position', new THREE.BufferAttribute(posArray, 3));
    
    const particlesMaterial = new THREE.PointsMaterial({
        size: 0.05,
        color: 0x4776e6,
        transparent: true,
        opacity: 0.5
    });
    
    particlesMesh = new THREE.Points(particlesGeometry, particlesMaterial);
    scene.add(particlesMesh);
    
    // Додавання освітлення
    const ambientLight = new THREE.AmbientLight(0xffffff, 0.5);
    scene.add(ambientLight);
    
    const pointLight = new THREE.PointLight(0x4776e6, 1);
    pointLight.position.set(2, 3, 4);
    scene.add(pointLight);
    
    // Додавання сфери для представлення спогаду
    const sphereGeometry = new THREE.SphereGeometry(1, 32, 32);
    const sphereMaterial = new THREE.MeshStandardMaterial({
        color: 0xffffff,
        transparent: true,
        opacity: 0.7,
        emissive: 0x4776e6,
        emissiveIntensity: 0.3
    });
    
    sphere = new THREE.Mesh(sphereGeometry, sphereMaterial);
    scene.add(sphere);
    
    // Рендерер
    const canvas = document.getElementById('experience-canvas');
    if (canvas) {
        renderer = new THREE.WebGLRenderer({ 
            antialias: true, 
            canvas: canvas 
        });
        
        const previewElement = document.querySelector('.experience-preview');
        if (previewElement) {
            renderer.setSize(previewElement.offsetWidth, previewElement.offsetHeight);
        } else {
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }
    
    // Анімація
    animate();
    
    // Обробка зміни розміру вікна
    window.addEventListener('resize', handleResize);
}

// Функція анімації
function animate() {
    requestAnimationFrame(animate);
    
    if (particlesMesh) {
        particlesMesh.rotation.x += 0.0003;
        particlesMesh.rotation.y += 0.0005;
    }
    
    if (sphere) {
        sphere.rotation.y += 0.005;
        
        // Пульсація сфери
        const time = Date.now() * 0.001;
        sphere.scale.x = 1 + Math.sin(time) * 0.1;
        sphere.scale.y = 1 + Math.sin(time) * 0.1;
        sphere.scale.z = 1 + Math.sin(time) * 0.1;
    }
    
    if (renderer && scene && camera) {
        renderer.render(scene, camera);
    }
}

// Обробка зміни розміру вікна
function handleResize() {
    const previewElement = document.querySelector('.experience-preview');
    
    if (camera && previewElement) {
        camera.aspect = previewElement.offsetWidth / previewElement.offsetHeight;
        camera.updateProjectionMatrix();
    }
    
    if (renderer && previewElement) {
        renderer.setSize(previewElement.offsetWidth, previewElement.offsetHeight);
    }
}

// Обробники подій після завантаження DOM
document.addEventListener('DOMContentLoaded', function() {
    // Ініціалізація 3D-сцени
    init3DScene();
    
    // Обробка кліків на кнопку "Створити відлуння"
    document.querySelectorAll('.create-echo-btn').forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault();
            const uploaderElement = document.getElementById('memory-uploader');
            if (uploaderElement) {
                uploaderElement.style.display = 'block';
                uploaderElement.scrollIntoView({ behavior: 'smooth' });
            }
        });
    });
    
    // Налаштування зони завантаження файлів
    const uploaderZone = document.getElementById('uploader-zone');
    const fileInput = document.getElementById('file-input');
    
    if (uploaderZone && fileInput) {
        // Клік по зоні завантаження відкриває діалог вибору файлу
        uploaderZone.addEventListener('click', () => {
            fileInput.click();
        });
        
        // Обробка перетягування файлу
        uploaderZone.addEventListener('dragover', (e) => {
            e.preventDefault();
            uploaderZone.style.background = 'rgba(71, 118, 230, 0.1)';
        });
        
        uploaderZone.addEventListener('dragleave', (e) => {
            e.preventDefault();
            uploaderZone.style.background = 'transparent';
        });
        
        uploaderZone.addEventListener('drop', (e) => {
            e.preventDefault();
            uploaderZone.style.background = 'transparent';
            
            if (e.dataTransfer.files.length) {
                fileInput.files = e.dataTransfer.files;
                handleFileSelect(e.dataTransfer.files[0]);
            }
        });
        
        // Обробка вибору файлу через діалог
        fileInput.addEventListener('change', () => {
            if (fileInput.files.length) {
                handleFileSelect(fileInput.files[0]);
            }
        });
    }
    
    // Обробка кліків на кнопку "Увійти"
    const loginBtn = document.querySelector('.login-btn');
    const loginModal = document.getElementById('login-modal');
    const closeModal = document.querySelector('.close-modal');
    
    if (loginBtn && loginModal) {
        loginBtn.addEventListener('click', (e) => {
            e.preventDefault();
            loginModal.style.display = 'flex';
        });
    }
    
    if (closeModal && loginModal) {
        closeModal.addEventListener('click', () => {
            loginModal.style.display = 'none';
        });
    }
    
    // Закриття модального вікна при кліку за його межами
    window.addEventListener('click', (e) => {
        if (e.target === loginModal) {
            loginModal.style.display = 'none';
        }
    });
    
    // Обробка кліка на кнопку "Згенерувати відлуння"
    const generateEchoBtn = document.getElementById('generate-echo-btn');
    if (generateEchoBtn) {
        generateEchoBtn.addEventListener('click', handleEchoGeneration);
    }
});

// Обробка вибору файлу
function handleFileSelect(file) {
    // Тут буде логіка обробки вибраного файлу
    // У повному додатку тут можна було б завантажити файл на сервер
    
    // Відображення імені файлу в інтерфейсі
    const uploaderText = document.querySelector('.uploader-text');
    if (uploaderText) {
        uploaderText.textContent = `Вибраний файл: ${file.name}`;
    }
    
    // Перегляд зображення (для демонстрації)
    if (file.type.startsWith('image/')) {
        const reader = new FileReader();
        reader.onload = function(event) {
            const img = document.createElement('img');
            img.src = event.target.result;
            img.style.maxWidth = '100%';
            img.style.maxHeight = '200px';
            img.style.borderRadius = '5px';
            img.style.marginBottom = '20px';
            
            // Заміна іконки завантаження на перегляд зображення
            const uploaderIcon = document.querySelector('.uploader-icon');
            if (uploaderIcon) {
                uploaderIcon.innerHTML = '';
                uploaderIcon.appendChild(img);
            }
        };
        reader.readAsDataURL(file);
    }
}

// Обробка генерації відлуння
function handleEchoGeneration() {
    const title = document.getElementById('memory-title');
    const description = document.getElementById('memory-description');
    const loader = document.getElementById('echo-loader');
    
    // Перевірка заповнення форми
    if (!title || !title.value || !description || !description.value) {
        alert('Будь ласка, заповніть усі поля форми.');
        return;
    }
    
    // Відображення індикатора завантаження
    if (loader) {
        loader.style.display = 'block';
    }
    
    // Імітація завантаження (у реальному додатку тут був би запит до сервера)
    setTimeout(() => {
        if (loader) {
            loader.style.display = 'none';
        }
        
        // Відображення повідомлення про успіх
        alert('Ваше відлуння було успішно створено! У реальному додатку тут був би перехід до вашого 3D-спогаду.');
        
        // Очищення форми
        if (title) title.value = '';
        if (description) description.value = '';
        
        // Скидання зони завантаження
        const uploaderIcon = document.querySelector('.uploader-icon');
        const uploaderText = document.querySelector('.uploader-text');
        
        if (uploaderIcon) {
            uploaderIcon.innerHTML = '📤';
        }
        
        if (uploaderText) {
            uploaderText.textContent = 'Перетягніть сюди фото або клацніть, щоб вибрати';
        }
        
        // Приховання форми завантаження
        const uploaderElement = document.getElementById('memory-uploader');
        if (uploaderElement) {
            uploaderElement.style.display = 'none';
        }
    }, 2000);
}

// Анімація лічильників
function animateCounters() {
    const counters = document.querySelectorAll('.counter');
    const speed = 200; // Швидкість анімації (менше = швидше)

    counters.forEach(counter => {
        const target = +counter.innerText.replace(/,/g, '');
        let count = 0;
        const inc = target / speed;
        
        function updateCount() {
            if (count < target) {
                count += inc;
                counter.innerText = Math.ceil(count).toLocaleString();
                setTimeout(updateCount, 1);
            } else {
                counter.innerText = target.toLocaleString();
            }
        }
        
        updateCount();
    });
}

// Запуск анімації лічильників при прокрутці до них
window.addEventListener('scroll', function() {
    const countersElement = document.getElementById('counter-container');
    if (countersElement) {
        const position = countersElement.getBoundingClientRect();
        
        // Якщо елемент видимий у вікні перегляду
        if (position.top >= 0 && position.bottom <= window.innerHeight) {
            // Запускаємо анімацію лише один раз
            if (!countersElement.classList.contains('animated')) {
                countersElement.classList.add('animated');
                animateCounters();
            }
        }
    }
});