
      // Calendar and Events Script
      const eventsData = {
        "2025-12-27": [
          {
            title: "Event Title Placeholder",
            time: "2:00 PM",
            location: "Location Placeholder",
            description:
              "Event description placeholder - replace with actual event details.",
          },
        ],
        "2026-01-05": [
          {
            title: "Sample Event",
            time: "10:00 AM",
            location: "Location TBA",
            description: "placeholder desc",
          },
        ],
        "2026-01-21": [
          {
            title: "Sample Event",
            time: "2:00 PM",
            location: "Location TBA",
            description: "placeholder desc",
          },
        ],
      };

      let currentDate = new Date();

      function renderCalendar() {
        const year = currentDate.getFullYear();
        const month = currentDate.getMonth();

        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        document.getElementById("currentMonth").textContent =
          monthNames[month] + " " + year;

        const firstDay = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        const calendarDays = document.getElementById("calendarDays");
        calendarDays.innerHTML = "";

        for (let i = 0; i < firstDay; i++) {
          const emptyDay = document.createElement("div");
          emptyDay.className = "calendar-day empty";
          calendarDays.appendChild(emptyDay);
        }

        for (let day = 1; day <= daysInMonth; day++) {
          const dayElement = document.createElement("div");
          const dateStr =
            year +
            "-" +
            String(month + 1).padStart(2, "0") +
            "-" +
            String(day).padStart(2, "0");
          const hasEvent = eventsData[dateStr];

          dayElement.className =
            "calendar-day" + (hasEvent ? " has-event" : "");
          dayElement.textContent = day;
          dayElement.onclick = () =>
            showEventDetails(dateStr, day, month, year);

          calendarDays.appendChild(dayElement);
        }
      }

      function showEventDetails(dateStr, day, month, year) {
        const monthNames = [
          "January",
          "February",
          "March",
          "April",
          "May",
          "June",
          "July",
          "August",
          "September",
          "October",
          "November",
          "December",
        ];
        const events = eventsData[dateStr] || [];

        const eventsList = document.getElementById("eventsList");
        const detailsContent = document.querySelector(".event-details-content");

        if (events.length === 0) {
          eventsList.innerHTML =
            '<p class="no-events">No events scheduled for this date.</p>';
          detailsContent.querySelector("h3").textContent =
            monthNames[month] + " " + day + ", " + year;
        } else {
          detailsContent.querySelector("h3").textContent =
            monthNames[month] + " " + day + ", " + year;
          eventsList.innerHTML = events
            .map(
              (event) => `
            <div class="event-card">
              <h4>${event.title}</h4>
              <p class="event-time">🕐 ${event.time}</p>
              <p class="event-location">📍 ${event.location}</p>
              <p class="event-description">${event.description}</p>
            </div>
          `,
            )
            .join("");
        }
      }

      document.getElementById("prevMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() - 1);
        renderCalendar();
        document.getElementById("eventsList").innerHTML = "";
        document.querySelector(".event-details-content h3").textContent =
          "Select a date to view events";
      });

      document.getElementById("nextMonth").addEventListener("click", () => {
        currentDate.setMonth(currentDate.getMonth() + 1);
        renderCalendar();
        document.getElementById("eventsList").innerHTML = "";
        document.querySelector(".event-details-content h3").textContent =
          "Select a date to view events";
      });

      document.addEventListener("DOMContentLoaded", () => {
        renderCalendar();
      });

      // Hero carousel script
      const carousel = document.getElementById("subtitle-carousel");
      const carouselContainer = document.querySelector(".hero-carousel");
      const transitionMs = 600;
      let index = 0;
      let busy = false;
      let total = 0;
      let heights = [];
      let positions = [];
      let offset = 0;

      const firstClone = carousel.children[0].cloneNode(true);
      carousel.appendChild(firstClone);
      total = carousel.children.length;

      function computeHeights() {
        const children = Array.from(carousel.children);
        const baseTop = children[0] ? children[0].offsetTop : 0;
        heights = children.map((el) => Math.ceil(el.offsetHeight));
        positions = children.map((el) => Math.max(0, el.offsetTop - baseTop));

        const currentHeight = heights[index] || heights[0] || 0;
        const currentOffset = positions[index] || positions[0] || 0;
        offset = currentOffset;
        if (carouselContainer) {
          carouselContainer.style.height = `${currentHeight}px`;
        }
        carousel.style.transform = `translateY(-${offset}px)`;
      }

      computeHeights();
      if (document.fonts && document.fonts.ready) {
        document.fonts.ready.then(() => {
          computeHeights();
          carousel.style.transform = `translateY(-${offset}px)`;
        });
      }

      function nextSlide() {
        if (busy) return;
        busy = true;

        index += 1;

        carousel.style.transition = `transform ${transitionMs}ms ease`;
        const targetOffset = positions[index] || positions[0] || 0;
        offset = targetOffset;
        carousel.style.transform = `translateY(-${targetOffset}px)`;

        const nextHeight = heights[index] || heights[0] || 0;
        if (carouselContainer) {
          carouselContainer.style.height = `${nextHeight}px`;
        }

        const atClone = index === total - 1;

        setTimeout(() => {
          if (atClone) {
            carousel.style.transition = "none";
            index = 0;
            offset = positions[0] || 0;
            carousel.style.transform = `translateY(-${offset}px)`;
            void carousel.offsetHeight;
            computeHeights();
          }
          busy = false;
        }, transitionMs);
      }

      const intervalId = setInterval(nextSlide, 3000);

      let resizeTimer;
      window.addEventListener("resize", () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          computeHeights();
        }, 150);
      });

      if (window.ResizeObserver) {
        const ro = new ResizeObserver(() => {
          computeHeights();
        });
        ro.observe(carousel);
      }
    