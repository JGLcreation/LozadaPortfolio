document.addEventListener('DOMContentLoaded', () => {
  const cursor = document.getElementById('cursor');
  const trail = document.getElementById('cursorTrail');
  const progressBar = document.getElementById('progressBar');
  const particlesContainer = document.getElementById('particles');
  const reveals = document.querySelectorAll('.reveal');
  const navLinkItems = document.querySelectorAll('.nav-links a');
  const sections = document.querySelectorAll('section[id]:not(#hero)');
  const themeToggle = document.getElementById('themeToggle');
  const themeIcon = themeToggle?.querySelector('.theme-toggle-icon');
  const savedTheme = localStorage.getItem('portfolio-theme');
  const prefersLight = window.matchMedia('(prefers-color-scheme: light)').matches;
  const navToggle = document.getElementById('navToggle');
  const navLinksContainer = document.getElementById('navLinks');

  const applyTheme = (theme) => {
    const isLight = theme === 'light';
    document.body.classList.toggle('light-theme', isLight);

    if (themeToggle) {
      themeToggle.setAttribute('aria-pressed', String(isLight));
      themeToggle.setAttribute('aria-label', isLight ? 'Switch to dark mode' : 'Switch to light mode');
    }

    if (themeIcon) {
      themeIcon.textContent = isLight ? 'D' : 'L';
    }
  };

  applyTheme(savedTheme || (prefersLight ? 'light' : 'dark'));

  if (themeToggle) {
    themeToggle.addEventListener('click', () => {
      const nextTheme = document.body.classList.contains('light-theme') ? 'dark' : 'light';
      localStorage.setItem('portfolio-theme', nextTheme);
      applyTheme(nextTheme);
    });
  }

  if (cursor && trail) {
    let mouseX = 0;
    let mouseY = 0;
    let trailX = 0;
    let trailY = 0;

    document.addEventListener('mousemove', (event) => {
      mouseX = event.clientX;
      mouseY = event.clientY;
      cursor.style.left = `${mouseX - 6}px`;
      cursor.style.top = `${mouseY - 6}px`;
    });

    const animateTrail = () => {
      trailX += (mouseX - trailX) * 0.12;
      trailY += (mouseY - trailY) * 0.12;
      trail.style.left = `${trailX - 18}px`;
      trail.style.top = `${trailY - 18}px`;
      requestAnimationFrame(animateTrail);
    };

    animateTrail();

    document.querySelectorAll('a, button').forEach((element) => {
      element.addEventListener('mouseenter', () => {
        cursor.style.transform = 'scale(2.5)';
        trail.style.transform = 'scale(1.5)';
      });

      element.addEventListener('mouseleave', () => {
        cursor.style.transform = 'scale(1)';
        trail.style.transform = 'scale(1)';
      });
    });
  }

  if (progressBar) {
    window.addEventListener('scroll', () => {
      const scrollableHeight = document.body.scrollHeight - window.innerHeight;
      const percent = scrollableHeight > 0 ? (window.scrollY / scrollableHeight) * 100 : 0;
      progressBar.style.width = `${percent}%`;
    });
  }

  if (reveals.length) {
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    }, { threshold: 0.12 });

    reveals.forEach((element) => revealObserver.observe(element));
  }

  const animateCounter = (element, target) => {
    let current = 0;
    const step = target / 60;

    const timer = setInterval(() => {
      current += step;

      if (current >= target) {
        element.textContent = `${target}+`;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 20);
  };

  const statsElement = document.querySelector('.about-stats');
  if (statsElement) {
    const statsObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          document.querySelectorAll('[data-count]').forEach((element) => {
            animateCounter(element, parseInt(element.dataset.count, 10));
          });
          statsObserver.disconnect();
        }
      });
    }, { threshold: 0.5 });

    statsObserver.observe(statsElement);
  }

  if (particlesContainer) {
    for (let index = 0; index < 25; index += 1) {
      const particle = document.createElement('div');
      particle.classList.add('particle');
      particle.style.left = `${Math.random() * 100}vw`;
      particle.style.animationDuration = `${12 + Math.random() * 20}s`;
      particle.style.animationDelay = `${Math.random() * 20}s`;

      const size = Math.random() < 0.5 ? 1 : 2;
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;

      particlesContainer.appendChild(particle);
    }
  }

  if (navLinkItems.length && sections.length) {
    const setActiveLink = (id) => {
      navLinkItems.forEach((link) => {
        const isActive = link.getAttribute('href') === `#${id}`;
        link.classList.toggle('active', isActive);
      });
    };

    const sectionObserver = new IntersectionObserver((entries) => {
      const visibleEntry = entries
        .filter((entry) => entry.isIntersecting)
        .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];

      if (visibleEntry) {
        setActiveLink(visibleEntry.target.id);
      }
    }, {
      rootMargin: '-30% 0px -50% 0px',
      threshold: [0.2, 0.4, 0.6]
    });

    sections.forEach((section) => sectionObserver.observe(section));

    navLinkItems.forEach((link) => {
      link.addEventListener('click', () => {
        const targetId = link.getAttribute('href')?.replace('#', '');
        if (targetId) {
          setActiveLink(targetId);
        }
      });
    });
  }

  const awardModal = document.getElementById('awardModal');
  const imageTriggers = document.querySelectorAll('[data-image]');
  const awardModalClose = document.getElementById('awardModalClose');
  const awardModalImage = document.getElementById('awardModalImage');

  const closeAwardModal = () => {
    if (!awardModal) return;
    awardModal.classList.remove('open');
    awardModal.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    if (awardModalImage) awardModalImage.src = '';
  };

  if (imageTriggers && awardModal) {
    imageTriggers.forEach((btn) => {
      btn.addEventListener('click', () => {
        const imageSrc = btn.dataset.image;
        if (awardModalImage && imageSrc) {
          awardModalImage.src = imageSrc;
          awardModalImage.alt = btn.getAttribute('aria-label') || 'Image preview';
        }

        awardModal.classList.add('open');
        awardModal.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
      });
    });
  }

  if (awardModalClose && awardModal) {
    awardModalClose.addEventListener('click', closeAwardModal);
  }

  if (awardModal) {
    awardModal.addEventListener('click', (event) => {
      if (event.target === awardModal) {
        closeAwardModal();
      }
    });

    document.addEventListener('keydown', (event) => {
      if (event.key === 'Escape' && awardModal.classList.contains('open')) {
        closeAwardModal();
      }
    });
  }

  /* ═══════════════════════════════════════
     AI ASSISTANT CHAT
  ═══════════════════════════════════════ */
  const aiToggle = document.getElementById('aiAssistantToggle');
  const aiChat = document.getElementById('aiAssistantChat');
  const aiClose = document.getElementById('aiChatClose');
  const aiForm = document.getElementById('aiChatForm');
  const aiInput = document.getElementById('aiChatInput');
  const aiMessages = document.getElementById('aiChatMessages');

  const openAiChat = () => {
    if (!aiChat) return;
    aiChat.classList.add('open');
    aiChat.setAttribute('aria-hidden', 'false');
    aiInput?.focus();
  };

  const closeAiChat = () => {
    if (!aiChat) return;
    aiChat.classList.remove('open');
    aiChat.setAttribute('aria-hidden', 'true');
  };

  aiToggle?.addEventListener('click', openAiChat);
  aiClose?.addEventListener('click', closeAiChat);

  /* ═══════════════════════════════════════
     MOBILE NAVIGATION TOGGLE
  ═══════════════════════════════════════ */
  if (navToggle && navLinksContainer) {
    navToggle.addEventListener('click', () => {
      const isOpen = navLinksContainer.classList.toggle('open');
      navToggle.classList.toggle('active', isOpen);
      navToggle.setAttribute('aria-expanded', String(isOpen));
    });

    navLinksContainer.querySelectorAll('a').forEach((link) => {
      link.addEventListener('click', () => {
        navLinksContainer.classList.remove('open');
        navToggle.classList.remove('active');
        navToggle.setAttribute('aria-expanded', 'false');
      });
    });
  }

  const getBotResponse = (message) => {
    const normalized = message.toLowerCase();

    const responses = [
      {
        keywords: ['name', 'who are you', 'about you', 'tell me about'],
        reply:
          "Jayson Gerona Lozada is an Information Technology student from Davao del Sur State College (2024-2026). He values hard work, perseverance, and continuous learning."
      },
      {
        keywords: ['contact', 'email', 'phone', 'reach', 'call', 'message'],
        reply:
          "You can reach Jayson at jaysongeronlozada@gmail.com or 0931 043 3639. He's based in Digos City, Davao del Sur, Philippines."
      },
      {
        keywords: ['skill', 'skills', 'tech', 'technology', 'tools', 'stack'],
        reply:
          "Jayson's skills include Frontend (React, Next.js, HTML, CSS, JavaScript), Backend (Supabase, PHP, Laragon, Java), Database (MySQL, Cloud SQL, Laravel), Data Science (R, SQL), and Tools (Git, GitHub, VS Code, Figma, Canva, CapCut)."
      },
      {
        keywords: ['experience', 'work', 'job', 'history', 'background'],
        reply:
          "Recent experience includes Junior Full Stack Software Developer (2025-2026), Night Market Vendor (2024-2026), Call Center Agent (2023-2024), and SPES Program Encoder at a Local Government Office (2020-2021)."
      },
      {
        keywords: ['project', 'projects', 'portfolio', 'work sample'],
        reply:
          "Key projects: WereChat (COIL Global Web Design), CineVerse Hub, Re-Syn T-H System, and Hiram Hub System. Most use React, Supabase, and Vercel."
      },
      {
        keywords: ['education', 'school', 'college', 'university', 'studies', 'academic'],
        reply:
          "Jayson is currently pursuing a Bachelor of Science in Information Technology at Davao del Sur State College (2024-2026). He completed STEM at Matti National High School (2020-2024)."
      },
      {
        keywords: ['award', 'awards', 'achievement', 'achievements', 'recognition'],
        reply:
          "Awards include COIL Global Web Design Participation (2026), Online Startup Pitching Competition provincial level (2024), Academic Engagement Recognition (2026), and Outstanding Technical Support (2026)."
      },
      {
        keywords: ['certificate', 'certificates', 'certification', 'training', 'seminar'],
        reply:
          "Certificates include COIL Global Web Design, Orientation Caravan — NRCP, and Academic Engagement Recognition."
      },
      {
        keywords: ['location', 'where', 'address', 'based', 'live', 'from'],
        reply:
          "Jayson is based in Digos City, Davao del Sur, Philippines."
      },
      {
        keywords: ['hire', 'available', 'open to work', 'opportunity', 'job'],
        reply:
          "Yes! Jayson is open for work in 2026. He's ready for collaborations and IT opportunities."
      },
      {
        keywords: ['hello', 'hi', 'hey', 'good morning', 'good afternoon'],
        reply:
          "Hello! Ask me about Jayson's skills, experience, projects, education, awards, or contact details."
      },
      {
        keywords: ['help', 'what can you do', 'assist'],
        reply:
          "I can answer questions about Jayson's background, skills, experience, projects, education, awards, certificates, and contact information."
      }
    ];

    for (const item of responses) {
      if (item.keywords.some((keyword) => normalized.includes(keyword))) {
        return item.reply;
      }
    }

    return "I'm not sure about that. Try asking about Jayson's skills, experience, projects, education, awards, certificates, or contact details.";
  };

  const addMessage = (text, sender) => {
    if (!aiMessages) return;
    const messageDiv = document.createElement('div');
    messageDiv.classList.add('ai-message', sender === 'user' ? 'ai-message-user' : 'ai-message-bot');

    const bubble = document.createElement('div');
    bubble.classList.add('ai-message-bubble');

    const paragraph = document.createElement('p');
    paragraph.textContent = text;
    bubble.appendChild(paragraph);
    messageDiv.appendChild(bubble);
    aiMessages.appendChild(messageDiv);

    aiMessages.scrollTop = aiMessages.scrollHeight;
  };

  const showTyping = () => {
    if (!aiMessages) return;
    const typingDiv = document.createElement('div');
    typingDiv.classList.add('ai-message', 'ai-message-bot');
    typingDiv.id = 'aiTypingIndicator';

    const bubble = document.createElement('div');
    bubble.classList.add('ai-message-bubble');

    const dots = document.createElement('div');
    dots.classList.add('ai-typing');
    dots.innerHTML = '<div class="ai-typing-dot"></div><div class="ai-typing-dot"></div><div class="ai-typing-dot"></div>';

    bubble.appendChild(dots);
    typingDiv.appendChild(bubble);
    aiMessages.appendChild(typingDiv);
    aiMessages.scrollTop = aiMessages.scrollHeight;
  };

  const hideTyping = () => {
    const typing = document.getElementById('aiTypingIndicator');
    if (typing) typing.remove();
  };

  aiForm?.addEventListener('submit', (event) => {
    event.preventDefault();
    const text = aiInput?.value?.trim();
    if (!text) return;

    addMessage(text, 'user');
    aiInput.value = '';

    showTyping();
    setTimeout(() => {
      hideTyping();
      addMessage(getBotResponse(text), 'bot');
    }, 900);
  });
});


