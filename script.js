(function () {
  "use strict";

  const invitation = document.getElementById("invitation");
  const scene = document.getElementById("invitationScene");
  const pageInvite = document.getElementById("pageInvite");
  const pageLocation = document.getElementById("pageLocation");
  const hint = document.getElementById("hint");
  const scrollHint = document.getElementById("scrollHint");
  const coverLayer = pageInvite && pageInvite.querySelector(".cover-layer");

  if (!invitation || !pageInvite) return;

  const COVER_DELAY_MS = 1000;
  const FADE_MS = 1000;

  let isOpen = false;
  let isAnimating = false;

  function setOpenState(open) {
    isOpen = open;
    document.body.classList.toggle("is-open", open);
    invitation.classList.toggle("is-open", open);
    pageInvite.classList.toggle("is-open", open);
    if (scene) scene.classList.toggle("is-open", open);
    if (pageLocation) pageLocation.setAttribute("aria-hidden", String(!open));
    if (coverLayer) coverLayer.setAttribute("aria-hidden", String(!open));

    pageInvite.setAttribute("aria-expanded", String(open));
    pageInvite.setAttribute(
      "aria-label",
      open ? "Tap to close invitation" : "Open wedding invitation"
    );

    if (hint) {
      hint.textContent = open ? "Tap invite to close" : "Tap the seal to open";
      hint.hidden = open;
    }
    if (scrollHint) {
      scrollHint.hidden = !open;
      scrollHint.setAttribute("aria-hidden", String(!open));
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

    if (scene) {
      scene.scrollTop = 0;
    }

    window.setTimeout(function () {
      isAnimating = false;
    }, FADE_MS);
  }

  pageInvite.addEventListener("click", function (event) {
    if (event.target.closest(".map-btn")) {
      return;
    }
    if (isOpen) {
      closeInvitation();
    } else {
      openInvitation();
    }
  });

  pageInvite.addEventListener("keydown", function (event) {
    if (event.key === "Enter" || event.key === " ") {
      event.preventDefault();
      if (isOpen) {
        closeInvitation();
      } else {
        openInvitation();
      }
    }
    if (event.key === "Escape" && isOpen) {
      closeInvitation();
    }
  });

  if (pageLocation) {
    pageLocation.querySelectorAll(".map-btn").forEach(function (link) {
      link.addEventListener("click", function (event) {
        event.stopPropagation();
      });
    });
  }

  ["cover.png", "invite.png", "location.png"].forEach(function (src) {
    const img = new Image();
    img.src = src;
  });
})();
