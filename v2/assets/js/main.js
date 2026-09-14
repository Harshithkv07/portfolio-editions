/* ============================================================================
   Harshith K V — v. II

   The small amount of behaviour this site has. One file serves every page:
   each part looks for the element it needs and does nothing if it is absent.
   ========================================================================== */

(() => {
  const root = document.documentElement;
  const calm = matchMedia("(prefers-reduced-motion: reduce)");

  /* --- The cover (home page, first visit) ---------------------------------- */
  /* The page opens on the closed book. Breaking the seal (click or tap
     anywhere on the cover, or Enter on the seal, or Esc) cracks it; the
     cover catches where the seal was and burns away to the title page.
     The <head> script only adds class="closed" when this browser tab has not
     opened the book yet, and removes it again if this script never arrives.

     Below, a map of how soon each point of the cover catches is drawn once
     (the seal first, then outwards in ragged tongues). Each frame moves a
     line along that map. Behind the line the cover is gone: the #burn filter
     in index.html cuts it away. On and ahead of the line, a canvas over the
     cover paints the flame, soot and firelight, and the embers rising.  */

  const opening = document.querySelector("[data-opening]");
  if (opening && root.classList.contains("closed")) {
    window.coverReady = true;

    // Behind the cover nothing can be tabbed to or read out.
    const behind = [document.querySelector(".book"), document.querySelector(".skip")].filter(Boolean);
    behind.forEach((element) => (element.inert = true));

    const cover = opening.querySelector(".cover");
    const seal = opening.querySelector("[data-seal]");
    const embers = opening.querySelector(".embers");
    const mapImage = opening.querySelector("#burn-map");
    const line = opening.querySelector("#burn-line");

    const BURN = 1900; // ms, from the first flame to the last corner
    const FROM = -0.17; // the line starts short of the seal, so the glow grows...
    const TO = 1; // ...and ends past the far corners

    // Smooth noise, a few octaves deep, each turned a little so that no
    // grid shows through the flames.
    const hash = (x, y) => {
      let h = Math.imul(x, 374761393) + Math.imul(y, 668265263);
      h = Math.imul(h ^ (h >>> 13), 1274126177);
      return ((h ^ (h >>> 16)) >>> 0) / 4294967296;
    };
    const noise = (x, y) => {
      const xi = Math.floor(x);
      const yi = Math.floor(y);
      const u = (x - xi) * (x - xi) * (3 - 2 * (x - xi));
      const v = (y - yi) * (y - yi) * (3 - 2 * (y - yi));
      const a = hash(xi, yi);
      const b = hash(xi + 1, yi);
      const c = hash(xi, yi + 1);
      const d = hash(xi + 1, yi + 1);
      return a + (b - a) * u + (c - a) * v + (a - b - c + d) * u * v;
    };
    const fbm = (x, y, octaves) => {
      let sum = 0;
      let weight = 0.5;
      for (let i = 0; i < octaves; i++) {
        sum += weight * noise(x, y);
        [x, y] = [1.6 * x - 1.2 * y, 1.2 * x + 1.6 * y];
        weight /= 2;
      }
      return sum / (1 - 2 * weight);
    };

    // The map: 0 where the cover catches first, 1 where it catches last,
    // at a few pixels per cell (the filter stretches it over the cover).
    // Stored inverted, so a map that has not loaded yet reads as "never".
    // It is drawn again if the screen or the seal has moved since (a phone
    // turned sideways, or the title reflowing when a slow font arrives).
    let map = null;
    const layout = () => {
      const mark = seal.getBoundingClientRect();
      return `${innerWidth}x${innerHeight} ${Math.round(mark.left)},${Math.round(mark.top)}`;
    };
    const drawMap = () => {
      const box = cover.getBoundingClientRect();
      const mark = seal.getBoundingClientRect();
      const step = Math.max(3, Math.max(box.width, box.height) / 560);
      const width = Math.ceil(box.width / step);
      const height = Math.ceil(box.height / step);
      const cx = (mark.left + mark.width / 2 - box.left) / step;
      const cy = (mark.top + mark.height / 2 - box.top) / step;
      const reach = Math.hypot(Math.max(cx, width - cx), Math.max(cy, height - cy));
      const when = new Float32Array(width * height);
      let high = 0;
      for (let y = 0, i = 0; y < height; y++) {
        for (let x = 0; x < width; x++, i++) {
          const near = Math.hypot(x - cx, y - cy) / reach;
          const px = x * step;
          const py = y * step;
          const ragged = 0.34 * (fbm(px / 165, py / 165, 4) - 0.5) + 0.1 * (fbm(px / 27 + 31, py / 27 + 17, 2) - 0.5);
          // Calm right at the seal, so the fire starts exactly there.
          when[i] = Math.max(0, near + ragged * Math.min(1, near * 4));
          high = Math.max(high, when[i]);
        }
      }
      const canvas = document.createElement("canvas");
      canvas.width = width;
      canvas.height = height;
      const pen = canvas.getContext("2d");
      const image = pen.createImageData(width, height);
      for (let i = 0; i < when.length; i++) {
        when[i] /= high;
        const shade = 255 - Math.round(when[i] * 255);
        image.data[i * 4] = image.data[i * 4 + 1] = image.data[i * 4 + 2] = shade;
        image.data[i * 4 + 3] = 255;
      }
      pen.putImageData(image, 0, 0);
      mapImage.setAttribute("href", canvas.toDataURL());

      // Pixels per unit of the map: broadly (from the seal to the far
      // corner), and cell by cell, so the thin flame at the line can be
      // measured in pixels and keep its width where the ragged noise is
      // steep.
      const span = reach * step * high;
      const climb = new Float32Array(width * height);
      for (let y = 0, i = 0; y < height; y++) {
        for (let x = 0; x < width; x++, i++) {
          const across = when[x < width - 1 ? i + 1 : i] - when[x > 0 ? i - 1 : i];
          const down = when[y < height - 1 ? i + width : i] - when[y > 0 ? i - width : i];
          climb[i] = Math.max(Math.hypot(across, down) / (2 * step), 0.00015);
        }
      }
      map = { width, height, when, climb, span, drawnFor: layout() };
      map.sx = box.width / width;
      map.sy = box.height / height;
    };

    // Move the line to t: the filter keeps the cover only where the map is
    // past it (a steep ramp, so the cut edge is crisp).
    const burnTo = (t) => {
      line.setAttribute("slope", 90);
      line.setAttribute("intercept", -90 * t);
    };

    // The fire along the line, one pixel per map cell, stretched over the
    // cover (which softens it, as flame should be): from the line outwards
    // the white-hot edge, the flame, soot, and firelight on the leather,
    // plus a little light thrown back onto the page behind. A smaller copy,
    // stretched further and added on top, is its glow.
    const ink = embers.getContext("2d");
    const flames = document.createElement("canvas");
    const halo = document.createElement("canvas");
    let fire = null;
    const paintFire = (t) => {
      if (fire?.width !== map.width || fire?.height !== map.height) {
        flames.width = map.width;
        flames.height = map.height;
        halo.width = Math.ceil(map.width / 4);
        halo.height = Math.ceil(map.height / 4);
        fire = flames.getContext("2d").createImageData(map.width, map.height);
      }
      const dots = fire.data;
      // The colour of the cell being painted, and a way to lay another
      // colour over it.
      let r, g, b, a;
      const over = (red, green, blue, alpha) => {
        if (alpha <= 0) return;
        alpha = Math.min(alpha, 1);
        const total = alpha + a * (1 - alpha);
        r = (red * alpha + r * a * (1 - alpha)) / total;
        g = (green * alpha + g * a * (1 - alpha)) / total;
        b = (blue * alpha + b * a * (1 - alpha)) / total;
        a = total;
      };
      for (let i = 0, o = 0; i < map.when.length; i++, o += 4) {
        // How many pixels this cell is ahead of the line: broadly, and (when
        // close) more finely.
        const gap = map.when[i] - t;
        const far = gap * map.span;
        if (far > 110 || far < -40) {
          dots[o + 3] = 0;
          continue;
        }
        const near = far < 60 ? gap / map.climb[i] : Infinity;
        r = g = b = a = 0;
        if (gap < 0) {
          over(255, 110, 40, 0.5 * (1 + near / 10));
        } else {
          over(255, 106, 42, 0.35 * (1 - far / 110));
          over(12, 5, 4, 1.15 * (1 - far / 40));
          over(255, 90, 31, 1 - near / 16);
          over(255, 217, 138, 0.9 * (1 - near / 6));
        }
        dots[o] = r;
        dots[o + 1] = g;
        dots[o + 2] = b;
        dots[o + 3] = a * 255;
      }
      flames.getContext("2d").putImageData(fire, 0, 0);
      const glow = halo.getContext("2d");
      glow.clearRect(0, 0, halo.width, halo.height);
      glow.drawImage(flames, 0, 0, halo.width, halo.height);

      ink.globalCompositeOperation = "source-over";
      ink.imageSmoothingQuality = "high";
      ink.drawImage(flames, 0, 0, innerWidth, innerHeight);
      ink.globalCompositeOperation = "lighter";
      ink.globalAlpha = 0.55;
      ink.drawImage(halo, 0, 0, innerWidth, innerHeight);
      ink.globalAlpha = 1;
    };

    // Embers: sparks born on the edge of the flame that drift up and fade.
    // About eighty a second, however fast the screen draws.
    const sparks = [];
    let owed = 0;
    const kindle = (t, dt) => {
      owed = Math.min(owed + dt * 0.08, 4);
      for (let tries = 0; tries < 120 && owed >= 1; tries++) {
        const i = Math.floor(Math.random() * map.when.length);
        const gap = map.when[i] - t;
        if (gap < 0 || gap * map.span > 40 || gap / map.climb[i] > 12) continue;
        sparks.push({
          x: ((i % map.width) + Math.random()) * map.sx,
          y: (Math.floor(i / map.width) + Math.random()) * map.sy,
          vx: (Math.random() - 0.5) * 0.05,
          vy: -(0.03 + Math.random() * 0.09),
          age: 0,
          life: 500 + Math.random() * 800,
          r: 0.6 + Math.random() * 1.4,
          hue: 18 + Math.random() * 26,
        });
        owed--;
      }
    };
    const drawSparks = (dt) => {
      ink.globalCompositeOperation = "lighter";
      for (let i = sparks.length - 1; i >= 0; i--) {
        const spark = sparks[i];
        spark.age += dt;
        if (spark.age > spark.life) {
          sparks.splice(i, 1);
          continue;
        }
        spark.vy -= 0.00012 * dt;
        spark.vx += (Math.random() - 0.5) * 0.004 * dt;
        spark.x += spark.vx * dt;
        spark.y += spark.vy * dt;
        const fade = 1 - spark.age / spark.life;
        ink.fillStyle = `hsl(${spark.hue} 100% 60% / ${fade * 0.2})`;
        ink.beginPath();
        ink.arc(spark.x, spark.y, spark.r * 2.6, 0, 2 * Math.PI);
        ink.fill();
        ink.fillStyle = `hsl(${spark.hue + 14} 100% 76% / ${fade * 0.9})`;
        ink.beginPath();
        ink.arc(spark.x, spark.y, spark.r, 0, 2 * Math.PI);
        ink.fill();
      }
    };

    // Draw the map while the reader looks at the cover, not when they click,
    // and run the filter for a moment (at the start line, where it changes
    // nothing) so the browser has it ready.
    setTimeout(() => {
      if (map || opened) return;
      drawMap();
      burnTo(FROM);
      opening.classList.add("is-burning");
      requestAnimationFrame(() =>
        requestAnimationFrame(() => {
          if (!opened) opening.classList.remove("is-burning");
        }),
      );
    }, 2600);

    let opened = false;
    const open = () => {
      if (opened) return;
      opened = true;
      try {
        sessionStorage.setItem("opened", "1");
      } catch {}

      let finished = false;
      const finish = () => {
        if (finished) return;
        finished = true;
        opening.classList.add("is-done");
        setTimeout(() => {
          opening.remove();
          root.classList.remove("closed");
          behind.forEach((element) => (element.inert = false));
          document.querySelector(".name")?.focus({ preventScroll: true });
        }, 400);
      };

      // The seal cracks and its halves fall away (main.css).
      opening.classList.add("is-opening");

      // For anyone who asked for less motion, the cover simply fades.
      if (calm.matches || !mapImage || !line) {
        setTimeout(finish, 60);
        return;
      }

      // Then the cover catches where the seal was.
      if (!map || map.drawnFor !== layout()) drawMap();
      burnTo(FROM);
      const scale = Math.min(devicePixelRatio || 1, 2);
      embers.width = innerWidth * scale;
      embers.height = innerHeight * scale;
      ink.scale(scale, scale);

      setTimeout(() => {
        opening.classList.add("is-burning");
        let start;
        let last;
        const frame = (now) => {
          try {
            start ??= now;
            const dt = Math.min(now - (last ?? now - 16), 50);
            last = now;
            // Slow to catch, then quicker, as fire is.
            const progress = Math.min(1, (now - start) / BURN);
            const t = FROM + (TO - FROM) * progress ** 1.4;
            burnTo(t);
            ink.clearRect(0, 0, innerWidth, innerHeight);
            paintFire(t);
            kindle(t, dt);
            drawSparks(dt);
            if (progress < 1) requestAnimationFrame(frame);
            else finish();
          } catch {
            finish();
          }
        };
        requestAnimationFrame(frame);
      }, 220);

      // Whatever happens, the book never stays shut.
      setTimeout(finish, 220 + BURN + 1500);
    };

    opening.addEventListener("click", open);
    document.addEventListener("keydown", (event) => {
      if (event.key === "Escape") open();
    });
  } else if (opening) {
    opening.remove();
  }

  /* --- Daylight / candlelight -------------------------------------------- */
  /* The choice is remembered. The tiny script in each page's <head> applies
     it before anything is drawn, so the page never flashes the wrong way.   */

  const themeColor = document.querySelector('meta[name="theme-color"]');
  const paintBrowserChrome = () => {
    if (themeColor) {
      themeColor.content = getComputedStyle(root).getPropertyValue("--paper").trim();
    }
  };
  paintBrowserChrome();

  for (const button of document.querySelectorAll("[data-mode-toggle]")) {
    button.addEventListener("click", () => {
      const next = root.dataset.mode === "light" ? "dark" : "light";
      root.dataset.mode = next;
      try {
        localStorage.setItem("mode", next);
      } catch {}
      paintBrowserChrome();
    });
  }

  /* --- The stretch --------------------------------------------------------- */
  /* While the window is being resized, the page is pulled sideways by however
     far the edge has moved. Stop, and it springs back (the spring itself is
     the transition on .book in main.css).                                    */

  const book = document.querySelector(".book");
  const printing = matchMedia("print");
  const mouse = matchMedia("(pointer: fine)");
  if (book && "ResizeObserver" in window) {
    let from = root.clientWidth;
    let settle;

    new ResizeObserver(() => {
      const width = root.clientWidth;
      // Printing re-lays the page at paper width, and some tools briefly
      // report a width of zero. Neither is someone pulling on the window.
      if (!width || printing.matches || width === from) return;
      // Nor is a phone or tablet being turned sideways: there is no window
      // edge to pull on a touch screen.
      if (calm.matches || !mouse.matches) {
        from = width;
        return;
      }

      const pulled = 1 + (width - from) / book.offsetWidth;
      const stretch = Math.min(3, Math.max(0.25, pulled));
      book.classList.add("is-pulled");
      book.style.setProperty("--stretch", stretch.toFixed(4));

      clearTimeout(settle);
      settle = setTimeout(() => {
        from = root.clientWidth;
        book.classList.remove("is-pulled");
        book.style.setProperty("--stretch", "1");
      }, 180);
    }).observe(root);
  }

  /* --- The drop box (contact page) ----------------------------------------- */
  /* Sends a message to api/drop.js, which relays it to my Discord. The
     replies it can show are written on the form (data-success, data-failure,
     data-offline). Without this script the form still posts, and the
     function sends the reader back here with ?sent or ?unsent.            */

  const drop = document.querySelector("[data-dropbox]");
  if (drop) {
    const message = drop.querySelector("#drop-message");
    const status = drop.querySelector("[data-status]");
    const button = drop.querySelector('button[type="submit"]');
    const openedAt = Date.now();

    const outcome = new URLSearchParams(location.search);
    if (outcome.has("sent")) status.textContent = drop.dataset.success;
    if (outcome.has("unsent")) status.textContent = drop.dataset.failure;

    drop.addEventListener("submit", async (event) => {
      event.preventDefault();
      if (!message.value.trim()) {
        status.textContent = "Write a message first.";
        message.focus();
        return;
      }

      button.disabled = true;
      status.textContent = "Sending…";
      try {
        const response = await fetch(drop.action, {
          method: "POST",
          headers: { "Content-Type": "application/json", Accept: "application/json" },
          body: JSON.stringify({ ...Object.fromEntries(new FormData(drop)), elapsed: Date.now() - openedAt }),
        });
        const result = await response.json().catch(() => ({}));
        if (!response.ok || !result.ok) throw new Error(result.error ?? String(response.status));
        drop.reset();
        status.textContent = drop.dataset.success;
      } catch (error) {
        status.textContent = error.message === "not-configured" ? drop.dataset.offline : drop.dataset.failure;
      } finally {
        button.disabled = false;
      }
    });
  }
})();
