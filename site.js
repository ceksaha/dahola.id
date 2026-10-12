(() => {
  const make = (tag, className, text) => {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (text !== undefined) node.textContent = text;
    return node;
  };

  const setText = (node, text) => {
    if (node && typeof text === "string") node.textContent = text;
  };

  const safeHref = (value) => {
    if (typeof value !== "string") return "#kontak";
    const href = value.trim();
    if (/^#[a-z0-9_-]+$/i.test(href) || /^\/(?!\/)/.test(href)) return href;
    if (/^(https?:|mailto:|tel:)/i.test(href)) return href;
    return "#kontak";
  };

  const setLink = (node, link) => {
    if (!node || !link) return;
    node.textContent = link.label || "";
    node.href = safeHref(link.href);
    if (/^https?:/i.test(node.href)) {
      node.target = "_blank";
      node.rel = "noopener noreferrer";
    } else {
      node.removeAttribute("target");
      node.removeAttribute("rel");
    }
  };

  const button = (link, className) => {
    const node = make("a", className);
    setLink(node, link);
    return node;
  };

  const validImagePath = (path) =>
    typeof path === "string" &&
    /^(\/?assets\/)(?!.*(?:^|\/)\.\.(?:\/|$))[^?#]+$/.test(path);

  const renderCards = (container, items, includeLabel) => {
    if (!container || !Array.isArray(items)) return;
    const cards = items.map((item) => {
      const card = make("article", "card");
      if (includeLabel) card.append(make("span", "tag", item.label));
      card.append(make("h3", "", item.title));
      card.append(make("p", "", item.description));
      return card;
    });
    container.replaceChildren(...cards);
  };

  const requireSiteData = (data) => {
    const required = [
      "siteTitle", "metaDescription", "brand", "navigation", "headerCta",
      "hero", "problem", "features", "gallery", "pricing", "segments",
      "productInfo", "faq", "contact", "footer"
    ];
    if (!data || required.some((key) => !(key in data))) {
      throw new Error("File data/site.json tidak lengkap.");
    }
  };

  const render = (data) => {
    requireSiteData(data);
    document.title = data.siteTitle;
    const description = document.querySelector('meta[name="description"]');
    if (description) description.content = data.metaDescription;

    setText(document.querySelector(".logo"), data.brand);
    const navigation = document.querySelector(".links");
    if (navigation) {
      navigation.replaceChildren(...data.navigation.map((item) => {
        const link = make("a", "", item.label);
        link.href = safeHref(item.href);
        return link;
      }));
    }
    setLink(document.querySelector(".nav > .btn"), data.headerCta);

    const hero = document.querySelector(".hero");
    const heroCopy = hero && hero.children[0];
    if (heroCopy) {
      setText(heroCopy.querySelector(".eyebrow"), data.hero.eyebrow);
      setText(heroCopy.querySelector("h1"), data.hero.title);
      setText(heroCopy.querySelector(".lead"), data.hero.description);
      setText(heroCopy.querySelector(".price b"), data.hero.price);
      setText(heroCopy.querySelector(".price span"), data.hero.priceNote);
      const actions = heroCopy.querySelector(".row");
      if (actions) {
        actions.replaceChildren(
          button(data.hero.primaryCta, "btn cta"),
          button(data.hero.secondaryCta, "btn ghost")
        );
      }
      const highlights = heroCopy.querySelector(".trust-row");
      if (highlights && Array.isArray(data.hero.highlights)) {
        highlights.replaceChildren(...data.hero.highlights.map((item) => make("span", "trust-item", item)));
      }
    }
    const heroImage = document.querySelector(".hero-visual img");
    if (heroImage && validImagePath(data.hero.image)) {
      heroImage.src = data.hero.image;
      heroImage.alt = data.hero.imageAlt || "";
    }

    const problem = document.querySelector("#problem");
    setText(problem && problem.querySelector("h2"), data.problem.title);
    setText(problem && problem.querySelector(".lead"), data.problem.description);
    renderCards(problem && problem.querySelector(".grid"), data.problem.cards, true);

    const features = document.querySelector("#fitur");
    setText(features && features.querySelector("h2"), data.features.title);
    setText(features && features.querySelector(".lead"), data.features.description);
    renderCards(features && features.querySelector(".grid"), data.features.items, false);

    const gallery = document.querySelector("#galeri");
    setText(gallery && gallery.querySelector("h2"), data.gallery.title);
    const galleryGrid = gallery && gallery.querySelector(".grid");
    if (galleryGrid && Array.isArray(data.gallery.images)) {
      galleryGrid.replaceChildren(...data.gallery.images.filter((image) => validImagePath(image.src)).map((image) => {
        const frame = make("div", "gallery-card");
        const img = make("img");
        img.src = image.src;
        img.alt = image.alt || "";
        img.loading = "lazy";
        frame.append(img);
        return frame;
      }));
    }
    setText(gallery && gallery.querySelector(".demo-card h3"), data.gallery.demoTitle);
    setText(gallery && gallery.querySelector(".demo-card p"), data.gallery.demoDescription);
    setLink(gallery && gallery.querySelector(".demo-card .btn"), data.gallery.demoCta);

    const pricing = document.querySelector("#harga");
    setText(pricing && pricing.querySelector("h2"), data.pricing.title);
    setText(pricing && pricing.querySelector(".lead"), data.pricing.description);
    setText(pricing && pricing.querySelector(".pricebox h3"), data.pricing.productName);
    setText(pricing && pricing.querySelector(".pricebox > b"), data.pricing.price);
    const priceDetails = pricing && pricing.querySelector(".pricebox ul");
    if (priceDetails && Array.isArray(data.pricing.details)) {
      priceDetails.replaceChildren(...data.pricing.details.map((item) => make("li", "", item)));
    }
    const priceActions = pricing && pricing.querySelector(".pricebox .row");
    if (priceActions) {
      priceActions.replaceChildren(
        button(data.pricing.primaryCta, "btn cta"),
        button(data.pricing.secondaryCta, "btn ghost")
      );
    }

    const segments = document.querySelector("#segmen");
    setText(segments && segments.querySelector("h2"), data.segments.title);
    renderCards(segments && segments.querySelector(".grid"), data.segments.items, true);

    const productInfo = document.querySelector("#info");
    setText(productInfo && productInfo.querySelector("h2"), data.productInfo.title);
    const infoBody = productInfo && productInfo.querySelector("tbody");
    if (infoBody && Array.isArray(data.productInfo.rows)) {
      infoBody.replaceChildren(...data.productInfo.rows.map((item) => {
        const row = make("tr");
        row.append(make("td", "", item.label), make("td", "", item.detail));
        return row;
      }));
    }
    setText(productInfo && productInfo.querySelector(".spec-note"), data.productInfo.note);

    const faq = document.querySelector("#faq");
    setText(faq && faq.querySelector("h2"), data.faq.title);
    if (faq && Array.isArray(data.faq.items)) {
      faq.querySelectorAll("details").forEach((item) => item.remove());
      faq.append(...data.faq.items.map((item) => {
        const details = make("details");
        details.append(make("summary", "", item.question), make("p", "", item.answer));
        return details;
      }));
    }

    const contact = document.querySelector("#kontak");
    setText(contact && contact.querySelector("h2"), data.contact.title);
    setText(contact && contact.querySelector("p"), data.contact.description);
    const contactActions = contact && contact.querySelector(".row");
    if (contactActions) {
      contactActions.replaceChildren(
        button(data.contact.primaryCta, "btn cta"),
        button(data.contact.secondaryCta, "btn ghost")
      );
    }

    const footer = document.querySelector(".foot .w");
    if (footer) {
      const copyright = make("span", "", `© ${data.footer.copyright}`);
      const contacts = make("span");
      contacts.append(document.createTextNode("Email: "));
      const email = make("a", "", data.footer.email);
      email.href = `mailto:${data.footer.email}`;
      contacts.append(email, document.createTextNode(" · WhatsApp: "));
      const whatsapp = make("a", "", data.footer.whatsappLabel);
      whatsapp.href = safeHref(data.footer.whatsappHref);
      if (/^https?:/i.test(whatsapp.href)) {
        whatsapp.target = "_blank";
        whatsapp.rel = "noopener noreferrer";
      }
      contacts.append(whatsapp);
      footer.replaceChildren(copyright, contacts);
    }
  };

  fetch("data/site.json")
    .then((response) => {
      if (!response.ok) throw new Error(`Gagal memuat konten website (HTTP ${response.status}).`);
      return response.json();
    })
    .then(render)
    .catch((error) => {
      console.error("Konten Dahola gagal dimuat:", error);
      const alert = make("p", "load-error", "Konten terbaru gagal dimuat. Silakan muat ulang halaman atau hubungi tim Dahola.");
      alert.setAttribute("role", "alert");
      document.body.prepend(alert);
    });
})();
