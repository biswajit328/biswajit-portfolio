(() => {
  const data = window.PORTFOLIO || {};
  const header = document.querySelector(".site-header");
  const menuButton = document.querySelector(".menu-toggle");
  const mobileNav = document.querySelector("#mobile-nav");
  const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)");

  // A restrained image drift echoes the depth of the hero art without moving layout.
  const hero = document.querySelector(".hero");
  const heroImage = hero?.querySelector(".hero-background img");
  if (hero && heroImage && !reducedMotion.matches && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    hero.addEventListener("pointermove", (event) => {
      const rect = hero.getBoundingClientRect();
      const dx = (event.clientX - rect.left) / rect.width - 0.5;
      const dy = (event.clientY - rect.top) / rect.height - 0.5;
      heroImage.style.translate = `${dx * -9}px ${dy * -5}px`;
    });
    hero.addEventListener("pointerleave", () => { heroImage.style.translate = "0 0"; });
  }

  const nexoraVisual = document.querySelector(".nexora-thumbnail");
  const finePointer = matchMedia("(hover: hover) and (pointer: fine)").matches;
  if (nexoraVisual && finePointer && !reducedMotion.matches) {
    nexoraVisual.addEventListener("pointermove", (event) => {
      const bounds = nexoraVisual.getBoundingClientRect();
      const x = ((event.clientX - bounds.left) / bounds.width - 0.5) * 3;
      const y = ((event.clientY - bounds.top) / bounds.height - 0.5) * 3;
      nexoraVisual.style.setProperty("--parallax-x", `${x.toFixed(1)}px`);
      nexoraVisual.style.setProperty("--parallax-y", `${y.toFixed(1)}px`);
    });
    nexoraVisual.addEventListener("pointerleave", () => {
      nexoraVisual.style.setProperty("--parallax-x", "0px");
      nexoraVisual.style.setProperty("--parallax-y", "0px");
    });
  }

  document.querySelectorAll(".case-study").forEach((details) => {
    const summary = details.querySelector("summary");
    const syncExpanded = () => summary?.setAttribute("aria-expanded", String(details.open));
    syncExpanded();
    details.addEventListener("toggle", syncExpanded);
  });

  document.querySelectorAll(".ai-concept .concept-flow").forEach((flow) => {
    const stages = [...flow.querySelectorAll("li")];
    const activate = (stage) => stages.forEach((item) => item.classList.toggle("is-active", item === stage));
    stages.forEach((stage, index) => { stage.tabIndex = index === 0 ? 0 : -1; });
    stages.forEach((stage) => {
      stage.addEventListener("pointerenter", () => activate(stage));
      stage.addEventListener("focus", () => activate(stage));
      stage.addEventListener("keydown", (event) => {
        let nextIndex = stages.indexOf(stage);
        if (event.key === "ArrowRight" || event.key === "ArrowDown") nextIndex = (nextIndex + 1) % stages.length;
        else if (event.key === "ArrowLeft" || event.key === "ArrowUp") nextIndex = (nextIndex - 1 + stages.length) % stages.length;
        else if (event.key === "Home") nextIndex = 0;
        else if (event.key === "End") nextIndex = stages.length - 1;
        else return;
        event.preventDefault();
        stages.forEach((item, index) => { item.tabIndex = index === nextIndex ? 0 : -1; });
        stages[nextIndex].focus();
      });
    });
    flow.addEventListener("pointerleave", () => {
      if (!flow.contains(document.activeElement)) stages.forEach((stage) => stage.classList.remove("is-active"));
    });
    flow.addEventListener("focusout", (event) => {
      if (!flow.contains(event.relatedTarget)) stages.forEach((stage) => stage.classList.remove("is-active"));
    });
  });

  menuButton?.addEventListener("click", () => {
    const expanded = menuButton.getAttribute("aria-expanded") === "true";
    menuButton.setAttribute("aria-expanded", String(!expanded));
    menuButton.setAttribute("aria-label", expanded ? "Open navigation" : "Close navigation");
    mobileNav.hidden = expanded;
  });
  mobileNav?.querySelectorAll("a").forEach((link) => link.addEventListener("click", () => {
    mobileNav.hidden = true;
    menuButton?.setAttribute("aria-expanded", "false");
    menuButton?.setAttribute("aria-label", "Open navigation");
  }));
  document.addEventListener("keydown", (event) => {
    if (event.key === "Escape" && mobileNav && !mobileNav.hidden) {
      mobileNav.hidden = true;
      menuButton?.setAttribute("aria-expanded", "false");
      menuButton?.setAttribute("aria-label", "Open navigation");
      menuButton?.focus();
    }
  });

  const sections = [...document.querySelectorAll("main > section[id]")];
  const navLinks = [...document.querySelectorAll(".desktop-nav a, .mobile-nav a")];
  if ("IntersectionObserver" in window) {
    const sectionObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("revealed");
        navLinks.forEach((link) => {
          const selected = link.hash === `#${entry.target.id}`;
          if (selected) link.setAttribute("aria-current", "location");
          else link.removeAttribute("aria-current");
        });
      });
    }, { rootMargin: "-18% 0px -62% 0px" });
    sections.forEach((section) => sectionObserver.observe(section));
    const projectObserver = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return;
        entry.target.classList.add("project-visible");
        observer.unobserve(entry.target);
      });
    }, { rootMargin: "0px 0px -8% 0px", threshold: 0.08 });
    document.querySelectorAll(".project-feature").forEach((project) => projectObserver.observe(project));
  }

  const workflowSection = document.querySelector("#workflow");
  const workflowTrack = document.querySelector(".workflow-steps");
  const workflowItems = [...(workflowTrack?.querySelectorAll("article") || [])];
  const updateWorkflowProgress = () => {
    if (!workflowSection || !workflowTrack || !workflowItems.length) return;
    const sectionBounds = workflowSection.getBoundingClientRect();
    const active = sectionBounds.top < window.innerHeight * 0.76 && sectionBounds.bottom > window.innerHeight * 0.24;
    if (!active) {
      workflowTrack.classList.remove("is-progressing");
      workflowTrack.style.setProperty("--workflow-progress", "0%");
      workflowItems.forEach((item) => item.classList.remove("is-active", "is-complete"));
      return;
    }
    const bounds = workflowTrack.getBoundingClientRect();
    const ratio = Math.max(0, Math.min(1, (window.innerHeight * 0.56 - bounds.top) / Math.max(bounds.height, 1)));
    const activeIndex = Math.min(workflowItems.length - 1, Math.floor(ratio * workflowItems.length));
    workflowTrack.classList.add("is-progressing");
    workflowTrack.style.setProperty("--workflow-progress", String(Math.round(ratio * 100)) + "%");
    workflowItems.forEach((item, index) => {
      item.classList.toggle("is-active", index === activeIndex);
      item.classList.toggle("is-complete", index < activeIndex);
    });
  };

  let scheduled = false;
  const updateScrollState = () => {
    if (scheduled) return;
    scheduled = true;
    requestAnimationFrame(() => {
      const scrolled = window.scrollY > 20;
      header?.classList.toggle("is-scrolled", scrolled);
      const progress = document.querySelector("#scroll-progress span");
      if (progress) {
        const maxScroll = document.documentElement.scrollHeight - window.innerHeight;
        progress.style.transform = `scaleX(${maxScroll > 0 ? window.scrollY / maxScroll : 0})`;
      }
      updateWorkflowProgress();
      scheduled = false;
    });
  };
  window.addEventListener("scroll", updateScrollState, { passive: true });
  updateScrollState();

  const primaryContact = document.querySelector(".contact-primary-cta");
  if (primaryContact && data.email) primaryContact.href = "mailto:" + encodeURIComponent(data.email);

  // Keep the contact console linked to the verified destinations in site data.
  const githubLink = document.querySelector(".github-link");
  if (githubLink && data.github) {
    githubLink.href = data.github;
    githubLink.setAttribute("aria-label", `GitHub, ${data.github.replace(/^https?:\/\//, "")}`);
  }
  const emailRow = document.querySelector(".contact-email");
  if (emailRow && data.email) {
    emailRow.href = "mailto:" + encodeURIComponent(data.email);
    emailRow.querySelector(".contact-value").textContent = data.email;
    emailRow.setAttribute("aria-label", `Email ${data.email}`);
  }
  const linkedinRow = document.querySelector(".linkedin-link");
  if (linkedinRow && data.linkedin) linkedinRow.href = escapeAttribute(data.linkedin);
  else if (linkedinRow) linkedinRow.hidden = true;
  const resumeRow = document.querySelector(".resume-placeholder");
  if (data.resume && resumeRow) {
    resumeRow.querySelectorAll(".resume-actions a").forEach((link) => { link.href = escapeAttribute(data.resume); });
  } else if (resumeRow) {
    resumeRow.hidden = true;
  }
  const contactPanel = document.querySelector(".contact-panel-wrap");
  const contactSignal = document.querySelector(".contact-signal");
  if (contactPanel && contactSignal && !reducedMotion.matches && matchMedia("(hover: hover) and (pointer: fine)").matches) {
    contactPanel.addEventListener("pointermove", (event) => {
      const bounds = contactPanel.getBoundingClientRect();
      const x = (event.clientX - bounds.left) / bounds.width - 0.5;
      const y = (event.clientY - bounds.top) / bounds.height - 0.5;
      contactSignal.style.setProperty("--signal-x", `${(x * 3).toFixed(1)}px`);
      contactSignal.style.setProperty("--signal-y", `${(y * 3).toFixed(1)}px`);
    });
    contactPanel.addEventListener("pointerleave", () => {
      contactSignal.style.setProperty("--signal-x", "0px");
      contactSignal.style.setProperty("--signal-y", "0px");
    });
  }
  const projectSelectors = {
    nexora: "#nexora",
    hospitalDrugShortage: "#hospital-drug-shortage",
    predictiveMaintenance: "#smart-factory-maintenance",
  };
  for (const [key, selector] of Object.entries(projectSelectors)) {
    const project = data.projects?.[key];
    const article = document.querySelector(selector);
    if (!project || !article) continue;
    const links = article.querySelector(".project-links-featured");
    const deployment = links?.querySelector('[data-link="deployment"]');
    if (project.deployment && deployment) deployment.href = escapeAttribute(project.deployment);
    if (project.repository && links) {
      const source = document.createElement("a");
      source.className = "project-source-link";
      source.href = escapeAttribute(project.repository);
      source.target = "_blank";
      source.rel = "noreferrer";
      source.innerHTML = 'View source <span aria-hidden="true">↗</span>';
      links.append(source);
    }
  }

  const siteUrl = (data.siteUrl || "").replace(/\/$/, "");
  if (siteUrl) {
    if (!document.querySelector('link[rel="canonical"]')) {
      const canonical = document.createElement("link");
      canonical.rel = "canonical";
      canonical.href = `${siteUrl}${window.location.pathname.endsWith("tech-stack.html") ? "/tech-stack.html" : "/"}`;
      document.head.append(canonical);
    }
    const person = document.createElement("script");
    person.type = "application/ld+json";
    person.textContent = JSON.stringify({
      "@context": "https://schema.org", "@type": "Person", name: data.name || "Biswajit",
      jobTitle: "Computer Science & Engineering Student", url: siteUrl,
      sameAs: [data.github, data.linkedin].filter(Boolean),
    });
    document.head.append(person);
  }

  function escapeHtml(value) {
    return String(value).replace(/[&<>"']/g, (char) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[char]);
  }
  function escapeAttribute(value) {
    try { const url = new URL(value, window.location.href); return ["http:", "https:", "mailto:"].includes(url.protocol) ? escapeHtml(value) : "#"; }
    catch { return "#"; }
  }
})();
