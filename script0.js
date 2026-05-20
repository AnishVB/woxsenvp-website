
      // Only hide content if not a refresh
      const isRefresh =
        performance.getEntriesByType("navigation")[0]?.type === "reload";
      if (!isRefresh && sessionStorage.getItem("blindsOpenNext")) {
        document.documentElement.style.background = "#02053f";
        const hideStyle = document.createElement("style");
        hideStyle.id = "blinds-hide-style";
        hideStyle.textContent =
          "body > *:not(.blinds-container):not(.blinds-signature){visibility:hidden !important;}";
        document.head.appendChild(hideStyle);
      }
    