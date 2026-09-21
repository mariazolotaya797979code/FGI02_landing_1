(() => {
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => [...root.querySelectorAll(sel)];

  const header = $(".header");
  const processSection = $("#process");
  const processFill = $(".process-line-fill");
  const processSteps = $$(".process-step");
  const isMobile = () => window.matchMedia("(max-width: 1024px)").matches;

  const onScroll = () => {
    header.classList.toggle("is-scrolled", window.scrollY > 8);
    updateProcess();
  };

  function updateProcess() {
    if (!processSection || !processFill) return;
    const rect = processSection.getBoundingClientRect();
    const start = window.innerHeight * 0.72;
    const traveled = start - rect.top;
    const total = rect.height * 0.85;
    const p = Math.min(1, Math.max(0, traveled / total));
    if (isMobile()) {
      processFill.style.width = "100%";
      processFill.style.height = `${p * 100}%`;
    } else {
      processFill.style.height = "100%";
      processFill.style.width = `${p * 100}%`;
    }
    processSteps.forEach((step, i) => {
      step.classList.toggle("is-on", p >= i / (processSteps.length - 0.2));
    });
  }

  $(".nav-toggle").addEventListener("click", () => {
    const open = document.body.classList.toggle("menu-open");
    $(".nav-toggle").setAttribute("aria-expanded", String(open));
  });

  $$(".nav a").forEach((link) => {
    link.addEventListener("click", () => {
      document.body.classList.remove("menu-open");
      $(".nav-toggle").setAttribute("aria-expanded", "false");
    });
  });

  $$("[data-tilt]").forEach((card) => {
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width;
      const y = (e.clientY - r.top) / r.height;
      card.style.transform = `rotateY(${(x - 0.5) * 14}deg) rotateX(${(0.5 - y) * 12}deg) translateZ(8px)`;
    });
    card.addEventListener("mouseleave", () => {
      card.style.transform = "rotateY(0) rotateX(0)";
    });
  });

  const revealer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) entry.target.classList.add("in");
      });
    },
    { threshold: 0.16 }
  );
  $$(".reveal").forEach((el) => revealer.observe(el));

  const counters = $$("[data-count]");
  const countObs = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        const el = entry.target;
        countObs.unobserve(el);
        const raw = el.getAttribute("data-count");
        const prefix = el.dataset.prefix || "";
        const suffix = el.dataset.suffix || "";
        const isFloat = raw.includes(".");
        const target = parseFloat(raw);
        const start = performance.now();
        const dur = 1400;
        const tick = (now) => {
          const t = Math.min(1, (now - start) / dur);
          const eased = 1 - Math.pow(1 - t, 3);
          const val = isFloat ? (target * eased).toFixed(1) : Math.round(target * eased);
          el.textContent = `${prefix}${val}${suffix}`;
          if (t < 1) requestAnimationFrame(tick);
        };
        requestAnimationFrame(tick);
      });
    },
    { threshold: 0.4 }
  );
  counters.forEach((el) => countObs.observe(el));

  $$(".faq-item button").forEach((btn) => {
    btn.addEventListener("click", () => {
      const item = btn.closest(".faq-item");
      const open = item.classList.contains("is-open");
      $$(".faq-item").forEach((el) => {
        el.classList.remove("is-open");
        el.querySelector("button").setAttribute("aria-expanded", "false");
      });
      if (!open) {
        item.classList.add("is-open");
        btn.setAttribute("aria-expanded", "true");
      }
    });
  });

  const openModal = (id) => {
    const modal = document.getElementById(id);
    modal.classList.add("is-open");
    document.body.style.overflow = "hidden";
  };
  const closeModals = () => {
    $$(".modal").forEach((m) => m.classList.remove("is-open"));
    document.body.style.overflow = "";
  };

  $$("[data-open]").forEach((btn) => {
    btn.addEventListener("click", () => openModal(btn.dataset.open));
  });
  $$("[data-close]").forEach((btn) => btn.addEventListener("click", closeModals));
  $$(".modal").forEach((modal) => {
    modal.addEventListener("click", (e) => {
      if (e.target === modal) closeModals();
    });
  });
  document.addEventListener("keydown", (e) => {
    if (e.key === "Escape") closeModals();
  });

  const people = $("#people");
  const hours = $("#hours");
  const rate = $("#rate");
  const peopleVal = $("#people-val");
  const hoursVal = $("#hours-val");
  const rateVal = $("#rate-val");
  const outHours = $("#out-hours");
  const outMoney = $("#out-money");
  const outPayback = $("#out-payback");

  const formatMoney = (n) =>
    new Intl.NumberFormat("ru-RU").format(Math.round(n)) + " ₽";

  function calc() {
    const p = Number(people.value);
    const h = Number(hours.value);
    const r = Number(rate.value);
    peopleVal.textContent = p;
    hoursVal.textContent = h;
    rateVal.textContent = formatMoney(r);
    const freedWeek = Math.min(40, p * h * 0.4);
    const moneyMonth = freedWeek * r * 4.3;
    outHours.textContent = `${Math.round(freedWeek)} ч`;
    outMoney.textContent = formatMoney(moneyMonth);
    outPayback.textContent = moneyMonth > 0 ? "14 дней" : "—";
  }
  [people, hours, rate].forEach((el) => el.addEventListener("input", calc));
  calc();

  const form = $("#lead-form");
  const status = $("#form-status");
  const submitBtn = $("#submit-btn");

  form.addEventListener("submit", async (e) => {
    e.preventDefault();
    status.classList.remove("error");
    const payload = {
      name: $("#name").value.trim(),
      contact: $("#lead-contact").value.trim(),
      task: $("#task").value.trim(),
      source: "Лендинг AERIS",
      _subject: "Новая заявка AERIS",
      _template: "table",
    };
    if (/^[=+\-@]/.test(payload.contact)) {
      payload.contact = "'" + payload.contact;
    }

    if (!payload.name || !payload.contact) {
      status.textContent = "Укажите имя и телефон или Telegram.";
      status.classList.add("error");
      return;
    }
    if (!$("#privacy").checked) {
      status.textContent = "Нужно согласие на обработку данных.";
      status.classList.add("error");
      return;
    }

    submitBtn.disabled = true;
    submitBtn.textContent = "Отправляем…";

    try {
      const scriptUrl = (window.AERIS_CONFIG && window.AERIS_CONFIG.googleScriptUrl) || "";
      const email = (window.AERIS_CONFIG && window.AERIS_CONFIG.notifyEmail) || "maria.zolotaya79@gmail.com";
      const body = JSON.stringify(payload);
      const emailJob = fetch(`https://formsubmit.co/ajax/${email}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body,
      });
      if (scriptUrl) {
        emailJob.catch(() => {});
        await fetch(scriptUrl, {
          method: "POST",
          mode: "no-cors",
          headers: { "Content-Type": "text/plain;charset=utf-8" },
          body,
        });
      } else {
        const res = await emailJob;
        if (!res.ok) throw new Error("network");
      }
      status.textContent = "Заявка ушла. Свяжемся в течение 48 часов.";
      form.reset();
    } catch (err) {
      status.textContent = "Не отправилось. Напишите на maria.zolotaya79@gmail.com";
      status.classList.add("error");
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = "Забрать бесплатную диагностику";
    }
  });

  const mobileCta = $(".mobile-cta");
  const contact = $("#contact");
  if (mobileCta && contact && "IntersectionObserver" in window) {
    const ctaObs = new IntersectionObserver(
      ([entry]) => {
        mobileCta.style.display = entry.isIntersecting ? "none" : "";
      },
      { threshold: 0.12 }
    );
    ctaObs.observe(contact);
  }

  window.addEventListener("scroll", onScroll, { passive: true });
  window.addEventListener("resize", updateProcess);
  onScroll();
})();
