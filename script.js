(function () {
  "use strict";

  const invitation = document.getElementById("invitation");
  const scene = document.getElementById("invitationScene");
  const hint = document.getElementById("hint");
  const inviteLayer = invitation && invitation.querySelector(".invite-layer");
  const coverLayer = invitation && invitation.querySelector(".cover-layer");

  if (!invitation) return;

  const COVER_DELAY_MS = 1000;
  const FADE_MS = 1000;

  let isOpen = false;
  let isAnimating = false;

  function setOpenState(open) {
    isOpen = open;
    invitation.classList.toggle("is-open", open);
    if (scene) scene.classList.toggle("is-open", open);
    if (inviteLayer) inviteLayer.setAttribute("aria-hidden", String(!open));
    if (coverLayer) coverLayer.setAttribute("aria-hidden", String(!open));
    invitation.setAttribute("aria-expanded", String(open));
    invitation.setAttribute(
      "aria-label",
      open ? "Close wedding invitation" : "Open wedding invitation"
    );
    if (hint) {
      hint.textContent = open
        ? "Tap venue names for directions · tap elsewhere to close"
        : "Tap the seal to open";
    }
  }

  function openInvitation() {
    if (isAnimating || isOpen) return;
    isAnimating = true;

    invitation.classList.add("is-breaking");

    window.setTimeout(function () {
      setOpenState(true);
      invitation.classList.remove("is-breaking");
      isAnimating = false;
    }, COVER_DELAY_MS);
  }

  function closeInvitation() {
    if (isAnimating || !isOpen) return;
    isAnimating = true;
    setOpenState(false);

    window.setTimeout(function () {
      isAnimating = false;
    }, FADE_MS);
  }

  function toggle() {
    if (isOpen) {
      closeInvitation();
    } else {
      openInvitation();
    }
  }

  invitation.addEventListener("click", function (event) {
    if (event.target.closest(".venue-link")) {
      return;
    }
    toggle();
  });

  invitation.querySelectorAll(".venue-link").forEach(function (link) {
    link.addEventListener("click", function (event) {
      event.stopPropagation();
    });
  });

  invitation.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      toggle();
    }
    if (event.key === "Escape" && isOpen) {
      closeInvitation();
    }
  });

  ["cover.png", "invite.png"].forEach(function (src) {
    const img = new Image();
    img.src = src;
  });
})();
