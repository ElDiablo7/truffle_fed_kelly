"use client";

import { FormEvent, useState } from "react";
import Image from "next/image";

const navigation = [
  ["The House", "#house"],
  ["Caviar", "#caviar"],
  ["Skin Ritual", "#skin-ritual"],
  ["Our Method", "#method"],
  ["Contact", "#contact"],
];

const faqs = [
  {
    question: "What is snail caviar?",
    answer:
      "Snail caviar, also known as escargot caviar or escargot pearls, is the roe of land snails. It is prized as a rare culinary speciality with a firm pearl and distinctive woodland character.",
  },
  {
    question: "What does truffle-fed mean?",
    answer:
      "Truffle is a defining part of the snails’ feed and the idea at the heart of the house. Final ingredients, tasting notes and provenance information will be supplied with each released product.",
  },
  {
    question: "Are the caviar and face mask the same product?",
    answer:
      "No. They are two separate collections from one truffle-fed concept: a culinary escargot-caviar collection and a snail-derived skincare ritual. Each will have its own ingredients, directions and product information.",
  },
  {
    question: "Can chefs, retailers and beauty professionals enquire?",
    answer:
      "Yes. Use the enquiry form and select your area of interest. Private tasting, trade, retail, spa, collaboration and press enquiries are welcome.",
  },
];

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [formState, setFormState] = useState<
    "idle" | "sending" | "success" | "error"
  >("idle");

  async function submitEnquiry(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFormState("sending");
    const form = event.currentTarget;
    const data = new FormData(form);

    try {
      const response = await fetch("/api/enquiries", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(Object.fromEntries(data.entries())),
      });

      if (!response.ok) throw new Error("Unable to send enquiry");
      form.reset();
      setFormState("success");
    } catch {
      setFormState("error");
    }
  }

  return (
    <main>
      <a className="skip-link" href="#content">
        Skip to content
      </a>

      <div className="announcement">
        <span>Private launch</span>
        <p>Chef, retail, skincare and press enquiries now open</p>
      </div>

      <header className="site-header">
        <a className="wordmark" href="#top" aria-label="Truffle Fed home">
          <span className="wordmark-crown" aria-hidden="true">♛</span>
          <span>TRUFFLE FED</span>
          <small>BY KELLY STOPHER</small>
        </a>

        <nav className={menuOpen ? "nav open" : "nav"} aria-label="Main navigation">
          {navigation.map(([label, href]) => (
            <a key={href} href={href} onClick={() => setMenuOpen(false)}>
              {label}
            </a>
          ))}
        </nav>

        <a className="header-cta" href="#contact">
          Enquire
        </a>
        <button
          className="menu-button"
          type="button"
          aria-label="Toggle navigation"
          aria-expanded={menuOpen}
          onClick={() => setMenuOpen((open) => !open)}
        >
          <span />
          <span />
        </button>
      </header>

      <section className="hero" id="top">
        <div className="hero-glow" aria-hidden="true" />
        <div className="hero-copy" id="content">
          <p className="eyebrow">A RARE NEW LUXURY HOUSE</p>
          <h1>
            Born from truffle.
            <span>Crafted into rarity.</span>
          </h1>
          <p className="hero-intro">
            Truffle-fed snail caviar and a refined snail-derived skincare ritual,
            created by Kelly Stopher for those drawn to the genuinely uncommon.
          </p>
          <div className="hero-actions">
            <a className="button button-gold" href="#house">
              Discover the house
            </a>
            <a className="text-link" href="#contact">
              Make an enquiry <span aria-hidden="true">↗</span>
            </a>
          </div>
          <div className="hero-notes" aria-label="Brand highlights">
            <span>Truffle-fed</span>
            <span>Two collections</span>
            <span>Private launch</span>
          </div>
        </div>

        <div className="hero-visual" aria-label="Émeraude Noire by Kelly Stopher">
          <div className="orbit orbit-one" aria-hidden="true" />
          <div className="orbit orbit-two" aria-hidden="true" />
          <Image
            src="/assets/emeraude-noire.webp"
            width="1120"
            height="1400"
            alt="Truffle Fed Émeraude Noire luxury escargot caviar emblem by Kelly Stopher"
            priority
            unoptimized
            sizes="(max-width: 820px) 76vw, 36vw"
          />
          <p className="hero-caption">ÉMERAUDE NOIRE · CAVIAR D’ESCARGOT DE LUXE</p>
        </div>

        <a className="scroll-cue" href="#house" aria-label="Scroll to the house story">
          <span />
          Explore
        </a>
      </section>

      <section className="intro-section" id="house">
        <div className="section-number">01</div>
        <div className="intro-heading">
          <p className="eyebrow">THE HOUSE</p>
          <h2>One extraordinary source.<br />Two expressions of luxury.</h2>
        </div>
        <div className="intro-copy">
          <p>
            Truffle Fed begins with a singular idea: make the snail’s truffle-led
            diet the origin story of an entirely new luxury house.
          </p>
          <p>
            Kelly’s culinary collection celebrates rare escargot pearls. The skin
            ritual explores snail-derived skincare in an elevated face-mask format.
            Different experiences, connected by one unmistakable signature.
          </p>
        </div>
      </section>

      <section className="collection-section" id="caviar">
        <div className="collection-copy">
          <p className="eyebrow">THE CAVIAR COLLECTION</p>
          <h2>Pearls of the earth,<br />reimagined.</h2>
          <p className="lead">
            Escargot caviar is one of gastronomy’s rarest conversations: luminous
            pearls with a firm pop and an evocative woodland character.
          </p>
          <ul className="feature-list">
            <li><span>01</span> Truffle-fed origin story</li>
            <li><span>02</span> Created for private tables and professional kitchens</li>
            <li><span>03</span> Product-specific provenance and serving information</li>
          </ul>
          <a className="button button-outline" href="#contact">
            Request a tasting enquiry
          </a>
        </div>

        <div className="product-stage">
          <div className="product-card product-card-front">
            <Image
              src="/assets/white-gold-escargot.webp"
              width="1100"
              height="1100"
              alt="White Gold Escargot Elite snail caviar emblem"
              unoptimized
              sizes="(max-width: 560px) 72vw, (max-width: 820px) 62vw, 31vw"
            />
          </div>
          <div className="product-card product-card-back">
            <Image
              src="/assets/emeraude-noire.webp"
              width="1120"
              height="1400"
              alt="Émeraude Noire luxury escargot caviar emblem"
              unoptimized
              sizes="(max-width: 560px) 48vw, (max-width: 820px) 48vw, 25vw"
            />
          </div>
          <div className="stage-label">
            <span>01</span>
            <p>WHITE GOLD<br />&amp; ÉMERAUDE NOIRE</p>
          </div>
        </div>
      </section>

      <section className="ritual-section" id="skin-ritual">
        <div className="ritual-art" aria-hidden="true">
          <div className="mask-shape">
            <i className="eye eye-left" />
            <i className="eye eye-right" />
            <i className="mouth" />
          </div>
          <div className="pearl pearl-one" />
          <div className="pearl pearl-two" />
          <div className="pearl pearl-three" />
          <div className="ritual-seal">TF<br /><span>SKIN</span></div>
        </div>

        <div className="ritual-copy">
          <p className="eyebrow">THE SKIN RITUAL</p>
          <h2>The rare source,<br />beyond the table.</h2>
          <p className="lead">
            A face-mask concept built around a snail-derived skincare ritual,
            presented with the same black, gold and emerald codes as the culinary
            collection.
          </p>
          <div className="ritual-points">
            <article>
              <span>01</span>
              <h3>A considered ritual</h3>
              <p>Designed as a moment of high-end, at-home care rather than an everyday commodity.</p>
            </article>
            <article>
              <span>02</span>
              <h3>Clear product detail</h3>
              <p>Final formula, directions, suitability and full ingredient information will accompany release.</p>
            </article>
          </div>
          <a className="text-link light" href="#contact">
            Register skincare interest <span aria-hidden="true">↗</span>
          </a>
        </div>
      </section>

      <section className="method-section" id="method">
        <div className="method-heading">
          <p className="eyebrow">THE SIGNATURE</p>
          <h2>Truffle is not the garnish.<br /><em>It is the beginning.</em></h2>
        </div>

        <div className="method-grid">
          <article>
            <span className="method-index">01</span>
            <h3>Feed</h3>
            <p>Truffle sits at the heart of the snails’ feeding story and the identity of the house.</p>
          </article>
          <article>
            <span className="method-index">02</span>
            <h3>Separate</h3>
            <p>Culinary and skincare collections remain clearly distinct, with information specific to each use.</p>
          </article>
          <article>
            <span className="method-index">03</span>
            <h3>Finish</h3>
            <p>Black, ivory, emerald and gold turn every touchpoint into a recognisable Kelly Stopher signature.</p>
          </article>
        </div>
      </section>

      <section className="audience-band" aria-label="Enquiry types">
        <p>PRIVATE CLIENTS</p><i />
        <p>CHEFS</p><i />
        <p>RETAILERS</p><i />
        <p>SPAS</p><i />
        <p>PRESS</p>
      </section>

      <section className="faq-section" id="faq">
        <div>
          <p className="eyebrow">QUESTIONS, ANSWERED</p>
          <h2>The essentials.</h2>
          <p className="faq-intro">For product, launch, trade or collaboration details, speak directly with the house.</p>
        </div>
        <div className="faq-list">
          {faqs.map((faq, index) => (
            <details key={faq.question}>
              <summary>
                <span>{String(index + 1).padStart(2, "0")}</span>
                {faq.question}
                <i aria-hidden="true">+</i>
              </summary>
              <p>{faq.answer}</p>
            </details>
          ))}
        </div>
      </section>

      <section className="contact-section" id="contact">
        <div className="contact-copy">
          <p className="eyebrow">PRIVATE ENQUIRIES</p>
          <h2>Enter the world<br />of Truffle Fed.</h2>
          <p>
            Tell Kelly whether you are interested in caviar, the skincare ritual,
            trade supply or a creative collaboration.
          </p>
          <div className="contact-monogram" aria-hidden="true">TF</div>
        </div>

        <form className="enquiry-form" onSubmit={submitEnquiry}>
          <div className="form-row">
            <label>
              Your name
              <input type="text" name="name" autoComplete="name" required maxLength={80} />
            </label>
            <label>
              Email address
              <input type="email" name="email" autoComplete="email" required maxLength={160} />
            </label>
          </div>
          <div className="form-row">
            <label>
              I am enquiring as
              <select name="enquirerType" defaultValue="private">
                <option value="private">Private client</option>
                <option value="chef">Chef / hospitality</option>
                <option value="retail">Retail / wholesale</option>
                <option value="spa">Spa / beauty professional</option>
                <option value="press">Press / media</option>
                <option value="other">Other</option>
              </select>
            </label>
            <label>
              Area of interest
              <select name="interest" defaultValue="both">
                <option value="both">Both collections</option>
                <option value="caviar">Snail caviar</option>
                <option value="skincare">Face mask / skincare</option>
                <option value="other">Collaboration / other</option>
              </select>
            </label>
          </div>
          <label>
            Your message
            <textarea name="message" rows={5} required maxLength={2000} placeholder="Tell us a little about your enquiry…" />
          </label>
          <label className="honeypot" aria-hidden="true">
            Website
            <input type="text" name="website" tabIndex={-1} autoComplete="off" />
          </label>
          <label className="consent">
            <input type="checkbox" name="consent" value="true" required />
            <span>I agree that my details may be used to respond to this enquiry.</span>
          </label>
          <div className="form-footer">
            <button className="button button-gold" type="submit" disabled={formState === "sending"}>
              {formState === "sending" ? "Sending…" : "Send private enquiry"}
            </button>
            <p className={`form-status ${formState}`} role="status" aria-live="polite">
              {formState === "success" && "Thank you. Your enquiry has been received."}
              {formState === "error" && "We couldn’t send that just now. Please try again."}
            </p>
          </div>
        </form>
      </section>

      <footer>
        <a className="wordmark footer-wordmark" href="#top">
          <span>TRUFFLE FED</span>
          <small>BY KELLY STOPHER</small>
        </a>
        <p>Truffle-fed snail caviar &amp; luxury skincare ritual</p>
        <nav aria-label="Footer navigation">
          <a href="#caviar">Caviar</a>
          <a href="#skin-ritual">Skin ritual</a>
          <a href="#faq">FAQ</a>
          <a href="#contact">Contact</a>
        </nav>
        <small>© {new Date().getFullYear()} Kelly Stopher. All rights reserved.</small>
      </footer>
    </main>
  );
}
