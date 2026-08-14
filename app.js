import { gsap } from "./esm/index.js";
import ScrollTrigger from "./esm/ScrollTrigger.js";

gsap.registerPlugin(ScrollTrigger);

const reducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
const scenes = gsap.utils.toArray(".scene");
const railFill = document.querySelector(".rail-fill");
const railCurrent = document.querySelector(".journey-rail .rail-number");

if (!reducedMotion) {
  gsap.to(".rail-fill", {
    width: "100%",
    ease: "none",
    scrollTrigger: {
      trigger: "main",
      start: "top top",
      end: "bottom bottom",
      scrub: 0.3
    }
  });

  gsap.to(".cloud-field-far", {
    yPercent: 18,
    scale: 1.3,
    ease: "none",
    scrollTrigger: { trigger: ".scene-arrival", start: "top top", end: "bottom top", scrub: 1 }
  });

  gsap.to(".cloud-field-near", {
    yPercent: 34,
    scale: 1.45,
    ease: "none",
    scrollTrigger: { trigger: ".scene-arrival", start: "top top", end: "bottom top", scrub: 1.2 }
  });

  gsap.to(".hero-content", {
    yPercent: -34,
    opacity: 0,
    ease: "none",
    scrollTrigger: { trigger: ".scene-arrival", start: "46% top", end: "bottom top", scrub: true }
  });

  gsap.to(".storm-tunnel", {
    scale: 1.34,
    rotation: 16,
    ease: "none",
    scrollTrigger: { trigger: ".scene-clouds", start: "top bottom", end: "bottom top", scrub: 1 }
  });

  gsap.to(".cloud-bank-left", {
    xPercent: -25,
    yPercent: 8,
    ease: "none",
    scrollTrigger: { trigger: ".scene-clouds", start: "top bottom", end: "bottom top", scrub: 1 }
  });

  gsap.to(".cloud-bank-right", {
    xPercent: 25,
    yPercent: -8,
    ease: "none",
    scrollTrigger: { trigger: ".scene-clouds", start: "top bottom", end: "bottom top", scrub: 1 }
  });

  gsap.to(".orbit-ring-large", {
    rotation: 130,
    scale: 1.2,
    ease: "none",
    scrollTrigger: { trigger: ".scene-orbit", start: "top bottom", end: "bottom top", scrub: 1 }
  });

  gsap.to(".orbit-ring-small", {
    rotation: -200,
    scale: 1.45,
    ease: "none",
    scrollTrigger: { trigger: ".scene-orbit", start: "top bottom", end: "bottom top", scrub: 1 }
  });

  gsap.to(".orbital-grid", {
    rotation: 55,
    scale: 1.25,
    ease: "none",
    scrollTrigger: { trigger: ".scene-orbit", start: "top bottom", end: "bottom top", scrub: 1 }
  });

  gsap.to(".urban-grid", {
    yPercent: 14,
    scale: 2,
    ease: "none",
    scrollTrigger: { trigger: ".scene-nexus", start: "top bottom", end: "bottom top", scrub: 1 }
  });

  gsap.to(".nexus-rings", {
    rotation: 175,
    scale: 1.45,
    ease: "none",
    scrollTrigger: { trigger: ".scene-nexus", start: "top bottom", end: "bottom top", scrub: 1 }
  });

  gsap.to(".nexus-core", {
    scale: 1.8,
    ease: "none",
    scrollTrigger: { trigger: ".scene-nexus", start: "top 75%", end: "bottom 25%", scrub: 0.8 }
  });

  gsap.to(".landing-platform", {
    yPercent: -22,
    scale: 1.12,
    rotation: 11,
    ease: "none",
    scrollTrigger: { trigger: ".scene-touchdown", start: "top bottom", end: "bottom top", scrub: 1 }
  });

  gsap.from(".touchdown-copy", {
    y: 90,
    opacity: 0,
    ease: "power2.out",
    scrollTrigger: { trigger: ".scene-touchdown", start: "top 65%", end: "top 28%", scrub: 0.8 }
  });

  scenes.forEach((scene, index) => {
    const copy = scene.querySelector(".scene-copy, .hero-content, .touchdown-copy");
    if (copy && index > 0 && index < scenes.length - 1) {
      gsap.from(copy, {
        y: 70,
        opacity: 0,
        ease: "power2.out",
        scrollTrigger: { trigger: scene, start: "top 70%", end: "top 35%", scrub: 0.7 }
      });
    }

    ScrollTrigger.create({
      trigger: scene,
      start: "top center",
      end: "bottom center",
      onToggle: ({ isActive }) => {
        if (isActive) railCurrent.textContent = String(index + 1).padStart(2, "0");
      }
    });
  });

  gsap.from(".brand, .flight-status, .menu-trigger, .journey-rail", {
    y: -12,
    opacity: 0,
    duration: 1.1,
    stagger: 0.08,
    ease: "power3.out",
    delay: 0.2
  });
} else {
  railFill.style.width = "100%";
}
